import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Clock, BookOpen, FlaskConical, HelpCircle } from 'lucide-react';
import type { RoadmapModule } from '../../data/mockRoadmapData';

interface RoadmapTimelineProps {
    modules: RoadmapModule[];
}

const statusConfig = {
    completed: { border: 'border-emerald-500', bg: 'bg-emerald-500', text: 'text-emerald-600', label: 'Completed' },
    current: { border: 'border-indigo-500', bg: 'bg-indigo-500', text: 'text-indigo-600', label: 'In Progress' },
    locked: { border: 'border-slate-300 dark:border-slate-600', bg: 'bg-slate-300 dark:bg-slate-600', text: 'text-slate-400', label: 'Locked' },
};

const lessonTypeIcon = {
    lesson: BookOpen,
    practice: FlaskConical,
    quiz: HelpCircle,
};

const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ modules }) => {
    return (
        <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

            <div className="space-y-8">
                {modules.map((mod, index) => {
                    const config = statusConfig[mod.status];
                    const ProgressRadius = 18;
                    const circumference = 2 * Math.PI * ProgressRadius;
                    const offset = circumference - (mod.progress / 100) * circumference;

                    return (
                        <motion.div
                            key={mod.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 * index, duration: 0.4 }}
                            className="relative pl-16 md:pl-20"
                        >
                            {/* Timeline Node */}
                            <div className={`absolute left-[14px] md:left-[18px] top-6 w-8 h-8 md:w-10 md:h-10 rounded-full border-[3px] ${config.border} flex items-center justify-center bg-white dark:bg-slate-900 z-10`}>
                                {mod.status === 'completed' && <CheckCircle2 size={18} className="text-emerald-500" />}
                                {mod.status === 'current' && (
                                    <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></div>
                                )}
                                {mod.status === 'locked' && <Lock size={14} className="text-slate-400" />}
                            </div>

                            {/* Card */}
                            <div className={`bg-white dark:bg-slate-800 rounded-2xl border ${mod.status === 'current' ? 'border-indigo-200 dark:border-indigo-800 shadow-lg shadow-indigo-100/50 dark:shadow-indigo-900/20' : 'border-slate-200 dark:border-slate-700'} p-6 transition-all hover:shadow-md`}>
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <span className={`text-xs font-bold uppercase tracking-wider ${config.text}`}>
                                            Week {mod.week} • {config.label}
                                        </span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{mod.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{mod.description}</p>
                                    </div>

                                    {/* Mini Progress Ring */}
                                    <div className="relative w-12 h-12 shrink-0">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                                            <circle cx="22" cy="22" r={ProgressRadius} fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-700" strokeWidth="3" />
                                            <circle
                                                cx="22" cy="22" r={ProgressRadius} fill="none"
                                                stroke={mod.status === 'completed' ? '#10B981' : mod.status === 'current' ? '#6366F1' : '#CBD5E1'}
                                                strokeWidth="3" strokeLinecap="round"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={offset}
                                            />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-slate-600 dark:text-slate-400">
                                            {mod.progress}%
                                        </span>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {mod.skills.map((skill) => (
                                        <span key={skill} className="text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {/* Lessons */}
                                <div className="space-y-2">
                                    {mod.lessons.map((lesson, li) => {
                                        const LessonIcon = lessonTypeIcon[lesson.type];
                                        return (
                                            <div key={li} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                                <LessonIcon size={16} className={`shrink-0 ${mod.status === 'locked' ? 'text-slate-300 dark:text-slate-600' : 'text-indigo-500'}`} />
                                                <span className={`text-sm flex-1 ${mod.status === 'locked' ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                    {lesson.title}
                                                </span>
                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                    <Clock size={12} /> {lesson.duration}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Clock size={12} /> Total: {mod.estimatedTime}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        {mod.lessons.length} lessons
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default RoadmapTimeline;
