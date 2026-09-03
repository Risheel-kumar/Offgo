import React from 'react';
import { Bus, MapPin, AlertCircle, ShieldCheck } from 'lucide-react';

export const MapLegend: React.FC = () => {
  const legendItems = [
    { label: 'In Transit', color: 'bg-emerald-500', icon: Bus },
    { label: 'At Terminal / Idle', color: 'bg-indigo-500', icon: Bus },
    { label: 'Delayed / Slowdown', color: 'bg-amber-500', icon: AlertCircle },
    { label: 'Shuttle Stop', color: 'bg-blue-500', icon: MapPin },
    { label: 'Driver Check-In', color: 'bg-purple-500', icon: ShieldCheck },
  ];

  return (
    <div className="absolute bottom-4 left-4 z-20 p-2.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 shadow-xl text-white text-xs space-y-1.5 max-w-[200px]">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/60 pb-1">
        Map Telematics Legend
      </div>
      <div className="space-y-1">
        {legendItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-2 text-[11px] text-slate-200">
              <div className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
              <Icon className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
