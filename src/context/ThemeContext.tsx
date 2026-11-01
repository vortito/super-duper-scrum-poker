import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { ThemeMode } from '../types';

export type { ThemeMode } from '../types';

export type AccentName = 'blue' | 'green' | 'pink' | 'orange' | 'cyan' | 'slate';

type AccentVars = {
    accent: string;
    soft: string;
    deep: string;
    secondary: string;
};

type SurfacePalette = {
    bg: string;
    surface: string;
    text: string;
};

type InkPalette = Record<'200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950', string>;

type ThemeSelection = {
    mode: ThemeMode;
    accent: AccentName;
};

export const ACCENTS: Record<AccentName, AccentVars> = {
    blue: { accent: '#6366f1', soft: '#818cf8', deep: '#3730a3', secondary: '#a855f7' },
    green: { accent: '#10b981', soft: '#34d399', deep: '#065f46', secondary: '#14b8a6' },
    pink: { accent: '#ec4899', soft: '#f472b6', deep: '#9d174d', secondary: '#d946ef' },
    orange: { accent: '#f97316', soft: '#fb923c', deep: '#9a3412', secondary: '#f59e0b' },
    cyan: { accent: '#06b6d4', soft: '#22d3ee', deep: '#155e75', secondary: '#0ea5e9' },
    slate: { accent: '#64748b', soft: '#94a3b8', deep: '#334155', secondary: '#475569' },
};

export const THEME_ORDER: AccentName[] = ['blue', 'green', 'pink', 'orange', 'cyan', 'slate'];

export const SURFACE_PALETTES: Record<ThemeMode, SurfacePalette> = {
    dark: { bg: '#0c0a09', surface: '#1c1917', text: '#f8fafc' },
    light: { bg: '#d8d9db', surface: '#ffffff', text: '#0f172a' },
};

export const INK_PALETTES: Record<ThemeMode, InkPalette> = {
    dark: {
        '200': '#e7e5e4',
        '300': '#d6d3d1',
        '400': '#a8a29e',
        '500': '#78716c',
        '600': '#57534e',
        '700': '#44403c',
        '800': '#292524',
        '900': '#1c1917',
        '950': '#0c0a09',
    },
    light: {
        '200': '#0f172a',
        '300': '#1e293b',
        '400': '#475569',
        '500': '#334155',
        '600': '#1e293b',
        '700': '#334155',
        '800': '#cacbd0',
        '900': '#0f172a',
        '950': '#e2e8f0',
    },
};

export const FELT_BORDER_PALETTES: Record<ThemeMode, string> = {
    dark: '#403a35',
    light: '#87898c',
};

export const DANGER_PALETTES: Record<ThemeMode, string> = {
    dark: '#fca5a5',
    light: '#b91c1c',
};

const MODE_STORAGE_KEY = 'scrum_poker_theme_mode';
const ACCENT_STORAGE_KEY = 'scrum_poker_theme_accent';
const LEGACY_THEME_STORAGE_KEY = 'scrum_poker_theme';

const DEFAULT_MODE: ThemeMode = 'dark';
const DEFAULT_ACCENT: AccentName = 'blue';

export const DEFAULT_THEME: ThemeSelection = { mode: DEFAULT_MODE, accent: DEFAULT_ACCENT };

const isThemeMode = (value: string | null): value is ThemeMode => value === 'dark' || value === 'light';

const isAccentName = (value: string | null): value is AccentName => value !== null && Object.prototype.hasOwnProperty.call(ACCENTS, value);

const readStoredMode = (): ThemeMode => {
    const stored = localStorage.getItem(MODE_STORAGE_KEY);
    return isThemeMode(stored) ? stored : DEFAULT_MODE;
};

const readStoredAccent = (): AccentName => {
    const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
    const legacy = localStorage.getItem(LEGACY_THEME_STORAGE_KEY);

    if (legacy !== null) {
        localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
        if (stored === null) {
            return isAccentName(legacy) ? legacy : DEFAULT_ACCENT;
        }
    }

    return isAccentName(stored) ? stored : DEFAULT_ACCENT;
};

const INK_SHADES = ['200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

const applyTheme = (mode: ThemeMode, accent: AccentName) => {
    const surface = SURFACE_PALETTES[mode];
    const ink = INK_PALETTES[mode];
    const accentVars = ACCENTS[accent];
    const root = document.documentElement;

    root.style.setProperty('--color-app-bg', surface.bg);
    root.style.setProperty('--color-app-surface', surface.surface);
    root.style.setProperty('--color-app-text', surface.text);
    for (const shade of INK_SHADES) {
        root.style.setProperty(`--color-ink-${shade}`, ink[shade]);
    }
    root.style.setProperty('--color-felt-border', FELT_BORDER_PALETTES[mode]);
    root.style.setProperty('--color-danger', DANGER_PALETTES[mode]);
    root.style.setProperty('color-scheme', mode);
    root.style.setProperty('--color-accent', accentVars.accent);
    root.style.setProperty('--color-accent-soft', accentVars.soft);
    root.style.setProperty('--color-accent-deep', accentVars.deep);
    root.style.setProperty('--color-accent-secondary', accentVars.secondary);
};

type ThemeContextType = ThemeSelection & {
    theme: ThemeSelection;
    setMode: (mode: ThemeMode) => void;
    setAccent: (accent: AccentName) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeSelection>(() => ({
        mode: readStoredMode(),
        accent: readStoredAccent(),
    }));

    useEffect(() => {
        applyTheme(theme.mode, theme.accent);
    }, [theme]);

    const setMode = (mode: ThemeMode) => {
        setTheme((current) => ({ ...current, mode }));
        localStorage.setItem(MODE_STORAGE_KEY, mode);
    };

    const setAccent = (accent: AccentName) => {
        setTheme((current) => ({ ...current, accent }));
        localStorage.setItem(ACCENT_STORAGE_KEY, accent);
    };

    return (
        <ThemeContext.Provider value={{ ...theme, theme, setMode, setAccent }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
