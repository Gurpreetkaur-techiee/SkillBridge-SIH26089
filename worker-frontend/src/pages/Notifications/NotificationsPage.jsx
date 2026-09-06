import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';

import {
  Bell,
  CheckCircle2,
  Wallet,
  ShieldCheck,
  Check,
  Clock,
  Briefcase,
  ArrowRight,
  PlayCircle,
  XCircle,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingState from '../../components/LoadingState/LoadingState';

import {
  useApp,
} from '../../context/AppContext';

import {
  useAuth,
} from '../../context/AuthContext';

import {
  notificationsGateway,
  bookingsGateway,
  earningsGateway,
} from '../../services/integrations';


export default function NotificationsPage() {

  const {
    t,
    showToast,
  } = useApp();

  const {
    worker,
  } = useAuth();

  const navigate =
    useNavigate();


  // =====================================
  // STATE
  // =====================================

  const [
    firebaseNotifications,
    setFirebaseNotifications,
  ] = useState([]);

  const [
    bookings,
    setBookings,
  ] = useState([]);

  const [
    transactions,
    setTransactions,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    filterType,
    setFilterType,
  ] = useState('all');


  // =====================================
  // DATE HELPERS
  // =====================================

  const getDateObject =
    (value) => {

      if (!value) {
        return null;
      }

      if (
        value instanceof Date
      ) {
        return value;
      }

      if (
        typeof value?.toDate ===
        'function'
      ) {
        return value.toDate();
      }

      const date =
        new Date(value);

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return null;
      }

      return date;
    };


  const formatTimestamp =
    (value) => {

      const date =
        getDateObject(value);

      if (!date) {
        return 'Recently';
      }

      const now =
        new Date();

      const difference =
        now.getTime() -
        date.getTime();

      const minutes =
        Math.floor(
          difference /
          (1000 * 60)
        );

      const hours =
        Math.floor(
          difference /
          (1000 * 60 * 60)
        );

      const days =
        Math.floor(
          difference /
          (1000 * 60 * 60 * 24)
        );

      if (minutes < 1) {
        return 'Just now';
      }

      if (minutes < 60) {
        return `${minutes}m ago`;
      }

      if (hours < 24) {
        return `${hours}h ago`;
      }

      if (days === 1) {
        return 'Yesterday';
      }

      if (days < 7) {
        return `${days} days ago`;
      }

      return date.toLocaleDateString(
        'en-IN',
        {
          day: 'numeric',
          month: 'short',
          year:
            date.getFullYear() !==
            now.getFullYear()
              ? 'numeric'
              : undefined,
        }
      );
    };


  const getBookingTitle =
    (booking) => {

      return (
        booking.title ||
        booking.serviceName ||
        booking.serviceCategory ||
        booking.category ||
        'Service Request'
      );
    };


  const getCustomerName =
    (booking) => {

      return (
        booking.customerName ||
        booking.customer?.name ||
        'Customer'
      );
    };


  // =====================================
  // FETCH ALL REAL DATA
  // =====================================

  const fetchNotifications =
    async (
      showLoading = false
    ) => {

      try {

        if (showLoading) {
          setIsLoading(true);
        }

        const [
          notificationData,
          bookingData,
          transactionData,
        ] =
          await Promise.all([

            // IMPORTANT:
            // Full Notifications page uses
            // notification history.
            notificationsGateway
              .getNotificationHistory()
              .catch((error) => {

                console.error(
                  'Notification history fetch error:',
                  error
                );

                return [];

              }),

            bookingsGateway
              .getMyBookings()
              .catch((error) => {

                console.error(
                  'Booking fetch error:',
                  error
                );

                return [];

              }),

            earningsGateway
              .getTransactions()
              .catch((error) => {

                console.error(
                  'Transaction fetch error:',
                  error
                );

                return [];

              }),

          ]);

        setFirebaseNotifications(
          notificationData || []
        );

        setBookings(
          bookingData || []
        );

        setTransactions(
          transactionData || []
        );

      } catch (error) {

        console.error(
          'Failed to load notification data:',
          error
        );

      } finally {

        if (showLoading) {
          setIsLoading(false);
        }

      }

    };


  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {

    fetchNotifications(true);

    const interval =
      setInterval(() => {

        fetchNotifications(false);

      }, 10000);

    return () => {

      clearInterval(interval);

    };

  }, []);


  // =====================================
  // BUILD BOOKING NOTIFICATIONS
  // =====================================

  const bookingNotifications =
    useMemo(() => {

      return bookings
        .map((booking) => {

          const status =
            String(
              booking.status || ''
            )
              .toLowerCase()
              .trim();

          const serviceTitle =
            getBookingTitle(
              booking
            );

          const customerName =
            getCustomerName(
              booking
            );


          // ---------------------------------
          // COMPLETED
          // ---------------------------------

          if (
            status ===
            'completed'
          ) {

            const date =
              booking.completedAt ||
              booking.updatedAt ||
              booking.createdAt;

            return {

              id:
                `generated-booking-completed-${booking.id}`,

              generated: true,

              category:
                'booking',

              type:
                'job_completed',

              bookingId:
                booking.id,

              isRead:
                true,

              createdAt:
                date,

              timestamp:
                formatTimestamp(
                  date
                ),

              title:
                'Job Completed',

              message:
                `You successfully completed ${serviceTitle} for ${customerName}. Great work!`,

            };

          }


          // ---------------------------------
          // IN PROGRESS
          // ---------------------------------

          if (
            status ===
            'in_progress'
          ) {

            const date =
              booking.startedAt ||
              booking.updatedAt ||
              booking.createdAt;

            return {

              id:
                `generated-booking-progress-${booking.id}`,

              generated: true,

              category:
                'booking',

              type:
                'booking_in_progress',

              bookingId:
                booking.id,

              isRead:
                true,

              createdAt:
                date,

              timestamp:
                formatTimestamp(
                  date
                ),

              title:
                'Work In Progress',

              message:
                `You are currently working on ${serviceTitle} for ${customerName}.`,

            };

          }


          // ---------------------------------
          // REJECTED
          // ---------------------------------

          if (
            status ===
            'rejected'
          ) {

            const date =
              booking.rejectedAt ||
              booking.updatedAt ||
              booking.createdAt;

            return {

              id:
                `generated-booking-rejected-${booking.id}`,

              generated: true,

              category:
                'booking',

              type:
                'booking_rejected',

              bookingId:
                booking.id,

              isRead:
                true,

              createdAt:
                date,

              timestamp:
                formatTimestamp(
                  date
                ),

              title:
                'Booking Declined',

              message:
                `You declined the ${serviceTitle} request from ${customerName}.`,

            };

          }


          // ---------------------------------
          // CANCELLED
          // ---------------------------------

          if (
            status ===
              'cancelled' ||
            status ===
              'canceled'
          ) {

            const date =
              booking.cancelledAt ||
              booking.updatedAt ||
              booking.createdAt;

            return {

              id:
                `generated-booking-cancelled-${booking.id}`,

              generated: true,

              category:
                'booking',

              type:
                'booking_cancelled',

              bookingId:
                booking.id,

              isRead:
                true,

              createdAt:
                date,

              timestamp:
                formatTimestamp(
                  date
                ),

              title:
                'Booking Cancelled',

              message:
                `The ${serviceTitle} booking with ${customerName} was cancelled.`,

            };

          }


          // ---------------------------------
          // ACCEPTED / CONFIRMED
          // ---------------------------------

          if (
            status ===
              'accepted' ||
            status ===
              'confirmed' ||
            status ===
              'assigned'
          ) {

            const date =
              booking.acceptedAt ||
              booking.updatedAt ||
              booking.createdAt;

            return {

              id:
                `generated-booking-accepted-${booking.id}`,

              generated: true,

              category:
                'booking',

              type:
                'booking_accepted',

              bookingId:
                booking.id,

              isRead:
                true,

              createdAt:
                date,

              timestamp:
                formatTimestamp(
                  date
                ),

              title:
                'Booking Accepted',

              message:
                `You accepted the ${serviceTitle} booking for ${customerName}.`,

            };

          }


          return null;

        })
        .filter(Boolean);

    }, [bookings]);


  // =====================================
  // BUILD PAYOUT NOTIFICATIONS
  // =====================================

  const payoutNotifications =
    useMemo(() => {

      return transactions
        .map((transaction) => {

          const date =
            transaction.completedAt ||
            transaction.date;

          const amount =
            Number(
              transaction.amount || 0
            );

          const serviceTitle =
            transaction.serviceTitle ||
            'Completed Service';

          const customerName =
            transaction.customerName ||
            'Customer';

          return {

            id:
              `generated-payout-${transaction.id}`,

            generated: true,

            category:
              'payout',

            type:
              'payout',

            bookingId:
              transaction.bookingId,

            isRead:
              true,

            createdAt:
              date,

            timestamp:
              formatTimestamp(
                date
              ),

            title:
              'Payment Received',

            message:
              `You earned ₹${amount.toLocaleString('en-IN')} for ${serviceTitle} completed for ${customerName}.`,

          };

        });

    }, [transactions]);


  // =====================================
  // BUILD SYSTEM NOTIFICATIONS
  // =====================================

  const systemNotifications =
    useMemo(() => {

      if (!worker) {
        return [];
      }

      const notifications =
        [];

      const workerName =
        worker.name ||
        worker.fullName ||
        'Worker';

      const accountDate =
        worker.createdAt ||
        worker.updatedAt ||
        null;


      // ---------------------------------
      // ACCOUNT ACTIVE
      // ---------------------------------

      notifications.push({

        id:
          `generated-system-account-${worker.id || 'current'}`,

        generated: true,

        category:
          'system',

        type:
          'system',

        isRead:
          true,

        createdAt:
          accountDate,

        timestamp:
          formatTimestamp(
            accountDate
          ),

        title:
          'Welcome to SkillBridge',

        message:
          'Your worker account is active. You can manage bookings, track your earnings, and grow your business.',

      });


      // ---------------------------------
      // PROFILE VERIFIED
      // ---------------------------------

      const isVerified =
        worker.isVerified === true ||
        worker.verified === true ||
        worker.profileVerified === true ||
        worker.verificationStatus ===
          'verified';

      if (isVerified) {

        notifications.push({

          id:
            `generated-system-verified-${worker.id || 'current'}`,

          generated: true,

          category:
            'system',

          type:
            'profile_verified',

          isRead:
            true,

          createdAt:
            worker.verifiedAt ||
            worker.updatedAt ||
            accountDate,

          timestamp:
            formatTimestamp(
              worker.verifiedAt ||
              worker.updatedAt ||
              accountDate
            ),

          title:
            'Profile Verified',

          message:
            `Congratulations ${workerName}! Your worker profile has been verified.`,

        });

      }


      return notifications;

    }, [worker]);


  // =====================================
  // NORMALIZE FIREBASE NOTIFICATIONS
  // =====================================

  const normalizedFirebaseNotifications =
    useMemo(() => {

      return firebaseNotifications.map(
        (notification) => {

          const date =
            notification.createdAt ||
            notification.updatedAt ||
            notification.timestamp;

          const type =
            notification.type ||
            '';

          let category =
            'booking';

          if (
            type === 'payout' ||
            type === 'payment_received' ||
            type === 'payout_completed' ||
            type === 'payout_processing'
          ) {
            category = 'payout';
          }

          if (
            type === 'system' ||
            type === 'profile_verified' ||
            type === 'profile_updated' ||
            type === 'account_verification' ||
            type === 'settings_changed' ||
            type === 'welcome'
          ) {
            category = 'system';
          }

          return {

            ...notification,

            generated:
              false,

            category,

            createdAt:
              date,

            timestamp:
              notification.timestamp ||
              formatTimestamp(date),

          };

        }
      );

    }, [firebaseNotifications]);


  // =====================================
  // COMBINE ALL NOTIFICATIONS
  // =====================================

  const notifications =
    useMemo(() => {

      const combined = [

        ...normalizedFirebaseNotifications,

        ...bookingNotifications,

        ...payoutNotifications,

        ...systemNotifications,

      ];


      // ---------------------------------
      // REMOVE DUPLICATES
      // ---------------------------------

      const unique =
        Array.from(

          new Map(
            combined.map(
              (item) => [
                item.id,
                item,
              ]
            )
          ).values()

        );


      // ---------------------------------
      // SORT NEWEST FIRST
      // ---------------------------------

      return unique.sort(
        (a, b) => {

          const aDate =
            getDateObject(
              a.createdAt
            );

          const bDate =
            getDateObject(
              b.createdAt
            );

          const aTime =
            aDate
              ? aDate.getTime()
              : 0;

          const bTime =
            bDate
              ? bDate.getTime()
              : 0;

          return bTime - aTime;

        }
      );

    }, [
      normalizedFirebaseNotifications,
      bookingNotifications,
      payoutNotifications,
      systemNotifications,
    ]);


  // =====================================
  // MARK AS READ
  // ONLY REAL FIREBASE NOTIFICATIONS
  // =====================================

  const handleMarkAsRead =
    async (notification) => {

      if (
        notification.generated
      ) {
        return;
      }

      try {

        await notificationsGateway
          .markAsRead(
            notification.id
          );

        setFirebaseNotifications(
          (previous) =>
            previous.map(
              (item) =>
                item.id ===
                notification.id
                  ? {
                      ...item,
                      isRead: true,
                    }
                  : item
            )
        );

      } catch (error) {

        console.error(
          'Error marking notification as read:',
          error
        );

      }

    };


  // =====================================
  // HANDLE NOTIFICATION CLICK
  // =====================================

  const handleNotificationClick =
    async (notification) => {

      try {

        if (
          !notification.isRead &&
          !notification.generated
        ) {

          await handleMarkAsRead(
            notification
          );

        }


        if (
          notification.bookingId
        ) {

          navigate(
            `/booking/${notification.bookingId}`
          );

        }

      } catch (error) {

        console.error(
          'Error opening notification:',
          error
        );

      }

    };


  // =====================================
  // MARK ALL REAL NOTIFICATIONS AS READ
  // =====================================

  const handleMarkAllRead =
    async () => {

      try {

        await notificationsGateway
          .markAllAsRead();

        setFirebaseNotifications(
          (previous) =>
            previous.map(
              (notification) => ({
                ...notification,
                isRead: true,
              })
            )
        );

        showToast(
          t(
            'notifications.markAllRead'
          ),
          'info'
        );

      } catch (error) {

        showToast(
          'Failed to mark all notifications as read',
          'error'
        );

      }

    };


  // =====================================
  // GET ICON
  // =====================================

  const getIconForType =
    (type) => {

      switch (type) {

        case 'booking_request':

          return (
            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          );


        case 'booking_accepted':

          return (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          );


        case 'booking_in_progress':

          return (
            <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          );


        case 'job_completed':

          return (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          );


        case 'booking_rejected':
        case 'booking_cancelled':

          return (
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          );


        case 'payout':
        case 'payment_received':
        case 'payout_completed':
        case 'payout_processing':

          return (
            <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          );


        case 'reminder':

          return (
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          );


        case 'system':
        case 'profile_verified':
        case 'profile_updated':
        case 'account_verification':
        case 'settings_changed':
        case 'welcome':

          return (
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          );


        default:

          return (
            <Bell className="w-5 h-5 text-slate-500" />
          );

      }

    };


  // =====================================
  // FILTER NOTIFICATIONS
  // =====================================

  const filteredNotifications =
    notifications.filter(
      (notification) => {

        if (
          filterType ===
          'unread'
        ) {

          return (
            !notification.isRead &&
            !notification.generated
          );

        }


        if (
          filterType ===
          'booking'
        ) {

          return (
            notification.category ===
            'booking'
          );

        }


        if (
          filterType ===
          'payout'
        ) {

          return (
            notification.category ===
            'payout'
          );

        }


        if (
          filterType ===
          'system'
        ) {

          return (
            notification.category ===
            'system'
          );

        }


        return true;

      }
    );


  // =====================================
  // UNREAD COUNT
  // =====================================

  const unreadCount =
    firebaseNotifications.filter(
      (notification) =>
        !notification.isRead
    ).length;


  // =====================================
  // RENDER
  // =====================================

  return (

    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">


      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <div className="flex items-center gap-2">

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">

              {t(
                'notifications.title'
              )}

            </h1>


            {unreadCount > 0 && (

              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">

                {unreadCount}{' '}

                {t(
                  'notifications.unread'
                )}

              </span>

            )}

          </div>


          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

            {t(
              'notifications.subtitle'
            )}

          </p>

        </div>


        {unreadCount > 0 && (

          <Button
            variant="outline"
            size="sm"
            onClick={
              handleMarkAllRead
            }
            icon={Check}
            className="shrink-0 font-semibold text-xs"
          >

            {t(
              'notifications.markAllRead'
            )}

          </Button>

        )}

      </div>


      {/* FILTER TABS */}

      <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-x-auto">

        {[
          {
            id: 'all',
            label:
              t(
                'notifications.all'
              ),
          },
          {
            id: 'unread',
            label:
              t(
                'notifications.unread'
              ),
          },
          {
            id: 'booking',
            label:
              t(
                'notifications.bookingAlerts'
              ),
          },
          {
            id: 'payout',
            label:
              t(
                'notifications.payoutAlerts'
              ),
          },
          {
            id: 'system',
            label:
              t(
                'notifications.systemAlerts'
              ),
          },
        ].map(
          (tab) => (

            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setFilterType(
                  tab.id
                )
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterType ===
                tab.id
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >

              {tab.label}

            </button>

          )
        )}

      </div>


      {/* NOTIFICATIONS */}

      {isLoading ? (

        <LoadingState
          message={
            t(
              'common.loading'
            )
          }
        />

      ) : filteredNotifications.length ===
        0 ? (

        <EmptyState
          title={
            t(
              'notifications.emptyTitle'
            )
          }
          description={
            t(
              'notifications.emptyDesc'
            )
          }
          icon={Bell}
        />

      ) : (

        <div className="space-y-3">

          {filteredNotifications.map(
            (item) => {

              const isBookingRequest =
                item.type ===
                'booking_request';


              const isClickable =
                Boolean(
                  item.bookingId
                );


              return (

                <Card
                  key={item.id}
                  className={`p-4 sm:p-5 transition-all ${
                    !item.isRead &&
                    !item.generated
                      ? 'bg-blue-50/30 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-900/50 shadow-xs'
                      : 'opacity-90'
                  }`}
                >

                  <div className="flex items-start gap-4">


                    {/* ICON */}

                    <button
                      type="button"
                      onClick={() =>
                        handleNotificationClick(
                          item
                        )
                      }
                      className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shrink-0 transition-colors ${
                        isClickable
                          ? 'cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700'
                          : 'cursor-default'
                      }`}
                      title={
                        isBookingRequest
                          ? t(
                              'notifications.openRequest'
                            )
                          : undefined
                      }
                    >

                      {getIconForType(
                        item.type
                      )}

                    </button>


                    {/* CONTENT */}

                    <div className="flex-1 min-w-0">

                      <button
                        type="button"
                        onClick={() =>
                          handleNotificationClick(
                            item
                          )
                        }
                        className={`w-full text-left ${
                          isClickable
                            ? 'cursor-pointer'
                            : 'cursor-default'
                        }`}
                      >

                        <div className="flex items-center justify-between gap-2">

                          <h4
                            className={`text-sm tracking-tight ${
                              !item.isRead &&
                              !item.generated
                                ? 'font-extrabold text-slate-900 dark:text-white'
                                : 'font-semibold text-slate-800 dark:text-slate-200'
                            }`}
                          >

                            {item.title}

                          </h4>


                          <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">

                            {item.timestamp ||
                              'Recently'}

                          </span>

                        </div>


                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">

                          {item.message}

                        </p>

                      </button>


                      {/* UNREAD */}

                      {!item.isRead &&
                        !item.generated && (

                        <div className="mt-2.5 flex items-center gap-2">

                          <span className="inline-block w-2 h-2 rounded-full bg-blue-600" />

                          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">

                            {t(
                              'notifications.unreadBadge'
                            )}

                          </span>

                        </div>

                      )}


                      {/* VIEW BOOKING */}

                      {item.bookingId && (

                        <div className="mt-3">

                          <button
                            type="button"
                            onClick={() =>
                              handleNotificationClick(
                                item
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-950 transition-colors"
                          >

                            <span>

                              {isBookingRequest
                                ? t(
                                    'notifications.viewRequest'
                                  )
                                : 'View Booking'}

                            </span>


                            <ArrowRight className="w-3.5 h-3.5 shrink-0" />

                          </button>

                        </div>

                      )}

                    </div>

                  </div>

                </Card>

              );

            }
          )}

        </div>

      )}

    </div>

  );

}