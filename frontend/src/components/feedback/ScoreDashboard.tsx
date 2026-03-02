import React from 'react';
import { motion } from 'framer-motion';
import type { FeedbackScores } from '../../data/mockFeedbackData';

interface ScoreDashboardProps {
    scores: FeedbackScores;
}

const ScoreRing: React.FC<{ label: string; value: number; color: string; delay: number }> = ({ label, value, color, delay }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    const getGrade = (v: number) => {
        if (v >= 90) return 'A+';
        if (v >= 80) return 'A';
        if (v >= 70) return 'B';
        if (v >= 60) return 'C';
        return 'D';
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.4 }}
            className="flex flex-col items-center gap-2"
        >
            <div className="relative w-24 h-24">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r={radius} fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-700" strokeWidth="6" />
                    <motion.circle
                        cx="40" cy="40" r={radius} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ delay: delay + 0.2, duration: 1, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{value}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{getGrade(value)}</span>
                </div>
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</span>
        </motion.div>
    );
};

const ScoreDashboard: React.FC<ScoreDashboardProps> = ({ scores }) => {
    const metrics = [
        { label: 'Grammar', value: scores.grammar, color: '#EF4444' },
        { label: 'Vocabulary', value: scores.vocabulary, color: '#F59E0B' },
        { label: 'Tone', value: scores.tone, color: '#8B5CF6' },
        { label: 'Clarity', value: scores.clarity, color: '#0EA5E9' },
    ];

    const overallColor = scores.overall >= 80 ? '#10B981' : scores.overall >= 60 ? '#F59E0B' : '#EF4444';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6"
        >
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6">Email Quality Score</h3>

            {/* Overall Score */}
            <div className="flex justify-center mb-8">
                <div className="relative w-36 h-36">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-700" strokeWidth="8" />
                        <motion.circle
                            cx="40" cy="40" r="36" fill="none" stroke={overallColor} strokeWidth="8" strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 36}
                            initial={{ strokeDashoffset: 2 * Math.PI * 36 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 36 - (scores.overall / 100) * 2 * Math.PI * 36 }}
                            transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">{scores.overall}</span>
                        <span className="text-xs font-bold text-slate-400">OVERALL</span>
                    </div>
                </div>
            </div>

            {/* Individual Metrics */}
            <div className="grid grid-cols-4 gap-2">
                {metrics.map((m, i) => (
                    <ScoreRing key={m.label} label={m.label} value={m.value} color={m.color} delay={0.3 + i * 0.1} />
                ))}
            </div>
        </motion.div>
    );
};

export default ScoreDashboard;
