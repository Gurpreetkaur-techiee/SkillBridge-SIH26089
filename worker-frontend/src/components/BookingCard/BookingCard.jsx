import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Navigation,
  User,
  ChevronRight,
  Check,
  X,
} from 'lucide-react';

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

  const isAvailableStatus =
    !booking.status ||
    booking.status === 'open' ||
    booking.status === 'pending';

  const isUpcoming = booking.status === 'accepted';
  const isActive = booking.status === 'in_progress';
  const isCompleted = booking.status === 'completed';

  const serviceName =
    t(`services.${booking.serviceCategory}`) ||
    booking.serviceCategory ||
    'Service Request';

  return (
    <Card
      hoverEffect
      padding="default"
      className={`flex flex-col h-full transition-all duration-200 ${className}`}
    >
      <div className="flex flex-col flex-1">

        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900 text-xs font-bold">
              {serviceName}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {booking.isUrgent && (
              <span className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 border border-rose-100 dark:border-rose-900 text-[10px] font-bold uppercase tracking-wide">
                Urgent
              </span>
            )}

            {!isAvailableStatus && (
              <StatusBadge
                status={booking.status}
                size="xs"
              />
            )}
          </div>
        </div>

        {/* Request title */}
        <div className="mb-4">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight line-clamp-1">
            {booking.title || 'Service Request'}
          </h3>

          {booking.problemDescription && (
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
              {booking.problemDescription}
            </p>
          )}
        </div>

        {/* Customer */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
            {booking.customerName ? (
              <span className="text-xs font-bold">
                {booking.customerName.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {booking.customerName || 'Customer'}
            </p>

            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Service request
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 py-4 border-y border-slate-100 dark:border-slate-800">

          {/* Date */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Date
              </p>

              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                {booking.date || 'TBD'}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Time
              </p>

              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                {booking.time || 'Flexible'}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Location
              </p>

              <p
                className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate"
                title={booking.locationAddress}
              >
                {booking.locationAddress || 'Local area'}
              </p>
            </div>
          </div>

          {/* Distance */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center shrink-0">
              <Navigation className="w-3.5 h-3.5 text-blue-500" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Distance
              </p>

              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                {booking.distanceKm
                  ? `${booking.distanceKm} ${t('common.km')}`
                  : 'Nearby'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom information */}
        <div className="flex items-center justify-between gap-3 py-4">
          <div>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
              Estimated payout
            </p>

            <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
              {t('common.currencySymbol')}
              {booking.estimatedPayout || 0}
            </p>
          </div>

          {isAvailableStatus && (
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              New request
            </span>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">

            {/* Available request actions */}
            {isAvailableStatus && (
              <div className="flex items-center gap-2 w-full">

                {onReject && (
                  <Button
                    variant="dangerOutline"
                    size="sm"
                    onClick={() => onReject(booking)}
                    className="flex-1 min-w-0 whitespace-nowrap"
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
                    className="flex-1 min-w-0 whitespace-nowrap"
                    icon={Check}
                  >
                    {t('common.accept')}
                  </Button>
                )}

                {onViewDetails && (
                  <button
                    type="button"
                    onClick={() => onViewDetails(booking.id)}
                    title={t('common.viewDetails')}
                    className="
                      flex-1
                      min-w-0
                      h-10
                      px-3
                      rounded-xl
                      border
                      border-slate-300
                      dark:border-slate-700
                      bg-transparent
                      text-slate-700
                      dark:text-slate-200
                      hover:bg-slate-50
                      dark:hover:bg-slate-800
                      transition-colors
                      flex
                      items-center
                      justify-center
                      gap-1.5
                    "
                  >
                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                      {t('common.viewDetails')}
                    </span>

                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                )}
              </div>
            )}

            {/* Upcoming booking actions */}
            {isUpcoming && onStatusChange && (
              <div className="flex items-center gap-2 w-full">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    onStatusChange(booking.id, 'in_progress')
                  }
                  className="flex-1"
                >
                  {t('bookingDetails.startJob')}
                </Button>

                {onViewDetails && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(booking.id)}
                    className="px-3 shrink-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Active booking actions */}
            {isActive && onStatusChange && (
              <Button
                variant="success"
                size="sm"
                onClick={() =>
                  onStatusChange(booking.id, 'completed')
                }
                className="w-full"
              >
                {t('bookingDetails.completeJob')}
              </Button>
            )}

            {/* Completed booking actions */}
            {isCompleted && onViewDetails && (
              <button
                type="button"
                onClick={() => onViewDetails(booking.id)}
                className="
                  w-full
                  min-h-10
                  px-4
                  py-2.5
                  rounded-xl
                  bg-slate-200
                  dark:bg-slate-800
                  text-slate-800
                  dark:text-slate-200
                  hover:bg-slate-300
                  dark:hover:bg-slate-700
                  transition-colors
                  flex
                  items-center
                  justify-center
                  gap-1.5
                "
              >
                <span className="text-xs sm:text-sm font-medium">
                  {t('common.viewDetails')}
                </span>

                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            )}

          </div>
        )}
      </div>
    </Card>
  );
}