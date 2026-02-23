import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, BookOpen, Settings, LogOut,
    Menu, X, FileText, ChevronDown,
    BarChart3, UserCog, CheckSquare, Shield, Globe, User as UserIcon, MessageSquare
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from '../components/NotificationDropdown';
import RoleSwitcher from '../components/role/RoleSwitcher';
import { useAuth } from '../contexts/AuthContext';
import SidebarToggle from '../components/ui/SidebarToggle';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { i18n } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const { user, logout } = useAuth(); // Use global auth
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

    const handleLogout = async () => {
        await logout();
        navigate('/login');
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
                { name: 'Chat History', path: '/admin/chat-history', icon: MessageSquare },
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300 relative">
            {/* Background ambient effect */}
            <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-indigo-50/50 dark:from-indigo-900/10 to-transparent pointer-events-none -z-10" />

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-md z-40 flex items-center justify-between px-4 border-b border-slate-800">
                <button onClick={() => setIsSidebarOpen(true)} className="text-white p-2 hover:bg-slate-800 rounded-lg transition-colors">
                    <Menu size={24} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                        <Shield size={16} />
                    </div>
                    <span className="text-white font-bold tracking-tight">Admin Panel</span>
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
                fixed top-0 left-0 h-[100dvh] overflow-x-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-50 transition-[width,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-gray-200/50 dark:border-slate-800/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${isCollapsed ? 'w-64 lg:w-20' : 'w-64 lg:w-72'}
            `}>
                <div className="flex flex-col h-full relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
                    <div className="flex flex-col p-4 relative z-10 w-full">
                        <div className="flex items-center gap-3 mb-8 pl-2 mt-2">
                            <div className="hidden lg:block -ml-2">
                                <SidebarToggle
                                    isCollapsed={isCollapsed}
                                    toggle={() => setIsCollapsed(!isCollapsed)}
                                    title={isCollapsed ? "Expand" : "Collapse"}
                                />
                            </div>

                            <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
                                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-md shadow-indigo-500/10 border border-indigo-100 dark:border-indigo-900/50 relative">
                                    <img src="/mascot/logofl.png" alt="Logo" className="w-full h-full object-cover scale-110" />
                                </div>
                                <div className={`overflow-hidden transition-[width,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'w-0 opacity-0' : 'w-36 opacity-100'}`}>
                                    <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight whitespace-nowrap">Admin Portal</span>
                                </div>
                            </Link>

                            <button onClick={() => setIsSidebarOpen(false)} className={`lg:hidden ml-auto p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-opacity ${isCollapsed ? 'opacity-0 pointer-events-none w-0 h-0 p-0' : 'opacity-100'}`}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Navigation Groups */}
                        <nav className="flex-1 overflow-y-auto space-y-8 scrollbar-hide">
                            {navGroups.map((group, groupIndex) => (
                                <div key={group.title || groupIndex} className="relative">
                                    {group.title && (
                                        <div className={`overflow-hidden transition-[height,opacity,margin] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'h-0 opacity-0 mb-0' : 'h-6 opacity-100 mb-2'}`}>
                                            <div className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-5 whitespace-nowrap">
                                                {group.title}
                                            </div>
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        {group.items.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    onClick={() => setIsSidebarOpen(false)}
                                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors font-bold relative group overflow-hidden
                                                    ${isActive(item.path)
                                                            ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 text-indigo-700 dark:text-indigo-400 shadow-sm border border-indigo-500/10'
                                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white border border-transparent'}
                                                    ${isCollapsed ? 'justify-center px-0 w-12 h-12 mx-auto' : 'mx-2'}
                                                `}
                                                    title={isCollapsed ? item.name : undefined}
                                                >
                                                    {isActive(item.path) && (
                                                        <motion.div layoutId="activeNavAdmin" className={`absolute top-1/4 bottom-1/4 w-1 bg-indigo-500 dark:bg-indigo-400 rounded-r-full transition-[left,opacity] duration-300 ${isCollapsed ? '-left-1 opacity-0' : 'left-0 opacity-100'}`} />
                                                    )}
                                                    <Icon size={22} className={`min-w-[22px] shrink-0 ${isActive(item.path) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors'}`} />
                                                    <div className={`overflow-hidden transition-[width,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'w-0 opacity-0' : 'w-40 opacity-100'}`}>
                                                        <span className="whitespace-nowrap">{item.name}</span>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </nav>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`
                transition-all duration-300 pt-16 lg:pt-0 relative z-10
                ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
            `}>
                {/* Top Header */}
                <header className="hidden lg:flex h-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800/50 items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                        {navGroups.flatMap(g => g.items).find(i => isActive(i.path))?.name || 'Admin'}
                    </h1>

                    <div className="flex items-center gap-5">
                        {/* Notifications */}
                        <div className="relative">
                            <NotificationDropdown />
                        </div>

                        {/* Language Switcher */}
                        <div className="relative" ref={langDropdownRef}>
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200/80 dark:border-slate-700/80 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all text-gray-700 dark:text-slate-300"
                            >
                                <Globe size={18} className="text-indigo-500" />
                                <span className="text-sm font-bold">{i18n.language.toUpperCase()}</span>
                                <ChevronDown size={14} className="text-gray-400" />
                            </button>
                            <AnimatePresence>
                                {isLangOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-36 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden z-50 p-2"
                                    >
                                        {['en', 'vi'].map(lang => (
                                            <button
                                                key={lang}
                                                onClick={() => { i18n.changeLanguage(lang); setIsLangOpen(false); }}
                                                className={`w-full px-4 py-2.5 text-left text-sm font-bold rounded-xl transition-colors ${i18n.language === lang
                                                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                                    : 'text-gray-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
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
                            <button className="flex items-center gap-3 focus:outline-none p-1 rounded-full hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors pr-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1">{user?.name || 'Admin'}</p>
                                    <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{user?.roles?.[0] || 'Administrator'}</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-white/50 dark:border-slate-700/50 shadow-md">
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
                                        className="absolute right-0 top-full mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-gray-100/50 dark:border-slate-800/50 py-3 z-50 origin-top-right overflow-hidden"
                                    >
                                        <div className="px-5 py-3 border-b border-gray-100/50 dark:border-slate-800/50 mb-2">
                                            <p className="font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                                        </div>

                                        {user?.roles && (
                                            <div className="px-3">
                                                <RoleSwitcher roles={user.roles} currentRole="ADMIN" />
                                            </div>
                                        )}

                                        <div className="px-3 py-2 space-y-1">
                                            <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all">
                                                <UserIcon size={18} className="text-gray-400" />
                                                My Profile
                                            </Link>
                                            <Link to="/admin/settings" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all">
                                                <Settings size={18} className="text-gray-400" />
                                                Settings
                                            </Link>
                                        </div>

                                        <div className="mt-2 pt-2 border-t border-gray-100/50 dark:border-slate-800/50 px-3">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-bold group"
                                            >
                                                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
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
                <div className="p-6 lg:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
