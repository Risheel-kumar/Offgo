import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../common/buttons/Button';

interface DashboardErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const DashboardErrorState: React.FC<DashboardErrorStateProps> = ({
  message = 'Failed to load fleet dashboard telemetry data.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/40 shadow-sm">
      <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
        Telemetry Stream Connection Error
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        {message} Please verify your network connection or backend server status.
      </p>
      <Button
        variant="primary"
        onClick={onRetry}
        leftIcon={<RefreshCw className="w-4 h-4" />}
      >
        Retry Telemetry Stream
      </Button>
    </div>
  );
};
