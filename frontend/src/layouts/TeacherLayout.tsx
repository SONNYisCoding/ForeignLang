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
import RoleSwitcher from '../components/role/RoleSwitcher';
import { useAuth } from '../contexts/AuthContext';

interface TeacherLayoutProps {
    children: React.ReactNode;
}

const TeacherLayout = ({ children }: TeacherLayoutProps) => {
    const { i18n } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user, logout } = useAuth(); // Use global auth
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const langDropdownRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Click outside for lang dropdown
        const handleClickOutside = (event: MouseEvent) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [i18n]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
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
                        <img src="/mascot/logofl.png" alt="Logo" className="w-full h-full object-cover" />
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
                fixed top-0 left-0 h-full bg-[#F0F4F9] z-50 transition-all duration-300 border-r border-transparent shadow-sm
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
            `}>
                <div className="flex flex-col p-4">
                    <div className="flex items-center gap-3 mb-6 pl-2">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 -ml-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"
                            title={isCollapsed ? "Expand" : "Collapse"}
                        >
                            <Menu size={24} />
                        </button>

                        <Link to="/teacher" className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                            <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 ring-1 ring-gray-100 shadow-sm">
                                <img src="/mascot/logofl.png" alt="Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-lg text-gray-800 tracking-tight whitespace-nowrap font-sans">Teacher Portal</span>
                        </Link>

                        {!isCollapsed && (
                            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto p-2 text-gray-500 hover:bg-gray-200 rounded-full">
                                <X size={24} />
                            </button>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            // Check active state
                            const active = isActive(item.path);

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all font-medium relative group
                                    ${active
                                            ? 'bg-[#D3E3FD] text-[#041E49]'
                                            : 'text-gray-600 hover:bg-[#E8EAED] hover:text-gray-900'}
                                    ${isCollapsed ? 'justify-center px-0 w-12 h-12 mx-auto' : ''}
                                `}
                                    title={isCollapsed ? item.name : undefined}
                                >
                                    <Icon size={22} className={`min-w-[22px] shrink-0`} />
                                    {!isCollapsed && <span className="whitespace-nowrap truncate">{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
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
                        {user?.roles?.includes('ADMIN') && (
                            <Link to="/admin" className="text-sm text-gray-500 hover:text-indigo-600 font-medium">
                                Admin Panel
                            </Link>
                        )}

                        {/* Profile Dropdown */}
                        <div className="relative group" onMouseEnter={() => setIsProfileDropdownOpen(true)} onMouseLeave={() => setIsProfileDropdownOpen(false)}>
                            <button className="flex items-center gap-3 focus:outline-none">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-900 leading-none mb-1">{user?.name || 'Teacher'}</p>
                                    <p className="text-xs text-gray-500">{user?.roles?.[0] || 'Educator'}</p>
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

                                        {user?.roles && (
                                            <RoleSwitcher roles={user.roles} currentRole="TEACHER" />
                                        )}

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
