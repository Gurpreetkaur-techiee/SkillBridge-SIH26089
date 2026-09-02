import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from '../Common/Button';
import { useApp } from '../../context/AppContext';

export default function ErrorState({
  title,
  description,
  onRetry,
  className = '',
  height = 'min-h-[280px]',
}) {
  const { t } = useApp();
  const displayTitle = title || t('errorState.defaultTitle');
  const displayDesc = description || t('errorState.defaultDesc');

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-10 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 ${height} ${className}`}
    >
      <div className="p-3.5 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5">
        {displayTitle}
      </h4>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {displayDesc}
      </p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          {t('errorState.retryBtn')}
        </Button>
      )}
    </div>
  );
}
