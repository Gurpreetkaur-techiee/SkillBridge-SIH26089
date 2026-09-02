import React from 'react';
import { 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ChevronRight, 
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function RecentBookingsPreview() {
  const { bookings, setActiveTab } = useApp();
  const { t } = useLanguage();

  const activeBookings = bookings.filter(b => b.status === 'in_progress');

  if (activeBookings.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Live Service In-Progress
          </h3>
        </div>
        <button
          onClick={() => setActiveTab('bookings')}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          All Bookings <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeBookings.map((booking) => (
          <Card
            key={booking.id}
            className="p-5 border-l-4 border-l-blue-600 bg-white dark:bg-slate-900 shadow-soft"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={booking.workerAvatar}
                  alt={booking.workerName}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/30"
                />
                <div>
                  <span className="text-[11px] font-mono font-semibold text-slate-400">
                    #{booking.id}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {booking.serviceName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pro: {booking.workerName}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {booking.statusLabel}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span className="truncate max-w-[220px]">{booking.address}</span>
                </span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {booking.eta || "En route"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                {booking.amount}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  icon={Phone}
                  onClick={() => alert(`Calling pro ${booking.workerName}...`)}
                >
                  Call
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setActiveTab('bookings')}
                >
                  Track Live
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
