import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, Building2, Navigation, Clock } from 'lucide-react';
import { LiveTrackingVehicle } from '../../types';

interface TripProgressTimelineProps {
  vehicle: LiveTrackingVehicle;
}

export const TripProgressTimeline: React.FC<TripProgressTimelineProps> = ({ vehicle }) => {
  // A live tracking response may not include route stops until route progress is available.
  if (!vehicle.totalStopsCount) {
    return <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-slate-400">Route progress is not available for this shuttle.</div>;
  }

  const stops = [
    {
      id: 'stop-start',
      name: 'Current Location',
      address: vehicle.currentLocation.address,
      status: 'VISITED',
      eta: 'Departed',
      isOffice: false,
    },
    {
      id: 'stop-1',
      name: 'Central Metro Hub',
      address: 'Stop #1 • Outer Ring Rd',
      status: vehicle.visitedStopsCount && vehicle.visitedStopsCount >= 1 ? 'VISITED' : 'CURRENT',
      eta: '08:45 AM',
      isOffice: false,
    },
    {
      id: 'stop-2',
      name: 'Koramangala 8th Block',
      address: 'Stop #2 • 80ft Main Rd',
      status:
        vehicle.visitedStopsCount && vehicle.visitedStopsCount >= 2
          ? 'VISITED'
          : vehicle.visitedStopsCount === 1
          ? 'CURRENT'
          : 'UPCOMING',
      eta: '09:00 AM',
      isOffice: false,
    },
    {
      id: 'stop-3',
      name: 'HSR Tech Park Gate',
      address: 'Stop #3 • Sector 3',
      status:
        vehicle.visitedStopsCount && vehicle.visitedStopsCount >= 3
          ? 'VISITED'
          : vehicle.visitedStopsCount === 2
          ? 'CURRENT'
          : 'UPCOMING',
      eta: '09:12 AM',
      isOffice: false,
    },
    {
      id: 'stop-end',
      name: 'Tech Park HQ Office',
      address: 'Building B • Destination',
      status: vehicle.visitedStopsCount && vehicle.visitedStopsCount >= 4 ? 'VISITED' : 'UPCOMING',
      eta: '09:25 AM',
      isOffice: true,
    },
  ];

  return (
    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-white space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Navigation className="w-4 h-4 text-indigo-400" />
          <span>Route Trip Progress Timeline</span>
        </h4>
        <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          {vehicle.tripProgressPercent || 0}% Completed
        </span>
      </div>

      {/* Horizontal Stepper view for Medium+ screens */}
      <div className="hidden md:flex items-center justify-between relative py-2 px-2">
        {/* Background Connector Bar */}
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-800 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-8 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, vehicle.tripProgressPercent || 0))}%` }}
        />

        {stops.map((stop, index) => {
          const isVisited = stop.status === 'VISITED';
          const isCurrent = stop.status === 'CURRENT';

          return (
            <div key={stop.id} className="relative z-10 flex flex-col items-center text-center max-w-[120px]">
              {/* Stop Indicator Node */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                  isVisited
                    ? 'bg-emerald-600 text-white ring-4 ring-slate-900'
                    : isCurrent
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/30 animate-pulse'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 ring-4 ring-slate-900'
                }`}
              >
                {isVisited ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : isCurrent ? (
                  <Navigation className="w-4 h-4 text-white animate-spin-slow" />
                ) : stop.isOffice ? (
                  <Building2 className="w-4 h-4 text-purple-400" />
                ) : (
                  <span className="font-mono text-[11px]">{index}</span>
                )}
              </div>

              {/* Stop Title & Subtitle */}
              <div className="mt-2.5 space-y-0.5">
                <p
                  className={`text-xs font-bold leading-tight truncate max-w-[110px] ${
                    isVisited
                      ? 'text-emerald-400'
                      : isCurrent
                      ? 'text-white'
                      : 'text-slate-500'
                  }`}
                >
                  {stop.name}
                </p>
                <p className="text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-slate-500" /> {stop.eta}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vertical List Stepper for Mobile screens */}
      <div className="md:hidden space-y-3 relative pl-3">
        <div className="absolute top-3 bottom-3 left-6 w-0.5 bg-slate-800 z-0" />
        {stops.map((stop, index) => {
          const isVisited = stop.status === 'VISITED';
          const isCurrent = stop.status === 'CURRENT';

          return (
            <div key={stop.id} className="relative z-10 flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold shadow-sm ${
                  isVisited
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {isVisited ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <Navigation className="w-3.5 h-3.5" />
                ) : stop.isOffice ? (
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                ) : (
                  <span className="font-mono text-[10px]">{index}</span>
                )}
              </div>

              <div className="flex-1 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between gap-2">
                <div>
                  <span
                    className={`text-xs font-bold block ${
                      isVisited ? 'text-emerald-400' : isCurrent ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {stop.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">{stop.address}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded">
                  {stop.eta}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
