import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    roles: string[];
    avatarUrl?: string;
    bio?: string;
    specialization?: string;
    profileComplete?: boolean;
    usageRemaining?: number;
    emailsGenerated?: number;
    streak?: number;
    authProvider?: string;
    googleId?: string;
    facebookId?: string;
    isPremium?: boolean;
    tier?: string;
    subscriptionExpiryDate?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => void; // Trigger for login flow (e.g. redirect) if needed, otherwise handled by pages
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers: HeadersInit = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch('/api/v1/user/me', { headers, credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setUser({
                    id: data.id,
                    name: data.name || data.fullName,
                    email: data.email,
                    roles: data.roles || [],
                    avatarUrl: data.avatarUrl,
                    bio: data.bio,
                    specialization: data.specialization,
                    profileComplete: data.profileComplete,
                    usageRemaining: data.usageRemaining,
                    emailsGenerated: data.emailsGenerated,
                    streak: data.streak,
                    authProvider: data.authProvider,
                    googleId: data.googleId,
                    facebookId: data.facebookId,
                    isPremium: data.isPremium ?? false,
                    tier: data.tier || 'FREE',
                    subscriptionExpiryDate: data.subscriptionExpiryDate,
                });
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to fetch user', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const logout = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/v1/auth/logout', {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            localStorage.removeItem('token');
            setUser(null);
            sessionStorage.removeItem('dashboardIntroShown');
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login: () => { }, logout, refreshUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
