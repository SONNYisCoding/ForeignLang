import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, Sparkles } from 'lucide-react';

interface RoadmapInputFormProps {
    onSubmit: (input: string) => void;
    isLoading: boolean;
}

const RoadmapInputForm: React.FC<RoadmapInputFormProps> = ({ onSubmit, isLoading }) => {
    const [textInput, setTextInput] = useState('');
    const [fileName, setFileName] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setTextInput(`[Uploaded: ${file.name}] Analyze this document and generate a personalized learning roadmap.`);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setFileName(file.name);
            setTextInput(`[Uploaded: ${file.name}] Analyze this document and generate a personalized learning roadmap.`);
        }
    };

    const clearFile = () => {
        setFileName(null);
        setTextInput('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = () => {
        if (textInput.trim()) {
            onSubmit(textInput);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6 md:p-8"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h2 className="font-bold text-slate-900 dark:text-white text-xl">Generate Your Roadmap</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Upload a CV/JD or describe your learning goals</p>
                </div>
            </div>

            {/* File Upload Zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 mb-6 ${isDragging
                        ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                    }`}
            >
                <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
                {fileName ? (
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                            <FileText size={20} className="text-indigo-600" />
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{fileName}</span>
                        <button onClick={(e) => { e.stopPropagation(); clearFile(); }} className="text-slate-400 hover:text-red-500 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                ) : (
                    <>
                        <Upload size={32} className="mx-auto text-slate-400 mb-3" />
                        <p className="text-slate-600 dark:text-slate-400 font-medium">Drop your CV, JD, or test file here</p>
                        <p className="text-sm text-slate-400 mt-1">PDF, DOCX, or TXT (max 5MB)</p>
                    </>
                )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                <span className="text-sm text-slate-400 font-medium">OR</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
            </div>

            {/* Text Input */}
            <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Describe your learning goals, e.g.:&#10;&#10;I'm a marketing manager who needs to write professional emails to international clients. I struggle with formal tone and business vocabulary..."
                className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm leading-relaxed transition-all"
            />

            {/* Submit */}
            <div className="flex justify-end mt-4">
                <button
                    onClick={handleSubmit}
                    disabled={!textInput.trim() || isLoading}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                    <Sparkles size={18} /> Generate Roadmap
                </button>
            </div>
        </motion.div>
    );
};

export default RoadmapInputForm;
