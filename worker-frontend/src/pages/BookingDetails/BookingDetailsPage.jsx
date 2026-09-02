import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Navigation,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Share2,
  Compass,
  Radio,
  ExternalLink,
} from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import LoadingState from '../../components/LoadingState/LoadingState';
import ErrorState from '../../components/ErrorState/ErrorState';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { bookingsGateway } from '../../services/integrations';

export default function BookingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, showToast } = useApp();
  const { worker } = useAuth();

  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal actions
  const [confirmType, setConfirmType] = useState(null); // 'accept' | 'reject' | 'start' | 'complete'
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchBooking = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bookingsGateway.getBooking(id);
      if (!data) {
        setError('Booking request not found or has been withdrawn.');
      } else {
        setBooking(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load booking details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleAction = async () => {
    if (!confirmType || !booking) return;
    try {
      setIsProcessing(true);
      if (confirmType === 'accept') {
        const res = await bookingsGateway.acceptBooking(booking.id);
        showToast(t('availableBookings.acceptedSuccess'), 'success');
        setBooking(res.booking);
      } else if (confirmType === 'reject') {
        await bookingsGateway.rejectBooking(booking.id);
        showToast(t('availableBookings.rejectedSuccess'), 'info');
        navigate('/available-jobs');
        return;
      } else if (confirmType === 'start') {
        const res = await bookingsGateway.updateBookingStatus(booking.id, 'in_progress');
        showToast('Job started! Status updated to In Progress.', 'info');
        setBooking(res.booking);
      } else if (confirmType === 'complete') {
        const res = await bookingsGateway.updateBookingStatus(booking.id, 'completed');
        showToast('Job completed! Payment added to your earnings.', 'success');
        setBooking(res.booking);
      }
      setConfirmType(null);
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading booking details..." />;
  }

  if (error || !booking) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          icon={ArrowLeft}
        >
          {t('common.back')}
        </Button>
        <ErrorState
          title="Booking Not Found"
          description={error || 'This service request is either no longer available or was removed.'}
          onRetry={fetchBooking}
        />
      </div>
    );
  }

  const isAvailable = !booking.status || booking.status === 'open' || booking.status === 'pending';
  const isAccepted = booking.status === 'accepted';
  const isInProgress = booking.status === 'in_progress';
  const isCompleted = booking.status === 'completed';

  const distanceVal = booking.distanceKm || 3.5;
  const travelMinutes = Math.max(5, Math.round(distanceVal * 3));
  const workerBase = worker?.serviceArea || 'South Delhi & NCR Base';
  const customerAddress = booking.locationAddress || `${booking.city || 'Local Area'}`;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    booking.locationAddress ? `${booking.locationAddress}, ${booking.city || ''}` : booking.city || 'India'
  )}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            icon={ArrowLeft}
          >
            {t('common.back')}
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">
                #{booking.id}
              </span>
              <StatusBadge status={booking.status || 'open'} />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {booking.title || 'Service Request'}
            </h1>
          </div>
        </div>

        {/* Quick Rate tag */}
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            {t('bookingDetails.payoutEstimate')}:
          </span>
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {t('common.currencySymbol')}{booking.estimatedPayout || 0}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Service & Problem Description */}
          <Card className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> {t('bookingDetails.problemDescription')}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {booking.problemDescription || 'No additional customer notes provided.'}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">{t('bookingDetails.serviceType')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                  {t(`services.${booking.serviceCategory}`) || booking.serviceCategory}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">{t('bookingDetails.estimatedDuration')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {t('bookingDetails.durationVal', { hours: booking.estimatedHours || '1-2' })}
                </span>
              </div>
            </div>
          </Card>

          {/* Schedule */}
          <Card className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {t('bookingDetails.schedule')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">{t('common.date')}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {booking.date || 'To be determined'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">{t('common.time')}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {booking.time || 'Flexible Time'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Worker Location & Customer Proximity Route Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" /> {t('bookingDetails.routeOverview')}
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                <Radio className="w-3 h-3 animate-pulse text-blue-600" />
                Live Proximity
              </span>
            </div>

            {/* Visual Route Representation */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800/60 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-700 space-y-4">
              
              {/* Step 1: Worker Base Location */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="w-0.5 h-10 bg-gradient-to-b from-blue-600 to-emerald-500 my-1 dashed" />
                </div>
                <div className="pt-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                    {t('bookingDetails.workerBaseLocation')} (You)
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {workerBase}
                  </p>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Coverage Radius: {worker?.serviceRadiusKm || 15} km
                  </span>
                </div>
              </div>

              {/* Step 2: Distance & Travel Time Tag */}
              <div className="ml-11 -mt-2 mb-1">
                <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs text-xs">
                  <div className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{distanceVal} {t('common.km')}</span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>~{travelMinutes} mins travel</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Customer Location */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="pt-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                    {t('bookingDetails.customerLocation')}
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {customerAddress}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {booking.city || 'Local area'}
                  </p>
                </div>
              </div>
            </div>

            {/* Live sharing note & Navigation Action */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                {t('bookingDetails.liveLocationActive')}
              </p>
              
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 transition-colors shrink-0"
              >
                <span>{t('bookingDetails.directions')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>
        </div>

        {/* Right 1 Column: Customer & Action Controls */}
        <div className="space-y-6">
          
          {/* Customer Card */}
          <Card className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> {t('bookingDetails.customerInfo')}
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-extrabold text-slate-700 dark:text-slate-200 text-lg border border-slate-200 dark:border-slate-700">
                {booking.customerName ? booking.customerName.charAt(0) : 'C'}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {booking.customerName || 'Customer'}
                </h4>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold mt-0.5">
                  ★ 4.9 <span className="text-slate-400">(SkillBridge Customer)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{booking.customerPhone || '+91 ••••• ••••• (Confirmed only)'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{booking.customerEmail || 'Verified Email on File'}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => showToast(t('bookingDetails.contactPlaceholderMsg'), 'info')}
                icon={MessageSquare}
              >
                {t('bookingDetails.contactCustomer')}
              </Button>
            </div>
          </Card>

          {/* Action Card */}
          <Card className="p-6 bg-slate-50/50 dark:bg-slate-900 border-2 border-blue-600/20 dark:border-blue-500/20">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
              {t('common.actions')}
            </h3>

            <div className="space-y-3">
              {isAvailable && (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full shadow-lg shadow-blue-600/20 font-bold"
                    onClick={() => setConfirmType('accept')}
                    icon={CheckCircle2}
                  >
                    {t('common.acceptBooking')}
                  </Button>
                  <Button
                    variant="dangerOutline"
                    size="md"
                    className="w-full font-semibold"
                    onClick={() => setConfirmType('reject')}
                    icon={XCircle}
                  >
                    {t('common.rejectBooking')}
                  </Button>
                </>
              )}

              {isAccepted && (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full shadow-lg shadow-blue-600/20 font-bold"
                  onClick={() => setConfirmType('start')}
                >
                  {t('bookingDetails.startJob')}
                </Button>
              )}

              {isInProgress && (
                <Button
                  variant="success"
                  size="lg"
                  className="w-full shadow-lg shadow-emerald-600/20 font-bold"
                  onClick={() => setConfirmType('complete')}
                  icon={CheckCircle2}
                >
                  {t('bookingDetails.completeJob')}
                </Button>
              )}

              {isCompleted && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-1.5" />
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Job Completed
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Earnings settled to your balance.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!confirmType}
        onClose={() => !isProcessing && setConfirmType(null)}
        onConfirm={handleAction}
        isLoading={isProcessing}
        title={
          confirmType === 'accept'
            ? t('bookingDetails.acceptJobPrompt')
            : confirmType === 'reject'
            ? t('bookingDetails.rejectJobPrompt')
            : confirmType === 'start'
            ? 'Start this Job?'
            : 'Mark Job as Completed?'
        }
        message={
          confirmType === 'accept'
            ? t('bookingDetails.acceptJobDesc')
            : confirmType === 'reject'
            ? t('bookingDetails.rejectJobDesc')
            : confirmType === 'start'
            ? 'This will inform the customer you have begun work.'
            : 'Confirm that work is finished and verified. This will credit your earnings.'
        }
        confirmText={
          confirmType === 'accept'
            ? t('bookingDetails.confirmAccept')
            : confirmType === 'reject'
            ? t('bookingDetails.confirmReject')
            : confirmType === 'start'
            ? 'Start Work'
            : 'Complete & Settle'
        }
        type={confirmType === 'reject' ? 'danger' : 'info'}
      />
    </div>
  );
}
