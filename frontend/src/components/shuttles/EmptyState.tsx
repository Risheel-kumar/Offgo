import React from 'react';
import { Bus, Plus, SearchX } from 'lucide-react';
import { Button } from '../common/buttons/Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAddShuttle?: () => void;
  onResetFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Shuttle Vehicles Found',
  description = 'No vehicle records match your selected filter criteria. Try adjusting filters or register a new shuttle.',
  onAddShuttle,
  onResetFilters,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl my-4">
      <div className="relative p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-full mb-3">
        <Bus className="w-10 h-10" />
        <SearchX className="w-4 h-4 text-rose-500 absolute bottom-3 right-3 bg-white dark:bg-slate-900 rounded-full" />
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mb-6">{description}</p>
      <div className="flex items-center gap-3">
        {onResetFilters && (
          <Button variant="outline" size="sm" onClick={onResetFilters} className="text-xs">
            Reset Filters
          </Button>
        )}
        {onAddShuttle && (
          <Button
            variant="primary"
            size="sm"
            onClick={onAddShuttle}
            leftIcon={<Plus className="w-4 h-4" />}
            className="text-xs font-semibold"
          >
            Add New Shuttle
          </Button>
        )}
      </div>
    </div>
  );
};
