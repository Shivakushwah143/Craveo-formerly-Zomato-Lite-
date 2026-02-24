import React from 'react';
import { AuthProvider, useAuth, AuthScreen } from './auth';
import { AppUI } from './AppUI';

// ============================================================================
// MAIN APP
// ============================================================================
const App: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <AuthProvider>
                <AuthScreen />
            </AuthProvider>
        );
    }

    return <AppUI />;
};

// ============================================================================
// ROOT
// ============================================================================
export default function Root() {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}
