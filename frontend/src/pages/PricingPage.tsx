import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowLeft, Zap, BookOpen, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PricingPage = () => {
    const { t } = useTranslation();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        fetch('/api/v1/user/me', { credentials: 'include' })
            .then(res => setIsAuthenticated(res.ok))
            .catch(() => setIsAuthenticated(false));
    }, []);

    // Learning Plans (FLPro) - Using i18n
    const learningPlans = [
        {
            id: 'flpro-monthly',
            name: t('pricing.plans.flproMonthly.name'),
            price: t('pricing.plans.flproMonthly.price'),
            period: t('pricing.plans.flproMonthly.period'),
            description: t('pricing.plans.flproMonthly.desc'),
            features: [
                t('pricing.features.fullLearningPath'),
                t('pricing.features.unlimitedTemplates'),
                t('pricing.features.bonus5Credits'),
                t('pricing.features.prioritySupport')
            ],
            bonus: t('pricing.plans.flproMonthly.bonus'),
            recommended: true,
            link: isAuthenticated ? '/upgrade?plan=flpro-monthly' : '/register?plan=flpro-monthly'
        },
        {
            id: 'flpro-quarterly',
            name: t('pricing.plans.flproQuarterly.name'),
            price: t('pricing.plans.flproQuarterly.price'),
            period: t('pricing.plans.flproQuarterly.period'),
            description: t('pricing.plans.flproQuarterly.desc'),
            features: [
                t('pricing.features.allFlproMonthly'),
                t('pricing.features.bonus20Credits'),
                t('pricing.features.save8k'),
                t('pricing.features.earlyAccess')
            ],
            bonus: t('pricing.plans.flproQuarterly.bonus'),
            recommended: false,
            link: isAuthenticated ? '/upgrade?plan=flpro-quarterly' : '/register?plan=flpro-quarterly'
        }
    ];

    // AI Credits Packs (for Generators)
    const creditPacks = [
        {
            id: 'free-ads',
            name: t('pricing.plans.freeAds.name'),
            price: t('pricing.plans.freeAds.price'),
            description: t('pricing.plans.freeAds.desc'),
            features: [
                t('pricing.features.1CreditPerAd'),
                t('pricing.features.unlimitedAds'),
                t('pricing.features.supportDev')
            ],
            link: isAuthenticated ? '/dashboard/generator' : '/register'
        },
        {
            id: 'credits-5',
            name: t('pricing.plans.credits5.name'),
            price: t('pricing.plans.credits5.price'),
            description: t('pricing.plans.credits5.desc'),
            features: [
                t('pricing.features.5Credits'),
                t('pricing.features.neverExpires'),
                t('pricing.features.useAnytime')
            ],
            link: isAuthenticated ? '/upgrade?pack=credits-5' : '/register?pack=credits-5'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <Link
                        to={isAuthenticated ? '/dashboard' : '/'}
                        className="inline-flex items-center gap-2 mb-6 text-indigo-600 font-semibold hover:underline"
                    >
                        <ArrowLeft size={20} />
                        {isAuthenticated ? t('pricing.backToDashboard') : t('pricing.back')}
                    </Link>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                    >
                        {t('pricing.title')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-500 max-w-2xl mx-auto"
                    >
                        {t('pricing.subtitle')}
                    </motion.p>
                </div>

                {/* Two Personas Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Learners Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <BookOpen className="text-indigo-600" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{t('pricing.forLearners')}</h2>
                                <p className="text-gray-500">{t('pricing.forLearnersDesc')}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {learningPlans.map((plan, index) => (
                                <motion.div
                                    key={plan.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                    className={`rounded-2xl p-6 border-2 relative cursor-pointer ${plan.recommended
                                        ? 'border-indigo-600 bg-white shadow-xl'
                                        : 'border-gray-200 bg-white hover:border-indigo-300 transition-all'
                                        }`}
                                >
                                    {plan.recommended && (
                                        <div className="absolute -top-3 left-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                            <Star size={10} fill="currentColor" /> {t('pricing.recommended')}
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                            <p className="text-sm text-gray-500">{plan.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-extrabold text-indigo-600">
                                                {plan.price}
                                            </div>
                                            <span className="text-sm text-gray-400">{plan.period}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4 text-sm bg-yellow-50 px-3 py-2 rounded-lg">
                                        <Sparkles size={16} className="text-yellow-500" />
                                        <span className="font-semibold text-yellow-700">{plan.bonus}</span>
                                    </div>

                                    <ul className="space-y-2 mb-4">
                                        {plan.features.map((feature, i) => (
                                            <motion.li
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 + i * 0.05 }}
                                                className="flex items-center gap-2 text-sm text-gray-600"
                                            >
                                                <Check size={16} className="text-green-500" />
                                                {feature}
                                            </motion.li>
                                        ))}
                                    </ul>

                                    <Link
                                        to={plan.link}
                                        className={`w-full block text-center py-3 rounded-xl font-bold transition-all ${plan.recommended
                                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200'
                                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                                            }`}
                                    >
                                        {t('pricing.signUp')}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Generators Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Zap className="text-sky-600" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{t('pricing.forGenerators')}</h2>
                                <p className="text-gray-500">{t('pricing.forGeneratorsDesc')}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {creditPacks.map((pack, index) => (
                                <motion.div
                                    key={pack.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                    className="rounded-2xl p-6 border-2 border-gray-200 bg-white hover:border-sky-300 transition-all cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{pack.name}</h3>
                                            <p className="text-sm text-gray-500">{pack.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-extrabold text-sky-600">
                                                {pack.price}
                                            </div>
                                        </div>
                                    </div>

                                    <ul className="space-y-2 mb-4">
                                        {pack.features.map((feature, i) => (
                                            <motion.li
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + i * 0.05 }}
                                                className="flex items-center gap-2 text-sm text-gray-600"
                                            >
                                                <Check size={16} className="text-purple-500" />
                                                {feature}
                                            </motion.li>
                                        ))}
                                    </ul>

                                    <Link
                                        to={pack.link}
                                        className="w-full block text-center py-3 rounded-xl font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 transition-all"
                                    >
                                        {pack.id === 'free-ads' ? t('pricing.startWatching') : t('pricing.buyNow')}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Trust Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center py-8 border-t border-gray-100"
                >
                    <p className="text-gray-500 text-sm">
                        {t('pricing.paymentSecure')}
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default PricingPage;
