import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Sparkles, FileText, Zap, BookOpen,
    Flame, Play, Crown,
    ChevronRight, TrendingUp
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SkeletonCard } from '../components/ui/Skeleton';
import OnboardingModal from '../components/OnboardingModal';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user, loading: authLoading } = useAuth();

    const stats = {
        credits: user?.usageRemaining || 0,
        emailsGenerated: user?.emailsGenerated || 0,
        streak: user?.streak || 0
    };

    if (authLoading) {
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
            <OnboardingModal />

            {/* Welcome Header - Compact */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {t('dashboard.welcome', { name: user?.name || 'User' })} 👋
                </h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">{t('dashboard.subtitle')}</p>
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
                        className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-700 rounded-3xl p-8 text-white cursor-pointer group shadow-2xl shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 transition-all border border-transparent dark:border-indigo-500/30"
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
                        {/* Templates */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            onClick={() => navigate('/dashboard/templates')}
                            className="group bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="w-12 h-12 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t('dashboard.quickActions.templates.title')}</h3>
                            <p className="text-gray-500 dark:text-slate-400 text-sm">{t('dashboard.quickActions.templates.desc')}</p>
                        </motion.div>

                        {/* Vocabulary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            onClick={() => navigate('/dashboard/vocabulary')}
                            className="group bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <BookOpen size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t('dashboard.quickActions.vocabulary.title')}</h3>
                            <p className="text-gray-500 dark:text-slate-400 text-sm">{t('dashboard.quickActions.vocabulary.desc')}</p>
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
                        onClick={() => navigate('/dashboard/history')}
                        className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm cursor-pointer hover:shadow-md transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                                    <TrendingUp size={20} />
                                </div>
                                <span className="font-medium text-gray-600 dark:text-slate-300">{t('dashboard.stats.emailsGenerated')}</span>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.emailsGenerated}</div>
                        <div className="mt-3 bg-gray-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(stats.emailsGenerated * 2, 100)}%` }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                            />
                        </div>
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">{t('dashboard.streak.nextMilestone')}: {Math.ceil((stats.emailsGenerated + 1) / 10) * 10}</p>
                    </motion.div>

                    {/* Upgrade CTA - Compact */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-5 border border-indigo-100 dark:border-slate-700"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                <Crown size={20} />
                            </div>
                            <span className="font-bold text-indigo-900 dark:text-white">{t('dashboard.upgrade.title')}</span>
                        </div>
                        <p className="text-sm text-indigo-700 dark:text-slate-400 mb-3">{t('dashboard.upgrade.subtitle')}</p>
                        <Link
                            to="/upgrade"
                            className="w-full block text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-md shadow-indigo-200 dark:shadow-none"
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
