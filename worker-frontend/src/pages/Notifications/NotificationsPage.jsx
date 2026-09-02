import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Wallet,
  Calendar,
  ShieldCheck,
  Check,
  Clock,
  Briefcase,
} from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingState from '../../components/LoadingState/LoadingState';
import { useApp } from '../../context/AppContext';
import { notificationsGateway } from '../../services/integrations';

export default function NotificationsPage() {
  const { t, showToast } = useApp();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'unread' | 'booking' | 'payout' | 'system'

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationsGateway.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsGateway.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsGateway.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showToast('All notifications marked as read', 'info');
    } catch (err) {
      showToast('Failed to mark all as read', 'error');
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'booking_request':
        return <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'booking_accepted':
      case 'job_completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'payout':
        return <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'system':
      case 'profile_verified':
        return <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'unread') return !n.isRead;
    if (filterType === 'booking') return n.type?.startsWith('booking');
    if (filterType === 'payout') return n.type === 'payout';
    if (filterType === 'system') return n.type === 'system' || n.type === 'profile_verified';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('notifications.title')}
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                {unreadCount} {t('notifications.unread')}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t('notifications.subtitle')}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            icon={Check}
            className="shrink-0 font-semibold text-xs"
          >
            {t('notifications.markAllRead')}
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-x-auto">
        {[
          { id: 'all', label: t('notifications.all') },
          { id: 'unread', label: t('notifications.unread') },
          { id: 'booking', label: t('notifications.bookingAlerts') },
          { id: 'payout', label: t('notifications.payoutAlerts') },
          { id: 'system', label: t('notifications.systemAlerts') },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterType === tab.id
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <LoadingState message="Loading your notifications..." />
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          title={t('notifications.emptyTitle')}
          description={t('notifications.emptyDesc')}
          icon={Bell}
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => (
            <Card
              key={item.id}
              onClick={() => !item.isRead && handleMarkAsRead(item.id)}
              className={`p-4 sm:p-5 transition-all cursor-pointer flex items-start gap-4 ${
                !item.isRead
                  ? 'bg-blue-50/30 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-900/50 shadow-xs'
                  : 'opacity-90'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shrink-0">
                {getIconForType(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-sm tracking-tight ${
                      !item.isRead
                        ? 'font-extrabold text-slate-900 dark:text-white'
                        : 'font-semibold text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">
                    {item.timestamp || 'Just now'}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.message}
                </p>

                {!item.isRead && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                      {t('notifications.unreadBadge')}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
