'use client';

import { cn } from '@/utils/cn';

const variants = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-primary-100 text-primary-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className,
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            variant === 'success' && 'bg-green-500',
            variant === 'warning' && 'bg-yellow-500',
            variant === 'error' && 'bg-red-500',
            variant === 'info' && 'bg-blue-500',
            variant === 'primary' && 'bg-primary-500',
            variant === 'default' && 'bg-gray-500'
          )}
        />
      )}
      {children}
    </span>
  );
}

// Status Badge helper
export function StatusBadge({ status }) {
  const statusConfig = {
    pending: { variant: 'warning', label: 'Pending' },
    confirmed: { variant: 'info', label: 'Confirmed' },
    in_production: { variant: 'primary', label: 'In Production' },
    ready_for_dispatch: { variant: 'info', label: 'Ready for Dispatch' },
    dispatched_from_port: { variant: 'info', label: 'Dispatched' },
    in_transit: { variant: 'primary', label: 'In Transit' },
    arrived_at_port: { variant: 'info', label: 'Arrived at Port' },
    customs_clearance: { variant: 'warning', label: 'Customs Clearance' },
    received_into_warehouse: { variant: 'success', label: 'Received' },
    dispatched_from_warehouse: { variant: 'info', label: 'Dispatched' },
    delivered: { variant: 'success', label: 'Delivered' },
    cancelled: { variant: 'error', label: 'Cancelled' },
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'error', label: 'Inactive' },
  };

  const config = statusConfig[status] || { variant: 'default', label: status };

  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
}
