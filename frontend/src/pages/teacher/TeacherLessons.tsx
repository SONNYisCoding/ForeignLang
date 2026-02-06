import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Clock, Edit, Send, Files } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

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
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">Published</span>;
            case 'PENDING_APPROVAL': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">Pending</span>;
            case 'REJECTED': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Rejected</span>;
            default: return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">Draft</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Lessons</h1>
                    <p className="text-gray-500">Manage your course content</p>
                </div>
                <Link
                    to="/teacher/lessons/new"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                    <Plus size={20} />
                    Create Lesson
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading lessons...</div>
            ) : topics.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Files size={32} className="text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">No lessons yet</h3>
                    <p className="text-gray-500 mb-6">Start creating content for your students today.</p>
                    <Link
                        to="/teacher/lessons/new"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                    >
                        <Plus size={18} /> Create First Lesson
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topics.map(topic => (
                        <div key={topic.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                                        ${topic.difficulty === 'BEGINNER' ? 'bg-emerald-100 text-emerald-600' :
                                            topic.difficulty === 'INTERMEDIATE' ? 'bg-blue-100 text-blue-600' :
                                                'bg-purple-100 text-purple-600'}`}>
                                        <BookOpen size={20} />
                                    </div>
                                    {getStatusBadge(topic.status)}
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{topic.title}</h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">{topic.description || 'No description provided.'}</p>

                                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                                    <span className="flex items-center gap-1">
                                        <Files size={12} /> {topic.lessonCount} Sub-lessons
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} /> {topic.updatedAt ? new Date(topic.updatedAt).toLocaleDateString() : 'Just now'}
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <Link
                                        to={`/teacher/lessons/${topic.id}/edit`}
                                        className="text-indigo-600 font-medium text-sm hover:underline flex items-center gap-1"
                                    >
                                        <Edit size={14} /> Edit Content
                                    </Link>
                                    {topic.status === 'DRAFT' && (
                                        <span className="text-amber-600 text-xs font-medium flex items-center gap-1">
                                            <Send size={12} /> Draft
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherLessons;
