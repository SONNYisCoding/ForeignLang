import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
    const { t } = useTranslation();

    const reviews = [
        {
            text: t('landing.testimonials.review1.text'),
            author: t('landing.testimonials.review1.author'),
            role: t('landing.testimonials.review1.role'),
            initial: "S",
            color: "from-blue-500 to-indigo-600",
            delay: 0.1
        },
        {
            text: t('landing.testimonials.review2.text'),
            author: t('landing.testimonials.review2.author'),
            role: t('landing.testimonials.review2.role'),
            initial: "D",
            color: "from-indigo-500 to-purple-600",
            delay: 0.2
        },
        {
            text: t('landing.testimonials.review3.text'),
            author: t('landing.testimonials.review3.author'),
            role: t('landing.testimonials.review3.role'),
            initial: "M",
            color: "from-purple-500 to-pink-600",
            delay: 0.3
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 md:mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
                    >
                        {t('landing.testimonials.title')}
                    </motion.h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        {t('landing.testimonials.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: review.delay, duration: 0.5 }}
                            whileHover={{ y: -8 }}
                            className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative group transition-all duration-300 flex flex-col justify-between"
                        >
                            {/* Decorative Quote Mark */}
                            <div className="absolute top-6 right-8 text-8xl font-serif text-slate-50 select-none pointer-events-none group-hover:text-indigo-50 transition-colors duration-500">
                                "
                            </div>

                            <div className="relative z-10 mb-8">
                                <div className="flex items-center gap-1 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} size={18} className="fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-lg text-slate-700 leading-relaxed font-medium">
                                    "{review.text}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4 relative z-10 border-t border-slate-100 pt-6 mt-auto">
                                <div className={`w-14 h-14 bg-gradient-to-br ${review.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg -rotate-3 group-hover:rotate-0 transition-transform`}>
                                    {review.initial}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-lg">{review.author}</p>
                                    <p className="text-sm text-slate-500 font-medium">{review.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
