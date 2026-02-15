'use client';

import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Select = forwardRef(({
  className,
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select an option',
  disabled,
  required,
  fullWidth = true,
  ...props
}, ref) => {
  return (
    <div className={cn('space-y-1.5', fullWidth && 'w-full')}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full h-10 px-3 pr-10 rounded-lg border border-gray-300 bg-white',
            'text-gray-900 appearance-none cursor-pointer',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value || option.id} value={option.value || option.id}>
              {option.label || option.name}
            </option>
          ))}
        </select>
        <span className="material-icons-outlined absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400 pointer-events-none">
          expand_more
        </span>
      </div>
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
  );
});

Select.displayName = 'Select';

export default Select;
