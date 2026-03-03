import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, FileText, RotateCcw, Zap, Crown, X, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import UiverseLoader from '../../components/ui/UiverseLoader';
import AnnotatedTextPanel from '../../components/feedback/AnnotatedTextPanel';
import ScoreDashboard from '../../components/feedback/ScoreDashboard';
import SuggestionsSidebar from '../../components/feedback/SuggestionsSidebar';
import { getMockFeedback, SAMPLE_EMAIL } from '../../data/mockFeedbackData';
import { useCredits } from '../../contexts/CreditContext';
import { useAuth } from '../../contexts/AuthContext';
import type { FeedbackResult } from '../../data/mockFeedbackData';

// History item stored in localStorage
interface HistoryItem {
    id: string;
    emailSnippet: string;
    overallScore: number;
    timestamp: number;
    emailInput: string;
    result: FeedbackResult;
}

const HISTORY_KEY = 'foreignlang_feedback_history';

const loadHistory = (): HistoryItem[] => {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
};

const saveHistory = (items: HistoryItem[]) => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 20))); // Keep max 20
};

const EmailFeedbackPage: React.FC = () => {
    const navigate = useNavigate();
    // ═══ Global Credit System — Single Source of Truth ═══
    const {
        credits, quotaDetails,
        deductCredit, refreshCredits,
        handleWatchAd //showAdModal, adTimer, adFinished, handleClaimReward, closeAdModal
    } = useCredits();
    const { user } = useAuth();
    const isPremium = user?.isPremium;

    const [emailInput, setEmailInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<FeedbackResult | null>(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // ═══ History System — localStorage-backed ═══
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

    useEffect(() => {
        setHistory(loadHistory());
    }, []);

    const handleAnalyze = async () => {
        if (isAnalyzing) return;
        if (!emailInput.trim()) return;

        if (!isPremium && credits !== null && credits <= 0) {
            setShowUpgradeModal(true);
            return;
        }

        setIsAnalyzing(true);
        setResult(null);
        setActiveHistoryId(null);

        try {
            // ═══ Server-side credit deduction (matching EmailGeneratorPage) ═══
            const token = localStorage.getItem('token');
            const res = await fetch('/api/v1/quota/consume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                credentials: 'include',
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                if (res.status === 429) {
                    if (isPremium) {
                        toast.error('To ensure high speeds for everyone, you have reached the daily Fair Use limit. Please try again tomorrow!');
                    } else {
                        setShowUpgradeModal(true);
                    }
                } else {
                    toast.error('Network or server error during credit deduction.');
                }
                console.error('Credit deduction failed:', errData);
                setIsAnalyzing(false);
                return;
            }

            // Optimistic UI update (skip for PRO — they have ∞)
            if (!isPremium) deductCredit();

            // Simulate AI analysis delay
            await new Promise(resolve => setTimeout(resolve, 2500));

            const feedback = getMockFeedback(emailInput);
            setResult(feedback);

            // Push to history
            const newItem: HistoryItem = {
                id: Date.now().toString(),
                emailSnippet: emailInput.slice(0, 80) + (emailInput.length > 80 ? '...' : ''),
                overallScore: feedback.scores.overall,
                timestamp: Date.now(),
                emailInput,
                result: feedback,
            };
            const updated = [newItem, ...history].slice(0, 20);
            setHistory(updated);
            saveHistory(updated);
            setActiveHistoryId(newItem.id);

            // Sync credits from server (server HAS deducted now)
            refreshCredits();
        } catch (error) {
            console.error('Analysis error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setEmailInput('');
        setActiveHistoryId(null);
    };

    const handleLoadSample = () => setEmailInput(SAMPLE_EMAIL);

    const handleSelectHistory = (item: HistoryItem) => {
        setEmailInput(item.emailInput);
        setResult(item.result);
        setActiveHistoryId(item.id);
    };

    const formatTime = (ts: number) => {
        const d = new Date(ts);
        return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const scoreColor = (s: number) => s >= 80 ? 'text-emerald-500' : s >= 60 ? 'text-amber-500' : 'text-red-500';

    return (
        <div className="max-w-[90rem] mx-auto flex gap-6">
            {/* ═══ Left: History Sidebar ═══ */}
            <div className="hidden lg:flex flex-col w-72 shrink-0">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Clock size={16} className="text-indigo-500" /> Recent Feedbacks
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{history.length} analyses saved</p>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {history.length === 0 ? (
                            <div className="p-6 text-center text-slate-400 text-sm">No feedbacks yet. Analyze an email to start!</div>
                        ) : (
                            history.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelectHistory(item)}
                                    className={`w-full text-left p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-indigo-50/50 dark:hover:bg-slate-750 transition-colors group ${activeHistoryId === item.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-2 border-l-indigo-500' : ''
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium line-clamp-2 leading-snug">{item.emailSnippet}</p>
                                        <ChevronRight size={14} className="text-slate-300 shrink-0 mt-0.5 group-hover:text-indigo-500 transition-colors" />
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-slate-400">{formatTime(item.timestamp)}</span>
                                        <span className={`text-xs font-black ${scoreColor(item.overallScore)}`}>{item.overallScore}/100</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ═══ Main Content ═══ */}
            <div className="flex-1 min-w-0">
                {/* Out of Credits Modal */}
                <AnimatePresence>
                    {showUpgradeModal && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowUpgradeModal(false)}>
                            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} onClick={e => e.stopPropagation()} className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                                <button onClick={() => setShowUpgradeModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4"><Crown size={32} className="text-amber-500" /></div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Out of AI Credits!</h2>
                                    <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">Upgrade to Premium or watch an ad for a free credit.</p>
                                    <button onClick={() => navigate('/upgrade')} className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"><Crown size={18} /> Upgrade to Premium</button>
                                    {quotaDetails.adsWatched >= 2 ? (
                                        <button disabled className="w-full mt-3 py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2"><Zap size={16} /> Daily Ad Limit Reached</button>
                                    ) : (
                                        <button onClick={() => { setShowUpgradeModal(false); handleWatchAd(); }} className="w-full mt-3 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2"><Zap size={16} /> Watch Ad for +1 Credit</button>
                                    )}
                                    <button onClick={() => setShowUpgradeModal(false)} className="mt-3 text-sm text-slate-400 hover:text-slate-600 transition-colors">Maybe later</button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Page Header with Credit Badge */}
                <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">AI Email Feedback</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Paste your email and get instant grammar, tone, and vocabulary analysis.</p>
                    </div>
                    {!isPremium && (
                        <div className={`inline-flex items-center rounded-xl p-1.5 pr-4 border shadow-sm transition-colors ${credits !== null && credits > 0
                            ? 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-indigo-900/50 shadow-indigo-500/5'
                            : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'
                            }`}>
                            <div className="flex flex-col px-3">
                                <span className={`text-xs font-bold uppercase tracking-wider ${credits !== null && credits > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600 dark:text-red-400'}`}>Credits</span>
                                <span className={`text-xl font-black ${credits !== null && credits > 0 ? 'text-gray-900 dark:text-white' : 'text-red-700 dark:text-red-300'}`}>{credits ?? 0}</span>
                            </div>
                            <div className="h-10 w-px bg-gray-200 dark:bg-slate-700 mx-2" />
                            <div className="flex flex-col text-xs font-medium text-gray-500 dark:text-slate-400 leading-tight">
                                <span>{quotaDetails.free} Free</span>
                                <span>{quotaDetails.sub + quotaDetails.purchased} Premium</span>
                            </div>
                            {quotaDetails.adsWatched >= 2 ? (
                                <button disabled className="ml-4 p-2.5 bg-gray-100 dark:bg-slate-800 rounded-lg text-gray-400 dark:text-slate-500 cursor-not-allowed group relative" title="Daily ad limit reached">
                                    <Zap size={18} />
                                </button>
                            ) : (
                                <button onClick={handleWatchAd} className="ml-4 p-2.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400 transition-colors group relative" title="Watch Ad for +1 Credit">
                                    <Zap size={18} className="group-hover:fill-current group-hover:animate-pulse" />
                                    <span className="absolute -top-2 -right-2 flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 text-[9px] text-white items-center justify-center font-bold">+1</span>
                                    </span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {isAnalyzing && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32">
                            <UiverseLoader />
                            <h2 className="mt-8 text-xl font-bold text-slate-900 dark:text-white">Analyzing your email...</h2>
                            <p className="mt-2 text-slate-500">Our AI is checking grammar, tone, and vocabulary.</p>
                        </motion.div>
                    )}

                    {!isAnalyzing && !result && (
                        <motion.div key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6 md:p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white"><FileText size={20} /></div>
                                    <div>
                                        <h2 className="font-bold text-slate-900 dark:text-white">Paste Your Email</h2>
                                        <p className="text-sm text-slate-500">English business emails work best</p>
                                    </div>
                                </div>
                                <button onClick={handleLoadSample} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Load Sample</button>
                            </div>
                            <textarea value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="Dear Mr. Johnson,&#10;&#10;I want to talk about the thing we discussed last week..." className="w-full h-64 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm leading-relaxed transition-all" />
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-sm text-slate-400">{emailInput.length} chars</span>
                                <button onClick={handleAnalyze} disabled={!emailInput.trim()} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"><Send size={18} /> Analyze Email</button>
                            </div>
                        </motion.div>
                    )}

                    {!isAnalyzing && result && (
                        <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="flex items-center justify-end mb-6">
                                <button onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><RotateCcw size={16} /> Analyze Another</button>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6"><AnnotatedTextPanel originalText={emailInput} annotations={result.annotations} /></div>
                                <div className="space-y-6">
                                    <ScoreDashboard scores={result.scores} />
                                    <SuggestionsSidebar suggestions={result.suggestions} summary={result.summary} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default EmailFeedbackPage;
