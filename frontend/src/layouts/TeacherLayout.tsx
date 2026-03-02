import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    BookOpen, LayoutDashboard, Users, LogOut, Menu, X,
    PenLine, Settings, User as UserIcon, BarChart3
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from '../components/NotificationDropdown';
import ThemeToggle from '../components/ui/ThemeToggle';
import RoleSwitcher from '../components/role/RoleSwitcher';
import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';
import SidebarToggle from '../components/ui/SidebarToggle';

interface TeacherLayoutProps {
    children: React.ReactNode;
}

const TeacherLayout = ({ children }: TeacherLayoutProps) => {
    const { i18n } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isCollapsed, toggleSidebar } = useSidebar();
    const { user, logout } = useAuth(); // Use global auth
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const prevLangRef = useRef(i18n.language);
    useEffect(() => {
        prevLangRef.current = i18n.language;
        i18n.changeLanguage('en'); // Force English for Teacher
        return () => { i18n.changeLanguage(prevLangRef.current); };
    }, []);

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
        { name: 'Analytics', path: '/teacher/analytics', icon: BarChart3 },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-40 flex items-center justify-between px-4 border-b border-gray-100 dark:border-slate-800">
                <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors">
                    <Menu size={24} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-slate-700">
                        <img src="/mascot/logofl.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-gray-800 dark:text-white font-bold tracking-tight">Teacher Portal</span>
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
                fixed top-0 left-0 h-[100dvh] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-50 transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-gray-200/50 dark:border-slate-800/50 shadow-sm overflow-x-hidden
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${isCollapsed ? 'w-64 lg:w-20' : 'w-64 lg:w-72'}
            `}>
                <div className="flex flex-col py-4 px-3 w-full h-full">

                    {/* Header Row */}
                    <div className="flex items-center h-14 mb-8 shrink-0">
                        <div className="hidden lg:flex w-14 h-14 items-center justify-center shrink-0">
                            <SidebarToggle
                                isCollapsed={isCollapsed}
                                toggle={toggleSidebar}
                                title={isCollapsed ? "Expand" : "Collapse"}
                                className="scale-90"
                            />
                        </div>

                        <Link to="/teacher" className={`flex items-center gap-2 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 lg:pointer-events-none' : 'opacity-100 lg:ml-1'}`}>
                            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 ring-1 ring-gray-100 dark:ring-slate-700 shadow-sm">
                                <img src="/mascot/logofl.png" alt="Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-lg text-gray-800 dark:text-white tracking-tight whitespace-nowrap font-sans">Teacher Portal</span>
                        </Link>

                        <button onClick={() => setIsSidebarOpen(false)} className={`lg:hidden ml-auto p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-opacity ${isCollapsed ? 'opacity-0 pointer-events-none w-0 h-0 p-0' : 'opacity-100'}`}>
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1.5 w-full">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            // Check active state
                            const active = isActive(item.path);

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center w-full rounded-2xl transition-colors font-bold relative group overflow-hidden
                                    ${active
                                            ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 text-indigo-700 dark:text-indigo-400 shadow-sm border border-indigo-500/10'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white border border-transparent'}
                                    `}
                                    title={isCollapsed ? item.name : undefined}
                                >
                                    {active && (
                                        <motion.div layoutId="activeNavTeacher" className={`absolute top-1/4 bottom-1/4 w-1 bg-indigo-500 dark:bg-indigo-400 rounded-r-full transition-[left,opacity] duration-300 ${isCollapsed ? 'left-0' : 'left-0'}`} />
                                    )}
                                    <div className="relative z-10 w-14 h-12 flex items-center justify-center shrink-0">
                                        <Icon size={22} className={`shrink-0 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors'}`} />
                                    </div>
                                    <div className={`relative z-10 flex-1 whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                                        {item.name}
                                    </div>
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
                <header className="hidden lg:flex h-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800/50 items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                        {navItems.find(i => isActive(i.path))?.name || 'Teacher Dashboard'}
                    </h1>

                    <div className="flex items-center gap-5">
                        {/* Notifications */}
                        <NotificationDropdown />

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Admin link if dual role */}
                        {user?.roles?.includes('ADMIN') && (
                            <Link to="/admin" className="text-sm text-gray-500 hover:text-indigo-600 font-medium">
                                Admin Panel
                            </Link>
                        )}

                        {/* Profile Dropdown */}
                        <div className="relative group" onMouseEnter={() => setIsProfileDropdownOpen(true)} onMouseLeave={() => setIsProfileDropdownOpen(false)}>
                            <button className="flex items-center gap-3 focus:outline-none p-1 rounded-full hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors pr-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1">{user?.name || 'Teacher'}</p>
                                    <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{user?.roles?.[0] || 'Educator'}</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white font-bold border-2 border-white/50 dark:border-slate-700/50 shadow-md">
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
                                        className="absolute right-0 top-full mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-gray-100/50 dark:border-slate-800/50 py-3 z-50 origin-top-right overflow-hidden"
                                    >
                                        <div className="px-5 py-3 border-b border-gray-100/50 dark:border-slate-800/50 mb-2">
                                            <p className="font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                                        </div>

                                        {user?.roles && (
                                            <div className="px-3">
                                                <RoleSwitcher roles={user.roles} currentRole="TEACHER" />
                                            </div>
                                        )}

                                        <div className="px-3 py-2 space-y-1">
                                            <Link to="/teacher/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all">
                                                <UserIcon size={18} className="text-gray-400" />
                                                My Profile
                                            </Link>
                                            <Link to="/teacher/settings" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all">
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
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default TeacherLayout;
