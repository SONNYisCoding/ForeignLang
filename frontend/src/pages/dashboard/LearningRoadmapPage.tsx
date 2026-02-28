import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, BarChart3, Clock, Plus, Map, ChevronRight, Trash2 } from 'lucide-react';
import UiverseLoader from '../../components/ui/UiverseLoader';
import RoadmapInputForm from '../../components/roadmap/RoadmapInputForm';
import RoadmapTimeline from '../../components/roadmap/RoadmapTimeline';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { useCredits } from '../../contexts/CreditContext';
import { getMockRoadmap } from '../../data/mockRoadmapData';
import type { RoadmapData } from '../../data/mockRoadmapData';

// Stored roadmap with metadata
interface SavedRoadmap {
    id: string;
    name: string;
    timestamp: number;
    data: RoadmapData;
}

const STORAGE_KEY = 'foreignlang_roadmaps';

const loadRoadmaps = (): SavedRoadmap[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
};

const saveRoadmaps = (items: SavedRoadmap[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const LearningRoadmapPage: React.FC = () => {
    const [roadmaps, setRoadmaps] = useState<SavedRoadmap[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const loaded = loadRoadmaps();
        setRoadmaps(loaded);
        if (loaded.length > 0) setSelectedId(loaded[0].id);
    }, []);

    const selectedRoadmap = roadmaps.find(r => r.id === selectedId)?.data || null;

    const { user } = useAuth();
    const { credits, deductCredit, refreshCredits } = useCredits();
    const isPremium = user?.isPremium || false;

    const handleGenerate = async (input: string) => {
        if (isGenerating) return;
        if (!isPremium && credits !== null && credits <= 0) {
            toast.error('No credits left! Use the ⚡ button in the navbar to get more.');
            return;
        }

        setIsGenerating(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/v1/quota/consume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                credentials: 'include',
            });
            if (!res.ok) {
                if (res.status === 429 && isPremium) {
                    toast.error('To ensure high speeds for everyone, you have reached the daily Fair Use limit. Please try again tomorrow!');
                } else {
                    toast.error('Failed to deduct credit. Please try again.');
                }
                setIsGenerating(false);
                return;
            }
        } catch {
            toast.error('Network error. Please try again.');
            setIsGenerating(false);
            return;
        }

        if (!isPremium) deductCredit();

        setTimeout(() => {
            const data = getMockRoadmap(input);
            const newRoadmap: SavedRoadmap = {
                id: Date.now().toString(),
                name: data.goal || `Roadmap ${roadmaps.length + 1}`,
                timestamp: Date.now(),
                data,
            };
            const updated = [newRoadmap, ...roadmaps];
            setRoadmaps(updated);
            saveRoadmaps(updated);
            setSelectedId(newRoadmap.id);
            setShowForm(false);
            setIsGenerating(false);
            refreshCredits();
        }, 3000);
    };

    const handleDelete = (id: string) => {
        const updated = roadmaps.filter(r => r.id !== id);
        setRoadmaps(updated);
        saveRoadmaps(updated);
        if (selectedId === id) {
            setSelectedId(updated.length > 0 ? updated[0].id : null);
        }
    };

    const formatDate = (ts: number) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const completedModules = selectedRoadmap?.modules.filter(m => m.status === 'completed').length || 0;
    const totalModules = selectedRoadmap?.modules.length || 0;
    const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

    return (
        <div className="max-w-[90rem] mx-auto flex gap-6">
            {/* ═══ Left: Roadmap List Panel ═══ */}
            <div className="hidden lg:flex flex-col w-72 shrink-0">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Map size={16} className="text-emerald-500" /> My Roadmaps
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{roadmaps.length} roadmap{roadmaps.length !== 1 ? 's' : ''} created</p>
                    </div>

                    {/* Generate New Button */}
                    <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                        <button
                            onClick={() => { setShowForm(true); setSelectedId(null); }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl text-sm hover:-translate-y-0.5 hover:shadow-lg shadow-emerald-500/30 transition-all"
                        >
                            <Plus size={16} /> Generate New Roadmap
                        </button>
                    </div>

                    {/* Roadmap List */}
                    <div className="flex-1 overflow-y-auto">
                        {roadmaps.length === 0 && !showForm ? (
                            <div className="p-6 text-center text-slate-400 text-sm">No roadmaps yet. Create one above!</div>
                        ) : (
                            roadmaps.map(item => (
                                <div
                                    key={item.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => { setSelectedId(item.id); setShowForm(false); }}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setSelectedId(item.id); setShowForm(false); } }}
                                    className={`w-full text-left p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-emerald-50/50 dark:hover:bg-slate-750 transition-colors group cursor-pointer ${selectedId === item.id && !showForm ? 'bg-emerald-50 dark:bg-emerald-900/20 border-l-2 border-l-emerald-500' : ''
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">{item.name}</p>
                                            <p className="text-xs text-slate-400 mt-1">{formatDate(item.timestamp)} • {item.data.totalWeeks} weeks</p>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                                className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ═══ Main Content ═══ */}
            <div className="flex-1 min-w-0">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Learning Roadmap</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Upload your goals or CV, and get a personalized learning path tailored for you.</p>
                </div>

                {/* Mobile: Generate New button */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => { setShowForm(true); setSelectedId(null); }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-sm"
                    >
                        <Plus size={16} /> New Roadmap
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {isGenerating && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32">
                            <UiverseLoader />
                            <h2 className="mt-8 text-xl font-bold text-slate-900 dark:text-white">Analyzing your profile...</h2>
                            <p className="mt-2 text-slate-500">Building a personalized roadmap based on your goals.</p>
                        </motion.div>
                    )}

                    {/* Form State */}
                    {!isGenerating && showForm && (
                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <RoadmapInputForm onSubmit={handleGenerate} isLoading={isGenerating} />
                        </motion.div>
                    )}

                    {/* Empty State */}
                    {!isGenerating && !showForm && !selectedRoadmap && (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-4">
                                <Map size={40} className="text-emerald-500" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Roadmap Selected</h2>
                            <p className="text-slate-500 max-w-sm">Create your first personalized learning roadmap to get started.</p>
                            <button onClick={() => setShowForm(true)} className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"><Plus size={18} /> Create Roadmap</button>
                        </motion.div>
                    )}

                    {/* Result State */}
                    {!isGenerating && !showForm && selectedRoadmap && (
                        <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {/* Overview Header */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 md:p-8 text-white mb-8 shadow-xl shadow-emerald-500/20 relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between flex-wrap gap-4">
                                        <div>
                                            <h2 className="text-2xl font-black">{selectedRoadmap.goal}</h2>
                                            <p className="text-emerald-100 mt-1">Level: {selectedRoadmap.level} • {selectedRoadmap.totalWeeks} weeks</p>
                                        </div>
                                        <button onClick={() => setShowForm(true)} className="text-sm px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors">Generate New</button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mt-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Target size={20} /></div>
                                            <div><p className="text-2xl font-black">{overallProgress}%</p><p className="text-xs text-emerald-200">Progress</p></div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><BarChart3 size={20} /></div>
                                            <div><p className="text-2xl font-black">{completedModules}/{totalModules}</p><p className="text-xs text-emerald-200">Modules</p></div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Clock size={20} /></div>
                                            <div><p className="text-2xl font-black">~{Math.round(selectedRoadmap.totalWeeks * 25)}m</p><p className="text-xs text-emerald-200">Total Time</p></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <RoadmapTimeline modules={selectedRoadmap.modules} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LearningRoadmapPage;
