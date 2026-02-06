import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Clock, User } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

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

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = () => {
        setLoading(true);
        fetch('/api/v1/admin/approvals', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setPendingTopics(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleAction = (id: string, action: 'approve' | 'reject') => {
        fetch(`/api/v1/admin/approvals/${id}/${action}`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('Action failed');
                return res.json();
            })
            .then(() => {
                showSuccess(`Topic ${action}d successfully`);
                setPendingTopics(prev => prev.filter(t => t.id !== id));
            })
            .catch(() => showError(`Failed to ${action} topic`));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Content Approval</h1>
                <p className="text-slate-500">Review and approve submitted content</p>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading pending submissions...</div>
            ) : pendingTopics.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4" />
                    <h3 className="text-lg font-medium text-slate-800">All Caught Up!</h3>
                    <p className="text-slate-500">No pending content to review.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {pendingTopics.map(topic => (
                        <div key={topic.id} className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded uppercase tracking-wide
                                        ${topic.difficulty === 'BEGINNER' ? 'bg-emerald-100 text-emerald-700' :
                                            topic.difficulty === 'INTERMEDIATE' ? 'bg-blue-100 text-blue-700' :
                                                'bg-purple-100 text-purple-700'}`}>
                                        {topic.difficulty}
                                    </span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Clock size={12} /> {new Date(topic.submittedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">{topic.title}</h3>
                                <p className="text-sm text-slate-500 mb-3">{topic.description}</p>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <User size={14} className="text-indigo-500" />
                                    <span>Submitted by <span className="font-medium">{topic.authorName}</span></span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors" title="View Content">
                                    <Eye size={20} />
                                </button>
                                <button
                                    onClick={() => handleAction(topic.id, 'reject')}
                                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors flex items-center gap-2"
                                >
                                    <XCircle size={18} /> Reject
                                </button>
                                <button
                                    onClick={() => handleAction(topic.id, 'approve')}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors flex items-center gap-2"
                                >
                                    <CheckCircle size={18} /> Approve
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApprovalPage;
