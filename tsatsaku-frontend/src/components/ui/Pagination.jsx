'use client';

import { cn } from '@/utils/cn';
import Button from './Button';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  total,
  limit,
  className,
}) {
  const pages = [];
  const maxVisible = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {showInfo && total > 0 && (
        <p className="text-sm text-gray-600">
          Showing {start} to {end} of {total} results
        </p>
      )}
      
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2"
        >
          <span className="material-icons-outlined text-lg">chevron_left</span>
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant={currentPage === 1 ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(1)}
              className="w-8"
            >
              1
            </Button>
            {startPage > 2 && (
              <span className="px-2 text-gray-400">...</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(page)}
            className="w-8"
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 text-gray-400">...</span>
            )}
            <Button
              variant={currentPage === totalPages ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="w-8"
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2"
        >
          <span className="material-icons-outlined text-lg">chevron_right</span>
        </Button>
      </div>
    </div>
  );
}
