import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, FileText, Zap, Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DashboardStats {
    credits: number;
    emailsGenerated: number;
    streak: number;
}

const DashboardPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [user, setUser] = useState<{ name: string } | null>(null);
    const [stats, setStats] = useState<DashboardStats>({
        credits: 0,
        emailsGenerated: 0,
        streak: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/v1/user/me', { credentials: 'include' })
            .then(res => {
                if (res.status === 401) {
                    navigate('/login');
                    return null;
                }
                return res.json();
            })
            .then(data => {
                if (data) {
                    setUser({ name: data.name || 'User' });
                    // Calculate total credits (bonus + daily)
                    const totalCredits = (data.bonusUses || 0) + (data.dailyFreeUses || 0);
                    setStats({
                        credits: totalCredits,
                        emailsGenerated: 0, // Placeholder as backend doesn't track this yet
                        streak: 1 // Placeholder
                    });
                }
            })
            .catch(err => console.error('Error fetching dashboard data:', err))
            .finally(() => setLoading(false));
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    {t('dashboard.welcome', { name: user?.name || 'User' })} 👋
                </h1>
                <p className="text-gray-500 mt-2 text-lg">{t('dashboard.subtitle')}</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles size={100} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-indigo-100 font-medium mb-1">{t('dashboard.stats.creditsToday')}</p>
                        <h3 className="text-4xl font-bold mb-4">{stats.credits}</h3>
                        <Link
                            to="/dashboard/generator"
                            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors backdrop-blur-sm"
                        >
                            <Zap size={16} />
                            {t('dashboard.stats.useNow')}
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <FileText size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">{t('dashboard.stats.emailsGenerated')}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.emailsGenerated}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">{t('dashboard.stats.streak')}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.streak} {t('dashboard.stats.days')}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('dashboard.quickActions.title')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                    onClick={() => navigate('/dashboard/generator')}
                    className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
                >
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Sparkles size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{t('dashboard.quickActions.newEmail.title')}</h3>
                    <p className="text-gray-500 text-sm mb-4 flex-1">
                        {t('dashboard.quickActions.newEmail.desc')}
                    </p>
                    <div className="flex items-center text-indigo-600 font-medium text-sm">
                        {t('dashboard.quickActions.newEmail.cta')} <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>

                <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full opacity-70">
                    <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileText size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{t('dashboard.quickActions.templates.title')}</h3>
                    <p className="text-gray-500 text-sm mb-4 flex-1">
                        {t('dashboard.quickActions.templates.desc')}
                    </p>
                    <div className="text-gray-400 text-sm italic">{t('dashboard.quickActions.templates.soon')}</div>
                </div>

                <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full opacity-70">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Zap size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{t('dashboard.quickActions.vocabulary.title')}</h3>
                    <p className="text-gray-500 text-sm mb-4 flex-1">
                        {t('dashboard.quickActions.vocabulary.desc')}
                    </p>
                    <div className="text-gray-400 text-sm italic">{t('dashboard.quickActions.vocabulary.soon')}</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
