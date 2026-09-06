import React, { useState, useEffect, useMemo } from 'react';
import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Briefcase,
} from 'lucide-react';

import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import BookingCard from '../../components/BookingCard/BookingCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingState from '../../components/LoadingState/LoadingState';
import ConfirmDialog from '../../components/Common/ConfirmDialog';

import { useApp } from '../../context/AppContext';
import { bookingsGateway } from '../../services/integrations';

export default function MyBookingsPage() {
  const { t, showToast } = useApp();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  /*
   * Get the tab from URL.
   *
   * Examples:
   * /my-bookings?tab=upcoming
   * /my-bookings?tab=completed
   */

  const validTabs = [
    'upcoming',
    'active',
    'completed',
    'cancelled',
  ];

  const urlTab = searchParams.get('tab');

  const initialTab =
    validTabs.includes(urlTab)
      ? urlTab
      : 'upcoming';

  const [activeTab, setActiveTab] = useState(initialTab);

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Status modal
  const [actionTarget, setActionTarget] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /*
   * Update active tab when URL changes.
   *
   * This allows dashboard cards to open
   * the correct booking tab.
   */
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');

    if (validTabs.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else {
      setActiveTab('upcoming');
    }
  }, [searchParams]);

  const fetchMyBookings = async () => {
    try {
      setIsLoading(true);

      const data =
        await bookingsGateway.getMyBookings();

      setBookings(data);
    } catch (err) {
      console.error(
        'Failed to load my bookings:',
        err
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const tabs = [
    {
      id: 'upcoming',
      label: t('myBookings.tabs.upcoming'),
      statusFilter: 'accepted',
      icon: CalendarCheck,
    },
    {
      id: 'active',
      label: t('myBookings.tabs.active'),
      statusFilter: 'in_progress',
      icon: Clock,
    },
    {
      id: 'completed',
      label: t('myBookings.tabs.completed'),
      statusFilter: 'completed',
      icon: CheckCircle2,
    },
    {
      id: 'cancelled',
      label: t('myBookings.tabs.cancelled'),
      statusFilter: [
        'cancelled',
        'rejected',
      ],
      icon: XCircle,
    },
  ];

  const currentTabConfig =
    tabs.find(
      (tab) => tab.id === activeTab
    ) || tabs[0];

  const filteredBookings = useMemo(() => {

    let list = bookings.filter((booking) => {

      if (
        Array.isArray(
          currentTabConfig.statusFilter
        )
      ) {
        return currentTabConfig.statusFilter.includes(
          booking.status
        );
      }

      return (
        booking.status ===
        currentTabConfig.statusFilter
      );

    });

    if (searchQuery.trim()) {

      const query =
        searchQuery.toLowerCase();

      list = list.filter(
        (booking) =>
          booking.title
            ?.toLowerCase()
            .includes(query) ||

          booking.serviceCategory
            ?.toLowerCase()
            .includes(query) ||

          booking.customerName
            ?.toLowerCase()
            .includes(query) ||

          booking.locationAddress
            ?.toLowerCase()
            .includes(query)
      );

    }

    return list;

  }, [
    bookings,
    currentTabConfig,
    searchQuery,
  ]);

  const handleTabChange = (tabId) => {

    setActiveTab(tabId);

    setSearchParams({
      tab: tabId,
    });

  };

  const handleStatusChange = (
    bookingId,
    newStatus
  ) => {

    setActionTarget({
      id: bookingId,
      newStatus,
    });

  };

  const handleConfirmStatus = async () => {

    if (!actionTarget) return;

    try {

      setIsProcessing(true);

      await bookingsGateway.updateBookingStatus(
        actionTarget.id,
        actionTarget.newStatus
      );

      showToast(
        actionTarget.newStatus === 'completed'
          ? 'Service marked as completed! Payment recorded.'
          : 'Service marked as in-progress.',
        'success'
      );

      setActionTarget(null);

      fetchMyBookings();

    } catch (err) {

      showToast(
        err.message ||
          'Failed to update status',
        'error'
      );

    } finally {

      setIsProcessing(false);

    }

  };

  const getEmptyStateConfig = () => {

    if (activeTab === 'upcoming') {
      return {
        title:
          t('myBookings.emptyUpcomingTitle'),

        description:
          t('myBookings.emptyUpcomingDesc'),

        actionText:
          t('myBookings.findJobsBtn'),

        onAction: () =>
          navigate('/available-jobs'),
      };
    }

    if (activeTab === 'active') {
      return {
        title:
          t('myBookings.emptyActiveTitle'),

        description:
          t('myBookings.emptyActiveDesc'),
      };
    }

    if (activeTab === 'completed') {
      return {
        title:
          t('myBookings.emptyCompletedTitle'),

        description:
          t('myBookings.emptyCompletedDesc'),
      };
    }

    return {
      title:
        t('myBookings.emptyCancelledTitle'),

      description:
        t('myBookings.emptyCancelledDesc'),
    };

  };

  const emptyConfig =
    getEmptyStateConfig();

  return (

    <div className="space-y-6 animate-in fade-in duration-200">

      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('myBookings.title')}
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t('myBookings.subtitle')}
          </p>

        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() =>
            navigate('/available-jobs')
          }
          icon={Briefcase}
          className="shrink-0 font-bold"
        >
          {t('myBookings.findJobsBtn')}
        </Button>

      </div>


      {/* Tabs and Search */}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">

        {/* Navigation Tabs */}

        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-x-auto scrollbar-none">

          {tabs.map((tab) => {

            const Icon = tab.icon;

            const count =
              bookings.filter((booking) =>

                Array.isArray(
                  tab.statusFilter
                )
                  ? tab.statusFilter.includes(
                      booking.status
                    )
                  : booking.status ===
                    tab.statusFilter

              ).length;

            const isActive =
              activeTab === tab.id;

            return (

              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  handleTabChange(tab.id)
                }
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >

                <Icon className="w-4 h-4" />

                <span>
                  {tab.label}
                </span>

                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>

              </button>

            );

          })}

        </div>


        {/* Search */}

        <div className="w-full sm:w-64">

          <Input
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(
                e.target.value
              )
            }
            icon={Search}
          />

        </div>

      </div>


      {/* Bookings List */}

      {isLoading ? (

        <LoadingState
          message="Loading your assigned bookings..."
        />

      ) : filteredBookings.length === 0 ? (

        <EmptyState
          title={emptyConfig.title}
          description={emptyConfig.description}
          icon={currentTabConfig.icon}
          actionText={emptyConfig.actionText}
          onAction={emptyConfig.onAction}
        />

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {filteredBookings.map(
            (booking) => (

              <BookingCard
                key={booking.id}
                booking={booking}

                onViewDetails={(id) =>
                  navigate(`/booking/${id}`)
                }

                onStatusChange={
                  handleStatusChange
                }
              />

            )
          )}

        </div>

      )}


      {/* Status Confirm Dialog */}

      <ConfirmDialog
        isOpen={!!actionTarget}

        onClose={() =>
          !isProcessing &&
          setActionTarget(null)
        }

        onConfirm={handleConfirmStatus}

        isLoading={isProcessing}

        title={
          actionTarget?.newStatus ===
          'completed'
            ? 'Complete this Job?'
            : 'Start working on this Job?'
        }

        message={
          actionTarget?.newStatus ===
          'completed'
            ? 'Confirming completion will record this job to your earnings ledger and notify the customer.'
            : 'Are you on-site and ready to begin work?'
        }

        confirmText={
          actionTarget?.newStatus ===
          'completed'
            ? 'Complete & Record'
            : 'Start Job'
        }

        type={
          actionTarget?.newStatus ===
          'completed'
            ? 'success'
            : 'info'
        }
      />

    </div>

  );
}