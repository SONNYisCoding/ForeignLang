import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Confetti from '../components/ui/Confetti';

interface Lesson {
    id: string;
    title: string;
    contentBody: string;
    orderIndex: number;
}

const LessonPage = () => {
    const { topicId, lessonId } = useParams<{ topicId: string; lessonId: string }>();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [allLessons, setAllLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [lessonRes, lessonsRes] = await Promise.all([
                    axios.get(`/api/v1/lessons/${lessonId}`, { withCredentials: true }),
                    axios.get(`/api/v1/topics/${topicId}/lessons`, { withCredentials: true })
                ]);
                setLesson(lessonRes.data);
                setAllLessons(lessonsRes.data.sort((a: Lesson, b: Lesson) => a.orderIndex - b.orderIndex));
            } catch (err) {
                setError('Failed to load lesson');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [lessonId, topicId]);

    const currentIndex = allLessons.findIndex(l => l.id === lessonId);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-900 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
                    <BookOpen className="absolute inset-0 m-auto text-indigo-400 animate-pulse" size={24} />
                </div>
                <p className="text-gray-500 dark:text-slate-400 font-medium">Preparing your lesson...</p>
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800"
                >
                    <BookOpen size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Lesson not found</h2>
                    <p className="text-gray-500 dark:text-slate-400 mb-8">This lesson might be locked, under construction, or removed.</p>
                    <Link
                        to={`/dashboard/topics/${topicId}`}
                        className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-xl font-semibold transition-colors"
                    >
                        <ArrowLeft size={18} /> Back to Learning Path
                    </Link>
                </motion.div>
            </div>
        );
    }

    // Estimate reading time (~200 words/min)
    const wordCount = lesson.contentBody?.split(/\s+/).length || 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950/50 pb-20 relative">
            <Confetti active={showConfetti} />
            {/* Sticky Navigation Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-slate-800/60 transition-colors">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link
                        to={`/dashboard/topics/${topicId}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100/50 dark:bg-slate-800/50 text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all font-medium text-sm"
                    >
                        <ArrowLeft size={16} />
                        <span className="hidden sm:inline">Back to Topic</span>
                    </Link>

                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 dark:text-slate-400">
                        <span className="hidden sm:flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 px-2 py-1.5 rounded-md">
                            <Clock size={14} className="text-indigo-500" />
                            {readingTime} min read
                        </span>
                        <div className="h-4 w-px bg-gray-200 dark:bg-slate-700 hidden sm:block"></div>
                        <span className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                            <BookOpen size={14} />
                            Lesson {currentIndex + 1} of {allLessons.length}
                        </span>
                    </div>
                </div>

                {/* Lesson Progress Bar */}
                <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-800 flex overflow-hidden">
                    {allLessons.map((l, i) => (
                        <div key={l.id} className="h-full flex-1 border-r border-white/20 dark:border-slate-900/20 last:border-0 relative">
                            {i < currentIndex ? (
                                <div className="absolute inset-0 bg-emerald-400 dark:bg-emerald-500" />
                            ) : i === currentIndex ? (
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-indigo-500 dark:bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                />
                            ) : null}
                        </div>
                    ))}
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Main Content Article */}
                    <article className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 relative overflow-hidden">

                        {/* Decorative Background Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

                        {/* Title Area */}
                        <div className="px-8 sm:px-12 pt-12 pb-8 border-b border-gray-100 dark:border-slate-800/80 relative z-10">
                            <span className="inline-block px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-widest uppercase rounded-lg mb-4 border border-indigo-100 dark:border-indigo-800">
                                Concept {currentIndex + 1}
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">{lesson.title}</h1>
                        </div>

                        {/* Content Body */}
                        <div className="px-8 sm:px-12 py-10 relative z-10">
                            <div
                                className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-slate-300 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-li:text-gray-600 dark:prose-li:text-slate-300 leading-relaxed"
                                style={{ whiteSpace: 'pre-wrap' }}
                            >
                                {lesson.contentBody || (
                                    <div className="text-center py-10">
                                        <Sparkles className="mx-auto text-indigo-300 dark:text-indigo-700 animate-pulse mb-4" size={32} />
                                        <p className="text-gray-500 dark:text-slate-400">Content for this lesson is being beautifully crafted...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </article>

                    {/* Navigation Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
                        {prevLesson ? (
                            <button
                                onClick={() => navigate(`/dashboard/topics/${topicId}/lessons/${prevLesson.id}`)}
                                className="w-full sm:w-auto flex items-center gap-3 px-6 py-4 text-sm font-semibold text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:border-gray-300 dark:hover:border-slate-600 shadow-sm transition-all group"
                            >
                                <ArrowLeft size={18} className="text-gray-400 dark:text-slate-500 group-hover:-translate-x-1 transition-transform" />
                                <div className="text-left">
                                    <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500">Previous Lesson</div>
                                    <div className="text-gray-800 dark:text-white line-clamp-1 max-w-[150px]">{prevLesson.title}</div>
                                </div>
                            </button>
                        ) : <div className="hidden sm:block" />}

                        {nextLesson ? (
                            <button
                                onClick={() => navigate(`/dashboard/topics/${topicId}/lessons/${nextLesson.id}`)}
                                className="w-full sm:w-auto flex items-center gap-3 px-6 py-4 text-sm font-semibold text-white bg-indigo-600 dark:bg-indigo-500 rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] group"
                            >
                                <div className="text-right">
                                    <div className="text-[10px] uppercase tracking-wider text-indigo-200">Next Lesson</div>
                                    <div className="text-white line-clamp-1 max-w-[150px]">{nextLesson.title}</div>
                                </div>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <button
                                disabled={isCompleting}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsCompleting(true);
                                    setShowConfetti(true);
                                    setTimeout(() => {
                                        navigate(`/dashboard/topics/${topicId}`);
                                    }, 2000);
                                }}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl hover:from-emerald-600 hover:to-teal-600 shadow-xl shadow-emerald-200 dark:shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] group disabled:opacity-70 disabled:active:scale-100"
                            >
                                <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                                {isCompleting ? 'Completing...' : 'Complete Topic'}
                            </button>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default LessonPage;
