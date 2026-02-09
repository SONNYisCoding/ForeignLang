import React, { useState } from 'react';
import { Send, Copy, RefreshCw, Check, Briefcase, MessageSquare, Zap, History, Wand2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [result, setResult] = useState<EmailGenerateResponse | null>(null);
    const [copied, setCopied] = useState(false);
    const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
    const [quotaDetails, setQuotaDetails] = useState({ free: 0, sub: 0, purchased: 0 });

    // Form state
    const [formData, setFormData] = useState<EmailGenerateRequest>({
        prompt: '',
        tone: 'Professional',
        language: i18n.language === 'vi' ? 'vi' : 'en', // Sync with current language
        emailType: 'general',
        recipientType: 'colleague'
    });

    // Fetch quota on mount
    React.useEffect(() => {
        fetch('/api/v1/user/me')
            .then(res => res.json())
            .then(data => {
                if (data.usageRemaining !== undefined) {
                    setRemainingCredits(data.usageRemaining);
                    setQuotaDetails({
                        free: data.freeCredits || 0,
                        sub: data.subscriptionCredits || 0,
                        purchased: data.purchasedCredits || 0
                    });
                }
            })
            .catch(console.error);
    }, []);

    const handleGenerate = async () => {
        if (!formData.prompt.trim()) return;
        if (remainingCredits === 0) {
            showError(t('common.error') + ": No credits left!");
            return;
        }

        setLoading(true);
        setCopied(false);
        setResult(null);

        try {
            const response = await fetch('/api/v1/email/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
                    setRemainingCredits(data.remainingUses);
                    // Refresh breakdown
                    fetch('/api/v1/user/me')
                        .then(res => res.json())
                        .then(userData => {
                            if (userData.usageRemaining !== undefined) {
                                setRemainingCredits(userData.usageRemaining);
                                setQuotaDetails({
                                    free: userData.freeCredits || 0,
                                    sub: userData.subscriptionCredits || 0,
                                    purchased: userData.purchasedCredits || 0
                                });
                            }
                        });
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

    const [showAdModal, setShowAdModal] = useState(false);
    const [adTimer, setAdTimer] = useState(5);
    const [adFinished, setAdFinished] = useState(false);


    const handleWatchAd = () => {
        setShowAdModal(true);
        setAdTimer(5);
        setAdFinished(false);
        const interval = setInterval(() => {
            setAdTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setAdFinished(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleClaimReward = async () => {
        try {
            const response = await fetch('/api/v1/email/ad-reward', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (response.ok) {
                setRemainingCredits(data.remainingUses);
                // Refresh breakdown
                fetch('/api/v1/user/me')
                    .then(res => res.json())
                    .then(userData => {
                        if (userData.usageRemaining !== undefined) {
                            setRemainingCredits(userData.usageRemaining);
                            setQuotaDetails({
                                free: userData.freeCredits || 0,
                                sub: userData.subscriptionCredits || 0,
                                purchased: userData.purchasedCredits || 0
                            });
                        }
                    });

                setShowAdModal(false);
                alert(t('generator.adRewardSuccess') || 'You earned 1 credit!');
            } else {
                alert(data.error);
                setShowAdModal(false);
            }
        } catch (error) {
            console.error('Ad reward error:', error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-12 relative">
            {/* Ad Modal */}
            {showAdModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
                        <div className="bg-gray-900 h-64 flex items-center justify-center relative">
                            <Zap size={64} className="text-yellow-400 animate-pulse" />
                            <p className="text-white mt-4 absolute bottom-4">
                                {adFinished ? "Ad Completed" : `Ad Playing: ${adTimer}s`}
                            </p>
                        </div>
                        <div className="p-6 text-center">
                            <h3 className="text-xl font-bold mb-2">Watch Ad to get 1 Free Credit</h3>
                            <p className="text-gray-500 mb-6">Support us by watching a short ad to continue generating emails.</p>

                            {adFinished ? (
                                <button
                                    onClick={handleClaimReward}
                                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all"
                                >
                                    Claim Reward
                                </button>
                            ) : (
                                <button disabled className="w-full py-3 bg-gray-300 text-gray-500 font-bold rounded-xl cursor-not-allowed">
                                    Please Wait {adTimer}s...
                                </button>
                            )}

                            <button
                                onClick={() => setShowAdModal(false)}
                                className="mt-4 text-sm text-gray-400 hover:text-gray-600"
                            >
                                Close (No Reward)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Wand2 className="w-8 h-8 text-blue-600" />
                        AI Email Generator
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Create professional emails in seconds
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${remainingCredits !== null && remainingCredits > 0
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                            : 'bg-red-50 text-red-700 border-red-100'
                            }`}>
                            <span>{remainingCredits ?? 0} credits left</span>
                            <button onClick={handleWatchAd} className="ml-1 p-0.5 hover:bg-indigo-100 rounded-full text-indigo-500 transition-colors" title="Watch Ad for +1 Credit">
                                <Zap size={14} className="fill-indigo-500" />
                            </button>
                            <span className="text-xs opacity-75 border-l pl-2 border-indigo-200">
                                {quotaDetails.free} Free • {quotaDetails.sub} Sub • {quotaDetails.purchased} Extra
                            </span>
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/dashboard/history')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    <History className="w-4 h-4" />
                    History
                </button>
            </div>


            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('generator.promptLabel')}</label>
                                <textarea
                                    className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all text-gray-700 placeholder-gray-400"
                                    placeholder={t('generator.promptPlaceholder')}
                                    value={formData.prompt}
                                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('generator.recipient')}</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <select
                                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition-all cursor-pointer"
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
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('generator.purpose')}</label>
                                    <div className="relative">
                                        <Zap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <select
                                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition-all cursor-pointer"
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('generator.tone')}</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <select
                                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition-all cursor-pointer"
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
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('generator.language')}</label>
                                    <div className="flex bg-gray-100 p-1 rounded-xl">
                                        <button
                                            onClick={() => i18n.changeLanguage('vi')}
                                            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${i18n.language === 'vi' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Tiếng Việt
                                        </button>
                                        <button
                                            onClick={() => i18n.changeLanguage('en')}
                                            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${i18n.language === 'en' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            English
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={loading || !formData.prompt.trim()}
                                className={`w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-95
                                    ${loading || !formData.prompt.trim()
                                        ? 'bg-gray-300 cursor-not-allowed shadow-none'
                                        : 'bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 shadow-indigo-500/30 hover:-translate-y-0.5'}
                                `}
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="animate-spin" size={20} />
                                        {t('common.loading')}
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} className="fill-white" />
                                        {t('generator.generate')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Output Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[500px]">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                        <h3 className="font-semibold text-gray-900">{t('generator.generatedResult')}</h3>
                        <div className="flex gap-2">
                            {result && (
                                <button
                                    onClick={handleCopy}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                                        ${copied
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                                    `}
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? t('generator.copied') : t('generator.copy')}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 bg-gray-50 rounded-xl p-6 overflow-auto">
                        {result ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
                                <div className="mb-4">
                                    <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">{t('generator.subject')}</span>
                                    <input
                                        type="text"
                                        value={result.subject}
                                        readOnly
                                        className="w-full mt-1 text-lg font-semibold text-gray-900 bg-transparent border-none focus:ring-0 p-0 outline-none"
                                    />
                                </div>
                                <div className="w-full h-px bg-gray-200 mb-4" />
                                <textarea
                                    value={result.body}
                                    readOnly
                                    className="w-full flex-1 text-gray-600 leading-relaxed bg-transparent border-none focus:ring-0 resize-none p-0 outline-none"
                                />
                                <div className="mt-auto pt-4 border-t border-indigo-100 flex justify-between items-center text-sm">
                                    <span className="text-indigo-700 font-medium">{t('generator.generatedBy')}</span>
                                    <span className="text-gray-500">{t('generator.quota', { count: result.remainingUses })}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                                <div className="p-4 bg-white rounded-full shadow-sm">
                                    <Send size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">{t('generator.readyTitle')}</h3>
                                <p className="text-center max-w-xs">{t('generator.readySubtitle')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default EmailGeneratorPage;
