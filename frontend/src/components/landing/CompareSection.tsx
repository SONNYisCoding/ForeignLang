import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react';

const CompareSection: React.FC = () => {
    const { t } = useTranslation();

    const features = [
        { key: 'aiGen', name: t('landing.usp.comparison.aiGen'), others: true, foreignlang: true },
        { key: 'learning', name: t('landing.usp.comparison.learning'), others: false, foreignlang: true },
        { key: 'templates', name: t('landing.usp.comparison.templates'), others: false, foreignlang: true },
        { key: 'businessFocus', name: t('landing.usp.comparison.businessFocus'), others: 'partial', foreignlang: true },
    ];

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-extrabold text-slate-900 mb-4"
                    >
                        {t('landing.usp.comparison.title')}
                    </motion.h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        See why professionals are switching from generic AI tools to a specialized platform.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-6 md:p-10 border border-slate-100"
                >
                    {/* Header Row */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="col-span-1 border-b-2 border-slate-100 pb-4">
                            <h3 className="text-lg md:text-xl font-bold text-slate-700">{t('landing.usp.comparison.feature')}</h3>
                        </div>
                        <div className="col-span-1 border-b-2 border-slate-100 pb-4 text-center">
                            <h3 className="text-lg md:text-xl font-bold text-slate-400">Other AI Tools</h3>
                            <p className="text-xs text-slate-400 mt-1">(ChatGPT, Grammarly)</p>
                        </div>
                        <div className="col-span-1 rounded-t-2xl bg-gradient-to-t from-indigo-50/50 to-indigo-100 pb-4 pt-6 -mt-6 text-center border-b-2 border-indigo-200 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-md">
                                Recommended
                            </div>
                            <h3 className="text-lg md:text-xl font-extrabold text-indigo-700 flex flex-col items-center gap-1">
                                <img src="/mascot/logofl.png" alt="FL" className="w-8 h-8 rounded-lg shadow-sm" />
                                {t('landing.usp.comparison.foreignlang')}
                            </h3>
                        </div>
                    </div>

                    {/* Features Rows */}
                    <div className="space-y-4">
                        {features.map((feat, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 items-center group">
                                <div className="col-span-1 py-4 text-sm md:text-base font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                                    {feat.name}
                                </div>
                                <div className="col-span-1 py-4 flex justify-center items-center">
                                    {feat.others === true ? (
                                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"><Check size={18} /></div>
                                    ) : feat.others === 'partial' ? (
                                        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center font-bold">~</div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center"><X size={18} /></div>
                                    )}
                                </div>
                                <div className="col-span-1 py-4 bg-indigo-50/30 group-hover:bg-indigo-50/80 transition-colors flex justify-center items-center rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-md shadow-indigo-200 flex items-center justify-center">
                                        <Check size={22} className="stroke-[3px]" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer decoration for highlighted column */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="col-span-2"></div>
                        <div className="col-span-1 h-8 bg-gradient-to-b from-indigo-50/30 to-transparent rounded-b-2xl"></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CompareSection;
