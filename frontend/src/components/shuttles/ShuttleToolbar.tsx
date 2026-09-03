import React from 'react';
import { ShuttleSearch } from './ShuttleSearch';
import { ShuttleFilters } from './ShuttleFilters';
import { ShuttleFilterOptions } from '../../types';

interface ShuttleToolbarProps {
  filters: ShuttleFilterOptions;
  onFilterChange: (filters: Partial<ShuttleFilterOptions>) => void;
  onResetFilters: () => void;
}

export const ShuttleToolbar: React.FC<ShuttleToolbarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-2xs space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <ShuttleSearch
          value={filters.searchQuery}
          onChange={(query) => onFilterChange({ searchQuery: query })}
        />

        {/* Filter Dropdowns */}
        <ShuttleFilters
          filters={filters}
          onFilterChange={onFilterChange}
          onReset={onResetFilters}
        />
      </div>
    </div>
  );
};
