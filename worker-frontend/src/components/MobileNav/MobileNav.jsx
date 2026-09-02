import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, CalendarCheck, Wallet, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MobileNav() {
  const { t } = useApp();

  const navItems = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/available-jobs', label: t('nav.availableJobs'), icon: Briefcase },
    { to: '/my-bookings', label: t('nav.myBookings'), icon: CalendarCheck },
    { to: '/earnings', label: t('nav.earnings'), icon: Wallet },
    { to: '/profile', label: t('nav.profile'), icon: User },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 pb-safe transition-colors duration-200"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 text-center transition-all ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] truncate max-w-[64px]">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
