import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Header */}
            <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 text-center">
                <Link to="/" className="inline-block mb-8 text-indigo-600 font-semibold hover:underline">{t('about.back')}</Link>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t('about.title')}</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">{t('about.subtitle')}</p>
            </div>

            {/* Mission Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.mission.title')}</h2>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            {t('about.mission.p1')}
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            {t('about.mission.p2')}
                        </p>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-200 rounded-3xl transform rotate-3"></div>
                        <div className="relative bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">10k+</div>
                            <div className="text-gray-500 mb-6">{t('about.mission.learners')}</div>
                            <div className="text-4xl font-bold text-green-600 mb-2">1M+</div>
                            <div className="text-gray-500">{t('about.mission.generated')}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12">{t('about.team.title')}</h2>
                    <div className="flex flex-wrap justify-center gap-12">
                        <div className="text-center">
                            <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 border-4 border-gray-800"></div>
                            <h3 className="font-bold text-lg">Le Tran</h3>
                            <p className="text-gray-400 text-sm">{t('about.team.role1')}</p>
                        </div>
                        <div className="text-center">
                            <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 border-4 border-gray-800"></div>
                            <h3 className="font-bold text-lg">Bond</h3>
                            <p className="text-gray-400 text-sm">{t('about.team.role2')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
