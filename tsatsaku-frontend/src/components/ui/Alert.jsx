'use client';

import { cn } from '@/utils/cn';

const iconMap = {
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  error: 'error',
};

const variants = {
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    iconColor: 'text-blue-500',
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    iconColor: 'text-green-500',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    iconColor: 'text-yellow-500',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    iconColor: 'text-red-500',
  },
};

export default function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className,
}) {
  const config = variants[variant];
  const iconName = iconMap[variant];

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border',
        config.container,
        className
      )}
      role="alert"
    >
      <span className={cn('material-icons-outlined text-xl flex-shrink-0 mt-0.5', config.iconColor)}>
        {iconName}
      </span>
      <div className="flex-1">
        {title && <p className="font-medium mb-1">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <span className="material-icons-outlined text-lg">close</span>
        </button>
      )}
    </div>
  );
}
