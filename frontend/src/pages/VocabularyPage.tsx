import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Volume2, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface Vocabulary {
    id: string;
    term: string;
    definition: string;
    exampleSentence: string;
    pronunciation: string;
    partOfSpeech: string;
    topic?: {
        title: string;
    };
}

const VocabularyPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [vocabList, setVocabList] = useState<Vocabulary[]>([]);
    const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchVocabAndMastered = async () => {
            try {
                const [vocabRes, masteredRes] = await Promise.all([
                    fetch('/api/v1/vocabulary/search?term=', { credentials: 'include' }),
                    fetch('/api/v1/vocabulary/mastered', { credentials: 'include' })
                ]);

                if (vocabRes.ok) {
                    const data = await vocabRes.json();
                    setVocabList(data);
                }

                if (masteredRes.ok) {
                    const ids: string[] = await masteredRes.json();
                    setMasteredIds(new Set(ids));
                }
            } catch (error) {
                console.error('Failed to fetch data', error);
                toast.error('Failed to load vocabulary');
            } finally {
                setLoading(false);
            }
        };

        fetchVocabAndMastered();
    }, []);

    const toggleMastery = async (id: string) => {
        try {
            const res = await fetch(`/api/v1/vocabulary/${id}/master`, {
                method: 'POST',
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                setMasteredIds(prev => {
                    const next = new Set(prev);
                    if (data.isMastered) {
                        next.add(id);
                        toast.success('Word mastered! +1 to Leaderboard score.');
                    } else {
                        next.delete(id);
                        toast.info('Word removed from mastered list.');
                    }
                    return next;
                });
            } else {
                toast.error('Failed to update mastery status.');
            }
        } catch (error) {
            console.error('Error toggling mastery:', error);
            toast.error('An error occurred.');
        }
    };

    const filteredVocab = vocabList.filter(v =>
        v.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const playAudio = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header / Banner */}
            <div className="mb-10 relative">
                <div className="absolute top-0 right-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl -z-10 animate-pulse" />
                <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center text-sm font-semibold text-gray-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-sm shadow-sm"
                >
                    <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-xl shadow-inner border border-emerald-200/50 dark:border-emerald-800/50">
                                <BookOpen className="text-emerald-600 dark:text-emerald-400" size={28} />
                            </div>
                            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 tracking-tight">
                                {t('dashboard.quickActions.vocabulary.title') || 'Vocabulary Bank'}
                            </h1>
                        </div>
                        <p className="text-gray-500 dark:text-slate-400 text-lg">
                            {t('dashboard.quickActions.vocabulary.desc') || 'Master your saved professional English terms.'}
                        </p>
                    </div>

                    <div className="flex-shrink-0">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="inline-flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30 shadow-lg shadow-emerald-500/10 dark:shadow-none"
                        >
                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                                <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={20} />
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">Progress</span>
                                <span className="block font-black text-lg leading-none text-emerald-700 dark:text-emerald-400">
                                    {masteredIds.size} <span className="text-sm font-semibold text-gray-500 dark:text-slate-400">Mastered</span>
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-10 group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-500" />
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-emerald-500" size={22} />
                    <input
                        type="text"
                        placeholder="Search for words, definitions, or parts of speech..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white shadow-sm placeholder-gray-400 font-medium"
                    />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-[200px] bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-800 animate-pulse relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </div>
                    ))}
                </div>
            ) : filteredVocab.length > 0 ? (
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredVocab.map((vocab) => {
                        const isMastered = masteredIds.has(vocab.id);
                        return (
                            <motion.div
                                key={vocab.id}
                                variants={{
                                    hidden: { opacity: 0, y: 20, scale: 0.95 },
                                    show: { opacity: 1, y: 0, scale: 1 }
                                }}
                                className={`relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl transition-all duration-300 group border flex flex-col hover:-translate-y-1 ${isMastered
                                    ? 'border-emerald-200 dark:border-emerald-800/50 shadow-emerald-500/10'
                                    : 'border-white dark:border-slate-800 hover:border-emerald-100 dark:hover:border-emerald-900/30'
                                    }`}
                            >
                                {/* Background Highlight */}
                                {isMastered && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-[2rem] pointer-events-none" />
                                )}

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                                            {vocab.term}
                                            <button
                                                onClick={() => playAudio(vocab.term)}
                                                className="p-1.5 opacity-0 group-hover:opacity-100 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl hover:scale-110 hover:bg-emerald-100 transition-all"
                                                title="Pronounce"
                                            >
                                                <Volume2 size={18} />
                                            </button>
                                        </h3>
                                        <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
                                            {vocab.partOfSpeech}
                                        </span>
                                        <span className="text-sm font-medium text-gray-400 dark:text-slate-500 ml-2">
                                            /{vocab.pronunciation}/
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => toggleMastery(vocab.id)}
                                        className={`p-2.5 rounded-full transition-all duration-300 border shadow-sm hover:scale-110 active:scale-95 ${isMastered
                                            ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20'
                                            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-300 dark:text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-800'
                                            }`}
                                        title={isMastered ? "Mark as reviewing" : "Mark as mastered"}
                                    >
                                        <CheckCircle2 size={24} className={`transition-all ${isMastered ? 'fill-emerald-400' : 'fill-transparent'}`} />
                                    </button>
                                </div>

                                <p className="text-gray-700 dark:text-slate-300 text-base leading-relaxed mb-6 flex-1 relative z-10 font-medium">
                                    {vocab.definition}
                                </p>

                                <div className="bg-gray-50/80 dark:bg-slate-800/80 rounded-2xl p-4 text-sm text-gray-600 dark:text-slate-400 italic border border-gray-100 dark:border-slate-700/50 relative z-10 group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors shadow-inner">
                                    <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 not-italic">Example</span>
                                    "{vocab.exampleSentence}"
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-dashed border-gray-300 dark:border-slate-600 p-16 text-center max-w-2xl mx-auto"
                >
                    <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen size={48} className="text-emerald-300 dark:text-slate-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {searchTerm ? 'No matching vocabulary found' : 'Your vocabulary bank is empty'}
                    </h3>
                    <p className="text-gray-500 dark:text-slate-400 text-lg max-w-md mx-auto">
                        {searchTerm ? "Try adjusting your search to discover words you've saved." : "Complete interactive lessons to systematically build and master your professional vocabulary!"}
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default VocabularyPage;
