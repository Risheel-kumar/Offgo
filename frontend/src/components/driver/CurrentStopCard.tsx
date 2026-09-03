import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../common/cards/Card';
import { Button } from '../common/buttons/Button';
import { CheckCircle2 } from 'lucide-react';
import { DriverNavigationStop } from '../../services/driverNavigationService';

interface CurrentStopCardProps {
  currentStop: DriverNavigationStop | null;
  onMarkCompleted: (stopId: string) => void;
  isShiftRunning: boolean;
  distanceToStopMeters?: number | null;
  isWithinArrivalRadius?: boolean;
  totalStops?: number;
}

export const CurrentStopCard: React.FC<CurrentStopCardProps> = ({
  currentStop,
  onMarkCompleted,
  isShiftRunning,
  distanceToStopMeters,
  isWithinArrivalRadius = false,
  totalStops = 0,
}) => {
  if (!currentStop) {
    return (
      <Card className="bg-slate-50 dark:bg-slate-900 border-dashed border-2 border-slate-200 dark:border-slate-800">
        <CardContent className="p-6 text-center text-slate-400 text-xs">
          No current stop active.
        </CardContent>
      </Card>
    );
  }

  const isOffice = Boolean(currentStop.isOfficeDestination);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        className={`border shadow-md h-full transition-all ${
          isOffice
            ? 'bg-gradient-to-br from-purple-900 to-slate-950 text-white border-purple-600/60'
            : 'bg-gradient-to-br from-indigo-900 to-slate-950 text-white border-indigo-600/60'
        }`}
      >
        <CardHeader className="pb-3 border-b border-white/10">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {isOffice ? 'FINAL DESTINATION (OFFICE)' : 'CURRENT ACTIVE STOP'}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-white/15 text-white font-mono shrink-0">
              Stop {currentStop.sequence + 1} of {totalStops}
            </span>
          </div>
          <CardTitle className="text-xl font-black text-white mt-2 tracking-tight">
            {currentStop.name}
          </CardTitle>
          <p className="text-xs text-slate-300">{currentStop.address}</p>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-black/30 border border-white/10">
              <span className="text-[10px] text-slate-400 block font-mono">EST. ARRIVAL</span>
              <span className="font-extrabold text-white text-sm font-mono">{currentStop.scheduledTime}</span>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-white/10">
              <span className="text-[10px] text-slate-400 block font-mono">DISTANCE</span>
                <span className="font-extrabold text-emerald-400 text-sm font-mono">{distanceToStopMeters === null || distanceToStopMeters === undefined ? 'Unknown' : distanceToStopMeters < 1000 ? `${Math.round(distanceToStopMeters)} m` : `${(distanceToStopMeters / 1000).toFixed(1)} km`}</span>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-white/10">
              <span className="text-[10px] text-slate-400 block font-mono">BOARDING</span>
              <span className="font-extrabold text-amber-300 text-sm">
                {currentStop.passengersWaiting} Waiting
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-white/10">
              <span className="text-[10px] text-slate-400 block font-mono">DROPOFFS</span>
              <span className="font-extrabold text-purple-200 text-sm">
                {currentStop.passengersDropped || 0}
              </span>
            </div>
          </div>

          {isShiftRunning && (
            <Button
              variant="primary"
              size="lg"
              disabled={!isWithinArrivalRadius}
              onClick={() => onMarkCompleted(currentStop.id)}
              leftIcon={<CheckCircle2 className="w-5 h-5" />}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold border-none shadow-lg shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              {isWithinArrivalRadius ? (isOffice ? 'Confirm Office Arrival & Finish Trip' : 'Arrived - Continue to Next Stop') : `Arrive within 100 m to continue`}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

