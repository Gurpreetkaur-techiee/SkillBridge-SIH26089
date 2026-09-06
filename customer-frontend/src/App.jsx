import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { CustomerHome } from './views/CustomerHome';
import { FindWorkersView } from './views/FindWorkersView';
import { MyBookingsView } from './views/MyBookingsView';
import { NotificationsView } from './views/NotificationsView';
import { ProfileView } from './views/ProfileView';
import { ServiceDetailModal } from './components/customer/ServiceDetailModal';
import { AuthModal } from './components/auth/AuthModal';
import CustomerLogin from './views/CustomerLogin';

function AppContent() {
  const { activeTab } = useApp();
  const { currentUser, loading: authLoading } = useAuth();

  const currentPath = window.location.pathname;

  // Dedicated Customer Login page
  if (currentPath === '/customer/login') {
    return <CustomerLogin />;
  }

  // Wait for Firebase to determine the authentication state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  // No authenticated customer:
  // /customer/ should take them to Customer Login.
  if (!currentUser) {
    return <CustomerLogin />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <CustomerHome />;

      case 'workers':
        return <FindWorkersView />;

      case 'bookings':
        return <MyBookingsView />;

      case 'notifications':
        return <NotificationsView />;

      case 'profile':
        return <ProfileView />;

      default:
        return <CustomerHome />;
    }
  };

  return (
    <MainLayout>
      {renderActiveView()}
      <ServiceDetailModal />
      <AuthModal />
    </MainLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}