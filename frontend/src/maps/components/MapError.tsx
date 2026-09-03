import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface MapErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const MapError: React.FC<MapErrorProps> = ({
  message = 'Failed to load Google Maps instance.',
  onRetry,
}) => {
  return (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-slate-900/95 text-white rounded-2xl border border-rose-500/30 p-6 space-y-4 text-center">
      <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <div className="max-w-md space-y-1">
        <h4 className="text-base font-bold text-rose-300">Google Map Initialization Failed</h4>
        <p className="text-xs text-slate-400 font-mono">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Loading Map</span>
        </button>
      )}
    </div>
  );
};
