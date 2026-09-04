import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  Wrench,
  Bell,
  User,
  Menu,
  X,
  Briefcase,
  ChevronDown,
  ArrowRight,
  Clock,
  CheckCircle2,
  Settings,
  CalendarCheck,
  LogOut,
  Check,
  XCircle,
} from 'lucide-react';

import ThemeToggle from '../ThemeToggle/ThemeToggle';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import ToggleSwitch from '../Common/ToggleSwitch';

import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

import {
  notificationsGateway,
  bookingsGateway,
} from '../../services/integrations';

export default function Header({
  onToggleSidebar,
  isSidebarOpen,
}) {
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

  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] =
    useState(false);

  const [processingBookingId, setProcessingBookingId] =
    useState(null);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  /**
   * Fetch worker notifications.
   *
   * The same notification data is also used by
   * the full Notifications page.
   */
  const fetchNotifications = async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    try {
      setIsLoadingNotifications(true);

      const data =
        await notificationsGateway.getNotifications();

      setNotifications(data);
    } catch (err) {
      console.error(
        'Failed to load header notifications:',
        err
      );
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  /**
   * Initial notification fetch + polling.
   *
   * The polling can later be replaced by a Firebase
   * realtime listener without changing the UI.
   */
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      return undefined;
    }
  
    fetchNotifications();
  
    /**
     * Refresh immediately when a booking is
     * accepted or rejected from another part
     * of the Worker app.
     */
    const handleNotificationsUpdated = () => {
      fetchNotifications();
    };
  
    window.addEventListener(
      'skillbridge:notifications-updated',
      handleNotificationsUpdated
    );
  
    /**
     * Keep polling as a temporary fallback.
     *
     * This can later be replaced with a
     * Firebase realtime listener.
     */
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);
  
    return () => {
      window.removeEventListener(
        'skillbridge:notifications-updated',
        handleNotificationsUpdated
      );
    
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  /**
   * Close dropdowns when clicking outside.
   */
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

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
    };
  }, []);

  /**
   * Close dropdowns when route changes.
   */
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

  /**
   * Mark all notifications as read.
   */
  async function markAllNotificationsRead() {
    try {
      await notificationsGateway.markAllAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (err) {
      console.error(
        'Failed to mark notifications as read:',
        err
      );
    }
  }

  /**
   * Open a notification's booking details page.
   *
   * The notification is marked as read first.
   */
  async function openNotification(notification) {
    try {
      if (!notification.isRead) {
        await notificationsGateway.markAsRead(
          notification.id
        );

        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id
              ? { ...item, isRead: true }
              : item
          )
        );
      }

      if (
        notification.bookingId
      ) {
        setIsNotifOpen(false);

        navigate(
          `/booking/${notification.bookingId}`
        );
      }
    } catch (err) {
      console.error(
        'Failed to open notification:',
        err
      );
    }
  }

  /**
   * Accept a booking directly from the notification dropdown.
   */
  async function acceptBooking(
    event,
    notification
  ) {
    event.stopPropagation();
  
    if (
      !notification.bookingId ||
      processingBookingId
    ) {
      return;
    }
  
    try {
      setProcessingBookingId(
        notification.bookingId
      );
    
      // Move the job:
      // Available Jobs → My Bookings
      await bookingsGateway.acceptBooking(
        notification.bookingId
      );
    
      // Remove the notification from the gateway
      await notificationsGateway.removeNotification(
        notification.id
      );
    
      // Remove the notification from the dropdown immediately
      setNotifications((prev) =>
        prev.filter(
          (item) =>
            item.id !== notification.id
        )
      );
    } catch (err) {
      console.error(
        'Failed to accept booking:',
        err
      );
    } finally {
      setProcessingBookingId(null);
    }
  }

  /**
   * Reject a booking directly from the notification dropdown.
   */
  async function rejectBooking(
    event,
    notification
  ) {
    event.stopPropagation();

    if (
      !notification.bookingId ||
      processingBookingId
    ) {
      return;
    }

    try {
      setProcessingBookingId(
        notification.bookingId
      );

      // Remove the job from Available Jobs
      await bookingsGateway.rejectBooking(
        notification.bookingId
      );

      // Remove the notification from the gateway
      await notificationsGateway.removeNotification(
        notification.id
      );

      // Remove the notification from the dropdown immediately
      setNotifications((prev) =>
        prev.filter(
          (item) =>
            item.id !== notification.id
        )
      );
    } catch (err) {
      console.error(
        'Failed to reject booking:',
        err
      );
    } finally {
      setProcessingBookingId(null);
    }
  }

  function goTo(path) {
    setIsProfileOpen(false);
    setIsNotifOpen(false);
    navigate(path);
  }

  const workerName =
    worker?.fullName || 'Worker';

  const workerService = worker?.primaryService
    ? t(`services.${worker.primaryService}`) ||
      worker.primaryService
    : 'Professional';

  /**
   * Only unread notifications contribute to the
   * red badge on the bell.
   */
  const unreadNotificationsCount =
    notifications.filter(
      (notification) => !notification.isRead
    ).length;

  /**
   * Show the newest four notifications in the
   * compact dropdown.
   */
  const recentNotifications =
    notifications.slice(0, 4);

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

                    {/* Red unread badge */}
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                        {unreadNotificationsCount > 99
                          ? '99+'
                          : unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-[390px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50">

                      {/* Notification header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">

                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {t('notifications.title')}
                          </span>

                          {unreadNotificationsCount > 0 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
                              {unreadNotificationsCount} new
                            </span>
                          )}
                        </div>

                        {unreadNotificationsCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllNotificationsRead}
                            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {t(
                              'notifications.markAllRead'
                            )}
                          </button>
                        )}
                      </div>

                      {/* Notification list */}
                      <div className="max-h-[330px] overflow-y-auto">

                        {isLoadingNotifications ? (
                          <div className="py-10 px-4 text-center">
                            <div className="w-8 h-8 mx-auto border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />

                            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                              {t('common.loading')}
                            </p>
                          </div>
                        ) : recentNotifications.length === 0 ? (
                          <div className="py-10 px-4 text-center">

                            <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <Bell className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                            </div>

                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                              {t(
                                'notifications.emptyTitle'
                              )}
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {t(
                                'notifications.emptyDesc'
                              )}
                            </p>
                          </div>
                        ) : (
                          recentNotifications.map(
                            (notification) => {
                              const isBookingRequest =
                                notification.type ===
                                'booking_request';

                              const isProcessing =
                                processingBookingId ===
                                notification.bookingId;

                              return (
                                <div
                                  key={
                                    notification.id
                                  }
                                  className={`border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 ${
                                    !notification.isRead
                                      ? 'bg-blue-50/40 dark:bg-blue-950/20'
                                      : ''
                                  }`}
                                >
                                  {/* Main notification */}
                                  <div className="p-3.5">

                                    <div className="flex items-start gap-3">

                                      {/* Icon */}
                                      <div
                                        className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                                          isBookingRequest
                                            ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400'
                                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                                        }`}
                                      >
                                        {isBookingRequest ? (
                                          <Briefcase
                                            className="w-4 h-4"
                                          />
                                        ) : (
                                          <Bell
                                            className="w-4 h-4"
                                          />
                                        )}
                                      </div>

                                      {/* Clickable request details */}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openNotification(
                                            notification
                                          )
                                        }
                                        className="flex-1 min-w-0 text-left group cursor-pointer"
                                      >
                                        {isBookingRequest ? (
                                          <>
                                            {/* Customer name */}
                                            <div className="flex items-center justify-between gap-2">
                                              <p
                                                className={`text-sm truncate ${
                                                  !notification.isRead
                                                    ? 'font-extrabold text-slate-900 dark:text-white'
                                                    : 'font-bold text-slate-800 dark:text-slate-200'
                                                } group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}
                                              >
                                                {notification.customerName ||
                                                  notification.title ||
                                                  'New Service Request'}
                                              </p>

                                              <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                                                {notification.timestamp ||
                                                  'Just now'}
                                              </span>
                                            </div>

                                            {/* Job detail */}
                                            <p className="mt-0.5 text-xs font-medium text-slate-600 dark:text-slate-400 line-clamp-1">
                                              {notification.jobTitle ||
                                                notification.message ||
                                                'New service request'}
                                            </p>

                                            {/* Extra detail */}
                                            {(notification.locationAddress ||
                                              notification.customerName) && (
                                              <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1">
                                                {notification.locationAddress ||
                                                  ''}
                                              </p>
                                            )}
                                          </>
                                        ) : (
                                          <>
                                            <div className="flex items-center justify-between gap-2">
                                              <p
                                                className={`text-xs ${
                                                  !notification.isRead
                                                    ? 'font-extrabold text-slate-900 dark:text-white'
                                                    : 'font-semibold text-slate-800 dark:text-slate-200'
                                                }`}
                                              >
                                                {notification.title ||
                                                  'Notification'}
                                              </p>

                                              <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                                                {notification.timestamp ||
                                                  'Just now'}
                                              </span>
                                            </div>

                                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                              {notification.message}
                                            </p>
                                          </>
                                        )}
                                      </button>

                                      {/* Accept / Reject */}
                                      {isBookingRequest &&
                                        notification.bookingId && (
                                          <div className="flex items-center gap-1.5 shrink-0">

                                            {/* Accept */}
                                            <button
                                              type="button"
                                              disabled={
                                                isProcessing
                                              }
                                              onClick={(
                                                event
                                              ) =>
                                                acceptBooking(
                                                  event,
                                                  notification
                                                )
                                              }
                                              className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 hover:bg-emerald-100 dark:hover:bg-emerald-950 hover:border-emerald-200 dark:hover:border-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                              title={t(
                                                'common.accept'
                                              )}
                                              aria-label={t(
                                                'common.accept'
                                              )}
                                            >
                                              <Check className="w-4 h-4" />
                                            </button>

                                            {/* Reject */}
                                            <button
                                              type="button"
                                              disabled={
                                                isProcessing
                                              }
                                              onClick={(
                                                event
                                              ) =>
                                                rejectBooking(
                                                  event,
                                                  notification
                                                )
                                              }
                                              className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-950 hover:border-rose-200 dark:hover:border-rose-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                              title={t(
                                                'common.decline'
                                              )}
                                              aria-label={t(
                                                'common.decline'
                                              )}
                                            >
                                              <XCircle className="w-4 h-4" />
                                            </button>

                                          </div>
                                        )}
                                    </div>

                                    {/* Unread indicator */}
                                    {!notification.isRead && (
                                      <div className="mt-2 ml-12 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />

                                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                          {t(
                                            'notifications.unreadBadge'
                                          )}
                                        </span>
                                      </div>
                                    )}

                                  </div>
                                </div>
                              );
                            }
                          )
                        )}
                      </div>

                      {/* View all */}
                      <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            goTo('/notifications')
                          }
                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center justify-center gap-1 mx-auto"
                        >
                          {t(
                            'notifications.viewAll'
                          ) || 'View all notifications'}

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
                        ? worker.fullName
                            .charAt(0)
                            .toUpperCase()
                        : 'W'}
                    </div>

                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                        {workerName}
                      </span>

                      <span className="text-[10px] text-slate-400 capitalize">
                        {workerService}
                      </span>
                    </div>

                    <ChevronDown
                      className={`hidden sm:block w-3.5 h-3.5 text-slate-400 transition-transform ${
                        isProfileOpen
                          ? 'rotate-180'
                          : ''
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
                              ? worker.fullName
                                  .charAt(0)
                                  .toUpperCase()
                              : 'W'}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {workerName}
                            </p>

                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {workerService}
                            </p>
                          </div>

                        </div>
                      </div>

                      {/* Profile links */}
                      <div className="py-1">

                        <button
                          type="button"
                          onClick={() =>
                            goTo('/profile')
                          }
                          className="w-full flex items-center gap-2.5 text-left px-4 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Profile</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            goTo('/my-bookings')
                          }
                          className="w-full flex items-center gap-2.5 text-left px-4 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <CalendarCheck className="w-4 h-4 text-slate-400" />
                          <span>My Bookings</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            goTo('/settings')
                          }
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