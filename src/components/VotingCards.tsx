import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { Vote } from '../types';

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21];

export const VotingCards: React.FC = () => {
    const { currentUser, submitVote, session } = useSession();
    const [isHovering, setIsHovering] = useState(false);

    if (!currentUser || session?.revealed) return null;

    const handleVote = (value: Vote) => {
        if (currentUser.vote === value) {
            submitVote(null); // Deselect if already selected
        } else {
            submitVote(value);
        }
    };

    return (
        <div
            className="fixed bottom-0 left-0 right-0 h-64 flex items-end justify-center z-50 overflow-hidden transition-all duration-500"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Gradient fade for the bottom area */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

            <div className={`
        relative flex items-end justify-center transition-all duration-500 px-4 pb-8
        ${isHovering ? 'gap-2' : 'gap-[-2rem] translate-y-32'}
      `}>
                {[...FIBONACCI, '?'].map((val, index) => {
                    const isSelected = currentUser.vote === val;
                    const total = FIBONACCI.length + 1;

                    // Calculate rotation
                    const rotation = isHovering
                        ? (index - total / 2) * 5
                        : (index - total / 2) * 2;

                    const translateY = isSelected
                        ? (isHovering ? -40 : -120) // Pop up significantly if selected
                        : 0;

                    return (
                        <button
                            key={val}
                            onClick={() => handleVote(val as Vote)}
                            style={{
                                transform: `rotate(${isSelected ? 0 : rotation}deg) translateY(${translateY}px)`,
                                zIndex: isSelected ? 50 : index,
                                marginLeft: isHovering ? 0 : '-1.5rem'
                            }}
                            className={`
                relative w-24 h-40 rounded-xl border-2 shadow-2xl transition-all duration-500 ease-out origin-bottom
                flex items-center justify-center text-4xl font-bold group bg-slate-800
                ${isSelected
                                    ? 'bg-white border-indigo-500 text-indigo-600 scale-110'
                                    : 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:-translate-y-10 hover:scale-110 hover:z-40 hover:border-slate-400'}
              `}
                        >
                            {/* Card Pattern */}
                            <div className="absolute inset-2 border border-dashed border-current opacity-20 rounded-lg pointer-events-none" />

                            {/* Corner Numbers (Visible when collapsed) */}
                            <span className="absolute top-2 left-2 text-sm font-bold opacity-60">{val}</span>
                            <span className="absolute bottom-2 right-2 text-sm font-bold opacity-60 rotate-180">{val}</span>

                            {/* Center Number - Hidden when collapsed unless selected */}
                            <span className={`transform group-hover:scale-110 transition-all duration-300 ${!isHovering && !isSelected ? 'opacity-0' : 'opacity-100'}`}>
                                {val === '?' ? '🃏' : val}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
