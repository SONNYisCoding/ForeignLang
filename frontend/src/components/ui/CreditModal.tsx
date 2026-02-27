import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Play, Gift, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCredits } from '../../contexts/CreditContext';
import UiverseLoader from './UiverseLoader';
import { toast } from 'sonner';

type DropdownView = 'menu' | 'watching' | 'claim';

const CreditDropdown = ({ isOpen, onClose, anchorRef }: {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLButtonElement | null>;
}) => {
    const navigate = useNavigate();
    const { credits, handleClaimReward } = useCredits();
    const [view, setView] = useState<DropdownView>('menu');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Reset view when dropdown opens
    useEffect(() => {
        if (isOpen) setView('menu');
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [isOpen]);

    // Click outside to close
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                dropdownRef.current && !dropdownRef.current.contains(target) &&
                anchorRef.current && !anchorRef.current.contains(target)
            ) {
                if (timerRef.current) clearTimeout(timerRef.current);
                setView('menu');
                onClose();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose, anchorRef]);

    const startWatchAd = useCallback(() => {
        setView('watching');
        timerRef.current = setTimeout(() => {
            setView('claim');
        }, 3000);
    }, []);

    const handleClaim = useCallback(async () => {
        await handleClaimReward();
        toast.success('+1 AI Credit claimed! 🎉');
        setView('menu');
        onClose();
    }, [handleClaimReward, onClose]);

    const handleBuyCredits = useCallback(() => {
        onClose();
        navigate('/upgrade?pack=credits-5');
    }, [onClose, navigate]);

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
                    <AnimatePresence mode="wait">
                        {/* ── WATCHING AD ── */}
                        {view === 'watching' && (
                            <motion.div key="watching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-10 px-6">
                                <UiverseLoader text="Loading your reward..." size="md" />
                                <p className="text-[10px] text-gray-400 mt-4 font-medium tracking-widest uppercase">Please wait 3s...</p>
                            </motion.div>
                        )}

                        {/* ── CLAIM REWARD ── */}
                        {view === 'claim' && (
                            <motion.div key="claim" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-8 px-6">
                                <motion.div initial={{ rotate: -10, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                                    className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/30">
                                    <Gift size={28} className="text-white" />
                                </motion.div>
                                <h3 className="text-base font-black text-gray-900 dark:text-white mb-1">Reward Ready!</h3>
                                <p className="text-gray-500 dark:text-slate-400 text-xs mb-4">Tap to collect your free credit</p>
                                <button onClick={handleClaim} className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm">
                                    <Gift size={14} /> Claim +1 Credit
                                </button>
                            </motion.div>
                        )}

                        {/* ── MAIN MENU ── */}
                        {view === 'menu' && (
                            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                                    <div className="text-2xl font-black text-white mt-1">{credits ?? 0} <span className="text-sm font-bold text-white/50">credits</span></div>
                                </div>

                                {/* Options */}
                                <div className="p-3 space-y-2">
                                    <button
                                        onClick={startWatchAd}
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

                                    <button
                                        onClick={handleBuyCredits}
                                        className="w-full flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200/50 dark:border-indigo-800/30 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all group"
                                    >
                                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg group-hover:scale-110 transition-transform">
                                            <CreditCard size={16} className="text-indigo-600" />
                                        </div>
                                        <div className="text-left flex-1">
                                            <p className="font-bold text-indigo-900 dark:text-indigo-200 text-sm">Buy Credits</p>
                                            <p className="text-[10px] text-indigo-600/60">Unlimited AI power</p>
                                        </div>
                                        <span className="px-2 py-1 bg-indigo-200/60 text-indigo-800 text-[10px] font-black rounded-md">PRO</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CreditDropdown;
