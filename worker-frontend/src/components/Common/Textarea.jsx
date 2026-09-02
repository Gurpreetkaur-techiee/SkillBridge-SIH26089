import React from 'react';

export default function Textarea({
  label,
  id,
  rows = 3,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        className={`w-full rounded-xl text-sm transition-all duration-150 outline-none px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border resize-y
          ${
            error
              ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-950'
              : 'border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950/60'
          }
          disabled:bg-slate-50 dark:disabled:bg-slate-800/50 disabled:text-slate-400 disabled:cursor-not-allowed shadow-xs`}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}
