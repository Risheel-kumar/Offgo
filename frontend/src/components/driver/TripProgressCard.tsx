import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../common/cards/Card';
import { Navigation, Building2 } from 'lucide-react';
import { DriverTripNavigationState } from '../../services/driverNavigationService';

interface TripProgressCardProps {
  progress?: DriverTripNavigationState['progress'];
  officeName?: string;
}

export const TripProgressCard: React.FC<TripProgressCardProps> = ({ progress, officeName }) => {
  const percentage = progress?.percentage || 0;
  const completedStops = progress?.completedStopsCount || 0;
  const totalStops = progress?.totalStopsCount || 4;
  const coveredKm = progress?.distanceCoveredKm || 0;
  const remainingKm = progress?.remainingDistanceKm || 18.4;
  const etaOffice = progress?.estimatedOfficeArrival || '09:15 AM';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.05 }}
    >
      <Card className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-sm transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold">Trip Execution Progress</span>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded">
              {percentage}% Complete
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-xs">
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block">WAYPOINTS</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {completedStops} / {totalStops} Completed
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block">DISTANCE COVERED</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {coveredKm} km ({remainingKm} km left)
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 col-span-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block font-mono">
                    OFFICE ARRIVAL ETA
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {officeName || 'Tech Park Office HQ'}
                  </span>
                </div>
              </div>
              <span className="text-sm font-extrabold font-mono text-purple-600 dark:text-purple-400">
                {etaOffice}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

