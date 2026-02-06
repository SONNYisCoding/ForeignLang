import { useState, useEffect } from 'react';
import { Users, Mail, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

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
    }, []);

    const toggleGroup = (groupId: string) => {
        setExpandedGroup(expandedGroup === groupId ? null : groupId);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">My Students</h1>
                    <p className="text-slate-500">View and manage students in your groups</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading student data...</div>
            ) : groups.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <Users size={48} className="mx-auto text-indigo-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-800">No Students Yet</h3>
                    <p className="text-slate-500">You haven't been assigned any groups efficiently.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {groups.map(group => (
                        <div key={group.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <button
                                onClick={() => toggleGroup(group.id)}
                                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">{group.name}</h3>
                                        <p className="text-sm text-slate-500">{group.memberCount} Students</p>
                                    </div>
                                </div>
                                {expandedGroup === group.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                            </button>

                            {expandedGroup === group.id && (
                                <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/50">
                                    <div className="mt-4 overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                                    <th className="pb-3 pl-4">Name</th>
                                                    <th className="pb-3">Email</th>
                                                    <th className="pb-3">Joined Date</th>
                                                    <th className="pb-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {group.students.map(student => (
                                                    <tr key={student.id} className="hover:bg-white/50 transition-colors">
                                                        <td className="py-3 pl-4">
                                                            <div className="font-medium text-slate-800">{student.name}</div>
                                                        </td>
                                                        <td className="py-3 text-slate-600">
                                                            <div className="flex items-center gap-2">
                                                                <Mail size={14} className="text-slate-400" />
                                                                {student.email}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 text-slate-600">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar size={14} className="text-slate-400" />
                                                                {new Date(student.joinedAt).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 text-right">
                                                            <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                                                                View Profile
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {group.students.length === 0 && (
                                            <div className="text-center py-8 text-slate-400 italic">No students in this group yet.</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherStudents;
