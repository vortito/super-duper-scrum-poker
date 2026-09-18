import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import {
    doc,
    setDoc,
    updateDoc,
    onSnapshot,
    getDoc,
    arrayUnion,
    serverTimestamp,
    Timestamp,
    deleteDoc
} from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../services/firebase';
import { Session, Player, Vote, SessionContextType } from '../types';
import { useLanguage } from './LanguageContext';

const SESSION_ID_KEY = 'scrum_poker_session_id';
const USER_ID_KEY = 'scrum_poker_user_id';
export const USER_NAME_KEY = 'scrum_poker_user_name';
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000;

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};

const ensureSignedIn = async (): Promise<string> => {
    const user = auth.currentUser ?? (await signInAnonymously(auth)).user;
    return user.uid;
};

const getCreatedMillis = (createdAt: Session['createdAt'], now: number): number => {
    if (typeof createdAt === 'number') return createdAt;
    if (createdAt instanceof Timestamp) return createdAt.toMillis();
    return now;
};

interface SessionProviderProps {
    children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [currentUser, setCurrentUser] = useState<Player | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const unsubscribeRef = useRef<(() => void) | null>(null);
    const { t } = useLanguage();

    const stopSubscription = () => {
        unsubscribeRef.current?.();
        unsubscribeRef.current = null;
    };

    const clearStoredSession = () => {
        localStorage.removeItem(SESSION_ID_KEY);
        localStorage.removeItem(USER_ID_KEY);
    };

    const subscribeToSession = (sessionId: string) => {
        stopSubscription();
        setLoading(true);
        const sessionRef = doc(db, 'sessions', sessionId);

        unsubscribeRef.current = onSnapshot(
            sessionRef,
            (docSnap) => {
                setLoading(false);

                if (!docSnap.exists()) {
                    stopSubscription();
                    clearStoredSession();
                    setSession(null);
                    setError(t('errors.sessionNotFound'));
                    return;
                }

                const sessionData = docSnap.data() as Session;
                const now = Date.now();

                if (now - getCreatedMillis(sessionData.createdAt, now) > SESSION_EXPIRY_MS) {
                    deleteDoc(sessionRef).catch((err) => console.error('Error deleting expired session:', err));
                    stopSubscription();
                    clearStoredSession();
                    setSession(null);
                    setError(t('errors.sessionExpired'));
                    return;
                }

                setSession(sessionData);

                const uid = auth.currentUser?.uid;
                const playerInSession = uid ? sessionData.players.find((p) => p.id === uid) : undefined;
                if (playerInSession) {
                    setCurrentUser(playerInSession);
                }
            },
            (err) => {
                console.error('Session subscription error:', err);
                setError(err.message);
                setLoading(false);
            }
        );
    };

    const subscribeToSessionRef = useRef(subscribeToSession);
    subscribeToSessionRef.current = subscribeToSession;

    useEffect(() => {
        const storedSessionId = localStorage.getItem(SESSION_ID_KEY);
        const storedUserId = localStorage.getItem(USER_ID_KEY);
        const storedUserName = localStorage.getItem(USER_NAME_KEY);

        if (!storedSessionId || !storedUserId || !storedUserName) {
            return;
        }

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user?.uid !== storedUserId) {
                return;
            }
            setCurrentUser({ id: storedUserId, name: storedUserName, vote: null });
            subscribeToSessionRef.current(storedSessionId);
        });

        return unsubscribeAuth;
    }, []);

    const createSession = async (playerName: string): Promise<string> => {
        setLoading(true);
        setError(null);
        try {
            const userId = await ensureSignedIn();
            const sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();

            const newPlayer: Player = { id: userId, name: playerName, vote: null };
            const newSession: Session = {
                id: sessionId,
                revealed: false,
                average: null,
                players: [newPlayer],
                createdAt: serverTimestamp()
            };

            await setDoc(doc(db, 'sessions', sessionId), newSession);

            setCurrentUser(newPlayer);
            localStorage.setItem(SESSION_ID_KEY, sessionId);
            localStorage.setItem(USER_ID_KEY, userId);
            localStorage.setItem(USER_NAME_KEY, playerName);

            subscribeToSession(sessionId);
            return sessionId;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setLoading(false);
            throw err;
        }
    };

    const joinSession = async (sessionId: string, playerName: string): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const userId = await ensureSignedIn();

            const sessionRef = doc(db, 'sessions', sessionId);
            const sessionSnap = await getDoc(sessionRef);

            if (!sessionSnap.exists()) {
                throw new Error(t('errors.sessionNotFound'));
            }

            const sessionData = sessionSnap.data() as Session;
            const existingPlayer = sessionData.players.find((p) => p.id === userId);
            const player: Player = existingPlayer ?? { id: userId, name: playerName, vote: null };

            if (!existingPlayer) {
                await updateDoc(sessionRef, {
                    players: arrayUnion(player)
                });
            }

            setCurrentUser(player);
            localStorage.setItem(SESSION_ID_KEY, sessionId);
            localStorage.setItem(USER_ID_KEY, userId);
            localStorage.setItem(USER_NAME_KEY, playerName);

            subscribeToSession(sessionId);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setLoading(false);
            throw err;
        }
    };

    const checkSessionExists = async (sessionId: string): Promise<void> => {
        try {
            await ensureSignedIn();
            const sessionSnap = await getDoc(doc(db, 'sessions', sessionId));
            if (!sessionSnap.exists()) {
                setError(t('errors.sessionNotFound'));
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    const submitVote = async (vote: Vote) => {
        if (!session || !currentUser) return;

        const updatedPlayers = session.players.map((p) => (p.id === currentUser.id ? { ...p, vote } : p));

        await updateDoc(doc(db, 'sessions', session.id), {
            players: updatedPlayers
        });
    };

    const revealVotes = async () => {
        if (!session) return;

        const validVotes = session.players
            .map((p) => p.vote)
            .filter((v): v is number => typeof v === 'number');
        const average = validVotes.length > 0
            ? Number((validVotes.reduce((a, b) => a + b, 0) / validVotes.length).toFixed(1))
            : null;

        await updateDoc(doc(db, 'sessions', session.id), {
            revealed: true,
            average
        });
    };

    const resetSession = async () => {
        if (!session) return;

        const resetPlayers = session.players.map((p) => ({ ...p, vote: null }));

        await updateDoc(doc(db, 'sessions', session.id), {
            revealed: false,
            average: null,
            players: resetPlayers
        });
    };

    const leaveSession = () => {
        stopSubscription();
        clearStoredSession();
        setSession(null);
        setCurrentUser(null);
    };

    return (
        <SessionContext.Provider value={{
            session,
            currentUser,
            loading,
            error,
            createSession,
            joinSession,
            checkSessionExists,
            submitVote,
            revealVotes,
            resetSession,
            leaveSession
        }}>
            {children}
        </SessionContext.Provider>
    );
};
