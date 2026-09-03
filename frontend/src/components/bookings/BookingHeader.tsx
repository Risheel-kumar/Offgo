import React from 'react';
import { Ticket, ChevronRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const BookingHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 font-medium">
          <span>Enterprise Fleet</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-blue-400 font-semibold">Shuttle Reservations</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2.5">
          <Ticket className="w-6 h-6 text-blue-400" />
          Booking & Reservation System
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage employee shuttle bookings, issue digital QR passes, and monitor seat occupancy across active routes.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Real-time Sync Active</span>
        </div>
      </div>
    </div>
  );
};
