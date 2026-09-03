import React from 'react';
import { LiveTripItem } from '../../types';
import { Compass, MapPin, Clock, Gauge, ArrowUpRight } from 'lucide-react';

interface LiveTrackingWidgetProps {
  trip: LiveTripItem | null;
  onFullMapClick?: () => void;
}

export const LiveTrackingWidget: React.FC<LiveTrackingWidgetProps> = ({
  trip,
  onFullMapClick,
}) => {
  if (!trip) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 text-center shadow-sm">
        <Compass className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          No shuttle actively broadcasting GPS telemetry right now.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Live Shuttle Radar
          </h3>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            ({trip.shuttleNumber})
          </span>
        </div>

        {onFullMapClick && (
          <button
            type="button"
            onClick={onFullMapClick}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            Full Map
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Simulated Map Canvas Viewport */}
      <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group cursor-pointer" onClick={onFullMapClick}>
        {/* Map Grid Patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
        
        {/* Animated Map Route Line */}
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-emerald-500/30 -translate-y-1/2">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-2/3 rounded-full" />
        </div>

        {/* Next Stop Point */}
        <div className="absolute top-1/2 right-12 -translate-y-1/2 flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900 shadow-md" />
          <span className="text-[10px] font-bold text-indigo-300 mt-1 bg-slate-900/90 px-1.5 py-0.5 rounded backdrop-blur">
            {trip.nextStop?.name || 'Next Stop'}
          </span>
        </div>

        {/* Live Shuttle Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-75" />
            <div className="relative p-2 bg-emerald-500 text-slate-950 rounded-full shadow-lg border-2 border-white dark:border-slate-900">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
          </div>
          <span className="text-[10px] font-bold font-mono text-emerald-300 mt-1 bg-slate-900/90 px-2 py-0.5 rounded border border-emerald-500/30">
            {trip.shuttleNumber} • {trip.currentSpeedKmh} km/h
          </span>
        </div>

        <div className="absolute bottom-2 right-2 bg-slate-900/90 backdrop-blur px-2 py-1 rounded text-[10px] text-slate-400 border border-slate-800">
          Click to Expand Interactive Map
        </div>
      </div>

      {/* Quick Telemetry Grid */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">ETA</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-emerald-500" />
            {trip.etaMinutes} mins
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Distance</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-indigo-500" />
            {trip.distanceRemainingKm} km
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Speed</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1 mt-0.5">
            <Gauge className="w-3 h-3 text-amber-500" />
            {trip.currentSpeedKmh} km/h
          </span>
        </div>
      </div>
    </div>
  );
};
