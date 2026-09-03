import { ShuttleStatus, BookingStatus, NotificationType } from '../types';

export const SHUTTLE_STATUS_CONFIG: Record<
  ShuttleStatus,
  { label: string; bg: string; text: string; border: string; dotBg: string }
> = {
  ACTIVE: {
    label: 'Active',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-500/30',
    dotBg: 'bg-emerald-500',
  },
  AVAILABLE: {
    label: 'Available',
    bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    text: 'text-cyan-700 dark:text-cyan-400',
    border: 'border-cyan-500/30',
    dotBg: 'bg-cyan-500',
  },
  ON_TIME: {
    label: 'On Time',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-500/30',
    dotBg: 'bg-emerald-500',
  },
  IN_TRANSIT: {
    label: 'In Transit',
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-500/30',
    dotBg: 'bg-blue-500 animate-pulse',
  },
  DELAYED: {
    label: 'Delayed',
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-500/30',
    dotBg: 'bg-amber-500',
  },
  MAINTENANCE: {
    label: 'Maintenance',
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-500/30',
    dotBg: 'bg-rose-500',
  },
  INACTIVE: {
    label: 'Inactive',
    bg: 'bg-slate-500/10 dark:bg-slate-500/20',
    text: 'text-slate-700 dark:text-slate-400',
    border: 'border-slate-500/30',
    dotBg: 'bg-slate-400',
  },
  IDLE: {
    label: 'Idle',
    bg: 'bg-slate-500/10 dark:bg-slate-500/20',
    text: 'text-slate-700 dark:text-slate-400',
    border: 'border-slate-500/30',
    dotBg: 'bg-slate-400',
  },
  COMPLETED: {
    label: 'Completed',
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    text: 'text-indigo-700 dark:text-indigo-400',
    border: 'border-indigo-500/30',
    dotBg: 'bg-indigo-500',
  },
  IN_SERVICE: {
    label: 'In Service',
    bg: 'bg-violet-500/10 dark:bg-violet-500/20',
    text: 'text-violet-700 dark:text-violet-400',
    border: 'border-violet-500/30',
    dotBg: 'bg-violet-500',
  },
};

export const BOOKING_STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  PENDING: {
    label: 'Pending',
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-500/30',
  },
  APPROVED: {
    label: 'Approved',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-500/30',
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-500/30',
  },
  CONFIRMED: {
    label: 'Confirmed',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-500/30',
  },
  CHECKED_IN: {
    label: 'Boarded',
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-500/30',
  },
  COMPLETED: {
    label: 'Completed',
    bg: 'bg-slate-500/10 dark:bg-slate-500/20',
    text: 'text-slate-700 dark:text-slate-400',
    border: 'border-slate-500/30',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-500/30',
  },
  NO_SHOW: {
    label: 'No Show',
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-500/30',
  },
};

export const NOTIFICATION_TYPE_CONFIG: Record<
  NotificationType,
  { bg: string; text: string; iconColor: string }
> = {
  INFO: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-700 dark:text-blue-400',
    iconColor: 'text-blue-500',
  },
  WARNING: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    iconColor: 'text-amber-500',
  },
  ALERT: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-700 dark:text-rose-400',
    iconColor: 'text-rose-500',
  },
  SUCCESS: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    iconColor: 'text-emerald-500',
  },
};
