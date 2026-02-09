import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, BookOpen, Star, Mail, Award, ArrowLeft } from 'lucide-react';
import { SkeletonCard } from '../components/ui/Skeleton';

interface Course {
    id: string;
    title: string;
    description: string;
    level: string;
}

interface TeacherProfile {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    bio: string;
    specialization: string;
    courses: Course[];
}

const TeacherProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`/api/v1/teachers/${id}`);
                if (!response.ok) {
                    throw new Error('Teacher not found');
                }
                const data = await response.json();
                setTeacher(data);
            } catch (err) {
                setError('Failed to load teacher profile');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProfile();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                <div className="h-64 bg-gray-100 rounded-3xl animate-pulse" />
                <div className="space-y-4">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        );
    }

    if (error || !teacher) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Users size={32} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Teacher not found</h2>
                <p className="text-gray-500 mb-6">The teacher profile you are looking for does not exist or has been removed.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-12 px-4">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>

            {/* Profile Header Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100"
            >
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600" />
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end gap-6">
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                                {teacher.avatarUrl ? (
                                    <img src={teacher.avatarUrl} alt={teacher.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400 bg-gray-100">
                                        {teacher.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{teacher.name}</h1>
                                <p className="text-indigo-600 font-medium flex items-center gap-2">
                                    <Award size={18} />
                                    {teacher.specialization || 'Language Teacher'}
                                </p>
                            </div>
                        </div>
                        <button className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                            <Mail size={18} />
                            Contact
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Users size={20} className="text-indigo-500" />
                                    About Me
                                </h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                    {teacher.bio || "No biography available yet."}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <BookOpen size={18} />
                                            <span>Courses</span>
                                        </div>
                                        <span className="font-bold text-gray-900">{teacher.courses.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Star size={18} />
                                            <span>Rating</span>
                                        </div>
                                        <span className="font-bold text-gray-900">5.0</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Users size={18} />
                                            <span>Students</span>
                                        </div>
                                        <span className="font-bold text-gray-900">120+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Courses Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <BookOpen className="text-indigo-600" />
                    Courses by {teacher.name}
                </h2>

                {teacher.courses.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border border-gray-100">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                        <p>This teacher hasn't published any courses yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teacher.courses.map((course) => (
                            <motion.div
                                key={course.id}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
                                onClick={() => navigate(`/courses/${course.id}`)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <BookOpen size={24} />
                                    </div>
                                    <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full uppercase tracking-wide">
                                        {course.level}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                    {course.description}
                                </p>
                                <div className="flex items-center text-indigo-600 font-medium text-sm">
                                    View Course <ArrowLeft className="rotate-180 ml-1 w-4 h-4" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherProfilePage;
