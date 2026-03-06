import { useState, useEffect } from 'react';
import { Users, Mail, Calendar, ChevronDown, UserCircle2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Student {
    id: string;
    name: string;
    email: string;
    joinedAt: string;
}

interface Group {
    id: string;
    name: string;
    memberCount: number;
    students: Student[];
}

const TeacherStudents = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
    const { showError } = useToast();

    useEffect(() => {
        fetch('/api/v1/teacher/topics/groups', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setGroups(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                if (err.message !== 'Unexpected token < in JSON at position 0') // Suppress HTML error from backend (e.g. 404/500 page)
                    showError('Failed to load students');
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleGroup = (groupId: string) => {
        setExpandedGroup(expandedGroup === groupId ? null : groupId);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-7xl mx-auto pb-12"
        >
            {/* Background Effects */}
            <div className="fixed top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-50 dark:from-indigo-950/20 to-transparent pointer-events-none -z-10" />

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 dark:border-slate-800/60 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-50/50 dark:from-indigo-900/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <Users size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">My Students</h1>
                        <p className="text-gray-500 dark:text-slate-400 font-medium">Manage groups and monitor student performance efficiently.</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-white dark:border-slate-800 backdrop-blur-sm">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Loading student data...</p>
                </div>
            ) : groups.length === 0 ? (
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/40 dark:border-slate-800/60 shadow-sm"
                >
                    <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative group border border-indigo-100 dark:border-indigo-800/50">
                        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl scale-150 group-hover:opacity-100 transition-opacity"></div>
                        <Users size={48} className="text-indigo-400 dark:text-indigo-500 relative z-10" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No Students Assigned</h3>
                    <p className="text-gray-500 dark:text-slate-400 max-w-sm mx-auto">You haven't been assigned any groups yet. As students join your classes, they will appear here.</p>
                </motion.div>
            ) : (
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                    className="space-y-4"
                >
                    {groups.map(group => (
                        <motion.div
                            key={group.id}
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                show: { opacity: 1, y: 0 }
                            }}
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-gray-100/50 dark:border-slate-700/50 overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all duration-300"
                        >
                            <button
                                onClick={() => toggleGroup(group.id)}
                                className="w-full flex items-center justify-between p-6 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors text-left group/btn"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover/btn:scale-110 group-hover/btn:bg-indigo-100 dark:group-hover/btn:bg-indigo-900/50 transition-all">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover/btn:text-indigo-600 dark:group-hover/btn:text-indigo-400 transition-colors">{group.name}</h3>
                                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mt-0.5">{group.memberCount} enrolled students</p>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 dark:bg-slate-800 group-hover/btn:bg-indigo-50 dark:group-hover/btn:bg-indigo-900/30 transition-colors">
                                    <motion.div
                                        animate={{ rotate: expandedGroup === group.id ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ChevronDown className="text-gray-400 dark:text-slate-500 group-hover/btn:text-indigo-500" />
                                    </motion.div>
                                </div>
                            </button>

                            <AnimatePresence>
                                {expandedGroup === group.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="border-t border-gray-100 dark:border-slate-700/50 bg-gray-50/30 dark:bg-slate-900/20"
                                    >
                                        <div className="p-6">
                                            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 shadow-sm">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="text-left bg-gray-50 dark:bg-slate-800/80 border-b border-gray-100 dark:border-slate-700/50">
                                                            <th className="py-4 pl-6 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Student Info</th>
                                                            <th className="py-4 px-4 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Contact</th>
                                                            <th className="py-4 px-4 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Enrollment</th>
                                                            <th className="py-4 pr-6 text-right text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                                                        {group.students.map(student => (
                                                            <tr key={student.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-colors group/row">
                                                                <td className="py-4 pl-6">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200/50 dark:border-indigo-800/50">
                                                                            {student.name.charAt(0)}
                                                                        </div>
                                                                        <div className="font-bold text-gray-900 dark:text-white group-hover/row:text-indigo-600 dark:group-hover/row:text-indigo-400 transition-colors">{student.name}</div>
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 px-4 text-gray-600 dark:text-slate-300">
                                                                    <div className="flex items-center gap-2 text-sm font-medium">
                                                                        <div className="p-1.5 bg-gray-100 dark:bg-slate-800 rounded-md">
                                                                            <Mail size={14} className="text-gray-400 dark:text-slate-500" />
                                                                        </div>
                                                                        {student.email}
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 px-4 text-gray-600 dark:text-slate-300">
                                                                    <div className="flex items-center gap-2 text-sm font-medium">
                                                                        <div className="p-1.5 bg-gray-100 dark:bg-slate-800 rounded-md xl:hidden">
                                                                            <Calendar size={14} className="text-gray-400 dark:text-slate-500" />
                                                                        </div>
                                                                        {new Date(student.joinedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 pr-6 text-right">
                                                                    <button className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-white px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-600 dark:hover:bg-indigo-600 rounded-xl transition-all border border-indigo-100 dark:border-indigo-800/50 shadow-sm hover:shadow hover:shadow-indigo-500/20">
                                                                        <UserCircle2 size={14} />
                                                                        View Profile
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                {group.students.length === 0 && (
                                                    <div className="flex justify-center items-center py-12 text-gray-400 dark:text-slate-500">
                                                        <div className="text-center">
                                                            <Users size={32} className="mx-auto mb-3 opacity-20" />
                                                            <p className="font-medium">No students in this group yet.</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

export default TeacherStudents;
