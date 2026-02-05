import React, { useState } from 'react';
import { User, Globe, Moon, Save, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);

    // Mock user data (would normally be fetched)
    const [profileData, setProfileData] = useState({
        fullName: 'Le Tran',
        email: 'letran@example.com',
        bio: 'Passionate language learner.',
        location: 'Ho Chi Minh City, Vietnam'
    });

    const tabs = [
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'preferences', label: 'Preferences', icon: Globe },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // Show success message (toast) - omitted for simplicity
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.settings')}</h1>
            <p className="text-gray-500 mb-8">Manage your account settings and preferences.</p>

            <div className="grid grid-cols-12 gap-8">
                {/* Sidebar Tabs */}
                <div className="col-span-12 md:col-span-3 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                                ${activeTab === tab.id
                                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }
                            `}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="col-span-12 md:col-span-9">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                        {/* PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="p-6 md:p-8 space-y-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600 border-4 border-white shadow-md">
                                        {profileData.fullName[0]}
                                    </div>
                                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                                        Change Avatar
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={profileData.fullName}
                                            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            disabled
                                            className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="col-span-full">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                                        <textarea
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PREFERENCES TAB */}
                        {activeTab === 'preferences' && (
                            <div className="p-6 md:p-8 space-y-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Globe size={20} className="text-indigo-600" />
                                        Language
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => i18n.changeLanguage('en')}
                                            className={`p-4 rounded-xl border-2 text-left transition-all relative ${i18n.language === 'en' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}
                                        >
                                            <span className="block font-medium text-gray-900">English</span>
                                            <span className="text-sm text-gray-500">English</span>
                                            {i18n.language === 'en' && <div className="absolute top-4 right-4 text-indigo-600">●</div>}
                                        </button>
                                        <button
                                            onClick={() => i18n.changeLanguage('vi')}
                                            className={`p-4 rounded-xl border-2 text-left transition-all relative ${i18n.language === 'vi' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}
                                        >
                                            <span className="block font-medium text-gray-900">Tiếng Việt</span>
                                            <span className="text-sm text-gray-500">Vietnamese</span>
                                            {i18n.language === 'vi' && <div className="absolute top-4 right-4 text-indigo-600">●</div>}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Moon size={20} className="text-indigo-600" />
                                        Appearance
                                    </h3>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center text-gray-500 italic">
                                        Dark mode is coming soon!
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECURITY TAB */}
                        {activeTab === 'security' && (
                            <div className="p-6 md:p-8 space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                                    <div className="space-y-4 max-w-md">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                                            <input type="password" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                            <input type="password" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                            <input type="password" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button Area */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>Saving...</>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
