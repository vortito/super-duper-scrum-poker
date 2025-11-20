export type Vote = number | '?' | null;

export interface Player {
    id: string;
    name: string;
    vote: Vote;
}

export interface Session {
    id: string;
    revealed: boolean;
    average: number | null;
    players: Player[];
    createdAt: number;
}

export interface SessionContextType {
    session: Session | null;
    currentUser: Player | null;
    loading: boolean;
    error: string | null;
    createSession: (playerName: string) => Promise<string>;
    joinSession: (sessionId: string, playerName: string) => Promise<void>;
    submitVote: (vote: Vote) => Promise<void>;
    revealVotes: () => Promise<void>;
    resetSession: () => Promise<void>;
    leaveSession: () => void;
}
