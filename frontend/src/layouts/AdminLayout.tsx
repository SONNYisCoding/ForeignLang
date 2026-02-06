import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Users, FileText, LayoutDashboard, Settings, LogOut, Menu, X,
    ChevronDown, Globe, Shield, BookOpen, CheckSquare, BarChart3,

    UserCog, User as UserIcon, HelpCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from '../components/NotificationDropdown';

interface AdminLayoutProps {
    children: React.ReactNode;
}

interface User {
    name: string;
    email: string;
    role: string;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { t, i18n } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langDropdownRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        i18n.changeLanguage('en'); // Force English for Admin

        const handleClickOutside = (event: MouseEvent) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        fetch('/api/v1/user/me', { credentials: 'include' })
            .then(res => {
                if (res.status === 401) {
                    navigate('/login');
                    return null;
                }
                return res.json();
            })
            .then(data => {
                if (data) {
                    const roles = data.roles || [];
                    // Check if user is admin
                    if (!roles.includes('ADMIN')) {
                        navigate('/dashboard'); // Redirect non-admins
                        return;
                    }
                    setUser({
                        name: data.name || data.fullName || 'Admin',
                        email: data.email,
                        role: 'ADMIN' // Display role
                    });
                }
            })
            .catch(err => console.error('Failed to fetch user:', err));
    }, [navigate]);

    const handleLogout = () => {
        fetch('/api/v1/auth/logout', { method: 'POST' })
            .then(() => navigate('/login'));
    };

    const isActive = (path: string) => location.pathname === path;

    const navGroups = [
        {
            title: 'Dashboard',
            items: [
                { name: 'Overview', path: '/admin', icon: LayoutDashboard },
                { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
            ]
        },
        {
            title: 'User Management',
            items: [
                { name: 'Users', path: '/admin/users', icon: Users },
                { name: 'Groups', path: '/admin/groups', icon: UserCog },
            ]
        },
        {
            title: 'Content',
            items: [
                { name: 'Lessons', path: '/admin/lessons', icon: BookOpen },
                { name: 'Templates', path: '/admin/templates', icon: FileText },
                { name: 'Pending Approval', path: '/admin/approval', icon: CheckSquare },
            ]
        },
        {
            title: 'System',
            items: [
                { name: 'Settings', path: '/admin/settings', icon: Settings },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 z-40 flex items-center justify-between px-4">
                <button onClick={() => setIsSidebarOpen(true)} className="text-white p-2">
                    <Menu size={24} />
                </button>
                <div className="flex items-center gap-2">
                    <Shield size={20} className="text-indigo-400" />
                    <span className="text-white font-bold">Admin Panel</span>
                </div>
                <div className="w-10" />
            </div>

            {/* Sidebar Overlay (Mobile) */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full bg-slate-900 z-50 transition-all duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
            `}>
                {/* Sidebar Header */}
                <div className="flex flex-col p-4 border-b border-slate-800">
                    {/* Logo Area */}
                    <Link to="/admin" className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} transition-all duration-300 mb-6`}>
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-lg shadow-indigo-500/20 ring-1 ring-white/10 bg-slate-800">
                            <img src="/mascot/main.png" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="overflow-hidden whitespace-nowrap"
                                >
                                    <span className="font-extrabold text-sm tracking-[0.2em] text-slate-400 uppercase">
                                        Administration
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Link>

                    {/* Menu Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} w-full py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200 group`}
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        <Menu size={20} className="shrink-0 group-hover:text-indigo-400 transition-colors" />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="font-medium text-sm whitespace-nowrap overflow-hidden"
                                >
                                    Menu
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Mobile Close (Only visible on mobile) */}
                    <div className="lg:hidden absolute top-4 right-4">
                        <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Removed Floating Chevron Toggle */}

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-100px)]">
                    {navGroups.map((group) => (
                        <div key={group.title}>
                            {!isCollapsed && (
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
                                    {group.title}
                                </p>
                            )}
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive(item.path)
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                                } ${isCollapsed ? 'justify-center' : ''}`}
                                            title={isCollapsed ? item.name : undefined}
                                        >
                                            <Icon size={20} />
                                            {!isCollapsed && <span className="font-medium">{item.name}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className={`
                transition-all duration-300 pt-16 lg:pt-0
                ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
            `}>
                {/* Top Header */}
                <header className="hidden lg:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-8">
                    <h1 className="text-xl font-bold text-slate-800">
                        {navGroups.flatMap(g => g.items).find(i => isActive(i.path))?.name || 'Admin'}
                    </h1>

                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <NotificationDropdown />

                        {/* Language Switcher */}
                        <div className="relative" ref={langDropdownRef}>
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                            >
                                <Globe size={16} className="text-slate-500" />
                                <span className="text-sm font-medium">{i18n.language.toUpperCase()}</span>
                                <ChevronDown size={14} className="text-slate-400" />
                            </button>
                            <AnimatePresence>
                                {isLangOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-slate-100 overflow-hidden z-50"
                                    >
                                        {['en', 'vi'].map(lang => (
                                            <button
                                                key={lang}
                                                onClick={() => { i18n.changeLanguage(lang); setIsLangOpen(false); }}
                                                className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${i18n.language === lang ? 'bg-indigo-50 text-indigo-600' : ''
                                                    }`}
                                            >
                                                {lang === 'en' ? 'English' : 'Tiếng Việt'}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative group" onMouseEnter={() => setIsProfileDropdownOpen(true)} onMouseLeave={() => setIsProfileDropdownOpen(false)}>
                            <button className="flex items-center gap-3 focus:outline-none">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-900 leading-none mb-1">{user?.name || 'Admin'}</p>
                                    <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                            </button>

                            <AnimatePresence>
                                {isProfileDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 origin-top-right"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-50 mb-2">
                                            <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>

                                        <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <UserIcon size={18} className="text-gray-400" />
                                            My Profile
                                        </Link>
                                        <Link to="/admin/settings" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <Settings size={18} className="text-gray-400" />
                                            Settings
                                        </Link>

                                        <div className="mt-2 pt-2 border-t border-gray-50 px-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                                            >
                                                <LogOut size={18} />
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
