import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from '../context/SessionContext';
import { useLanguage } from '../context/LanguageContext';
import { VotingCards } from './VotingCards';
import { Copy, RotateCcw, Eye, LogOut } from 'lucide-react';

export const PokerTable: React.FC = () => {
    const { session, currentUser, revealVotes, resetSession, leaveSession } = useSession();
    const { t } = useLanguage();

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const tableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateDimensions = () => {
            if (tableRef.current) {
                setDimensions({
                    width: tableRef.current.offsetWidth,
                    height: tableRef.current.offsetHeight
                });
            }
        };

        updateDimensions();

        const observer = new ResizeObserver(updateDimensions);
        if (tableRef.current) {
            observer.observe(tableRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const consensus = useMemo(() => {
        if (!session?.revealed) return null;

        const allVotes = session.players.map((p) => p.vote).filter((v) => v !== null);
        if (allVotes.length === 0) return null;

        if (allVotes.some((v) => v === '?')) return null;

        const firstVote = allVotes[0];
        return allVotes.every((v) => v === firstVote) ? firstVote : null;
    }, [session?.revealed, session?.players]);

    const sortedPlayers = useMemo(() => {
        if (!session || !currentUser) return session?.players || [];
        const myIndex = session.players.findIndex((p) => p.id === currentUser.id);
        if (myIndex === -1) return session.players;

        return [
            ...session.players.slice(myIndex),
            ...session.players.slice(0, myIndex)
        ];
    }, [session, currentUser]);

    if (!session) return null;

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
    };

    const getPositions = (index: number, total: number) => {
        const angleStep = (2 * Math.PI) / total;
        const angle = index * angleStep + Math.PI / 2;
        const scale = dimensions.width > 0 ? dimensions.width / 900 : 1;

        const cardRx = 370 * scale;
        const cardRy = 150 * scale;
        const cardX = Math.cos(angle) * cardRx;
        const cardY = Math.sin(angle) * cardRy;

        const playerRx = 530 * scale;
        const playerRy = 300 * scale;
        const playerX = Math.cos(angle) * playerRx;
        const playerY = Math.sin(angle) * playerRy;

        const rotationDeg = angle * (180 / Math.PI) + 90;

        return { cardX, cardY, playerX, playerY, scale, rotationDeg };
    };

    return (
        <div className="min-h-screen bg-ink-950 text-white overflow-hidden flex flex-col relative selection:bg-accent/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-deep/20 via-ink-950 to-ink-950 pointer-events-none" />

            <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-40 pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-4 bg-ink-900/50 backdrop-blur-md p-2 pr-4 rounded-full border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center font-bold text-lg shadow-lg">
                        SP
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-ink-200">{t('welcome.title')}</h1>
                        <div className="flex items-center gap-2 text-xs text-ink-400">
                            <span>{t('game.room')}: {session.id}</span>
                            <button onClick={copyLink} className="hover:text-white transition-colors" title={t('game.copy')}>
                                <Copy size={12} />
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={leaveSession}
                    className="pointer-events-auto absolute top-20 right-6 flex items-center gap-2 px-4 py-2 rounded-full bg-danger/10 hover:bg-danger/20 text-danger hover:brightness-110 transition-all border border-danger/20 text-sm font-medium backdrop-blur-md"
                >
                    <LogOut size={16} />
                    <span>{t('game.exit')}</span>
                </button>
            </header>

            <main className="flex-1 w-full flex items-center justify-center relative overflow-hidden py-16">
                <div
                    ref={tableRef}
                    className="relative w-[60%] max-w-[900px] aspect-[2/1] flex items-center justify-center z-0"
                >
                    <div className="absolute inset-0 bg-ink-800/80 rounded-[300px] border-8 border-ink-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-sm transform transition-all duration-1000">
                        <div className="absolute inset-2 rounded-[290px] bg-ink-800 border border-white/5 shadow-inner" />
                    </div>

                    <div className="z-10 text-center relative">
                        {session.revealed ? (
                            <div className="animate-fade-in">
                                {consensus !== null ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="text-5xl mb-2">🎉</div>
                                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-success to-success-deep">
                                            {t('game.deal')}
                                        </h2>
                                        <div className="text-xl text-ink-400 font-medium">
                                            {t('game.agreed')} <span className="text-white font-bold text-2xl">{consensus}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <span className="text-ink-500 text-xs uppercase tracking-widest mb-1">{t('game.average')}</span>
                                        <span className="text-6xl font-bold text-white drop-shadow-lg">
                                            {session.average}
                                        </span>
                                    </div>
                                )}

                                <button
                                    onClick={() => resetSession()}
                                    className="mt-8 flex items-center gap-2 px-6 py-3 bg-ink-700 hover:bg-ink-600 rounded-full text-white font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 mx-auto"
                                >
                                    <RotateCcw size={18} />
                                    {t('game.newRound')}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="text-ink-500 font-medium tracking-wide">
                                    {session.players.filter((p) => p.vote !== null).length} / {session.players.length} {t('game.votes')}
                                </div>
                                <button
                                    onClick={() => revealVotes()}
                                    className="group relative px-8 py-4 bg-accent hover:brightness-110 rounded-full text-white font-bold shadow-lg shadow-accent/25 transition-all hover:scale-105 active:scale-95"
                                >
                                    <span className="flex items-center gap-2">
                                        <Eye size={20} /> {t('game.reveal')}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {sortedPlayers.map((player, index) => {
                        const { cardX, cardY, playerX, playerY, scale, rotationDeg } = getPositions(index, sortedPlayers.length);
                        const isMe = currentUser?.id === player.id;

                        const avatarSize = Math.max(40, 60 * scale);
                        const cardWidth = Math.max(56, 56 * scale);
                        const cardHeight = Math.max(80, 80 * scale);

                        return (
                            <Fragment key={player.id}>
                                <div
                                    className="absolute transition-all duration-700 ease-out flex items-center justify-center pointer-events-none"
                                    style={{
                                        transform: `translate(${cardX}px, ${cardY}px) rotate(${rotationDeg}deg)`,
                                        zIndex: 20,
                                        width: `${cardWidth}px`,
                                        height: `${cardHeight}px`
                                    }}
                                >
                                    <div className="relative w-full h-full">
                                        <div
                                            className={`w-full h-full rounded-lg shadow-xl transition-all duration-300 ${player.vote !== null ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                                        >
                                            {!session.revealed ? (
                                                <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent-deep rounded-lg border-2 border-accent/30 flex items-center justify-center shadow-md">
                                                    <div className="w-[50%] h-[60%] border-2 border-dashed border-accent/30 rounded-sm" />
                                                </div>
                                            ) : (
                                                <div
                                                    className="absolute inset-0 bg-white text-ink-900 rounded-lg flex items-center justify-center font-bold border-2 border-ink-200 shadow-xl"
                                                    style={{ fontSize: `${Math.max(1.25, 1.25 * scale)}rem` }}
                                                >
                                                    {player.vote === '?' ? '🃏' : player.vote}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="absolute transition-all duration-700 ease-out flex flex-col items-center justify-center"
                                    style={{
                                        transform: `translate(${playerX}px, ${playerY}px)`,
                                        zIndex: isMe ? 50 : 30,
                                        width: `${avatarSize * 2.5}px`
                                    }}
                                >
                                    <div
                                        className={`flex flex-col items-center gap-1 transition-all duration-300 ${player.vote !== null && !session.revealed ? 'opacity-100' : 'opacity-80'}`}
                                    >
                                        <div
                                            className={`
                                                rounded-full flex items-center justify-center font-bold border-2 shadow-lg z-20 relative
                                                ${isMe
                                                    ? 'bg-accent border-accent-soft text-white'
                                                    : 'bg-ink-700 border-ink-600 text-ink-300'}
                                            `}
                                            style={{
                                                width: `${avatarSize}px`,
                                                height: `${avatarSize}px`,
                                                fontSize: `${Math.max(0.875, 0.875 * scale * 1.5)}rem`
                                            }}
                                        >
                                            {player.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span
                                            className={`font-medium px-2 py-0.5 rounded-full bg-ink-900/80 backdrop-blur border border-white/10 whitespace-nowrap ${isMe ? 'text-accent-soft' : 'text-ink-400'}`}
                                            style={{ fontSize: `${Math.max(0.75, 0.75 * scale * 1.2)}rem` }}
                                        >
                                            {player.name}
                                        </span>
                                    </div>
                                </div>
                            </Fragment>
                        );
                    })}
                </div>
            </main>

            <VotingCards />
        </div>
    );
};
