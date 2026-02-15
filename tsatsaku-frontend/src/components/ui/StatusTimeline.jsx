'use client';

import { cn } from '@/utils/cn';

export default function StatusTimeline({ statusHistory = [], currentStatus }) {
  const statusOrder = [
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'in_production', label: 'In Production' },
    { key: 'ready_for_dispatch', label: 'Ready for Dispatch' },
    { key: 'dispatched_from_port', label: 'Dispatched from Port' },
    { key: 'in_transit', label: 'In Transit' },
    { key: 'arrived_at_port', label: 'Arrived at Port' },
    { key: 'customs_clearance', label: 'Customs Clearance' },
    { key: 'received_into_warehouse', label: 'Received into Warehouse' },
    { key: 'dispatched_from_warehouse', label: 'Dispatched from Warehouse' },
    { key: 'delivered', label: 'Delivered' },
  ];

  // Create a map of status history for quick lookup
  const statusMap = {};
  statusHistory.forEach(item => {
    statusMap[item.status] = {
      timestamp: item.timestamp,
      notes: item.notes,
      updatedBy: item.updatedBy,
    };
  });

  const currentIndex = statusOrder.findIndex(s => s.key === currentStatus);

  return (
    <div className="space-y-0">
      {statusOrder.map((status, index) => {
        const historyItem = statusMap[status.key];
        const isCompleted = index < currentIndex || (historyItem && status.key !== currentStatus);
        const isCurrent = status.key === currentStatus;
        const isFuture = index > currentIndex && !historyItem;

        return (
          <div key={status.key} className="flex">
            {/* Line and dot */}
            <div className="flex flex-col items-center mr-4">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-2',
                  isCompleted && 'bg-green-500 border-green-500',
                  isCurrent && 'bg-primary-500 border-primary-500 animate-pulse',
                  isFuture && 'bg-white border-gray-300'
                )}
              >
                {isCompleted ? (
                  <span className="material-icons-outlined text-sm text-white">check</span>
                ) : isCurrent ? (
                  <div className="w-2 h-2 bg-white rounded-full" />
                ) : (
                  <div className="w-2 h-2 bg-gray-300 rounded-full" />
                )}
              </div>
              {index < statusOrder.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 h-12 -my-1',
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className={cn('pb-8 flex-1', index === statusOrder.length - 1 && 'pb-0')}>
              <p
                className={cn(
                  'font-medium',
                  isCompleted && 'text-green-700',
                  isCurrent && 'text-primary-700',
                  isFuture && 'text-gray-400'
                )}
              >
                {status.label}
              </p>
              {historyItem && (
                <div className="mt-1">
                  <p className="text-xs text-gray-500">
                    {new Date(historyItem.timestamp).toLocaleString()}
                  </p>
                  {historyItem.notes && (
                    <p className="text-sm text-gray-600 mt-1">{historyItem.notes}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
