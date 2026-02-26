import React, { useEffect, useState, createContext, useContext } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { api } from './api';

// ============================================================================
// TYPES
// ============================================================================

interface User {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin' | 'delivery';
    address?: string;
    createdAt?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, address?: string) => Promise<void>;
    logout: () => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const clerkAuth = useClerkAuth();
    const { user: clerkUser } = useUser();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    useEffect(() => {
        if (!clerkUser) return;

        const email = clerkUser.primaryEmailAddress?.emailAddress || '';
        const name =
            clerkUser.fullName ||
            clerkUser.username ||
            email.split('@')[0] ||
            'User';

        setUser({
            id: clerkUser.id,
            name,
            email,
            role: 'customer',
        });
    }, [clerkUser]);

    const login = async (email: string, password: string) => {
        const data = await api.login(email, password);
        setToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
    };

    const register = async (name: string, email: string, password: string, address?: string) => {
        await api.register(name, email, password, address);
    };

    const logout = () => {
        if (clerkAuth.isSignedIn) {
            clerkAuth.signOut();
        }
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
