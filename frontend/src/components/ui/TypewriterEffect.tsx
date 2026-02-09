import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterEffectProps {
    text: string;
    className?: string;
    cursorColor?: string;
    startDelay?: number;
    typingSpeed?: number;
    showCursor?: boolean;
    hideCursorOnComplete?: boolean;
}

export const TypewriterEffect = ({
    text,
    className = "",
    cursorColor = "bg-indigo-600",
    startDelay = 0,
    typingSpeed = 50,
    showCursor = true,
    hideCursorOnComplete = false
}: TypewriterEffectProps) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isStarted, setIsStarted] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        setDisplayedText("");
        setIsStarted(false);
        setIsComplete(false);

        const startTimeout = setTimeout(() => {
            setIsStarted(true);
        }, startDelay);

        return () => clearTimeout(startTimeout);
    }, [text, startDelay]);

    useEffect(() => {
        if (!isStarted) return;

        const intervalId = setInterval(() => {
            setDisplayedText((prev) => {
                if (prev.length < text.length) {
                    return text.slice(0, prev.length + 1);
                } else {
                    clearInterval(intervalId);
                    setIsComplete(true);
                    return prev;
                }
            });
        }, typingSpeed);

        return () => clearInterval(intervalId);
    }, [isStarted, text, typingSpeed]);

    return (
        <span className={`${className} inline-flex items-center`}>
            {displayedText}
            {showCursor && (!hideCursorOnComplete || !isComplete) && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className={`ml-1 w-[2px] h-[1em] ${cursorColor}`}
                />
            )}
        </span>
    );
};

export default TypewriterEffect;
