import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../common/cards/Card';
import { Button } from '../common/buttons/Button';
import { Bus, MapPin, Clock, Gauge, Navigation, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { LiveTripItem } from '../../types';

interface LiveRidesWidgetProps {
  trip: LiveTripItem | null;
}

export const LiveRidesWidget: React.FC<LiveRidesWidgetProps> = ({ trip }) => {
  const navigate = useNavigate();
  const activeTrip = trip;

  if (!activeTrip) {
    return (
      <Card className="overflow-hidden border-slate-200/80 dark:border-slate-800 shadow-md">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            Active Live Ride
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
            No active live ride is available right now.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-slate-200/80 dark:border-slate-800 shadow-md">
      <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          Active Live Ride
        </CardTitle>

        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          IN TRANSIT
        </span>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Bus className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {activeTrip.routeName}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    Current Vehicle: <strong className="text-slate-800 dark:text-slate-200">{activeTrip.shuttleNumber}</strong> ({activeTrip.vehicleModel || 'AC Shuttle'})
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Arrival ETA</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 justify-end">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  {activeTrip.etaMinutes} MINS
                </span>
              </div>
            </div>

            {/* Current & Next Stop Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-indigo-500" /> Current Stop
                </span>
                <p className="font-extrabold text-xs text-slate-900 dark:text-white mt-1">
                  {activeTrip.currentStopName || 'Koramangala 5th Block'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-emerald-500" /> Next Stop
                </span>
                <p className="font-extrabold text-xs text-slate-900 dark:text-white mt-1">
                  {activeTrip.nextStop?.name || 'Indiranagar Metro Station'}
                </p>
              </div>
            </div>

            {/* Trip Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                <span>Trip Progress ({activeTrip.progressPercentage || 65}%)</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5" /> {activeTrip.currentSpeedKmh || 42} km/h
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${activeTrip.progressPercentage || 65}%` }}
                />
              </div>
            </div>
          </div>

          {/* Live Map Preview & Track Button */}
          <div className="space-y-3 flex flex-col justify-between">
            <div
              className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center cursor-pointer group"
              onClick={() => navigate(`/employee/track?shuttleId=${activeTrip.shuttleNumber}`)}
            >
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
              <div className="absolute top-1/2 left-4 right-4 h-1 bg-emerald-500/30 -translate-y-1/2" />
              <div className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-75" />
                  <div className="p-2 bg-emerald-500 text-slate-950 rounded-full shadow-lg border-2 border-white dark:border-slate-900">
                    <Compass className="w-4 h-4 animate-spin-slow" />
                  </div>
                </div>
                <span className="text-[10px] font-bold font-mono text-emerald-300 mt-1 bg-slate-900/90 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  {activeTrip.shuttleNumber}
                </span>
              </div>

              <div className="absolute bottom-2 right-2 bg-slate-900/90 backdrop-blur px-2 py-0.5 rounded text-[10px] text-slate-300 border border-slate-800 font-mono">
                Click for Full GPS Radar
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/employee/track?shuttleId=${activeTrip.shuttleNumber}`)}
              leftIcon={<Compass className="w-4 h-4" />}
              className="w-full font-bold shadow-md"
            >
              Track Ride on Live GPS
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
