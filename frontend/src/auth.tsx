import React, { useState, useEffect, createContext, useContext } from 'react';
import { Sparkles, Truck, Shield, Star } from 'lucide-react';
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
    adminLogin: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, address?: string) => Promise<void>;
    adminRegister: (name: string, email: string, password: string, address?: string) => Promise<void>;
    logout: () => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const login = async (email: string, password: string) => {
        const data = await api.login(email, password);
        setToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
    };

    const adminLogin = async (email: string, password: string) => {
        const data = await api.adminLogin(email, password);
        setToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
    };

    const register = async (name: string, email: string, password: string, address?: string) => {
        await api.register(name, email, password, address);
    };

    const adminRegister = async (name: string, email: string, password: string, address?: string) => {
        await api.adminRegister(name, email, password, address);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, adminLogin, register, adminRegister, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

// ============================================================================
// COMPONENTS
// ============================================================================

const LoginForm: React.FC<{ onSuccess: () => void; onSwitchToRegister: () => void }> = ({ onSuccess, onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, adminLogin } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isAdmin) {
                await adminLogin(email, password);
            } else {
                await login(email, password);
            }
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to your account</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                        required
                    />
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                        className="h-4 w-4 accent-red-500"
                    />
                    Admin login
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 disabled:bg-gray-400 font-semibold transition shadow-lg shadow-red-500/25"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Signing in...
                        </div>
                    ) : (
                        'Sign In'
                    )}
                </button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                        className="text-red-500 hover:text-red-600 font-medium"
                    >
                        Don't have an account? Sign up
                    </button>
                </div>
            </form>
        </div>
    );
};

const RegisterForm: React.FC<{ onSuccess: () => void; onSwitchToLogin: () => void }> = ({ onSuccess, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [info, setInfo] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, login, adminRegister, adminLogin } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setInfo('');
        setLoading(true);

        try {
            if (isAdmin) {
                await adminRegister(name, email, password, address);
                await adminLogin(email, password);
                onSuccess();
                return;
            }

            await register(name, email, password, address);
            setStep('otp');
            setInfo('OTP sent to your email. Please verify to continue.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setInfo('');
        setLoading(true);

        try {
            await api.verifyOtp(email, otp);
            await login(email, password);
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setInfo('');
        setLoading(true);

        try {
            await api.resendOtp(email);
            setInfo('New OTP sent to your email.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-600">Join us today</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center mb-4">
                    <Shield className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}
            {info && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center mb-4">
                    <Shield className="w-5 h-5 mr-2" />
                    {info}
                </div>
            )}

            {step === 'form' ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Delivery Address <span className="text-gray-400">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your delivery address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            className="h-4 w-4 accent-red-500"
                        />
                        Register as admin (bootstrap only)
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 disabled:bg-gray-400 font-semibold transition shadow-lg shadow-red-500/25"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Creating account...
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="text-red-500 hover:text-red-600 font-medium"
                        >
                            Already have an account? Sign in
                        </button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                        <input
                            type="text"
                            placeholder="6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-2">Sent to {email}</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 disabled:bg-gray-400 font-semibold transition shadow-lg shadow-red-500/25"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Verifying...
                            </div>
                        ) : (
                            'Verify OTP'
                        )}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={loading}
                            className="text-red-500 hover:text-red-600 font-medium"
                        >
                            Resend OTP
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

// ============================================================================
// AUTH SCREEN
// ============================================================================

export const AuthScreen: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Side - Branding */}
                <div className="bg-linear-to-br from-red-500 to-orange-500 p-8 lg:p-12 text-white hidden lg:flex flex-col justify-center">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl font-bold">Craveo</h1>
                        </div>
                        <p className="text-xl opacity-90">
                            Discover the best food around you. Order from top restaurants and get it delivered to your doorstep.
                        </p>
                        <div className="space-y-4 mt-8">
                            <div className="flex items-center gap-3 text-white/90">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Truck className="w-4 h-4" />
                                </div>
                                <span>Fast delivery in 30 minutes</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/90">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <span>100% food safety guaranteed</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/90">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Star className="w-4 h-4" />
                                </div>
                                <span>Rated 4.8+ by thousands</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="p-8 lg:p-12 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-linear-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                Craveo
                            </h1>
                        </div>

                        {isLogin ? (
                            <LoginForm
                                onSuccess={() => { }}
                                onSwitchToRegister={() => setIsLogin(false)}
                            />
                        ) : (
                            <RegisterForm
                                onSuccess={() => { }}
                                onSwitchToLogin={() => setIsLogin(true)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
