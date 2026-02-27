import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { FeedbackAnnotation } from '../../data/mockFeedbackData';

interface AnnotatedTextPanelProps {
    originalText: string;
    annotations: FeedbackAnnotation[];
}

const typeConfig = {
    grammar: { color: 'bg-red-100 text-red-800 border-red-300', badge: 'Grammar', dotColor: 'bg-red-500' },
    vocabulary: { color: 'bg-amber-100 text-amber-800 border-amber-300', badge: 'Vocabulary', dotColor: 'bg-amber-500' },
    tone: { color: 'bg-purple-100 text-purple-800 border-purple-300', badge: 'Tone', dotColor: 'bg-purple-500' },
    clarity: { color: 'bg-sky-100 text-sky-800 border-sky-300', badge: 'Clarity', dotColor: 'bg-sky-500' },
};

const AnnotatedTextPanel: React.FC<AnnotatedTextPanelProps> = ({ originalText, annotations }) => {
    const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null);

    // Build annotated segments by scanning text for annotation originals
    const buildSegments = () => {
        const segments: { text: string; annotationIndex: number | null }[] = [];
        let remaining = originalText;
        const used = new Set<number>();

        while (remaining.length > 0) {
            let earliest = -1;
            let earliestPos = remaining.length;

            annotations.forEach((ann, idx) => {
                if (used.has(idx)) return;
                const pos = remaining.indexOf(ann.original);
                if (pos !== -1 && pos < earliestPos) {
                    earliestPos = pos;
                    earliest = idx;
                }
            });

            if (earliest === -1) {
                segments.push({ text: remaining, annotationIndex: null });
                break;
            }

            if (earliestPos > 0) {
                segments.push({ text: remaining.substring(0, earliestPos), annotationIndex: null });
            }
            segments.push({ text: annotations[earliest].original, annotationIndex: earliest });
            used.add(earliest);
            remaining = remaining.substring(earliestPos + annotations[earliest].original.length);
        }

        return segments;
    };

    const segments = buildSegments();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden"
        >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Annotated Email</h3>
                <div className="flex items-center gap-3 text-xs">
                    {Object.entries(typeConfig).map(([key, cfg]) => (
                        <span key={key} className="flex items-center gap-1.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${cfg.dotColor}`}></span>
                            <span className="text-slate-500 dark:text-slate-400 capitalize">{cfg.badge}</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Annotated Text Body */}
            <div className="p-6 leading-[2] text-[15px] text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-mono relative">
                {segments.map((seg, idx) => {
                    if (seg.annotationIndex === null) {
                        return <span key={idx}>{seg.text}</span>;
                    }
                    const ann = annotations[seg.annotationIndex];
                    const cfg = typeConfig[ann.type];
                    const isActive = activeAnnotation === seg.annotationIndex;

                    return (
                        <span key={idx} className="relative inline-block group">
                            <span
                                className={`${cfg.color} border-b-2 px-1 py-0.5 rounded-md cursor-pointer transition-all duration-200 hover:shadow-md ${isActive ? 'ring-2 ring-offset-1 ring-indigo-400' : ''}`}
                                onClick={() => setActiveAnnotation(isActive ? null : seg.annotationIndex)}
                            >
                                {seg.text}
                            </span>

                            {/* Tooltip */}
                            {isActive && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute left-0 top-full mt-2 z-30 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-4"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`${cfg.dotColor} w-2.5 h-2.5 rounded-full`}></span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{cfg.badge} Issue</span>
                                    </div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{ann.explanation}</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="line-through text-red-400">{ann.original}</span>
                                        <span className="text-slate-400">→</span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{ann.suggestion}</span>
                                    </div>
                                </motion.div>
                            )}
                        </span>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default AnnotatedTextPanel;
