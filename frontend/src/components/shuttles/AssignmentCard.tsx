import React from 'react';
import { UserCheck, Route, ShieldAlert, ArrowRight } from 'lucide-react';
import { ShuttleDetailItem } from '../../types';

interface AssignmentCardProps {
  shuttle: ShuttleDetailItem;
  onManageDriver?: () => void;
  onManageRoute?: () => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  shuttle,
  onManageDriver,
  onManageRoute,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-2xs">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Operational Assignments
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Assigned Driver */}
        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {shuttle.assignedDriver?.avatar ? (
              <img
                src={shuttle.assignedDriver.avatar}
                alt={shuttle.assignedDriver.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                {shuttle.assignedDriver ? shuttle.assignedDriver.name.charAt(0) : '?'}
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {shuttle.assignedDriver ? shuttle.assignedDriver.name : 'No Driver Assigned'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {shuttle.assignedDriver
                  ? `ID: ${shuttle.assignedDriver.driverId} • ${shuttle.assignedDriver.phone}`
                  : 'Vehicle is currently in pool'}
              </p>
            </div>
          </div>
          {onManageDriver && (
            <button
              onClick={onManageDriver}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
            >
              Change
            </button>
          )}
        </div>

        {/* Assigned Route */}
        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {shuttle.assignedRoute ? shuttle.assignedRoute.name : 'No Route Assigned'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {shuttle.assignedRoute
                  ? `Code: ${shuttle.assignedRoute.code} • ${shuttle.assignedRoute.totalStops} Scheduled Stops`
                  : 'Unassigned shuttle'}
              </p>
            </div>
          </div>
          {onManageRoute && (
            <button
              onClick={onManageRoute}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
            >
              Assign
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
