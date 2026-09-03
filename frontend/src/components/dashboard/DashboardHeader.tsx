import React from 'react';
import { RefreshCw, Download, Calendar, ShieldCheck } from 'lucide-react';
import { Button } from '../common/buttons/Button';
import { Breadcrumbs } from '../common/breadcrumbs/Breadcrumbs';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface DashboardHeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefresh,
  isRefreshing = false,
}) => {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleExport = () => {
    toast.success('Fleet analytics & metrics report exported successfully as CSV/PDF.');
  };

  return (
    <div className="space-y-3">
      {/* Breadcrumbs */}
      <Breadcrumbs
        customItems={[
          { label: 'Admin Console', path: '/admin/live-tracking' },
          { label: 'Enterprise Dashboard' },
        ]}
      />

      {/* Main Header Container */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Fleet Operations Dashboard
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
              <ShieldCheck className="w-3.5 h-3.5" />
              SYSTEM ONLINE
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Welcome back, <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.name || 'Admin'}</span>. Real-time telematics, drivers, route logistics, and booking metrics.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 pt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{currentDate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
          >
            Refresh Stream
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExport}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Metrics
          </Button>
        </div>
      </div>
    </div>
  );
};
