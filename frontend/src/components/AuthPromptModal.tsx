import React from 'react';
import { X, Sparkles, Gift, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
    isOpen,
    onClose,
    title = "Đăng ký để tiếp tục",
    message = "Tạo tài khoản miễn phí để sử dụng tính năng này"
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const goToRegister = () => {
        onClose();
        navigate('/register');
    };

    const goToLogin = () => {
        onClose();
        navigate('/login');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="px-8 py-10 text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-sky-500 rounded-2xl flex items-center justify-center">
                        <Sparkles className="text-white" size={32} />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        {title}
                    </h2>

                    {/* Message */}
                    <p className="text-gray-500 mb-6">
                        {message}
                    </p>

                    {/* Benefits */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-indigo-600">
                                <Gift size={18} />
                                <span className="font-medium">5 AI miễn phí</span>
                            </div>
                            <div className="flex items-center gap-2 text-purple-600">
                                <Zap size={18} />
                                <span className="font-medium">500+ mẫu email</span>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={goToRegister}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-sky-600 transition shadow-lg"
                        >
                            Đăng ký miễn phí
                        </button>
                        <button
                            onClick={goToLogin}
                            className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
                        >
                            Đã có tài khoản? Đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPromptModal;
