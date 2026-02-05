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

// Wrapper for dashboard routes to apply layout
const DashboardRoute = ({ children }: { children: React.ReactNode }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
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
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
