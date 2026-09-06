import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppShell from './components/Shell/AppShell';

import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import AvailableBookingsPage from './pages/AvailableBookings/AvailableBookingsPage';
import BookingDetailsPage from './pages/BookingDetails/BookingDetailsPage';
import MyBookingsPage from './pages/MyBookings/MyBookingsPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import EarningsPage from './pages/Earnings/EarningsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SettingsPage from './pages/Profile/SettingsPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 rounded-full border-3 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <BrowserRouter basename="/worker">
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Worker Portal Shell Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={<DashboardPage />}
              />
              <Route
                path="/available-jobs"
                element={<AvailableBookingsPage />}
              />
              <Route
                path="/booking/:id"
                element={<BookingDetailsPage />}
              />
              <Route
                path="/my-bookings"
                element={<MyBookingsPage />}
              />
              <Route
                path="/notifications"
                element={<NotificationsPage />}
              />
              <Route
                path="/earnings"
                element={<EarningsPage />}
              />
              <Route
                path="/profile"
                element={<ProfilePage />}
              />
              <Route
                path="/settings"
                element={<SettingsPage />}
              />
            </Route>

            {/* Fallback */}
            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  );
}