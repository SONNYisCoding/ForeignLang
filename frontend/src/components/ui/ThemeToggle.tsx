
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-xl transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-yellow-400"
            aria-label="Toggle Dark Mode"
        >
            {theme === 'light' ? (
                <Moon size={20} className="text-slate-600" />
            ) : (
                <Sun size={20} />
            )}
        </motion.button>
    );
};

export default ThemeToggle;
