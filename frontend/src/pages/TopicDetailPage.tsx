import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !topic) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Topic not found</h2>
                    <Link to="/dashboard/topics" className="text-indigo-600 hover:underline">← Back to Topics</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-6 py-6">
                    <Link to="/dashboard/topics" className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-4 transition">
                        <ArrowLeft size={18} className="mr-2" />
                        Back to Topics
                    </Link>
                    <div className="flex items-start justify-between">
                        <div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${getLevelColor(topic.difficultyLevel)}`}>
                                {topic.difficultyLevel}
                            </span>
                            <h1 className="text-3xl font-bold text-gray-900 mt-3">{topic.title}</h1>
                            <p className="text-gray-500 mt-2 max-w-2xl">{topic.description}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Lessons List */}
            <main className="max-w-5xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Lessons</h2>
                    <span className="text-sm text-gray-500">{topic.lessons?.length || 0} lessons</span>
                </div>

                {topic.lessons && topic.lessons.length > 0 ? (
                    <div className="space-y-4">
                        {topic.lessons
                            .sort((a, b) => a.orderIndex - b.orderIndex)
                            .map((lesson, index) => (
                                <Link
                                    to={`/dashboard/topics/${id}/lessons/${lesson.id}`}
                                    key={lesson.id}
                                    className="bg-white rounded-xl p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition cursor-pointer group block"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                                                {lesson.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                                {lesson.contentBody?.substring(0, 150)}...
                                            </p>
                                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    ~5 min read
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <BookOpen size={14} />
                                                    Reading
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <button className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                                                Start
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                ) : (
                    <div className="bg-white rounded-xl p-12 border border-dashed border-gray-300 text-center">
                        <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No lessons yet</h3>
                        <p className="text-gray-500 mt-1">Lessons for this topic are coming soon!</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default TopicDetailPage;
