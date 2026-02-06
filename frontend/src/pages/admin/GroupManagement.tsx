import { useState, useEffect } from 'react';
import { Plus, UserPlus, Users, GraduationCap, X } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface Group {
    id: string;
    name: string;
    description: string;
    teacherName: string;
    memberCount: number;
    createdAt: string;
}

interface User {
    id: string;
    name: string; // mapped from backend user.fullName or username
    fullName?: string;
    username?: string;
    role: string;
    email: string;
}

const GroupManagement = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const { showSuccess, showError } = useToast();

    // Form state
    const [newGroup, setNewGroup] = useState({ name: '', description: '', teacherId: '' });
    const [selectedLearnerId, setSelectedLearnerId] = useState('');

    useEffect(() => {
        fetchGroups();
        fetchUsers();
    }, []);

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
                // map backend user structure to simpler list
                const mapped = data.map((u: any) => ({
                    id: u.id,
                    name: u.fullName || u.username || u.email,
                    role: u.role,
                    email: u.email
                }));
                setUsers(mapped);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleCreateGroup = (e: React.FormEvent) => {
        e.preventDefault();
        fetch('/api/v1/admin/groups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newGroup),
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to create group');
                return res.json();
            })
            .then(() => {
                // Refresh or append
                fetchGroups(); // simpler to refresh for now
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
            .then(res => {
                if (!res.ok) return res.json().then(err => { throw new Error(err.error) });
                return res.json();
            })
            .then(() => {
                showSuccess('Member added to group');
                fetchGroups(); // Update counts
                setIsAddMemberModalOpen(false);
                setSelectedLearnerId('');
            })
            .catch(err => showError(err.message || 'Failed to add member'));
    };

    const teachers = users.filter(u => u.role === 'TEACHER');
    const learners = users.filter(u => u.role === 'LEARNER');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Group Management</h1>
                    <p className="text-slate-500">Manage student groups and assignments</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} />
                    New Group
                </button>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map(group => (
                    <div key={group.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                <Users size={24} />
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedGroupId(group.id);
                                    setIsAddMemberModalOpen(true);
                                }}
                                className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50"
                                title="Add Learners"
                            >
                                <UserPlus size={20} />
                            </button>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{group.name}</h3>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2 h-10">{group.description || 'No description'}</p>

                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <GraduationCap size={16} className="text-indigo-500" />
                                <span>{group.teacherName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Users size={16} className="text-amber-500" />
                                <span>{group.memberCount} Students</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Group Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Create New Group</h2>
                            <button onClick={() => setIsCreateModalOpen(false)}><X size={24} className="text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleCreateGroup} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Group Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newGroup.name}
                                    onChange={e => setNewGroup({ ...newGroup, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    value={newGroup.description}
                                    onChange={e => setNewGroup({ ...newGroup, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Assign Teacher</label>
                                <select
                                    required
                                    value={newGroup.teacherId}
                                    onChange={e => setNewGroup({ ...newGroup, teacherId: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none bg-white"
                                >
                                    <option value="">Select a teacher</option>
                                    {teachers.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 mt-2">
                                Create Group
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Member Modal */}
            {isAddMemberModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Add Student</h2>
                            <button onClick={() => setIsAddMemberModalOpen(false)}><X size={24} className="text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleAddMember} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Student</label>
                                <select
                                    required
                                    value={selectedLearnerId}
                                    onChange={e => setSelectedLearnerId(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none bg-white"
                                >
                                    <option value="">Select a learner</option>
                                    {learners.map(l => (
                                        <option key={l.id} value={l.id}>{l.name} ({l.email})</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 mt-2">
                                Add to Group
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupManagement;
