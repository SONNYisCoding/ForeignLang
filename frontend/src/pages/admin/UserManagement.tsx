
import { useState, useEffect } from 'react';

import { Search, Filter, MoreVertical, Shield, User, GraduationCap, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface User {
    id: string;
    email: string;
    fullName?: string;
    role?: string; // Legacy
    roles: ('GUEST' | 'LEARNER' | 'TEACHER' | 'ADMIN')[];
    profileComplete: boolean;
    authProvider: string;
    createdAt: string;
    subscriptionTier: string;
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('ALL');
    const { showSuccess, showError } = useToast();
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        fetch('/api/v1/admin/users', { credentials: 'include' })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch users');
                return res.json();
            })
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                showError('Failed to load users');
                setLoading(false);
            });
    };

    const handleRoleUpdate = (userId: string, newRoles: string[]) => {
        fetch(`/api/v1/admin/users/${userId}/roles`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roles: newRoles }),
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to update roles');
                return res.json();
            })
            .then(updatedUser => {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, roles: updatedUser.roles } : u));
                showSuccess(`User roles updated`);
            })
            .catch(err => {
                console.error(err);
                showError('Failed to update roles');
            });
    };

    const toggleRole = (user: User, role: string) => {
        const currentRoles = user.roles || (user.role ? [user.role] : ['GUEST']);
        let newRoles;
        if (currentRoles.includes(role as any)) {
            newRoles = currentRoles.filter(r => r !== role);
            if (newRoles.length === 0) newRoles = ['GUEST']; // Prevent no roles
        } else {
            newRoles = [...currentRoles, role];
            // Remove GUEST if adding another role
            if (role !== 'GUEST') newRoles = newRoles.filter(r => r !== 'GUEST');
        }
        handleRoleUpdate(user.id, newRoles);
    };

    const handleBanUser = (userId: string) => {
        if (!window.confirm('Are you sure you want to ban this user?')) return;

        fetch(`/api/v1/admin/users/${userId}/ban`, {
            method: 'PUT',
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to ban user');
                return res.json();
            })
            .then(() => {
                showSuccess('User banned successfully');
                // Optional: update local state to reflect ban (e.g. status)
                fetchUsers();
            })
            .catch(err => {
                console.error(err);
                showError('Failed to ban user');
            });
    };

    const handleResetPassword = (userId: string) => {
        if (!window.confirm('Reset password to default (123456)?')) return;

        fetch(`/api/v1/admin/users/${userId}/reset-password`, {
            method: 'PUT',
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to reset password');
                return res.json();
            })
            .then(data => {
                showSuccess(data.message || 'Password reset successfully');
            })
            .catch(err => {
                console.error(err);
                showError('Failed to reset password');
            });
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.fullName || user.email).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700 flex items-center gap-1"><Shield size={12} /> Admin</span>;
            case 'TEACHER': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-teal-100 text-teal-700 flex items-center gap-1"><GraduationCap size={12} /> Teacher</span>;
            case 'LEARNER': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 flex items-center gap-1"><User size={12} /> Learner</span>;
            default: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">Guest</span>;
        }
    };

    const renderRoles = (user: User) => {
        const roles = user.roles || (user.role ? [user.role] : ['GUEST']);
        return <div className="flex flex-wrap gap-1">{roles.map(r => <span key={r}>{getRoleBadge(r)}</span>)}</div>;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
                    <p className="text-slate-500">Manage users and roles</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-500">Total Users: {users.length}</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={20} className="text-slate-400" />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none bg-white"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="TEACHER">Teacher</option>
                        <option value="LEARNER">Learner</option>
                        <option value="GUEST">Guest</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading users...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No users found</td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-slate-800">{user.fullName || 'No Name'}</p>
                                                <p className="text-sm text-slate-500">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {renderRoles(user)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.profileComplete ? (
                                                <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium"><CheckCircle size={14} /> Active</span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-amber-600 text-xs font-medium"><XCircle size={14} /> Incomplete</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {selectedUser === user.id && (
                                                <div className="absolute right-8 top-12 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-10 py-1">
                                                    <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase">Manage Roles</div>
                                                    {['LEARNER', 'TEACHER', 'ADMIN'].map(role => {
                                                        const currentRoles = user.roles || (user.role ? [user.role] : ['GUEST']);
                                                        const hasRole = currentRoles.includes(role as any);
                                                        return (
                                                            <button
                                                                key={role}
                                                                onClick={() => {
                                                                    // Prevent changing ADMIN role status if user is currently ADMIN
                                                                    if (role === 'ADMIN' && hasRole) {
                                                                        showError("Cannot remove Admin role");
                                                                        return;
                                                                    }
                                                                    toggleRole(user, role)
                                                                }}
                                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between ${hasRole ? 'text-indigo-600 font-medium bg-indigo-50' : 'text-slate-700'
                                                                    }`}
                                                            >
                                                                {role}
                                                                {hasRole && <CheckCircle size={14} />}
                                                            </button>
                                                        );
                                                    })}
                                                    <div className="border-t border-slate-100 my-1"></div>
                                                    <button
                                                        onClick={() => handleResetPassword(user.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        Reset Password
                                                    </button>
                                                    <button
                                                        onClick={() => handleBanUser(user.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                                                    >
                                                        Ban User
                                                    </button>
                                                    <div className="border-t border-slate-100 my-1"></div>
                                                    <a
                                                        href={`/admin/chat-history?userId=${user.id}`}
                                                        className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-slate-50 flex items-center gap-2"
                                                    >
                                                        View Chat History
                                                    </a>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Backdrop for dropdown */}
            {selectedUser && (
                <div className="fixed inset-0 z-0" onClick={() => setSelectedUser(null)} />
            )}
        </div>
    );
};

export default UserManagement;
