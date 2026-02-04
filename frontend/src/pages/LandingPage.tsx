import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Sparkles, Globe, Shield, Zap, Star, Users, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage = () => {
    const { t, i18n } = useTranslation();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langValidRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langValidRef.current && !langValidRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const features = [
        {
            icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
            title: "AI-Powered Writing",
            desc: "Generate professional emails in seconds with advanced AI models."
        },
        {
            icon: <Globe className="w-8 h-8 text-blue-400" />,
            title: "Multi-language Support",
            desc: "Understand and communicate in any language seamlessly."
        },
        {
            icon: <Zap className="w-8 h-8 text-purple-400" />,
            title: "Instant Polishing",
            desc: "Refine tone, grammar, and style with a single click."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0F172A] text-white font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-[#0F172A]/80 backdrop-blur-lg border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <span className="text-2xl">🌍</span>
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                            ForeignLang
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</a>
                        <a href="#pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Pricing</a>
                        <a href="#about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">About</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative" ref={langValidRef}>
                                <button
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all w-[140px] justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <Globe size={18} className="text-gray-400" />
                                        <span className="text-sm font-medium text-gray-300 truncate">
                                            {i18n.language === 'en' ? 'English' : 'Tiếng Việt'}
                                        </span>
                                    </div>
                                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {isLangOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 top-full mt-2 w-40 bg-[#1E293B] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                                        >
                                            <button
                                                onClick={() => { i18n.changeLanguage('vi'); setIsLangOpen(false); }}
                                                className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${i18n.language === 'vi' ? 'text-indigo-400 font-medium' : 'text-gray-300'}`}
                                            >
                                                Tiếng Việt
                                            </button>
                                            <button
                                                onClick={() => { i18n.changeLanguage('en'); setIsLangOpen(false); }}
                                                className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${i18n.language === 'en' ? 'text-indigo-400 font-medium' : 'text-gray-300'}`}
                                            >
                                                English
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <Link
                                to="/login"
                                className="hidden sm:flex items-center justify-center px-6 py-2.5 rounded-full border border-white/10 hover:bg-white/5 transition-colors font-medium min-w-[120px]"
                            >
                                {t('auth.login')}
                            </Link>
                            <Link
                                to="/register"
                                className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 min-w-[160px] flex items-center justify-center"
                            >
                                {t('landing.getStarted')}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium text-indigo-200">#1 AI Language Assistant</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
                            {t('landing.heroTitle')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                                Effortlessly.
                            </span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                            {t('landing.heroSubtitle')}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-indigo-900 font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl shadow-white/10 hover:shadow-white/20 hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                {t('landing.getStarted')}
                                <ArrowRight size={20} />
                            </Link>
                            <a
                                href="#demo"
                                className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 font-bold text-lg transition-all backdrop-blur-sm flex items-center justify-center gap-2"
                            >
                                <Users size={20} />
                                {t('landing.learnMore')}
                            </a>
                        </div>
                    </motion.div>

                    {/* Checkmarks */}
                    <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-400" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-400" />
                            <span>5 free AI credits daily</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-400" />
                            <span>Cancel anytime</span>
                        </div>
                    </div>
                </div>
            </header >

            {/* Visual Demo Section */}
            <section className="py-20 relative">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 border border-white/10 p-2 shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl -z-10" />
                        <div className="rounded-xl overflow-hidden bg-[#0F172A] aspect-video flex items-center justify-center border border-white/5 relative">
                            {/* Mock UI Interface */}
                            <div className="absolute inset-0 flex">
                                {/* Sidebar Mock */}
                                <div className="w-64 border-r border-white/5 bg-[#0F172A] hidden md:block p-6 space-y-4">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 mb-8" />
                                    <div className="h-4 w-3/4 bg-white/10 rounded" />
                                    <div className="h-4 w-1/2 bg-white/10 rounded" />
                                    <div className="h-4 w-5/6 bg-white/10 rounded" />
                                </div>
                                {/* Content Mock */}
                                <div className="flex-1 p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="h-8 w-1/3 bg-white/10 rounded" />
                                        <div className="h-10 w-10 bg-white/10 rounded-full" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="h-40 bg-white/5 rounded-xl border border-white/5 p-4">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                                <div className="w-3 h-3 rounded-full bg-green-400" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-3 w-full bg-white/10 rounded" />
                                                <div className="h-3 w-5/6 bg-white/10 rounded" />
                                                <div className="h-3 w-4/6 bg-white/10 rounded" />
                                            </div>
                                        </div>
                                        <div className="h-40 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-xl border border-indigo-500/30 p-4 flex items-center justify-center">
                                            <Sparkles className="text-indigo-400 w-12 h-12 opacity-50" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent flex items-end justify-center pb-12">
                                <p className="text-xl font-medium text-gray-300">Modern Dashboard Interface</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for Professionals</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Everything you need to communicate confidently in an international environment.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.2 }}
                                className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
                            >
                                <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-xl">🌍</span>
                        <span className="font-semibold text-gray-200">ForeignLang</span>
                        <span className="text-sm">© 2026</span>
                    </div>
                    <div className="flex gap-8 text-sm text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
