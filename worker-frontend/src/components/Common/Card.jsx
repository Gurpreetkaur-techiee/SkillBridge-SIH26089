import React from 'react';

export default function Card({
  children,
  className = '',
  hoverEffect = false,
  padding = 'default', // 'none' | 'sm' | 'default' | 'lg'
  onClick,
  ...props
}) {
  const paddingMap = {
    none: 'p-0',
    sm: 'p-4',
    default: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs transition-all duration-200 ${
        hoverEffect
          ? 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer'
          : ''
      } ${paddingMap[padding] || paddingMap.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
