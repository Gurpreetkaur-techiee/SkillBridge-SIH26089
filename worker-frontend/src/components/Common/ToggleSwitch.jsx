import React from 'react';

export default function ToggleSwitch({
  checked = false,
  onChange,
  disabled = false,
  label = '',
  description = '',
  size = 'md', // 'sm' | 'md'
  className = '',
}) {
  const switchSizes = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
    },
  };

  const currentSize = switchSizes[size] || switchSizes.md;

  return (
    <label
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`${currentSize.track} rounded-full transition-colors duration-200 ease-in-out ${
            checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
          }`}
        />
        <div
          className={`absolute left-0.5 top-0.5 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-xs ${
            currentSize.thumb
          } ${checked ? currentSize.translate : 'translate-x-0'}`}
        />
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
