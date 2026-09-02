import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  House,
  Briefcase,
  CalendarCheck,
  Bell,
  Wallet,
  User,
  Settings,
  LogOut,
  Sparkles,
  ShieldCheck,
  Power,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import ToggleSwitch from '../Common/ToggleSwitch';

export default function Sidebar({ onClose, isMobile = false }) {
  const { t, isAvailable, toggleAvailability, isUpdatingAvailability } = useApp();
  const { worker, logout } = useAuth();

  const navItems = [
    { to: '/dashboard', label: t('nav.home'), icon: House, exact: true },
    { to: '/available-jobs', label: t('nav.availableJobs'), icon: Briefcase },
    { to: '/my-bookings', label: t('nav.myBookings'), icon: CalendarCheck },
    { to: '/notifications', label: t('nav.notifications'), icon: Bell },
    { to: '/earnings', label: t('nav.earnings'), icon: Wallet },
    { to: '/profile', label: t('nav.profile'), icon: User },
    { to: '/settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <aside className="w-64 h-full flex flex-col justify-between p-4 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 select-none">
      <div className="space-y-6">
        
        {/* Availability Card in Sidebar */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isAvailable ? t('common.online') : t('common.offline')}
              </span>
            </div>
            <ToggleSwitch
              size="sm"
              checked={isAvailable}
              onChange={toggleAvailability}
              disabled={isUpdatingAvailability}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            {isAvailable ? t('dashboard.availabilityBannerActive') : t('dashboard.availabilityBannerInactive')}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={isMobile ? onClose : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        {worker && (
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300 text-sm shrink-0">
              {worker.fullName ? worker.fullName.charAt(0) : 'W'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {worker.fullName || 'Worker'}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3 h-3 shrink-0" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            if (isMobile && onClose) onClose();
            logout();
          }}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </aside>
  );
}
