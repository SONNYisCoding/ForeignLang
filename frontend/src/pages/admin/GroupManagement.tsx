import { useState, useEffect } from 'react';
import { Plus, UserPlus, Users, GraduationCap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';

interface Group {
    id: string;
    name: string;
    description: string;
    teacherName: string;
    memberCount: number;
    createdAt: string;
}

interface UserItem {
    id: string;
    name: string;
    fullName?: string;
    username?: string;
    role: string;
    email: string;
}

const GroupManagement = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [users, setUsers] = useState<UserItem[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const { showSuccess, showError } = useToast();

    const [newGroup, setNewGroup] = useState({ name: '', description: '', teacherId: '' });
    const [selectedLearnerId, setSelectedLearnerId] = useState('');

    useEffect(() => { fetchGroups(); fetchUsers(); }, []);

    const fetchGroups = () => {
        fetch('/api/v1/admin/groups', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setGroups(data))
            .catch(err => console.error(err));
    };

    const fetchUsers = () => {
        fetch('/api/v1/admin/users', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                const mapped = data.map((u: any) => ({
                    id: u.id,
                    name: u.fullName || u.username || u.email,
                    role: u.role,
                    email: u.email
                }));
                setUsers(mapped);
            })
            .catch(err => console.error(err));
    };

    const handleCreateGroup = (e: React.FormEvent) => {
        e.preventDefault();
        fetch('/api/v1/admin/groups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newGroup),
            credentials: 'include'
        })
            .then(res => { if (!res.ok) throw new Error(); return res.json(); })
            .then(() => {
                fetchGroups();
                showSuccess('Group created successfully');
                setIsCreateModalOpen(false);
                setNewGroup({ name: '', description: '', teacherId: '' });
            })
            .catch(() => showError('Failed to create group'));
    };

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGroupId || !selectedLearnerId) return;

        fetch(`/api/v1/admin/groups/${selectedGroupId}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ learnerId: selectedLearnerId }),
            credentials: 'include'
        })
            .then(res => { if (!res.ok) return res.json().then(err => { throw new Error(err.error) }); return res.json(); })
            .then(() => {
                showSuccess('Member added to group');
                fetchGroups();
                setIsAddMemberModalOpen(false);
                setSelectedLearnerId('');
            })
            .catch(err => showError(err.message || 'Failed to add member'));
    };

    const teachers = users.filter(u => u.role === 'TEACHER');
    const learners = users.filter(u => u.role === 'LEARNER');

    const selectedGroupName = groups.find(g => g.id === selectedGroupId)?.name || '';

    // Reusable modal wrapper
    const ModalWrapper = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden"
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Group Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage student groups and assignments</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                >
                    <Plus size={18} />
                    New Group
                </button>
            </div>

            {/* Groups Grid */}
            {groups.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <Users size={48} className="mx-auto text-indigo-300 dark:text-indigo-600 mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No Groups Yet</h3>
                    <p className="text-slate-500 dark:text-slate-400">Create your first group to start organizing students.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map(group => (
                        <div key={group.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <Users size={24} />
                                </div>
                                <button
                                    onClick={() => { setSelectedGroupId(group.id); setIsAddMemberModalOpen(true); }}
                                    className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    title="Add Learners"
                                >
                                    <UserPlus size={20} />
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{group.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 h-10">{group.description || 'No description'}</p>

                            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <GraduationCap size={16} className="text-indigo-500" />
                                    <span>{group.teacherName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <Users size={16} className="text-amber-500" />
                                    <span>{group.memberCount} Students</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ========== CREATE GROUP MODAL ========== */}
            <ModalWrapper isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Create New Group</h2>
                    <button onClick={() => setIsCreateModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleCreateGroup} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Group Name</label>
                        <input
                            type="text"
                            required
                            value={newGroup.name}
                            onChange={e => setNewGroup({ ...newGroup, name: e.target.value })}
                            placeholder="e.g. IELTS Band 7 Group A"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                        <textarea
                            value={newGroup.description}
                            onChange={e => setNewGroup({ ...newGroup, description: e.target.value })}
                            placeholder="Brief description of this group..."
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Assign Teacher</label>
                        <select
                            required
                            value={newGroup.teacherId}
                            onChange={e => setNewGroup({ ...newGroup, teacherId: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none transition"
                        >
                            <option value="">Select a teacher</option>
                            {teachers.map(t => (
                                <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors mt-2">
                        Create Group
                    </button>
                </form>
            </ModalWrapper>

            {/* ========== ADD MEMBER MODAL ========== */}
            <ModalWrapper isOpen={isAddMemberModalOpen} onClose={() => setIsAddMemberModalOpen(false)}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Add Student</h2>
                        {selectedGroupName && <p className="text-sm text-slate-500 dark:text-slate-400">to {selectedGroupName}</p>}
                    </div>
                    <button onClick={() => setIsAddMemberModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleAddMember} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Select Student</label>
                        <select
                            required
                            value={selectedLearnerId}
                            onChange={e => setSelectedLearnerId(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none transition"
                        >
                            <option value="">Select a learner</option>
                            {learners.map(l => (
                                <option key={l.id} value={l.id}>{l.name} ({l.email})</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors mt-2">
                        Add to Group
                    </button>
                </form>
            </ModalWrapper>
        </div>
    );
};

export default GroupManagement;
