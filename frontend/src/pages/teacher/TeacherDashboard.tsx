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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-7xl mx-auto pb-12"
        >
            {/* Background Effects */}
            <div className="fixed top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-50 dark:from-indigo-950/20 to-transparent pointer-events-none -z-10" />
            <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

            {/* Welcome */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 dark:border-slate-800/60 shadow-lg shadow-indigo-100/20 dark:shadow-none relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-50/50 dark:from-indigo-900/10 to-transparent pointer-events-none" />
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 dark:from-indigo-400 dark:to-purple-300 tracking-tight mb-2">
                        Teacher Dashboard
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-slate-400 font-medium">Manage your lessons, track student progress, and analyze performance.</p>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative z-10">
                    <Link
                        to="/teacher/lessons/new"
                        className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/25 transition-all w-full md:w-auto justify-center"
                    >
                        <PenLine size={20} />
                        Create New Lesson
                    </Link>
                </motion.div>
            </div>

            {/* Stats Grid */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.05 }
                    }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
                                className="block p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl border border-gray-100/50 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group overflow-hidden relative"
                            >
                                <div className={`absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-bl ${card.color} opacity-5 group-hover:opacity-10 transition-opacity rounded-full blur-2xl`} />

                                <div className="flex items-start justify-between mb-4 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon size={26} className="drop-shadow-sm" />
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                                        {loading ? <span className="animate-pulse bg-gray-200 dark:bg-slate-700 h-10 w-20 rounded inline-block" /> : card.value.toLocaleString()}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-widest">{card.label}</p>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Content Rows */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Lessons */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl border border-gray-100/50 dark:border-slate-700/50 p-8 shadow-sm flex flex-col h-full"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <BookOpen className="text-indigo-500" size={20} />
                            Recent Lessons
                        </h2>
                        <Link to="/teacher/lessons" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">View All &rarr;</Link>
                    </div>
                    <div className="space-y-4 flex-1">
                        {[
                            { title: 'Business Email Basics', status: 'Published', students: 45 },
                            { title: 'Formal Greetings', status: 'Pending', students: 0 },
                            { title: 'Interview Preparation', status: 'Published', students: 32 },
                        ].map((lesson, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.01, x: 4 }}
                                className="flex items-center justify-between p-4 bg-gray-50/80 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 shadow-sm rounded-xl flex items-center justify-center border border-gray-100 dark:border-slate-700 group-hover:shadow-indigo-500/10 transition-shadow">
                                        <BookOpen size={20} className="text-indigo-500 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{lesson.title}</p>
                                        <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{lesson.students} students enrolled</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${lesson.status === 'Published'
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
                                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50'
                                    }`}>
                                    {lesson.status}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Students */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl border border-gray-100/50 dark:border-slate-700/50 p-8 shadow-sm flex flex-col h-full"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="text-purple-500" size={20} />
                            Top Performers
                        </h2>
                        <Link to="/teacher/students" className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">View All &rarr;</Link>
                    </div>
                    <div className="space-y-4 flex-1">
                        {[
                            { name: 'Nguyen Van A', progress: 95, streak: 12 },
                            { name: 'Tran Thi B', progress: 88, streak: 8 },
                            { name: 'Le Van C', progress: 82, streak: 5 },
                        ].map((student, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.01, x: 4 }}
                                className="flex items-center gap-5 p-4 bg-gray-50/80 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-800 transition-all group"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-purple-500/25 transition-shadow">
                                    {student.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{student.name}</p>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${student.progress}%` }}
                                                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full relative"
                                            >
                                                <div className="absolute inset-0 bg-white/20 rounded-full" />
                                            </motion.div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 dark:text-slate-400 w-8">{student.progress}%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center flex-col px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30">
                                    <span className="text-[10px] font-bold text-amber-600/70 dark:text-amber-500/70 uppercase">Streak</span>
                                    <span className="text-sm font-black text-amber-600 dark:text-amber-500">
                                        🔥 {student.streak}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default TeacherDashboard;
