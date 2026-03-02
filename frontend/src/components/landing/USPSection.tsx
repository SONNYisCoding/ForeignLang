import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Bot, GraduationCap, Briefcase } from 'lucide-react';

const USPSection: React.FC = () => {
    const { t } = useTranslation();

    const usps = [
        {
            title: t('landing.usp.cards.ai.title').replace('🤖', '').trim(),
            desc: t('landing.usp.cards.ai.desc'),
            highlight: t('landing.usp.cards.ai.highlight'),
            icon: Bot,
            gradient: "from-blue-500 to-indigo-600",
            glow: "group-hover:shadow-blue-500/30"
        },
        {
            title: t('landing.usp.cards.learn.title').replace('📚', '').trim(),
            desc: t('landing.usp.cards.learn.desc'),
            highlight: t('landing.usp.cards.learn.highlight'),
            icon: GraduationCap,
            gradient: "from-emerald-400 to-teal-600",
            glow: "group-hover:shadow-emerald-500/30"
        },
        {
            title: t('landing.usp.cards.business.title').replace('💼', '').trim(),
            desc: t('landing.usp.cards.business.desc'),
            highlight: t('landing.usp.cards.business.highlight'),
            icon: Briefcase,
            gradient: "from-orange-400 to-rose-500",
            glow: "group-hover:shadow-rose-500/30"
        }
    ];

    return (
        <section className="py-24 bg-white relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
                    >
                        {t('landing.usp.title')}
                    </motion.h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        {t('landing.usp.subtitle')}
                    </p>
                </div>

                {/* USP Cards Container */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4 md:px-0 relative">
                    {/* Decorative backdrop blobs */}
                    <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -translate-y-1/2 -z-10 transition-transform"></div>
                    <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-teal-100/50 rounded-full blur-3xl -translate-y-1/2 -z-10 transition-transform"></div>

                    {usps.map((usp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.5 }}
                            whileHover={{ y: -10 }}
                            className={`relative bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-xl border border-slate-100/50 transition-all duration-300 group flex flex-col items-center text-center ${usp.glow}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 opacity-100 rounded-[2.5rem] -z-10"></div>

                            {/* Icon Placeholder */}
                            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${usp.gradient} flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <usp.icon size={36} className="stroke-[1.5px]" />
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-4">{usp.title}</h3>
                            <p className="text-slate-600 mb-8 flex-grow text-lg leading-relaxed">{usp.desc}</p>

                            <div className="inline-block px-5 py-2 bg-slate-50 text-slate-700 text-sm font-bold rounded-full border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                                {usp.highlight}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default USPSection;
