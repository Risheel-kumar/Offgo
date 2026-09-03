import React from 'react';
import { Booking } from '../../types';
import { History, Calendar, CheckCircle2, MapPin, Bus } from 'lucide-react';

interface BookingHistoryProps {
  history: Booking[];
}

export const BookingHistory: React.FC<BookingHistoryProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 text-center shadow-sm">
        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-2">
          <History className="w-5 h-5" />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          No past commute history logged yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-500" />
          Commute History
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {history.length} Past Rides
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {history.map((item) => (
          <div
            key={item.id}
            className="py-3.5 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3 min-w-[200px]">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl">
                <Bus className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {item.routeName}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {item.date}
                  </span>
                  <span>•</span>
                  <span>{item.shuttleVehicleNumber}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  {item.pickupStop} → {item.dropoffStop}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Seat {item.seatNumber || 'Standard'}
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
