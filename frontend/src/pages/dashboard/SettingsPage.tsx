import { useState, useEffect } from 'react';
import { User, Globe, Moon, Save, Shield, Award, Camera, Check, CreditCard, Sparkles, Zap, Crown, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

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
    const { user } = useAuth();
    const isPremium = user?.isPremium;

    // Parse initial tab from URL
    const searchParams = new URLSearchParams(window.location.search);
    const initialTab = searchParams.get('tab') || 'profile';

    const [activeTab, setActiveTab] = useState(initialTab);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        if (initialTab && ['profile', 'preferences', 'security', 'billing'].includes(initialTab)) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);

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
        { id: 'billing', label: 'Billing & Subscription', icon: CreditCard },
    ];

    const handleCancelSubscription = () => {
        setShowCancelModal(false);
        toast.success("Subscription cancelled. Your plan will not auto-renew.");
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'security') {
                if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
                    toast.error('Password must be at least 6 characters');
                    return;
                }
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                    toast.error('Passwords do not match');
                    return;
                }
                const response = await fetch('/api/v1/user/setup-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newPassword: passwordData.newPassword })
                });
                if (response.ok) {
                    toast.success('Password updated successfully');
                    setPasswordData({ newPassword: '', confirmPassword: '' });
                } else {
                    toast.error('Failed to update password');
                }
            } else {
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
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const isTeacher = profileData.roles.includes('TEACHER');

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto pb-12 relative"
            >
                {/* Background ambient effect */}
                <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-indigo-50/50 dark:from-indigo-900/10 to-transparent pointer-events-none -z-10" />

                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">{t('dashboard.settings')}</h1>
                    <p className="text-gray-500 dark:text-slate-400">Manage your account settings and preferences.</p>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Sidebar Tabs */}
                    <div className="col-span-12 md:col-span-3 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all
                                ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 text-indigo-700 dark:text-indigo-400 shadow-sm border border-indigo-500/10'
                                        : 'text-gray-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-gray-900 dark:hover:text-white border border-transparent'
                                    }
                            `}
                            >
                                <tab.icon size={18} className={activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-slate-500'} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="col-span-12 md:col-span-9">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] border border-gray-100/50 dark:border-slate-800/50 shadow-2xl overflow-hidden relative"
                        >

                            {/* PROFILE TAB */}
                            {activeTab === 'profile' && (
                                <div className="p-6 md:p-8 space-y-8 relative z-10">
                                    {isFetching ? (
                                        <div className="animate-pulse space-y-6">
                                            <div className="h-24 w-24 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                                            <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
                                            <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-5 p-6 bg-gray-50/50 dark:bg-slate-800/30 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
                                                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shadow-inner group">
                                                    {profileData.avatarUrl ? (
                                                        <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 uppercase">{profileData.fullName.charAt(0)}</span>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                        <Camera size={24} className="text-white" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{profileData.fullName}</h3>
                                                        {isTeacher && (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 shadow-sm">
                                                                Teacher Account
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button className="self-start px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all active:scale-95">
                                                        Change Avatar
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={profileData.fullName}
                                                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200/80 dark:border-slate-700/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-medium"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Email</label>
                                                    <input
                                                        type="email"
                                                        value={profileData.email}
                                                        disabled
                                                        className="w-full px-4 py-3.5 bg-gray-100/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-slate-700/50 rounded-2xl text-gray-500 dark:text-slate-500 cursor-not-allowed font-medium"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Learning Goal</label>
                                                    <select
                                                        value={profileData.learningGoal}
                                                        onChange={(e) => setProfileData({ ...profileData, learningGoal: e.target.value })}
                                                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200/80 dark:border-slate-700/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-medium appearance-none"
                                                    >
                                                        <option value="">Select a goal</option>
                                                        <option value="career">Career Advancement</option>
                                                        <option value="travel">Travel & Culture</option>
                                                        <option value="school">School & Exams</option>
                                                        <option value="hobby">Just for Fun</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Proficiency Level</label>
                                                    <input
                                                        type="text"
                                                        value={profileData.proficiencyLevel}
                                                        disabled
                                                        className="w-full px-4 py-3.5 bg-gray-100/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-slate-700/50 rounded-2xl text-gray-500 dark:text-slate-500 cursor-not-allowed font-medium uppercase text-center max-w-[120px]"
                                                    />
                                                </div>

                                                {isTeacher && (
                                                    <>
                                                        <div className="col-span-full">
                                                            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Specialization</label>
                                                            <div className="relative group">
                                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                                    <Award className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    value={profileData.specialization}
                                                                    onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                                                                    placeholder="e.g. Business English, IELTS Preparation"
                                                                    className="w-full pl-11 px-4 py-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200/80 dark:border-slate-700/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-medium"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-span-full">
                                                            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Bio</label>
                                                            <div className="relative">
                                                                <textarea
                                                                    value={profileData.bio}
                                                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                                    rows={4}
                                                                    placeholder="Tell students about your experience and teaching style..."
                                                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200/80 dark:border-slate-700/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-medium resize-none shadow-inner"
                                                                />
                                                            </div>
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
                                <div className="p-6 md:p-8 space-y-10 relative z-10">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                                                <Globe size={22} className="text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            Language
                                        </h3>
                                        <div className="grid grid-cols-2 gap-5">
                                            <button
                                                onClick={() => i18n.changeLanguage('en')}
                                                className={`p-5 rounded-2xl border-2 text-left transition-all relative ${i18n.language === 'en' ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 dark:border-indigo-500 shadow-md shadow-indigo-500/10' : 'border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 hover:border-gray-300 dark:hover:border-slate-600'}`}
                                            >
                                                <span className={`block font-bold text-lg ${i18n.language === 'en' ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-900 dark:text-white'}`}>English</span>
                                                <span className={`text-sm font-medium mt-1 block ${i18n.language === 'en' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400'}`}>English</span>
                                                {i18n.language === 'en' && <div className="absolute top-5 right-5 w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>}
                                            </button>
                                            <button
                                                onClick={() => i18n.changeLanguage('vi')}
                                                className={`p-5 rounded-2xl border-2 text-left transition-all relative ${i18n.language === 'vi' ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 dark:border-indigo-500 shadow-md shadow-indigo-500/10' : 'border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 hover:border-gray-300 dark:hover:border-slate-600'}`}
                                            >
                                                <span className={`block font-bold text-lg ${i18n.language === 'vi' ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-900 dark:text-white'}`}>Tiếng Việt</span>
                                                <span className={`text-sm font-medium mt-1 block ${i18n.language === 'vi' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400'}`}>Vietnamese</span>
                                                {i18n.language === 'vi' && <div className="absolute top-5 right-5 w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-gray-100 dark:border-slate-800/80">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                                                <Moon size={22} className="text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            Appearance
                                        </h3>
                                        <div className="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 text-center shadow-inner relative overflow-hidden">
                                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-600 to-transparent opacity-50"></div>
                                            <span className="font-bold text-gray-600 dark:text-slate-300 text-lg">Dark mode is supported via system settings 🕶️</span>
                                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mt-2">The application adapts to your OS theme automatically.</p>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-gray-100 dark:border-slate-800/80">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                                                <Shield size={22} className="text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            Connected Accounts
                                        </h3>
                                        <div className="space-y-4">
                                            {/* Google Card */}
                                            <div className="p-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-white border-2 border-gray-100 dark:border-slate-700 rounded-2xl flex items-center justify-center p-2.5 shadow-sm bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-full h-full object-contain drop-shadow-sm" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-lg text-gray-900 dark:text-white mb-0.5">Google</p>
                                                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                                                            {(profileData as any).authProvider === 'BOTH' || (profileData as any).authProvider === 'GOOGLE' || (profileData as any).authProvider === 'MULTIPLE'
                                                                ? 'Securely connected to Google account'
                                                                : 'Connect to log in with Google'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="w-full sm:w-auto self-end sm:self-center">
                                                    {(profileData as any).authProvider === 'BOTH' || (profileData as any).authProvider === 'GOOGLE' || (profileData as any).authProvider === 'MULTIPLE' ? (
                                                        <span className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20">
                                                            <Check size={16} className="mr-1.5" /> Linked
                                                        </span>
                                                    ) : (
                                                        <a
                                                            href={`${import.meta.env.VITE_BACKEND_URL || ''}/oauth2/authorization/google`}
                                                            className="w-full sm:w-auto inline-flex justify-center px-6 py-2.5 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95 text-center"
                                                        >
                                                            Connect Google
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Facebook Card */}
                                            <div className="p-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-white border-2 border-gray-100 dark:border-slate-700 rounded-2xl flex items-center justify-center p-2.5 shadow-sm bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
                                                        <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-sm" aria-hidden="true">
                                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-lg text-gray-900 dark:text-white mb-0.5">Facebook</p>
                                                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                                                            {((profileData as any).authProvider === 'FACEBOOK' || (profileData as any).authProvider === 'BOTH' && !(profileData as any).authProvider.includes('GOOGLE')) || (profileData as any).authProvider === 'MULTIPLE' || (profileData as any).facebookId
                                                                ? 'Securely connected to Facebook account'
                                                                : 'Connect to log in with Facebook'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="w-full sm:w-auto self-end sm:self-center">
                                                    {((profileData as any).authProvider === 'FACEBOOK' || (profileData as any).authProvider === 'BOTH' && !(profileData as any).authProvider.includes('GOOGLE')) || (profileData as any).authProvider === 'MULTIPLE' || (profileData as any).facebookId ? (
                                                        <span className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20">
                                                            <Check size={16} className="mr-1.5" /> Linked
                                                        </span>
                                                    ) : (
                                                        <a
                                                            href={`${import.meta.env.VITE_BACKEND_URL || ''}/oauth2/authorization/facebook`}
                                                            className="w-full sm:w-auto inline-flex justify-center px-6 py-2.5 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95 text-center"
                                                        >
                                                            Connect Facebook
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SECURITY TAB */}
                            {activeTab === 'security' && (
                                <div className="p-6 md:p-8 space-y-8 relative z-10">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                                                <Shield size={22} className="text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            Change Password
                                        </h3>
                                        <div className="space-y-6 max-w-xl">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Set a local password to log in without your social provider.</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">New Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200/80 dark:border-slate-700/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-medium placeholder-gray-400 dark:placeholder-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200/80 dark:border-slate-700/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-medium placeholder-gray-400 dark:placeholder-slate-600"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* BILLING TAB */}
                            {activeTab === 'billing' && (
                                <div className="p-6 md:p-8 space-y-8 relative z-10">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                                                <CreditCard size={22} className="text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            Billing & Subscription
                                        </h3>

                                        {isPremium ? (
                                            <div className="space-y-6">
                                                {/* Current Plan Card */}
                                                <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h4 className="text-2xl font-black">PRO Plan</h4>
                                                                <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-lg backdrop-blur-md border border-white/20">Active</span>
                                                            </div>
                                                            <p className="text-indigo-100 font-medium">You have unlimited access to all AI features.</p>
                                                        </div>
                                                        <div className="text-left md:text-right">
                                                            <p className="text-indigo-200 text-sm mb-1">Next billing date</p>
                                                            <p className="text-xl font-bold">
                                                                {user?.subscriptionExpiryDate
                                                                    ? new Date(user.subscriptionExpiryDate).toLocaleDateString('vi-VN')
                                                                    : 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Features & Benefits */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50 flex items-start gap-4">
                                                        <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                                            <Zap size={20} />
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold text-gray-900 dark:text-white mb-1">Unlimited AI Credits</h5>
                                                            <p className="text-sm text-gray-500 dark:text-slate-400">Generate and evaluate endless emails without interruption.</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50 flex items-start gap-4">
                                                        <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
                                                            <Sparkles size={20} />
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold text-gray-900 dark:text-white mb-1">Ad-Free Experience</h5>
                                                            <p className="text-sm text-gray-500 dark:text-slate-400">Focus completely on learning. No more watching ads.</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Danger Zone */}
                                                <div className="pt-8 border-t border-gray-100 dark:border-slate-800/80">
                                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Danger Zone</h4>
                                                    <div className="flex items-center justify-between p-5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl">
                                                        <div>
                                                            <p className="font-bold text-red-900 dark:text-red-400 mb-1">Cancel Subscription</p>
                                                            <p className="text-sm text-red-700/70 dark:text-red-400/70">You will lose access to PRO features at the end of your billing cycle.</p>
                                                        </div>
                                                        <button
                                                            onClick={() => setShowCancelModal(true)}
                                                            className="px-5 py-2.5 text-red-600 dark:text-red-400 font-bold border-2 border-red-200 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all"
                                                        >
                                                            Cancel Plan
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 px-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-700/50">
                                                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <Crown size={32} />
                                                </div>
                                                <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-3">You are on the Free Plan</h4>
                                                <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-md mx-auto">Upgrade to PRO to unlock unlimited AI feedback, templates, and an ad-free experience.</p>
                                                <button onClick={() => window.location.href = '/upgrade'} className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all">
                                                    Explore PRO Plans
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Submit Button Area */}
                            <div className="bg-gray-50/50 dark:bg-slate-900/80 px-6 py-5 border-t border-gray-100 dark:border-slate-800/80 flex justify-end relative z-10 backdrop-blur-md">
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-600/30 flex items-center gap-2.5 disabled:opacity-70 disabled:active:scale-100"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>

                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Cancel Subscription Prompt Modal */}
            <AnimatePresence>
                {showCancelModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCancelModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10"
                        >
                            <div className="p-6 md:p-8">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 mx-auto rounded-full flex items-center justify-center mb-6">
                                    <AlertTriangle size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-3">
                                    Cancel Subscription?
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-center mb-8">
                                    Are you sure you want to cancel your PRO plan? You will lose access to unlimited features at the end of your billing cycle.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowCancelModal(false)}
                                        className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Keep PRO
                                    </button>
                                    <button
                                        onClick={handleCancelSubscription}
                                        className="flex-1 py-3 px-4 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 active:scale-95 transition-all"
                                    >
                                        Yes, Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SettingsPage;
