import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    TrendingUp,
    MessageCircle,
    MoreHorizontal,
    Zap,
    LogOut,
    User,
    Search
} from 'lucide-react';

const DashboardPage = () => {
    const [user, setUser] = useState({
        name: 'Loading...',
        email: '',
        tier: 'FREE',
        usageCount: 0,
        usageLimit: 5,
        avatar: null
    });

    const [topics, setTopics] = useState([
        { id: 1, title: 'Business Emails', description: 'Learn to write professional emails', level: 'BEGINNER', color: 'bg-green-100 text-green-700' },
        { id: 2, title: 'Presentations', description: 'Master public speaking skills', level: 'INTERMEDIATE', color: 'bg-yellow-100 text-yellow-700' },
        { id: 3, title: 'Negotiations', description: 'Advanced negotiation tactics', level: 'ADVANCED', color: 'bg-red-100 text-red-700' },
    ]);

    useEffect(() => {
        // Fetch user data from backend
        // Note: Credentials include is required for JSESSIONID cookie
        import('axios').then(axios => {
            axios.default.get('http://localhost:8080/api/v1/user/me', { withCredentials: true })
                .then(response => {
                    if (response.data) {
                        setUser(prev => ({
                            ...prev,
                            name: response.data.name || 'User',
                            email: response.data.email,
                            avatar: response.data.avatar,
                            tier: response.data.tier,
                            usageCount: response.data.usageCount || 0,
                            usageLimit: response.data.usageLimit || 5
                        }));
                    }
                })
                .catch(error => {
                    console.error("Failed to fetch user:", error);
                    // Redirect to login if 401? For now just stay on loading or show guest
                });
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-indigo-800 to-indigo-900 text-white flex flex-col fixed h-full shadow-xl">
                <div className="p-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <span>🌍</span> ForeignLang
                    </h1>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    <NavItem icon={<TrendingUp size={20} />} label="Dashboard" active />
                    <NavItem icon={<BookOpen size={20} />} label="My Lessons" />
                    <NavItem icon={<Zap size={20} />} label="AI Practice" />
                    <NavItem icon={<MessageCircle size={20} />} label="Consultant" />
                </nav>

                <div className="p-4 bg-indigo-950/50 backdrop-blur-sm border-t border-indigo-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                            {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full" /> : user.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{user.tier}</span>
                            </div>
                        </div>
                        <a href="http://localhost:8080/logout" className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                            <LogOut size={16} className="text-white/70" />
                        </a>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}! 👋</h1>
                        <p className="text-gray-500 mt-1">Ready to improve your English today?</p>
                    </div>

                    {user.tier === 'FREE' && (
                        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition transform flex items-center gap-2">
                            <Zap size={18} />
                            Upgrade to Premium
                        </button>
                    )}
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        icon={<Zap className="text-yellow-600" />}
                        bg="bg-yellow-100"
                        title="Daily AI Usage"
                        value={`${user.usageCount} / ${user.usageLimit}`}
                        subtext="Requests used today"
                    >
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
                            <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${(user.usageCount / user.usageLimit) * 100}%` }}></div>
                        </div>
                    </StatCard>

                    <StatCard
                        icon={<BookOpen className="text-blue-600" />}
                        bg="bg-blue-100"
                        title="Lessons Completed"
                        value="12"
                        subtext="+2 this week"
                    />

                    <StatCard
                        icon={<TrendingUp className="text-green-600" />}
                        bg="bg-green-100"
                        title="Current Streak"
                        value="5 Days"
                        subtext="Keep it up!"
                    />
                </div>

                {/* Topics Section */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Learning Topics</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search topics..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm w-64"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topics.map(topic => (
                        <div key={topic.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-100 group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${topic.color}`}>
                                    {topic.level}
                                </span>
                                <button className="text-gray-300 hover:text-gray-500">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                {topic.title}
                            </h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                {topic.description}
                            </p>

                            <div className="flex items-center text-sm font-medium text-indigo-600">
                                Start Learning
                                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
    <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-white/10 text-white shadow-sm font-medium' : 'text-indigo-200 hover:bg-white/5 hover:text-white'}`}>
        {icon}
        <span>{label}</span>
    </a>
);

const StatCard = ({ icon, bg, title, value, subtext, children }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${bg}`}>
                {icon}
            </div>
            {/* Optional badge or menu could go here */}
        </div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
        <p className="text-xs text-gray-400 mt-1">{subtext}</p>
        {children}
    </div>
);

export default DashboardPage;
