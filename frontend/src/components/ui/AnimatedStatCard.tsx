import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedStatCardProps {
    value: React.ReactNode;
    label: React.ReactNode;
    className?: string;
}

const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({ value, label, className = '' }) => {
    return (
        <div className={`relative flex flex-col items-center justify-center text-center p-6 group cursor-default overflow-hidden ${className}`}>
            {/* Animated glowing conic border on hover */}
            <div className="absolute inset-0 bg-transparent rounded-2xl border-2 border-transparent group-hover:border-indigo-100 transition-colors duration-300"></div>

            {/* Background glowing orb that expands on hover */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-gradient-to-br from-indigo-400/20 to-sky-400/20 rounded-full blur-2xl group-hover:w-32 group-hover:h-32 transition-all duration-700 pointer-events-none"></div>

            <motion.div
                className="relative z-10"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
            >
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-sky-500 transition-all duration-300">
                    {value}
                </h3>
            </motion.div>

            <p className="text-sm text-slate-500 font-medium mt-1 relative z-10 group-hover:text-slate-600 transition-colors duration-300">
                {label}
            </p>
        </div>
    );
};

export default AnimatedStatCard;
