import React from 'react';
import { Bus, User, Route, Edit3, Trash2, Eye, ShieldCheck } from 'lucide-react';
import { ShuttleDetailItem } from '../../types';

interface ShuttleCardProps {
  shuttle: ShuttleDetailItem;
  onSelect: (shuttle: ShuttleDetailItem) => void;
  onEdit: (shuttle: ShuttleDetailItem) => void;
  onDelete: (id: string) => void;
}

export const ShuttleCard: React.FC<ShuttleCardProps> = ({
  shuttle,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
      case 'IN_SERVICE':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300';
      case 'MAINTENANCE':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
      case 'INACTIVE':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div
      onClick={() => onSelect(shuttle)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onSelect(shuttle);
      }}
      role="button"
      tabIndex={0}
      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3 cursor-pointer hover:border-indigo-400 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <h3
              onClick={() => onSelect(shuttle)}
              className="text-sm font-bold text-slate-900 dark:text-slate-100 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {shuttle.vehicleNumber}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {shuttle.manufacturer} {shuttle.model} • {shuttle.capacity} Seats
            </p>
          </div>
        </div>

        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadge(shuttle.status)}`}>
          {shuttle.status.replace('_', ' ')}
        </span>
      </div>

      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-indigo-500" /> Driver:
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {shuttle.assignedDriver ? shuttle.assignedDriver.name : 'Unassigned'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Route className="w-3.5 h-3.5 text-emerald-500" /> Route:
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
            {shuttle.assignedRoute ? shuttle.assignedRoute.name : 'Unassigned'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className="text-[11px] text-slate-400 font-mono">Reg: {shuttle.registrationNumber}</span>

        <div className="flex items-center gap-1">
          <button
            onClick={(event) => { event.stopPropagation(); onSelect(shuttle); }}
            className="p-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg"
          >
            Details
          </button>
          <button
            onClick={(event) => { event.stopPropagation(); onEdit(shuttle); }}
            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(event) => { event.stopPropagation(); onDelete(shuttle.id); }}
            className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
