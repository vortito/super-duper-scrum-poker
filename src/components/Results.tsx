import React from 'react';
import { useSession } from '../context/SessionContext';

export const Results: React.FC = () => {
    const { session } = useSession();

    if (!session?.revealed || !session.average) return null;

    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20 animate-fade-in">
            <div className="bg-ink-800/90 backdrop-blur-xl p-8 rounded-2xl border border-accent/30 shadow-2xl">
                <h2 className="text-ink-400 text-sm uppercase tracking-wider mb-2">Promedio</h2>
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-soft to-accent-secondary">
                    {session.average}
                </div>
                <div className="mt-4 text-xs text-ink-500">
                    Basado en {session.players.filter(p => typeof p.vote === 'number').length} votos
                </div>
            </div>
        </div>
    );
};
