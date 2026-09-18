import React, { useEffect, useRef } from 'react';
import { SessionProvider, useSession } from './context/SessionContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PokerTable } from './components/PokerTable';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageSelector } from './components/LanguageSelector';
import { ThemeSelector } from './components/ThemeSelector';
import { homeUrl, roomUrl } from './utils/url';

const AppContent: React.FC = () => {
    const { session } = useSession();
    const hadSession = useRef(false);

    useEffect(() => {
        if (session) {
            hadSession.current = true;
            window.history.replaceState(null, '', roomUrl(session.id));
        } else if (hadSession.current) {
            hadSession.current = false;
            window.history.replaceState(null, '', homeUrl());
        }
    }, [session]);

    return (
        <>{!session ? <WelcomeScreen /> : <PokerTable />}</>
    );
};

export const App: React.FC = () => {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <SessionProvider>
                    <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                        <ThemeSelector />
                        <LanguageSelector />
                    </div>
                    <AppContent />
                </SessionProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
};
