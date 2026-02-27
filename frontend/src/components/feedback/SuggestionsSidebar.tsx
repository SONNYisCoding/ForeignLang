import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Tag } from 'lucide-react';
import type { VocabSuggestion } from '../../data/mockFeedbackData';

interface SuggestionsSidebarProps {
    suggestions: VocabSuggestion[];
    summary: string;
}

const categoryColors: Record<string, string> = {
    'Business Verb': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Business Phrase': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Closing': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const SuggestionsSidebar: React.FC<SuggestionsSidebarProps> = ({ suggestions, summary }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden flex flex-col"
        >
            {/* Summary */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">AI Summary</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{summary}</p>
            </div>

            {/* Suggestions List */}
            <div className="p-5">
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                    Business English Upgrades ({suggestions.length})
                </h4>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {suggestions.map((sug, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            className="group bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="line-through text-red-400 text-sm font-medium">{sug.original}</span>
                                <ArrowRight size={14} className="text-slate-400 shrink-0" />
                                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">{sug.recommended}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${categoryColors[sug.category] || 'bg-slate-100 text-slate-600'}`}>
                                    <Tag size={10} /> {sug.category}
                                </span>
                                <span className="text-[11px] text-slate-400 dark:text-slate-500">{sug.reason}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default SuggestionsSidebar;
