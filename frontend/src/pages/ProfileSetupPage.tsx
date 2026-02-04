import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, AtSign, ArrowRight } from 'lucide-react';

const ProfileSetupPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [birthDate, setBirthDate] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Validate username
            if (username.length < 3) {
                setError('Username must be at least 3 characters');
                setLoading(false);
                return;
            }

            if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                setError('Username can only contain letters, numbers, and underscores');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:8080/api/v1/auth/profile-setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    username,
                    fullName,
                    birthDate: birthDate || null
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Something went wrong');
                setLoading(false);
                return;
            }

            // Success - redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            setError('Network error. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10 text-white text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-4">
                        <User size={40} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Complete Your Profile</h1>
                    <p className="text-indigo-200 mt-2">Almost there! Just a few more details.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Bonus Message */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                            🎉 Welcome! You have <span className="font-bold">5 FREE AI uses</span> to get started!
                        </p>
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="your_username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Letters, numbers, and underscores only</p>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Birth Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            'Setting up...'
                        ) : (
                            <>
                                Start Learning
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetupPage;
