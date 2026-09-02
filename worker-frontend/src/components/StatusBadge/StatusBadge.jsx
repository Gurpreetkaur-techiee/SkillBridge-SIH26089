import React from 'react';
import Badge from '../Common/Badge';
import { useApp } from '../../context/AppContext';

export default function StatusBadge({ status = 'pending', className = '', size = 'sm' }) {
  const { t } = useApp();

  const statusConfig = {
    pending: {
      variant: 'warning',
      label: t('status.pending'),
    },
    open: {
      variant: 'primary',
      label: t('status.open'),
    },
    accepted: {
      variant: 'info',
      label: t('status.accepted'),
    },
    in_progress: {
      variant: 'primary',
      label: t('status.in_progress'),
    },
    completed: {
      variant: 'success',
      label: t('status.completed'),
    },
    cancelled: {
      variant: 'danger',
      label: t('status.cancelled'),
    },
    rejected: {
      variant: 'danger',
      label: t('status.rejected'),
    },
  };

  const config = statusConfig[status] || {
    variant: 'neutral',
    label: status,
  };

  return (
    <Badge variant={config.variant} size={size} dot className={className}>
      {config.label}
    </Badge>
  );
}
