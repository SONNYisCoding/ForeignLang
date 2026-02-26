import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AuthModal from '../components/AuthModal';
import ChatbotWidget from '../components/ChatbotWidget';
import HeroSection from '../components/landing/HeroSection';
import USPSection from '../components/landing/USPSection';
import CompareSection from '../components/landing/CompareSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import CoreFeaturesSection from '../components/landing/CoreFeaturesSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FinalCtaSection from '../components/landing/FinalCtaSection';
import FooterSection from '../components/landing/FooterSection';

const LandingPage = () => {
    const { t, i18n } = useTranslation();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleFeatureClick = () => {
        setIsAuthModalOpen(true);
    };

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setIsLangDropdownOpen(false);
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
                                            initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                            exit={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                                            transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
                                            className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-500/10 border border-white/20 py-2 z-50 overflow-hidden"
                                        >
                                            <button
                                                onClick={() => changeLanguage('en')}
                                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-indigo-50/80 text-gray-700 hover:text-indigo-600 flex items-center justify-between transition-colors font-medium border-b border-transparent hover:border-indigo-100"
                                            >
                                                <span>English</span>
                                                {i18n.language === 'en' && <Check size={16} className="text-indigo-600" />}
                                            </button>
                                            <button
                                                onClick={() => changeLanguage('vi')}
                                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-indigo-50/80 text-gray-700 hover:text-indigo-600 flex items-center justify-between transition-colors font-medium border-t border-transparent hover:border-indigo-100"
                                            >
                                                <span>Tiếng Việt</span>
                                                {i18n.language === 'vi' && <Check size={16} className="text-indigo-600" />}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Link
                                to="/login"
                                className="hidden sm:flex relative items-center justify-center px-5 py-2 text-sm font-bold text-gray-700 transition-colors group overflow-hidden rounded-full"
                            >
                                <span className="absolute inset-0 bg-indigo-50 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out rounded-full z-0"></span>
                                <span className="relative z-10 group-hover:text-indigo-600 transition-colors">{t('landing.nav.login')}</span>
                            </Link>
                            <Link
                                to="/register"
                                className="group relative inline-block w-48 h-auto cursor-pointer outline-none bg-transparent align-middle"
                            >
                                {/* Vòng tròn nền chứa Gradient & Shadow (mở rộng khi hover) */}
                                <span
                                    className="relative block w-12 h-12 rounded-full transition-all duration-[450ms] ease-[cubic-bezier(0.65,0,0.076,1)] group-hover:w-full bg-gradient-to-r from-indigo-600 to-sky-500 shadow-lg shadow-indigo-200"
                                    aria-hidden="true"
                                >
                                    {/* Icon mũi tên (Màu trắng để nổi bật trên nền gradient) */}
                                    <span
                                        className="absolute top-0 bottom-0 left-[0.625rem] m-auto w-[1.125rem] h-[0.125rem] bg-transparent transition-all duration-[450ms] ease-[cubic-bezier(0.65,0,0.076,1)] group-hover:bg-white group-hover:translate-x-[1rem] before:absolute before:content-[''] before:-top-[0.29rem] before:right-[0.0625rem] before:w-[0.625rem] before:h-[0.625rem] before:border-t-[2px] before:border-r-[2px] before:border-white before:rotate-45"
                                    ></span>
                                </span>

                                {/* Chữ hiển thị (Màu indigo lúc đầu, chuyển sang trắng khi background tràn qua) */}
                                <span
                                    className="absolute inset-0 flex items-center justify-center pl-[1.85rem] font-bold text-sm uppercase tracking-wide transition-all duration-[450ms] ease-[cubic-bezier(0.65,0,0.076,1)] text-indigo-600 group-hover:text-white"
                                >
                                    {t('landing.nav.getStarted')}
                                </span>
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

            {/* Main Content */}
            <main>
                <HeroSection />
                <USPSection />
                <CompareSection />
                <HowItWorksSection />
                <CoreFeaturesSection onFeatureClick={handleFeatureClick} />
                <TestimonialsSection />
                <FinalCtaSection />
                <FooterSection />
            </main>
            {/* Widgets */}
            < ChatbotWidget />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div >
    );
};

export default LandingPage;
