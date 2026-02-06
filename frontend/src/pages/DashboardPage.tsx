import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, FileText, Zap, Clock, ArrowRight,
    Flame, Trophy, Target, Play, Crown,
    ChevronRight, TrendingUp, BookOpen
} from 'lucide-react';
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
                    const totalCredits = (data.bonusUses || 0) + (data.dailyFreeUses || 0);
                    setStats({
                        credits: totalCredits,
                        emailsGenerated: data.emailsGenerated || 0,
                        streak: data.streak || 0
                    });
                }
            })
            .catch(err => console.error('Error fetching dashboard data:', err))
            .finally(() => setLoading(false));
    }, [navigate]);

    import { SkeletonStats, SkeletonCard } from '../components/ui/Skeleton';

    // ... (inside component)

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-2 space-y-6">
                {/* Header Skeleton */}
                <div className="space-y-2 mb-8">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column Skeleton */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="h-64 bg-gray-100 rounded-3xl animate-pulse" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                    </div>

                    {/* Right Column Skeleton */}
                    <div className="space-y-4">
                        <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
                        <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
                        <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-2">
            {/* Welcome Header - Compact */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {t('dashboard.welcome', { name: user?.name || 'User' })} 👋
                </h1>
                <p className="text-gray-500 mt-1">{t('dashboard.subtitle')}</p>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN - Primary Actions (2/3 width on desktop) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Hero CTA - AI Email Generator */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => navigate('/dashboard/generator')}
                        className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-700 rounded-3xl p-8 text-white cursor-pointer group shadow-2xl shadow-indigo-200 hover:shadow-indigo-300 transition-all"
                    >
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-20 -translate-y-20" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300 rounded-full blur-2xl transform -translate-x-10 translate-y-10" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                        <Sparkles size={28} className="text-yellow-300" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{t('dashboard.quickActions.newEmail.title')}</h2>
                                        <p className="text-indigo-100 text-sm">{t('dashboard.quickActions.newEmail.desc')}</p>
                                    </div>
                                </div>
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    <ChevronRight size={32} className="text-white/70 group-hover:text-white transition-colors" />
                                </motion.div>
                            </div>

                            {/* Credits Badge */}
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                                    <Zap size={18} className="text-yellow-300" />
                                    <span className="font-bold text-lg">{stats.credits}</span>
                                    <span className="text-indigo-100 text-sm">{t('dashboard.stats.creditsToday')}</span>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white text-indigo-600 font-bold px-6 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Play size={18} fill="currentColor" />
                                    {t('dashboard.stats.useNow')}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Templates - Coming Soon */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-2 right-2 bg-gray-100 text-gray-500 text-xs font-medium px-2 py-1 rounded-full">
                                {t('dashboard.quickActions.templates.soon')}
                            </div>
                            <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{t('dashboard.quickActions.templates.title')}</h3>
                            <p className="text-gray-500 text-sm">{t('dashboard.quickActions.templates.desc')}</p>
                        </motion.div>

                        {/* Vocabulary - Coming Soon */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-2 right-2 bg-gray-100 text-gray-500 text-xs font-medium px-2 py-1 rounded-full">
                                {t('dashboard.quickActions.vocabulary.soon')}
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <BookOpen size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{t('dashboard.quickActions.vocabulary.title')}</h3>
                            <p className="text-gray-500 text-sm">{t('dashboard.quickActions.vocabulary.desc')}</p>
                        </motion.div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Stats & Gamification (1/3 width on desktop) */}
                <div className="space-y-4">
                    {/* Streak Card - Duolingo Style */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 opacity-20">
                            <Flame size={80} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Flame size={24} className="text-yellow-300" />
                                <span className="font-bold text-lg">{t('dashboard.stats.streak')}</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold">{stats.streak}</span>
                                <span className="text-orange-100">{t('dashboard.stats.days')}</span>
                            </div>
                            <p className="text-orange-100 text-sm mt-2">
                                {stats.streak > 0 ? t('dashboard.streak.keepItUp') : t('dashboard.streak.startToday')}
                            </p>
                        </div>
                    </motion.div>

                    {/* Emails Generated Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                    <TrendingUp size={20} />
                                </div>
                                <span className="font-medium text-gray-600">{t('dashboard.stats.emailsGenerated')}</span>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats.emailsGenerated}</div>
                        <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(stats.emailsGenerated * 2, 100)}%` }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{t('dashboard.streak.nextMilestone')}: {Math.ceil((stats.emailsGenerated + 1) / 10) * 10}</p>
                    </motion.div>

                    {/* Upgrade CTA - Compact */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                                <Crown size={20} />
                            </div>
                            <span className="font-bold text-indigo-900">{t('dashboard.upgrade.title')}</span>
                        </div>
                        <p className="text-sm text-indigo-700 mb-3">{t('dashboard.upgrade.subtitle')}</p>
                        <Link
                            to="/upgrade"
                            className="w-full block text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors text-sm"
                        >
                            {t('dashboard.upgrade.cta')}
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
