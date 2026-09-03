import React from 'react';
import { CheckCircle2, Clock, XCircle, UserX, Bus, MapPinCheck } from 'lucide-react';

export type BoardingStatus = 'WAITING' | 'BOARDED' | 'ABSENT' | 'NO_SHOW';
export type DropoffStatus = 'TRAVELLING' | 'DROPPED';

interface BoardingStatusBadgeProps {
  boardingStatus: BoardingStatus;
  dropoffStatus?: DropoffStatus;
}

export const BoardingStatusBadge: React.FC<BoardingStatusBadgeProps> = ({
  boardingStatus,
  dropoffStatus,
}) => {
  if (dropoffStatus === 'DROPPED') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
        <MapPinCheck className="w-3.5 h-3.5" />
        DROPPED
      </span>
    );
  }

  switch (boardingStatus) {
    case 'BOARDED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          BOARDED
        </span>
      );
    case 'WAITING':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          WAITING
        </span>
      );
    case 'NO_SHOW':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <XCircle className="w-3.5 h-3.5 text-rose-500" />
          NO SHOW
        </span>
      );
    case 'ABSENT':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
          <UserX className="w-3.5 h-3.5 text-slate-500" />
          ABSENT
        </span>
      );
    default:
      return null;
  }
};
