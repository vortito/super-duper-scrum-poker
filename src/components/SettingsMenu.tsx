import React, { useEffect, useRef, useState } from 'react';
import { useTheme, ACCENTS, THEME_ORDER } from '../context/ThemeContext';
import type { AccentName, ThemeMode } from '../context/ThemeContext';
import { useSession } from '../context/SessionContext';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES } from '../i18n/translations';
import { Moon, Settings2, Sun } from 'lucide-react';
import { cn } from '../utils/cn';

const MODE_LABELS: Record<ThemeMode, string> = { light: 'Light mode', dark: 'Dark mode' };
const MODES: ThemeMode[] = ['light', 'dark'];

const sectionHeadingClass = 'px-1 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-ink-500';

export const SettingsMenu: React.FC = () => {
    const { mode, accent, setMode, setAccent } = useTheme();
    const { setPlayerTheme } = useSession();
    const { language, setLanguage, t } = useLanguage();
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    const handleModeChange = (nextMode: ThemeMode) => {
        setMode(nextMode);
        void setPlayerTheme({ mode: nextMode, accent });
    };

    const handleAccentChange = (nextAccent: AccentName) => {
        setAccent(nextAccent);
        void setPlayerTheme({ mode, accent: nextAccent });
    };

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                data-testid="settings-menu"
                onClick={() => setOpen((current) => !current)}
                aria-label={t('settings.label')}
                aria-expanded={open}
                className={cn('flex items-center justify-center w-9 h-9 rounded-lg bg-app-surface backdrop-blur-md border border-white/10 transition-colors', open ? 'text-app-text' : 'text-ink-400 hover:text-app-text')}
            >
                <Settings2 size={16} />
            </button>

            {open && (
                <div
                    data-testid="settings-menu-panel"
                    className="absolute right-0 top-11 z-50 w-56 flex flex-col gap-4 p-3 rounded-xl bg-app-surface backdrop-blur-md border border-white/10 shadow-xl"
                >
                    <div>
                        <div className={sectionHeadingClass}>{t('settings.theme')}</div>
                        <div className="flex items-center gap-1 px-1">
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
                                        className={cn('w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200', active ? 'ring-2 ring-white bg-accent text-white' : 'ring-1 ring-white/20 text-ink-400 hover:text-app-text')}
                                    >
                                        {option === 'light' ? <Sun size={14} /> : <Moon size={14} />}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex items-center gap-1.5 px-1 mt-2">
                            {THEME_ORDER.map((name) => {
                                const vars = ACCENTS[name];
                                const active = accent === name;

                                return (
                                    <button
                                        key={name}
                                        type="button"
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

                    <div>
                        <div className={sectionHeadingClass}>{t('settings.language')}</div>
                        <div className="flex items-center gap-1 px-1">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang}
                                    type="button"
                                    onClick={() => setLanguage(lang)}
                                    aria-pressed={language === lang}
                                    className={cn('px-2 py-1 rounded-md text-xs font-bold uppercase transition-all', language === lang ? 'bg-accent text-white shadow-sm' : 'text-ink-400 hover:text-app-text hover:bg-white/5')}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
