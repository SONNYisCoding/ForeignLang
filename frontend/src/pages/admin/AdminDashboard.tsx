import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, FileText, CheckSquare, Activity, Clock } from 'lucide-react';
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
                const response = await fetch('/api/v1/admin/stats');
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
        <div className="space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">{t('admin.dashboard')}</h1>
                <p className="text-slate-500">{t('admin.welcome')}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                to={card.link}
                                className={`block p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-lg transition-all relative overflow-hidden group ${card.urgent ? 'ring-2 ring-red-200' : ''
                                    }`}
                            >
                                {card.urgent && (
                                    <span className="absolute top-3 right-3 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                )}
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon size={24} />
                                </div>
                                <p className="text-3xl font-bold text-slate-800">
                                    {loading ? '...' : card.value.toLocaleString()}
                                </p>
                                <p className="text-slate-500 font-medium">{card.label}</p>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Approvals */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl border border-slate-100 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-800">{t('admin.approvals.title')}</h2>
                        <Link to="/admin/approval" className="text-sm text-indigo-600 hover:underline">{t('admin.approvals.viewAll')}</Link>
                    </div>
                    {stats.pendingApprovals > 0 ? (
                        <div className="space-y-3">
                            {[1, 2, 3].slice(0, Math.min(3, stats.pendingApprovals)).map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg">
                                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <FileText size={18} className="text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-700">{t('admin.approvals.lesson')} #{i + 1}</p>
                                        <p className="text-sm text-slate-500">{t('admin.approvals.submittedBy')} Teacher</p>
                                    </div>
                                    <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                        {t('admin.approvals.review')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-center py-8">{t('admin.approvals.noPending')}</p>
                    )}
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl border border-slate-100 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-800">{t('admin.activity.title')}</h2>
                        <Link to="/admin/analytics" className="text-sm text-indigo-600 hover:underline">{t('admin.activity.viewAll')}</Link>
                    </div>
                    <div className="space-y-3">
                        {[
                            { action: t('admin.activity.newRegister'), time: '5 min ago', icon: Users },
                            { action: t('admin.activity.lessonPublished'), time: '15 min ago', icon: BookOpen },
                            { action: t('admin.activity.emailGenerated'), time: '1 hour ago', icon: FileText },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                                <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                                    <item.icon size={18} className="text-slate-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-700">{item.action}</p>
                                    <p className="text-sm text-slate-500 flex items-center gap-1">
                                        <Clock size={12} /> {item.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
