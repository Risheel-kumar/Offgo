import React from 'react';
import { LiveTripItem } from '../../types';
import { TripProgress } from './TripProgress';
import {
  Bus,
  MapPin,
  Clock,
  PhoneCall,
  User,
  Compass,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TodayTripCardProps {
  trip: LiveTripItem | null;
  onOpenTracking?: (shuttleId: string) => void;
  onCallDriver?: (phone: string) => void;
}

export const TodayTripCard: React.FC<TodayTripCardProps> = ({
  trip,
  onOpenTracking,
  onCallDriver,
}) => {
  if (!trip) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 text-center shadow-sm">
        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Bus className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          No Commute Scheduled For Today
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
          You don't have any shuttle rides booked for today. You can reserve a seat on available routes in seconds.
        </p>
      </div>
    );
  }

  const isDelay = trip.delayMinutes > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
    >
      {/* Decorative Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />

      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {trip.code}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Commute
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
              {trip.routeName}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenTracking && (
            <button
              type="button"
              onClick={() => onOpenTracking(trip.shuttleId)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
            >
              <Compass className="w-4 h-4" />
              Live Map
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Driver & Shuttle Info Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-xs">
            <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
              Assigned Driver
            </div>
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {trip.driverName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-mono text-xs">
            <Bus className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
              Vehicle Reg.
            </div>
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono">
              {trip.shuttleNumber}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
              Estimated Pickup
            </div>
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              {trip.etaMinutes} mins ({trip.currentStop?.estimatedArrival || 'On Time'})
            </div>
          </div>

          {trip.driverPhone && (
            <button
              type="button"
              onClick={() => onCallDriver ? onCallDriver(trip.driverPhone) : window.open(`tel:${trip.driverPhone}`)}
              className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              title={`Call Driver: ${trip.driverPhone}`}
            >
              <PhoneCall className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Pickup & Drop Stops summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Next Stop / Pickup
            </span>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {trip.nextStop?.name || trip.currentStop?.name}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
              <span>ETA: <strong className="text-slate-800 dark:text-slate-200">{trip.nextStop?.estimatedArrival || trip.currentStop?.estimatedArrival}</strong></span>
              {isDelay && (
                <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                  <AlertCircle className="w-3 h-3" />
                  +{trip.delayMinutes}m delay
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Destination / Office
            </span>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              Off-Go Innovation HQ Terminal
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Est. Arrival: <strong className="text-slate-800 dark:text-slate-200">08:25 AM</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Live Route Progress Bar Component */}
      <TripProgress stops={trip.stops} currentStop={trip.nextStop || trip.currentStop} />
    </motion.div>
  );
};
