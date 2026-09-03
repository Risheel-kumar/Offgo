import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../common/cards/Card';
import { ArrowRight, Building2 } from 'lucide-react';
import { DriverNavigationStop } from '../../services/driverNavigationService';

interface NextStopCardProps {
  nextStop: DriverNavigationStop | null;
}

export const NextStopCard: React.FC<NextStopCardProps> = ({ nextStop }) => {
  if (!nextStop) {
    return (
      <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardContent className="p-5 text-center text-xs text-slate-500 space-y-1">
          <Building2 className="w-5 h-5 mx-auto text-purple-500" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Next destination is Office HQ Arrival.</span>
        </CardContent>
      </Card>
    );
  }

  const isOffice = Boolean(nextStop.isOfficeDestination);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: 0.05 }}
      className="h-full"
    >
      <Card className="bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all h-full flex flex-col justify-between">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 font-mono">
              <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              UPCOMING NEXT WAYPOINT
            </span>
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded">
              {nextStop.scheduledTime}
            </span>
          </div>
          <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-1">
            {isOffice && <Building2 className="w-4 h-4 text-purple-500 shrink-0" />}
            <span className="truncate">{nextStop.name}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-xs pt-0">
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">{nextStop.address}</p>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 font-medium">Passenger Target:</span>
            <span className="font-bold text-slate-900 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {isOffice ? '32 Office Dropoffs' : `${nextStop.passengersWaiting} Waiting`}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

