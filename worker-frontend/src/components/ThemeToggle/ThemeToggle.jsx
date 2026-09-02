import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ThemeToggle({ className = '', showLabel = false }) {
  const { theme, toggleTheme, t } = useApp();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center gap-2 ${className}`}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform hover:rotate-45 duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600 transition-transform hover:-rotate-12 duration-300" />
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {isDark ? t('settings.lightMode') : t('settings.darkMode')}
        </span>
      )}
    </button>
  );
}
