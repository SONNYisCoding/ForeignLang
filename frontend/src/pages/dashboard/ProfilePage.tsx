import React, { useState, useEffect } from 'react';
import { User, Save, Lock, Mail, Calendar, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const ProfilePage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        role: '',
        tier: '',
        birthDate: '',
        avatarUrl: ''
    });

    useEffect(() => {
        // Fetch user data on mount
        fetch('/api/v1/user/me')
            .then(res => res.json())
            .then(data => {
                setFormData({
                    fullName: data.name || data.fullName || '',
                    username: data.username || '',
                    email: data.email || '',
                    role: data.role || 'LEARNER',
                    tier: data.tier || 'FREE',
                    birthDate: data.birthDate || '',
                    avatarUrl: data.avatar || ''
                });
            })
            .catch(err => console.error('Failed to fetch profile:', err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            const res = await fetch('/api/v1/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    username: formData.username,
                    avatarUrl: formData.avatarUrl,
                    birthDate: formData.birthDate || null
                })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(t('common.saved'));
                // Reload page after short delay to update global context
                setTimeout(() => window.location.reload(), 800);
            } else {
                setError(data.error || 'Failed to update profile');
            }
        } catch {
            setError(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-xl">
                        <User className="text-indigo-600" size={28} />
                    </div>
                    {t('dashboard.profile')}
                </h1>

                <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-indigo-500 to-sky-500 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg overflow-hidden">
                                {formData.avatarUrl ? (
                                    <img
                                        src={formData.avatarUrl}
                                        alt="Avatar"
                                        className="w-full h-full object-cover rounded-full"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${formData.fullName}&background=e0e7ff&color=4f46e5`;
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
                                        {formData.fullName?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-8 px-8">
                        {success && (
                            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                {success}
                            </div>
                        )}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">{t('auth.email')}</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 ml-1">Email managed by system</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Account Tier</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={formData.tier === 'PREMIUM' ? 'Premium Member' : 'Free Member'}
                                            disabled
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">{t('auth.fullName')}</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Username</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="Choose a username"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">{t('profileSetup.birthDate') || 'Date of Birth'}</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="date"
                                            name="birthDate"
                                            value={formData.birthDate}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Avatar URL</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="url"
                                        name="avatarUrl"
                                        value={formData.avatarUrl}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="https://example.com/avatar.jpg"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 ml-1">Paste a URL for your profile picture</p>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`
                                        px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2
                                        transition-all transform active:scale-95 shadow-lg shadow-indigo-200
                                        ${loading
                                            ? 'bg-indigo-300 cursor-wait'
                                            : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5'}
                                    `}
                                >
                                    {loading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            {t('common.save')}...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            {t('common.save')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfilePage;
