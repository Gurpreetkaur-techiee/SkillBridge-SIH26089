import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Globe,
  Bell,
  Lock,
  Shield,
  Save,
  Check,
} from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import ToggleSwitch from '../../components/Common/ToggleSwitch';
import Select from '../../components/Common/Select';
import Input from '../../components/Common/Input';
import { useApp } from '../../context/AppContext';

export default function SettingsPage() {
  const { theme, setTheme, language, setLanguage, availableLanguages, t, showToast } = useApp();

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSavePreferences = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Settings and preferences saved successfully!', 'success');
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('settings.title')}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* 1. Appearance & Theme */}
      <Card className="p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-2">
          <Sun className="w-4 h-4" /> {t('settings.appearance')}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          {t('settings.appearanceDesc')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <Sun className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className="text-sm font-bold block">{t('settings.lightMode')}</span>
              <span className="text-xs text-slate-400">Soft neutral background</span>
            </div>
            {theme === 'light' && (
              <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 ml-auto shrink-0" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 shadow-2xs">
              <Moon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <span className="text-sm font-bold block">{t('settings.darkMode')}</span>
              <span className="text-xs text-slate-400">Dark slate & navy surfaces</span>
            </div>
            {theme === 'dark' && (
              <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 ml-auto shrink-0" />
            )}
          </button>
        </div>
      </Card>

      {/* 2. Language Preference */}
      <Card className="p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-2">
          <Globe className="w-4 h-4" /> {t('settings.languageSection')}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          {t('settings.languageDesc')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {availableLanguages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20 font-bold'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <span className="text-sm font-bold block">{lang.nativeName}</span>
                  <span className="text-xs text-slate-400">{lang.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </Card>

      {/* 3. Notifications */}
      <Card className="p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4" /> {t('settings.notificationsSection')}
        </h3>

        <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex items-center justify-between pt-3 first:pt-0">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                {t('settings.emailNotifications')}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Receive instant emails when new bookings are available in your radius.
              </span>
            </div>
            <ToggleSwitch
              checked={notifications.email}
              onChange={(val) => setNotifications({ ...notifications, email: val })}
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                {t('settings.smsNotifications')}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Receive SMS reminders 2 hours before scheduled appointments.
              </span>
            </div>
            <ToggleSwitch
              checked={notifications.sms}
              onChange={(val) => setNotifications({ ...notifications, sms: val })}
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                {t('settings.pushNotifications')}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Get real-time browser alerts for incoming job offers and customer messages.
              </span>
            </div>
            <ToggleSwitch
              checked={notifications.push}
              onChange={(val) => setNotifications({ ...notifications, push: val })}
            />
          </div>
        </div>
      </Card>

      {/* 4. Security */}
      <Card className="p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4" /> {t('settings.security')}
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
              {t('settings.changePassword')}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Update your secret login password regularly for account protection.
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => showToast('Password reset link sent to your registered email.', 'info')}
          >
            {t('settings.changePassword')}
          </Button>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSavePreferences}
          isLoading={isSaving}
          icon={Save}
          className="font-bold shadow-lg shadow-blue-600/20"
        >
          {t('common.saveChanges')}
        </Button>
      </div>
    </div>
  );
}
