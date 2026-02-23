import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Skeleton from './ui/Skeleton';

// Mock AuthContext if not yet available, or import real one
// Assuming AuthContext provides user object with roles

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="w-full h-screen p-8 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.some(role => user.roles.includes(role))) {
        return <Navigate to="/" replace />; // Or /unauthorized
    }

    // Force onboarding if profile not complete (skip for admin/teacher)
    const isAdminOrTeacher = user.roles.some(r => r === 'ADMIN' || r === 'TEACHER');
    if (!user.profileComplete && !isAdminOrTeacher && !location.pathname.startsWith('/onboarding')) {
        return <Navigate to="/onboarding/assessment" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
