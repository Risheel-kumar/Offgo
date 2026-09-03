import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { EmployeeFilterOptions } from '../../types';

interface EmployeeFiltersProps {
  filters: EmployeeFilterOptions;
  onFilterChange: (filters: Partial<EmployeeFilterOptions>) => void;
  onReset: () => void;
  departments: string[];
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  departments,
}) => {
  const isFiltered =
    filters.statusFilter !== 'ALL' ||
    filters.departmentFilter !== 'ALL' ||
    filters.shuttleFilter !== 'ALL' ||
    filters.bookingStatusFilter !== 'ALL' ||
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
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
        <option value="ON_LEAVE">On Leave</option>
        <option value="SUSPENDED">Suspended</option>
      </select>

      {/* Department Filter */}
      <select
        value={filters.departmentFilter}
        onChange={(e) => onFilterChange({ departmentFilter: e.target.value })}
        className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="ALL">All Departments</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      {/* Shuttle Filter */}
      <select
        value={filters.shuttleFilter}
        onChange={(e) => onFilterChange({ shuttleFilter: e.target.value })}
        className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="ALL">All Shuttle Assignments</option>
        <option value="ASSIGNED">Assigned to Shuttle</option>
        <option value="UNASSIGNED">Unassigned</option>
      </select>

      {/* Booking Status Filter */}
      <select
        value={filters.bookingStatusFilter}
        onChange={(e) => onFilterChange({ bookingStatusFilter: e.target.value })}
        className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="ALL">All Booking Statuses</option>
        <option value="CONFIRMED">Confirmed Booking</option>
        <option value="CHECKED_IN">Checked In</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>

      {/* Reset Filters button */}
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
