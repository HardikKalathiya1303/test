'use client';

import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Textarea = forwardRef(({
  className,
  label,
  error,
  helperText,
  disabled,
  required,
  fullWidth = true,
  rows = 4,
  maxLength,
  value,
  ...props
}, ref) => {
  const charCount = value?.length || 0;

  return (
    <div className={cn('space-y-1.5', fullWidth && 'w-full')}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        value={value}
        className={cn(
          'w-full px-3 py-2 rounded-lg border border-gray-300 bg-white',
          'text-gray-900 placeholder:text-gray-400 resize-none',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      <div className="flex justify-between">
        <div>
          {error && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <span className="material-icons-outlined text-sm">error</span>
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
        {maxLength && (
          <p className={cn(
            'text-sm',
            charCount >= maxLength ? 'text-red-500' : 'text-gray-400'
          )}>
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
