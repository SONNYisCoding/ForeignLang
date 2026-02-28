import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface QuotaDetails {
    free: number;
    sub: number;
    purchased: number;
    adsWatched: number;
}

interface CreditContextType {
    credits: number | null;
    isCreditLoading: boolean;
    quotaDetails: QuotaDetails;
    refreshCredits: () => Promise<void>;
    deductCredit: () => void;
    // Watch Ad system
    showAdModal: boolean;
    adTimer: number;
    adFinished: boolean;
    handleWatchAd: () => void;
    handleClaimReward: () => Promise<void>;
    closeAdModal: () => void;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const CreditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [credits, setCredits] = useState<number | null>(null);
    const [isCreditLoading, setIsCreditLoading] = useState(true);
    const [quotaDetails, setQuotaDetails] = useState<QuotaDetails>({ free: 0, sub: 0, purchased: 0, adsWatched: 0 });

    // Watch Ad modal state
    const [showAdModal, setShowAdModal] = useState(false);
    const [adTimer, setAdTimer] = useState(5);
    const [adFinished, setAdFinished] = useState(false);

    const fetchCredits = useCallback(async () => {
        try {
            setIsCreditLoading(true);
            const token = localStorage.getItem('token');
            const headers: HeadersInit = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch('/api/v1/user/me', {
                headers,
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                if (data.usageRemaining !== undefined) {
                    setCredits(data.usageRemaining);
                    setQuotaDetails({
                        free: data.freeCredits || 0,
                        sub: data.subscriptionCredits || 0,
                        purchased: data.purchasedCredits || 0,
                        adsWatched: data.adsWatchedToday || 0
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch credits:', error);
        } finally {
            setIsCreditLoading(false);
        }
    }, []);

    // Fetch on mount
    useEffect(() => {
        fetchCredits();
    }, [fetchCredits]);

    // Re-fetch when user auth state changes (e.g. after login redirect)
    useEffect(() => {
        if (user) {
            fetchCredits();
        }
    }, [user, fetchCredits]);

    // Optimistic deduction — server deduction happens on the API call side
    const deductCredit = useCallback(() => {
        setCredits(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, []);

    // ═══ Watch Ad System ═══
    const handleWatchAd = useCallback(() => {
        setShowAdModal(true);
        setAdTimer(5);
        setAdFinished(false);
        const interval = setInterval(() => {
            setAdTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setAdFinished(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    const handleClaimReward = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/v1/quota/ad-reward', {
                method: 'POST',
                credentials: 'include', // Send session cookies
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
            });
            const data = await response.json();
            if (response.ok) {
                if (data.remainingUses !== undefined) {
                    setCredits(data.remainingUses);
                }
                setShowAdModal(false);
                // Refresh full breakdown from server
                await fetchCredits();
            } else {
                alert(data.error || 'Failed to claim reward');
                setShowAdModal(false);
            }
        } catch (error) {
            console.error('Ad reward error:', error);
        }
    }, [fetchCredits]);

    const closeAdModal = useCallback(() => {
        setShowAdModal(false);
    }, []);

    return (
        <CreditContext.Provider value={{
            credits,
            isCreditLoading,
            quotaDetails,
            refreshCredits: fetchCredits,
            deductCredit,
            showAdModal,
            adTimer,
            adFinished,
            handleWatchAd,
            handleClaimReward,
            closeAdModal,
        }}>
            {children}
        </CreditContext.Provider>
    );
};

export const useCredits = () => {
    const context = useContext(CreditContext);
    if (context === undefined) {
        throw new Error('useCredits must be used within a CreditProvider');
    }
    return context;
};
