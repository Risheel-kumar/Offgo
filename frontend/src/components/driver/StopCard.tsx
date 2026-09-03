import React from 'react';
import { Button } from '../common/buttons/Button';
import {
  MapPin,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Check,
  Radio,
  XCircle,
} from 'lucide-react';
import { DriverNavigationStop, DriverStopStatus } from '../../services/driverNavigationService';

interface StopCardProps {
  stop: DriverNavigationStop;
  isCurrent: boolean;
  onMarkCompleted: (stopId: string) => void;
  isShiftRunning: boolean;
}

export const StopCard: React.FC<StopCardProps> = ({
  stop,
  isCurrent,
  onMarkCompleted,
  isShiftRunning,
}) => {
  const isOffice = Boolean(stop.isOfficeDestination);
  const isCompleted = stop.status === 'COMPLETED';

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <Check className="w-3 h-3" /> COMPLETED
        </span>
      );
    }
    if (isCurrent && isShiftRunning) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white animate-pulse flex items-center gap-1">
          <Radio className="w-3 h-3" /> CURRENT WAYPOINT
        </span>
      );
    }
    if (stop.status === 'SKIPPED') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1">
          <XCircle className="w-3 h-3" /> SKIPPED
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
        UPCOMING
      </span>
    );
  };

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-200 ${
        isOffice
          ? 'bg-purple-500/10 border-purple-500/30 dark:bg-purple-950/30 shadow-sm'
          : isCurrent && isShiftRunning
          ? 'bg-indigo-50/90 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 shadow-md ring-2 ring-indigo-500/30'
          : isCompleted
          ? 'bg-slate-50/70 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/80 opacity-80'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-xs font-extrabold shadow-sm ${
              isCompleted
                ? 'bg-emerald-500 text-white'
                : isOffice
                ? 'bg-purple-600 text-white ring-4 ring-purple-500/20'
                : isCurrent && isShiftRunning
                ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {isCompleted ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : isOffice ? (
              <Building2 className="w-5 h-5" />
            ) : (
              stop.sequence
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {stop.name}
              </h4>
              {isOffice && (
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-600 text-white uppercase tracking-wider">
                  OFFICE HQ
                </span>
              )}
              {getStatusBadge()}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{stop.address}</p>

            <div className="flex items-center gap-3 text-xs pt-1 flex-wrap">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-semibold">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                ETA: {stop.scheduledTime}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
                <Users className="w-3.5 h-3.5" />
                {isOffice
                  ? `${stop.passengersDropped || 32} Dropoffs`
                  : `${stop.passengersWaiting} Boarding`}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {isShiftRunning && !isCompleted && (
          <div className="shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 flex justify-end">
            <Button
              size="sm"
              variant={isOffice ? 'primary' : 'outline'}
              onClick={() => onMarkCompleted(stop.id)}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              className={isOffice ? 'bg-purple-600 hover:bg-purple-700 text-white border-none shadow-md' : ''}
            >
              {isOffice ? 'Arrive at Office HQ' : 'Mark Completed'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
