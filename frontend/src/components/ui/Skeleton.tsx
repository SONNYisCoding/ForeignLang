import type { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

/**
 * Base Skeleton component with shimmer animation
 */
export const Skeleton = ({ className = '', ...props }: SkeletonProps) => (
    <div
        className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
        {...props}
    />
);

/**
 * Skeleton for text lines
 */
export const SkeletonText = ({ lines = 3, className = '' }: { lines?: number; className?: string }) => (
    <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
                key={i}
                className="h-4 rounded"
                style={{ width: i === lines - 1 ? '60%' : '100%' }}
            />
        ))}
    </div>
);

/**
 * Skeleton for avatar/profile image
 */
export const SkeletonAvatar = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };
    return <Skeleton className={`${sizes[size]} rounded-full`} />;
};

/**
 * Skeleton for card content
 */
export const SkeletonCard = ({ className = '' }: { className?: string }) => (
    <div className={`bg-white rounded-2xl p-6 border border-gray-100 ${className}`}>
        <div className="flex items-center gap-4 mb-4">
            <SkeletonAvatar size="md" />
            <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
            </div>
        </div>
        <SkeletonText lines={3} />
    </div>
);

/**
 * Skeleton for Dashboard stats
 */
export const SkeletonStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-32" />
            </div>
        ))}
    </div>
);

/**
 * Skeleton for Email Generator
 */
export const SkeletonEmailPreview = () => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
        </div>
        <Skeleton className="h-10 w-full mb-4 rounded-lg" />
        <SkeletonText lines={6} />
    </div>
);

export default Skeleton;
