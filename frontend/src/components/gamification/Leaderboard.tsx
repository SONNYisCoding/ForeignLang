import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import Skeleton from '../ui/Skeleton';

interface LeaderboardEntry {
    userId: string;
    name: string;
    avatar?: string;
    score: number;
    rank: number;
}

interface LeaderboardProps {
    groupId: string;
}

const Leaderboard = ({ groupId }: LeaderboardProps) => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const { showError } = useToast();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch(`/api/v1/gamification/leaderboard/${groupId}`, {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setEntries(data);
                } else {
                    showError('Failed to load leaderboard');
                }
            } catch (error) {
                console.error(error);
                showError('Error loading leaderboard');
            } finally {
                setLoading(false);
            }
        };

        if (groupId) {
            fetchLeaderboard();
        }
    }, [groupId]);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className="text-yellow-500" size={24} />;
            case 2:
                return <Medal className="text-gray-400" size={24} />;
            case 3:
                return <Medal className="text-amber-600" size={24} />;
            default:
                return <span className="font-bold text-slate-500 w-6 text-center">{rank}</span>;
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <Trophy className="text-indigo-500" size={24} />
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Group Leaderboard</h2>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="w-6 h-6 rounded-full" />
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="w-32 h-4" />
                                <Skeleton className="w-16 h-3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm text-center">
                <Trophy className="text-slate-300 dark:text-slate-600 mx-auto mb-3" size={32} />
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No data yet</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Members need to master vocabulary to rank up!</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-white dark:border-slate-700/50 shadow-xl shadow-indigo-500/10"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-xl shadow-inner">
                    <Trophy className="text-indigo-600 dark:text-indigo-400" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Class Leaderboard</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ranked by overall vocabulary mastery</p>
                </div>
            </div>

            <div className="space-y-3">
                {entries.map((entry, index) => (
                    <motion.div
                        key={entry.userId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, type: "spring" }}
                        className={`flex items-center gap-4 p-3.5 rounded-2xl transition-all hover:scale-[1.02] ${entry.rank === 1
                                ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200/50 dark:border-yellow-700/50 shadow-md shadow-yellow-500/20 z-10 relative'
                                : 'bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm border border-transparent dark:border-slate-700/50'
                            }`}
                    >
                        <div className="w-8 flex justify-center">
                            {getRankIcon(entry.rank)}
                        </div>

                        <div className={`w-11 h-11 rounded-full flex-shrink-0 overflow-hidden ring-2 ${entry.rank === 1 ? 'ring-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'ring-white dark:ring-slate-800'}`}>
                            {entry.avatar ? (
                                <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center font-bold text-lg ${entry.rank === 1 ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'}`}>
                                    {entry.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className={`font-bold truncate text-base ${entry.rank === 1 ? 'text-yellow-800 dark:text-yellow-400' : 'text-slate-800 dark:text-white'
                                }`}>
                                {entry.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Star size={14} className={entry.rank === 1 ? 'text-yellow-500 fill-yellow-500' : 'text-emerald-500'} />
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    {entry.score} words mastered
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Leaderboard;
