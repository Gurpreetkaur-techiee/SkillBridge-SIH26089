import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AppProvider, useApp } from './context/AppContext';
import { MainLayout } from './components/layout/MainLayout';
import { CustomerHome } from './views/CustomerHome';
import { FindWorkersView } from './views/FindWorkersView';
import { MyBookingsView } from './views/MyBookingsView';
import { NotificationsView } from './views/NotificationsView';
import { ProfileView } from './views/ProfileView';
import { ServiceDetailModal } from './components/customer/ServiceDetailModal';

function AppContent() {
  const { activeTab } = useApp();

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
    </MainLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
