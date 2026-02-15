'use client';

import { cn } from '@/utils/cn';

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

export default function Spinner({
  size = 'md',
  className,
  color = 'primary',
}) {
  return (
    <span
      className={cn(
        'material-icons-outlined animate-spin inline-block',
        sizes[size],
        color === 'primary' && 'text-primary-600',
        color === 'white' && 'text-white',
        color === 'gray' && 'text-gray-400',
        className
      )}
    >
      refresh
    </span>
  );
}

// Full page loading
export function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Spinner size="xl" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
}

// Loading overlay
export function LoadingOverlay({ message }) {
  return (
    <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-50 rounded-lg">
      <Spinner size="lg" />
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
