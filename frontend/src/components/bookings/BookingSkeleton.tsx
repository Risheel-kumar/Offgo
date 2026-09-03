import React from 'react';
import { CalendarX2, Plus } from 'lucide-react';

export const BookingSkeleton: React.FC = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800" />
            <div className="space-y-2">
              <div className="w-32 h-4 bg-slate-800 rounded" />
              <div className="w-24 h-3 bg-slate-800 rounded" />
            </div>
          </div>
          <div className="w-24 h-6 bg-slate-800 rounded-full" />
        </div>
      ))}
    </div>
  );
};

interface EmptyStateProps {
  onClearFilters?: () => void;
  onCreateBooking?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters, onCreateBooking }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center my-6">
      <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
        <CalendarX2 className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-100 mb-1">No Reservations Found</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-6">
        No shuttle bookings match your selected query or filters. Try adjusting your search criteria or create a new booking reservation.
      </p>

      <div className="flex items-center gap-3">
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            Reset Filters
          </button>
        )}
        {onCreateBooking && (
          <button
            onClick={onCreateBooking}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Booking
          </button>
        )}
      </div>
    </div>
  );
};
