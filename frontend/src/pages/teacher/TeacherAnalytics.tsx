import { useState, useEffect } from 'react';
import { BarChart, Activity, Users, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
        { label: t('teacher.analytics.learningHours'), value: statsData?.totalLearningHours?.toLocaleString() || '0', change: '+12%', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: t('teacher.analytics.activeStudents'), value: statsData?.activeStudents?.toString() || '0', change: '+5%', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { label: t('teacher.analytics.completionRate'), value: `${statsData?.completionRate || 0}%`, change: '+3%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { label: t('teacher.analytics.avgScore'), value: `${statsData?.avgScore || 0}/100`, change: '+1%', icon: BarChart, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">{t('teacher.analytics.title')}</h1>
                <p className="text-slate-500">{t('teacher.analytics.subtitle')}</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full">{stat.change}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                        <p className="text-sm text-slate-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 h-80 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <BarChart size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">{t('teacher.analytics.engagement')}</h3>
                    <p className="text-sm text-slate-400">{t('teacher.analytics.comingSoon')}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 h-80 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Activity size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">{t('teacher.analytics.performance')}</h3>
                    <p className="text-sm text-slate-400">{t('teacher.analytics.comingSoon')}</p>
                </div>
            </div>
        </div>
    );
};

export default TeacherAnalytics;
