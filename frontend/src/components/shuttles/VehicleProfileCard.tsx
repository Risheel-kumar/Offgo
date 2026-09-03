import React from 'react';
import { Bus, ShieldCheck, Calendar, Users } from 'lucide-react';
import { ShuttleDetailItem } from '../../types';

interface VehicleProfileCardProps {
  shuttle: ShuttleDetailItem;
}

export const VehicleProfileCard: React.FC<VehicleProfileCardProps> = ({ shuttle }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              {shuttle.vehicleNumber}
              {shuttle.color && (
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  ({shuttle.color})
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {shuttle.manufacturer} {shuttle.model} • {shuttle.vehicleType}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {shuttle.registrationNumber}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            Passenger Capacity
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {shuttle.capacity} Seats
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            Registration Date
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {shuttle.registrationDate}
          </p>
        </div>
      </div>

      {shuttle.notes && (
        <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 text-xs text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-indigo-700 dark:text-indigo-400">Notes: </span>
          {shuttle.notes}
        </div>
      )}
    </div>
  );
};
