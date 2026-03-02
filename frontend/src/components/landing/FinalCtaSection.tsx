import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const FinalCtaSection: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-sky-600 rounded-[3rem] p-10 sm:p-16 md:p-20 shadow-2xl shadow-indigo-500/30 overflow-hidden"
                >
                    {/* Inner Decorative Elements */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-sky-300 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="relative mb-8"
                        >
                            <img
                                src="/mascot/waving.png"
                                alt="ForeignLang Mascot Waving"
                                className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-2xl z-10 relative"
                            />
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl -z-10"></div>
                        </motion.div>

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold mb-8">
                            <Sparkles size={16} className="text-amber-300" /> Start optimizing your emails today
                        </div>

                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight max-w-3xl leading-tight">
                            {t('landing.cta.title')}
                        </h2>
                        <p className="text-xl sm:text-2xl text-indigo-100 max-w-2xl font-medium mb-12">
                            {t('landing.cta.subtitle')}
                        </p>

                        <Link
                            to="/register"
                            className="group relative inline-flex items-center justify-center overflow-hidden w-full sm:w-auto px-10 py-5 bg-white text-indigo-700 font-extrabold rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-xl"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-sky-50 to-indigo-50 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out rounded-full z-0"></span>
                            <span className="relative z-10 flex items-center gap-3">
                                {t('landing.cta.button')} <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
                            </span>
                        </Link>

                        <p className="text-indigo-200 mt-8 text-sm md:text-base opacity-80 font-medium">
                            {t('landing.cta.note')}
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCtaSection;
