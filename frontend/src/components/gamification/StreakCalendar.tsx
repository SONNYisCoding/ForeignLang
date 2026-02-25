import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Check, Calendar as CalendarIcon, Zap } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

interface StreakData {
    currentStreak: number;
    lastActivityDate: string | null;
}

const StreakCalendar = () => {
    const [streakData, setStreakData] = useState<StreakData>({ currentStreak: 0, lastActivityDate: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                const res = await fetch('/api/v1/gamification/streak', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setStreakData(data);
                }
            } catch (error) {
                console.error(error);
                // Fail silently, it's just gamification
            } finally {
                setLoading(false);
            }
        };

        fetchStreak();
    }, []);

    // Generate next 7 days
    const days = [];
    const today = new Date();

    // Check if there's activity today based on the backend response
    let isActiveToday = false;
    let lastActivityDate: Date | null = null;
    let streakStartDate: Date | null = null;

    if (streakData.lastActivityDate) {
        lastActivityDate = new Date(streakData.lastActivityDate);
        lastActivityDate.setHours(0, 0, 0, 0);

        const latestMidnight = new Date();
        latestMidnight.setHours(0, 0, 0, 0);
        isActiveToday = lastActivityDate.getTime() === latestMidnight.getTime();

        if (streakData.currentStreak > 0) {
            streakStartDate = new Date(lastActivityDate);
            streakStartDate.setDate(streakStartDate.getDate() - streakData.currentStreak + 1);
        }
    }

    const normalizedToday = new Date();
    normalizedToday.setHours(0, 0, 0, 0);

    // The calendar should start from the user's streak start date, 
    // or today if they don't have an active streak.
    const calendarStartDate = streakStartDate ? new Date(streakStartDate) : new Date(normalizedToday);

    // Generate 7 consecutive days starting from the calendarStartDate
    for (let i = 0; i < 7; i++) {
        const d = new Date(calendarStartDate);
        d.setDate(calendarStartDate.getDate() + i);

        let isDone = false;
        if (streakData.currentStreak > 0 && streakStartDate && lastActivityDate) {
            // True if the date falls strictly between start and end of streak bounds (inclusive)
            if (d.getTime() >= streakStartDate.getTime() && d.getTime() <= lastActivityDate.getTime()) {
                isDone = true;
            }
        }

        days.push({
            date: d,
            dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
            done: isDone,
            isToday: d.getTime() === normalizedToday.getTime()
        });
    }

    if (loading) {
        return <div className="h-40 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse" />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-white dark:border-slate-700/50 shadow-xl shadow-orange-500/10 relative overflow-hidden group"
        >
            {/* Glowing background blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/20 dark:bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:scale-110 transition-transform duration-700" />

            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <Flame size={120} className="text-orange-500 translate-x-4 -translate-y-4" />
            </div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 text-orange-500 dark:text-orange-400 rounded-xl shadow-inner group-hover:scale-110 transition-transform">
                        <Flame size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 flex items-center gap-2">
                            {streakData.currentStreak} Day Streak
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Keep it up to earn AI Credits!</p>
                    </div>
                </div>
            </div>

            {/* Calendar Row */}
            <div className="flex justify-between items-center mb-6 relative z-10">
                {days.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                        <span className={`text-xs font-bold ${day.isToday ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400 dark:text-slate-500'}`}>
                            {day.dayName}
                        </span>

                        <Tooltip content={day.isToday ? "Hôm nay" : day.date.toLocaleDateString()}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                                ${day.done
                                    ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)] font-bold scale-110 ring-2 ring-white dark:ring-slate-800 ring-offset-2 ring-offset-orange-100 dark:ring-offset-orange-900/50 z-10'
                                    : day.isToday
                                        ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-400 ring-2 ring-orange-200 dark:ring-orange-500/50 border border-dashed border-orange-300 dark:border-orange-500 shadow-inner'
                                        : 'bg-slate-50/50 dark:bg-slate-800/30 text-slate-300 dark:text-slate-600 border border-slate-200/50 dark:border-slate-700/50'
                                }`}
                            >
                                {day.done ? <Check size={18} strokeWidth={3} /> : (day.isToday ? <div className="w-2.5 h-2.5 rounded-full bg-orange-400 dark:bg-orange-500 animate-pulse" /> : null)}
                            </div>
                        </Tooltip>
                    </div>
                ))}
            </div>

            {/* Next Milestone */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-3.5 flex items-center justify-between relative z-10 border border-orange-100/50 dark:border-orange-900/30 shadow-inner">
                <div className="flex items-center gap-2">
                    <CalendarIcon size={16} className="text-orange-500 dark:text-orange-400" />
                    <span className="text-sm font-semibold text-orange-800 dark:text-orange-200">Next milestone:</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/60 dark:bg-slate-800/60 px-2 py-1 rounded-lg">
                    <span className="text-sm font-black text-orange-600 dark:text-orange-400">{(Math.floor(streakData.currentStreak / 7) + 1) * 7} Days</span>
                    <span className="text-xs text-orange-500 dark:text-orange-500 flex items-center gap-0.5 font-bold">
                        (+3 <Zap size={10} className="fill-current" />)
                    </span>
                </div>
            </div>

        </motion.div>
    );
};

export default StreakCalendar;
