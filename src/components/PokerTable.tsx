import React, { useMemo, useState } from 'react';
import { useSession } from '../context/SessionContext';
import { useLanguage } from '../context/LanguageContext';
import { VotingCards } from './VotingCards';
import { Copy, RotateCcw, Eye, LogOut } from 'lucide-react';

export const PokerTable: React.FC = () => {
    const { session, currentUser, revealVotes, resetSession, leaveSession } = useSession();
    const { t } = useLanguage();

    // Dynamic positioning logic
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const tableRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const updateDimensions = () => {
            if (tableRef.current) {
                setDimensions({
                    width: tableRef.current.offsetWidth,
                    height: tableRef.current.offsetHeight
                });
            }
        };

        // Initial measure
        updateDimensions();

        const observer = new ResizeObserver(updateDimensions);
        if (tableRef.current) {
            observer.observe(tableRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Calculate consensus
    const consensus = useMemo(() => {
        if (!session?.revealed) return null;
        const votes = session.players.map(p => p.vote).filter(v => v !== null && v !== '?');
        if (votes.length === 0) return null;
        const firstVote = votes[0];
        const allSame = votes.every(v => v === firstVote);
        return allSame ? firstVote : null;
    }, [session?.revealed, session?.players]);

    // Sort players to put current user at the "bottom" (first position visually in our logic?)
    // Or just keep them stable. Let's keep stable for now to avoid jumping.
    // Actually, for a "seated" feel, current user should be at bottom center.
    const sortedPlayers = useMemo(() => {
        if (!session || !currentUser) return session?.players || [];
        const myIndex = session.players.findIndex(p => p.id === currentUser.id);
        if (myIndex === -1) return session.players;

        // Rotate array so current user is first (or last, depending on where we start rendering)
        // Let's make current user index 0, and render index 0 at bottom (90 deg)
        return [
            ...session.players.slice(myIndex),
            ...session.players.slice(0, myIndex)
        ];
    }, [session, currentUser]);

    if (!session) return null;

    const copyLink = () => {
        const url = `${window.location.origin}${window.location.pathname}?session=${session.id}`;
        navigator.clipboard.writeText(url);
        // Could add a toast here
    };

    const getPositions = (index: number, total: number) => {
        const angleStep = (2 * Math.PI) / total;
        const angleOffset = Math.PI / 2;
        const angle = index * angleStep + angleOffset;

        // Dynamic radii based on table width
        // Base width reference is ~900px
        // cardRx was 320 (35%), playerRx was 520 (58%)
        const scale = dimensions.width > 0 ? dimensions.width / 900 : 1;

        const cardRx = 320 * scale;
        const cardRy = 150 * scale;
        const cardX = Math.cos(angle) * cardRx;
        const cardY = Math.sin(angle) * cardRy;

        const playerRx = 520 * scale;
        const playerRy = 300 * scale;
        const playerX = Math.cos(angle) * playerRx;
        const playerY = Math.sin(angle) * playerRy;

        // Rotation (pointing to center)
        const rotation = (angle * 180 / Math.PI) - 90;

        return { cardX, cardY, playerX, playerY, rotation, scale };
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden flex flex-col relative selection:bg-indigo-500/30">

            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none" />

            {/* Header */}
            <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-40 pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-4 bg-slate-900/50 backdrop-blur-md p-2 pr-4 rounded-full border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg">
                        SP
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-slate-200">{t('welcome.title')}</h1>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>{t('game.room')}: {session.id}</span>
                            <button onClick={copyLink} className="hover:text-white transition-colors" title={t('game.copy')}>
                                <Copy size={12} />
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={leaveSession}
                    className="pointer-events-auto absolute top-20 right-6 flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all border border-red-500/20 text-sm font-medium backdrop-blur-md"
                >
                    <LogOut size={16} />
                    <span>{t('game.exit')}</span>
                </button>
            </header>

            {/* Main Game Area */}
            <main className="flex-1 w-full flex items-center justify-center relative perspective-1000 overflow-hidden -mt-24">

                {/* The Table Container - Scalable */}
                <div
                    ref={tableRef}
                    className="relative w-[90%] max-w-[1200px] aspect-[2/1] flex items-center justify-center z-0"
                >
                    {/* The Table Visuals */}
                    <div className="absolute inset-0 bg-slate-800/80 rounded-[300px] border-8 border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-sm transform transition-all duration-1000">
                        <div className="absolute inset-2 rounded-[290px] bg-slate-800 border border-white/5 shadow-inner" />
                    </div>

                    {/* Center Content */}
                    <div className="z-10 text-center relative">
                        {session.revealed ? (
                            <div className="animate-fade-in">
                                {consensus !== null ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="text-5xl mb-2">🎉</div>
                                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                                            {t('game.deal')}
                                        </h2>
                                        <div className="text-xl text-slate-400 font-medium">
                                            {t('game.agreed')} <span className="text-white font-bold text-2xl">{consensus}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <span className="text-slate-500 text-xs uppercase tracking-widest mb-1">{t('game.average')}</span>
                                        <span className="text-6xl font-bold text-white drop-shadow-lg">
                                            {session.average}
                                        </span>
                                    </div>
                                )}

                                <button
                                    onClick={() => resetSession()}
                                    className="mt-8 flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-full text-white font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 mx-auto"
                                >
                                    <RotateCcw size={18} />
                                    {t('game.newRound')}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="text-slate-500 font-medium tracking-wide">
                                    {session.players.filter(p => p.vote !== null).length} / {session.players.length} {t('game.votes')}
                                </div>
                                <button
                                    onClick={() => revealVotes()}
                                    className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-bold shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
                                >
                                    <span className="flex items-center gap-2">
                                        <Eye size={20} /> {t('game.reveal')}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Players & Cards Orbiting */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {sortedPlayers.map((player, index) => {
                        const { cardX, cardY, playerX, playerY, rotation, scale } = getPositions(index, sortedPlayers.length);
                        const isMe = currentUser?.id === player.id;

                        // Dynamic sizes based on scale
                        // Base avatar size: w-10 (2.5rem = 40px) -> scale up to say 80px
                        // Let's use style for size to be precise with scale
                        const avatarSize = Math.max(40, 40 * scale * 1.5); // Min 40px, scale up
                        const cardWidth = Math.max(56, 56 * scale); // Base w-14 (3.5rem = 56px)
                        const cardHeight = Math.max(80, 80 * scale); // Base h-20 (5rem = 80px)

                        return (
                            <React.Fragment key={player.id}>
                                {/* Card on Table */}
                                <div
                                    className="absolute transition-all duration-700 ease-out flex items-center justify-center"
                                    style={{
                                        transform: `translate(${cardX}px, ${cardY}px) rotate(${rotation}deg)`,
                                        zIndex: 20,
                                        width: `${cardWidth}px`,
                                        height: `${cardHeight}px`
                                    }}
                                >
                                    <div className="relative w-full h-full perspective-500">
                                        <div className={`
                                            w-full h-full rounded-lg shadow-xl transition-all duration-500 transform-style-3d
                                            ${session.revealed
                                                ? 'rotate-y-180'
                                                : player.vote !== null
                                                    ? 'translate-y-0'
                                                    : 'translate-y-4 opacity-0'}
                                        `}>
                                            {/* Card Back */}
                                            <div className={`
                                                absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg border-2 border-indigo-400/30 flex items-center justify-center backface-hidden
                                                ${!session.revealed && player.vote !== null ? 'opacity-100' : 'opacity-0'}
                                            `}>
                                                <div className="w-[50%] h-[60%] border-2 border-dashed border-indigo-400/30 rounded-sm" />
                                            </div>

                                            {/* Card Front */}
                                            <div className={`
                                                absolute inset-0 bg-white text-slate-900 rounded-lg flex items-center justify-center font-bold border-2 border-slate-200 shadow-inner rotate-y-180 backface-hidden
                                                ${session.revealed ? 'opacity-100' : 'opacity-0'}
                                            `}
                                                style={{ fontSize: `${Math.max(1.25, 1.25 * scale)}rem` }}
                                            >
                                                {player.vote === '?' ? '🃏' : player.vote}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Avatar Outside */}
                                <div
                                    className="absolute transition-all duration-700 ease-out flex flex-col items-center justify-center"
                                    style={{
                                        transform: `translate(${playerX}px, ${playerY}px)`,
                                        zIndex: isMe ? 50 : 30,
                                        width: `${avatarSize * 2.5}px` // Container width
                                    }}
                                >
                                    <div className={`
                                        flex flex-col items-center gap-1 transition-all duration-300
                                        ${player.vote !== null && !session.revealed ? 'opacity-100' : 'opacity-80'}
                                    `}>
                                        <div
                                            className={`
                                                rounded-full flex items-center justify-center font-bold border-2 shadow-lg z-20 relative
                                                ${isMe
                                                    ? 'bg-indigo-500 border-indigo-300 text-white'
                                                    : 'bg-slate-700 border-slate-600 text-slate-300'}
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
                                            className={`
                                                font-medium px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur border border-white/10 whitespace-nowrap
                                                ${isMe ? 'text-indigo-300' : 'text-slate-400'}
                                            `}
                                            style={{ fontSize: `${Math.max(0.75, 0.75 * scale * 1.2)}rem` }}
                                        >
                                            {player.name}
                                        </span>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            </main>

            <VotingCards />
        </div>
    );
};
