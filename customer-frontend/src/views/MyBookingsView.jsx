import React, { useState } from 'react';
import {
  CalendarCheck,
  Clock,
  MapPin,
  Phone,
  Download,
  Star,
  Plus,
  XCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function MyBookingsView() {
  const {
    bookings,
    setActiveTab,
    removeBooking
  } = useApp();

  const { t } = useLanguage();

  const [filter, setFilter] =
    useState('all');

  const [removingBookingId, setRemovingBookingId] =
    useState(null);

  // =================================================
  // FILTER BOOKINGS
  // =================================================

  const filteredBookings =
    bookings.filter((booking) => {
      if (filter === 'active') {
        return (
          booking.status ===
          'in_progress'
        );
      }

      if (filter === 'completed') {
        return (
          booking.status ===
          'completed'
        );
      }

      return true;
    });

  // =================================================
  // STATUS DISPLAY
  // =================================================

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Booking Pending';

      case 'accepted':
        return 'Booking Accepted';

      case 'in_progress':
        return 'In Progress';

      case 'completed':
        return 'Completed';

      case 'rejected':
        return 'Rejected';

      case 'cancelled':
        return 'Cancelled';

      case 'open':
        return 'Open Request';

      default:
        return 'Booking Status';
    }
  };

  // =================================================
  // CANCEL BOOKING
  // =================================================

  const handleRemoveBooking =
    async (booking) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to cancel the booking for ${booking.serviceName}?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setRemovingBookingId(
          booking.id
        );

        await removeBooking(
          booking.id
        );
      } catch (error) {
        console.error(
          'Error cancelling booking:',
          error
        );

        window.alert(
          error.message ||
            'Unable to cancel this booking.'
        );
      } finally {
        setRemovingBookingId(
          null
        );
      }
    };

  // =================================================
  // UI
  // =================================================

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('navBookings')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track real-time progress and history of all your booked home and auto services.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() =>
            setActiveTab('home')
          }
        >
          Book New Service
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">

        {/* All */}
        <button
          onClick={() =>
            setFilter('all')
          }
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All ({bookings.length})
        </button>

        {/* Active */}
        <button
          onClick={() =>
            setFilter('active')
          }
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors ${
            filter === 'active'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Active / En Route (
          {
            bookings.filter(
              (booking) =>
                booking.status ===
                'in_progress'
            ).length
          }
          )
        </button>

        {/* Completed */}
        <button
          onClick={() =>
            setFilter('completed')
          }
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors ${
            filter === 'completed'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Completed (
          {
            bookings.filter(
              (booking) =>
                booking.status ===
                'completed'
            ).length
          }
          )
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">

        {filteredBookings.length ===
        0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">

            <CalendarCheck className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />

            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {t('noBookings')}
            </p>

            <Button
              variant="primary"
              size="sm"
              className="mt-4"
              onClick={() =>
                setActiveTab('home')
              }
            >
              Browse Services
            </Button>

          </div>
        ) : (

          filteredBookings.map(
            (booking) => {

              const statusLabel =
                getStatusLabel(
                  booking.status
                );

              return (
                <Card
                  key={booking.id}
                  className={`p-6 border ${
                    booking.status ===
                    'in_progress'
                      ? 'border-blue-500/50 bg-white dark:bg-slate-900 shadow-md'
                      : 'border-slate-200/80 dark:border-slate-800'
                  }`}
                >

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    {/* Worker & Service Information */}
                    <div className="flex items-start gap-4">

                      <img
                        src={
                          booking.workerAvatar
                        }
                        alt={
                          booking.workerName
                        }
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/30 shrink-0"
                      />

                      <div className="min-w-0">

                        <div className="flex items-center gap-2 flex-wrap">

                          <span className="font-mono text-xs font-bold text-slate-400">
                            #{booking.id}
                          </span>

                          {/* STATUS BADGE */}
                          <span
                            className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                              booking.status ===
                              'in_progress'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                : booking.status ===
                                  'pending'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : booking.status ===
                                  'completed'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : booking.status ===
                                  'accepted'
                                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                                : booking.status ===
                                  'rejected'
                                ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                : booking.status ===
                                  'cancelled'
                                ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {statusLabel}
                          </span>

                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                          {booking.serviceName}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Assigned Professional:{' '}
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {booking.workerName}
                          </span>
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">

                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {booking.date}
                          </span>

                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />

                            <span className="truncate max-w-[200px]">
                              {booking.address}
                            </span>
                          </span>

                        </div>
                      </div>
                    </div>

                    {/* Amount and Action Buttons */}
                    <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800 gap-3 shrink-0">

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                          Total Amount
                        </span>

                        <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                          ₹{booking.amount}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2">

                        {/* Cancel Pending Booking */}
                        {booking.status ===
                          'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            icon={XCircle}
                            disabled={
                              removingBookingId ===
                              booking.id
                            }
                            onClick={() =>
                              handleRemoveBooking(
                                booking
                              )
                            }
                            className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:border-rose-900 dark:hover:bg-rose-950/40"
                          >
                            {removingBookingId ===
                            booking.id
                              ? 'Cancelling...'
                              : 'Cancel Booking'}
                          </Button>
                        )}

                        {/* Active Booking */}
                        {booking.status ===
                          'in_progress' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              icon={Phone}
                              onClick={() =>
                                window.alert(
                                  `Calling ${booking.workerName}...`
                                )
                              }
                            >
                              Contact Pro
                            </Button>

                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() =>
                                window.alert(
                                  `Live GPS Tracking for pro ${booking.workerName} arriving at your address!`
                                )
                              }
                            >
                              Live GPS
                            </Button>
                          </>
                        )}

                        {/* Completed Booking */}
                        {booking.status ===
                          'completed' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              icon={Download}
                              onClick={() =>
                                window.alert(
                                  'Invoice downloaded successfully.'
                                )
                              }
                            >
                              Receipt
                            </Button>

                            <Button
                              size="sm"
                              variant="secondary"
                              icon={Star}
                              onClick={() =>
                                window.alert(
                                  'Thank you for your rating!'
                                )
                              }
                            >
                              Rate Pro
                            </Button>
                          </>
                        )}

                        {/* Fallback actions */}
                        {booking.status !==
                          'pending' &&
                          booking.status !==
                            'in_progress' &&
                          booking.status !==
                            'completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              icon={Download}
                              onClick={() =>
                                window.alert(
                                  'Invoice downloaded successfully.'
                                )
                              }
                            >
                              Receipt
                            </Button>
                          )}

                      </div>
                    </div>

                  </div>
                </Card>
              );
            }
          )

        )}

      </div>
    </div>
  );
}