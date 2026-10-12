import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { JobsPage } from './pages/JobsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { CandidatesPage } from './pages/CandidatesPage';
import { CandidateProfilePage } from './pages/CandidateProfilePage';
import { PipelinePage } from './pages/PipelinePage';
import { ApplicationDetailsPage } from './pages/ApplicationDetailsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AuditPage } from './pages/AuditPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected SaaS App Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/:id" element={<JobDetailsPage />} />
                <Route path="/candidates" element={<CandidatesPage />} />
                <Route path="/candidates/:id" element={<CandidateProfilePage />} />
                <Route path="/pipeline" element={<PipelinePage />} />
                <Route path="/applications/:id" element={<ApplicationDetailsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/audit" element={<AuditPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
              </Route>
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
