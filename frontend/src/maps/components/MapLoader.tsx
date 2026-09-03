import React from 'react';
import { Loader2, Navigation } from 'lucide-react';

export const MapLoader: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-slate-900/90 text-white rounded-2xl border border-slate-800 space-y-3 p-6 animate-pulse">
      <div className="relative">
        <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
          <Navigation className="w-8 h-8 animate-spin" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <h4 className="text-sm font-bold text-slate-200">Initializing Google Maps Platform</h4>
        <p className="text-xs text-slate-400 font-mono">Loading map styles, tiles and telematics overlays...</p>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-indigo-400 font-semibold pt-2">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Connecting to Google Maps JavaScript API v3</span>
      </div>
    </div>
  );
};
