import React from 'react';
import clsx from 'clsx';

export function Card({
  children,
  className = '',
  hoverEffect = false,
  glass = false,
  bordered = true,
  padding = 'normal', // 'none' | 'sm' | 'normal' | 'lg'
  onClick,
  ...props
}) {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    normal: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        "rounded-2xl transition-all duration-300 relative",
        glass ? "glass-panel" : "bg-white dark:bg-slate-900",
        bordered && "border border-slate-200/80 dark:border-slate-800/80",
        "shadow-soft",
        hoverEffect && "hover:shadow-card-hover hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700/60 cursor-pointer",
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
