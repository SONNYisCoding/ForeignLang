import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Globe, BookOpen, Sparkles, Play, ChevronDown, Check,
    Trophy, Star, ChevronRight, Facebook, Twitter, Instagram, Linkedin, Mail, Send, Menu, X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AuthModal from '../components/AuthModal';
import ChatbotWidget from '../components/ChatbotWidget';

import TypewriterEffect from '../components/ui/TypewriterEffect';

const LandingPage = () => {
    const { t, i18n } = useTranslation();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Calculate delay based on first part length
    const heroTitle = t('landing.hero.title');
    const heroHighlight = t('landing.hero.titleHighlight');
    const firstPartDelay = heroTitle.length * 50; // 50ms per char

    const handleFeatureClick = () => {
        setIsAuthModalOpen(true);
    };

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setIsLangDropdownOpen(false);
    };

    // Animation variants
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed w-full bg-white/90 backdrop-blur-lg z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>

                            <Link to="/" className="flex items-center gap-2">
                                <img src="/mascot/main.png" alt="ForeignLang Mascot" className="w-10 h-10 rounded-xl" />
                                <span className="text-xl font-bold text-gray-900 tracking-tight hidden sm:block">ForeignLang</span>
                            </Link>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">{t('landing.nav.features')}</a>
                            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">How It Works</a>
                            <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">{t('landing.nav.pricing')}</Link>
                            <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">{t('landing.nav.about')}</Link>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Language Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                                    className="flex items-center gap-1 p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                                >
                                    <Globe size={20} />
                                    <span className="text-sm font-medium uppercase">{i18n.language}</span>
                                    <ChevronDown size={16} />
                                </button>

                                <AnimatePresence>
                                    {isLangDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                                        >
                                            <button
                                                onClick={() => changeLanguage('en')}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 flex items-center justify-between"
                                            >
                                                <span>English</span>
                                                {i18n.language === 'en' && <Check size={16} className="text-indigo-600" />}
                                            </button>
                                            <button
                                                onClick={() => changeLanguage('vi')}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 flex items-center justify-between"
                                            >
                                                <span>Tiếng Việt</span>
                                                {i18n.language === 'vi' && <Check size={16} className="text-indigo-600" />}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Link to="/login" className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                                {t('landing.nav.login')}
                            </Link>
                            <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white text-sm font-semibold rounded-full shadow-lg shadow-indigo-200 transition-all hover:scale-105">
                                {t('landing.nav.getStarted')}
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden bg-white border-b border-gray-100"
                        >
                            <div className="px-4 pt-2 pb-6 space-y-2">
                                <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">{t('landing.nav.features')}</a>
                                <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">How It Works</a>
                                <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">{t('landing.nav.pricing')}</Link>
                                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">{t('landing.nav.about')}</Link>
                                <div className="border-t border-gray-100 my-2 pt-2">
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">{t('landing.nav.login')}</Link>
                                    <div className="px-3 py-2 flex items-center gap-4">
                                        <button onClick={() => changeLanguage('en')} className={`text-sm font-medium ${i18n.language === 'en' ? 'text-indigo-600' : 'text-gray-500'}`}>English</button>
                                        <div className="h-4 w-px bg-gray-300"></div>
                                        <button onClick={() => changeLanguage('vi')} className={`text-sm font-medium ${i18n.language === 'vi' ? 'text-indigo-600' : 'text-gray-500'}`}>Tiếng Việt</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Hero Section - Premium */}
            <section className="pt-28 pb-16 lg:pt-36 lg:pb-24 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                            x: [0, 100, 0],
                            y: [0, -50, 0]
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/60 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.5, 1],
                            rotate: [0, -60, 0],
                            x: [0, -100, 0],
                            y: [0, 100, 0]
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-100/50 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-50/40 to-purple-50/40 rounded-full blur-[100px]"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <motion.div {...fadeInUp}>
                            {/* Badge */}
                            <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-sm font-bold tracking-wide mb-6 border border-indigo-100">
                                {t('landing.hero.badge')}
                            </span>

                            {/* Main Headline */}
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6 min-h-[160px] sm:min-h-[120px]">
                                <TypewriterEffect text={heroTitle} hideCursorOnComplete={true} />
                                <br className="hidden sm:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-400">
                                    <TypewriterEffect
                                        text={heroHighlight}
                                        startDelay={firstPartDelay + 300}
                                        cursorColor="bg-sky-400"
                                    />
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
                                {t('landing.hero.subtitle')}
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                                <Link
                                    to="/register"
                                    className="relative overflow-hidden w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white font-bold rounded-full shadow-xl shadow-indigo-200 transition-all hover:scale-105 flex items-center justify-center gap-2 text-lg group"
                                >
                                    <motion.div
                                        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                                        initial={{ x: '-150%' }}
                                        animate={{ x: '150%' }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                                    />
                                    <span className="relative z-10 flex items-center gap-2">
                                        {t('landing.hero.ctaPrimary')} <ArrowRight size={20} />
                                    </span>
                                </Link>
                                <a
                                    href="#how-it-works"
                                    className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-200 hover:border-indigo-200 text-gray-700 font-semibold rounded-full hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Play size={20} fill="currentColor" className="text-indigo-500" /> {t('landing.hero.ctaSecondary')}
                                </a>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
                                <div className="text-center">
                                    <div className="text-3xl font-extrabold text-gray-900">{t('landing.hero.stats.emails')}</div>
                                    <div className="text-sm text-gray-500">{t('landing.hero.stats.emailsLabel')}</div>
                                </div>
                                <div className="w-px h-12 bg-gray-200 hidden sm:block"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-extrabold text-gray-900">{t('landing.hero.stats.users')}</div>
                                    <div className="text-sm text-gray-500">{t('landing.hero.stats.usersLabel')}</div>
                                </div>
                                <div className="w-px h-12 bg-gray-200 hidden sm:block"></div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-3xl font-extrabold text-gray-900">
                                        <Star size={24} className="text-yellow-400 fill-yellow-400" />
                                        {t('landing.hero.stats.rating')}
                                    </div>
                                </div>
                            </div>

                            {/* Hero Mascot */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: [0, -15, 0]
                                }}
                                transition={{
                                    duration: 0.6,
                                    y: {
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                }}
                                className="mt-12"
                            >
                                <img
                                    src="/mascot/hero.png"
                                    alt="ForeignLang Owl Mascot"
                                    className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto drop-shadow-2xl"
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* USP Section - Why Choose Us */}
            <section className="py-20 bg-gradient-to-b from-white to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
                        >
                            {t('landing.usp.title')}
                        </motion.h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            {t('landing.usp.subtitle')}
                        </p>
                    </div>

                    {/* USP Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {/* AI Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-100 hover:shadow-2xl transition-all group"
                        >
                            <div className="text-5xl mb-4">🤖</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing.usp.cards.ai.title')}</h3>
                            <p className="text-gray-600 mb-4">{t('landing.usp.cards.ai.desc')}</p>
                            <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full">
                                {t('landing.usp.cards.ai.highlight')}
                            </div>
                        </motion.div>

                        {/* Learning Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-3xl shadow-xl border border-sky-100 hover:shadow-2xl transition-all group"
                        >
                            <div className="text-5xl mb-4">📚</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing.usp.cards.learn.title')}</h3>
                            <p className="text-gray-600 mb-4">{t('landing.usp.cards.learn.desc')}</p>
                            <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-bold rounded-full">
                                {t('landing.usp.cards.learn.highlight')}
                            </div>
                        </motion.div>

                        {/* Business Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white p-8 rounded-3xl shadow-xl border border-orange-100 hover:shadow-2xl transition-all group"
                        >
                            <div className="text-5xl mb-4">💼</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing.usp.cards.business.title')}</h3>
                            <p className="text-gray-600 mb-4">{t('landing.usp.cards.business.desc')}</p>
                            <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-full">
                                {t('landing.usp.cards.business.highlight')}
                            </div>
                        </motion.div>
                    </div>

                    {/* Comparison Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-4xl mx-auto"
                    >
                        <div className="p-6 bg-gradient-to-r from-indigo-600 to-sky-500 text-white text-center">
                            <h3 className="text-xl font-bold">{t('landing.usp.comparison.title')}</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">{t('landing.usp.comparison.feature')}</th>
                                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-500">{t('landing.usp.comparison.chatgpt')}</th>
                                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-500">{t('landing.usp.comparison.grammarly')}</th>
                                        <th className="px-6 py-4 text-center text-sm font-bold text-indigo-600">{t('landing.usp.comparison.foreignlang')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr>
                                        <td className="px-6 py-4 text-sm text-gray-700">{t('landing.usp.comparison.aiGen')}</td>
                                        <td className="px-6 py-4 text-center text-green-500">✓</td>
                                        <td className="px-6 py-4 text-center text-gray-300">✗</td>
                                        <td className="px-6 py-4 text-center text-green-500 font-bold">✓</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-700">{t('landing.usp.comparison.learning')}</td>
                                        <td className="px-6 py-4 text-center text-gray-300">✗</td>
                                        <td className="px-6 py-4 text-center text-gray-300">✗</td>
                                        <td className="px-6 py-4 text-center text-green-500 font-bold">✓</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-sm text-gray-700">{t('landing.usp.comparison.templates')}</td>
                                        <td className="px-6 py-4 text-center text-gray-300">✗</td>
                                        <td className="px-6 py-4 text-center text-gray-300">✗</td>
                                        <td className="px-6 py-4 text-center text-green-500 font-bold">✓</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-700">{t('landing.usp.comparison.businessFocus')}</td>
                                        <td className="px-6 py-4 text-center text-gray-300">✗</td>
                                        <td className="px-6 py-4 text-center text-yellow-500">~</td>
                                        <td className="px-6 py-4 text-center text-green-500 font-bold">✓</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
                        >
                            {t('landing.howItWorks.title')}
                        </motion.h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            {t('landing.howItWorks.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-1 bg-gradient-to-r from-indigo-200 via-sky-200 to-sky-200 rounded-full"></div>

                        {/* Step 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-center relative"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg shadow-indigo-200">
                                1
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing.howItWorks.step1.title')}</h3>
                            <p className="text-gray-600">{t('landing.howItWorks.step1.desc')}</p>
                        </motion.div>

                        {/* Step 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-center relative"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-sky-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg shadow-indigo-200">
                                2
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing.howItWorks.step2.title')}</h3>
                            <p className="text-gray-600">{t('landing.howItWorks.step2.desc')}</p>
                        </motion.div>

                        {/* Step 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-center relative"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg shadow-sky-200">
                                3
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing.howItWorks.step3.title')}</h3>
                            <p className="text-gray-600">{t('landing.howItWorks.step3.desc')}</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t('landing.features.title')}</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">{t('landing.features.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1: AI Email Gen */}
                        <motion.div
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-indigo-200 transition-all cursor-pointer group"
                            onClick={handleFeatureClick}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-200">
                                <Sparkles size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.features.emailGen.title')}</h3>
                            <p className="text-gray-600 mb-6">{t('landing.features.emailGen.desc')}</p>
                            <div className="flex items-center text-indigo-600 font-semibold group-hover:gap-3 transition-all">
                                <span>{t('landing.features.emailGen.click')}</span>
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>

                        {/* Feature 2: Templates */}
                        <motion.div
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-sky-200 transition-all cursor-pointer group"
                            onClick={handleFeatureClick}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-sky-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-200">
                                <BookOpen size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.features.templates.title')}</h3>
                            <p className="text-gray-600 mb-6">{t('landing.features.templates.desc')}</p>
                            <div className="flex items-center text-sky-600 font-semibold group-hover:gap-3 transition-all">
                                <span>Coming Soon</span>
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>

                        {/* Feature 3: Progress Tracking */}
                        <motion.div
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-green-200 transition-all cursor-pointer group"
                            onClick={handleFeatureClick}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-200">
                                <Trophy size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.features.tracking.title')}</h3>
                            <p className="text-gray-600 mb-6">{t('landing.features.tracking.desc')}</p>
                            <div className="flex items-center text-green-600 font-semibold group-hover:gap-3 transition-all">
                                <span>Coming Soon</span>
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t('landing.testimonials.title')}</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">{t('landing.testimonials.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl relative"
                        >
                            <div className="text-4xl mb-4">❝</div>
                            <p className="text-gray-700 font-medium mb-6">{t('landing.testimonials.review1.text')}</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                    S
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{t('landing.testimonials.review1.author')}</p>
                                    <p className="text-sm text-gray-500">{t('landing.testimonials.review1.role')}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Testimonial 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-indigo-50 to-sky-50 p-8 rounded-3xl relative"
                        >
                            <div className="text-4xl mb-4">❝</div>
                            <p className="text-gray-700 font-medium mb-6">{t('landing.testimonials.review2.text')}</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-sky-400 rounded-full flex items-center justify-center text-white font-bold">
                                    D
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{t('landing.testimonials.review2.author')}</p>
                                    <p className="text-sm text-gray-500">{t('landing.testimonials.review2.role')}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Testimonial 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-orange-50 to-yellow-50 p-8 rounded-3xl relative"
                        >
                            <div className="text-4xl mb-4">❝</div>
                            <p className="text-gray-700 font-medium mb-6">{t('landing.testimonials.review3.text')}</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                                    M
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{t('landing.testimonials.review3.author')}</p>
                                    <p className="text-sm text-gray-500">{t('landing.testimonials.review3.role')}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <motion.img
                            src="/mascot/waving.png"
                            alt="ForeignLang Mascot Waving"
                            className="w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-6 drop-shadow-xl"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        />
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">{t('landing.cta.title')}</h2>
                        <p className="text-xl text-indigo-100 mb-8">{t('landing.cta.subtitle')}</p>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo-600 font-bold rounded-full shadow-2xl hover:scale-105 transition-all text-lg"
                        >
                            {t('landing.cta.button')} <ArrowRight size={24} />
                        </Link>
                        <p className="text-indigo-200 mt-6 text-sm">{t('landing.cta.note')}</p>
                    </motion.div>
                </div>
            </section>

            {/* Footer - Premium */}
            <footer className="bg-slate-900 text-white py-16 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Newsletter Section */}
                    <div className="mb-16 p-8 bg-slate-800/50 rounded-3xl border border-slate-700/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Subscribe to our newsletter</h3>
                                <p className="text-slate-400">Get the latest updates, tips, and special offers directly to your inbox.</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500 transition-colors"
                                    />
                                </div>
                                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2">
                                    Subscribe <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        {/* Brand Column */}
                        <div className="col-span-1 md:col-span-1">
                            <Link to="/" className="flex items-center gap-2 mb-6">
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 p-1">
                                    <img src="/mascot/logofl.png" alt="Mascot" className="w-full h-full object-contain" />
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">ForeignLang</span>
                            </Link>
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed text-justify">
                                Empower your communication with AI-driven tools. Write perfect emails, learn languages faster, and boost your professional confidence.
                            </p>
                            {/* Social Icons */}
                            <div className="flex gap-4">
                                {[
                                    { icon: Facebook, href: "#" },
                                    { icon: Twitter, href: "#" },
                                    { icon: Instagram, href: "#" },
                                    { icon: Linkedin, href: "#" }
                                ].map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1"
                                    >
                                        <social.icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Links Columns */}
                        <div>
                            <h4 className="text-white font-bold mb-6 text-lg">Product</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><a href="#features" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Features</a></li>
                                <li><Link to="/pricing" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Pricing</Link></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Templates</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Integrations</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 text-lg">Company</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><Link to="/about" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> About Us</Link></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Careers</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Blog</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 text-lg">Legal</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Terms of Service</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                        <p>{t('landing.footer.copyright')} © {new Date().getFullYear()} ForeignLang. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-1">Made with <span className="text-red-500">❤️</span> by our Team</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Widgets */}
            <ChatbotWidget />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
};

export default LandingPage;
