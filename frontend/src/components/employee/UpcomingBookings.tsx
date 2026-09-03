import React, { useState } from 'react';
import { Booking } from '../../types';
import { Calendar, MapPin, Clock, XCircle, ChevronRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UpcomingBookingsProps {
  bookings: Booking[];
  onCancelBooking?: (bookingId: string) => void;
  onViewDetails?: (booking: Booking) => void;
  onCreateBooking?: () => void;
}

export const UpcomingBookings: React.FC<UpcomingBookingsProps> = ({
  bookings,
  onCancelBooking,
  onViewDetails,
  onCreateBooking,
}) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 text-center shadow-sm">
        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          No Upcoming Bookings
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
          You don't have any future shuttle seat reservations scheduled right now.
        </p>
        {onCreateBooking && (
          <button
            type="button"
            onClick={onCreateBooking}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            Reserve Shuttle Seat
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-500" />
          Upcoming Reserved Rides ({bookings.length})
        </h3>
        {onCreateBooking && (
          <button
            type="button"
            onClick={onCreateBooking}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            + New Booking
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.map((booking) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Top Row */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {booking.bookingRef}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {booking.status}
                </span>
              </div>

              {/* Route & Date */}
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1 mb-1">
                {booking.routeName}
              </h4>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                  {booking.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {booking.pickupTime}
                </span>
                {booking.seatNumber && (
                  <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px] font-mono">
                    Seat: {booking.seatNumber}
                  </span>
                )}
              </div>

              {/* Pickup & Drop */}
              <div className="space-y-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-slate-500 dark:text-slate-400">Pickup:</span>
                  <strong className="text-slate-800 dark:text-slate-200 truncate">{booking.pickupStop}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="text-slate-500 dark:text-slate-400">Drop:</span>
                  <strong className="text-slate-800 dark:text-slate-200 truncate">{booking.dropoffStop}</strong>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-lg text-[11px] font-medium border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Manifest Confirmed
              </span>

              <div className="flex items-center gap-1">
                {onCancelBooking && (
                  <button
                    type="button"
                    onClick={() => setCancellingId(booking.id)}
                    className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Cancel Booking"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
                {onViewDetails && (
                  <button
                    type="button"
                    onClick={() => onViewDetails(booking)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                  >
                    Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancellingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 text-center border border-slate-200 dark:border-slate-800 shadow-xl"
            >
              <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Cancel Shuttle Booking?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Are you sure you want to release your reserved seat? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCancellingId(null)}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  Keep Seat
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onCancelBooking) onCancelBooking(cancellingId);
                    setCancellingId(null);
                  }}
                  className="flex-1 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-500 transition-colors"
                >
                  Cancel Booking
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
