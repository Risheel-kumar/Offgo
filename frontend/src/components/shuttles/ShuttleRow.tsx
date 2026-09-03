import React from 'react';
import { Bus, User, Route, Edit3, Trash2, Eye } from 'lucide-react';
import { ShuttleDetailItem } from '../../types';

interface ShuttleRowProps {
  shuttle: ShuttleDetailItem;
  onSelect: (shuttle: ShuttleDetailItem) => void;
  onEdit: (shuttle: ShuttleDetailItem) => void;
  onDelete: (id: string) => void;
}

export const ShuttleRow: React.FC<ShuttleRowProps> = ({
  shuttle,
  onSelect,
  onEdit,
  onDelete,
}) => {
  // Enterprise status badges styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'IN_SERVICE':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'MAINTENANCE':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'INACTIVE':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'DELAYED':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-200/60 dark:border-slate-800 text-xs">
      {/* Vehicle Number & Type */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
            <Bus className="w-4 h-4" />
          </div>
          <div>
            <button
              onClick={() => onSelect(shuttle)}
              className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 text-left transition-colors"
            >
              {shuttle.vehicleNumber}
            </button>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {shuttle.manufacturer} {shuttle.model}
            </p>
          </div>
        </div>
      </td>

      {/* Vehicle Type */}
      <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
        {shuttle.vehicleType}
      </td>

      {/* Capacity & Occupancy */}
      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
        <span className="inline-flex items-center gap-1">
          {shuttle.capacity} Seats
          {shuttle.occupancy > 0 && (
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded-full font-bold">
              ({shuttle.occupancy} active)
            </span>
          )}
        </span>
      </td>

      {/* Assigned Driver */}
      <td className="py-3 px-4">
        {shuttle.assignedDriver ? (
          <div className="flex items-center gap-2">
            {shuttle.assignedDriver.avatar ? (
              <img
                src={shuttle.assignedDriver.avatar}
                alt={shuttle.assignedDriver.name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-slate-400" />
            )}
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-[120px]">
                {shuttle.assignedDriver.name}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {shuttle.assignedDriver.driverId}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">Unassigned</span>
        )}
      </td>

      {/* Assigned Route */}
      <td className="py-3 px-4">
        {shuttle.assignedRoute ? (
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Route className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="font-medium truncate max-w-[130px]" title={shuttle.assignedRoute.name}>
              {shuttle.assignedRoute.name}
            </span>
          </div>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">Unassigned</span>
        )}
      </td>

      {/* Current Status Badge */}
      <td className="py-3 px-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
            shuttle.status
          )}`}
        >
          {shuttle.status.replace('_', ' ')}
        </span>
      </td>

      {/* Registration Date */}
      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
        {shuttle.registrationDate}
      </td>

      {/* Last Updated */}
      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
        {shuttle.lastUpdated}
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onSelect(shuttle)}
            title="View Details"
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(shuttle)}
            title="Edit Shuttle"
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(shuttle.id)}
            title="Delete Vehicle"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};
