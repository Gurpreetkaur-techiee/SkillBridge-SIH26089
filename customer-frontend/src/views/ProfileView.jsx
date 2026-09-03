import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  CreditCard, 
  Sun, 
  Moon, 
  Globe, 
  Plus, 
  Check, 
  Camera,
  Trash2,
  LogIn,
  LogOut,
  UserPlus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function ProfileView() {
  const { userProfile, setUserProfile } = useApp();
  const { currentUser, logout, openAuthModal } = useAuth();
  const { lang, setLang, t, supportedLanguages } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();

  const [formData, setFormData] = useState({
    name: currentUser?.displayName || userProfile.name,
    email: currentUser?.email || userProfile.email,
    phone: userProfile.phone,
    address: userProfile.address
  });

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.displayName || prev.name,
        email: currentUser.email || prev.email
      }));
    }
  }, [currentUser]);

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      ...formData
    }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header Profile Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative">
            <img
              src={currentUser?.photoURL || userProfile.avatar}
              alt={currentUser?.displayName || userProfile.name}
              className="w-20 h-20 rounded-3xl object-cover ring-4 ring-blue-500/20 shadow-md"
            />
            <button 
              onClick={() => alert("Upload photo feature ready")}
              className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-transform active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {currentUser?.displayName || userProfile.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentUser ? `Signed in as ${currentUser.email}` : 'Guest Visitor • Sign in to sync your bookings across devices'}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                currentUser 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {currentUser ? 'Verified Account' : 'Guest Mode'}
              </span>
            </div>
          </div>
        </div>

        <div>
          {currentUser ? (
            <Button
              variant="outline"
              size="sm"
              icon={LogOut}
              onClick={logout}
              className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              Sign Out
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={LogIn}
                onClick={() => openAuthModal('login')}
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={UserPlus}
                onClick={() => openAuthModal('signup')}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Details Form */}
        <Card className="p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {t('personalInfo')}
            </h3>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Default Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {isSaved ? (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Changes saved!
                </span>
              ) : <div />}

              <Button
                type="submit"
                variant="primary"
                size="sm"
              >
                Save Profile
              </Button>
            </div>
          </form>
        </Card>

        {/* Preferences & Settings */}
        <div className="space-y-6">
          <Card className="p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
              Preferences & Appearance
            </h3>

            {/* Language Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('language')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {supportedLanguages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-colors ${
                      lang === l.code
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle in Settings */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {t('themeMode')}
                </p>
                <p className="text-xs text-slate-500">
                  {isDark ? 'Dark theme active' : 'Light theme active'}
                </p>
              </div>

              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                <span>{isDark ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </Card>

          {/* Guarantee & Security */}
          <Card className="p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-sm mb-2">
              <Shield className="w-4 h-4" />
              <span>SkillBridge Trust & Security</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              All transactions and customer profiles are secured with Firebase Authentication and 256-bit encryption.
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
}
