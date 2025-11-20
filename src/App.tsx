import { useEffect } from 'react';
import { SessionProvider, useSession } from './context/SessionContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PokerTable } from './components/PokerTable';

const AppContent = () => {
    const { session } = useSession();

    useEffect(() => {
        // Check for URL param to auto-join
        const params = new URLSearchParams(window.location.search);
        const sessionIdParam = params.get('session');
        if (sessionIdParam && !session) {
            // We can't auto-join without a name, but we can pre-fill the ID in WelcomeScreen
            // For now, WelcomeScreen handles manual entry. 
            // Ideally we pass this ID to WelcomeScreen.
        }
    }, []);

    return (
        <>
            {!session ? <WelcomeScreen /> : <PokerTable />}
        </>
    );
};

import { LanguageProvider } from './context/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';

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
