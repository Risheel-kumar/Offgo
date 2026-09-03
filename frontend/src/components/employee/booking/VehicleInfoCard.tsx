import React from 'react';
import { Bus, User, Armchair, CheckCircle2, AlertTriangle, ShieldCheck, Gauge } from 'lucide-react';
import { ShuttleSeatLayout } from '../../../types';

interface VehicleInfoCardProps {
  layout: ShuttleSeatLayout;
}

export const VehicleInfoCard: React.FC<VehicleInfoCardProps> = ({ layout }) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
      {/* Subtle ambient lighting decorative circle */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Shuttle Identity */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 shrink-0">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                {layout.vehicleNumber}
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> In Service
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mt-1">
              {layout.shuttleName}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" /> Driver: <strong className="text-slate-100">{layout.driverName}</strong>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Safety Verified
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Stat Badges */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 shrink-0">
          <div className="text-center px-2">
            <span className="text-[10px] text-slate-400 font-mono block uppercase tracking-wider">
              Total Seats
            </span>
            <span className="text-base font-mono font-bold text-slate-100">
              {layout.capacity}
            </span>
          </div>

          <div className="text-center px-2 border-x border-slate-800">
            <span className="text-[10px] text-emerald-400 font-mono block uppercase tracking-wider">
              Available
            </span>
            <span className="text-base font-mono font-bold text-emerald-400">
              {layout.availableCount}
            </span>
          </div>

          <div className="text-center px-2">
            <span className="text-[10px] text-rose-400 font-mono block uppercase tracking-wider">
              Booked
            </span>
            <span className="text-base font-mono font-bold text-rose-400">
              {layout.bookedCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
