import React, { useState, useEffect } from 'react';
import { User, Globe, Moon, Save, Shield, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface UserProfile {
    fullName: string;
    email: string;
    bio: string;
    specialization: string;
    learningGoal: string;
    proficiencyLevel: string;
    roles: string[];
    avatarUrl: string;
}

const SettingsPage = () => {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const [profileData, setProfileData] = useState<UserProfile>({
        fullName: '',
        email: '',
        bio: '',
        specialization: '',
        learningGoal: '',
        proficiencyLevel: '',
        roles: [],
        avatarUrl: ''
    });

    useEffect(() => {
        fetch('/api/v1/user/me', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    toast.error('Failed to load profile');
                    return;
                }
                setProfileData({
                    fullName: data.name || '',
                    email: data.email || '',
                    bio: data.bio || '',
                    specialization: data.specialization || '',
                    learningGoal: data.learningGoal || '',
                    proficiencyLevel: data.proficiencyLevel || '',
                    roles: data.roles || [],
                    avatarUrl: data.avatar || ''
                });
            })
            .catch(() => toast.error('Failed to load profile'))
            .finally(() => setIsFetching(false));
    }, []);

    const tabs = [
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'preferences', label: 'Preferences', icon: Globe },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/v1/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: profileData.fullName,
                    bio: profileData.bio,
                    specialization: profileData.specialization,
                    learningGoal: profileData.learningGoal
                })
            });

            if (response.ok) {
                toast.success('Profile updated successfully');
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const isTeacher = profileData.roles.includes('TEACHER');

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
                                {isFetching ? (
                                    <div className="animate-pulse space-y-4">
                                        <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600 border-4 border-white shadow-md overflow-hidden">
                                                {profileData.avatarUrl ? (
                                                    <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    profileData.fullName.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                                                    Change Avatar
                                                </button>
                                                {isTeacher && (
                                                    <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                        Teacher Account
                                                    </span>
                                                )}
                                            </div>
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

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Learning Goal</label>
                                                <select
                                                    value={profileData.learningGoal}
                                                    onChange={(e) => setProfileData({ ...profileData, learningGoal: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                >
                                                    <option value="">Select a goal</option>
                                                    <option value="career">Career Advancement</option>
                                                    <option value="travel">Travel & Culture</option>
                                                    <option value="school">School & Exams</option>
                                                    <option value="hobby">Just for Fun</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Proficiency Level</label>
                                                <input
                                                    type="text"
                                                    value={profileData.proficiencyLevel}
                                                    disabled
                                                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                                                />
                                            </div>

                                            {isTeacher && (
                                                <>
                                                    <div className="col-span-full">
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                                                        <div className="relative">
                                                            <Award className="absolute left-3 top-3 text-gray-400" size={18} />
                                                            <input
                                                                type="text"
                                                                value={profileData.specialization}
                                                                onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                                                                placeholder="e.g. Business English, IELTS Preparation"
                                                                className="w-full pl-10 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-span-full">
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                                                        <textarea
                                                            value={profileData.bio}
                                                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                            rows={4}
                                                            placeholder="Tell students about your experience and teaching style..."
                                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
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

                                <div className="pt-6 border-t border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Shield size={20} className="text-indigo-600" />
                                        Connected Accounts
                                    </h3>
                                    <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center p-2 shadow-sm">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Google</p>
                                                <p className="text-sm text-gray-500">
                                                    {(profileData as any).authProvider === 'BOTH' || (profileData as any).authProvider === 'GOOGLE'
                                                        ? 'Connected'
                                                        : 'Not connected'}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            {(profileData as any).authProvider === 'BOTH' || (profileData as any).authProvider === 'GOOGLE' ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Linked
                                                </span>
                                            ) : (
                                                <a
                                                    href="http://localhost:8080/oauth2/authorization/google"
                                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    Connect
                                                </a>
                                            )}
                                        </div>
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
