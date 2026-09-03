import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../common/cards/Card';
import { StopCard } from './StopCard';
import { Navigation, Building2, MapPin } from 'lucide-react';
import { DriverNavigationStop } from '../../services/driverNavigationService';

interface RouteTimelineProps {
  stops: DriverNavigationStop[];
  activeStopIndex: number;
  onMarkCompleted: (stopId: string) => void;
  isShiftRunning: boolean;
}

export const RouteTimeline: React.FC<RouteTimelineProps> = ({
  stops,
  activeStopIndex,
  onMarkCompleted,
  isShiftRunning,
}) => {
  const completedCount = stops.filter((s) => s.status === 'COMPLETED').length;

  return (
    <Card className="shadow-xs hover:shadow-sm transition-all border-slate-200/90 dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Navigation className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Assigned Route & Waypoints</span>
        </CardTitle>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-mono">
          {completedCount} / {stops.length} Reached
        </span>
      </CardHeader>

      <CardContent className="space-y-6 pt-5">
        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {/* Driver Start Origin Pin */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative flex items-center gap-3"
          >
            <div className="absolute -left-6 sm:-left-8 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-md ring-4 ring-emerald-500/20">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 rounded-2xl text-xs w-full flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block font-mono">
                  TRIP ORIGIN / CURRENT GPS
                </span>
                <span className="font-bold text-slate-900 dark:text-white">Indiranagar Shuttle Depot</span>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px] font-mono bg-emerald-500/15 px-2 py-0.5 rounded">
                Shift Start
              </span>
            </div>
          </motion.div>

          {/* Render Stops */}
          {stops.map((stop, idx) => {
            const isCurrent = idx === activeStopIndex;

            return (
              <motion.div
                key={stop.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="relative"
              >
                {/* Timeline connector dot indicator */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs z-10 ${
                    stop.status === 'COMPLETED'
                      ? 'bg-emerald-500 text-white'
                      : stop.isOfficeDestination
                      ? 'bg-purple-600 text-white ring-4 ring-purple-500/20'
                      : isCurrent && isShiftRunning
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20 animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {stop.isOfficeDestination ? <Building2 className="w-3.5 h-3.5" /> : stop.sequence}
                </div>

                <StopCard
                  stop={stop}
                  isCurrent={isCurrent}
                  onMarkCompleted={onMarkCompleted}
                  isShiftRunning={isShiftRunning}
                />
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

