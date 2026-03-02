import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import TypewriterEffect from '../ui/TypewriterEffect';
import UiverseButton from '../ui/UiverseButton';
import AnimatedStatCard from '../ui/AnimatedStatCard';

const HeroSection: React.FC = () => {
    const { t } = useTranslation();

    const heroTitle = t('landing.hero.title');
    const heroHighlight = t('landing.hero.titleHighlight');
    const firstPartDelay = heroTitle.length * 50; // 50ms per char

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <section className="w-full bg-slate-50 py-16 md:py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Text Content */}
                    <motion.article
                        {...fadeInUp}
                        className="flex flex-col items-start text-left space-y-6"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-[4.5rem] font-black text-slate-900 leading-[1.15] tracking-tight min-h-[180px] sm:min-h-[140px] max-w-[800px]">
                            <TypewriterEffect text={heroTitle + " "} hideCursorOnComplete={true} />
                            <TypewriterEffect
                                text={heroHighlight}
                                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
                                startDelay={firstPartDelay + 300}
                                cursorColor="bg-blue-600"
                            />
                        </h1>

                        <p className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-xl leading-relaxed mt-2 mb-4">
                            {t('landing.hero.subtitle')}
                        </p>

                        {/* Call To Action Container */}
                        <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <UiverseButton onClick={() => window.location.href = '/register'}>
                                {t('landing.hero.ctaPrimary')} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </UiverseButton>
                        </div>
                    </motion.article>

                    {/* Right Column: Hero Image & Stats */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative flex flex-col items-center"
                    >
                        {/* Main Illustration Placeholder (Owl with laptop) */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="w-full max-w-md aspect-square relative flex items-center justify-center mb-8"
                        >
                            <img
                                src="/mascot/hero.png"
                                alt="ForeignLang Owl Mascot"
                                className="w-64 h-64 sm:w-80 sm:h-80 drop-shadow-2xl object-contain z-10"
                            />
                            {/* Decorative background blob */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
                        </motion.div>

                        {/* Stats Cards Container */}
                        <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-3 gap-0 absolute -bottom-10 md:-bottom-16 bg-white rounded-2xl shadow-xl z-20 border border-slate-100 overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                            {/* Stat 1 */}
                            <AnimatedStatCard
                                value={t('landing.hero.stats.emails')}
                                label={t('landing.hero.stats.emailsLabel')}
                            />

                            {/* Stat 2 */}
                            <AnimatedStatCard
                                value={t('landing.hero.stats.users')}
                                label={t('landing.hero.stats.usersLabel')}
                            />

                            {/* Stat 3 */}
                            <AnimatedStatCard
                                value={
                                    <span className="flex items-center justify-center gap-1">
                                        {t('landing.hero.stats.rating')} <span className="text-yellow-400 text-2xl group-hover:scale-125 transition-transform duration-300 drop-shadow-sm">★</span>
                                    </span>
                                }
                                label={t('landing.hero.stats.ratingLabel')}
                            />
                        </div>

                    </motion.div>
                </div>
            </div>
            {/* Adding extra padding at the bottom to account for the absolutely positioned stats cards */}
            <div className="h-16 md:h-24"></div>
        </section>
    );
};

export default HeroSection;
