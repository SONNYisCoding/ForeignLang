import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Play, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCredits } from '../../contexts/CreditContext';
import { useAuth } from '../../contexts/AuthContext';

const CreditDropdown = ({ isOpen, onClose, anchorRef }: {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLButtonElement | null>;
}) => {
    const navigate = useNavigate();
    const { credits, handleWatchAd, quotaDetails } = useCredits();
    const { user } = useAuth();
    const isPremium = user?.isPremium;
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Click outside to close
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                dropdownRef.current && !dropdownRef.current.contains(target) &&
                anchorRef.current && !anchorRef.current.contains(target)
            ) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose, anchorRef]);

    const handleBuyCredits = useCallback(() => {
        onClose();
        if (isPremium) {
            navigate('/dashboard/settings');
        } else {
            navigate('/upgrade?pack=credits-5');
        }
    }, [onClose, navigate, isPremium]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15, type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-purple-500/10 dark:shadow-black/40 border border-gray-100/80 dark:border-slate-700/50 z-50 overflow-hidden origin-top-right"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-white/80" />
                                <span className="text-sm font-bold text-white">AI Credits</span>
                            </div>
                            <button onClick={onClose} className="p-1 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                <X size={14} />
                            </button>
                        </div>
                        <div className="text-2xl font-black text-white mt-1">
                            {isPremium ? (
                                <span className="text-lg">PRO Plan Active - Unlimited AI Access</span>
                            ) : (
                                <>
                                    {credits ?? 0}
                                    <span className="text-sm font-bold text-white/50 ml-2">
                                        credit left today (reset daily)
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Options */}
                    <div className="p-3 space-y-2">
                        {isPremium ? (
                            <div className="w-full flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30 rounded-xl">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                                    <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">Current Plan: PRO</p>
                                    <p className="text-[10px] text-emerald-600/60">Valid until: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                                </div>
                                <span className="px-2 py-1 bg-emerald-200/60 text-emerald-800 text-[10px] font-black rounded-md uppercase">Active</span>
                            </div>
                        ) : quotaDetails?.adsWatched >= 2 ? (
                            <button
                                disabled
                                className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/20 border border-gray-200/50 dark:border-gray-700/30 rounded-xl cursor-not-allowed group opacity-50"
                            >
                                <div className="p-2 bg-gray-100 dark:bg-gray-800/40 rounded-lg">
                                    <Play size={16} className="text-gray-400" />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-bold text-gray-500 dark:text-gray-400 text-sm">Watch Ad</p>
                                    <p className="text-[10px] text-gray-400/60">Đã hết lượt hôm nay</p>
                                </div>
                            </button>
                        ) : (
                            <button
                                onClick={() => { onClose(); handleWatchAd(); }}
                                className="w-full flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/30 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all group"
                            >
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg group-hover:scale-110 transition-transform">
                                    <Play size={16} className="text-amber-600" />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-bold text-amber-900 dark:text-amber-200 text-sm">Watch Ad</p>
                                    <p className="text-[10px] text-amber-600/60">Free +1 credit</p>
                                </div>
                                <span className="px-2 py-1 bg-amber-200/60 text-amber-800 text-[10px] font-black rounded-md uppercase">Free</span>
                            </button>
                        )}

                        <button
                            onClick={handleBuyCredits}
                            className="w-full flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200/50 dark:border-indigo-800/30 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all group"
                        >
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg group-hover:scale-110 transition-transform">
                                <CreditCard size={16} className="text-indigo-600" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-bold text-indigo-900 dark:text-indigo-200 text-sm">
                                    {isPremium ? 'Manage Subscription' : 'Buy Credits'}
                                </p>
                                <p className="text-[10px] text-indigo-600/60">
                                    {isPremium ? 'View plan & billing' : 'Unlimited AI power'}
                                </p>
                            </div>
                            <span className="px-2 py-1 bg-indigo-200/60 text-indigo-800 text-[10px] font-black rounded-md">
                                PRO
                            </span>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CreditDropdown;
