import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning' | 'danger' | 'success' | 'info'
  isLoading = false,
}) {
  const iconMap = {
    warning: {
      icon: AlertTriangle,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900',
      btnVariant: 'primary',
    },
    danger: {
      icon: AlertTriangle,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900',
      btnVariant: 'danger',
    },
    success: {
      icon: CheckCircle2,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900',
      btnVariant: 'success',
    },
    info: {
      icon: Info,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900',
      btnVariant: 'primary',
    },
  };

  const currentConfig = iconMap[type] || iconMap.warning;
  const IconComponent = currentConfig.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showClose={!isLoading}>
      <div className="flex flex-col items-center text-center">
        <div
          className={`p-3.5 rounded-2xl border mb-4 ${currentConfig.color}`}
        >
          <IconComponent className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {title}
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex items-center gap-3 w-full">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={currentConfig.btnVariant}
            className="flex-1"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
