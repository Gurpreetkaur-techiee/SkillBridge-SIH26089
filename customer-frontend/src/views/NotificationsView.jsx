import React from 'react';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  Sparkles, 
  Tag, 
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function NotificationsView() {
  const { notifications, markAllNotificationsRead, setActiveTab } = useApp();
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('navNotifications')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay updated with dispatch alerts, technician arrivals, and promotional discounts.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={CheckCheck}
          onClick={markAllNotificationsRead}
        >
          Mark all as read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <Bell className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No notifications found.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <Card
              key={n.id}
              className={`p-5 transition-all border ${
                n.unread 
                  ? 'border-blue-400/60 bg-blue-50/30 dark:bg-blue-950/20' 
                  : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-2xl shrink-0 ${
                  n.type === 'booking' 
                    ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400' 
                    : n.type === 'promo' 
                    ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400' 
                    : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {n.type === 'booking' ? (
                    <Clock className="w-5 h-5" />
                  ) : n.type === 'promo' ? (
                    <Tag className="w-5 h-5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {n.title}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {n.time}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {n.message}
                  </p>

                  {n.type === 'booking' && (
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Booking Status →
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
