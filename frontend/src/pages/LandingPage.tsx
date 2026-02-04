import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, X, Send, Mail, FileText, Sparkles, Zap, BookOpen, Users, ChevronRight, Star } from 'lucide-react';
import AuthPromptModal from '../components/AuthPromptModal';

const LandingPage = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

    const openPrompt = () => {
        setIsPromptModalOpen(true);
    };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Auth Prompt Modal */}
            <AuthPromptModal
                isOpen={isPromptModalOpen}
                onClose={() => setIsPromptModalOpen(false)}
                title="Đăng ký để sử dụng tính năng này"
                message="Tạo tài khoản miễn phí để tạo email với AI"
            />


            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🌍</span>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                ForeignLang
                            </span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
                            <a href="#templates" className="text-gray-600 hover:text-gray-900 font-medium">Templates</a>
                            <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to="/register"
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition font-medium shadow-lg hover:shadow-xl"
                            >
                                Bắt đầu miễn phí
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow">
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-white -z-10" />
                    <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full filter blur-3xl opacity-20 animate-pulse" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-300 rounded-full filter blur-3xl opacity-20 animate-pulse" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center lg:pt-32">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-8">
                            <Sparkles size={16} />
                            5 FREE AI generations for new users!
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
                            Write Professional Emails <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                in Seconds with AI
                            </span>
                        </h1>

                        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 mb-10">
                            Generate perfect business emails, access 500+ templates, and master workplace English.
                            Join 10,000+ professionals improving their communication.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={() => openPrompt()}
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition flex items-center justify-center gap-2"
                            >
                                <Zap size={20} />
                                Try AI Email Generator
                            </button>
                            <a
                                href="#templates"
                                className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg shadow-sm hover:bg-gray-50 transition flex items-center justify-center gap-2"
                            >
                                <FileText size={20} />
                                Browse Templates
                            </a>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-400">
                            <div className="flex items-center gap-2">
                                <Users size={20} />
                                <span>10,000+ users</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="#fbbf24" className="text-yellow-400" />)}
                                <span className="ml-1">4.9 rating</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={20} />
                                <span>1M+ emails generated</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Email Generator Demo Section */}
                <section id="features" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">AI Email Generator</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Describe what you need, and our AI writes the perfect email instantly.
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-indigo-50 rounded-3xl p-8 border border-gray-200 shadow-lg">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Input Side */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">What kind of email do you need?</label>
                                    <textarea
                                        placeholder="e.g., Request a meeting with my manager about salary increase"
                                        className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"


                                    />
                                    <div className="flex gap-3">
                                        <select className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-white">
                                            <option>Formal Tone</option>
                                            <option>Friendly Tone</option>
                                            <option>Urgent Tone</option>
                                        </select>
                                        <button
                                            onClick={() => openPrompt()}
                                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition flex items-center gap-2"
                                        >
                                            <Sparkles size={18} />
                                            Generate
                                        </button>
                                    </div>
                                </div>

                                {/* Output Side */}
                                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4 text-gray-400">
                                        <Mail size={18} />
                                        <span className="text-sm font-medium">Generated Email</span>
                                    </div>
                                    <div className="space-y-3 text-gray-500 text-sm">
                                        <p className="font-medium text-gray-700">Subject: Request for Meeting - Career Discussion</p>
                                        <p>Dear [Manager's Name],</p>
                                        <p>I hope this email finds you well. I would like to schedule a meeting at your earliest convenience to discuss...</p>
                                        <p className="text-indigo-600 cursor-pointer hover:underline" onClick={() => openPrompt()}>
                                            🔒 Sign in to see full email and copy
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Email Templates Section */}
                <section id="templates" className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">500+ Email Templates</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Ready-to-use templates for every professional situation.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[
                                { icon: '💼', title: 'Job Application', count: 45 },
                                { icon: '🤝', title: 'Meeting Request', count: 32 },
                                { icon: '🙏', title: 'Thank You', count: 28 },
                                { icon: '📋', title: 'Follow-up', count: 36 },
                                { icon: '😔', title: 'Apology', count: 24 },
                                { icon: '💡', title: 'Proposal', count: 41 },
                                { icon: '📢', title: 'Announcement', count: 19 },
                                { icon: '🎉', title: 'Congratulations', count: 15 },
                            ].map((template, i) => (
                                <div
                                    key={i}
                                    onClick={() => openPrompt()}
                                    className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition cursor-pointer group"
                                >
                                    <div className="text-3xl mb-3">{template.icon}</div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition">{template.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{template.count} templates</p>
                                    <div className="mt-3 flex items-center text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                                        View all <ChevronRight size={16} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <button
                                onClick={() => openPrompt()}
                                className="text-indigo-600 font-medium hover:underline flex items-center justify-center gap-1 mx-auto"
                            >
                                View all 500+ templates <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
                            <p className="text-xl text-gray-600">Start free, upgrade when you need more.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Free Plan */}
                            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
                                <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                                <p className="text-gray-500 mt-2">Perfect for getting started</p>
                                <div className="mt-6">
                                    <span className="text-5xl font-bold text-gray-900">0₫</span>
                                    <span className="text-gray-500">/month</span>
                                </div>
                                <ul className="mt-8 space-y-4">
                                    <li className="flex items-center gap-3 text-gray-600">
                                        <span className="text-green-500">✓</span> 5 bonus AI uses on signup
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-600">
                                        <span className="text-green-500">✓</span> 2 free AI uses per day
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-600">
                                        <span className="text-green-500">✓</span> +3 more via watching ads
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-600">
                                        <span className="text-green-500">✓</span> Basic email templates
                                    </li>
                                </ul>
                                <button
                                    onClick={() => openPrompt()}
                                    className="w-full mt-8 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-100 transition"
                                >
                                    Get Started
                                </button>
                            </div>

                            {/* Premium Plan */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
                                <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                                    POPULAR
                                </div>
                                <h3 className="text-2xl font-bold">Premium</h3>
                                <p className="text-indigo-200 mt-2">For power users</p>
                                <div className="mt-6">
                                    <span className="text-5xl font-bold">29,000₫</span>
                                    <span className="text-indigo-200">/month</span>
                                </div>
                                <ul className="mt-8 space-y-4">
                                    <li className="flex items-center gap-3">
                                        <span>✓</span> Unlimited AI generations
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span>✓</span> No ads
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span>✓</span> All 500+ premium templates
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span>✓</span> AI Mini-Teacher chatbot
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span>✓</span> Priority support
                                    </li>
                                </ul>
                                <button
                                    onClick={() => openPrompt()}
                                    className="w-full mt-8 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-100 transition"
                                >
                                    Start 7-Day Trial
                                </button>
                            </div>
                        </div>

                        <p className="text-center text-gray-500 mt-8">
                            Or save with quarterly: <span className="font-bold text-gray-700">79,000₫/3 months</span> (9% off)
                        </p>
                    </div>
                </section>

                {/* Learning Section Preview */}
                <section className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <BookOpen className="w-16 h-16 mx-auto mb-6 opacity-80" />
                        <h2 className="text-4xl font-bold mb-4">Learn Workplace English</h2>
                        <p className="text-xl text-indigo-200 max-w-2xl mx-auto mb-10">
                            Structured micro-lessons for vocabulary, email writing, and presentations.
                            Learn at your own pace with AI-powered guidance.
                        </p>
                        <button
                            onClick={() => openPrompt()}
                            className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition"
                        >
                            Start Learning for Free
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-2xl">🌍</span>
                    <span className="text-xl font-bold text-white ml-2">ForeignLang</span>
                    <p className="mt-4">© 2026 ForeignLang. All rights reserved.</p>
                </div>
            </footer>

            {/* Chatbot Widget */}
            <div className={`fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 z-50 ${isChatOpen ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0 pointer-events-none'}`}>
                {isChatOpen && (
                    <div className="flex flex-col h-[500px]">
                        <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl flex justify-between items-center text-white">
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
                                    <p className="text-gray-600 text-sm">👋 Hello! I'm your AI Consultant. I can help you find the right email template or answer questions about our features. What do you need help with?</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['Email templates', 'How AI works', 'Pricing info'].map((q, i) => (
                                    <button key={i} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition">
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ask me anything..."
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                                />
                                <button className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
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
                    className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition hover:scale-110 z-50"
                >
                    <MessageCircle size={28} />
                </button>
            )}
        </div>
    );
};

export default LandingPage;
