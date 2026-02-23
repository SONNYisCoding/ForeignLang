import { useState, useEffect } from 'react';
import { BarChart, Activity, Users, Clock, LineChart, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const TeacherAnalytics = () => {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);
    const [statsData, setStatsData] = useState({
        totalLearningHours: 0,
        activeStudents: 0,
        completionRate: 0,
        avgScore: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/v1/teacher/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStatsData(data);
                }
            } catch (error) {
                console.error("Failed to fetch teacher stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { label: t('teacher.analytics.learningHours'), value: statsData?.totalLearningHours?.toLocaleString() || '0', change: '+12%', icon: Clock, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40', border: 'border-blue-200/50 dark:border-blue-800/50' },
        { label: t('teacher.analytics.activeStudents'), value: statsData?.activeStudents?.toString() || '0', change: '+5%', icon: Users, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/40', border: 'border-indigo-200/50 dark:border-indigo-800/50' },
        { label: t('teacher.analytics.completionRate'), value: `${statsData?.completionRate || 0}%`, change: '+3%', icon: Activity, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40', border: 'border-emerald-200/50 dark:border-emerald-800/50' },
        { label: t('teacher.analytics.avgScore'), value: `${statsData?.avgScore || 0}/100`, change: '+1%', icon: BarChart, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/40', border: 'border-purple-200/50 dark:border-purple-800/50' },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 max-w-7xl mx-auto">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Gathering insights...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-7xl mx-auto pb-12"
        >
            {/* Background Effects */}
            <div className="fixed top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-50/50 dark:from-indigo-950/10 to-transparent pointer-events-none -z-10" />
            <div className="absolute top-40 right-40 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 dark:border-slate-800/60 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-50/50 dark:from-indigo-900/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <TrendingUp size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">{t('teacher.analytics.title') || 'Performance Analytics'}</h1>
                        <p className="text-gray-500 dark:text-slate-400 font-medium">{t('teacher.analytics.subtitle') || 'Gain actionable insights into student engagement and success.'}</p>
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 }
                    }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0 }
                        }}
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-gray-100/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 relative overflow-hidden group"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-white/50 to-white/0 dark:from-slate-700/50 dark:to-slate-700/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] z-0 pointer-events-none" />

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner ${stat.bg} ${stat.color} ${stat.border}`}>
                                <stat.icon size={26} className="group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <span className="text-xs font-black px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-800/50 shadow-sm flex items-center gap-1">
                                {stat.change} <TrendingUp size={10} />
                            </span>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{stat.value}</h3>
                            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-8 rounded-[2rem] border border-gray-100/50 dark:border-slate-700/50 h-[400px] flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
                    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-white dark:ring-slate-800 group-hover:ring-indigo-100 dark:group-hover:ring-indigo-900/50 transition-all duration-500">
                        <LineChart size={40} className="text-indigo-400 dark:text-indigo-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('teacher.analytics.engagement') || 'Student Engagement Trends'}</h3>
                    <p className="text-gray-500 dark:text-slate-400 font-medium max-w-sm">{t('teacher.analytics.comingSoon') || 'Detailed charts and visual engagement data are being crafted and will be available soon.'}</p>
                    <div className="mt-8 px-4 py-2 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                        Coming Soon
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-8 rounded-[2rem] border border-gray-100/50 dark:border-slate-700/50 h-[400px] flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
                    <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-white dark:ring-slate-800 group-hover:ring-purple-100 dark:group-hover:ring-purple-900/50 transition-all duration-500">
                        <Activity size={40} className="text-purple-400 dark:text-purple-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('teacher.analytics.performance') || 'Performance Distribution'}</h3>
                    <p className="text-gray-500 dark:text-slate-400 font-medium max-w-sm">{t('teacher.analytics.comingSoon') || 'Comprehensive breakdowns of student scores and completion rates will appear here.'}</p>
                    <div className="mt-8 px-4 py-2 bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 rounded-full text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                        Coming Soon
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default TeacherAnalytics;
