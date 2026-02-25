import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Sparkles, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosConfig';

interface Topic {
    id: string;
    title: string;
    description: string;
    difficultyLevel: string;
    status: string;
    lessons: { id: string }[];
}

const TopicsPage = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<string>('ALL');

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await api.get('/api/v1/topics/published');
                setTopics(response.data);
            } catch (err) {
                // Fallback to all topics if /published doesn't return results
                try {
                    const fallback = await api.get('/api/v1/topics');
                    setTopics(fallback.data);
                } catch {
                    console.error('Failed to fetch topics');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTopics();
    }, []);

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'BEGINNER': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'INTERMEDIATE': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'ADVANCED': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'BEGINNER': return '🌱';
            case 'INTERMEDIATE': return '📚';
            case 'ADVANCED': return '🚀';
            default: return '📖';
        }
    };

    const filtered = topics.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.description?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'ALL' || t.difficultyLevel === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto px-4 py-8"
        >
            {/* Header */}
            <div className="mb-8 relative mt-10">
                <div className="absolute top-0 right-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-xl shadow-inner">
                        <GraduationCap className="text-indigo-600 dark:text-indigo-400" size={28} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight">Learning Topics</h1>
                </div>
                <p className="text-gray-500 dark:text-slate-400 text-lg">Explore professional English topics and start learning</p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search topics..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-gray-200/50 dark:border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm backdrop-blur-sm text-gray-800 dark:text-gray-100 placeholder-gray-400"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                    {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(level => {
                        const isActive = filter === level;
                        return (
                            <button
                                key={level}
                                onClick={() => setFilter(level)}
                                className={`relative px-5 py-3 rounded-xl text-sm font-semibold transition-colors shrink-0 ${isActive ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeFilterBg"
                                        className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl border border-indigo-200 dark:border-indigo-800/50"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    {level === 'ALL' ? 'All Levels' : level.charAt(0) + level.slice(1).toLowerCase()}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Topics Grid */}
            <AnimatePresence mode="wait">
                {filtered.length > 0 ? (
                    <motion.div
                        key="grid"
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filtered.map(topic => (
                            <motion.div
                                key={topic.id}
                                variants={{
                                    hidden: { opacity: 0, scale: 0.9, y: 20 },
                                    show: { opacity: 1, scale: 1, y: 0 }
                                }}
                            >
                                <Link
                                    to={`/dashboard/topics/${topic.id}`}
                                    className="group block bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-3xl border border-white dark:border-slate-700/50 p-6 shadow-xl shadow-indigo-100/20 dark:shadow-none hover:shadow-indigo-200/40 dark:hover:shadow-indigo-900/20 hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-300 h-full flex flex-col relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />

                                    <div className="flex items-start justify-between mb-4 relative z-10">
                                        <div className="text-3xl p-2 bg-white dark:bg-slate-700/50 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-600 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                            {getLevelIcon(topic.difficultyLevel)}
                                        </div>
                                        <span className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full border shadow-sm ${getLevelColor(topic.difficultyLevel)}`}>
                                            {topic.difficultyLevel}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-3 line-clamp-2 relative z-10">
                                        {topic.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-3 mb-6 flex-1 relative z-10">
                                        {topic.description || 'Explore this topic and its lessons'}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700/50 relative z-10">
                                        <span className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-gray-200/50 dark:border-slate-700/50">
                                            <BookOpen size={16} className="text-indigo-400" />
                                            {topic.lessons?.length || 0} lessons
                                        </span>
                                        <span className="flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg">
                                            Start <Sparkles size={14} />
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-dashed border-gray-300 dark:border-slate-600 p-16 text-center max-w-2xl mx-auto"
                    >
                        <div className="w-24 h-24 bg-indigo-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen size={48} className="text-indigo-300 dark:text-slate-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            {search ? 'No matching topics found' : 'No topics available yet'}
                        </h3>
                        <p className="text-gray-500 dark:text-slate-400 text-lg max-w-md mx-auto">
                            {search ? `We couldn't find any topics matching "${search}". Try adjusting your filters.` : 'Check back soon for new learning content expertly crafted for you!'}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TopicsPage;
