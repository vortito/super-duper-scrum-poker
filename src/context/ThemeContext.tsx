import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ThemeName = 'blue' | 'green' | 'pink' | 'orange' | 'cyan';

type ThemeVars = {
    accent: string;
    soft: string;
    deep: string;
    secondary: string;
};

// eslint-disable-next-line react-refresh/only-export-components
export const THEMES: Record<ThemeName, ThemeVars> = {
    blue: { accent: '#6366f1', soft: '#818cf8', deep: '#3730a3', secondary: '#a855f7' },
    green: { accent: '#10b981', soft: '#34d399', deep: '#065f46', secondary: '#14b8a6' },
    pink: { accent: '#ec4899', soft: '#f472b6', deep: '#9d174d', secondary: '#d946ef' },
    orange: { accent: '#f97316', soft: '#fb923c', deep: '#9a3412', secondary: '#f59e0b' },
    cyan: { accent: '#06b6d4', soft: '#22d3ee', deep: '#155e75', secondary: '#0ea5e9' },
};

// eslint-disable-next-line react-refresh/only-export-components
export const THEME_ORDER: ThemeName[] = ['blue', 'green', 'pink', 'orange', 'cyan'];

const THEME_STORAGE_KEY = 'scrum_poker_theme';
const DEFAULT_THEME: ThemeName = 'blue';

type ThemeContextType = {
    theme: ThemeName;
    setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getStoredTheme = (): ThemeName => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored && stored in THEMES ? (stored as ThemeName) : DEFAULT_THEME;
};

const applyTheme = (name: ThemeName) => {
    const vars = THEMES[name];
    const root = document.documentElement;
    root.style.setProperty('--color-accent', vars.accent);
    root.style.setProperty('--color-accent-soft', vars.soft);
    root.style.setProperty('--color-accent-deep', vars.deep);
    root.style.setProperty('--color-accent-secondary', vars.secondary);
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<ThemeName>(getStoredTheme);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const setTheme = (name: ThemeName) => {
        setThemeState(name);
        localStorage.setItem(THEME_STORAGE_KEY, name);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
