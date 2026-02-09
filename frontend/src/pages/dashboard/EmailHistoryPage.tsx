import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, BookOpen, CreditCard, Calendar, Check, Copy, Clock, FileText } from 'lucide-react';

interface EmailHistory {
    id: string;
    subject: string;
    body: string;
    prompt: string;
    tone: string;
    language: string;
    createdAt: string;
}

const EmailHistoryPage: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'email' | 'education' | 'payments'>('email');
    const [history, setHistory] = useState<EmailHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmail, setSelectedEmail] = useState<EmailHistory | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (activeTab === 'email') {
            fetchHistory();
        } else {
            setLoading(false); // Mock loading for other tabs
        }
    }, [activeTab]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/v1/email/history');
            if (response.ok) {
                const data = await response.json();
                setHistory(data);
                if (data.length > 0 && !selectedEmail) {
                    setSelectedEmail(data[0]);
                }
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const tabs = [
        { id: 'email', label: t('history.tabs.email'), icon: Mail },
        { id: 'payments', label: t('history.tabs.payments'), icon: CreditCard },
        { id: 'education', label: t('history.tabs.education'), icon: BookOpen },
    ] as const;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('history.title')}</h1>
                    <p className="text-gray-500 mt-1">{t('history.subtitle')}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors ${activeTab === tab.id
                            ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-lg'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
                {/* Email History Tab */}
                {activeTab === 'email' && (
                    <div className="grid lg:grid-cols-3 h-[600px]">
                        {/* List - Left Side */}
                        <div className="border-r border-gray-100 flex flex-col h-full overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-semibold text-gray-700">{t('history.tabs.email')}</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {loading ? (
                                    <div className="p-8 text-center text-gray-400">{t('common.loading')}</div>
                                ) : history.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400">{t('history.email.empty')}</div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {history.map((email) => (
                                            <button
                                                key={email.id}
                                                onClick={() => setSelectedEmail(email)}
                                                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex flex-col gap-1
                                                    ${selectedEmail?.id === email.id ? 'bg-indigo-50 hover:bg-indigo-50 border-l-4 border-indigo-600 pl-3' : 'pl-4 border-l-4 border-transparent'}`}
                                            >
                                                <h4 className="font-medium text-gray-900 line-clamp-1">{email.subject || '(No Subject)'}</h4>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {formatDate(email.createdAt)}
                                                </p>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-md uppercase tracking-wider font-semibold">
                                                        {email.tone}
                                                    </span>
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-md uppercase tracking-wider font-semibold">
                                                        {email.language === 'en' ? 'EN' : 'VI'}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Detail - Right Side */}
                        <div className="lg:col-span-2 h-full overflow-y-auto bg-gray-50/30 flex flex-col">
                            {selectedEmail ? (
                                <div className="p-8 max-w-3xl mx-auto w-full">
                                    <div className="mb-6 flex items-start justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedEmail.subject}</h2>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1.5">
                                                    <Clock size={16} />
                                                    {formatDate(selectedEmail.createdAt)}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <FileText size={16} />
                                                    {selectedEmail.tone} Tone
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(`Subject: ${selectedEmail.subject}\n\n${selectedEmail.body}`)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                                ${copied ? 'bg-green-100 text-green-700' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {copied ? <Check size={16} /> : <Copy size={16} />}
                                            {copied ? t('history.email.copied') : t('history.email.copy')}
                                        </button>
                                    </div>

                                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
                                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans">
                                            {selectedEmail.body}
                                        </div>
                                    </div>

                                    {/* Simplified Prompt Info */}
                                    <div className="mt-6 bg-indigo-50/50 p-4 rounded-xl text-sm text-gray-600 border border-indigo-50">
                                        <p className="font-medium text-indigo-900 mb-1">Original Prompt:</p>
                                        "{selectedEmail.prompt}"
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                                    <Mail size={48} className="text-gray-200 mb-4" />
                                    <p>{t('history.email.select')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Education Tab - Placeholder */}
                {activeTab === 'education' && (
                    <div className="p-8 text-center h-[500px] flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-indigo-50 text-indigo-200 rounded-full flex items-center justify-center mb-6">
                            <BookOpen size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{t('history.education.empty')}</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Your learning progress, completed lessons, and quiz scores will appear here once you start a course.
                        </p>
                    </div>
                )}

                {/* Payments Tab - Placeholder */}
                {activeTab === 'payments' && (
                    <div className="p-8">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold text-xs">
                                        <th className="pb-3 pl-4">{t('history.payments.date')}</th>
                                        <th className="pb-3">{t('history.payments.invoice')}</th>
                                        <th className="pb-3">{t('history.payments.amount')}</th>
                                        <th className="pb-3">{t('history.payments.status')}</th>
                                        <th className="pb-3 pr-4">{t('history.payments.method')}</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600">
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-400">
                                            {t('history.payments.empty')}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailHistoryPage;
