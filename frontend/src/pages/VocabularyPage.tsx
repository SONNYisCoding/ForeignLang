import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Volume2, ChevronLeft } from 'lucide-react';
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
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchVocab = async () => {
            try {
                // Fetch all by using search with empty term or a dedicated all endpoint
                // For MVP, using search with empty string usually returns all or we can fetch by topics
                const res = await fetch('/api/v1/vocabulary/search?term=', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setVocabList(data);
                }
            } catch (error) {
                console.error('Failed to fetch vocabulary', error);
                toast.error('Failed to load vocabulary');
            } finally {
                setLoading(false);
            }
        };

        fetchVocab();
    }, []);

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
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ChevronLeft size={24} className="text-gray-600 dark:text-slate-300" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="text-emerald-500" />
                        {t('dashboard.quickActions.vocabulary.title') || 'Vocabulary Bank'}
                    </h1>
                    <p className="text-gray-500 dark:text-slate-400">
                        {t('dashboard.quickActions.vocabulary.desc') || 'Expand your word power'}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search words..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-40 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVocab.map((vocab, index) => (
                        <motion.div
                            key={vocab.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        {vocab.term}
                                        <button
                                            onClick={() => playAudio(vocab.term)}
                                            className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full hover:scale-110 transition-transform"
                                        >
                                            <Volume2 size={16} />
                                        </button>
                                    </h3>
                                    <span className="text-sm text-gray-500 dark:text-slate-400 italic">
                                        {vocab.partOfSpeech} • {vocab.pronunciation}
                                    </span>
                                </div>
                                {vocab.topic && (
                                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-full">
                                        {vocab.topic.title}
                                    </span>
                                )}
                            </div>

                            <p className="text-gray-700 dark:text-slate-300 font-medium mb-2">
                                {vocab.definition}
                            </p>

                            <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3 text-sm text-gray-600 dark:text-slate-400 italic border-l-2 border-emerald-500">
                                "{vocab.exampleSentence}"
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VocabularyPage;
