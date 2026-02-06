import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, FileText, BarChart3, Clock, TrendingUp, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TeacherStats {
    totalLessons: number;
    publishedLessons: number;
    pendingLessons: number;
    totalStudents: number;
    activeStudents: number;
    completionRate: number;
}

const TeacherDashboard = () => {
    const [stats, setStats] = useState<TeacherStats>({
        totalLessons: 0,
        publishedLessons: 0,
        pendingLessons: 0,
        totalStudents: 0,
        activeStudents: 0,
        completionRate: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data - replace with real API
        setTimeout(() => {
            setStats({
                totalLessons: 24,
                publishedLessons: 18,
                pendingLessons: 3,
                totalStudents: 156,
                activeStudents: 89,
                completionRate: 72
            });
            setLoading(false);
        }, 500);
    }, []);

    const statCards = [
        { label: 'My Lessons', value: stats.totalLessons, icon: BookOpen, color: 'from-indigo-500 to-indigo-600', link: '/teacher/lessons' },
        { label: 'Published', value: stats.publishedLessons, icon: FileText, color: 'from-emerald-500 to-emerald-600', link: '/teacher/lessons?status=published' },
        { label: 'Pending Review', value: stats.pendingLessons, icon: Clock, color: 'from-amber-500 to-amber-600', link: '/teacher/lessons?status=pending' },
        { label: 'My Students', value: stats.totalStudents, icon: Users, color: 'from-purple-500 to-purple-600', link: '/teacher/students' },
        { label: 'Active This Week', value: stats.activeStudents, icon: TrendingUp, color: 'from-teal-500 to-teal-600', link: '/teacher/students' },
        { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: BarChart3, color: 'from-pink-500 to-pink-600', link: '/teacher/analytics' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
                    <p className="text-gray-500">Manage your lessons and track student progress</p>
                </div>
                <Link
                    to="/teacher/lessons/new"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                    <PenLine size={18} />
                    Create Lesson
                </Link>
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
                                className="block p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all group"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon size={24} />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">
                                    {loading ? '...' : card.value.toLocaleString()}
                                </p>
                                <p className="text-gray-500 font-medium">{card.label}</p>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Content Rows */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Lessons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl border border-gray-100 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Recent Lessons</h2>
                        <Link to="/teacher/lessons" className="text-sm text-indigo-600 hover:underline">View All</Link>
                    </div>
                    <div className="space-y-3">
                        {[
                            { title: 'Business Email Basics', status: 'Published', students: 45 },
                            { title: 'Formal Greetings', status: 'Pending', students: 0 },
                            { title: 'Interview Preparation', status: 'Published', students: 32 },
                        ].map((lesson, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <BookOpen size={18} className="text-indigo-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-700">{lesson.title}</p>
                                    <p className="text-sm text-gray-500">{lesson.students} students enrolled</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${lesson.status === 'Published'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {lesson.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Students */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl border border-gray-100 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Top Students</h2>
                        <Link to="/teacher/students" className="text-sm text-indigo-600 hover:underline">View All</Link>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: 'Nguyen Van A', progress: 95, streak: 12 },
                            { name: 'Tran Thi B', progress: 88, streak: 8 },
                            { name: 'Le Van C', progress: 82, streak: 5 },
                        ].map((student, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {student.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-700">{student.name}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full"
                                                style={{ width: `${student.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">{student.progress}%</span>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-amber-600">
                                    🔥 {student.streak} days
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
