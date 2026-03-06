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
                    exit={{ opacity: 0, scale: 0.95, y: 30 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 dark:border-slate-700/50 w-full max-w-lg overflow-hidden relative"
                >
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />
                    {children}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const GroupManagement = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [users, setUsers] = useState<UserItem[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const { showSuccess, showError } = useToast();

    const [newGroup, setNewGroup] = useState({ name: '', description: '', teacherId: '' });
    const [selectedLearnerId, setSelectedLearnerId] = useState('');

    function fetchGroups() {
        fetch('/api/v1/admin/groups', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setGroups(data))
            .catch(err => console.error(err));
    }

    function fetchUsers() {
        fetch('/api/v1/admin/users', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                const mapped = data.map((u: { id: string; fullName?: string; username?: string; role: string; email: string }) => ({
                    id: u.id,
                    name: u.fullName || u.username || u.email,
                    role: u.role,
                    email: u.email
                }));
                setUsers(mapped);
            })
            .catch(err => console.error(err));
    }

     
    useEffect(() => { fetchGroups(); fetchUsers(); }, []);

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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-7xl mx-auto pb-12 relative"
        >
            {/* Background Effects */}
            <div className="fixed top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-50/50 dark:from-indigo-950/20 to-transparent pointer-events-none -z-10" />

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 dark:border-slate-800/60 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-50/50 dark:from-indigo-900/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <Users size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">Group Management</h1>
                        <p className="text-gray-500 dark:text-slate-400 font-medium">Manage student groups, enrollments, and teacher assignments.</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="relative z-10 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all font-bold shadow-md shadow-indigo-500/25 active:scale-95 group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    New Group
                </button>
            </div>

            {/* Groups Grid */}
            {/* Groups Grid */}
            {groups.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-24 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-[2rem] border border-gray-100/50 dark:border-slate-800/50 shadow-sm relative overflow-hidden"
                >
                    <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-400 dark:text-indigo-500 shadow-inner">
                        <Users size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">No Groups Yet</h3>
                    <p className="text-lg text-gray-500 dark:text-slate-400 font-medium max-w-md mx-auto">Create your first group to start organizing students and assigning teachers.</p>
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
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {groups.map(group => (
                        <motion.div
                            key={group.id}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: { opacity: 1, y: 0 }
                            }}
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-8 rounded-[2rem] border border-gray-100/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-[2rem] z-0 pointer-events-none" />

                            <div className="relative z-10 flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/40 dark:to-indigo-800/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 border border-indigo-200/50 dark:border-indigo-800/50">
                                    <Users size={28} />
                                </div>
                                <button
                                    onClick={() => { setSelectedGroupId(group.id); setIsAddMemberModalOpen(true); }}
                                    className="p-2.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all active:scale-95 group/btn"
                                    title="Add Learners"
                                >
                                    <UserPlus size={22} className="group-hover/btn:scale-110 transition-transform" />
                                </button>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{group.name}</h3>
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-6 line-clamp-2 h-10">{group.description || 'No description provided for this group.'}</p>

                            <div className="space-y-4 pt-6 border-t border-gray-100/80 dark:border-slate-700/80 mt-auto relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                        <GraduationCap size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Teacher</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{group.teacherName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                        <Users size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Members</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{group.memberCount} Students Enrolled</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* ========== CREATE GROUP MODAL ========== */}
            <ModalWrapper isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100/50 dark:border-slate-800/50">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Create New Group</h2>
                    <button onClick={() => setIsCreateModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-95">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleCreateGroup} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">Group Name</label>
                            <input
                                type="text"
                                required
                                value={newGroup.name}
                                onChange={e => setNewGroup({ ...newGroup, name: e.target.value })}
                                placeholder="e.g. IELTS Band 7 Group A"
                                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder-gray-400 font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">Description</label>
                            <textarea
                                value={newGroup.description}
                                onChange={e => setNewGroup({ ...newGroup, description: e.target.value })}
                                placeholder="Brief description of this group..."
                                rows={3}
                                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none placeholder-gray-400 font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">Assign Teacher</label>
                            <div className="relative">
                                <select
                                    required
                                    value={newGroup.teacherId}
                                    onChange={e => setNewGroup({ ...newGroup, teacherId: e.target.value })}
                                    className="w-full px-5 py-3.5 pr-12 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Select a teacher</option>
                                    {teachers.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                                    ))}
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-400 dark:border-t-slate-500"></div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/25 transition-all mt-6 flex items-center justify-center gap-2 active:scale-95 text-lg cursor-pointer">
                        <Plus size={20} />
                        Create Group
                    </button>
                </form>
            </ModalWrapper>

            {/* ========== ADD MEMBER MODAL ========== */}
            <ModalWrapper isOpen={isAddMemberModalOpen} onClose={() => setIsAddMemberModalOpen(false)}>
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100/50 dark:border-slate-800/50 relative z-10">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Add Student</h2>
                        {selectedGroupName && <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-widest">Enrolling to {selectedGroupName}</p>}
                    </div>
                    <button onClick={() => setIsAddMemberModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-95">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleAddMember} className="p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">Select Student</label>
                        <div className="relative">
                            <select
                                required
                                value={selectedLearnerId}
                                onChange={e => setSelectedLearnerId(e.target.value)}
                                className="w-full px-5 py-3.5 pr-12 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Select a learner</option>
                                {learners.map(l => (
                                    <option key={l.id} value={l.id}>{l.name} ({l.email})</option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-400 dark:border-t-slate-500"></div>
                        </div>
                    </div>
                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/25 transition-all mt-4 flex items-center justify-center gap-2 active:scale-95 text-lg cursor-pointer">
                        <UserPlus size={20} />
                        Add to Group
                    </button>
                </form>
            </ModalWrapper>
        </motion.div>
    );
};

export default GroupManagement;
