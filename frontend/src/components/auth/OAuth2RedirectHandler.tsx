import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UiverseLoader from '../ui/UiverseLoader';

const OAuth2RedirectHandler: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleOAuth2Redirect = async () => {
            try {
                // Extract token from URL
                const params = new URLSearchParams(location.search);
                const token = params.get('token');
                const err = params.get('error');

                if (err) {
                    setError('Authentication failed. Please try again.');
                    setTimeout(() => navigate('/login'), 3000);
                    return;
                }

                if (token) {
                    // 1. Save token securely
                    localStorage.setItem('token', token);

                    // 2. Refresh the user context so the app knows who we are
                    await refreshUser();

                    // 3. Clean the URL and redirect to Root. 
                    // RootRoute will natively route to /dashboard, /admin, or /teacher based on roles.
                    navigate('/', { replace: true });
                } else {
                    // No token found, fallback
                    setError('Invalid authentication token.');
                    setTimeout(() => navigate('/login'), 3000);
                }
            } catch (error) {
                console.error("OAuth2 redirect error:", error);
                setError('An error occurred during authentication.');
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        handleOAuth2Redirect();
    }, [location.search, navigate, refreshUser]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            {error ? (
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4 text-2xl">
                        ✕
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Error</h2>
                    <p className="text-slate-600 mb-6">{error}</p>
                    <p className="text-sm text-slate-400">Redirecting to login...</p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <UiverseLoader />
                    <h2 className="mt-8 text-xl font-bold text-slate-900">Securing your session...</h2>
                    <p className="mt-2 text-slate-500">Please wait while we log you in.</p>
                </div>
            )}
        </div>
    );
};

export default OAuth2RedirectHandler;
