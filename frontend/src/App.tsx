import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CreditProvider } from './contexts/CreditContext';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/ProtectedRoute';
import AnimatedRoutes from './components/ui/AnimatedRoutes';
import PageTransition from './components/ui/PageTransition';

// Lazy Load Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfileSetupPage = lazy(() => import('./pages/ProfileSetupPage'));
const OAuth2RedirectHandler = lazy(() => import('./components/auth/OAuth2RedirectHandler'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const EmailGeneratorPage = lazy(() => import('./pages/dashboard/EmailGeneratorPage'));
const EmailFeedbackPage = lazy(() => import('./pages/dashboard/EmailFeedbackPage'));
const LearningRoadmapPage = lazy(() => import('./pages/dashboard/LearningRoadmapPage'));
const EmailHistoryPage = lazy(() => import('./pages/dashboard/EmailHistoryPage'));
const ProfilePage = lazy(() => import('./pages/dashboard/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));
const TemplateDetailPage = lazy(() => import('./pages/TemplateDetailPage'));
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

import UiverseLoader from './components/ui/UiverseLoader';

// Loading Fallback Component
const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
    <UiverseLoader />
    <span className="mt-6 text-sm font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase animate-pulse">Loading Workspace...</span>
  </div>
);

// Professional Best Practice: Delayed Loader
// Prevents the loader from flashing on screen if the internet is fast (loads under 250ms).
const DelayedPageLoader = () => {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShow(true), 250);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return <PageLoader />;
};

// RootRoute: Conditional routing for the homepage based on authentication
const RootRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <PageTransition><LandingPage /></PageTransition>;
  }

  if (user.roles?.includes('ADMIN')) {
    return <Navigate to="/admin" replace />;
  }

  if (user.roles?.includes('TEACHER')) {
    return <Navigate to="/teacher" replace />;
  }

  // For normal Learners, render the Dashboard directly at '/'
  return (
    <DashboardRoute>
      <PageTransition><DashboardPage /></PageTransition>
    </DashboardRoute>
  );
};

function App() {
  return (
    <AuthProvider>
      <CreditProvider>
        <ToastProvider>
          <Toaster position="bottom-right" richColors />
          <ThemeProvider>
            <Router>
              <Suspense fallback={<DelayedPageLoader />}>
                <AnimatedRoutes>
                  {/* Public Routes */}
                  {/* Dynamic Root Route */}
                  <Route path="/" element={<RootRoute />} />
                  <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
                  <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
                  <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
                  <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
                  <Route path="/teachers/:id" element={<PageTransition><TeacherProfilePage /></PageTransition>} />
                  <Route path="/oauth2/redirect" element={<PageTransition><OAuth2RedirectHandler /></PageTransition>} />

                  {/* Semi-Protected Routes (Auth required but no specific role, or handled internally) */}
                  <Route path="/profile-setup" element={<ProtectedRoute><PageTransition><ProfileSetupPage /></PageTransition></ProtectedRoute>} />
                  <Route path="/assessment" element={<ProtectedRoute><PageTransition><SkillAssessment /></PageTransition></ProtectedRoute>} />
                  <Route path="/onboarding/assessment" element={<ProtectedRoute><PageTransition><SkillAssessment /></PageTransition></ProtectedRoute>} />
                  <Route path="/upgrade" element={<ProtectedRoute><PageTransition><UpgradePage /></PageTransition></ProtectedRoute>} />
                  <Route path="/topics/:id" element={<PageTransition><TopicDetailPage /></PageTransition>} />

                  {/* Dashboard Routes (Learner) */}
                  <Route path="/dashboard" element={<Navigate to="/" replace />} />
                  <Route path="/dashboard/generator" element={<DashboardRoute><PageTransition><EmailGeneratorPage /></PageTransition></DashboardRoute>} />
                  <Route path="/dashboard/feedback" element={<DashboardRoute><PageTransition><EmailFeedbackPage /></PageTransition></DashboardRoute>} />
                  <Route path="/dashboard/roadmap" element={<DashboardRoute><PageTransition><LearningRoadmapPage /></PageTransition></DashboardRoute>} />
                  <Route path="/dashboard/history" element={<DashboardRoute><PageTransition><EmailHistoryPage /></PageTransition></DashboardRoute>} />
                  <Route path="/dashboard/templates" element={<DashboardRoute><PageTransition><TemplatesPage /></PageTransition></DashboardRoute>} />
                  <Route path="/dashboard/templates/:id" element={<DashboardRoute><PageTransition><TemplateDetailPage /></PageTransition></DashboardRoute>} />
                  <Route path="/dashboard/vocabulary" element={<DashboardRoute><PageTransition><VocabularyPage /></PageTransition></DashboardRoute>} />
                  <Route path="/dashboard/topics" element={<DashboardRoute><PageTransition><TopicsPage /></PageTransition></DashboardRoute>} />
                  <Route path="/dashboard/topics/:id" element={<DashboardRoute><PageTransition><TopicDetailPage /></PageTransition></DashboardRoute>} />
                  <Route path="/dashboard/topics/:topicId/lessons/:lessonId" element={<DashboardRoute><PageTransition><LessonPage /></PageTransition></DashboardRoute>} />
                  <Route path="/dashboard/profile" element={<DashboardRoute><PageTransition><ProfilePage /></PageTransition></DashboardRoute>} />
                  <Route path="/dashboard/settings" element={<DashboardRoute><PageTransition><SettingsPage /></PageTransition></DashboardRoute>} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminRoute><PageTransition><AdminDashboard /></PageTransition></AdminRoute>} />
                  <Route path="/admin/users" element={<AdminRoute><PageTransition><UserManagement /></PageTransition></AdminRoute>} />
                  <Route path="/admin/chat-history" element={<AdminRoute><PageTransition><AdminChatHistoryPage /></PageTransition></AdminRoute>} />
                  <Route path="/admin/groups" element={<AdminRoute><PageTransition><GroupManagement /></PageTransition></AdminRoute>} />
                  <Route path="/admin/approval" element={<AdminRoute><PageTransition><ApprovalPage /></PageTransition></AdminRoute>} />
                  <Route path="/admin/settings" element={<AdminRoute><PageTransition><SettingsPage /></PageTransition></AdminRoute>} />

                  {/* Teacher Routes */}
                  <Route path="/teacher" element={<TeacherRoute><PageTransition><TeacherDashboard /></PageTransition></TeacherRoute>} />
                  <Route path="/teacher/lessons" element={<TeacherRoute><PageTransition><TeacherLessons /></PageTransition></TeacherRoute>} />
                  <Route path="/teacher/lessons/new" element={<TeacherRoute><PageTransition><LessonEditor /></PageTransition></TeacherRoute>} />
                  <Route path="/teacher/lessons/:id/edit" element={<TeacherRoute><PageTransition><LessonEditor /></PageTransition></TeacherRoute>} />
                  <Route path="/teacher/students" element={<TeacherRoute><PageTransition><TeacherStudents /></PageTransition></TeacherRoute>} />
                  <Route path="/teacher/analytics" element={<TeacherRoute><PageTransition><TeacherAnalytics /></PageTransition></TeacherRoute>} />
                  <Route path="/teacher/settings" element={<TeacherRoute><PageTransition><SettingsPage /></PageTransition></TeacherRoute>} />
                  <Route path="/teacher/profile" element={<TeacherRoute><PageTransition><ProfilePage /></PageTransition></TeacherRoute>} />

                  {/* 404 */}
                  <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
                </AnimatedRoutes>
              </Suspense>
            </Router>
          </ThemeProvider >
        </ToastProvider>
      </CreditProvider>
    </AuthProvider>
  );
}

export default App;
