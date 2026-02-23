import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, FileText, CheckSquare, Activity, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

interface DashboardStats {
    totalUsers: number;
    totalLearners: number;
    totalTeachers: number;
    totalLessons: number;
    pendingApprovals: number;
    recentActivity: number;
}

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalLearners: 0,
        totalTeachers: 0,
        totalLessons: 0,
        pendingApprovals: 0,
        recentActivity: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/v1/admin/stats', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    setStats({
                        totalUsers: data.totalUsers,
                        totalLearners: data.totalLearners,
                        totalTeachers: data.totalTeachers,
                        totalLessons: data.totalLessons,
                        pendingApprovals: data.pendingApprovals,
                        recentActivity: data.activeToday
                    });
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { label: t('admin.stats.totalUsers'), value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600', link: '/admin/users' },
        { label: t('admin.stats.learners'), value: stats.totalLearners, icon: Users, color: 'from-emerald-500 to-emerald-600', link: '/admin/users?role=LEARNER' },
        { label: t('admin.stats.teachers'), value: stats.totalTeachers, icon: Users, color: 'from-purple-500 to-purple-600', link: '/admin/users?role=TEACHER' },
        { label: t('admin.stats.lessons'), value: stats.totalLessons, icon: BookOpen, color: 'from-amber-500 to-amber-600', link: '/admin/lessons' },
        { label: t('admin.stats.pendingApproval'), value: stats.pendingApprovals, icon: CheckSquare, color: 'from-red-500 to-red-600', link: '/admin/approval', urgent: stats.pendingApprovals > 0 },
        { label: t('admin.stats.activeToday'), value: stats.recentActivity, icon: Activity, color: 'from-teal-500 to-teal-600', link: '/admin/analytics' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-7xl mx-auto pb-12 relative"
        >
            {/* Background Effects */}
            <div className="fixed top-0 inset-x-0 h-64 bg-gradient-to-b from-slate-50 dark:from-slate-950/20 to-transparent pointer-events-none -z-10" />

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 dark:border-slate-800/60 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-slate-100/50 dark:from-slate-800/20 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">{t('admin.dashboard')}</h1>
                        <p className="text-gray-500 dark:text-slate-400 font-medium">{t('admin.welcome')}</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={card.label}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: { opacity: 1, y: 0 }
                            }}
                        >
                            <Link
                                to={card.link}
                                className={`block p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl border border-gray-100/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-500/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group ${card.urgent ? 'ring-2 ring-red-400 dark:ring-red-500 shadow-red-500/10' : ''}`}
                            >
                                {/* Glow Effect */}
                                <div className={`absolute -inset-0.5 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity rounded-[2rem] z-0 pointer-events-none`} />

                                {card.urgent && (
                                    <span className="absolute top-4 right-4 flex h-3 w-3 shadow-sm">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                )}
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-md relative z-10`}>
                                    <Icon size={26} />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-4xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">
                                        {loading ? <div className="h-10 w-24 bg-gray-200 dark:bg-slate-700 animate-pulse rounded-lg mt-1 mb-2"></div> : card.value.toLocaleString()}
                                    </p>
                                    <p className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">{card.label}</p>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Approvals */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-[2rem] border border-gray-100/50 dark:border-slate-700/50 p-8 shadow-sm flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <CheckSquare className="text-indigo-500" size={24} />
                            {t('admin.approvals.title')}
                        </h2>
                        <Link to="/admin/approval" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group">
                            {t('admin.approvals.viewAll')}
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="flex-1">
                        {stats.pendingApprovals > 0 ? (
                            <div className="space-y-4">
                                {[1, 2, 3].slice(0, Math.min(3, stats.pendingApprovals)).map((_, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl border border-amber-100/50 dark:border-amber-800/30 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors group">
                                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                                            <FileText size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 dark:text-white text-lg">{t('admin.approvals.lesson')} #{i + 1}</p>
                                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{t('admin.approvals.submittedBy')} Teacher</p>
                                        </div>
                                        <button className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-95 text-center mt-2 sm:mt-0">
                                            {t('admin.approvals.review')}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col justify-center items-center py-12 text-center">
                                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4 text-emerald-500">
                                    <CheckSquare size={32} />
                                </div>
                                <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">All Caught Up!</p>
                                <p className="text-gray-500 dark:text-slate-400">{t('admin.approvals.noPending')}</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-[2rem] border border-gray-100/50 dark:border-slate-700/50 p-8 shadow-sm flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Activity className="text-teal-500" size={24} />
                            {t('admin.activity.title')}
                        </h2>
                        <Link to="/admin/analytics" className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1 group">
                            {t('admin.activity.viewAll')}
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="space-y-4 flex-1">
                        {[
                            { action: t('admin.activity.newRegister'), time: '5 min ago', icon: Users, color: 'blue' },
                            { action: t('admin.activity.lessonPublished'), time: '15 min ago', icon: BookOpen, color: 'emerald' },
                            { action: t('admin.activity.emailGenerated'), time: '1 hour ago', icon: FileText, color: 'purple' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl border border-gray-100/50 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner
                                    ${item.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50' :
                                        item.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50' :
                                            'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50'}
                                `}>
                                    <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900 dark:text-white text-lg">{item.action}</p>
                                    <p className="text-sm font-bold text-gray-400 dark:text-slate-500 flex items-center gap-1.5 uppercase tracking-wider mt-1">
                                        <Clock size={12} /> {item.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
