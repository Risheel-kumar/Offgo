import React from 'react';
import { SeatItem } from '../../../types';
import { Sparkles, Armchair, ShieldCheck, AlertCircle } from 'lucide-react';

interface SeatTooltipProps {
  seat: SeatItem;
}

export const SeatTooltip: React.FC<SeatTooltipProps> = ({ seat }) => {
  const getCategoryLabel = () => {
    switch (seat.category) {
      case 'WINDOW':
        return 'Window Seat — Panoramic View';
      case 'AISLE':
        return 'Aisle Seat — Easy Access';
      case 'REAR':
        return 'Rear Seat — Spaced Seating';
      default:
        return 'Standard Seat';
    }
  };

  const getStatusColor = () => {
    switch (seat.status) {
      case 'SELECTED':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/40';
      case 'RESERVED':
        return 'text-rose-400 bg-rose-500/20 border-rose-500/40';
      case 'BLOCKED':
        return 'text-slate-400 bg-slate-800 border-slate-700';
      case 'PRIORITY':
        return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
      default:
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
    }
  };

  return (
    <div className="p-2.5 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl text-xs space-y-1.5 max-w-[200px] z-50">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
        <span className="font-mono font-bold text-slate-100 text-sm flex items-center gap-1.5">
          <Armchair className="w-3.5 h-3.5 text-indigo-400" />
          Seat {seat.seatNumber}
        </span>
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getStatusColor()}`}
        >
          {seat.status}
        </span>
      </div>

      <p className="text-[11px] text-slate-300 font-medium">{getCategoryLabel()}</p>

      {seat.featureBadge && (
        <div className="flex items-center gap-1 text-[10px] text-indigo-300 font-medium pt-0.5">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>{seat.featureBadge.replace('_', ' ')}</span>
        </div>
      )}

      {seat.status === 'RESERVED' && seat.reservedBy && (
        <p className="text-[10px] text-slate-400 italic">Booked by {seat.reservedBy}</p>
      )}

      {seat.isPriority && (
        <div className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold pt-0.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Reserved for Senior / Assist Need</span>
        </div>
      )}
    </div>
  );
};
