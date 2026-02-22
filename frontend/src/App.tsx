import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import Skeleton from './components/ui/Skeleton';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy Load Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfileSetupPage = lazy(() => import('./pages/ProfileSetupPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const EmailGeneratorPage = lazy(() => import('./pages/dashboard/EmailGeneratorPage'));
const EmailHistoryPage = lazy(() => import('./pages/dashboard/EmailHistoryPage'));
const ProfilePage = lazy(() => import('./pages/dashboard/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));
const VocabularyPage = lazy(() => import('./pages/VocabularyPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const UpgradePage = lazy(() => import('./pages/dashboard/UpgradePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const TopicDetailPage = lazy(() => import('./pages/TopicDetailPage'));
const TopicsPage = lazy(() => import('./pages/TopicsPage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const TeacherProfilePage = lazy(() => import('./pages/TeacherProfilePage'));
const SkillAssessment = lazy(() => import('./pages/onboarding/SkillAssessment'));

// Admin & Teacher Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const AdminChatHistoryPage = lazy(() => import('./pages/admin/AdminChatHistoryPage'));
const GroupManagement = lazy(() => import('./pages/admin/GroupManagement'));
const ApprovalPage = lazy(() => import('./pages/admin/ApprovalPage'));
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'));
const TeacherLessons = lazy(() => import('./pages/teacher/TeacherLessons'));
const LessonEditor = lazy(() => import('./pages/teacher/LessonEditor'));
const TeacherStudents = lazy(() => import('./pages/teacher/TeacherStudents'));
const TeacherAnalytics = lazy(() => import('./pages/teacher/TeacherAnalytics'));

// Layouts (Can also be lazy loaded if large)
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import TeacherLayout from './layouts/TeacherLayout';

// Wrapper for dashboard routes to apply layout & protection
const DashboardRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['ADMIN']}>
    <AdminLayout>{children}</AdminLayout>
  </ProtectedRoute>
);

const TeacherRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['TEACHER']}>
    <TeacherLayout>{children}</TeacherLayout>
  </ProtectedRoute>
);

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
    <div className="space-y-4 w-full max-w-md px-4">
      <Skeleton className="h-12 w-3/4 mx-auto" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Toaster position="bottom-right" richColors />
        <ThemeProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/teachers/:id" element={<TeacherProfilePage />} />

                {/* Semi-Protected Routes (Auth required but no specific role, or handled internally) */}
                <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
                <Route path="/assessment" element={<ProtectedRoute><SkillAssessment /></ProtectedRoute>} />
                <Route path="/upgrade" element={<ProtectedRoute><UpgradePage /></ProtectedRoute>} />
                <Route path="/topics/:id" element={<TopicDetailPage />} />

                {/* Dashboard Routes (Learner) */}
                <Route path="/dashboard" element={<DashboardRoute><DashboardPage /></DashboardRoute>} />
                <Route path="/dashboard/generator" element={<DashboardRoute><EmailGeneratorPage /></DashboardRoute>} />
                <Route path="/dashboard/history" element={<DashboardRoute><EmailHistoryPage /></DashboardRoute>} />
                <Route path="/dashboard/templates" element={<DashboardRoute><TemplatesPage /></DashboardRoute>} />
                <Route path="/dashboard/vocabulary" element={<DashboardRoute><VocabularyPage /></DashboardRoute>} />
                <Route path="/dashboard/topics" element={<DashboardRoute><TopicsPage /></DashboardRoute>} />
                <Route path="/dashboard/topics/:id" element={<DashboardRoute><TopicDetailPage /></DashboardRoute>} />
                <Route path="/dashboard/topics/:topicId/lessons/:lessonId" element={<DashboardRoute><LessonPage /></DashboardRoute>} />
                <Route path="/dashboard/profile" element={<DashboardRoute><ProfilePage /></DashboardRoute>} />
                <Route path="/dashboard/settings" element={<DashboardRoute><SettingsPage /></DashboardRoute>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                <Route path="/admin/chat-history" element={<AdminRoute><AdminChatHistoryPage /></AdminRoute>} />
                <Route path="/admin/groups" element={<AdminRoute><GroupManagement /></AdminRoute>} />
                <Route path="/admin/approval" element={<AdminRoute><ApprovalPage /></AdminRoute>} />
                <Route path="/admin/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />

                {/* Teacher Routes */}
                <Route path="/teacher" element={<TeacherRoute><TeacherDashboard /></TeacherRoute>} />
                <Route path="/teacher/lessons" element={<TeacherRoute><TeacherLessons /></TeacherRoute>} />
                <Route path="/teacher/lessons/new" element={<TeacherRoute><LessonEditor /></TeacherRoute>} />
                <Route path="/teacher/lessons/:id/edit" element={<TeacherRoute><LessonEditor /></TeacherRoute>} />
                <Route path="/teacher/students" element={<TeacherRoute><TeacherStudents /></TeacherRoute>} />
                <Route path="/teacher/analytics" element={<TeacherRoute><TeacherAnalytics /></TeacherRoute>} />
                <Route path="/teacher/settings" element={<TeacherRoute><SettingsPage /></TeacherRoute>} />
                <Route path="/teacher/profile" element={<TeacherRoute><ProfilePage /></TeacherRoute>} />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Router>
        </ThemeProvider >
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
