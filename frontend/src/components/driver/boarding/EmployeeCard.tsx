import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bus, Building2, Armchair } from 'lucide-react';

export interface EmployeeBoardingRecord {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  seatNumber?: string;
  pickupStopId: string;
  pickupStopName: string;
  dropoffStopId: string;
  dropoffStopName: string;
  avatarUrl?: string;
}

interface EmployeeCardProps {
  employee: EmployeeBoardingRecord;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  // Get initials for avatar placeholder
  const initials = employee.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {/* Header: Employee Info + Avatar + Seat */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm ring-2 ring-indigo-500/20 font-mono">
              {initials}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-tight truncate">
                {employee.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="font-bold text-slate-700 dark:text-slate-300">{employee.employeeId}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-slate-500 truncate">
                  <Building2 className="w-3 h-3 text-indigo-500 shrink-0" />
                  {employee.department}
                </span>
              </p>
            </div>
          </div>

          {employee.seatNumber && (
            <div className="flex items-center gap-1 font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 shrink-0">
              <Armchair className="w-3.5 h-3.5 text-indigo-500" />
              <span>Seat {employee.seatNumber}</span>
            </div>
          )}
        </div>

        {/* Route Stops Details: Pickup & Drop-off Location */}
        <div className="mt-3 p-3 rounded-xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">PICKUP POINT</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{employee.pickupStopName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
            <Bus className="w-4 h-4 text-indigo-500 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">DESTINATION</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{employee.dropoffStopName}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
