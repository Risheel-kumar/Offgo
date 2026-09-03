import React from 'react';
import { RotateCcw } from 'lucide-react';
import { ShuttleFilterOptions } from '../../types';

interface ShuttleFiltersProps {
  filters: ShuttleFilterOptions;
  onFilterChange: (filters: Partial<ShuttleFilterOptions>) => void;
  onReset: () => void;
}

export const ShuttleFilters: React.FC<ShuttleFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const isFiltered =
    filters.statusFilter !== 'ALL' ||
    filters.vehicleTypeFilter !== 'ALL' ||
    filters.capacityFilter !== 'ALL' ||
    filters.driverFilter !== 'ALL' ||
    filters.routeFilter !== 'ALL' ||
    filters.searchQuery !== '';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Status Filter */}
      <select
        value={filters.statusFilter}
        onChange={(e) => onFilterChange({ statusFilter: e.target.value })}
        className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="ALL">All Statuses</option>
        <option value="AVAILABLE">Available</option>
        <option value="IN_SERVICE">In Service</option>
        <option value="MAINTENANCE">Maintenance</option>
        <option value="INACTIVE">Inactive</option>
      </select>

      {/* Vehicle Type Filter */}
      <select
        value={filters.vehicleTypeFilter}
        onChange={(e) => onFilterChange({ vehicleTypeFilter: e.target.value })}
        className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="ALL">All Vehicle Types</option>
        <option value="Sprinter Van">Sprinter Van</option>
        <option value="Electric Bus">Electric Bus</option>
        <option value="Coach Bus">Coach Bus</option>
        <option value="Minivan">Minivan</option>
      </select>

      {/* Seating Capacity Filter */}
      <select
        value={filters.capacityFilter}
        onChange={(e) => onFilterChange({ capacityFilter: e.target.value })}
        className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="ALL">All Capacities</option>
        <option value="10-15">10 - 15 Seats</option>
        <option value="16-25">16 - 25 Seats</option>
        <option value="26+">26+ Seats</option>
      </select>

      {/* Assigned Driver Filter */}
      <select
        value={filters.driverFilter}
        onChange={(e) => onFilterChange({ driverFilter: e.target.value })}
        className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="ALL">All Driver Assignments</option>
        <option value="ASSIGNED">Driver Assigned</option>
        <option value="UNASSIGNED">Unassigned</option>
      </select>

      {/* Assigned Route Filter */}
      <select
        value={filters.routeFilter}
        onChange={(e) => onFilterChange({ routeFilter: e.target.value })}
        className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="ALL">All Route Assignments</option>
        <option value="ASSIGNED">Route Assigned</option>
        <option value="UNASSIGNED">Unassigned</option>
      </select>

      {/* Reset button */}
      {isFiltered && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      )}
    </div>
  );
};
