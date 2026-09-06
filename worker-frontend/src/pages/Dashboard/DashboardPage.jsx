import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Inbox,
  CalendarCheck,
  CheckCircle2,
  Wallet,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

import StatCard from '../../components/Common/StatCard';
import Button from '../../components/Common/Button';
import BookingCard from '../../components/BookingCard/BookingCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingState from '../../components/LoadingState/LoadingState';
import ConfirmDialog from '../../components/Common/ConfirmDialog';

import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { bookingsGateway, earningsGateway } from '../../services/integrations';

export default function DashboardPage() {
  const { t, isAvailable, toggleAvailability, showToast } = useApp();
  const { worker } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [availableRequests, setAvailableRequests] = useState([]);

  const [stats, setStats] = useState({
    newRequests: 0,
    upcomingJobs: 0,
    completedJobs: 0,
    totalEarnings: 0,
  });

  // Modal confirm actions
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const [available, myBookings, earnings] = await Promise.all([
        bookingsGateway.getAvailableBookings(),
        bookingsGateway.getMyBookings(),
        earningsGateway.getEarningsSummary(),
      ]);

      const upcomingCount = myBookings.filter(
        (b) => b.status === 'accepted'
      ).length;

      const completedCount =
        myBookings.filter((b) => b.status === 'completed').length ||
        earnings.completedJobsCount ||
        0;

      setAvailableRequests(available);

      setStats({
        newRequests: available.length,
        upcomingJobs: upcomingCount,
        completedJobs: completedCount,
        totalEarnings: earnings.totalEarnings || 0,
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return t('dashboard.greetingMorning');
    }

    if (hour < 17) {
      return t('dashboard.greetingAfternoon');
    }

    return t('dashboard.greetingEvening');
  };

  const handleOpenConfirm = (booking, type) => {
    setSelectedBooking(booking);
    setActionType(type);
  };

  const handleCloseConfirm = () => {
    if (isProcessingAction) return;

    setSelectedBooking(null);
    setActionType(null);
  };

  const handleConfirmAction = async () => {
    if (!selectedBooking || !actionType) return;

    try {
      setIsProcessingAction(true);

      if (actionType === 'accept') {
        await bookingsGateway.acceptBooking(selectedBooking.id);

        showToast(
          t('availableBookings.acceptedSuccess'),
          'success'
        );
      } else {
        await bookingsGateway.rejectBooking(selectedBooking.id);

        showToast(
          t('availableBookings.rejectedSuccess'),
          'info'
        );
      }

      handleCloseConfirm();
      fetchDashboardData();
    } catch (err) {
      showToast(
        err.message || 'Action failed',
        'error'
      );
    } finally {
      setIsProcessingAction(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg shadow-blue-600/15">

        <div>
          <div className="flex items-center gap-2 mb-2">

            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs rounded-full">
              {worker?.primaryService
                ? t(`services.${worker.primaryService}`) ||
                  worker.primaryService
                : 'Service Pro'}
            </span>

            <span className="flex items-center gap-1 text-[11px] font-medium text-blue-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('profile.verifiedWorker')}
            </span>

          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {getGreeting()}, {worker?.fullName || 'Worker'}!
          </h1>

          <p className="mt-1 text-sm text-blue-100 max-w-xl">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/available-jobs')}
            className="bg-white hover:bg-blue-50 text-blue-700 font-bold shadow-xs border-0"
            icon={Briefcase}
          >
            {t('nav.availableJobs')}
          </Button>
        </div>

      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

        {/* New Requests */}
        <StatCard
          title={t('dashboard.stats.newRequests')}
          value={stats.newRequests}
          subtitle={t('dashboard.stats.newRequestsSub')}
          icon={Inbox}
          color="blue"
          onClick={() => navigate('/available-jobs')}
        />

        {/* Upcoming Jobs */}
        <StatCard
          title={t('dashboard.stats.upcomingJobs')}
          value={stats.upcomingJobs}
          subtitle={t('dashboard.stats.upcomingJobsSub')}
          icon={CalendarCheck}
          color="amber"
          onClick={() =>
            navigate('/my-bookings?tab=upcoming')
          }
        />

        {/* Completed Jobs */}
        <StatCard
          title={t('dashboard.stats.completedJobs')}
          value={stats.completedJobs}
          subtitle={t('dashboard.stats.completedJobsSub')}
          icon={CheckCircle2}
          color="emerald"
          onClick={() =>
            navigate('/my-bookings?tab=completed')
          }
        />

        {/* Total Earnings */}
        <StatCard
          title={t('dashboard.stats.totalEarnings')}
          value={`${t('common.currencySymbol')}${stats.totalEarnings}`}
          subtitle={t('dashboard.stats.totalEarningsSub')}
          icon={Wallet}
          color="purple"
          onClick={() => navigate('/earnings')}
        />

      </div>

      {/* Availability Notice */}
      {!isAvailable && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3 text-amber-800 dark:text-amber-200 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />

            <span>
              {t('dashboard.availabilityBannerInactive')}
            </span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={toggleAvailability}
            className="shrink-0 font-bold"
          >
            {t('dashboard.toggleAvailability')}
          </Button>

        </div>
      )}

      {/* Available Booking Requests */}
      <div className="space-y-4">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('dashboard.availableRequestsTitle')}
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('dashboard.availableRequestsSubtitle')}
            </p>
          </div>

          <Link
            to="/available-jobs"
            className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 group"
          >
            <span>
              {t('dashboard.viewAllJobs')}
            </span>

            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

        </div>

        {isLoading ? (

          <LoadingState
            message="Checking for nearby service requests..."
          />

        ) : availableRequests.length === 0 ? (

          <EmptyState
            title={t('dashboard.noRequestsTitle')}
            description={t('dashboard.noRequestsDesc')}
            icon={Inbox}
            actionText={t('availableBookings.title')}
            onAction={() => navigate('/available-jobs')}
          />

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {availableRequests.slice(0, 2).map((booking) => (

              <BookingCard
                key={booking.id}
                booking={booking}
                onViewDetails={(id) =>
                  navigate(`/booking/${id}`)
                }
                onAccept={(b) =>
                  handleOpenConfirm(b, 'accept')
                }
                onReject={(b) =>
                  handleOpenConfirm(b, 'reject')
                }
              />

            ))}

          </div>

        )}

      </div>

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!selectedBooking}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmAction}
        isLoading={isProcessingAction}
        title={
          actionType === 'accept'
            ? t('bookingDetails.acceptJobPrompt')
            : t('bookingDetails.rejectJobPrompt')
        }
        message={
          actionType === 'accept'
            ? t('bookingDetails.acceptJobDesc')
            : t('bookingDetails.rejectJobDesc')
        }
        confirmText={
          actionType === 'accept'
            ? t('bookingDetails.confirmAccept')
            : t('bookingDetails.confirmReject')
        }
        cancelText={t('common.cancel')}
        type={
          actionType === 'accept'
            ? 'info'
            : 'danger'
        }
      />

    </div>
  );
}