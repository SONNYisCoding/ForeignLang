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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-7xl mx-auto pb-12 relative"
        >
            {/* Background Effects */}
            <div className="fixed top-0 inset-x-0 h-64 bg-gradient-to-b from-emerald-50/50 dark:from-emerald-950/20 to-transparent pointer-events-none -z-10" />

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 dark:border-slate-800/60 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-emerald-50/50 dark:from-emerald-900/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                        <CheckCircle size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">Content Approval</h1>
                        <p className="text-gray-500 dark:text-slate-400 font-medium">Review, approve, or reject submitted content from teachers.</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-24 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-[2rem] border border-gray-100/50 dark:border-slate-800/50 shadow-sm relative overflow-hidden flex flex-col items-center justify-center"
                >
                    <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-bold text-gray-500 dark:text-slate-400">Loading pending submissions...</p>
                </motion.div>
            ) : pendingTopics.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-24 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-[2rem] border border-gray-100/50 dark:border-slate-800/50 shadow-sm relative overflow-hidden"
                >
                    <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 dark:text-emerald-400 shadow-inner">
                        <CheckCircle size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">All Caught Up!</h3>
                    <p className="text-lg text-gray-500 dark:text-slate-400 font-medium max-w-md mx-auto">There are no pending submissions to review at the moment.</p>
                </motion.div>
            ) : (
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                    className="grid gap-4"
                >
                    {pendingTopics.map(topic => (
                        <motion.div
                            key={topic.id}
                            variants={{
                                hidden: { opacity: 0, x: -20 },
                                show: { opacity: 1, x: 0 }
                            }}
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100/50 dark:border-slate-700/50 flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/0 to-teal-500/0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />

                            <div className="flex-1 min-w-0 relative z-10">
                                <div className="flex items-center gap-3 mb-3 flex-wrap">
                                    <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest ${getDifficultyStyle(topic.difficulty)}`}>
                                        {topic.difficulty}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 dark:text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                                        <Clock size={14} /> {new Date(topic.submittedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{topic.title}</h3>
                                <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-4 line-clamp-2">{topic.description}</p>
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-slate-300">
                                    <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <User size={12} />
                                    </div>
                                    <span>Submitted by <span className="text-gray-900 dark:text-white">{topic.authorName}</span></span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 relative z-10 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-slate-700/50">
                                <button
                                    onClick={() => setPreviewTopic(topic)}
                                    className="flex-1 md:flex-none px-5 py-2.5 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-200 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-sm shadow-sm border border-gray-200/50 dark:border-slate-700/50"
                                >
                                    <Eye size={18} /> Preview
                                </button>
                                <button
                                    onClick={() => setConfirmAction({ topic, action: 'reject' })}
                                    className="flex-1 md:flex-none px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-sm shadow-sm"
                                >
                                    <XCircle size={18} /> Reject
                                </button>
                                <button
                                    onClick={() => setConfirmAction({ topic, action: 'approve' })}
                                    className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-sm shadow-md shadow-emerald-500/20"
                                >
                                    <CheckCircle size={18} /> Approve
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* ========== PREVIEW MODAL ========== */}
            <AnimatePresence>
                {previewTopic && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                        onClick={(e) => { if (e.target === e.currentTarget) setPreviewTopic(null); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 dark:border-slate-700/50 w-full max-w-xl overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 pointer-events-none" />

                            {/* Header */}
                            <div className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-gray-100/50 dark:border-slate-800/50">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                                        <BookOpen size={20} />
                                    </div>
                                    Content Preview
                                </h2>
                                <button onClick={() => setPreviewTopic(null)} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-95">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 px-8 py-6 space-y-6">
                                <div>
                                    <span className={`inline-block px-3 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-widest mb-4 ${getDifficultyStyle(previewTopic.difficulty)}`}>
                                        {previewTopic.difficulty}
                                    </span>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">{previewTopic.title}</h3>
                                </div>

                                <div className="bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/50">
                                    <p className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">Description</p>
                                    <p className="text-sm font-medium text-gray-700 dark:text-slate-300 leading-relaxed">{previewTopic.description || 'No description provided.'}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl p-5 border border-emerald-100/50 dark:border-emerald-800/30">
                                        <p className="text-xs font-black text-emerald-600/60 dark:text-emerald-500/60 uppercase tracking-widest mb-2">Author</p>
                                        <p className="text-base font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                                            <User size={16} className="text-emerald-500" />
                                            {previewTopic.authorName}
                                        </p>
                                    </div>
                                    <div className="bg-teal-50/50 dark:bg-teal-900/10 rounded-2xl p-5 border border-teal-100/50 dark:border-teal-800/30">
                                        <p className="text-xs font-black text-teal-600/60 dark:text-teal-500/60 uppercase tracking-widest mb-2">Submitted</p>
                                        <p className="text-base font-bold text-teal-900 dark:text-teal-100 flex items-center gap-2">
                                            <Clock size={16} className="text-teal-500" />
                                            {new Date(previewTopic.submittedAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="relative z-10 px-8 py-6 bg-gray-50/50 dark:bg-slate-800/30 border-t border-gray-100/50 dark:border-slate-800/50 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => { setPreviewTopic(null); setConfirmAction({ topic: previewTopic, action: 'reject' }); }}
                                    className="flex-1 py-3.5 bg-white dark:bg-slate-900 text-red-600 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-sm shadow-sm"
                                >
                                    <XCircle size={18} /> Reject Content
                                </button>
                                <button
                                    onClick={() => { setPreviewTopic(null); setConfirmAction({ topic: previewTopic, action: 'approve' }); }}
                                    className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-sm shadow-md shadow-emerald-500/20"
                                >
                                    <CheckCircle size={18} /> Approve & Publish
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
        </motion.div>
    );
};

export default ApprovalPage;
