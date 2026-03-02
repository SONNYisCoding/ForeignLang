import React from 'react';
import { motion } from 'framer-motion';

interface UiverseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const UiverseButton: React.FC<UiverseButtonProps> = ({ children, className = '', ...props }) => {
    return (
        <button
            className={`relative overflow-hidden px-8 py-4 bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white font-bold rounded-full shadow-xl shadow-indigo-500/30 transition-all hover:shadow-2xl hover:shadow-indigo-500/50 flex items-center justify-center gap-2 text-lg group ${className}`}
            {...props}
        >
            <motion.div
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                initial={{ x: '-150%' }}
                animate={{ x: '150%' }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
            />
            {/* Pulsating invisible border effect underlying the button */}
            <div className="absolute inset-0 border-[2px] border-white/20 rounded-full group-hover:border-white/50 transition-colors duration-500 mix-blend-overlay"></div>

            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-300 drop-shadow-sm">
                {children}
            </span>
        </button>
    );
};

export default UiverseButton;
