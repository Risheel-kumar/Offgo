import React from 'react';
import { Shield, Sparkles, UserCheck, Lock, Check } from 'lucide-react';

export const SeatLegend: React.FC = () => {
  const legendItems = [
    {
      label: 'Available',
      badge: (
        <div className="w-6 h-6 rounded-t-lg rounded-b-xs border-2 border-slate-700 bg-slate-900 flex items-center justify-center text-[10px] font-mono text-slate-200">
          04A
        </div>
      ),
      description: 'Ready to book',
    },
    {
      label: 'Selected',
      badge: (
        <div className="w-6 h-6 rounded-t-lg rounded-b-xs border-2 border-blue-400 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
          <Check className="w-3 h-3 stroke-[3]" />
        </div>
      ),
      description: 'Your selection',
    },
    {
      label: 'Reserved',
      badge: (
        <div className="w-6 h-6 rounded-t-lg rounded-b-xs border-2 border-rose-800/60 bg-rose-950/40 flex items-center justify-center text-rose-400">
          <UserCheck className="w-3 h-3" />
        </div>
      ),
      description: 'Booked by colleague',
    },
    {
      label: 'Priority',
      badge: (
        <div className="w-6 h-6 rounded-t-lg rounded-b-xs border-2 border-amber-500/60 bg-amber-950/40 flex items-center justify-center text-amber-300">
          <Shield className="w-3 h-3" />
        </div>
      ),
      description: 'Accessible / Senior',
    },
    {
      label: 'Blocked',
      badge: (
        <div className="w-6 h-6 rounded-t-lg rounded-b-xs border-2 border-slate-800 bg-slate-950 flex items-center justify-center text-slate-600">
          <Lock className="w-3 h-3" />
        </div>
      ),
      description: 'Unavailable',
    },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Seat Legend & Indicators
        </span>
        <span className="text-[11px] text-slate-400 font-mono">1 Person / 1 Seat Max</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
            {item.badge}
            <div>
              <p className="font-semibold text-slate-200 text-xs">{item.label}</p>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
