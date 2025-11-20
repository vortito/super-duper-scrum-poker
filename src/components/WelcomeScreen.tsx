import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { useLanguage } from '../context/LanguageContext';
import { Users, Play } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
    const { createSession, joinSession, loading, error } = useSession();
    const { t } = useLanguage();
    const [name, setName] = useState(() => {
        return localStorage.getItem('scrum_poker_username') || '';
    });
    const [sessionId, setSessionId] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('session') || '';
    });
    const [mode, setMode] = useState<'create' | 'join'>(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('session') ? 'join' : 'create';
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        // Persist username
        localStorage.setItem('scrum_poker_username', name.trim());

        try {
            if (mode === 'create') {
                await createSession(name);
            } else {
                if (!sessionId.trim()) return;
                await joinSession(sessionId, name);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card max-w-md w-full animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                        style={{ backgroundImage: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {t('welcome.title')}
                    </h1>
                    <p className="text-gray-400">{t('welcome.subtitle')}</p>
                </div>

                <div className="flex gap-2 mb-6 p-1 bg-slate-900/50 rounded-lg border border-white/5">
                    <button
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-300 ${mode === 'create' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400/50' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        onClick={() => setMode('create')}
                    >
                        {t('welcome.create')}
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-300 ${mode === 'join' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400/50' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        onClick={() => setMode('join')}
                    >
                        {t('welcome.join')}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">{t('welcome.nameLabel')}</label>
                        <input
                            type="text"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                            placeholder={t('welcome.namePlaceholder')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {mode === 'join' && (
                        <div className="animate-fade-in">
                            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">{t('welcome.sessionLabel')}</label>
                            <input
                                type="text"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm uppercase tracking-wider font-mono"
                                placeholder={t('welcome.sessionPlaceholder')}
                                value={sessionId}
                                onChange={(e) => setSessionId(e.target.value.toUpperCase())}
                                required
                            />
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center justify-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !name}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-white/10 flex items-center justify-center gap-2 mt-2"
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
