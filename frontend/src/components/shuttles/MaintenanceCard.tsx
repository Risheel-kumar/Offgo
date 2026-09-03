import React from 'react';
import { Wrench, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { ShuttleDetailItem } from '../../types';

interface MaintenanceCardProps {
  shuttle: ShuttleDetailItem;
}

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({ shuttle }) => {
  const info = shuttle.maintenanceInfo;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-2xs">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5 text-amber-500" />
          Fleet Maintenance & Health Score
        </h4>
        {info?.healthScorePercent !== undefined && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              info.healthScorePercent >= 90
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : info.healthScorePercent >= 75
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}
          >
            {info.healthScorePercent}% Health Score
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Last Service Date</span>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {info?.lastServiceDate || 'N/A'}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Next Service Due</span>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {info?.nextServiceDueDate || 'N/A'}
          </span>
        </div>
      </div>

      {info?.notes && (
        <div className="text-xs text-slate-600 dark:text-slate-400 p-2.5 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Service Inspector Notes: </span>
          {info.notes}
        </div>
      )}
    </div>
  );
};
