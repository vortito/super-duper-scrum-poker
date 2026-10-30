import React from 'react';
import { useTheme, ACCENTS, THEME_ORDER } from '../context/ThemeContext';
import type { AccentName, ThemeMode } from '../context/ThemeContext';
import { useSession } from '../context/SessionContext';
import { Moon, Palette, Sun } from 'lucide-react';
import { cn } from '../utils/cn';

const MODE_LABELS: Record<ThemeMode, string> = { light: 'Light mode', dark: 'Dark mode' };
const MODES: ThemeMode[] = ['light', 'dark'];

export const ThemeSelector: React.FC = () => {
    const { mode, accent, setMode, setAccent } = useTheme();
    const { setPlayerTheme } = useSession();

    const handleModeChange = (nextMode: ThemeMode) => {
        setMode(nextMode);
        void setPlayerTheme({ mode: nextMode, accent });
    };

    const handleAccentChange = (nextAccent: AccentName) => {
        setAccent(nextAccent);
        void setPlayerTheme({ mode, accent: nextAccent });
    };

    return (
        <div className="flex items-center gap-2 bg-app-surface backdrop-blur-md p-1.5 pr-2.5 rounded-lg border border-white/10">
            <div className="flex items-center gap-1">
                {MODES.map((option) => {
                    const active = mode === option;

                    return (
                        <button
                            key={option}
                            type="button"
                            onClick={() => handleModeChange(option)}
                            title={MODE_LABELS[option]}
                            aria-label={MODE_LABELS[option]}
                            aria-pressed={active}
                            className={cn('w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200', active ? 'ring-2 ring-white bg-accent text-white' : 'ring-1 ring-white/20 text-ink-400 hover:text-app-text')}
                        >
                            {option === 'light' ? <Sun size={13} /> : <Moon size={13} />}
                        </button>
                    );
                })}
            </div>
            <div className="w-px h-4 bg-white/10" />
            <Palette size={16} className="text-ink-400" />
            <div className="flex items-center gap-1.5">
                {THEME_ORDER.map((name) => {
                    const vars = ACCENTS[name];
                    const active = accent === name;

                    return (
                        <button
                            key={name}
                            onClick={() => handleAccentChange(name)}
                            title={name}
                            aria-label={name}
                            aria-pressed={active}
                            className={cn('w-5 h-5 rounded-full transition-all duration-200', active ? 'ring-2 ring-white scale-110' : 'ring-1 ring-white/20 hover:scale-110')}
                            style={{ background: `linear-gradient(135deg, ${vars.soft}, ${vars.secondary})` }}
                        />
                    );
                })}
            </div>
        </div>
    );
};
