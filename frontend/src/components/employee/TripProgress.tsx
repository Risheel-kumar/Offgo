import React from 'react';
import { TripStopItem } from '../../types';
import { CheckCircle2, Clock, MapPin } from 'lucide-react';

interface TripProgressProps {
  stops: TripStopItem[];
  currentStop?: TripStopItem;
}

export const TripProgress: React.FC<TripProgressProps> = ({ stops, currentStop }) => {
  if (!stops || stops.length === 0) return null;

  const completedCount = stops.filter((s) => s.isCompleted).length;
  const progressPercent = Math.round((completedCount / (stops.length - 1 || 1)) * 100);

  return (
    <div className="w-full space-y-3">
      {/* Progress Bar Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
        <span>Route Progress ({completedCount}/{stops.length} Stops)</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{progressPercent}% Completed</span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
        />
      </div>

      {/* Horizontal Stop Indicators */}
      <div className="relative pt-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {stops.map((stop) => {
            const isCurrent = currentStop?.id === stop.id || stop.isCurrent;
            const isCompleted = stop.isCompleted;

            return (
              <div
                key={stop.id}
                className={`p-2.5 rounded-xl border transition-all text-left flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200 shadow-sm ring-2 ring-amber-500/20'
                    : isCompleted
                    ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold tracking-wider uppercase opacity-75">
                    {isCompleted ? 'Completed' : isCurrent ? 'Next Stop' : 'Upcoming'}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : isCurrent ? (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </div>

                <div className="text-xs font-semibold truncate leading-tight mb-1" title={stop.name}>
                  {stop.name}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{stop.actualArrival || stop.estimatedArrival}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
