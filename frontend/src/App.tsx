import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import EmailGeneratorPage from './pages/dashboard/EmailGeneratorPage';
import TopicDetailPage from './pages/TopicDetailPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';
import ProfilePage from './pages/dashboard/ProfilePage';
import SettingsPage from './pages/dashboard/SettingsPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import UpgradePage from './pages/dashboard/UpgradePage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLayout from './layouts/AdminLayout';
import TeacherLayout from './layouts/TeacherLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import UserManagement from './pages/admin/UserManagement';
import GroupManagement from './pages/admin/GroupManagement';
import ApprovalPage from './pages/admin/ApprovalPage';
import TeacherLessons from './pages/teacher/TeacherLessons';
import LessonEditor from './pages/teacher/LessonEditor';
import TeacherStudents from './pages/teacher/TeacherStudents';
import TeacherAnalytics from './pages/teacher/TeacherAnalytics';
import SkillAssessment from './pages/onboarding/SkillAssessment';

// Wrapper for dashboard routes to apply layout
const DashboardRoute = ({ children }: { children: React.ReactNode }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <AdminLayout>{children}</AdminLayout>
);

const TeacherRoute = ({ children }: { children: React.ReactNode }) => (
  <TeacherLayout>{children}</TeacherLayout>
);

import { ThemeProvider } from './contexts/ThemeContext';

// ...

function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile-setup" element={<ProfileSetupPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/assessment" element={<SkillAssessment />} />
            <Route path="/upgrade" element={<UpgradePage />} />

            {/* Dashboard Routes with Layout */}
            <Route
              path="/dashboard"
              element={
                <DashboardRoute>
                  <DashboardPage />
                </DashboardRoute>
              }
            />
            <Route
              path="/dashboard/generator"
              element={
                <DashboardRoute>
                  <EmailGeneratorPage />
                </DashboardRoute>
              }
            />
            <Route
              path="/dashboard/templates"
              element={
                <DashboardRoute>
                  <div className="p-8 text-center text-gray-500">Template Library - Coming Soon</div>
                </DashboardRoute>
              }
            />
            <Route
              path="/dashboard/topics"
              element={
                <DashboardRoute>
                  <div className="p-8 text-center text-gray-500">Topic Learning - Coming Soon</div>
                </DashboardRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <DashboardRoute>
                  <ProfilePage />
                </DashboardRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <DashboardRoute>
                  <SettingsPage />
                </DashboardRoute>
              }
            />

            <Route path="/topics/:id" element={<TopicDetailPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/groups"
              element={
                <AdminRoute>
                  <GroupManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/approval"
              element={
                <AdminRoute>
                  <ApprovalPage />
                </AdminRoute>
              }
            />
            {/* Add more admin routes here */}

            {/* Teacher Routes */}
            <Route
              path="/teacher"
              element={
                <TeacherRoute>
                  <TeacherDashboard />
                </TeacherRoute>
              }
            />
            <Route
              path="/teacher/lessons"
              element={
                <TeacherRoute>
                  <TeacherLessons />
                </TeacherRoute>
              }
            />
            <Route
              path="/teacher/lessons/new"
              element={
                <TeacherRoute>
                  <LessonEditor />
                </TeacherRoute>
              }
            />
            <Route
              path="/teacher/lessons/:id/edit"
              element={
                <TeacherRoute>
                  <LessonEditor />
                </TeacherRoute>
              }
            />
            <Route
              path="/teacher/students"
              element={
                <TeacherRoute>
                  <TeacherStudents />
                </TeacherRoute>
              }
            />
            <Route
              path="/teacher/analytics"
              element={
                <TeacherRoute>
                  <TeacherAnalytics />
                </TeacherRoute>
              }
            />
            {/* Add more teacher routes here */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ThemeProvider >
    </ToastProvider>

  );
}

export default App;
