'use client';

import { cn } from '@/utils/cn';

export default function Table({ children, className }) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-gray-200', className)}>
      <table className="w-full text-sm text-left">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className }) {
  return (
    <thead className={cn('bg-gray-50 text-gray-600 uppercase text-xs', className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }) {
  return (
    <tbody className={cn('divide-y divide-gray-200', className)}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, onClick, hoverable = true }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'bg-white',
        hoverable && 'hover:bg-gray-50',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableHeader({ children, className, sortable, sorted, onSort }) {
  return (
    <th
      onClick={sortable ? onSort : undefined}
      className={cn(
        'px-4 py-3 font-semibold',
        sortable && 'cursor-pointer hover:bg-gray-100 select-none',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {children}
        {sorted && (
          <span className="text-primary-600">
            {sorted === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );
}

export function TableCell({ children, className }) {
  return (
    <td className={cn('px-4 py-3 text-gray-800', className)}>
      {children}
    </td>
  );
}

// Empty state for tables
export function TableEmpty({ message = 'No data found', colspan = 5 }) {
  return (
    <tr>
      <td colSpan={colspan} className="px-4 py-12 text-center">
        <div className="flex flex-col items-center">
          <svg
            className="w-12 h-12 text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-500">{message}</p>
        </div>
      </td>
    </tr>
  );
}

// Loading skeleton for tables
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="bg-white">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-gray-200 rounded skeleton" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
