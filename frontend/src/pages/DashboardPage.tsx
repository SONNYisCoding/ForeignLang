import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    Sparkles, FileText, BookOpen,
    Crown,
    ChevronRight, TrendingUp, PenTool, Map
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OnboardingModal from '../components/OnboardingModal';
import { useAuth } from '../contexts/AuthContext';
import { useCredits } from '../contexts/CreditContext';
import StreakCalendar from '../components/gamification/StreakCalendar';
import Leaderboard from '../components/gamification/Leaderboard';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user, loading: authLoading } = useAuth();
    const { credits: globalCredits } = useCredits();
    const [groupId] = useState<string | null>(null);
    const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('dashboardIntroShown'));

    useEffect(() => {
        const fetchUserGroup = async () => { };
        fetchUserGroup();
    }, []);

    useEffect(() => {
        if (showIntro) {
            const timer = setTimeout(() => {
                setShowIntro(false);
                sessionStorage.setItem('dashboardIntroShown', 'true');
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [showIntro]);

    const stats = {
        credits: globalCredits ?? user?.usageRemaining ?? 0,
        emailsGenerated: user?.emailsGenerated || 0,
        streak: user?.streak || 0
    };

    if (authLoading) {
        return (
            <div className="max-w-6xl mx-auto px-2 space-y-6">
                <div className="space-y-4 w-full max-w-md px-4 mt-20 mx-auto">
                    <div className="h-12 w-3/4 mx-auto bg-gray-200 rounded animate-pulse" />
                    <div className="h-64 w-full bg-gray-100 rounded-xl animate-pulse" />
                </div>
            </div>
        );
    }

    if (showIntro) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-900 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center relative z-10"
                >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 mb-4 pb-2">
                            {t('dashboard.welcome', { name: user?.name || 'User' })} 👋
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-medium">
                            {t('dashboard.subtitle', 'What would you like to improve today?')}
                        </p>
                    </motion.div>
                </motion.div>

                {/* Decorative background elements */}
                <motion.div
                    className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-[100px] -translate-y-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <motion.div
                    className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-[100px] -translate-y-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto px-2"
        >
            <OnboardingModal />

            {/* ═══ PRIMARY FEATURES — Equal Visual Weight Hero Grid ═══ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1: AI Email Generator */}
                <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                    onClick={() => navigate('/dashboard/generator')}
                    className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-600 rounded-3xl p-7 text-white cursor-pointer group shadow-[0_20px_50px_-12px_rgba(79,70,229,0.4)] dark:shadow-none transition-all border border-indigo-400/30"
                >
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
                        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl translate-x-10 -translate-y-10" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm w-fit mb-4">
                            <Sparkles size={28} className="text-yellow-300" />
                        </div>
                        <h2 className="text-xl font-extrabold mb-1">{t('dashboard.quickActions.newEmail.title')}</h2>
                        <p className="text-indigo-100 text-sm mb-5 flex-1">{t('dashboard.quickActions.newEmail.desc')}</p>
                        <div className="flex items-center justify-between">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-2 text-sm">
                                <span className="text-indigo-100 text-xs font-semibold">Start composing →</span>
                            </div>
                            <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                <ChevronRight size={24} className="text-white/60 group-hover:text-white transition-colors" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Card 2: AI Email Feedback */}
                <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    onClick={() => navigate('/dashboard/feedback')}
                    className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-violet-500 to-fuchsia-600 rounded-3xl p-7 text-white cursor-pointer group shadow-[0_20px_50px_-12px_rgba(147,51,234,0.4)] dark:shadow-none transition-all border border-purple-400/30"
                >
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
                        <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }} className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-x-10 translate-y-10" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm w-fit mb-4">
                            <PenTool size={28} className="text-pink-200" />
                        </div>
                        <h2 className="text-xl font-extrabold mb-1">AI Email Feedback</h2>
                        <p className="text-purple-100 text-sm mb-5 flex-1">Check grammar, tone & vocabulary with instant AI scoring.</p>
                        <div className="flex items-center justify-between">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-2 text-sm">
                                <span className="text-purple-100 text-xs font-semibold">Analyze your email →</span>
                            </div>
                            <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}>
                                <ChevronRight size={24} className="text-white/60 group-hover:text-white transition-colors" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Card 3: Personalized Learning Roadmap */}
                <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    onClick={() => navigate('/dashboard/roadmap')}
                    className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-600 rounded-3xl p-7 text-white cursor-pointer group shadow-[0_20px_50px_-12px_rgba(16,185,129,0.4)] dark:shadow-none transition-all border border-emerald-400/30"
                >
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
                        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }} className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-x-10 -translate-y-10" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm w-fit mb-4">
                            <Map size={28} className="text-emerald-200" />
                        </div>
                        <h2 className="text-xl font-extrabold mb-1">My Learning Roadmap</h2>
                        <p className="text-emerald-100 text-sm mb-5 flex-1">Personalized learning path tailored to your career goals.</p>
                        <div className="flex items-center justify-between">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-2 text-sm">
                                <span className="text-emerald-100 text-xs font-bold">Not set up yet</span>
                            </div>
                            <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}>
                                <ChevronRight size={24} className="text-white/60 group-hover:text-white transition-colors" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ═══ SECONDARY CONTENT GRID ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN — Secondary Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Templates */}
                        <motion.div
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, type: 'spring', stiffness: 300 }}
                            onClick={() => navigate('/dashboard/templates')}
                            className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 rounded-3xl border border-white/50 dark:border-slate-700/50 shadow-lg shadow-indigo-100/20 dark:shadow-none cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform shadow-inner">
                                <FileText size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{t('dashboard.quickActions.templates.title')}</h3>
                            <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">{t('dashboard.quickActions.templates.desc')}</p>
                        </motion.div>

                        {/* Vocabulary */}
                        <motion.div
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
                            onClick={() => navigate('/dashboard/vocabulary')}
                            className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 rounded-3xl border border-white/50 dark:border-slate-700/50 shadow-lg shadow-emerald-100/20 dark:shadow-none cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4 group-hover:-rotate-6 transition-transform shadow-inner">
                                <BookOpen size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{t('dashboard.quickActions.vocabulary.title')}</h3>
                            <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">{t('dashboard.quickActions.vocabulary.desc')}</p>
                        </motion.div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Stats & Gamification (1/3 width on desktop) */}
                <div className="space-y-6">
                    {/* Gamification: Streak Calendar */}
                    <StreakCalendar />

                    {/* Gamification: Leaderboard (Optional based on group) */}
                    {groupId ? (
                        <Leaderboard groupId={groupId} />
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center opacity-70">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
                                <Crown className="text-gray-400" size={24} />
                            </div>
                            <h3 className="font-bold text-gray-700 dark:text-gray-200">Class Leaderboard</h3>
                            <p className="text-sm text-gray-500 mt-1">Join a class to see your ranking and compete with friends.</p>
                        </div>
                    )}

                    {/* Emails Generated Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        onClick={() => navigate('/dashboard/history')}
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-white dark:border-slate-700/50 shadow-xl shadow-blue-900/5 dark:shadow-none cursor-pointer group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-600 dark:text-blue-400 rounded-xl shadow-inner group-hover:scale-110 transition-transform">
                                    <TrendingUp size={22} />
                                </div>
                                <span className="font-semibold text-gray-700 dark:text-slate-300">{t('dashboard.stats.emailsGenerated')}</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors group-hover:translate-x-1" />
                        </div>

                        <div className="flex items-baseline gap-2">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
                            >
                                {stats.emailsGenerated}
                            </motion.div>
                            <span className="text-sm text-gray-400 font-medium">total emails</span>
                        </div>

                        <div className="mt-4 bg-gray-100/80 dark:bg-slate-700/80 rounded-full h-2.5 overflow-hidden shadow-inner flex">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(stats.emailsGenerated * 2, 100)}%` }}
                                transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            />
                        </div>
                        <p className="text-xs font-medium text-gray-400 dark:text-slate-500 mt-3 flex justify-between">
                            <span>Progress to next milestone</span>
                            <span className="text-blue-600 dark:text-blue-400">{Math.ceil((stats.emailsGenerated + 1) / 10) * 10}</span>
                        </p>
                    </motion.div>

                    {/* Upgrade CTA - Compact */}
                    {!user?.isPremium && (
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
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default DashboardPage;
