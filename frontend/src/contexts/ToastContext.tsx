import { createContext, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';

// Toast types
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastContextType {
    showToast: (message: string, type: ToastType, duration?: number) => void;
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showWarning: (message: string) => void;
    showInfo: (message: string) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Toast Provider - Wraps Sonner to maintain compatibility with existing useToast hook
 */
export const ToastProvider = ({ children }: { children: ReactNode }) => {

    const showToast = useCallback((message: string, type: ToastType, duration = 3000) => {
        const options = { duration };
        switch (type) {
            case 'success': toast.success(message, options); break;
            case 'error': toast.error(message, options); break;
            case 'warning': toast.warning(message, options); break;
            case 'info': toast.info(message, options); break;
            default: toast(message, options);
        }
    }, []);

    const showSuccess = useCallback((message: string) => toast.success(message), []);
    const showError = useCallback((message: string) => toast.error(message), []);
    const showWarning = useCallback((message: string) => toast.warning(message), []);
    const showInfo = useCallback((message: string) => toast.info(message), []);
    const removeToast = useCallback((id: string) => toast.dismiss(id), []);

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo, removeToast }}>
            {children}
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

export default ToastProvider;
