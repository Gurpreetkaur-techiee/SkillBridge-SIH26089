import React from 'react';

export default function Badge({
  children,
  variant = 'neutral', // 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size = 'sm', // 'xs' | 'sm' | 'md'
  dot = false,
  className = '',
}) {
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[11px] font-medium gap-1',
    sm: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    md: 'px-3 py-1.5 text-sm font-semibold gap-2',
  };

  const variantClasses = {
    neutral:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700',
    primary:
      'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-900',
    success:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900',
    warning:
      'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-900',
    danger:
      'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-900',
    info:
      'bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 border border-sky-200 dark:border-sky-900',
  };

  const dotClasses = {
    neutral: 'bg-slate-400',
    primary: 'bg-blue-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full ${sizeClasses[size] || sizeClasses.sm} ${
        variantClasses[variant] || variantClasses.neutral
      } ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotClasses[variant] || dotClasses.neutral}`}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
