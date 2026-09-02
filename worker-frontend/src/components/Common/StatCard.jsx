import React from 'react';
import Card from './Card';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = null, // { value: '+12%', isPositive: true }
  color = 'blue', // 'blue' | 'emerald' | 'amber' | 'purple'
  className = '',
  onClick,
}) {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/50',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-900/50',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-900/50',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/50',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/50',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-100 dark:border-purple-900/50',
    },
  };

  const scheme = colorStyles[color] || colorStyles.blue;

  return (
    <Card
      onClick={onClick}
      hoverEffect={!!onClick}
      className={`relative overflow-hidden flex flex-col justify-between ${className}`}
      padding="default"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div
            className={`p-3 rounded-xl border ${scheme.bg} ${scheme.text} ${scheme.border} shrink-0`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold ml-auto flex items-center gap-1 ${
                trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
