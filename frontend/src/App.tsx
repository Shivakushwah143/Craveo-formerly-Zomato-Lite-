import React, { useEffect } from 'react';
import { SignedIn, SignedOut, UserButton, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { AppUI } from './AppUI';
import { AuthProvider, useAuth, AuthScreen } from './auth';
import { setTokenProvider } from './api';

// ============================================================================
// MAIN APP
// ============================================================================
const ClerkTokenBridge: React.FC = () => {
    const { isSignedIn, getToken } = useClerkAuth();

    useEffect(() => {
        if (isSignedIn) {
            setTokenProvider(() => getToken());
        } else {
            setTokenProvider(null);
        }
    }, [isSignedIn, getToken]);

    return null;
};

const App: React.FC = () => {
    const { user } = useAuth();
    const { isSignedIn } = useClerkAuth();

    if (!user && !isSignedIn) {
        return <AuthScreen />;
    }

    return (
        <>
            <SignedIn>
                <div className="fixed top-4 right-4 z-50">
                    <UserButton />
                </div>
            </SignedIn>
            <AppUI />
        </>
    );
};

export default function Root() {
    return (
        <AuthProvider>
            <ClerkTokenBridge />
            <App />
        </AuthProvider>
    );
}
