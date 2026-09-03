import React from 'react';
import { MapPin, Clock, Users, ChevronDown, ChevronUp, CheckCircle2, Navigation } from 'lucide-react';

export type StopStatus = 'COMPLETED' | 'CURRENT' | 'UPCOMING';

export interface ShuttleStop {
  id: string;
  order: number;
  name: string;
  address: string;
  eta: string;
  distanceRemaining?: string;
  isDestination?: boolean;
  status: StopStatus;
}

interface StopCardProps {
  stop: ShuttleStop;
  employeeCount: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const StopCard: React.FC<StopCardProps> = ({
  stop,
  employeeCount,
  isExpanded,
  onToggleExpand,
}) => {
  const isCurrent = stop.status === 'CURRENT';
  const isCompleted = stop.status === 'COMPLETED';

  return (
    <div
      onClick={onToggleExpand}
      className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
        isCurrent
          ? 'bg-slate-900 text-white border-emerald-500/80 shadow-lg ring-2 ring-emerald-500/40'
          : isCompleted
          ? 'bg-slate-100/80 dark:bg-slate-900/40 text-slate-500 dark:text-slate-500 border-slate-200/80 dark:border-slate-800 opacity-75'
          : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200/90 dark:border-slate-800 hover:border-indigo-500/50'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Stop Order Number + Name + Address */}
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-extrabold text-sm shrink-0 ${
              isCurrent
                ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20'
                : isCompleted
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
            }`}
          >
            {isCompleted ? <CheckCircle2 className="w-5 h-5 text-slate-500" /> : `#${stop.order}`}
          </div>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleExpand();
                }}
                className="text-left text-base font-extrabold truncate hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-1 -mx-1"
                aria-expanded={isExpanded}
              >
                {stop.name}
              </button>

              {isCurrent && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase bg-emerald-500 text-slate-950 flex items-center gap-1 animate-pulse">
                  <Navigation className="w-3 h-3 fill-current" />
                  CURRENT STOP
                </span>
              )}

              {isCompleted && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  COMPLETED
                </span>
              )}

              {stop.isDestination && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  FINAL DESTINATION
                </span>
              )}
            </div>

            <p className={`text-xs truncate ${isCurrent ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
              {stop.address}
            </p>
          </div>
        </div>

        {/* Right: ETA, Distance, Employee Count & Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3 text-xs flex-wrap">
            {/* ETA */}
            <div className={`flex items-center gap-1 font-mono font-bold ${isCurrent ? 'text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>ETA {stop.eta}</span>
            </div>

            {/* Distance Remaining */}
            {stop.distanceRemaining && !isCompleted && (
              <div className={`flex items-center gap-1 font-mono text-[11px] ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{stop.distanceRemaining}</span>
              </div>
            )}

            {/* Employee Count Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 font-mono font-bold text-xs">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span className={isCurrent ? 'text-white' : 'text-slate-900 dark:text-slate-100'}>
                {employeeCount} Expected
              </span>
            </div>
          </div>

          <div className={`p-1.5 rounded-xl ${isCurrent ? 'bg-slate-800 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>
    </div>
  );
};
