import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Send, Plus, Trash2, ChevronLeft, GripVertical, FileText, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

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
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

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

    const updateLesson = (index: number, field: keyof Lesson, value: unknown) => {
        const updated = [...formData.lessons];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, lessons: updated });
    };

    const removeLesson = (index: number) => {
        const updated = formData.lessons.filter((_, i) => i !== index);
        setFormData({ ...formData, lessons: updated });
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 max-w-4xl mx-auto">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Loading editor...</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto space-y-8 pb-24 relative"
        >
            {/* Background Effects */}
            <div className="fixed top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-50/50 dark:from-indigo-950/10 to-transparent pointer-events-none -z-10" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between sticky top-[72px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-20 p-4 sm:p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm shadow-indigo-500/5 mb-8">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <button
                        onClick={() => navigate('/teacher/lessons')}
                        className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 rounded-xl transition-colors group"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{id ? 'Edit Lesson Content' : 'Craft New Lesson'}</h1>
                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border ${formData.status === 'PENDING_APPROVAL'
                                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50'
                                : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50'
                                }`}>
                                {formData.status === 'PENDING_APPROVAL' ? 'Under Review' : 'Draft Mode'}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mt-1">Design your curriculum and learning path.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold transition-colors border border-indigo-100 dark:border-slate-700 shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /> : <Save size={18} />}
                        {saving ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        disabled={saving}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-500/20 active:scale-95 disabled:opacity-50 outline-none focus:ring-4 focus:ring-indigo-500/20"
                    >
                        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={18} />}
                        Publish Review
                    </button>
                </div>
            </div>

            {/* Main Details */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2rem] border border-gray-100/80 dark:border-slate-800 flex flex-col gap-6 shadow-sm relative overflow-hidden group/card transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-bl from-purple-50/50 dark:from-purple-900/10 to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-6">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                            <FileText size={16} className="text-indigo-500" />
                            Curriculum Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Professional Networking Patterns"
                            className="w-full text-2xl font-extrabold px-6 py-4 bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700/60 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all placeholder-gray-300 dark:placeholder-slate-600 dark:text-white"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Overview Summary</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Write a captivating summary to engage your students..."
                                rows={4}
                                className="w-full px-5 py-4 bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700/60 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all resize-none dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Target Level</label>
                            <div className="flex flex-col gap-3">
                                {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(level => (
                                    <button
                                        key={level}
                                        onClick={() => setFormData({ ...formData, difficultyLevel: level as TopicData['difficultyLevel'] })}
                                        className={`flex items-center justify-between px-5 py-3.5 font-bold rounded-2xl border transition-all ${formData.difficultyLevel === level
                                            ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 dark:border-indigo-500 text-indigo-700 dark:text-indigo-400 shadow-sm'
                                            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/80 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${level === 'BEGINNER' ? 'bg-emerald-400' : level === 'INTERMEDIATE' ? 'bg-indigo-400' : 'bg-purple-400'}`} />
                                            {level}
                                        </div>
                                        {formData.difficultyLevel === level && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                <CheckCircle2 size={18} className="text-indigo-500" />
                                            </motion.div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lessons List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                            {formData.lessons.length}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Content Sections</h2>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={addLesson}
                        className="px-5 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-bold rounded-xl flex items-center gap-2 transition-colors border border-indigo-100 dark:border-indigo-800/50"
                    >
                        <Plus size={18} /> Add Section
                    </motion.button>
                </div>

                {formData.lessons.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-white/40 dark:bg-slate-900/40 rounded-[2rem] border-2 border-dashed border-indigo-200 dark:border-indigo-900/50 flex flex-col items-center justify-center transition-colors hover:bg-white/60 dark:hover:bg-slate-900/60"
                    >
                        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 text-indigo-400">
                            <Plus size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Content Sections Yet</h3>
                        <p className="text-gray-500 dark:text-slate-400 mb-6 font-medium max-w-sm mx-auto">Break your curriculum down into manageable, bite-sized lessons.</p>
                        <button onClick={addLesson} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                            Add Content Section
                        </button>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        {formData.lessons.map((lesson, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-100/80 dark:border-slate-800 shadow-sm relative group transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 overflow-hidden">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="cursor-move p-2 -ml-2 text-gray-300 hover:text-indigo-400 transition-colors bg-gray-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-900/30 rounded-lg">
                                            <GripVertical size={20} />
                                        </div>
                                        <div className="w-10 h-10 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-lg font-black text-indigo-600 border border-indigo-100 dark:border-indigo-800/50">
                                            {index + 1}
                                        </div>
                                        <input
                                            type="text"
                                            value={lesson.title}
                                            onChange={e => updateLesson(index, 'title', e.target.value)}
                                            className="flex-1 font-extrabold text-xl bg-transparent border-none focus:ring-0 placeholder-gray-300 dark:placeholder-slate-600 dark:text-white px-0"
                                            placeholder="Beautiful Lesson Title..."
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 10 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => removeLesson(index)}
                                            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                                            title="Remove Section"
                                        >
                                            <Trash2 size={20} />
                                        </motion.button>
                                    </div>
                                    <div className="pl-14">
                                        <textarea
                                            value={lesson.contentBody}
                                            onChange={e => updateLesson(index, 'contentBody', e.target.value)}
                                            placeholder="Write your brilliant lesson content here... Use clear paragraphs and simple structure."
                                            rows={8}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/60 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-gray-700 dark:text-slate-300 resize-y min-h-[150px] transition-all"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </motion.div>
    );
};

export default LessonEditor;
