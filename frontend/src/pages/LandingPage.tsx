import React, { useState } from 'react';
import { MessageCircle, X, Send, BookOpen, CheckCircle, TrendingUp } from 'lucide-react';

const LandingPage = () => {
    const [isChatOpen, setIsChatOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-500">
                                ForeignLang
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="http://localhost:8080/oauth2/authorization/google"
                                className="bg-primary-600 text-white px-5 py-2.5 rounded-xl hover:bg-primary-700 transition font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200">
                                Login with Google
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow">
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white -z-10" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                            Master Academic English <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">
                                & Workplace Skills
                            </span>
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 mb-10">
                            Elevate your professional communication with our AI-powered learning platform.
                            Draft emails, write reports, and perfect your grammar instantly.
                        </p>
                        <div className="flex justify-center gap-4">
                            <a href="http://localhost:8080/oauth2/authorization/google"
                                className="px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg shadow-xl hover:bg-primary-700 transition hover:shadow-2xl transform hover:-translate-y-1">
                                Get Started for Free
                            </a>
                            <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg shadow-sm hover:bg-gray-50 transition">
                                View Features
                            </button>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<BookOpen className="w-8 h-8 text-primary-600" />}
                            title="Smart Templates"
                            description="Access hundreds of professional templates for emails, reports, and presentations."
                        />
                        <FeatureCard
                            icon={<CheckCircle className="w-8 h-8 text-green-500" />}
                            title="AI Grammar Check"
                            description="Real-time feedback on your writing style, tone, and grammatical accuracy."
                        />
                        <FeatureCard
                            icon={<TrendingUp className="w-8 h-8 text-accent-500" />}
                            title="Progress Tracking"
                            description="Monitor your improvement over time with detailed analytics and insights."
                        />
                    </div>
                </div>
            </main>

            {/* Chatbot Widget */}
            <div className={`fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 z-50 ${isChatOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                {isChatOpen && (
                    <div className="flex flex-col h-[500px]">
                        <div className="p-4 bg-gradient-to-r from-primary-600 to-accent-500 rounded-t-2xl flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white/20 rounded-lg">
                                    <MessageCircle size={20} />
                                </div>
                                <span className="font-semibold">Consultant Bot</span>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-1 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[80%]">
                                    <p className="text-gray-600 text-sm">Hello! I'm your AI Consultant. How can I help you improve your English today?</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ask me anything..."
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                />
                                <button className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition">
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {!isChatOpen && (
                <button
                    onClick={() => setIsChatOpen(true)}
                    className="fixed bottom-6 right-6 p-4 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition hover:scale-110 z-50"
                >
                    <MessageCircle size={28} />
                </button>
            )}
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition card-hover group">
        <div className="p-3 bg-gray-50 rounded-xl w-fit mb-4 group-hover:scale-110 transition duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
);

export default LandingPage;
