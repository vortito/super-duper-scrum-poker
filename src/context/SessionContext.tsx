import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../services/firebase';
import { Session, Player, Vote, SessionContextType } from '../types';

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};

interface SessionProviderProps {
    children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [currentUser, setCurrentUser] = useState<Player | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Persist user session locally
    useEffect(() => {
        const storedSessionId = localStorage.getItem('scrum_poker_session_id');
        const storedUserId = localStorage.getItem('scrum_poker_user_id');
        const storedUserName = localStorage.getItem('scrum_poker_user_name');

        if (storedSessionId && storedUserId && storedUserName) {
            // Attempt to reconnect
            // We need to ensure auth is ready first, which is handled by the auth listener or just calling signInAnonymously
            signInAnonymously(auth).then((userCredential) => {
                // If the stored user ID matches the auth user (or we just trust the auth user)
                // Ideally we use the auth.currentUser.uid as the player ID
                if (userCredential.user.uid === storedUserId) {
                    setCurrentUser({ id: storedUserId, name: storedUserName, vote: null });
                    subscribeToSession(storedSessionId);
                }
            }).catch(err => console.error("Auto-reconnect failed", err));
        }
    }, []);

    const subscribeToSession = (sessionId: string) => {
        setLoading(true);
        const sessionRef = doc(db, 'sessions', sessionId);

        const unsubscribe = onSnapshot(sessionRef, (docSnap) => {
            setLoading(false);
            if (docSnap.exists()) {
                const sessionData = docSnap.data() as Session;

                // Check for expiration (24 hours)
                const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000;
                const now = Date.now();

                let createdMillis: number;
                if (typeof sessionData.createdAt === 'number') {
                    createdMillis = sessionData.createdAt;
                } else if (sessionData.createdAt instanceof Timestamp) {
                    createdMillis = sessionData.createdAt.toMillis();
                } else {
                    // Fallback for pending writes or missing timestamps
                    createdMillis = now;
                }

                if (now - createdMillis > SESSION_EXPIRY_MS) {
                    console.log("Session expired, deleting from Firestore...");
                    deleteDoc(sessionRef).catch(err => console.error("Error deleting expired session:", err));

                    setError('Session has expired');
                    setSession(null);
                    localStorage.removeItem('scrum_poker_session_id');
                    localStorage.removeItem('scrum_poker_user_id');
                    localStorage.removeItem('scrum_poker_user_name');
                    return;
                }

                setSession(sessionData);

                // Update current user state from the session data to keep sync
                if (auth.currentUser) {
                    const playerInSession = sessionData.players.find(p => p.id === auth.currentUser?.uid);
                    if (playerInSession) {
                        setCurrentUser(playerInSession);
                    }
                }
            } else {
                setError('Session not found');
                setSession(null);
                localStorage.removeItem('scrum_poker_session_id');
            }
        }, (err) => {
            console.error("Session subscription error:", err);
            setError(err.message);
            setLoading(false);
        });

        return unsubscribe;
    };

    const createSession = async (playerName: string): Promise<string> => {
        setLoading(true);
        setError(null);
        try {
            const userCredential = await signInAnonymously(auth);
            const userId = userCredential.user.uid;

            // Generate a simple 6-char ID for easier sharing
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
            localStorage.setItem('scrum_poker_session_id', sessionId);
            localStorage.setItem('scrum_poker_user_id', userId);
            localStorage.setItem('scrum_poker_user_name', playerName);

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
            const userCredential = await signInAnonymously(auth);
            const userId = userCredential.user.uid;

            const sessionRef = doc(db, 'sessions', sessionId);
            const sessionSnap = await getDoc(sessionRef);

            if (!sessionSnap.exists()) {
                throw new Error('Session not found');
            }

            const sessionData = sessionSnap.data() as Session;
            const existingPlayer = sessionData.players.find(p => p.id === userId);

            if (!existingPlayer) {
                const newPlayer: Player = { id: userId, name: playerName, vote: null };
                await updateDoc(sessionRef, {
                    players: arrayUnion(newPlayer)
                });
                setCurrentUser(newPlayer);
            } else {
                // If re-joining with same ID but maybe different name, update name? 
                // For now just assume re-join
                setCurrentUser(existingPlayer);
            }

            localStorage.setItem('scrum_poker_session_id', sessionId);
            localStorage.setItem('scrum_poker_user_id', userId);
            localStorage.setItem('scrum_poker_user_name', playerName);

            subscribeToSession(sessionId);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setLoading(false);
            throw err;
        }
    };

    const submitVote = async (vote: Vote) => {
        if (!session || !currentUser) return;

        const updatedPlayers = session.players.map(p =>
            p.id === currentUser.id ? { ...p, vote } : p
        );

        await updateDoc(doc(db, 'sessions', session.id), {
            players: updatedPlayers
        });
    };

    const revealVotes = async () => {
        if (!session) return;

        // Calculate average
        const validVotes = session.players
            .map(p => p.vote)
            .filter(v => typeof v === 'number') as number[];

        let average = null;
        if (validVotes.length > 0) {
            const sum = validVotes.reduce((a, b) => a + b, 0);
            average = Number((sum / validVotes.length).toFixed(1));
        }

        await updateDoc(doc(db, 'sessions', session.id), {
            revealed: true,
            average
        });
    };

    const resetSession = async () => {
        if (!session) return;

        const resetPlayers = session.players.map(p => ({ ...p, vote: null }));

        await updateDoc(doc(db, 'sessions', session.id), {
            revealed: false,
            average: null,
            players: resetPlayers
        });
    };

    const leaveSession = () => {
        setSession(null);
        setCurrentUser(null);
        localStorage.removeItem('scrum_poker_session_id');
        localStorage.removeItem('scrum_poker_user_id');
        localStorage.removeItem('scrum_poker_user_name');
        // Ideally remove player from DB too, but keeping it simple for now
    };

    return (
        <SessionContext.Provider value={{
            session,
            currentUser,
            loading,
            error,
            createSession,
            joinSession,
            submitVote,
            revealVotes,
            resetSession,
            leaveSession
        }}>
            {children}
        </SessionContext.Provider>
    );
};
