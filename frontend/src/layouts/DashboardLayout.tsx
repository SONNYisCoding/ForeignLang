import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Sparkles, BookOpen, LogOut, Menu, X, User as UserIcon, Globe, ChevronDown, Settings, HelpCircle, History, Search, PenTool, Map, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from '../components/NotificationDropdown';
import ThemeToggle from '../components/ui/ThemeToggle';
import CreditDropdown from '../components/ui/CreditModal';
import RoleSwitcher from '../components/role/RoleSwitcher';
import SearchModal from '../components/SearchModal';
import { useAuth } from '../contexts/AuthContext';
import { useCredits } from '../contexts/CreditContext';
import { useSidebar } from '../contexts/SidebarContext';
import ChatbotWidget from '../components/ChatbotWidget';
import SidebarToggle from '../components/ui/SidebarToggle';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();
    const { credits, isCreditLoading } = useCredits();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isCollapsed, toggleSidebar } = useSidebar();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCreditDropdownOpen, setIsCreditDropdownOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langDropdownRef = useRef<HTMLDivElement>(null);
    const creditBtnRef = useRef<HTMLButtonElement>(null);
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
        { name: 'AI Feedback', path: '/dashboard/feedback', icon: PenTool },
        { name: 'My Roadmap', path: '/dashboard/roadmap', icon: Map },
        { name: t('dashboard.templates'), path: '/dashboard/templates', icon: BookOpen },
        { name: 'Topics & Lessons', path: '/dashboard/topics', icon: BookOpen },
        { name: 'Vocabulary', path: '/dashboard/vocabulary', icon: FileText },
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
                fixed lg:sticky top-0 left-0 z-50 h-[100dvh] bg-[#F0F4F9] dark:bg-slate-900 border-r border-transparent dark:border-slate-800
                transform transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col overflow-x-hidden
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${isCollapsed ? 'w-64 lg:w-20' : 'w-64 lg:w-72'}
            `}>
                <div className="flex flex-col h-full w-full">
                    <div className="flex flex-col py-4 px-3 w-full">

                        {/* Header Row */}
                        <div className="flex items-center h-14 mb-4 shrink-0">
                            <div className="hidden lg:flex w-14 h-14 items-center justify-center shrink-0">
                                <SidebarToggle
                                    isCollapsed={isCollapsed}
                                    toggle={toggleSidebar}
                                    title={isCollapsed ? "Expand" : "Collapse"}
                                    className="scale-90"
                                />
                            </div>

                            <Link to="/dashboard" className={`flex items-center gap-2 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 lg:pointer-events-none' : 'opacity-100 lg:ml-1'}`}>
                                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 ring-1 ring-gray-100 shadow-sm">
                                    <img src="/mascot/logofl.png" alt="Logo" className="w-full h-full object-cover" />
                                </div>
                                <span className="font-bold text-lg text-gray-800 dark:text-white tracking-tight whitespace-nowrap font-sans">ForeignLang</span>
                            </Link>

                            <button onClick={() => setIsSidebarOpen(false)} className={`lg:hidden ml-auto p-2 text-gray-500 hover:bg-gray-200 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-opacity ${isCollapsed ? 'opacity-0 pointer-events-none w-0 h-0 p-0' : 'opacity-100'}`}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Search Trigger */}
                        <div className="mb-6">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className={`group flex items-center w-full bg-white dark:bg-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-colors shadow-sm border border-gray-200/60 dark:border-slate-700/50 overflow-hidden`}
                                title="Search (Ctrl+K)"
                            >
                                <div className="w-14 h-12 flex items-center justify-center shrink-0">
                                    <Search size={18} className="group-hover:text-indigo-500 transition-colors" />
                                </div>
                                <div className={`flex items-center justify-between flex-1 pr-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                                    <span className="font-medium text-sm whitespace-nowrap">Search...</span>
                                    <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-400 bg-gray-100 dark:bg-slate-900/50 rounded flex-shrink-0">
                                        <span className="text-xs">⌘</span>K
                                    </kbd>
                                </div>
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 space-y-1.5 w-full">
                            {navItems.map((item) => {
                                // Check active state
                                const active = isActive(item.path);

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center w-full rounded-2xl transition-colors font-medium relative group overflow-hidden
                                        ${active
                                                ? 'text-[#041E49] dark:text-indigo-300'
                                                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}
                                    `}
                                        title={isCollapsed ? item.name : undefined}
                                    >
                                        {active && (
                                            <motion.div
                                                layoutId="activeNavIndicator"
                                                className="absolute inset-0 bg-[#D3E3FD] dark:bg-indigo-900/50 rounded-2xl border border-indigo-100 dark:border-indigo-800/50"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        <div className="relative z-10 w-14 h-12 flex items-center justify-center shrink-0">
                                            <item.icon size={22} className="shrink-0" />
                                        </div>
                                        <div className={`relative z-10 flex-1 whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                                            {item.name}
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="px-3 mt-auto">
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
                <header className="bg-white/80 dark:bg-slate-900/80 border-b border-gray-200/50 dark:border-slate-800/80 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm/30 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl transition-colors">
                            <Menu size={24} />
                        </button>
                        <div className="hidden sm:flex items-center gap-2 text-sm">
                            <span className="text-gray-500 dark:text-slate-400 font-medium px-2 py-1 bg-gray-100/50 dark:bg-slate-800/50 rounded-lg">Pages</span>
                            <span className="text-gray-300 dark:text-slate-600">/</span>
                            <motion.h1
                                key={location.pathname}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-lg font-bold text-gray-900 dark:text-white"
                            >
                                {navItems.find(i => isActive(i.path))?.name || 'Dashboard'}
                            </motion.h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Notifications */}
                        <NotificationDropdown />

                        {/* ═══ Global AI Credit Badge ═══ */}
                        <div className="relative">
                            <button
                                ref={creditBtnRef}
                                onClick={() => setIsCreditDropdownOpen(!isCreditDropdownOpen)}
                                className="group flex items-center gap-1.5 px-3 py-2 rounded-full border border-purple-200 dark:border-purple-800/50 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 hover:shadow-lg hover:shadow-purple-500/10 transition-all hover:-translate-y-0.5"
                                title="AI Credits"
                            >
                                <Zap size={14} className="text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400" />
                                {isCreditLoading ? (
                                    <span className="w-5 h-4 bg-purple-200 dark:bg-purple-700 rounded animate-pulse" />
                                ) : (
                                    <span className="text-sm font-black text-purple-700 dark:text-purple-300">{credits ?? 0}</span>
                                )}
                                <span className="relative flex h-5 w-5 items-center justify-center ml-0.5 bg-purple-200 dark:bg-purple-800/50 text-purple-700 dark:text-purple-300 rounded-full text-xs font-black group-hover:bg-purple-300 dark:group-hover:bg-purple-700/50 transition-colors">
                                    +
                                </span>
                            </button>
                            <CreditDropdown isOpen={isCreditDropdownOpen} onClose={() => setIsCreditDropdownOpen(false)} anchorRef={creditBtnRef} />
                        </div>

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
                                        initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(5px)' }}
                                        transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
                                        className="absolute right-0 top-full mt-3 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-500/10 dark:shadow-black/40 border border-white/20 dark:border-slate-700/50 py-3 z-50 origin-top-right overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>

                                        <div className="px-5 py-3 border-b border-gray-100 dark:border-slate-800 mb-2 relative z-10">
                                            <p className="font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-slate-400 truncate">{user?.email}</p>
                                        </div>

                                        {user?.roles && (
                                            <div className="relative z-10">
                                                <RoleSwitcher roles={user.roles} currentRole="LEARNER" />
                                            </div>
                                        )}

                                        <div className="px-2 space-y-1 relative z-10">
                                            <Link to="/dashboard/profile" className="group flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
                                                <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 text-gray-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    <UserIcon size={16} />
                                                </div>
                                                <span className="transform transition-transform group-hover:translate-x-1">{t('dashboard.myProfile')}</span>
                                            </Link>
                                            <Link to="/dashboard/settings" className="group flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white transition-all">
                                                <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 text-gray-500 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                    <Settings size={16} />
                                                </div>
                                                <span className="transform transition-transform group-hover:translate-x-1">{t('dashboard.settings')}</span>
                                            </Link>
                                            <button className="w-full group flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white transition-all text-left">
                                                <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 text-gray-500 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                    <HelpCircle size={16} />
                                                </div>
                                                <span className="transform transition-transform group-hover:translate-x-1">{t('dashboard.help')}</span>
                                            </button>
                                        </div>

                                        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-slate-800 px-3 relative z-10">
                                            <button
                                                onClick={handleLogout}
                                                className="group w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                            >
                                                <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/10 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors">
                                                    <LogOut size={16} />
                                                </div>
                                                <span className="transform transition-transform group-hover:translate-x-1">{t('dashboard.logout')}</span>
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
