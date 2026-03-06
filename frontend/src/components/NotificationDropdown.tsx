import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    read: boolean;
    createdAt: string;
    actionLink?: string;
}

const NotificationDropdown = () => {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/v1/notifications', { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: Notification) => !n.read).length);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/v1/notifications/${id}/read`, { method: 'PUT' });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/api/v1/notifications/read-all', { method: 'PUT' });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchNotifications();
        // Optional: Polling every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle size={16} className="text-emerald-500" />;
            case 'WARNING': return <AlertTriangle size={16} className="text-amber-500" />;
            case 'ERROR': return <XCircle size={16} className="text-red-500" />;
            default: return <Info size={16} className="text-blue-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-gray-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all active:scale-95"
                title={t('notifications.title')}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[1.5rem] shadow-2xl border border-gray-100/50 dark:border-slate-800/50 z-50 overflow-hidden origin-top-right"
                    >
                        <div className="flex items-center justify-between p-5 border-b border-gray-100/50 dark:border-slate-800/50 relative z-10">
                            <h3 className="font-black text-gray-900 dark:text-white tracking-tight text-lg">{t('notifications.title')}</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg transition-colors"
                                >
                                    <Check size={14} /> {t('notifications.markAllRead')}
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto scrollbar-hide relative z-10">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-5 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notification.read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                                            onClick={() => !notification.read && markAsRead(notification.id)}
                                        >
                                            <div className="flex gap-4">
                                                <div className="mt-1 flex-shrink-0">
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 space-y-1.5">
                                                    <div className="flex justify-between items-start">
                                                        <p className={`text-sm font-bold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-slate-300'}`}>
                                                            {notification.title}
                                                        </p>
                                                        <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 whitespace-nowrap ml-3 uppercase tracking-wider">
                                                            {new Date(notification.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className={`text-sm line-clamp-2 ${!notification.read ? 'text-gray-600 dark:text-slate-300 font-medium' : 'text-gray-500 dark:text-slate-400'}`}>
                                                        {notification.message}
                                                    </p>
                                                    {notification.actionLink && (
                                                        <Link
                                                            to={notification.actionLink}
                                                            className="inline-block mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {t('notifications.viewDetails')} →
                                                        </Link>
                                                    )}
                                                </div>
                                                {!notification.read && (
                                                    <div className="mt-2 w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 shadow-sm shadow-indigo-500/50" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 text-center flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-gray-300 dark:text-slate-600 shadow-inner">
                                        <Bell size={28} />
                                    </div>
                                    <p className="font-bold text-gray-500 dark:text-slate-400">{t('notifications.empty')}</p>
                                    <p className="text-sm font-medium text-gray-400 dark:text-slate-500 mt-1">Check back later for updates</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
