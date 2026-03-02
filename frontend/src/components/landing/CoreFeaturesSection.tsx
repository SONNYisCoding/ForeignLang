import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles, BookOpen, Trophy, ArrowRight, Zap, Target } from 'lucide-react';

interface CoreFeaturesSectionProps {
    onFeatureClick: () => void;
}

const CoreFeaturesSection: React.FC<CoreFeaturesSectionProps> = ({ onFeatureClick }) => {
    const { t } = useTranslation();

    return (
        <section id="features" className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold mb-6"
                    >
                        <Zap size={16} className="fill-indigo-600" /> Premium Features
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
                    >
                        {t('landing.features.title')}
                    </motion.h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        {t('landing.features.subtitle')}
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

                    {/* Feature 1: Large Span (AI Email Gen) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -8 }}
                        transition={{ duration: 0.5 }}
                        className="md:col-span-2 relative bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-8 md:p-12 overflow-hidden group cursor-pointer shadow-2xl shadow-indigo-900/20"
                        onClick={onFeatureClick}
                    >
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-indigo-500/30 transition-colors duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-8 border border-white/20 shadow-inner">
                                    <Sparkles size={32} className="text-indigo-300" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4 leading-tight">{t('landing.features.emailGen.title')}</h3>
                                <p className="text-xl text-indigo-100/80 max-w-md mb-8 leading-relaxed">
                                    {t('landing.features.emailGen.desc')}
                                </p>
                            </div>
                            <div className="flex items-center text-white font-bold gap-2 group-hover:gap-4 transition-all">
                                {t('landing.features.emailGen.click')} <ArrowRight size={20} className="text-indigo-400 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature 2: Templates */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        whileHover={{ y: -8 }}
                        className="relative bg-sky-50 rounded-[2rem] p-8 md:p-10 overflow-hidden group cursor-pointer border border-sky-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between"
                        onClick={onFeatureClick}
                    >
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-sky-600 mb-6 shadow-md shadow-sky-200/50">
                                <BookOpen size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('landing.features.templates.title')}</h3>
                            <p className="text-slate-600 mb-8 leading-relaxed">
                                {t('landing.features.templates.desc')}
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-bold text-sky-600 shadow-sm border border-sky-100 w-max group-hover:bg-sky-600 group-hover:text-white transition-colors">
                            <Target size={16} /> Coming Soon
                        </div>
                    </motion.div>

                    {/* Feature 3: Progress Tracking */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        whileHover={{ y: -8 }}
                        className="md:col-span-3 lg:col-span-3 relative bg-gradient-to-r from-emerald-50 to-teal-50 rounded-[2rem] p-8 md:p-12 overflow-hidden group cursor-pointer border border-emerald-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-8 md:gap-16"
                        onClick={onFeatureClick}
                    >
                        <div className="flex-1 relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-bold text-emerald-600 shadow-sm border border-emerald-100 mb-6">
                                Gamification Tracker
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">{t('landing.features.tracking.title')}</h3>
                            <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
                                {t('landing.features.tracking.desc')}
                            </p>
                            <div className="flex items-center text-emerald-600 font-bold gap-2 group-hover:gap-4 transition-all w-max border-b-2 border-transparent group-hover:border-emerald-600 pb-1">
                                Coming Soon <ArrowRight size={20} />
                            </div>
                        </div>

                        {/* Visual element for Progress */}
                        <div className="w-full md:w-1/3 relative z-10 flex justify-center">
                            <div className="w-48 h-48 bg-white rounded-full shadow-2xl shadow-emerald-200/50 border-8 border-emerald-100 flex items-center justify-center relative">
                                <Trophy size={64} className="text-emerald-500" />
                                {/* Decorative orbit */}
                                <div className="absolute inset-0 border-2 border-emerald-400 rounded-full scale-110 opacity-20 border-dashed animate-[spin_10s_linear_infinite]"></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CoreFeaturesSection;
