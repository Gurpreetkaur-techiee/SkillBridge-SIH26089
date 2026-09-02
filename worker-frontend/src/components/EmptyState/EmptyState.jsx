import React from 'react';
import { Inbox, FileQuestion } from 'lucide-react';
import Button from '../Common/Button';
import { useApp } from '../../context/AppContext';

export default function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  actionText,
  onAction,
  className = '',
  height = 'min-h-[300px]',
}) {
  const { t } = useApp();
  const displayTitle = title || t('emptyState.defaultTitle');
  const displayDesc = description || t('emptyState.defaultDesc');

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 ${height} ${className}`}
    >
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100/50 dark:border-slate-700/60 text-blue-600 dark:text-blue-400 mb-4 shadow-xs">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
      </div>
      <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-1.5 max-w-md">
        {displayTitle}
      </h4>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-6">
        {displayDesc}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
