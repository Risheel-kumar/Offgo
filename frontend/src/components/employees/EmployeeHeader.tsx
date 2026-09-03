import React from 'react';
import { Breadcrumbs } from '../common/breadcrumbs/Breadcrumbs';
import { Users, RefreshCw, UserPlus, Download } from 'lucide-react';
import { Button } from '../common/buttons/Button';

interface EmployeeHeaderProps {
  onAddEmployee: () => void;
  onRefresh: () => void;
  onExportCSV: () => void;
  isRefreshing?: boolean;
  totalEmployeesCount: number;
}

export const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({
  onAddEmployee,
  onRefresh,
  onExportCSV,
  isRefreshing,
  totalEmployeesCount,
}) => {
  return (
    <div className="space-y-3">
      {/* Breadcrumbs */}
      <Breadcrumbs
        customItems={[
          { label: 'Admin Console', path: '/admin/live-tracking' },
          { label: 'Employee Management' },
        ]}
      />

      {/* Main Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Employee Management
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  {totalEmployeesCount} Total
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Directory, shuttle assignments, live booking statuses & attendance records
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
            className="text-xs font-medium"
          >
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExportCSV}
            leftIcon={<Download className="w-4 h-4" />}
            className="text-xs font-medium"
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onAddEmployee}
            leftIcon={<UserPlus className="w-4 h-4" />}
            className="text-xs font-semibold shadow-xs"
          >
            Add Employee
          </Button>
        </div>
      </div>
    </div>
  );
};
