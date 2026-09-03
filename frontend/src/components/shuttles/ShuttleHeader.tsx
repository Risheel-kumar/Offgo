import React from 'react';
import { Breadcrumbs } from '../common/breadcrumbs/Breadcrumbs';
import { Bus, RefreshCw, Plus, Download } from 'lucide-react';
import { Button } from '../common/buttons/Button';

interface ShuttleHeaderProps {
  onAddShuttle: () => void;
  onRefresh: () => void;
  onExportCSV: () => void;
  isRefreshing?: boolean;
  totalShuttlesCount: number;
}

export const ShuttleHeader: React.FC<ShuttleHeaderProps> = ({
  onAddShuttle,
  onRefresh,
  onExportCSV,
  isRefreshing,
  totalShuttlesCount,
}) => {
  return (
    <div className="space-y-3">
      {/* Navigation Breadcrumb */}
      <Breadcrumbs
        customItems={[
          { label: 'Admin Console', path: '/admin/live-tracking' },
          { label: 'Shuttle Fleet Management' },
        ]}
      />

      {/* Main Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Shuttle Fleet Management
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  {totalShuttlesCount} Vehicles
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enterprise vehicle registry, driver & route assignments, maintenance logs & live occupancy
              </p>
            </div>
          </div>
        </div>

        {/* Global Operational Controls */}
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
            onClick={onAddShuttle}
            leftIcon={<Plus className="w-4 h-4" />}
            className="text-xs font-semibold shadow-xs"
          >
            Add Shuttle
          </Button>
        </div>
      </div>
    </div>
  );
};
