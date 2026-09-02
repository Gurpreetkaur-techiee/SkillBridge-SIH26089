import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Download, 
  Star,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function MyBookingsView() {
  const { bookings, setActiveTab } = useApp();
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  const filteredBookings = bookings.filter(b => {
    if (filter === 'active') return b.status === 'in_progress';
    if (filter === 'completed') return b.status === 'completed';
    return true;
  });

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
          onClick={() => setActiveTab('home')}
        >
          Book New Service
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All ({bookings.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors ${
            filter === 'active'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Active / En Route ({bookings.filter(b => b.status === 'in_progress').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors ${
            filter === 'completed'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Completed ({bookings.filter(b => b.status === 'completed').length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <CalendarCheck className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {t('noBookings')}
            </p>
            <Button
              variant="primary"
              size="sm"
              className="mt-4"
              onClick={() => setActiveTab('home')}
            >
              Browse Services
            </Button>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <Card
              key={booking.id}
              className={`p-6 border ${
                booking.status === 'in_progress'
                  ? 'border-blue-500/50 bg-white dark:bg-slate-900 shadow-md'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Worker & Service Information */}
                <div className="flex items-start gap-4">
                  <img
                    src={booking.workerAvatar}
                    alt={booking.workerName}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/30 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        #{booking.id}
                      </span>
                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                        booking.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {booking.statusLabel}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {booking.serviceName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Assigned Professional: <span className="font-semibold text-slate-700 dark:text-slate-300">{booking.workerName}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span className="truncate max-w-[200px]">{booking.address}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount and Action Buttons */}
                <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800 gap-3 shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Amount</span>
                    <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                      {booking.amount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {booking.status === 'in_progress' ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          icon={Phone}
                          onClick={() => alert(`Calling ${booking.workerName}...`)}
                        >
                          Contact Pro
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => alert(`Live GPS Tracking for pro ${booking.workerName} arriving at your address!`)}
                        >
                          Live GPS
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          icon={Download}
                          onClick={() => alert("Invoice downloaded successfully.")}
                        >
                          Receipt
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={Star}
                          onClick={() => alert("Thank you for your rating!")}
                        >
                          Rate Pro
                        </Button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
