import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

const AnimatedTooltip: React.FC<Props> = ({ content, children, position = 'top', delay = 0.2 }) => {
    const [isVisible, setIsVisible] = useState(false);

    const getPosClass = () => {
        switch (position) {
            case 'top': return 'bottom-full left-1/2 -translate-x-1/2 mb-2 pb-1';
            case 'bottom': return 'top-full left-1/2 -translate-x-1/2 mt-2 pt-1';
            case 'left': return 'right-full top-1/2 -translate-y-1/2 mr-2 pr-1';
            case 'right': return 'left-full top-1/2 -translate-y-1/2 ml-2 pl-1';
        }
    }

    const getAnimationProps = () => {
        const base = { opacity: 0, scale: 0.8 };
        if (position === 'top') return { ...base, y: 10 };
        if (position === 'bottom') return { ...base, y: -10 };
        if (position === 'left') return { ...base, x: 10 };
        if (position === 'right') return { ...base, x: -10 };
        return base;
    }

    return (
        <div
            className="relative flex items-center justify-center group"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={getAnimationProps()}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
                        transition={{ duration: 0.2, delay, type: 'spring', stiffness: 260, damping: 20 }}
                        className={`absolute z-50 pointer-events-none flex items-center justify-center ${getPosClass()}`}
                    >
                        <div className="relative px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 border border-slate-700 shadow-[0_0_15px_rgba(0,0,0,0.3)] rounded-lg whitespace-nowrap overflow-hidden">
                            {/* Subtle gradient glow inside tooltip */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-sky-400/20 blur-sm"></div>
                            <span className="relative z-10 drop-shadow-sm">{content}</span>
                        </div>

                        {/* Tooltip Arrow (Optional, can be added with CSS triangle) */}
                        {position === 'top' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-slate-800"></div>}
                        {position === 'bottom' && <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-slate-800"></div>}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AnimatedTooltip;
