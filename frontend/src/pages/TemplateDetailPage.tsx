import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Lock, Unlock, Copy, Check, Shield, FileText, Zap, Share2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useCredits } from '../contexts/CreditContext';
import { useAuth } from '../contexts/AuthContext';

/* ═══ Types ═══ */
interface TemplateField { name: string; placeholder: string; }
interface ParsedTemplate {
    lockedPreview: string;
    unlockedForm: { fields: TemplateField[]; templateBody: string; };
}
interface Template {
    id: string; name: string; structure: string;
    topic?: { title: string; };
}

const UNLOCKED_KEY = 'foreignlang_unlocked_templates';
const loadUnlocked = (): Set<string> => {
    try { return new Set(JSON.parse(localStorage.getItem(UNLOCKED_KEY) || '[]')); }
    catch { return new Set(); }
};
const saveUnlocked = (ids: Set<string>) => localStorage.setItem(UNLOCKED_KEY, JSON.stringify([...ids]));

/* ═══ Auto-parse plain text templates into form format ═══ */
const autoParseTemplate = (structure: string): ParsedTemplate => {
    // Extract all [placeholder] patterns from the text
    const bracketRegex = /\[([^\]]+)\]/g;
    const matches = [...structure.matchAll(bracketRegex)];
    const uniqueFields = [...new Map(matches.map(m => [m[1], m[1]])).values()];

    // Build fields array
    const fields: TemplateField[] = uniqueFields.map(name => ({
        name: name.replace(/\s+/g, '_'),
        placeholder: name
    }));

    // Build templateBody: replace [placeholder] with {{placeholder_name}}
    let templateBody = structure;
    for (const name of uniqueFields) {
        const safeName = name.replace(/\s+/g, '_');
        templateBody = templateBody.replace(new RegExp(`\\[${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]`, 'g'), `{{${safeName}}}`);
    }

    // Locked preview: first ~150 chars
    const preview = structure.substring(0, 150) + (structure.length > 150 ? '...' : '');

    return { lockedPreview: preview, unlockedForm: { fields, templateBody } };
};

/* ═══ Parse template: JSON first, fallback to auto-parse ═══ */
const parseTemplate = (structure: string): ParsedTemplate => {
    try {
        const p = JSON.parse(structure);
        if (p.lockedPreview && p.unlockedForm) return p;
    } catch { /* Not JSON — auto-parse below */ }
    return autoParseTemplate(structure);
};

/* ═══ Component ═══ */
const TemplateDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { credits, deductCredit, refreshCredits } = useCredits();
    const { user } = useAuth();
    const isPremium = user?.isPremium;

    const [template, setTemplate] = useState<Template | null>(null);
    const [loading, setLoading] = useState(true);
    const [unlockedIds, setUnlockedIds] = useState<Set<string>>(loadUnlocked);
    const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
    const [copied, setCopied] = useState(false);

    // ── Fetch template ──
    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
                const res = await fetch('/api/v1/templates', { headers });
                if (res.ok) {
                    const data: Template[] = await res.json();
                    const found = data.find(t => t.id === id);
                    if (found) setTemplate(found);
                    else toast.error('Template not found');
                }
            } catch { toast.error('Failed to load template'); }
            finally { setLoading(false); }
        };
        fetchTemplate();
    }, [id]);

    // ── Block keyboard shortcuts ──
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'F12') { e.preventDefault(); return; }
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) { e.preventDefault(); return; }
            if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) { e.preventDefault(); return; }
            if (e.ctrlKey && (e.key === 'S' || e.key === 's')) { e.preventDefault(); return; }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    // ── Parse template structure (all templates get form treatment) ──
    const parsed: ParsedTemplate | null = template ? parseTemplate(template.structure) : null;
    const isUnlocked = id ? unlockedIds.has(id) : false;

    // ── Unlock handler ──
    const handleUnlock = useCallback(async () => {
        if (!id) return;
        if (!isPremium && credits !== null && credits <= 0) {
            toast.error('No credits left! Use the ⚡ button in the navbar to get more.');
            return;
        }

        // ═══ Server-side credit deduction (matching EmailGeneratorPage) ═══
        if (!isPremium) {
            try {
                const res = await fetch('/api/v1/quota/consume', {
                    method: 'POST',
                    credentials: 'include',
                });
                if (!res.ok) {
                    toast.error('Failed to deduct credit. Please try again.');
                    return;
                }
            } catch {
                toast.error('Network error. Please try again.');
                return;
            }
            deductCredit();
        }

        const updated = new Set(unlockedIds);
        updated.add(id);
        setUnlockedIds(updated);
        saveUnlocked(updated);
        setFieldValues({});
        toast.success(isPremium ? 'Template access granted!' : 'Template unlocked! Fill in the fields to generate your email.');
        refreshCredits();
    }, [id, credits, isPremium, deductCredit, refreshCredits, unlockedIds]);

    // ── Live preview renderer ──
    const renderLivePreview = useCallback((templateBody: string, values: Record<string, string>): string => {
        let result = templateBody;
        for (const [key, val] of Object.entries(values)) {
            result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val || `[${key}]`);
        }
        result = result.replace(/\{\{(\w+)\}\}/g, '[$1]');
        result = result.replace(/\\n/g, '\n');
        return result;
    }, []);

    const handleCopy = useCallback((text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    }, []);

    const handleShare = useCallback(() => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied! Share this template with others.');
    }, []);

    // ── Loading ──
    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse mb-4" />
                <div className="h-64 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
            </div>
        );
    }

    if (!template || !parsed) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Template Not Found</h2>
                <button onClick={() => navigate('/dashboard/templates')} className="text-pink-600 font-medium hover:underline">← Back to templates</button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate('/dashboard/templates')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ChevronLeft size={22} className="text-gray-500 dark:text-slate-400" />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{template.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        {template.topic && (
                            <span className="text-xs font-medium px-2 py-0.5 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full">{template.topic.title}</span>
                        )}
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${isUnlocked
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
                            }`}>
                            {isUnlocked ? <><Unlock size={10} /> Unlocked</> : <><Lock size={10} /> Locked</>}
                        </span>
                    </div>
                </div>
            </div>

            {/* ═══ TEMPLATE CONTENT ═══ */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                {!isUnlocked ? (
                    /* ══════════════════════════════ */
                    /* ── LOCKED STATE (Protected) ── */
                    /* ══════════════════════════════ */
                    <div>
                        <div
                            className="p-6 pb-0 relative select-none"
                            onContextMenu={(e) => e.preventDefault()}
                            onCopy={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                            style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
                        >
                            <div className="flex items-center gap-2 mb-4 text-sm text-amber-600 dark:text-amber-400">
                                <Shield size={14} />
                                <span className="font-semibold">Content protected — Unlock to access</span>
                            </div>
                            <div className="relative bg-gray-50 dark:bg-slate-900/50 rounded-xl p-6 font-mono text-sm text-gray-600 dark:text-slate-300 leading-relaxed overflow-hidden">
                                <p className="whitespace-pre-wrap">{parsed.lockedPreview}</p>
                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-slate-900/50 via-gray-50/90 dark:via-slate-900/45 to-transparent pointer-events-none" />
                            </div>
                        </div>
                        <div className="p-6">
                            <button
                                onClick={handleUnlock}
                                className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 text-lg group"
                            >
                                <Lock size={20} className="group-hover:hidden" />
                                <Unlock size={20} className="hidden group-hover:block" />
                                {isPremium ? "Use Template" : "Unlock to Fill & Copy"}
                                {!isPremium && <span className="text-pink-200 text-sm font-medium">(-1 Credit)</span>}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ══════════════════════════════════════════ */
                    /* ── UNLOCKED STATE: Interactive Mad Libs ── */
                    /* ══════════════════════════════════════════ */
                    <div className="divide-y divide-gray-100 dark:divide-slate-700">
                        {/* ── TOP HALF: Input Fields ── */}
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Zap size={16} className="text-pink-500" />
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Fill in the details</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {parsed.unlockedForm.fields.map((field) => (
                                    <div key={field.name} className="group">
                                        <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-pink-600 dark:group-focus-within:text-pink-400 transition-colors">
                                            {field.placeholder}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={`Enter ${field.placeholder.toLowerCase()}...`}
                                            value={fieldValues[field.name] || ''}
                                            onChange={(e) => setFieldValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border-2 border-gray-200 dark:border-slate-600 rounded-xl text-sm focus:ring-0 focus:border-pink-500 dark:focus:border-pink-500 outline-none transition-all dark:text-white font-medium placeholder-gray-300 dark:placeholder-slate-600"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── BOTTOM HALF: Live Preview ── */}
                        <div className="p-6 bg-gray-50/50 dark:bg-slate-900/30">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">📧 Live Preview</h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleShare}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-bold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors active:scale-95"
                                        title="Share Template"
                                    >
                                        <Share2 size={14} /> Share
                                    </button>
                                    <button
                                        onClick={() => handleCopy(renderLivePreview(parsed.unlockedForm.templateBody, fieldValues))}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-xl hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors active:scale-95"
                                    >
                                        {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Email</>}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 shadow-inner">
                                <div className="font-mono text-sm text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {renderLivePreview(parsed.unlockedForm.templateBody, fieldValues).split('\n').map((line, i) => (
                                        <span key={i}>
                                            {line.split(/(\[[\w_]+\])/).map((segment, j) => {
                                                if (/^\[[\w_]+\]$/.test(segment)) {
                                                    return (
                                                        <span key={j} className="inline-block px-1.5 py-0.5 mx-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded font-bold text-xs align-middle animate-pulse">
                                                            {segment}
                                                        </span>
                                                    );
                                                }
                                                return <span key={j}>{segment}</span>;
                                            })}
                                            {i < renderLivePreview(parsed.unlockedForm.templateBody, fieldValues).split('\n').length - 1 && '\n'}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-3 text-center italic">
                                Type in the fields above — your text replaces the highlighted placeholders in real-time
                            </p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default TemplateDetailPage;
