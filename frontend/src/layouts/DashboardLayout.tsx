import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Sparkles, BookOpen, LogOut, Menu, X, User as UserIcon, Globe, ChevronDown, Settings, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

interface User {
    name: string;
    email: string;
    avatar?: string;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { t, i18n } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data
        fetch('/api/v1/user/me')
            .then(res => {
                if (res.status === 401) {
                    navigate('/login');
                    return null;
                }
                return res.json();
            })
            .then(data => {
                if (data) {
                    setUser({
                        name: data.name || data.fullName || 'User',
                        email: data.email,
                        avatar: data.avatar
                    });
                }
            })
            .catch(err => console.error('Failed to fetch user:', err));
    }, [navigate]);

    const handleLogout = () => {
        fetch('/api/v1/auth/logout', { method: 'POST' })
            .then(() => navigate('/login'));
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'vi' : 'en';
        i18n.changeLanguage(newLang);
    };

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { name: t('dashboard.overview'), path: '/dashboard', icon: FileText },
        { name: t('dashboard.aiGenerator'), path: '/dashboard/generator', icon: Sparkles },
        { name: t('dashboard.templates'), path: '/dashboard/templates', icon: BookOpen },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-100 
                transform transition-transform duration-300 ease-in-out flex flex-col shadow-sm
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between border-b border-gray-50/50">
                    <Link to="/dashboard" className="flex items-center gap-3 group" onClick={() => setIsSidebarOpen(false)}>
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                            🌍
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
                            ForeignLang
                        </span>
                    </Link>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-900 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-medium group relative overflow-hidden
                                ${isActive(item.path)
                                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                            `}
                        >
                            {isActive(item.path) && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute left-0 w-1 h-8 bg-indigo-600 rounded-r-full"
                                />
                            )}
                            <item.icon size={22} className={isActive(item.path) ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl shadow-indigo-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={16} className="text-yellow-300" />
                            <span className="font-bold text-sm">Pro Plan</span>
                        </div>
                        <p className="text-xs text-indigo-100 mb-3">Upgrade for unlimited AI credits.</p>
                        <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors backdrop-blur-sm">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm/50 backdrop-blur-xl bg-white/90">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
                            {navItems.find(i => isActive(i.path))?.name || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Language Switch */}
                        <button
                            onClick={toggleLanguage}
                            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <Globe size={16} />
                            {i18n.language === 'en' ? 'EN' : 'VI'}
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative group" onMouseEnter={() => setIsProfileDropdownOpen(true)} onMouseLeave={() => setIsProfileDropdownOpen(false)}>
                            <button className="flex items-center gap-3 focus:outline-none">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-900 leading-none mb-1">{user?.name || 'User'}</p>
                                    <p className="text-xs text-gray-500">{t('dashboard.welcome', { name: '' }).replace(',', '').trim()}</p>
                                </div>
                                <div className="relative">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white shadow-md" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-md">
                                            {user?.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
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

                                        <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <UserIcon size={18} className="text-gray-400" />
                                            {t('dashboard.myProfile')}
                                        </Link>
                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <Settings size={18} className="text-gray-400" />
                                            {t('dashboard.settings')}
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <HelpCircle size={18} className="text-gray-400" />
                                            {t('dashboard.help')}
                                        </button>

                                        <div className="mt-2 pt-2 border-t border-gray-50 px-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
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

                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50/50">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
