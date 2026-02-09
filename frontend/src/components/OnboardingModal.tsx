import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Sparkles, BookOpen, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const OnboardingModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    useTranslation();

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        if (!hasSeenOnboarding) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('hasSeenOnboarding', 'true');
    };

    const handleNext = () => {
        if (step < slides.length - 1) {
            setStep(step + 1);
        } else {
            handleClose();
        }
    };

    const slides = [
        {
            icon: <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6 text-4xl">👋</div>,
            title: "Welcome to ForeignLang!",
            desc: "Your personal AI-powered English learning assistant. Let's take a quick tour.",
            color: "bg-indigo-600"
        },
        {
            icon: <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-6 text-pink-600"><Sparkles size={40} /></div>,
            title: "AI Email Generator",
            desc: "Draft professional business emails in seconds. Just describe what you need, and we'll handle the rest.",
            color: "bg-pink-600"
        },
        {
            icon: <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600"><BookOpen size={40} /></div>,
            title: "Interactive Lessons",
            desc: "Master Business English with our curated lessons. Track your progress and earn XP.",
            color: "bg-emerald-600"
        },
        {
            icon: <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 text-amber-600"><Star size={40} /></div>,
            title: "You're All Set!",
            desc: "Start your journey now. Complete lessons or generate emails to earn credits.",
            color: "bg-amber-600"
        }
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10"
                    >
                        <X size={24} />
                    </button>

                    {/* Progress Bar */}
                    <div className="h-1.5 bg-gray-100 dark:bg-slate-700 w-full">
                        <motion.div
                            className={`h-full ${slides[step].color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${((step + 1) / slides.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    <div className="p-8 text-center flex flex-col items-center min-h-[400px]">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 flex flex-col items-center justify-center"
                        >
                            {slides[step].icon}
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                {slides[step].title}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                {slides[step].desc}
                            </p>
                        </motion.div>

                        <div className="w-full mt-8">
                            <button
                                onClick={handleNext}
                                className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${slides[step].color}`}
                            >
                                {step === slides.length - 1 ? "Let's Get Started" : "Next"}
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Dots */}
                        <div className="flex gap-2 mt-6 justify-center">
                            {slides.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-gray-800 dark:bg-white' : 'bg-gray-300 dark:bg-slate-600'}`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default OnboardingModal;
