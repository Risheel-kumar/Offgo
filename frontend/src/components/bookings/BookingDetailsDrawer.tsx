import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Bus, User, MapPin, Clock, Trash2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { BookingDetailItem } from '../../types';
import { BookingStatusBadge, PassengerCard, TripCard, BookingPass } from './Cards';

interface BookingDetailsDrawerProps {
  booking: BookingDetailItem | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (status: any) => void;
  onDelete?: (id: string) => void;
}

export const BookingDetailsDrawer: React.FC<BookingDetailsDrawerProps> = ({
  booking,
  isOpen,
  onClose,
  onStatusChange,
  onDelete,
}) => {
  if (!booking) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950 z-40 backdrop-blur-sm"
          />

          {/* Drawer Slide */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-950 border-l border-slate-800 z-50 overflow-y-auto flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-950/90 backdrop-blur-md z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {booking.code}
                  </span>
                  <BookingStatusBadge status={booking.bookingStatus} />
                </div>
                <h2 className="text-base font-bold text-slate-100 mt-1">Shuttle Reservation Details</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5 flex-1">
              {/* Pass Visual */}
              <BookingPass booking={booking} />

              {/* Passenger Info Card */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Passenger Profile
                </h3>
                <PassengerCard booking={booking} />
              </div>

              {/* Trip Itinerary Card */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Route & Schedule
                </h3>
                <TripCard booking={booking} />
              </div>

              {/* Vehicle & Driver Details */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Assigned Operations
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Bus className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Shuttle Vehicle</span>
                      <span className="font-semibold">{booking.shuttleNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Assigned Driver</span>
                      <span className="font-semibold">{booking.driverName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Travel Date</span>
                      <span className="font-semibold">{booking.travelDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Created Time</span>
                      <span className="font-semibold text-slate-400">{booking.createdTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
                    Booking Notes & Special Instructions
                  </span>
                  <p className="text-xs text-slate-300 italic">"{booking.notes}"</p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-slate-800 bg-slate-900/50 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                {booking.bookingStatus === 'PENDING' && (
                  <button
                    onClick={() => onStatusChange && onStatusChange('APPROVED')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </button>
                )}
                {booking.bookingStatus === 'PENDING' && (
                  <button
                    onClick={() => onStatusChange && onStatusChange('REJECTED')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Reject
                  </button>
                )}
                {booking.bookingStatus !== 'CANCELLED' && (
                  <button
                    onClick={() => onStatusChange && onStatusChange('CANCELLED')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>

              {onDelete && (
                <button
                  onClick={() => onDelete(booking.id)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Booking Record
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
