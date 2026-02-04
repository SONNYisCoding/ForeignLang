import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, FileText, Zap, Clock, ArrowRight } from 'lucide-react';

const DashboardPage = () => {
    const navigate = useNavigate();

    // Mock user data
    const user = { name: 'User' };
    const stats = {
        credits: 7, // 5 bonus + 2 daily
        emailsGenerated: 0,
        streak: 1
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Chào mừng trở lại, {user.name}! 👋
                </h1>
                <p className="text-gray-500 mt-2 text-lg">Hôm nay bạn muốn cải thiện kỹ năng gì?</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles size={100} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-indigo-100 font-medium mb-1">AI Credits hôm nay</p>
                        <h3 className="text-4xl font-bold mb-4">{stats.credits}</h3>
                        <Link
                            to="/dashboard/generator"
                            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors backdrop-blur-sm"
                        >
                            <Zap size={16} />
                            Dùng ngay
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <FileText size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Emails đã tạo</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.emailsGenerated}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Chuỗi ngày học</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.streak} ngày</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-bold text-gray-900 mb-6">Truy cập nhanh</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                    onClick={() => navigate('/dashboard/generator')}
                    className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
                >
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Sparkles size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Tạo Email AI mới</h3>
                    <p className="text-gray-500 text-sm mb-4 flex-1">
                        Viết email chuyên nghiệp trong vài giây với sự trợ giúp của AI.
                    </p>
                    <div className="flex items-center text-indigo-600 font-medium text-sm">
                        Bắt đầu <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>

                <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full">
                    <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileText size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Kho Mẫu Email</h3>
                    <p className="text-gray-500 text-sm mb-4 flex-1">
                        Tham khảo 500+ mẫu email tiếng Anh chuẩn cho mọi tình huống.
                    </p>
                    <div className="text-gray-400 text-sm italic">Sắp ra mắt</div>
                </div>

                <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Zap size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Học từ vựng</h3>
                    <p className="text-gray-500 text-sm mb-4 flex-1">
                        Ôn tập từ vựng Business English theo chủ đề.
                    </p>
                    <div className="text-gray-400 text-sm italic">Sắp ra mắt</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
