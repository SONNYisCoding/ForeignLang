
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NotFoundPage = () => {
    const { user } = useAuth();

    // Determine the correct dashboard path based on role (ADMIN > TEACHER > Learner)
    let dashboardPath = '/';
    if (user?.roles?.includes('ADMIN')) dashboardPath = '/admin';
    else if (user?.roles?.includes('TEACHER')) dashboardPath = '/teacher';

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-md mx-auto"
            >
                {/* Mascot Animation Placeholder - Replace with actual mascot image */}
                <div className="w-48 h-48 mx-auto mb-8 relative">
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    >
                        <img
                            src="/mascot/thinking.png"
                            alt="Confused Mascot"
                            className="w-full h-full object-contain drop-shadow-xl"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/7486/7486831.png'; // Fallback
                            }}
                        />
                    </motion.div>

                    {/* 404 Text Background */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 text-[120px] font-black text-gray-100 select-none">
                        404
                    </div>
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-gray-900 mb-2"
                >
                    Oops! You found a secret area.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-500 mb-8"
                >
                    Don't worry, our mascot is just as confused as you are. Let's get you back to safety.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                    <Link
                        to={dashboardPath}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        <Home size={20} />
                        Go to Dashboard
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;
