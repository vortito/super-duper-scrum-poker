import { useEffect, useRef } from 'react';
import { SessionProvider, useSession } from './context/SessionContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PokerTable } from './components/PokerTable';
import { LanguageProvider } from './context/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';
import { homeUrl, roomUrl } from './utils/url';

const AppContent = () => {
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
        <>
            {!session ? <WelcomeScreen /> : <PokerTable />}
        </>
    );
};

function App() {
    return (
        <LanguageProvider>
            <SessionProvider>
                <LanguageSelector />
                <AppContent />
            </SessionProvider>
        </LanguageProvider>
    );
}

export default App;
