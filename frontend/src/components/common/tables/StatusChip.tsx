import React from 'react';
import { cn } from '../../../utils/cn';
import { SHUTTLE_STATUS_CONFIG, BOOKING_STATUS_CONFIG } from '../../../constants/status';
import { ShuttleStatus, BookingStatus } from '../../../types';

export interface StatusChipProps {
  status: ShuttleStatus | BookingStatus | string;
  type?: 'shuttle' | 'booking' | 'user' | 'generic';
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  type = 'shuttle',
  className,
}) => {
  if (type === 'shuttle' && status in SHUTTLE_STATUS_CONFIG) {
    const config = SHUTTLE_STATUS_CONFIG[status as ShuttleStatus];
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
          config.bg,
          config.text,
          config.border,
          className
        )}
      >
        <span className={cn('w-1.5 h-1.5 rounded-full', config.dotBg)} />
        {config.label}
      </span>
    );
  }

  if (type === 'booking' && status in BOOKING_STATUS_CONFIG) {
    const config = BOOKING_STATUS_CONFIG[status as BookingStatus];
    return (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
          config.bg,
          config.text,
          config.border,
          className
        )}
      >
        {config.label}
      </span>
    );
  }

  if (type === 'user') {
    const isSuccess = status === 'ACTIVE';
    const isWarning = status === 'ON_LEAVE';
    const isDanger = status === 'SUSPENDED' || status === 'INACTIVE';

    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
          isSuccess && 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
          isWarning && 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
          isDanger && 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
          className
        )}
      >
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            isSuccess && 'bg-emerald-500',
            isWarning && 'bg-amber-500',
            isDanger && 'bg-rose-500'
          )}
        />
        {status}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700',
        className
      )}
    >
      {status}
    </span>
  );
};
