import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Wrench,
  Bell,
  User,
  Power,
  CheckCircle,
  Menu,
  X,
  Radio,
} from 'lucide-react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import ToggleSwitch from '../Common/ToggleSwitch';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onToggleSidebar, isSidebarOpen }) {
  const { isAvailable, toggleAvailability, isUpdatingAvailability, t } = useApp();
  const { worker, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left section: Mobile menu button & Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                  SkillBridge
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900 uppercase tracking-wider">
                    Worker
                  </span>
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                  {t('common.workerPortal')}
                </span>
              </div>
            </Link>
          </div>

          {/* Center/Middle section: Availability quick switch on desktop */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {isAvailable ? t('common.acceptingJobs') : t('common.notAcceptingJobs')}
              </span>
              <ToggleSwitch
                size="sm"
                checked={isAvailable}
                onChange={toggleAvailability}
                disabled={isUpdatingAvailability}
              />
            </div>
          )}

          {/* Right section: Language, Theme, Notifications & User avatar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <LanguageSelector />
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
                </Link>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1.5 sm:pr-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs border border-blue-200 dark:border-blue-900">
                    {worker?.fullName ? worker.fullName.charAt(0) : 'W'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {worker?.fullName || 'Worker'}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {worker?.primaryService ? t(`services.${worker.primaryService}`) || worker.primaryService : 'Professional'}
                    </span>
                  </div>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t('auth.signInBtn')}
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
                >
                  {t('auth.registerNow')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
