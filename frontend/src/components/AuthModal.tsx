import { LogIn, UserPlus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg shadow-indigo-200">
                            🔒
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('authModal.title')}</h2>
                        <p className="text-gray-500">
                            {t('authModal.subtitle')}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full relative group overflow-hidden py-3.5 px-4 bg-indigo-600 outline-none text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform"></span>
                            <LogIn size={20} className="relative z-10" />
                            <span className="relative z-10">{t('authModal.login')}</span>
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="w-full py-3.5 px-4 bg-white border-2 border-gray-100 hover:border-indigo-100 text-gray-700 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-gray-50 hover:text-indigo-600 group"
                        >
                            <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
                            {t('authModal.createAccount')}
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">
                            {t('authModal.footer')}
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
