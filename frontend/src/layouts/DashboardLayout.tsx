import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Sparkles, BookOpen, LogOut, Menu, X, User as UserIcon, Globe, ChevronDown, Settings, HelpCircle, History, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from '../components/NotificationDropdown';
import ThemeToggle from '../components/ui/ThemeToggle';
import RoleSwitcher from '../components/role/RoleSwitcher';
import SearchModal from '../components/SearchModal';
import { useAuth } from '../contexts/AuthContext';
import ChatbotWidget from '../components/ChatbotWidget';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth(); // Use Auth Context
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langDropdownRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    // Close language dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        // Navigation is handled by AuthContext or we can force it here if needed, 
        // but AuthContext usually redirects.
    };

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { name: t('dashboard.overview'), path: '/dashboard', icon: FileText },
        { name: t('dashboard.aiGenerator'), path: '/dashboard/generator', icon: Sparkles },
        { name: t('dashboard.templates'), path: '/dashboard/templates', icon: BookOpen },
        { name: 'History', path: '/dashboard/history', icon: History },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex font-sans transition-colors duration-300">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-50 h-screen bg-[#F0F4F9] dark:bg-slate-900 border-r border-transparent dark:border-slate-800
                transform transition-all duration-300 ease-in-out flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
            `}>
                <div className="flex flex-col h-full">
                    <div className="flex flex-col p-4">
                        <div className="flex items-center gap-3 mb-6 pl-2">
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="hidden lg:block p-2 -ml-2 text-gray-500 hover:bg-gray-200 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-colors"
                                title={isCollapsed ? "Expand" : "Collapse"}
                            >
                                <Menu size={24} />
                            </button>

                            <Link to="/dashboard" className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                                <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 ring-1 ring-gray-100 shadow-sm">
                                    <img src="/mascot/logofl.png" alt="Logo" className="w-full h-full object-cover" />
                                </div>
                                <span className="font-bold text-lg text-gray-800 dark:text-white tracking-tight whitespace-nowrap font-sans">ForeignLang</span>
                            </Link>

                            {!isCollapsed && (
                                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto p-2 text-gray-500 hover:bg-gray-200 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full">
                                    <X size={24} />
                                </button>
                            )}
                        </div>

                        {/* Search Trigger */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={`group flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white rounded-full transition-all mb-6 shadow-sm border border-gray-200/60 dark:border-slate-700 ${isCollapsed ? 'justify-center px-0 w-12 h-12 mx-auto' : 'w-full'
                                }`}
                            title="Search (Ctrl+K)"
                        >
                            <Search size={20} className="shrink-0" />
                            {!isCollapsed && <span className="font-medium truncate">Search...</span>}
                        </button>

                        {/* Navigation */}
                        <nav className="flex-1 space-y-1">
                            {navItems.map((item) => {
                                // Check active state
                                const active = isActive(item.path);

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all font-medium relative group
                                        ${active
                                                ? 'bg-[#D3E3FD] dark:bg-indigo-900/50 text-[#041E49] dark:text-indigo-300' // Indigo Theme for Learner
                                                : 'text-gray-600 dark:text-slate-400 hover:bg-[#E8EAED] dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'}
                                        ${isCollapsed ? 'justify-center px-0 w-12 h-12 mx-auto' : ''}
                                    `}
                                        title={isCollapsed ? item.name : undefined}
                                    >
                                        <item.icon size={22} className={`min-w-[22px] shrink-0`} />
                                        {!isCollapsed && <span className="whitespace-nowrap truncate">{item.name}</span>}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    <div className="p-4 mt-auto">
                        {/* Upgrade Card - Minimal */}
                        {!isCollapsed ? (
                            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-50 dark:from-slate-800 dark:to-slate-800 border border-indigo-100 dark:border-slate-700">
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
                                    <span className="font-semibold text-sm text-indigo-900 dark:text-indigo-200">Pro Plan</span>
                                </div>
                                <p className="text-xs text-indigo-700/80 dark:text-slate-400 mb-3 line-clamp-2">Get unlimited AI credits & exclusive features.</p>
                                <Link to="/upgrade" className="block w-full text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-200 dark:shadow-none">
                                    Upgrade
                                </Link>
                            </div>
                        ) : (
                            <Link to="/upgrade" className="flex items-center justify-center w-12 h-12 mx-auto bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-slate-700 rounded-full transition-colors" title="Upgrade">
                                <Sparkles size={20} />
                            </Link>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <header className="bg-white/90 dark:bg-slate-900/90 border-b border-gray-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm/50 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">
                            {navItems.find(i => isActive(i.path))?.name || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Notifications */}
                        <NotificationDropdown />

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Language Switch */}
                        <div className="relative" ref={langDropdownRef}>
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all bg-white dark:bg-slate-800 shadow-sm"
                            >
                                <Globe size={16} className="text-gray-500 dark:text-slate-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
                                    {i18n.language === 'en' ? 'EN' : 'VI'}
                                </span>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isLangOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.1 }}
                                        className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50"
                                    >
                                        <button
                                            onClick={() => { i18n.changeLanguage('vi'); setIsLangOpen(false); }}
                                            className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${i18n.language === 'vi' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-600 dark:text-slate-300'}`}
                                        >
                                            Tiếng Việt
                                        </button>
                                        <button
                                            onClick={() => { i18n.changeLanguage('en'); setIsLangOpen(false); }}
                                            className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${i18n.language === 'en' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-600 dark:text-slate-300'}`}
                                        >
                                            English
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative group" onMouseEnter={() => setIsProfileDropdownOpen(true)} onMouseLeave={() => setIsProfileDropdownOpen(false)}>
                            <button className="flex items-center gap-3 focus:outline-none">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none mb-1">{user?.name || 'User'}</p>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">{t('dashboard.welcome', { name: '' }).replace(',', '').trim()}</p>
                                </div>
                                <div className="relative">
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 shadow-md" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border-2 border-white dark:border-slate-700 shadow-md">
                                            {user?.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                                </div>
                            </button>

                            <AnimatePresence>
                                {isProfileDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 z-50 origin-top-right"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-50 dark:border-slate-700 mb-2">
                                            <p className="font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user?.email}</p>
                                        </div>

                                        {user?.roles && (
                                            <RoleSwitcher roles={user.roles} currentRole="LEARNER" />
                                        )}

                                        <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                            <UserIcon size={18} className="text-gray-400 dark:text-slate-500" />
                                            {t('dashboard.myProfile')}
                                        </Link>
                                        <Link to="/dashboard/settings" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                            <Settings size={18} className="text-gray-400 dark:text-slate-500" />
                                            {t('dashboard.settings')}
                                        </Link>
                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                            <HelpCircle size={18} className="text-gray-400 dark:text-slate-500" />
                                            {t('dashboard.help')}
                                        </button>

                                        <div className="mt-2 pt-2 border-t border-gray-50 dark:border-slate-700 px-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium"
                                            >
                                                <LogOut size={18} />
                                                {t('dashboard.logout')}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50/50 dark:bg-slate-950/50">
                    {children}
                </div>
            </main>

            {/* AI Chatbot Widget */}
            <ChatbotWidget />
        </div>
    );
};

export default DashboardLayout;
