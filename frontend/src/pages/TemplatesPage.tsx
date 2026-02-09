import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Copy, Check, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface Template {
    id: string;
    name: string;
    structure: string;
    topic?: {
        title: string;
    };
}

const TemplatesPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await fetch('/api/v1/templates', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setTemplates(data);
                }
            } catch (error) {
                console.error('Failed to fetch templates', error);
                toast.error('Failed to load templates');
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success(t('common.copied') || 'Copied to clipboard');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredTemplates = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.structure.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.topic?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <FileText className="text-pink-500" />
                        {t('dashboard.quickActions.templates.title') || 'Email Templates'}
                    </h1>
                    <p className="text-gray-500 dark:text-slate-400">
                        {t('dashboard.quickActions.templates.desc') || 'Ready-to-use templates for any situation'}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-pink-500 outline-none transition-all dark:text-white"
                />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-48 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTemplates.map((template, index) => (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                                        {template.name}
                                    </h3>
                                    {template.topic && (
                                        <span className="text-xs font-medium px-2 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full">
                                            {template.topic.title}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleCopy(template.structure, template.id)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-gray-500 dark:text-slate-400"
                                    title="Copy to clipboard"
                                >
                                    {copiedId === template.id ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                </button>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-4 font-mono text-sm text-gray-600 dark:text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                                {template.structure}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TemplatesPage;
