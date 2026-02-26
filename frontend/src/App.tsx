import React, { useEffect } from 'react';
import { AuthenticateWithRedirectCallback, SignedIn, UserButton, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { AppUI } from './AppUI';
import { AuthProvider, useAuth } from './auth-context';
import { AuthScreen } from './auth';
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
    const { isSignedIn, isLoaded } = useClerkAuth();

    if (!isLoaded) {
        return null;
    }

    if (window.location.pathname === '/sso-callback') {
        return (
            <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center p-6">
                <AuthenticateWithRedirectCallback />
            </div>
        );
    }

    if (!user && !isSignedIn) {
        return <AuthScreen />;
    }

    return (
        <>
            <SignedIn>
                <div className="hidden md:block fixed top-4 right-4 z-50">
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
