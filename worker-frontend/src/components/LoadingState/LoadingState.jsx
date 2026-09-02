import React from 'react';
import { useApp } from '../../context/AppContext';

export default function LoadingState({ message, className = '', height = 'min-h-[260px]' }) {
  const { t } = useApp();
  const displayMessage = message || t('common.loading');

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 ${height} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-3 border-blue-100 dark:border-blue-950 border-t-blue-600 animate-spin" />
        <div className="absolute w-6 h-6 rounded-full bg-blue-600/10 dark:bg-blue-400/10" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">
        {displayMessage}
      </p>
    </div>
  );
}
