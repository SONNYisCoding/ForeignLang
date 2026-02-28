import { useState } from 'react';
import { Send, Copy, Check, Briefcase, MessageSquare, History, Wand2, Sparkles, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../contexts/ToastContext';
import { useCredits } from '../../contexts/CreditContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UiverseLoader from '../../components/ui/UiverseLoader';
import SparkleButton from '../../components/ui/SparkleButton';
import { motion, AnimatePresence } from 'framer-motion';

// DTOs matching backend
interface EmailGenerateRequest {
    prompt: string;
    tone: string;
    language: string;
    emailType: string;
    recipientType: string;
}

interface EmailGenerateResponse {
    success: boolean;
    subject: string;
    body: string;
    remainingUses: number;
    isPremium: boolean;
    error?: string;
}

const EmailGeneratorPage = () => {
    const { t, i18n } = useTranslation();
    const { showSuccess, showError } = useToast();
    const { credits: remainingCredits, quotaDetails, deductCredit, refreshCredits, handleWatchAd } = useCredits();
    const { user } = useAuth();
    const isPremium = user?.isPremium;
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [result, setResult] = useState<EmailGenerateResponse | null>(null);
    const [copied, setCopied] = useState(false);

    // Form state
    const [formData, setFormData] = useState<EmailGenerateRequest>({
        prompt: '',
        tone: 'Professional',
        language: i18n.language === 'vi' ? 'vi' : 'en',
        emailType: 'general',
        recipientType: 'colleague'
    });

    const handleGenerate = async () => {
        if (loading) return;
        if (!formData.prompt.trim()) return;
        if (remainingCredits === 0) {
            showError(t('common.error') + ": No credits left!");
            return;
        }

        setLoading(true);
        setCopied(false);
        setResult(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/v1/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                credentials: 'include', // Ensure session cookies are sent
                body: JSON.stringify({
                    ...formData,
                    language: i18n.language === 'vi' ? 'vi' : 'en' // Ensure we send correct lang
                })
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data);
                if (data.remainingUses !== undefined) {
                    deductCredit();
                    // Refresh from server to sync
                    refreshCredits();
                }
            } else if (response.status === 429) {
                if (isPremium) {
                    showError("To ensure high speeds for everyone, you have reached the daily Fair Use limit. Please try again tomorrow!");
                } else {
                    showError(data.error || "You've used all your AI credits for today.");
                }
            } else if (response.status === 401) {
                // Redirect will be handled by Layout or protected route effectively,
                // but explicit check helps.
                // window.location.href = '/login';
                showError("Session expired or unauthorized (401). Check console for details.");
                console.error("401 Unauthorized received from backend. Response body:", data);
            } else {
                console.error('Error:', data);
                showError(data.error || 'Generation failed');
            }
        } catch (error) {
            console.error('Network error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!result) return;
        const textToCopy = `Subject: ${result.subject}\n\n${result.body}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        showSuccess('Email copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto px-4 pb-16 pt-6 relative"
        >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300 flex items-center gap-4 tracking-tight mb-4">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
                            <Wand2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        AI Email Generator
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-slate-400 font-medium max-w-xl">
                        Instantly craft professional, perfectly-toned bilingual emails tailored to your exact needs.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        {!isPremium && (
                            <div className={`inline-flex items-center rounded-xl p-1.5 pr-4 border shadow-sm transition-colors ${remainingCredits !== null && remainingCredits > 0
                                ? 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-indigo-900/50 shadow-indigo-500/5'
                                : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-700'
                                }`}>
                                <div className="flex flex-col px-3">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${remainingCredits !== null && remainingCredits > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600 dark:text-red-400'}`}>
                                        Credits Remaining
                                    </span>
                                    <span className={`text-xl font-black ${remainingCredits !== null && remainingCredits > 0 ? 'text-gray-900 dark:text-white' : 'text-red-700 dark:text-red-300'}`}>
                                        {remainingCredits ?? 0}
                                    </span>
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
                </div>

                <button
                    onClick={() => navigate('/dashboard/history')}
                    className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm hover:shadow"
                >
                    <History className="w-4 h-4" />
                    History & Drafts
                </button>
            </div>


            <div className="grid lg:grid-cols-2 gap-8 relative z-10">
                {/* Input Section */}
                <div className="space-y-6 flex flex-col h-full">
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-indigo-500/5 dark:shadow-none border border-gray-100 dark:border-slate-800 flex-1 flex flex-col">
                        <div className="space-y-6 flex-1">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wide">{t('generator.promptLabel')}</label>
                                <textarea
                                    className="w-full h-44 p-5 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200/60 dark:border-slate-700/60 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-all text-gray-700 dark:text-white placeholder-gray-400 shadow-inner group-hover:border-indigo-300"
                                    placeholder={t('generator.promptPlaceholder')}
                                    value={formData.prompt}
                                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wide">{t('generator.recipient')}</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <select
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200/60 dark:border-slate-700/60 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none transition-all cursor-pointer dark:text-white font-medium shadow-inner"
                                            value={formData.recipientType}
                                            onChange={(e) => setFormData({ ...formData, recipientType: e.target.value })}
                                        >
                                            <option value="manager">Manager / Boss</option>
                                            <option value="colleague">Colleague</option>
                                            <option value="client">Client</option>
                                            <option value="HR">HR</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wide">{t('generator.purpose')}</label>
                                    <div className="relative">
                                        <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <select
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200/60 dark:border-slate-700/60 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none transition-all cursor-pointer dark:text-white font-medium shadow-inner"
                                            value={formData.emailType}
                                            onChange={(e) => setFormData({ ...formData, emailType: e.target.value })}
                                        >
                                            <option value="general">General</option>
                                            <option value="request">Request</option>
                                            <option value="followup">Follow up</option>
                                            <option value="apology">Apology</option>
                                            <option value="thankyou">Thank you</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wide">{t('generator.tone')}</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <select
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200/60 dark:border-slate-700/60 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none transition-all cursor-pointer dark:text-white font-medium shadow-inner"
                                            value={formData.tone}
                                            onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                                        >
                                            <option value="Professional">Professional</option>
                                            <option value="Friendly">Friendly</option>
                                            <option value="Direct">Direct</option>
                                            <option value="Urgent">Urgent</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wide">{t('generator.language')}</label>
                                    <div className="flex bg-gray-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-gray-200/50 dark:border-slate-700/50">
                                        <button
                                            onClick={() => i18n.changeLanguage('vi')}
                                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${i18n.language === 'vi' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'}`}
                                        >
                                            Tiếng Việt
                                        </button>
                                        <button
                                            onClick={() => i18n.changeLanguage('en')}
                                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${i18n.language === 'en' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'}`}
                                        >
                                            English
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
                            <SparkleButton
                                onClick={handleGenerate}
                                disabled={!formData.prompt.trim()}
                                loading={loading}
                                text={t('generator.generate') || 'Generate Email'}
                                variant="primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Output Section */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-blue-500/5 dark:shadow-none border border-gray-100 dark:border-slate-800 flex flex-col h-full min-h-[550px]">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Sparkles className="text-blue-500" size={24} />
                            {t('generator.generatedResult')}
                        </h3>
                        <div className="flex gap-2">
                            <AnimatePresence>
                                {result && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onClick={handleCopy}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
                                            ${copied
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-inner'
                                                : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'}
                                        `}
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                        {copied ? t('generator.copied') : t('generator.copy')}
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex-1 bg-gradient-to-br from-gray-50 to-white dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl p-6 border border-gray-100/50 dark:border-slate-700/50 relative overflow-hidden shadow-inner group transition-colors focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-200 dark:focus-within:border-blue-800">
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center rounded-2xl"
                            >
                                <UiverseLoader text={t('common.loading') || 'AI IS CRAFTING...'} size="lg" />
                            </motion.div>
                        )}

                        {result ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: loading ? 0.3 : 1, y: 0 }}
                                className={`h-full flex flex-col transition-all`}
                            >
                                <div className="mb-6 relative">
                                    <span className="absolute -top-3 left-3 bg-white dark:bg-slate-800 px-2 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest z-10">
                                        {t('generator.subject')}
                                    </span>
                                    <input
                                        type="text"
                                        value={result.subject}
                                        readOnly
                                        className="w-full pt-4 pb-3 px-4 text-xl font-black text-gray-900 dark:text-white bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-0 outline-none shadow-sm"
                                    />
                                </div>

                                <div className="relative flex-1 flex flex-col">
                                    <span className="absolute -top-3 left-3 bg-white dark:bg-slate-800 px-2 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest z-10">
                                        Message Body
                                    </span>
                                    <textarea
                                        value={result.body}
                                        readOnly
                                        className="w-full flex-1 pt-4 pb-4 px-4 text-gray-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-0 resize-none outline-none shadow-sm"
                                    />
                                </div>
                                <div className="mt-6 flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
                                    <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                        <Wand2 size={12} /> {t('generator.generatedBy')}
                                    </span>
                                    <span className="text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                                        {t('generator.quota', { count: result.remainingUses })}
                                    </span>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: loading ? 0 : 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-slate-500 space-y-6 text-center"
                            >
                                <div className="relative group/icon cursor-pointer">
                                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl scale-150 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-700"></div>
                                    <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center relative z-10 border border-gray-100 dark:border-slate-700 group-hover/icon:scale-110 transition-transform duration-500">
                                        <Send size={40} className="text-blue-500 transform translate-x-1 -translate-y-1 group-hover/icon:translate-x-2 group-hover/icon:-translate-y-2 transition-transform duration-500" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('generator.readyTitle')}</h3>
                                    <p className="max-w-xs mx-auto text-sm leading-relaxed">{t('generator.readySubtitle')}</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EmailGeneratorPage;
