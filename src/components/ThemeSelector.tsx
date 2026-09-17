import React from 'react';
import { useTheme, THEMES, THEME_ORDER } from '../context/ThemeContext';
import { Palette } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center gap-2 bg-ink-900/50 backdrop-blur-md p-1.5 pr-2.5 rounded-lg border border-white/10">
            <Palette size={16} className="text-ink-400" />
            <div className="flex items-center gap-1.5">
                {THEME_ORDER.map((name) => {
                    const vars = THEMES[name];
                    const active = theme === name;

                    return (
                        <button
                            key={name}
                            onClick={() => setTheme(name)}
                            title={name}
                            aria-label={name}
                            aria-pressed={active}
                            className={`w-5 h-5 rounded-full transition-all duration-200 ${active ? 'ring-2 ring-white scale-110' : 'ring-1 ring-white/20 hover:scale-110'}`}
                            style={{ background: `linear-gradient(135deg, ${vars.soft}, ${vars.secondary})` }}
                        />
                    );
                })}
            </div>
        </div>
    );
};
