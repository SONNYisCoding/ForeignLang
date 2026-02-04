import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Sparkles, BookOpen, LogOut, Menu, X, User as UserIcon } from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

interface User {
    name: string;
    email: string;
    avatar?: string;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
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

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { name: 'Tổng quan', path: '/dashboard', icon: FileText },
        { name: 'AI Generator', path: '/dashboard/generator', icon: Sparkles },
        { name: 'Mẫu Email', path: '/dashboard/templates', icon: BookOpen },
        { name: 'Hồ sơ cá nhân', path: '/dashboard/profile', icon: UserIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-100 
                transform transition-transform duration-200 ease-in-out flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between border-b border-gray-50">
                    <Link to="/dashboard" className="flex items-center gap-2" onClick={() => setIsSidebarOpen(false)}>
                        <span className="text-2xl">🌍</span>
                        <span className="text-xl font-bold text-indigo-600">ForeignLang</span>
                    </Link>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium
                                ${isActive(item.path)
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                            `}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-50 bg-gray-50/50">
                    {user ? (
                        <div className="flex items-center gap-3 mb-4 px-2">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-12 flex items-center justify-center">
                            <span className="loading loading-dots loading-sm">Loading...</span>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-600">
                        <Menu size={24} />
                    </button>
                    <Link to="/dashboard" className="font-bold text-gray-900">ForeignLang</Link>
                    <div className="w-8" />
                </header>

                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
