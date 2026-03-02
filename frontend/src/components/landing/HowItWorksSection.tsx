import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MailPlus, PenTool, Send } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
    const { t } = useTranslation();

    const steps = [
        {
            num: "01",
            title: t('landing.howItWorks.step1.title'),
            desc: t('landing.howItWorks.step1.desc'),
            icon: PenTool,
            color: "from-blue-500 to-indigo-600",
            shadow: "shadow-blue-200/50"
        },
        {
            num: "02",
            title: t('landing.howItWorks.step2.title'),
            desc: t('landing.howItWorks.step2.desc'),
            icon: MailPlus,
            color: "from-indigo-500 to-purple-600",
            shadow: "shadow-indigo-200/50"
        },
        {
            num: "03",
            title: t('landing.howItWorks.step3.title'),
            desc: t('landing.howItWorks.step3.desc'),
            icon: Send,
            color: "from-purple-500 to-pink-600",
            shadow: "shadow-purple-200/50"
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
                    >
                        {t('landing.howItWorks.title')}
                    </motion.h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        {t('landing.howItWorks.subtitle')}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
                    {/* Desktop Connecting Line */}
                    <div className="hidden lg:block absolute top-[2.5rem] left-[15%] right-[15%] h-1 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 rounded-full z-0"></div>

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            className="flex-1 relative z-10"
                        >
                            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col group">
                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} ${step.shadow} shadow-lg flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-300`}>
                                    <step.icon size={36} className="stroke-[1.5px]" />
                                </div>
                                <h3 className="text-8xl font-black text-slate-50 absolute top-6 right-6 select-none z-0 transition-colors group-hover:text-slate-100">{step.num}</h3>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                                    <p className="text-slate-600 text-lg leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
