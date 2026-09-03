import React from 'react';
import { EmployeeSearch } from './EmployeeSearch';
import { EmployeeFilters } from './EmployeeFilters';
import { EmployeeFilterOptions } from '../../types';

interface EmployeeToolbarProps {
  filters: EmployeeFilterOptions;
  onFilterChange: (filters: Partial<EmployeeFilterOptions>) => void;
  onResetFilters: () => void;
  departments: string[];
}

export const EmployeeToolbar: React.FC<EmployeeToolbarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  departments,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-2xs space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <EmployeeSearch
          value={filters.searchQuery}
          onChange={(query) => onFilterChange({ searchQuery: query })}
        />

        {/* Filter Controls */}
        <EmployeeFilters
          filters={filters}
          onFilterChange={onFilterChange}
          onReset={onResetFilters}
          departments={departments}
        />
      </div>
    </div>
  );
};
