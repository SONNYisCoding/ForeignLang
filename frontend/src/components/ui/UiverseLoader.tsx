import React from 'react';

interface LoaderProps {
    text?: string;
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

const UiverseLoader: React.FC<LoaderProps> = ({ text = 'Loading...', size = 'md', fullScreen = false }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-16 h-16',
        lg: 'w-24 h-24'
    };

    const loaderContent = (
        <div className="flex flex-col items-center justify-center gap-4">
            {/* Modern Glowing Rings Loader */}
            <div className={`relative ${sizeClasses[size]}`}>
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 animate-[spin_1s_linear_infinite] opacity-80 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                {/* Middle Ring */}
                <div className="absolute inset-1 rounded-full border-r-4 border-sky-400 animate-[spin_1.5s_linear_infinite_reverse] opacity-80 shadow-[0_0_15px_rgba(56,189,248,0.5)]"></div>
                {/* Inner Ring */}
                <div className="absolute inset-2 rounded-full border-b-4 border-purple-500 animate-[spin_2s_linear_infinite] opacity-80 shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>

                {/* Center glowing dot */}
                <div className="absolute inset-0 m-auto w-1/4 h-1/4 bg-white/80 rounded-full animate-pulse blur-[2px] shadow-[0_0_10px_white]"></div>
            </div>

            {text && (
                <span className="text-sm font-bold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 animate-pulse drop-shadow-sm">
                    {text}
                </span>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                {loaderContent}
            </div>
        );
    }

    return loaderContent;
};

export default UiverseLoader;
