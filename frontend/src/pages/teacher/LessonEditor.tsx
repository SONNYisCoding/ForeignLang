import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Send, Plus, Trash2, ChevronLeft, GripVertical } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface Lesson {
    id?: string;
    title: string;
    contentBody: string;
    orderIndex: number;
}

interface TopicData {
    id?: string;
    title: string;
    description: string;
    difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    lessons: Lesson[];
    status?: string;
}

const LessonEditor = () => {
    const { id } = useParams(); // if id exists, we are editing
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [loading, setLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<TopicData>({
        title: '',
        description: '',
        difficultyLevel: 'BEGINNER',
        lessons: []
    });

    useEffect(() => {
        if (id) {
            fetch(`/api/v1/teacher/topics/${id}`, { credentials: 'include' })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to load topic');
                    return res.json();
                })
                .then(data => {
                    setFormData(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    showError('Failed to load topic details');
                    navigate('/teacher/lessons');
                });
        }
    }, [id, navigate]);

    const handleSave = (isSubmit = false) => {
        setSaving(true);
        const url = id
            ? `/api/v1/teacher/topics/${id}`
            : '/api/v1/teacher/topics';

        const method = id ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to save');
                return res.json();
            })
            .then(savedTopic => {
                if (isSubmit && savedTopic.id) {
                    // Logic to submit
                    handleSubmit(savedTopic.id);
                } else {
                    showSuccess('Draft saved successfully');
                    setSaving(false);
                    if (!id) navigate(`/teacher/lessons/${savedTopic.id}/edit`);
                }
            })
            .catch(() => {
                showError('Failed to save topic');
                setSaving(false);
            });
    };

    const handleSubmit = (topicId: string) => {
        fetch(`/api/v1/teacher/topics/${topicId}/submit`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed');
                showSuccess('Topic submitted for approval!');
                navigate('/teacher/lessons');
            })
            .catch(() => {
                showError('Failed to submit topic');
                setSaving(false);
            });
    };

    const addLesson = () => {
        setFormData(prev => ({
            ...prev,
            lessons: [
                ...prev.lessons,
                { title: 'New Lesson', contentBody: '', orderIndex: prev.lessons.length }
            ]
        }));
    };

    const updateLesson = (index: number, field: keyof Lesson, value: any) => {
        const updated = [...formData.lessons];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, lessons: updated });
    };

    const removeLesson = (index: number) => {
        const updated = formData.lessons.filter((_, i) => i !== index);
        setFormData({ ...formData, lessons: updated });
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading editor...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10 py-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/teacher/lessons')} className="text-gray-400 hover:text-gray-600">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{id ? 'Edit Lesson' : 'Create New Lesson'}</h1>
                        <p className="text-sm text-gray-500">{formData.status === 'PENDING_APPROVAL' ? 'Under Review' : 'Draft Mode'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                    >
                        <Save size={18} /> Save Draft
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                    >
                        <Send size={18} /> {saving ? 'Saving...' : 'Submit for Review'}
                    </button>
                </div>
            </div>

            {/* Main Details */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Topic Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Business Email Fundamentals"
                        className="w-full text-xl font-bold px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief overview of what students will learn..."
                            rows={3}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(level => (
                                <button
                                    key={level}
                                    onClick={() => setFormData({ ...formData, difficultyLevel: level as any })}
                                    className={`py-2 text-sm font-medium rounded-lg border transition-all ${formData.difficultyLevel === level
                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lessons List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Lessons Content</h2>
                    <button
                        onClick={addLesson}
                        className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1"
                    >
                        <Plus size={16} /> Add Section
                    </button>
                </div>

                {formData.lessons.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                        <p className="text-gray-400 mb-4">No content added yet</p>
                        <button onClick={addLesson} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                            Add First Lesson
                        </button>
                    </div>
                ) : (
                    formData.lessons.map((lesson, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 group">
                            <div className="flex items-center gap-4 mb-4">
                                <GripVertical className="text-gray-300 cursor-move" size={20} />
                                <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg text-sm font-bold text-gray-500">
                                    {index + 1}
                                </span>
                                <input
                                    type="text"
                                    value={lesson.title}
                                    onChange={e => updateLesson(index, 'title', e.target.value)}
                                    className="flex-1 font-bold text-lg bg-transparent border-none focus:ring-0 placeholder-gray-300"
                                    placeholder="Lesson Title"
                                />
                                <button
                                    onClick={() => removeLesson(index)}
                                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            <textarea
                                value={lesson.contentBody}
                                onChange={e => updateLesson(index, 'contentBody', e.target.value)}
                                placeholder="Write lesson content here... (Supports basic formatting)"
                                rows={6}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-100 outline-none text-gray-700"
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LessonEditor;
