
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Shield, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RoleSwitcherProps {
    roles: string[];
    currentRole: 'LEARNER' | 'TEACHER' | 'ADMIN';
}

const RoleSwitcher = ({ roles, currentRole }: RoleSwitcherProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Only show if user has multiple roles or at least one role other than LEARNER (default)
    const hasMultipleRoles = roles.length > 1 || roles.includes('ADMIN') || roles.includes('TEACHER');

    if (!hasMultipleRoles) return null;

    const options = [
        {
            role: 'LEARNER',
            label: t('roles.learner'),
            path: '/dashboard',
            icon: LayoutDashboard,
            requiredRole: 'LEARNER', // Everyone is a learner usually, or implicit
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            role: 'TEACHER',
            label: t('roles.teacher'),
            path: '/teacher',
            icon: GraduationCap,
            requiredRole: 'TEACHER',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            role: 'ADMIN',
            label: t('roles.admin'),
            path: '/admin',
            icon: Shield,
            requiredRole: 'ADMIN',
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        }
    ];

    // Filter options available to the user
    // Note: Assuming everyone can access Learner dashboard for now unless restricted
    const availableOptions = options.filter(opt =>
        roles.includes(opt.requiredRole)
    );

    return (
        <div className="p-2 border-b border-gray-100 dark:border-slate-700 mb-2">
            <p className="px-2 text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                {t('roles.switchDashboard')}
            </p>
            <div className="space-y-1">
                {availableOptions.map((opt) => {
                    const isActive = currentRole === opt.role;
                    return (
                        <button
                            key={opt.role}
                            onClick={() => navigate(opt.path)}
                            disabled={isActive}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                                ${isActive
                                    ? 'bg-gray-100 text-gray-900 font-medium cursor-default ring-1 ring-gray-200'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                                }
                            `}
                        >
                            <div className={`w-6 h-6 rounded flex items-center justify-center ${opt.bg}`}>
                                <opt.icon size={14} className={opt.color} />
                            </div>
                            {opt.label}
                            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default RoleSwitcher;
