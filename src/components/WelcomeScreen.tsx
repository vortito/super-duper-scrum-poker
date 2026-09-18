import React, { useEffect, useRef, useState } from 'react';
import { useSession, USER_NAME_KEY } from '../context/SessionContext';
import { useLanguage } from '../context/LanguageContext';
import { Users, Play } from 'lucide-react';
import { getRoomIdFromPath } from '../utils/url';

export const WelcomeScreen: React.FC = () => {
    const { createSession, joinSession, checkSessionExists, loading, error } = useSession();
    const { t } = useLanguage();
    const [name, setName] = useState(() => localStorage.getItem(USER_NAME_KEY) || '');
    const [sessionId, setSessionId] = useState(() => getRoomIdFromPath() || '');
    const [mode, setMode] = useState<'create' | 'join'>(() => (getRoomIdFromPath() ? 'join' : 'create'));

    const checkSessionExistsRef = useRef(checkSessionExists);
    checkSessionExistsRef.current = checkSessionExists;

    useEffect(() => {
        const roomFromPath = getRoomIdFromPath();
        if (roomFromPath) {
            checkSessionExistsRef.current(roomFromPath);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) return;

        localStorage.setItem(USER_NAME_KEY, trimmedName);

        try {
            if (mode === 'create') {
                await createSession(trimmedName);
            } else {
                if (!sessionId.trim()) return;
                await joinSession(sessionId, trimmedName);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card max-w-md w-full animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-accent-soft to-accent-secondary bg-clip-text text-transparent">
                        {t('welcome.title')}
                    </h1>
                    <p className="text-ink-400">{t('welcome.subtitle')}</p>
                </div>

                <div className="flex gap-2 mb-6 p-1 bg-ink-900/50 rounded-lg border border-white/5">
                    <button
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-300 ${mode === 'create' ? 'bg-accent text-white shadow-lg shadow-accent/20 ring-1 ring-accent-soft/50' : 'text-ink-400 hover:text-white hover:bg-white/5'}`}
                        onClick={() => setMode('create')}
                    >
                        {t('welcome.create')}
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-300 ${mode === 'join' ? 'bg-accent text-white shadow-lg shadow-accent/20 ring-1 ring-accent-soft/50' : 'text-ink-400 hover:text-white hover:bg-white/5'}`}
                        onClick={() => setMode('join')}
                    >
                        {t('welcome.join')}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-ink-300 mb-1.5 ml-1">{t('welcome.nameLabel')}</label>
                        <input
                            type="text"
                            className="w-full bg-ink-900/50 border border-ink-700 rounded-xl px-4 py-3 text-white placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-sm"
                            placeholder={t('welcome.namePlaceholder')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {mode === 'join' && (
                        <div className="animate-fade-in">
                            <label className="block text-sm font-medium text-ink-300 mb-1.5 ml-1">{t('welcome.sessionLabel')}</label>
                            <input
                                type="text"
                                className="w-full bg-ink-900/50 border border-ink-700 rounded-xl px-4 py-3 text-white placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-sm uppercase tracking-wider font-mono"
                                placeholder={t('welcome.sessionPlaceholder')}
                                value={sessionId}
                                onChange={(e) => setSessionId(e.target.value.toUpperCase())}
                                required
                            />
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm flex items-center justify-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !name}
                        className="w-full bg-gradient-to-r from-accent to-accent-secondary hover:brightness-110 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-accent/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-white/10 flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {mode === 'create' ? <Play size={20} className="fill-current" /> : <Users size={20} />}
                                {mode === 'create' ? t('welcome.startButton') : t('welcome.joinButton')}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
