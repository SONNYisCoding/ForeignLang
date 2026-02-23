import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Clock, User, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';
import ConfirmModal from '../../components/ui/ConfirmModal';

interface PendingTopic {
    id: string;
    title: string;
    description: string;
    authorName: string;
    submittedAt: string;
    difficulty: string;
}

const ApprovalPage = () => {
    const [pendingTopics, setPendingTopics] = useState<PendingTopic[]>([]);
    const [loading, setLoading] = useState(true);
    const { showSuccess, showError } = useToast();

    // Preview modal
    const [previewTopic, setPreviewTopic] = useState<PendingTopic | null>(null);

    // Confirm modal
    const [confirmAction, setConfirmAction] = useState<{ topic: PendingTopic; action: 'approve' | 'reject' } | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => { fetchPending(); }, []);

    const fetchPending = () => {
        setLoading(true);
        fetch('/api/v1/admin/approvals', { credentials: 'include' })
            .then(res => res.json())
            .then(data => { setPendingTopics(data); setLoading(false); })
            .catch(() => setLoading(false));
    };

    const handleAction = () => {
        if (!confirmAction) return;
        const { topic, action } = confirmAction;
        setActionLoading(true);

        fetch(`/api/v1/admin/approvals/${topic.id}/${action}`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(res => { if (!res.ok) throw new Error(); return res.json(); })
            .then(() => {
                showSuccess(`Topic ${action}d successfully`);
                setPendingTopics(prev => prev.filter(t => t.id !== topic.id));
                setConfirmAction(null);
                setPreviewTopic(null);
            })
            .catch(() => showError(`Failed to ${action} topic`))
            .finally(() => setActionLoading(false));
    };

    const getDifficultyStyle = (difficulty: string) => {
        switch (difficulty) {
            case 'BEGINNER': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'INTERMEDIATE': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'ADVANCED': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Content Approval</h1>
                <p className="text-slate-500 dark:text-slate-400">Review and approve submitted content</p>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        Loading pending submissions...
                    </div>
                </div>
            ) : pendingTopics.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">All Caught Up!</h3>
                    <p className="text-slate-500 dark:text-slate-400">No pending content to review.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {pendingTopics.map(topic => (
                        <div key={topic.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-sm transition-shadow">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wide ${getDifficultyStyle(topic.difficulty)}`}>
                                        {topic.difficulty}
                                    </span>
                                    <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                        <Clock size={12} /> {new Date(topic.submittedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 truncate">{topic.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{topic.description}</p>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <User size={14} className="text-indigo-500" />
                                    <span>Submitted by <span className="font-medium">{topic.authorName}</span></span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => setPreviewTopic(topic)}
                                    className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors flex items-center gap-2 text-sm"
                                >
                                    <Eye size={16} /> Preview
                                </button>
                                <button
                                    onClick={() => setConfirmAction({ topic, action: 'reject' })}
                                    className="px-4 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors flex items-center gap-2 text-sm"
                                >
                                    <XCircle size={16} /> Reject
                                </button>
                                <button
                                    onClick={() => setConfirmAction({ topic, action: 'approve' })}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors flex items-center gap-2 text-sm"
                                >
                                    <CheckCircle size={16} /> Approve
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ========== PREVIEW MODAL ========== */}
            <AnimatePresence>
                {previewTopic && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={(e) => { if (e.target === e.currentTarget) setPreviewTopic(null); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <BookOpen size={20} className="text-indigo-500" />
                                    Content Preview
                                </h2>
                                <button onClick={() => setPreviewTopic(null)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-5 space-y-4">
                                <div>
                                    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wide mb-3 ${getDifficultyStyle(previewTopic.difficulty)}`}>
                                        {previewTopic.difficulty}
                                    </span>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{previewTopic.title}</h3>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Description</p>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{previewTopic.description || 'No description provided.'}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Author</p>
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                                            <User size={14} className="text-indigo-500" />
                                            {previewTopic.authorName}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Submitted</p>
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                                            <Clock size={14} className="text-slate-400" />
                                            {new Date(previewTopic.submittedAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                                <button
                                    onClick={() => { setPreviewTopic(null); setConfirmAction({ topic: previewTopic, action: 'reject' }); }}
                                    className="flex-1 py-2.5 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                                >
                                    <XCircle size={16} /> Reject
                                </button>
                                <button
                                    onClick={() => { setPreviewTopic(null); setConfirmAction({ topic: previewTopic, action: 'approve' }); }}
                                    className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                                >
                                    <CheckCircle size={16} /> Approve
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ========== CONFIRM MODAL ========== */}
            <ConfirmModal
                isOpen={!!confirmAction}
                title={confirmAction?.action === 'approve' ? 'Approve Content' : 'Reject Content'}
                message={confirmAction?.action === 'approve'
                    ? `Approve "${confirmAction?.topic.title}"? This will publish the content for all learners.`
                    : `Reject "${confirmAction?.topic.title}"? The author will be notified.`}
                confirmText={confirmAction?.action === 'approve' ? 'Approve' : 'Reject'}
                variant={confirmAction?.action === 'approve' ? 'info' : 'danger'}
                onConfirm={handleAction}
                onCancel={() => setConfirmAction(null)}
                loading={actionLoading}
            />
        </div>
    );
};

export default ApprovalPage;
