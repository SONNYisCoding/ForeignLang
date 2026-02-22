import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';

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
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="max-w-3xl mx-auto text-center py-20">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Lesson not found</h2>
                <Link to={`/dashboard/topics/${topicId}`} className="text-indigo-600 hover:underline">
                    ← Back to Topic
                </Link>
            </div>
        );
    }

    // Estimate reading time (~200 words/min)
    const wordCount = lesson.contentBody?.split(/\s+/).length || 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <div className="max-w-4xl mx-auto">
            {/* Navigation Header */}
            <div className="flex items-center justify-between mb-6">
                <Link
                    to={`/dashboard/topics/${topicId}`}
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition text-sm"
                >
                    <ArrowLeft size={16} />
                    Back to Topic
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock size={14} />
                    {readingTime} min read
                    <span className="mx-2">·</span>
                    <BookOpen size={14} />
                    Lesson {currentIndex + 1} of {allLessons.length}
                </div>
            </div>

            {/* Lesson Progress */}
            <div className="flex gap-1 mb-6">
                {allLessons.map((l, i) => (
                    <div
                        key={l.id}
                        className={`h-1.5 flex-1 rounded-full transition ${i < currentIndex
                                ? 'bg-emerald-400'
                                : i === currentIndex
                                    ? 'bg-indigo-500'
                                    : 'bg-gray-200'
                            }`}
                    />
                ))}
            </div>

            {/* Main Content */}
            <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* Title Area */}
                <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
                </div>

                {/* Content Body */}
                <div className="px-8 py-8">
                    <div
                        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-indigo-600 prose-strong:text-gray-900 leading-relaxed"
                        style={{ whiteSpace: 'pre-wrap' }}
                    >
                        {lesson.contentBody || 'Content coming soon...'}
                    </div>
                </div>
            </article>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between mt-8 pb-8">
                {prevLesson ? (
                    <button
                        onClick={() => navigate(`/dashboard/topics/${topicId}/lessons/${prevLesson.id}`)}
                        className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition"
                    >
                        <ArrowLeft size={16} />
                        <div className="text-left">
                            <div className="text-xs text-gray-400">Previous</div>
                            <div className="text-gray-700">{prevLesson.title}</div>
                        </div>
                    </button>
                ) : <div />}

                {nextLesson ? (
                    <button
                        onClick={() => navigate(`/dashboard/topics/${topicId}/lessons/${nextLesson.id}`)}
                        className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition"
                    >
                        <div className="text-right">
                            <div className="text-xs text-indigo-200">Next</div>
                            <div>{nextLesson.title}</div>
                        </div>
                        <ArrowRight size={16} />
                    </button>
                ) : (
                    <Link
                        to={`/dashboard/topics/${topicId}`}
                        className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition"
                    >
                        <CheckCircle size={16} />
                        Complete Topic
                    </Link>
                )}
            </div>
        </div>
    );
};

export default LessonPage;
