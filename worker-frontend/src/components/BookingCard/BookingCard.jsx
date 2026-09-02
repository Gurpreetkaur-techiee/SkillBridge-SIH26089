import React from 'react';
import { Calendar, Clock, MapPin, Navigation, User, ChevronRight, Check, X, ArrowRight } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import StatusBadge from '../StatusBadge/StatusBadge';
import { useApp } from '../../context/AppContext';

export default function BookingCard({
  booking,
  onViewDetails,
  onAccept,
  onReject,
  onStatusChange,
  showActions = true,
  className = '',
}) {
  const { t } = useApp();

  if (!booking) return null;

  const isAvailableStatus = !booking.status || booking.status === 'open' || booking.status === 'pending';
  const isUpcoming = booking.status === 'accepted';
  const isActive = booking.status === 'in_progress';
  const isCompleted = booking.status === 'completed';

  return (
    <Card
      hoverEffect
      className={`flex flex-col justify-between transition-all duration-200 ${className}`}
      padding="default"
    >
      <div>
        {/* Top Header: Service Badge & Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
              {t(`services.${booking.serviceCategory}`) || booking.serviceCategory || 'Service'}
            </span>
            {booking.isUrgent && (
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                Urgent
              </span>
            )}
          </div>
          <StatusBadge status={booking.status || 'open'} size="xs" />
        </div>

        {/* Title & Customer Request */}
        <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 mb-1.5">
          {booking.title || 'Service Request'}
        </h4>

        {booking.problemDescription && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {booking.problemDescription}
          </p>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-slate-100 dark:border-slate-800 text-xs mb-4">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{booking.date || 'TBD'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{booking.time || 'Flexible'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate" title={booking.locationAddress}>
              {booking.locationAddress || 'Local area'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Navigation className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {booking.distanceKm ? `${booking.distanceKm} ${t('common.km')}` : 'Nearby'}
            </span>
          </div>
        </div>

        {/* Price & Customer row */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 text-xs font-bold">
              {booking.customerName ? booking.customerName.charAt(0) : <User className="w-3.5 h-3.5" />}
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
              {booking.customerName || 'Customer'}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 dark:text-slate-500 block leading-tight">
              {t('common.rate')}
            </span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400">
              {t('common.currencySymbol')}{booking.estimatedPayout || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="pt-2 flex items-center gap-2">
          {isAvailableStatus && (
            <>
              {onReject && (
                <Button
                  variant="dangerOutline"
                  size="sm"
                  onClick={() => onReject(booking)}
                  className="flex-1"
                  icon={X}
                >
                  {t('common.decline')}
                </Button>
              )}
              {onAccept && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAccept(booking)}
                  className="flex-1"
                  icon={Check}
                >
                  {t('common.accept')}
                </Button>
              )}
            </>
          )}

          {isUpcoming && onStatusChange && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onStatusChange(booking.id, 'in_progress')}
              className="flex-1"
            >
              {t('bookingDetails.startJob')}
            </Button>
          )}

          {isActive && onStatusChange && (
            <Button
              variant="success"
              size="sm"
              onClick={() => onStatusChange(booking.id, 'completed')}
              className="flex-1"
            >
              {t('bookingDetails.completeJob')}
            </Button>
          )}

          {onViewDetails && (
            <Button
              variant={isAvailableStatus ? 'outline' : 'secondary'}
              size="sm"
              onClick={() => onViewDetails(booking.id)}
              className={isAvailableStatus ? 'px-2.5' : 'w-full'}
              title={t('common.viewDetails')}
            >
              <span className={isAvailableStatus ? 'hidden sm:inline' : 'inline'}>
                {t('common.viewDetails')}
              </span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
