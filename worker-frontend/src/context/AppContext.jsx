import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation, availableLanguages } from '../translations';
import { workerGateway } from '../services/integrations';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Theme state with local storage persistence
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('skillbridge_worker_theme');
    if (saved) return saved;
    return 'light'; // Light mode is default as required
  });

  // Language state with local storage persistence
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('skillbridge_worker_lang');
    if (saved && ['en', 'es', 'fr', 'hi'].includes(saved)) return saved;
    return 'en';
  });

  // Global worker availability toggle state
  const [isAvailable, setIsAvailable] = useState(true);
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);

  // Toast / notification feedback
  const [toast, setToast] = useState(null);

  // Apply theme class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('skillbridge_worker_theme', theme);
  }, [theme]);

  // Persist language selection
  useEffect(() => {
    localStorage.setItem('skillbridge_worker_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const hideToast = () => {
    setToast(null);
  };

  const toggleAvailability = async () => {
    try {
      setIsUpdatingAvailability(true);
      const nextState = !isAvailable;
      const res = await workerGateway.setAvailability(nextState);
      setIsAvailable(res.isAvailable);
      showToast(
        nextState
          ? getTranslation(language, 'dashboard.availabilityBannerActive')
          : getTranslation(language, 'dashboard.availabilityBannerInactive'),
        nextState ? 'success' : 'info'
      );
    } catch (err) {
      showToast(err.message || 'Failed to update availability', 'error');
    } finally {
      setIsUpdatingAvailability(false);
    }
  };

  // Translation helper hook function
  const t = (keyPath, params = {}) => {
    return getTranslation(language, keyPath, params);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        language,
        setLanguage,
        availableLanguages,
        t,
        isAvailable,
        setIsAvailable,
        toggleAvailability,
        isUpdatingAvailability,
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
              toast.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                : toast.type === 'info'
                ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
                : 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={hideToast}
              className="ml-auto text-xs opacity-70 hover:opacity-100 p-1 font-bold"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
