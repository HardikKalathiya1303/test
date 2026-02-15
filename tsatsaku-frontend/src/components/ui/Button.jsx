'use client';

import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
  outline: 'border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
};

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
  icon: 'h-10 w-10',
};

const Button = forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loading = false,
  disabled,
  children,
  leftIcon,
  rightIcon,
  fullWidth = false,
  type = 'button',
  ...props
}, ref) => {
  const isButtonLoading = isLoading || loading;
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isButtonLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isButtonLoading ? (
        <span className="material-icons-outlined text-lg animate-spin">refresh</span>
      ) : leftIcon ? (
        <span className="h-4 w-4">{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && !isButtonLoading && <span className="h-4 w-4">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
