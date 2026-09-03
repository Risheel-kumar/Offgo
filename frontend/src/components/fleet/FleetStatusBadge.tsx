import React from 'react';
import { Radio, PlayCircle, Clock, PauseCircle, Wrench, UserX, CheckCircle2, XCircle } from 'lucide-react';

export type ShuttleDisplayStatus =
  | 'RUNNING'
  | 'IN_TRANSIT'
  | 'ON_TIME'
  | 'DELAYED'
  | 'SCHEDULED'
  | 'IDLE'
  | 'INACTIVE'
  | 'MAINTENANCE'
  | 'DRIVER_ON_LEAVE'
  | 'COMPLETED'
  | 'CANCELLED';

interface FleetStatusBadgeProps {
  status: string | ShuttleDisplayStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FleetStatusBadge: React.FC<FleetStatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const normStatus = (status || '').toUpperCase().replace(/ /g, '_');

  let badgeStyle = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  let Icon = PauseCircle;
  let label = 'INACTIVE';
  let isPulse = false;

  switch (normStatus) {
    case 'ACTIVE':
    case 'AVAILABLE':
      badgeStyle = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      Icon = CheckCircle2;
      label = 'ACTIVE';
      break;
    case 'RUNNING':
    case 'IN_TRANSIT':
    case 'ON_TIME':
      badgeStyle = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      Icon = Radio;
      label = 'RUNNING';
      isPulse = true;
      break;
    case 'DELAYED':
      badgeStyle = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      Icon = Radio;
      label = 'DELAYED';
      isPulse = true;
      break;
    case 'SCHEDULED':
      badgeStyle = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      Icon = Clock;
      label = 'SCHEDULED';
      break;
    case 'IDLE':
    case 'INACTIVE':
      badgeStyle = 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
      Icon = PauseCircle;
      label = 'INACTIVE';
      break;
    case 'MAINTENANCE':
      badgeStyle = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      Icon = Wrench;
      label = 'MAINTENANCE';
      break;
    case 'DRIVER_ON_LEAVE':
      badgeStyle = 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      Icon = UserX;
      label = 'DRIVER ON LEAVE';
      break;
    case 'COMPLETED':
      badgeStyle = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      Icon = CheckCircle2;
      label = 'COMPLETED';
      break;
    case 'CANCELLED':
      badgeStyle = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      Icon = XCircle;
      label = 'CANCELLED';
      break;
    default:
      badgeStyle = 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
      Icon = PauseCircle;
      label = normStatus.replace(/_/g, ' ');
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px]'
      : size === 'lg'
      ? 'px-3.5 py-1 text-xs font-black'
      : 'px-2.5 py-0.5 text-[11px] font-bold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full uppercase border font-mono tracking-wider ${sizeClasses} ${badgeStyle} ${className}`}
    >
      <Icon className={`w-3 h-3 ${isPulse ? 'animate-pulse' : ''}`} />
      <span>{label}</span>
    </span>
  );
};
