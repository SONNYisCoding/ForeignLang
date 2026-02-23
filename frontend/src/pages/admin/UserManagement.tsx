import { useState, useEffect } from 'react';
import { Search, Filter, Shield, User as UserIcon, Users, GraduationCap, CheckCircle, XCircle, KeyRound, Ban, X, Edit, Clock } from 'lucide-react';
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
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <Users size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">User Management</h1>
                        <p className="text-gray-500 dark:text-slate-400 font-medium">Manage users, roles, and permissions across the platform.</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
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
                className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {[
                    { label: 'Total Users', value: stats.total, color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-200 dark:border-slate-700/50 from-slate-500', icon: Users },
                    { label: 'Admins', value: stats.admins, color: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800/50 from-violet-500', icon: Shield },
                    { label: 'Teachers', value: stats.teachers, color: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800/50 from-teal-500', icon: GraduationCap },
                    { label: 'Learners', value: stats.learners, color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50 from-blue-500', icon: UserIcon },
                ].map((stat) => (
                    <motion.div
                        key={stat.label}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0 }
                        }}
                        className={`rounded-3xl p-6 border ${stat.color} backdrop-blur-md shadow-sm relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                    >
                        <div className={`absolute -inset-0.5 bg-gradient-to-br ${stat.color.split(' ').find(c => c.startsWith('from-'))} to-transparent opacity-0 group-hover:opacity-10 transition-opacity rounded-[2rem] z-0 pointer-events-none`} />
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-4xl font-black mb-1 tracking-tight">{stat.value}</p>
                                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">{stat.label}</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-black/20 flex items-center justify-center opacity-80 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-gray-100/80 dark:border-slate-700/50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-400 to-purple-400" />
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search users by name, email, or username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder-gray-400 dark:placeholder-slate-500 font-medium"
                    />
                </div>
                <div className="flex items-center gap-3 sm:w-64 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                        <Filter size={20} className="text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold appearance-none cursor-pointer"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="ADMIN">Administrator</option>
                        <option value="TEACHER">Teacher</option>
                        <option value="LEARNER">Learner</option>
                        <option value="GUEST">Guest</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-400 dark:border-t-slate-500"></div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-gray-100/80 dark:border-slate-800 shadow-sm overflow-hidden pb-2">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/80 dark:bg-slate-800/80 border-b border-gray-200/60 dark:border-slate-700/60 backdrop-blur-sm">
                            <tr>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">User</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">Roles</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest hidden md:table-cell whitespace-nowrap">Provider</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">Status</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest hidden lg:table-cell whitespace-nowrap">Joined</th>
                                <th className="px-8 py-5 text-right text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/50 dark:divide-slate-800/50">
                            {loading ? (
                                <tr><td colSpan={6} className="px-8 py-16 text-center text-gray-500 dark:text-slate-400 font-medium">
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                        Fetching users...
                                    </div>
                                </td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={6} className="px-8 py-16 text-center text-gray-500 dark:text-slate-400 font-medium">
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-400 mb-2">
                                            <Search size={32} />
                                        </div>
                                        {searchTerm || roleFilter !== 'ALL' ? 'No users match your current filters.' : 'No users found in the system.'}
                                    </div>
                                </td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-black text-lg shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                                                    {(user.fullName || user.email)[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-gray-900 dark:text-white truncate text-base">{user.fullName || 'No Name'}</p>
                                                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-wrap gap-2">
                                                {getUserRoles(user).map(r => <span key={r}>{getRoleBadge(r)}</span>)}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 hidden md:table-cell">
                                            <span className={`text-[10px] uppercase tracking-widest font-black px-2.5 py-1.5 rounded-lg border ${user.authProvider === 'GOOGLE'
                                                ? 'bg-red-50 text-red-600 border-red-200/50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50'
                                                : 'bg-gray-100 text-gray-600 border-gray-200/50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/50'
                                                }`}>{user.authProvider || 'LOCAL'}</span>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            {user.profileComplete ? (
                                                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-bold bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-800/50 shadow-sm"><CheckCircle size={16} /> Active</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-sm font-bold bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-800/50 shadow-sm"><XCircle size={16} /> Incomplete</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-sm font-bold text-gray-500 dark:text-slate-400 hidden lg:table-cell whitespace-nowrap">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}
                                        </td>
                                        <td className="px-8 py-5 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => setModalUser(user)}
                                                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm border border-indigo-100 dark:border-indigo-800/50 group/btn"
                                            >
                                                <Edit size={16} className="group-hover/btn:scale-110 transition-transform" />
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && (
                    <div className="px-8 py-5 border-t border-gray-100/50 dark:border-slate-800/50 flex justify-between items-center text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                        <span>Showing {filteredUsers.length} of {users.length} users</span>
                    </div>
                )}
            </div>

            {/* ========== USER MANAGEMENT MODAL ========== */}
            <AnimatePresence>
                {modalUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                        onClick={(e) => { if (e.target === e.currentTarget) setModalUser(null); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 dark:border-slate-700/50 w-full max-w-xl overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />

                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100/50 dark:border-slate-800/50 relative z-10">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Manage User</h2>
                                <button onClick={() => setModalUser(null)} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-95">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* User Info */}
                            <div className="px-8 py-6 border-b border-gray-100/50 dark:border-slate-800/50 relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-3xl shrink-0 shadow-inner border border-indigo-200/50 dark:border-indigo-800/50">
                                        {(modalUser.fullName || modalUser.email)[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-extrabold text-gray-900 dark:text-white text-2xl truncate mb-1">{modalUser.fullName || 'No Name'}</h3>
                                        <p className="text-base font-medium text-gray-500 dark:text-slate-400 truncate">{modalUser.email}</p>
                                        <div className="flex items-center gap-3 mt-3">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border shadow-sm ${modalUser.authProvider === 'GOOGLE'
                                                ? 'bg-red-50 text-red-600 border-red-200/50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50'
                                                : 'bg-gray-100 text-gray-600 border-gray-200/50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/50'
                                                }`}>{modalUser.authProvider || 'LOCAL'}</span>
                                            <span className="text-xs font-bold text-gray-400 dark:text-slate-500 flex items-center gap-1.5 uppercase tracking-widest"><Clock size={12} /> Joined {modalUser.createdAt ? new Date(modalUser.createdAt).toLocaleDateString('vi-VN') : '—'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Role Management */}
                            <div className="px-8 py-6 border-b border-gray-100/50 dark:border-slate-800/50 relative z-10">
                                <h4 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">Roles & Permissions</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    {['LEARNER', 'TEACHER', 'ADMIN'].map(role => {
                                        const active = pendingRoles.includes(role);
                                        const isProtectedAdmin = role === 'ADMIN' && getUserRoles(modalUser).includes('ADMIN');
                                        return (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                key={role}
                                                onClick={() => {
                                                    if (isProtectedAdmin) {
                                                        showError("Cannot remove your own Admin role");
                                                        return;
                                                    }
                                                    togglePendingRole(role);
                                                }}
                                                className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 ${active
                                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md shadow-indigo-500/10'
                                                    : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-800'
                                                    }`}
                                            >
                                                {active && (
                                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2">
                                                        <CheckCircle size={18} className="text-indigo-600 dark:text-indigo-400" />
                                                    </motion.div>
                                                )}
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner ${role === 'ADMIN' ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 border border-violet-200/50 dark:border-violet-800/50' :
                                                    role === 'TEACHER' ? 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 border border-teal-200/50 dark:border-teal-800/50' :
                                                        'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50'
                                                    }`}>
                                                    {role === 'ADMIN' && <Shield size={24} />}
                                                    {role === 'TEACHER' && <GraduationCap size={24} />}
                                                    {role === 'LEARNER' && <UserIcon size={24} />}
                                                </div>
                                                <span className={`text-sm font-black tracking-wide ${active ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>
                                                    {role}
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                                {rolesChanged && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, y: -10 }}
                                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                                        className="mt-6"
                                    >
                                        <button
                                            onClick={handleSaveRoles}
                                            disabled={savingRoles}
                                            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 text-base"
                                        >
                                            {savingRoles ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin"></div>
                                                    Securing Access...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle size={20} />
                                                    Confirm Role Changes
                                                </>
                                            )}
                                        </button>
                                    </motion.div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="px-8 py-6 space-y-4">
                                <h4 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Administrative Actions</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        onClick={handleResetPassword}
                                        className="flex items-center justify-center gap-2.5 px-5 py-3.5 text-sm font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 hover:shadow-md dark:hover:bg-amber-900/30 rounded-xl border border-amber-200/50 dark:border-amber-800/50 transition-all group active:scale-95"
                                    >
                                        <KeyRound size={18} className="group-hover:rotate-12 transition-transform" />
                                        Reset Password
                                    </button>
                                    <button
                                        onClick={handleBanUser}
                                        className="flex items-center justify-center gap-2.5 px-5 py-3.5 text-sm font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 hover:shadow-md dark:hover:bg-red-900/30 rounded-xl border border-red-200/50 dark:border-red-800/50 transition-all group active:scale-95"
                                    >
                                        <Ban size={18} className="group-hover:rotate-12 transition-transform" />
                                        Suspend Account
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
        </motion.div>
    );
};

export default UserManagement;
