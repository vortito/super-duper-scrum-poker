import type { FieldValue, Timestamp } from 'firebase/firestore';

export type Vote = number | '?' | null;

export type Language = 'es' | 'en' | 'fr';

export type ThemeMode = 'dark' | 'light';

export interface PlayerTheme {
    mode: ThemeMode;
    accent: string;
}

export interface Player {
    id: string;
    name: string;
    vote: Vote;
    theme?: PlayerTheme;
}

export interface Session {
    id: string;
    revealed: boolean;
    average: number | null;
    players: Player[];
    createdAt: number | Timestamp | FieldValue | null;
}

export interface SessionContextType {
    session: Session | null;
    currentUser: Player | null;
    loading: boolean;
    error: string | null;
    createSession: (playerName: string) => Promise<string>;
    joinSession: (sessionId: string, playerName: string) => Promise<void>;
    checkSessionExists: (sessionId: string) => Promise<void>;
    submitVote: (vote: Vote) => Promise<void>;
    setPlayerTheme: (theme: PlayerTheme) => Promise<void>;
    revealVotes: () => Promise<void>;
    resetSession: () => Promise<void>;
    leaveSession: () => void;
}
