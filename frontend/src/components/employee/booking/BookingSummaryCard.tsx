import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  MapPin,
  Clock,
  Calendar,
  Bus,
  Armchair,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { SeatItem } from '../../../types';

interface BookingSummaryCardProps {
  shuttleName: string;
  vehicleNumber: string;
  routeName: string;
  pickupStopName: string;
  dropStopName: string;
  shiftTime: string;
  travelDate: string;
  etaMinutes?: number | null;
  selectedSeat: SeatItem | null;
  isSubmitting: boolean;
  onConfirmBooking: () => void;
  validationError?: string | null;
}

const formatEtaTime = (etaMinutes: number) => {
  const arrivalDate = new Date();
  arrivalDate.setMinutes(arrivalDate.getMinutes() + etaMinutes);
  return arrivalDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  shuttleName,
  vehicleNumber,
  routeName,
  pickupStopName,
  dropStopName,
  shiftTime,
  travelDate,
  etaMinutes,
  selectedSeat,
  isSubmitting,
  onConfirmBooking,
  validationError,
}) => {
  const etaDisplay = etaMinutes !== null && etaMinutes !== undefined ? formatEtaTime(etaMinutes) : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-4 relative overflow-hidden">
      {/* Decorative top border glow */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500" />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Booking Summary</h3>
              <p className="text-[11px] text-slate-400">Guaranteed Seat Pass</p>
            </div>
          </div>

          <span className="text-[11px] font-mono bg-slate-800 text-indigo-300 border border-slate-700 px-2 py-1 rounded-lg">
            100% Subsidized
          </span>
        </div>

        {/* Details Grid */}
        <div className="space-y-3 text-xs">
          {/* Route & Shuttle */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono block uppercase">
              Shuttle Line & Route
            </span>
            <p className="font-bold text-slate-100 flex items-center justify-between">
              <span className="truncate pr-2">{routeName}</span>
              <span className="font-mono text-indigo-400 text-[11px] shrink-0">
                {vehicleNumber}
              </span>
            </p>
            <p className="text-[11px] text-slate-400">{shuttleName}</p>
          </div>

          {/* Date & Shift */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-mono block uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-400" /> Date
              </span>
              <p className="font-bold text-slate-200 mt-0.5">{travelDate}</p>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-mono block uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" /> Shift
              </span>
              <p className="font-bold text-slate-200 mt-0.5">{shiftTime}</p>
            </div>
          </div>

          {etaDisplay && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
              <span className="text-[10px] font-mono uppercase text-emerald-300">Estimated shuttle arrival</span>
              <p className="mt-0.5 text-sm font-bold text-emerald-100">ETA {etaDisplay}</p>
              <p className="text-[10px] text-emerald-200/80">Approximately {etaMinutes} minutes from now.</p>
            </div>
          )}

          {/* Stops */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Boarding Pickup Stop</span>
                <p className="font-semibold text-slate-200">{pickupStopName}</p>
              </div>
            </div>

            <div className="ml-1 pl-3 border-l-2 border-dashed border-slate-800 my-0.5 py-1 text-[10px] text-slate-500">
              Direct Non-stop Transit
            </div>

            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-400 mt-1 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Drop-off Destination</span>
                <p className="font-semibold text-slate-200">{dropStopName}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Validation Errors */}
        <AnimatePresence>
          {validationError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirm Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onConfirmBooking}
          disabled={!selectedSeat || isSubmitting}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-xl ${
            selectedSeat && !isSubmitting
              ? 'bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-indigo-500/25 active:scale-[0.99] cursor-pointer'
              : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-75'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Locking & Issuing Boarding Pass...</span>
            </div>
          ) : (
            <>
              <span>{selectedSeat ? 'Confirm Ticket' : 'Preparing Ticket'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[10px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-blue-400" /> Instant QR Pass will be added to your account
        </p>
      </div>
    </div>
  );
};
