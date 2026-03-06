import { useState, useEffect } from 'react';
import { Search, X, BookOpen, Users, LayoutDashboard, Sparkles, Command, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import UiverseLoader from './ui/UiverseLoader';

interface SearchResultItem {
    id: string;
    title: string;
    type: string;
    path: string;
}

interface SearchResponse {
    teachers: SearchResultItem[];
    courses: SearchResultItem[];
    features: SearchResultItem[];
    templates: SearchResultItem[];
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResultItem[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Debounce query
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim()) {
                performSearch(query);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    const performSearch = async (searchTerm: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/v1/search?query=${encodeURIComponent(searchTerm)}`);
            if (response.ok) {
                const data: SearchResponse = await response.json();

                const formattedResults: SearchResultItem[] = [
                    ...data.features.map(item => ({ ...item, icon: getIconForType(item.type) })),
                    ...data.courses.map(item => ({ ...item, icon: getIconForType(item.type) })),
                    ...data.templates.map(item => ({ ...item, icon: getIconForType(item.type) })),
                    ...data.teachers.map(item => ({ ...item, icon: getIconForType(item.type) }))
                ];
                setResults(formattedResults);
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'Teacher': return Users;
            case 'Course': return BookOpen;
            case 'Feature': return Sparkles;
            case 'Template': return FileText;
            case 'Navigation': return LayoutDashboard;
            default: return Search;
        }
    };

    const DynamicIcon = ({ type, className }: { type: string, className?: string }) => {
        const IconComponent = getIconForType(type);
        return <IconComponent size={18} className={className} />;
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
            }
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleNavigate = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[70vh]"
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search courses, teachers, templates..."
                                className="flex-1 text-lg bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                                {loading && <div className="scale-50 mr-2"><UiverseLoader /></div>}
                                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-xs text-gray-400 font-sans">
                                    <span className="text-xs">ESC</span>
                                </kbd>
                                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="flex-1 overflow-y-auto p-2">
                            {query === '' ? (
                                <div className="p-8 text-center text-gray-400">
                                    <Command className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>Type to search...</p>
                                </div>
                            ) : results.length === 0 && !loading ? (
                                <div className="p-8 text-center text-gray-400">
                                    <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No results found for "{query}"</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {results.map((item) => (
                                        <button
                                            key={item.id + item.type}
                                            onClick={() => handleNavigate(item.path)}
                                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors group text-left"
                                        >
                                            <div className={`p-2 rounded-lg 
                                                ${item.type === 'Course' ? 'bg-blue-50 text-blue-600' : ''}
                                                ${item.type === 'Feature' ? 'bg-purple-50 text-purple-600' : ''}
                                                ${item.type === 'Teacher' ? 'bg-green-50 text-green-600' : ''}
                                                ${item.type === 'Template' ? 'bg-orange-50 text-orange-600' : ''}
                                                ${item.type === 'Navigation' ? 'bg-gray-100 text-gray-600' : ''}
                                            `}>
                                                <DynamicIcon type={item.type} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                                                    {item.title}
                                                </h4>
                                                <p className="text-xs text-gray-400 capitalize">{item.type}</p>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Command size={14} className="text-gray-300" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SearchModal;
