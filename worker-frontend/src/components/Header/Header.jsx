import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Wrench,
  Bell,
  User,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Clock,
  CheckCircle2,
  Settings,
  CalendarCheck,
  LogOut,
} from 'lucide-react';

import ThemeToggle from '../ThemeToggle/ThemeToggle';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import ToggleSwitch from '../Common/ToggleSwitch';

import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onToggleSidebar, isSidebarOpen }) {
  const {
    isAvailable,
    toggleAvailability,
    isUpdatingAvailability,
    t,
  } = useApp();

  const {
    worker,
    isAuthenticated,
    logout,
  } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  /*
   * Notifications will be supplied by the backend team.
   * Keep this empty for now rather than creating fake notifications.
   */
  const notifications = [];

  const unreadNotificationsCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setIsNotifOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setIsNotifOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  function openNotifications() {
    setIsProfileOpen(false);
    setIsNotifOpen((current) => !current);
  }

  function openProfile() {
    setIsNotifOpen(false);
    setIsProfileOpen((current) => !current);
  }

  function markAllNotificationsRead() {
    /*
     * Backend integration will handle the real read state.
     * This function is intentionally ready for that integration.
     */
  }

  function goTo(path) {
    setIsProfileOpen(false);
    setIsNotifOpen(false);
    navigate(path);
  }

  const workerName = worker?.fullName || 'Worker';

  const workerService = worker?.primaryService
    ? t(`services.${worker.primaryService}`) || worker.primaryService
    : 'Professional';

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Left section */}
          <div className="flex items-center gap-3">

            {/* Mobile menu */}
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={
                isSidebarOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Brand */}
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 group"
            >
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

          {/* Availability */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">

              <span
                className={`w-2 h-2 rounded-full ${
                  isAvailable
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-slate-400'
                }`}
              />

              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {isAvailable
                  ? t('common.acceptingJobs')
                  : t('common.notAcceptingJobs')}
              </span>

              <ToggleSwitch
                size="sm"
                checked={isAvailable}
                onChange={toggleAvailability}
                disabled={isUpdatingAvailability}
              />
            </div>
          )}

          {/* Right section */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            <LanguageSelector />

            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {/* ================= NOTIFICATIONS ================= */}
                <div
                  className="relative"
                  ref={notifRef}
                >
                  <button
                    type="button"
                    onClick={openNotifications}
                    className={`relative p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200/60 dark:border-slate-800 focus:outline-none ${
                      isNotifOpen
                        ? 'bg-slate-100 dark:bg-slate-800'
                        : ''
                    }`}
                    title="Notifications"
                    aria-label="Notifications"
                    aria-expanded={isNotifOpen}
                  >
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5" />

                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                      </span>
                    )}
                  </button>

                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-3 z-50">

                      {/* Notification header */}
                      <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">

                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            Notifications
                          </span>

                          {unreadNotificationsCount > 0 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
                              {unreadNotificationsCount} new
                            </span>
                          )}
                        </div>

                        {unreadNotificationsCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllNotificationsRead}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      {/* Notification list */}
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">

                        {notifications.length === 0 ? (
                          <div className="py-8 px-4 text-center">

                            <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <Bell className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                            </div>

                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                              No new notifications
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              You're all caught up.
                            </p>

                          </div>
                        ) : (
                          notifications
                            .slice(0, 4)
                            .map((notification) => (
                              <div
                                key={notification.id}
                                onClick={() => goTo('/notifications')}
                                className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${
                                  notification.unread
                                    ? 'bg-blue-50/50 dark:bg-blue-950/20'
                                    : ''
                                }`}
                              >
                                <div className="flex items-start gap-2.5">

                                  <div className="mt-0.5">
                                    {notification.type === 'booking' ? (
                                      <span className="p-1 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 block">
                                        <Clock className="w-3.5 h-3.5" />
                                      </span>
                                    ) : (
                                      <span className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-600 block">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                      {notification.title}
                                    </p>

                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                                      {notification.message}
                                    </p>

                                    <span className="text-[10px] text-slate-400 mt-1 block">
                                      {notification.time}
                                    </span>
                                  </div>

                                </div>
                              </div>
                            ))
                        )}
                      </div>

                      {/* View all */}
                      <div className="px-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                        <button
                          type="button"
                          onClick={() => goTo('/notifications')}
                          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center justify-center gap-1 mx-auto"
                        >
                          View all notifications
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

                {/* ================= PROFILE ================= */}
                <div
                  className="relative"
                  ref={profileRef}
                >
                  <button
                    type="button"
                    onClick={openProfile}
                    className={`flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                      isProfileOpen
                        ? 'bg-slate-100 dark:bg-slate-800'
                        : ''
                    }`}
                    aria-label="Open profile menu"
                    aria-expanded={isProfileOpen}
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs border border-blue-200 dark:border-blue-900">
                      {worker?.fullName
                        ? worker.fullName.charAt(0).toUpperCase()
                        : 'W'}
                    </div>

                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                        {worker?.fullName || 'Worker'}
                      </span>

                      <span className="text-[10px] text-slate-400 capitalize">
                        {worker?.primaryService
                          ? t(`services.${worker.primaryService}`) ||
                            worker.primaryService
                          : 'Professional'}
                      </span>
                    </div>

                    <ChevronDown
                      className={`hidden sm:block w-3.5 h-3.5 text-slate-400 transition-transform ${
                        isProfileOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Compact profile dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50">

                      {/* Worker information */}
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">

                        <div className="flex items-center gap-2.5">

                          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm border border-blue-200 dark:border-blue-900 shrink-0">
                            {worker?.fullName
                              ? worker.fullName.charAt(0).toUpperCase()
                              : 'W'}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {worker?.fullName || 'Worker'}
                            </p>

                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {worker?.primaryService || 'Professional'}
                            </p>
                          </div>

                        </div>
                      </div>

                      {/* Profile links */}
                      <div className="py-1">

                        <button
                          type="button"
                          onClick={() => goTo('/profile')}
                          className="w-full flex items-center gap-2.5 text-left px-4 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Profile</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => goTo('/my-bookings')}
                          className="w-full flex items-center gap-2.5 text-left px-4 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <CalendarCheck className="w-4 h-4 text-slate-400" />
                          <span>My Bookings</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => goTo('/settings')}
                          className="w-full flex items-center gap-2.5 text-left px-4 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Settings</span>
                        </button>

                      </div>

                      {/* Logout */}
                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800">

                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 text-left px-4 py-2 text-xs sm:text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>

                      </div>

                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Logged out */
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