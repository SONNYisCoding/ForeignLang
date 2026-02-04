import React, { useState, useEffect } from 'react';
import { User, Save, Lock, Mail } from 'lucide-react';

const ProfilePage = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        role: '',
        tier: ''
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
                    tier: data.tier || 'FREE'
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
                    username: formData.username
                })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Profile updated successfully!');
                // Reload page after short delay to refresh layout data
                setTimeout(() => window.location.reload(), 1000);
            } else {
                setError(data.error || 'Failed to update profile');
            }
        } catch (err) {
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <User className="text-indigo-600" />
                Hồ sơ cá nhân
            </h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                {success && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-gray-500">Email không thể thay đổi</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Vai trò</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={formData.tier === 'PREMIUM' ? 'Premium Member' : 'Free Member'}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Nhập họ tên của bạn"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Chọn tên đăng nhập"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                w-full md:w-auto px-6 py-2.5 rounded-lg font-medium text-white flex items-center justify-center gap-2
                                transition-all transform active:scale-95
                                ${loading
                                    ? 'bg-indigo-300 cursor-wait'
                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'}
                            `}
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Lưu thay đổi
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
