import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Clock, Edit, Send, Files, GraduationCap } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { motion } from 'framer-motion';

interface Topic {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
    lessonCount: number;
    updatedAt: string;
}

const TeacherLessons = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const { showError } = useToast();

    useEffect(() => {
        fetch('/api/v1/teacher/topics', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setTopics(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                showError('Failed to load lessons');
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg border bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 shadow-sm">Published</span>;
            case 'PENDING_APPROVAL':
                return <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg border bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50 shadow-sm">Pending</span>;
            case 'REJECTED':
                return <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg border bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50 shadow-sm">Rejected</span>;
            default:
                return <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg border bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/50 shadow-sm">Draft</span>;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-7xl mx-auto pb-12"
        >
            {/* Background Effects */}
            <div className="fixed top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-50 dark:from-indigo-950/20 to-transparent pointer-events-none -z-10" />

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 dark:border-slate-800/60 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-50/50 dark:from-indigo-900/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <GraduationCap size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">My Lessons</h1>
                        <p className="text-gray-500 dark:text-slate-400 font-medium">Create, manage, and publish your course content.</p>
                    </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative z-10 w-full md:w-auto">
                    <Link
                        to="/teacher/lessons/new"
                        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/25 transition-all w-full md:w-auto"
                    >
                        <Plus size={20} />
                        Create Lesson
                    </Link>
                </motion.div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-white dark:border-slate-800 backdrop-blur-sm">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Loading lessons...</p>
                </div>
            ) : topics.length === 0 ? (
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-24 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/40 dark:border-slate-800/60 shadow-sm"
                >
                    <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative group border border-indigo-100 dark:border-indigo-800/50">
                        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl scale-150 group-hover:opacity-100 transition-opacity"></div>
                        <Files size={48} className="text-indigo-400 dark:text-indigo-500 relative z-10" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">No Lessons Yet</h3>
                    <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto mb-8 font-medium">Start creating amazing content for your students today. Your first lesson is just a click away.</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to="/teacher/lessons/new"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all"
                        >
                            <Plus size={20} /> Create First Lesson
                        </Link>
                    </motion.div>
                </motion.div>
            ) : (
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
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {topics.map(topic => (
                        <motion.div
                            key={topic.id}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: { opacity: 1, y: 0 }
                            }}
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl border border-gray-100/50 dark:border-slate-700/50 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 group relative flex flex-col"
                        >
                            {/* Card Glow */}
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500/0 via-teal-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:via-teal-500/10 group-hover:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] blur-xl z-0 pointer-events-none" />

                            <div className="p-6 relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner
                                        ${topic.difficulty === 'BEGINNER' ? 'bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50' :
                                            topic.difficulty === 'INTERMEDIATE' ? 'bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50' :
                                                'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50'}`}>
                                        <BookOpen size={24} />
                                    </div>
                                    {getStatusBadge(topic.status)}
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{topic.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 line-clamp-2 min-h-[40px] leading-relaxed">{topic.description || 'No description provided.'}</p>

                                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400 dark:text-slate-500 mb-6 uppercase tracking-wider mt-auto">
                                    <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-gray-100 dark:border-slate-700">
                                        <Files size={14} className="text-gray-400" /> {topic.lessonCount} Sub-lessons
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-gray-100 dark:border-slate-700">
                                        <Clock size={14} className="text-gray-400" /> {topic.updatedAt ? new Date(topic.updatedAt).toLocaleDateString() : 'Just now'}
                                    </span>
                                </div>

                                <div className="pt-5 border-t border-gray-100 dark:border-slate-700/50 flex items-center justify-between">
                                    <Link
                                        to={`/teacher/lessons/${topic.id}/edit`}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-sm transition-all group/btn border border-indigo-100 dark:border-indigo-800/50"
                                    >
                                        <Edit size={16} className="group-hover/btn:scale-110 transition-transform" /> Edit Content
                                    </Link>

                                    {topic.status === 'DRAFT' && (
                                        <span className="text-amber-600 text-[10px] font-black uppercase tracking-wider flex flex-col items-center">
                                            <Send size={16} className="mb-0.5" />
                                            Needs Publishing
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

export default TeacherLessons;
