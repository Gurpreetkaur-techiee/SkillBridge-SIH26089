import React from 'react';
import clsx from 'clsx';

export function Badge({
  children,
  variant = 'blue', // 'blue' | 'emerald' | 'amber' | 'rose' | 'slate' | 'purple'
  size = 'md', // 'sm' | 'md'
  icon: Icon,
  className = '',
  ...props
}) {
  const baseStyles = "inline-flex items-center font-medium rounded-full select-none";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5"
  };

  const variantStyles = {
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50",
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50",
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
    purple: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/50"
  };

  return (
    <span className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)} {...props}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}
