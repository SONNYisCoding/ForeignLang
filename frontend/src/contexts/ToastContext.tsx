import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// Toast types
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (message: string, type: ToastType, duration?: number) => void;
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showWarning: (message: string) => void;
    showInfo: (message: string) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Toast Provider - Wrap your app with this to enable toast notifications
 */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType, duration = 3000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const newToast: Toast = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);

        // Auto-dismiss
        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
    }, [removeToast]);

    const showSuccess = useCallback((message: string) => showToast(message, 'success'), [showToast]);
    const showError = useCallback((message: string) => showToast(message, 'error', 5000), [showToast]);
    const showWarning = useCallback((message: string) => showToast(message, 'warning'), [showToast]);
    const showInfo = useCallback((message: string) => showToast(message, 'info'), [showToast]);

    return (
        <ToastContext.Provider value={{ toasts, showToast, showSuccess, showError, showWarning, showInfo, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

/**
 * Hook to use toast notifications
 */
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Toast styling config
const toastStyles: Record<ToastType, { bg: string; icon: typeof CheckCircle; iconColor: string }> = {
    success: { bg: 'bg-green-50 border-green-200', icon: CheckCircle, iconColor: 'text-green-500' },
    error: { bg: 'bg-red-50 border-red-200', icon: AlertCircle, iconColor: 'text-red-500' },
    warning: { bg: 'bg-amber-50 border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-500' },
    info: { bg: 'bg-sky-50 border-sky-200', icon: Info, iconColor: 'text-sky-500' }
};

/**
 * Toast Container - Renders all active toasts
 */
const ToastContainer = ({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) => (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
        <AnimatePresence>
            {toasts.map((toast) => {
                const style = toastStyles[toast.type];
                const Icon = style.icon;

                return (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${style.bg}`}
                    >
                        <Icon size={20} className={`${style.iconColor} flex-shrink-0 mt-0.5`} />
                        <p className="text-gray-700 text-sm font-medium flex-1">{toast.message}</p>
                        <button
                            onClick={() => onRemove(toast.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                );
            })}
        </AnimatePresence>
    </div>
);

export default ToastProvider;
