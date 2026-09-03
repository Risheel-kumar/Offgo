import React from 'react';
import { Users, UserPlus } from 'lucide-react';
import { Button } from '../common/buttons/Button';

interface EmptyStateProps {
  onAddEmployee?: () => void;
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onAddEmployee,
  title = 'No Employees Found',
  description = 'No employee records matched your search parameters or directory filters.',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs">
      <div className="p-4 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-4 ring-8 ring-indigo-50/50 dark:ring-indigo-950/20">
        <Users className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        {description}
      </p>
      {onAddEmployee && (
        <Button
          variant="primary"
          size="sm"
          onClick={onAddEmployee}
          leftIcon={<UserPlus className="w-4 h-4" />}
          className="text-xs font-semibold"
        >
          Add New Employee
        </Button>
      )}
    </div>
  );
};
