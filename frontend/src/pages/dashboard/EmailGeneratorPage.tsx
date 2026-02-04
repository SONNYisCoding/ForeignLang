import React, { useState } from 'react';
import { Send, Copy, RefreshCw, Sparkles, Check, Briefcase, MessageSquare, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import i18n hook

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
    const { t, i18n } = useTranslation(); // Use hook
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<EmailGenerateResponse | null>(null);
    const [copied, setCopied] = useState(false);

    // Form state
    const [formData, setFormData] = useState<EmailGenerateRequest>({
        prompt: '',
        tone: 'Professional',
        language: i18n.language === 'vi' ? 'vi' : 'en', // Sync with current language
        emailType: 'general',
        recipientType: 'colleague'
    });

    const handleGenerate = async () => {
        if (!formData.prompt.trim()) return;

        setLoading(true);
        setCopied(false);
        setResult(null);

        try {
            const response = await fetch('/api/v1/email/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    language: i18n.language === 'vi' ? 'vi' : 'en' // Ensure we send correct lang
                })
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data);
            } else if (response.status === 401) {
                // Redirect will be handled by Layout or protected route effectively,
                // but explicit check helps.
                window.location.href = '/login';
            } else {
                console.error('Error:', data);
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
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
                        <Sparkles className="text-white" size={24} />
                    </div>
                    {t('generator.title')}
                </h1>
                <p className="text-gray-500 mt-2 text-lg ml-14">
                    {t('generator.subtitle')}
                </p>
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
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/30 hover:-translate-y-0.5'}
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
        </div>
    );
};

export default EmailGeneratorPage;
