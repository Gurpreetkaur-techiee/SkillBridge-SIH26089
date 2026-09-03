import React from 'react';
import { 
  Home, 
  Search, 
  CalendarCheck, 
  Bell, 
  User, 
  X, 
  Sparkles, 
  Briefcase, 
  ShieldCheck,
  LogIn,
  UserPlus,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export function MobileNav({ isOpen, onClose }) {
  const { activeTab, setActiveTab, unreadNotificationsCount, bookings } = useApp();
  const { t } = useLanguage();
  const { currentUser, logout, openAuthModal } = useAuth();

  const activeBookingsCount = bookings.filter(b => b.status === 'in_progress').length;

  const navItems = [
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'workers', label: t('navFindWorkers'), icon: Search },
    { id: 'bookings', label: t('navBookings'), icon: CalendarCheck, badge: activeBookingsCount },
    { id: 'notifications', label: t('navNotifications'), icon: Bell, badge: unreadNotificationsCount },
    { id: 'profile', label: t('navProfile'), icon: User }
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Drawer Sidebar */}
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white dark:bg-slate-900 shadow-2xl p-6 flex flex-col justify-between z-10 transition-transform overflow-y-auto">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">SkillBridge</h3>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase">Customer</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Card or Auth Buttons in Drawer */}
              <div className="py-4 border-b border-slate-100 dark:border-slate-800">
                {currentUser ? (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                    <img
                      src={currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'}
                      alt={currentUser.displayName || 'User'}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/30"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {currentUser.displayName || 'Customer Pro'}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={LogIn}
                      onClick={() => {
                        onClose();
                        openAuthModal('login');
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={UserPlus}
                      onClick={() => {
                        onClose();
                        openAuthModal('signup');
                      }}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>

              {/* Navigation Items */}
              <nav className="mt-4 space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge > 0 && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-rose-500 text-white font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Guarantee & Sign Out */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {currentUser && (
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}

              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40">
                <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Guaranteed</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  Trusted on-demand home & auto professionals.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Bar for Small Screens */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-2 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 relative transition-all ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 truncate max-w-[60px]">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
