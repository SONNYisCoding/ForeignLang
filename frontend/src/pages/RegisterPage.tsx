import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle, Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langValidRef = useRef<HTMLDivElement>(null);

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (password !== confirmPassword) {
            setError(t('auth.confirmPassword') + ' mismatch'); // Simple fallback check, usually handled by validation schema
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError(t('auth.password') + ' too short');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, fullName })
            });

            const data = await response.json();

            if (response.ok) {
                if (data.userId) {
                    // Registration successful - always require profile setup
                    navigate('/profile-setup');
                } else {
                    // Fallback (shouldn't happen for new registration)
                    navigate('/login');
                }
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans overflow-hidden">
            {/* Left Side - Majestic Image/Branding */}
            <div className="hidden lg:flex w-1/2 bg-purple-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-indigo-900 to-blue-900 opacity-90 transition-all duration-500" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-40" />

                <div className="relative z-10 p-12 text-white max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200">
                            {t('auth.createAccountSub')}
                        </h1>
                        <p className="text-xl text-indigo-100 leading-relaxed mb-8 font-light">
                            {t('landing.hero.subtitle')}
                        </p>

                        <div className="space-y-4">
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm"
                            >
                                <div className="p-2 bg-yellow-400/20 rounded-lg">
                                    <CheckCircle className="text-yellow-300" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">5 Free AI Credits</h3>
                                    <p className="text-sm text-indigo-200">Get started immediately</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm"
                            >
                                <div className="p-2 bg-pink-400/20 rounded-lg">
                                    <CheckCircle className="text-pink-300" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Advanced Templates</h3>
                                    <p className="text-sm text-indigo-200">For every professional need</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Animated Particles */}
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 right-1/4 w-4 h-4 bg-yellow-400 rounded-full blur-sm"
                />
                <motion.div
                    animate={{ y: [0, 30, 0], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-pink-500 rounded-full blur-md"
                />
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/30 relative">
                {/* Top Left Logo */}
                <div className="absolute top-6 left-6 z-20">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform overflow-hidden">
                            <img src="/mascot/logofl.png" alt="ForeignLang" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-500 hidden sm:block">
                            ForeignLang
                        </span>
                    </Link>
                </div>

                {/* Top Right Language Switcher */}
                <div className="absolute top-6 right-6 z-20">
                    <div className="relative" ref={langValidRef}>
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-all bg-white shadow-sm"
                        >
                            <Globe size={16} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
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
                                    className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden"
                                >
                                    <button
                                        onClick={() => { i18n.changeLanguage('vi'); setIsLangOpen(false); }}
                                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${i18n.language === 'vi' ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}
                                    >
                                        Tiếng Việt
                                    </button>
                                    <button
                                        onClick={() => { i18n.changeLanguage('en'); setIsLangOpen(false); }}
                                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${i18n.language === 'en' ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}
                                    >
                                        English
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="max-w-md w-full">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">{t('auth.createAccount')}</h2>
                            <p className="text-gray-500 text-lg">Join us and master your communication!</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">{t('auth.fullName')}</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sky-600 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white text-gray-900 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-sky-500 outline-none transition-all hover:bg-white/80 shadow-sm"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">{t('auth.email')}</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sky-600 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white text-gray-900 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-sky-500 outline-none transition-all hover:bg-white/80 shadow-sm"
                                        placeholder="user@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">{t('auth.password')}</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sky-600 transition-colors" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-3.5 bg-white text-gray-900 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-sky-500 outline-none transition-all hover:bg-white/80 shadow-sm"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">{t('auth.confirmPassword')}</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sky-600 transition-colors" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-3.5 bg-white text-gray-900 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-sky-500 outline-none transition-all hover:bg-white/80 shadow-sm"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3.5 rounded-2xl font-bold text-white text-lg shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition-all
                                    ${loading ? 'bg-purple-400 cursor-wait' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'}
                                `}
                            >
                                {loading ? 'Creating...' : (
                                    <>
                                        {t('auth.register')} <ArrowRight size={20} />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-gray-50/30 text-gray-500 font-medium">{t('auth.orContinueWith')}</span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <motion.a
                                    whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                    href={`${import.meta.env.VITE_BACKEND_URL || ''}/oauth2/authorization/google`}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-200 rounded-2xl bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                                >
                                    <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    {t('auth.continueWithGoogle', 'Continue with Google')}
                                </motion.a>

                                <motion.a
                                    whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                    href={`${import.meta.env.VITE_BACKEND_URL || ''}/oauth2/authorization/facebook`}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-[#1877F2]/10 rounded-2xl bg-[#1877F2]/5 text-[#1877F2] font-semibold hover:bg-[#1877F2]/10 hover:border-[#1877F2]/20 transition-all shadow-sm"
                                >
                                    <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
                                        <path
                                            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                            fill="#1877F2"
                                        />
                                    </svg>
                                    {t('auth.continueWithFacebook', 'Continue with Facebook')}
                                </motion.a>
                            </div>
                        </div>

                        <p className="mt-8 text-center text-sm text-gray-500">
                            {t('auth.haveAccount')} {' '}
                            <Link to="/login" className="font-bold text-sky-600 hover:text-purple-500 transition-colors">
                                {t('auth.login')}
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
