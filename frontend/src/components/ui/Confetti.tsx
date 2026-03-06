import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Premium brand colors
const colors = [
    '#6366f1', // Indigo 500
    '#8b5cf6', // Violet 500
    '#ec4899', // Pink 500
    '#14b8a6', // Teal 500
    '#f59e0b', // Amber 500
    '#3b82f6', // Blue 500
];

interface ConfettiProps {
    active: boolean;
    duration?: number;
    intensity?: number;
}

interface Piece {
    id: number;
    color: string;
    style: {
        x: number;
        delay: number;
        scale: number;
        rotation: number;
        targetX: number;
        duration: number;
    };
}

const ConfettiPiece = ({ color, style }: { color: string, style: Piece['style'] }) => (
    <motion.div
        initial={{
            y: -50,
            x: style.x,
            opacity: 1,
            rotate: 0,
            scale: style.scale
        }}
        animate={{
            y: window.innerHeight + 100,
            x: style.targetX,
            opacity: [1, 1, 1, 0],
            rotate: style.rotation,
        }}
        transition={{
            duration: style.duration,
            ease: "easeOut",
            delay: style.delay,
        }}
        className="absolute w-3 h-3 rounded-sm shadow-sm"
        style={{ backgroundColor: color }}
    />
);

const Confetti: React.FC<ConfettiProps> = ({ active, duration = 4000, intensity = 60 }) => {
    const [pieces, setPieces] = useState<Piece[]>([]);

    useEffect(() => {
        if (active) {
            const newPieces = Array.from({ length: intensity }).map((_, i) => {
                const startX = Math.random() * window.innerWidth;
                return {
                    id: Date.now() + i,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    style: {
                        x: startX,
                        targetX: startX + (Math.random() - 0.5) * 300,
                        duration: Math.random() * 2 + 2,
                        delay: Math.random() * 0.5,
                        scale: Math.random() * 0.8 + 0.4,
                        rotation: Math.random() * 360 * 5,
                    }
                };
            });

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPieces(newPieces);

            const timer = setTimeout(() => {
                setPieces([]);
            }, duration);

            return () => clearTimeout(timer);
        } else {
            setPieces([]);
        }
    }, [active, duration, intensity]);

    return (
        <AnimatePresence>
            {pieces.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
                >
                    {pieces.map(p => (
                        <ConfettiPiece key={p.id} color={p.color} style={p.style} />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Confetti;
