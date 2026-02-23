import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface Lesson {
    id: string;
    title: string;
    contentBody: string;
    orderIndex: number;
}

interface Topic {
    id: string;
    title: string;
    description: string;
    difficultyLevel: string;
    lessons: Lesson[];
}

const TopicDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [topic, setTopic] = useState<Topic | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        import('axios').then(async (axiosModule) => {
            const axios = axiosModule.default;
            try {
                const response = await axios.get(`/api/v1/topics/${id}`, { withCredentials: true });
                setTopic(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load topic details');
                setLoading(false);
            }
        });
    }, [id]);

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'BEGINNER': return 'bg-green-100 text-green-700';
            case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-700';
            case 'ADVANCED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 dark:text-slate-400 animate-pulse font-medium">Loading learning path...</p>
            </div>
        );
    }

    if (error || !topic) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl border border-gray-100 dark:border-slate-800"
                >
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Topic not found</h2>
                    <p className="text-gray-500 dark:text-slate-400 mb-8">The learning topic you're looking for doesn't exist or is currently unavailable.</p>
                    <Link to="/dashboard/topics" className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-colors">
                        <ArrowLeft size={18} className="mr-2" /> Back to Topics
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans">
            {/* Header / Banner */}
            <header className="relative bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-300 to-purple-300 blur-3xl opacity-50" />
                    <div className="absolute bottom-[-20%] left-[10%] w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-sky-300 to-emerald-300 blur-3xl opacity-40" />
                </div>

                <div className="max-w-4xl mx-auto px-6 py-10 lg:py-16 relative z-10">
                    <Link to="/dashboard/topics" className="inline-flex items-center text-sm font-semibold text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors bg-gray-100/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg backdrop-blur-sm w-fit">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Topics
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
                    >
                        <div className="flex-1">
                            <span className={`inline-block text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full mb-4 shadow-sm border ${getLevelColor(topic.difficultyLevel)}`}>
                                {topic.difficultyLevel}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 tracking-tight leading-tight mb-4">{topic.title}</h1>
                            <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed">{topic.description}</p>
                        </div>

                        {/* Progress Ring (Visual Only for now) */}
                        <div className="flex-shrink-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-5 rounded-3xl border border-white dark:border-slate-700/50 shadow-xl shadow-indigo-100/50 dark:shadow-none flex items-center gap-5">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-gray-200 dark:text-slate-700" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <motion.path
                                        initial={{ strokeDasharray: "0, 100" }}
                                        animate={{ strokeDasharray: "0, 100" }} // Set dynamically based on progress
                                        className="text-indigo-500" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                </svg>
                                <span className="absolute text-sm font-bold text-gray-700 dark:text-slate-200">0%</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Your Progress</h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400">0 of {topic.lessons?.length || 0} completed</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Learning Path (Timeline) */}
            <main className="max-w-4xl mx-auto px-6 py-12 relative">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        Learning Path <span className="text-sm px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg">{topic.lessons?.length || 0} Modules</span>
                    </h2>
                </div>

                {topic.lessons && topic.lessons.length > 0 ? (
                    <div className="relative">
                        {/* Vertical Line Connector */}
                        <div className="absolute left-[39px] md:left-[51px] top-8 bottom-8 w-1 bg-gradient-to-b from-indigo-200 via-purple-200 to-transparent dark:from-indigo-800/50 dark:via-purple-800/50 rounded-full z-0" />

                        <div className="space-y-8 relative z-10">
                            {topic.lessons
                                .sort((a, b) => a.orderIndex - b.orderIndex)
                                .map((lesson, index) => {
                                    const isFirst = index === 0;

                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.15 + 0.3 }}
                                            key={lesson.id}
                                            className="flex gap-6 md:gap-8 group"
                                        >
                                            {/* Step Indicator */}
                                            <div className="flex-shrink-0 flex flex-col items-center">
                                                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-xl ${isFirst
                                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-white dark:border-slate-900 text-white shadow-indigo-500/30 ring-4 ring-indigo-100 dark:ring-indigo-900/30'
                                                    : 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-slate-700 text-gray-400 dark:text-slate-500 group-hover:border-indigo-300 dark:group-hover:border-indigo-600'
                                                    }`}>
                                                    {isFirst ? (
                                                        <Play fill="currentColor" size={32} className="ml-1" />
                                                    ) : (
                                                        <span className="text-2xl font-black">{index + 1}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Lesson Card */}
                                            <Link
                                                to={`/dashboard/topics/${id}/lessons/${lesson.id}`}
                                                className={`flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border transition-all duration-300 relative overflow-hidden flex flex-col justify-center min-h-[140px] shadow-sm hover:shadow-xl ${isFirst
                                                    ? 'border-indigo-200 dark:border-indigo-700/50 shadow-indigo-100/50 dark:shadow-none hover:-translate-y-1'
                                                    : 'border-gray-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-700/50 hover:-translate-y-1 group-hover:shadow-indigo-50/50 dark:group-hover:shadow-none'
                                                    }`}
                                            >
                                                {/* Card Background Glow */}
                                                <div className={`absolute -right-20 -top-20 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${isFirst ? 'bg-indigo-600 opacity-10' : 'bg-indigo-400'}`} />

                                                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className={`text-xl md:text-2xl font-bold transition-colors ${isFirst ? 'text-indigo-900 dark:text-white' : 'text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                                                                }`}>
                                                                {lesson.title}
                                                            </h3>
                                                            {isFirst && (
                                                                <span className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase tracking-widest rounded-md">Next up</span>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed max-w-xl line-clamp-2">
                                                            {lesson.contentBody?.substring(0, 150)}...
                                                        </p>

                                                        <div className="flex items-center gap-5 mt-4 text-xs font-semibold text-gray-400 dark:text-slate-500">
                                                            <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-800/50 px-2 py-1 rounded">
                                                                <Clock size={14} className="text-indigo-400" />
                                                                ~5 min read
                                                            </span>
                                                            <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-800/50 px-2 py-1 rounded">
                                                                <BookOpen size={14} className="text-purple-400" />
                                                                Interactive
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex-shrink-0 mt-4 sm:mt-0">
                                                        <button className={`px-6 py-3 rounded-xl font-bold transition-all shadow-md group-hover:shadow-lg flex items-center gap-2 ${isFirst
                                                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none hover:scale-105'
                                                            : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:scale-105'
                                                            }`}>
                                                            Start <ArrowRight size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })
                            }
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-16 border border-dashed border-gray-300 dark:border-slate-700 text-center shadow-xl shadow-gray-100/20 dark:shadow-none"
                    >
                        <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen size={48} className="text-gray-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No lessons yet</h3>
                        <p className="text-gray-500 dark:text-slate-400 text-lg">Lessons for this topic are being crafted and will be available soon!</p>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default TopicDetailPage;
