import React from 'react';
import { 
  Home, 
  Search, 
  CalendarCheck, 
  Bell, 
  User, 
  HelpCircle, 
  Briefcase, 
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export function Sidebar({ className = '' }) {
  const { activeTab, setActiveTab, unreadNotificationsCount, bookings } = useApp();
  const { t } = useLanguage();

  const activeBookingsCount = bookings.filter(b => b.status === 'in_progress').length;

  const navItems = [
    {
      id: 'home',
      label: t('navHome'),
      icon: Home,
      badge: null
    },
    {
      id: 'workers',
      label: t('navFindWorkers'),
      icon: Search,
      badge: null
    },
    {
      id: 'bookings',
      label: t('navBookings'),
      icon: CalendarCheck,
      badge: activeBookingsCount > 0 ? activeBookingsCount : null,
      badgeColor: 'bg-blue-600 text-white'
    },
    {
      id: 'notifications',
      label: t('navNotifications'),
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'profile',
      label: t('navProfile'),
      icon: User,
      badge: null
    }
  ];

  return (
    <aside className={`w-64 flex flex-col justify-between shrink-0 h-[calc(100vh-5rem)] sticky top-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-r border-slate-200/80 dark:border-slate-800/80 p-4 transition-colors ${className}`}>
      
      {/* Navigation Links */}
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Main Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 select-none group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 dark:shadow-blue-900/30'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  ) : (
                    isActive && <ChevronRight className="w-4 h-4 text-blue-200" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Guarantee Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-blue-950/40 border border-blue-100/80 dark:border-blue-900/40">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-xs font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>SkillBridge Guarantee</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Every booking is backed by 100% verified workers & property protection coverage.
          </p>
        </div>
      </div>

      {/* Bottom Area: Worker Switch Mode Teaser & Support */}
      <div className="space-y-2 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <button
          onClick={() => {
            alert("Worker side portal is in development and will be connected seamlessly!");
          }}
          className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors text-left group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Earn as a Worker
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Join our pro network
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{t('navHelp')}</span>
        </button>
      </div>

    </aside>
  );
}
