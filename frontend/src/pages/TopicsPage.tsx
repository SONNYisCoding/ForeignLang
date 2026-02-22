import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Sparkles, Search } from 'lucide-react';
import axios from 'axios';

interface Topic {
    id: string;
    title: string;
    description: string;
    difficultyLevel: string;
    status: string;
    lessons: { id: string }[];
}

const TopicsPage = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<string>('ALL');

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await axios.get('/api/v1/topics/published', { withCredentials: true });
                setTopics(response.data);
            } catch (err) {
                // Fallback to all topics if /published doesn't return results
                try {
                    const fallback = await axios.get('/api/v1/topics', { withCredentials: true });
                    setTopics(fallback.data);
                } catch {
                    console.error('Failed to fetch topics');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTopics();
    }, []);

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'BEGINNER': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'INTERMEDIATE': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'ADVANCED': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'BEGINNER': return '🌱';
            case 'INTERMEDIATE': return '📚';
            case 'ADVANCED': return '🚀';
            default: return '📖';
        }
    };

    const filtered = topics.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.description?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'ALL' || t.difficultyLevel === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <GraduationCap className="text-indigo-600" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Learning Topics</h1>
                </div>
                <p className="text-gray-500">Explore professional English topics and start learning</p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search topics..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    />
                </div>
                <div className="flex gap-2">
                    {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(level => (
                        <button
                            key={level}
                            onClick={() => setFilter(level)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === level
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {level === 'ALL' ? 'All' : level.charAt(0) + level.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Topics Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(topic => (
                        <Link
                            key={topic.id}
                            to={`/dashboard/topics/${topic.id}`}
                            className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-lg transition-all duration-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-2xl">{getLevelIcon(topic.difficultyLevel)}</span>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getLevelColor(topic.difficultyLevel)}`}>
                                    {topic.difficultyLevel}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition mb-2">
                                {topic.title}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                                {topic.description || 'Explore this topic and its lessons'}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                                    <BookOpen size={14} />
                                    {topic.lessons?.length || 0} lessons
                                </span>
                                <span className="flex items-center gap-1 text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition">
                                    <Sparkles size={14} />
                                    Start learning
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
                    <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {search ? 'No topics found' : 'No topics available yet'}
                    </h3>
                    <p className="text-gray-500">
                        {search ? 'Try a different search term' : 'Check back soon for new learning content!'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default TopicsPage;
