import { useState, useEffect } from 'react';
import { Search, Filter, Shield, User as UserIcon, GraduationCap, CheckCircle, XCircle, KeyRound, Ban, MessageSquare, X, Edit } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../../components/ui/ConfirmModal';

interface UserData {
    id: string;
    email: string;
    fullName?: string;
    username?: string;
    role?: string;
    roles: ('GUEST' | 'LEARNER' | 'TEACHER' | 'ADMIN')[];
    profileComplete: boolean;
    authProvider: string;
    createdAt: string;
    subscriptionTier: string;
}

const UserManagement = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('ALL');
    const { showSuccess, showError } = useToast();

    // Modal state
    const [modalUser, setModalUser] = useState<UserData | null>(null);
    const [pendingRoles, setPendingRoles] = useState<string[]>([]);
    const [savingRoles, setSavingRoles] = useState(false);

    // Confirm modal state
    const [confirmModal, setConfirmModal] = useState<{ type: 'ban' | 'reset'; loading: boolean } | null>(null);

    useEffect(() => { fetchUsers(); }, []);

    // When modal opens, copy current roles
    useEffect(() => {
        if (modalUser) {
            setPendingRoles([...getUserRoles(modalUser)]);
        }
    }, [modalUser]);

    const fetchUsers = () => {
        setLoading(true);
        fetch('/api/v1/admin/users', { credentials: 'include' })
            .then(res => { if (!res.ok) throw new Error(); return res.json(); })
            .then(data => { setUsers(data); setLoading(false); })
            .catch(() => { showError('Failed to load users'); setLoading(false); });
    };

    const getUserRoles = (user: UserData): string[] => {
        if (user.roles && user.roles.length > 0) return [...user.roles];
        if (user.role) return [user.role];
        return ['GUEST'];
    };

    // --- Modal Actions ---
    const handleSaveRoles = () => {
        if (!modalUser) return;
        const rolesToSave = pendingRoles.length === 0 ? ['GUEST'] : pendingRoles;
        setSavingRoles(true);

        fetch(`/api/v1/admin/users/${modalUser.id}/roles`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roles: rolesToSave }),
            credentials: 'include'
        })
            .then(res => { if (!res.ok) throw new Error(); return res.json(); })
            .then(updatedUser => {
                setUsers(prev => prev.map(u => u.id === modalUser.id ? { ...u, roles: updatedUser.roles } : u));
                setModalUser(prev => prev ? { ...prev, roles: updatedUser.roles } : null);
                showSuccess('Roles updated successfully');
            })
            .catch(() => showError('Failed to update roles'))
            .finally(() => setSavingRoles(false));
    };

    const togglePendingRole = (role: string) => {
        setPendingRoles(prev => {
            if (prev.includes(role)) {
                const next = prev.filter(r => r !== role);
                return next.length === 0 ? ['GUEST'] : next;
            } else {
                const next = [...prev, role].filter(r => r !== 'GUEST');
                return next;
            }
        });
    };

    const handleBanUser = () => {
        if (!modalUser) return;
        setConfirmModal({ type: 'ban', loading: false });
    };

    const handleResetPassword = () => {
        if (!modalUser) return;
        setConfirmModal({ type: 'reset', loading: false });
    };

    const executeConfirmAction = () => {
        if (!modalUser || !confirmModal) return;
        setConfirmModal({ ...confirmModal, loading: true });

        if (confirmModal.type === 'ban') {
            fetch(`/api/v1/admin/users/${modalUser.id}/ban`, { method: 'PUT', credentials: 'include' })
                .then(res => { if (!res.ok) throw new Error(); return res.json(); })
                .then(() => { showSuccess('User banned'); setConfirmModal(null); setModalUser(null); fetchUsers(); })
                .catch(() => { showError('Failed to ban user'); setConfirmModal(null); });
        } else {
            fetch(`/api/v1/admin/users/${modalUser.id}/reset-password`, { method: 'PUT', credentials: 'include' })
                .then(res => { if (!res.ok) throw new Error(); return res.json(); })
                .then(data => { showSuccess(data.message || 'Password reset to 123456'); setConfirmModal(null); })
                .catch(() => { showError('Failed to reset password'); setConfirmModal(null); });
        }
    };

    // --- Filtering ---
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.username || '').toLowerCase().includes(searchTerm.toLowerCase());
        if (roleFilter === 'ALL') return matchesSearch;
        return matchesSearch && getUserRoles(user).includes(roleFilter);
    });

    // --- Stats ---
    const stats = {
        total: users.length,
        admins: users.filter(u => getUserRoles(u).includes('ADMIN')).length,
        teachers: users.filter(u => getUserRoles(u).includes('TEACHER')).length,
        learners: users.filter(u => getUserRoles(u).includes('LEARNER')).length,
    };

    const getRoleBadge = (role: string, size: 'sm' | 'md' = 'sm') => {
        const base = size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';
        switch (role) {
            case 'ADMIN': return <span className={`inline-flex items-center gap-1.5 ${base} font-semibold rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300`}><Shield size={size === 'md' ? 16 : 12} /> Admin</span>;
            case 'TEACHER': return <span className={`inline-flex items-center gap-1.5 ${base} font-semibold rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300`}><GraduationCap size={size === 'md' ? 16 : 12} /> Teacher</span>;
            case 'LEARNER': return <span className={`inline-flex items-center gap-1.5 ${base} font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300`}><UserIcon size={size === 'md' ? 16 : 12} /> Learner</span>;
            default: return <span className={`inline-flex items-center gap-1.5 ${base} font-semibold rounded-full bg-slate-100 text-slate-600`}>Guest</span>;
        }
    };

    const rolesChanged = modalUser ? JSON.stringify([...pendingRoles].sort()) !== JSON.stringify([...getUserRoles(modalUser)].sort()) : false;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">User Management</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage users, roles, and permissions</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', value: stats.total, color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700' },
                    { label: 'Admins', value: stats.admins, color: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800' },
                    { label: 'Teachers', value: stats.teachers, color: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800' },
                    { label: 'Learners', value: stats.learners, color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' },
                ].map(stat => (
                    <div key={stat.label} className={`rounded-xl p-4 border ${stat.color}`}>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm opacity-75">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-slate-400" />
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none transition">
                        <option value="ALL">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="TEACHER">Teacher</option>
                        <option value="LEARNER">Learner</option>
                        <option value="GUEST">Guest</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Roles</th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Provider</th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Joined</th>
                                <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                        Loading users...
                                    </div>
                                </td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    {searchTerm || roleFilter !== 'ALL' ? 'No users match your filters' : 'No users found'}
                                </td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm shrink-0">
                                                    {(user.fullName || user.email)[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-slate-800 dark:text-white truncate">{user.fullName || 'No Name'}</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {getUserRoles(user).map(r => <span key={r}>{getRoleBadge(r)}</span>)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${user.authProvider === 'GOOGLE'
                                                ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                                }`}>{user.authProvider || 'LOCAL'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.profileComplete ? (
                                                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium"><CheckCircle size={14} /> Active</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-medium"><XCircle size={14} /> Incomplete</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setModalUser(user)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors"
                                            >
                                                <Edit size={14} />
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {!loading && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Showing {filteredUsers.length} of {users.length} users
                </p>
            )}

            {/* ========== USER MANAGEMENT MODAL ========== */}
            <AnimatePresence>
                {modalUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={(e) => { if (e.target === e.currentTarget) setModalUser(null); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Manage User</h2>
                                <button onClick={() => setModalUser(null)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* User Info */}
                            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl shrink-0">
                                        {(modalUser.fullName || modalUser.email)[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-slate-800 dark:text-white text-lg truncate">{modalUser.fullName || 'No Name'}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{modalUser.email}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${modalUser.authProvider === 'GOOGLE'
                                                ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                                : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                                                }`}>{modalUser.authProvider || 'LOCAL'}</span>
                                            <span className="text-xs text-slate-400">Joined {modalUser.createdAt ? new Date(modalUser.createdAt).toLocaleDateString('vi-VN') : '—'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Role Management */}
                            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Roles</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    {['LEARNER', 'TEACHER', 'ADMIN'].map(role => {
                                        const active = pendingRoles.includes(role);
                                        const isProtectedAdmin = role === 'ADMIN' && getUserRoles(modalUser).includes('ADMIN');
                                        return (
                                            <button
                                                key={role}
                                                onClick={() => {
                                                    if (isProtectedAdmin) {
                                                        showError("Cannot remove Admin role");
                                                        return;
                                                    }
                                                    togglePendingRole(role);
                                                }}
                                                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${active
                                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm'
                                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                    }`}
                                            >
                                                {active && (
                                                    <div className="absolute top-2 right-2">
                                                        <CheckCircle size={16} className="text-indigo-600 dark:text-indigo-400" />
                                                    </div>
                                                )}
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${role === 'ADMIN' ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400' :
                                                    role === 'TEACHER' ? 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' :
                                                        'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                    }`}>
                                                    {role === 'ADMIN' && <Shield size={20} />}
                                                    {role === 'TEACHER' && <GraduationCap size={20} />}
                                                    {role === 'LEARNER' && <UserIcon size={20} />}
                                                </div>
                                                <span className={`text-sm font-medium ${active ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>
                                                    {role}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {rolesChanged && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-4"
                                    >
                                        <button
                                            onClick={handleSaveRoles}
                                            disabled={savingRoles}
                                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {savingRoles ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle size={16} />
                                                    Save Role Changes
                                                </>
                                            )}
                                        </button>
                                    </motion.div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="px-6 py-4 space-y-2">
                                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Actions</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <button
                                        onClick={handleResetPassword}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-xl border border-amber-200 dark:border-amber-800 transition-colors"
                                    >
                                        <KeyRound size={16} />
                                        Reset Password
                                    </button>
                                    <a
                                        href={`/admin/chat-history?userId=${modalUser.id}`}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 transition-colors"
                                    >
                                        <MessageSquare size={16} />
                                        Chat History
                                    </a>
                                    <button
                                        onClick={handleBanUser}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-800 transition-colors"
                                    >
                                        <Ban size={16} />
                                        Ban User
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ========== CONFIRM MODAL (Ban / Reset PW) ========== */}
            <ConfirmModal
                isOpen={!!confirmModal}
                title={confirmModal?.type === 'ban' ? 'Ban User' : 'Reset Password'}
                message={confirmModal?.type === 'ban'
                    ? `Ban ${modalUser?.fullName || modalUser?.email}? This action cannot be undone.`
                    : `Reset password for ${modalUser?.fullName || modalUser?.email} to default (123456)?`}
                confirmText={confirmModal?.type === 'ban' ? 'Ban User' : 'Reset Password'}
                variant={confirmModal?.type === 'ban' ? 'danger' : 'warning'}
                onConfirm={executeConfirmAction}
                onCancel={() => setConfirmModal(null)}
                loading={confirmModal?.loading || false}
            />
        </div>
    );
};

export default UserManagement;
