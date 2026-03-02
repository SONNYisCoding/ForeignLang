import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useCredits } from '../../contexts/CreditContext';

const GlobalAdModal = () => {
    const { showAdModal, adTimer, adFinished, handleClaimReward, closeAdModal } = useCredits();

    return (
        <AnimatePresence>
            {showAdModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative border border-gray-100 dark:border-slate-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-slate-900 dark:bg-black h-64 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-yellow-500/10 blur-xl" />
                            <Zap size={80} className="text-yellow-400 animate-pulse relative z-10 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                            <p className="text-white mt-4 absolute bottom-6 font-bold tracking-widest uppercase text-sm">
                                {adFinished ? "Reward Unlocked" : `Ad Playing: ${adTimer}s`}
                            </p>
                        </div>
                        <div className="p-8 text-center relative z-10 bg-white dark:bg-slate-900">
                            <h3 className="text-2xl font-black mb-3 text-gray-900 dark:text-white">Claim Your Free Credit</h3>
                            <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
                                By watching this short message, you directly support the platform and earn a free analysis credit.
                            </p>

                            {adFinished ? (
                                <button
                                    onClick={handleClaimReward}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Claim +1 Credit
                                </button>
                            ) : (
                                <button disabled className="w-full py-4 bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 font-bold rounded-2xl cursor-not-allowed border border-gray-200 dark:border-slate-700">
                                    Please Wait {adTimer}s...
                                </button>
                            )}

                            <button
                                onClick={closeAdModal}
                                className="mt-6 text-sm font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                Close without reward
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlobalAdModal;
