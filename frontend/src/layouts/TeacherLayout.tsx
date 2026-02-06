import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    BookOpen, LayoutDashboard, Users, LogOut, Menu, X,
    ChevronDown, Globe, FileText, BarChart3,
    PenLine, Settings, User as UserIcon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from '../components/NotificationDropdown';

interface TeacherLayoutProps {
    children: React.ReactNode;
}

interface User {
    name: string;
    email: string;
    role: string;
}

const TeacherLayout = ({ children }: TeacherLayoutProps) => {
    const { t, i18n } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const langDropdownRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // ... (User fetch logic remains same)
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
                    if (!roles.includes('TEACHER') && !roles.includes('ADMIN')) {
                        navigate('/dashboard');
                        return;
                    }
                    setUser({
                        name: data.name || data.fullName || 'Teacher',
                        email: data.email,
                        role: 'TEACHER'
                    });
                }
            })
            .catch(err => console.error('Failed to fetch user:', err));

        // Click outside for lang dropdown
        const handleClickOutside = (event: MouseEvent) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [navigate, i18n]);


    const handleLogout = () => {
        fetch('/api/v1/auth/logout', { method: 'POST' })
            .then(() => navigate('/login'));
    };

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { name: 'Dashboard', path: '/teacher', icon: LayoutDashboard },
        { name: 'My Lessons', path: '/teacher/lessons', icon: BookOpen },
        { name: 'Create Lesson', path: '/teacher/lessons/new', icon: PenLine },
        { name: 'My Students', path: '/teacher/students', icon: Users },
        { name: 'Templates', path: '/teacher/templates', icon: FileText },
        { name: 'Analytics', path: '/teacher/analytics', icon: BarChart3 },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white z-40 flex items-center justify-between px-4 border-b border-gray-100">
                <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 p-2">
                    <Menu size={24} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg overflow-hidden">
                        <img src="/mascot/main.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-gray-800 font-bold">Teacher Portal</span>
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
                fixed top-0 left-0 h-full bg-white z-50 transition-all duration-300 shadow-xl border-r border-gray-100
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
            `}>
                {/* Sidebar Header */}
                <div className="flex flex-col p-4 border-b border-gray-100">
                    {/* Logo Area */}
                    <Link to="/teacher" className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} transition-all duration-300 mb-6`}>
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-lg ring-1 ring-gray-100">
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
                                    <span className="font-extrabold text-sm tracking-[0.2em] text-gray-400 uppercase">
                                        Teaching
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Link>

                    {/* Menu Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} w-full py-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 group`}
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        <Menu size={20} className="shrink-0 transition-colors" />
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

                    {/* Mobile Close */}
                    <div className="lg:hidden absolute top-4 right-4">
                        <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                    ? 'bg-gradient-to-r from-indigo-500 to-teal-500 text-white shadow-lg shadow-indigo-200'
                                    : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                                    } ${isCollapsed ? 'justify-center' : ''}`}
                                title={isCollapsed ? item.name : undefined}
                            >
                                <Icon size={20} />
                                {!isCollapsed && <span className="font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className={`
                transition-all duration-300 pt-16 lg:pt-0
                ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
            `}>
                {/* Top Header */}
                <header className="hidden lg:flex h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 items-center justify-between px-8">
                    <h1 className="text-xl font-bold text-gray-800">
                        {navItems.find(i => isActive(i.path))?.name || 'Teacher Dashboard'}
                    </h1>

                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <NotificationDropdown />

                        {/* Language Switcher */}
                        <div className="relative" ref={langDropdownRef}>
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                            >
                                <Globe size={16} className="text-gray-500" />
                                <span className="text-sm font-medium">{i18n.language.toUpperCase()}</span>
                                <ChevronDown size={14} className="text-gray-400" />
                            </button>
                            <AnimatePresence>
                                {isLangOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50"
                                    >
                                        {['en', 'vi'].map(lang => (
                                            <button
                                                key={lang}
                                                onClick={() => { i18n.changeLanguage(lang); setIsLangOpen(false); }}
                                                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${i18n.language === lang ? 'bg-indigo-50 text-indigo-600' : ''
                                                    }`}
                                            >
                                                {lang === 'en' ? 'English' : 'Tiếng Việt'}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Admin link if dual role */}
                        {user?.role === 'ADMIN' && (
                            <Link to="/admin" className="text-sm text-gray-500 hover:text-indigo-600 font-medium">
                                Admin Panel
                            </Link>
                        )}

                        {/* Profile Dropdown */}
                        <div className="relative group" onMouseEnter={() => setIsProfileDropdownOpen(true)} onMouseLeave={() => setIsProfileDropdownOpen(false)}>
                            <button className="flex items-center gap-3 focus:outline-none">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-900 leading-none mb-1">{user?.name || 'Teacher'}</p>
                                    <p className="text-xs text-gray-500">{user?.role || 'Educator'}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-md">
                                    {user?.name?.charAt(0) || 'T'}
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

                                        <Link to="/teacher/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <UserIcon size={18} className="text-gray-400" />
                                            My Profile
                                        </Link>
                                        <Link to="/teacher/settings" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
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

export default TeacherLayout;
