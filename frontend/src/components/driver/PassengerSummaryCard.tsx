import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../common/cards/Card';
import { Users } from 'lucide-react';
import { DriverTripNavigationState } from '../../services/driverNavigationService';

interface PassengerSummaryCardProps {
  stats?: DriverTripNavigationState['passengerStats'];
}

export const PassengerSummaryCard: React.FC<PassengerSummaryCardProps> = ({ stats }) => {
  const totalBookings = stats?.totalBookings || 32;
  const boarded = stats?.boarded || 0;
  const waiting = stats?.waiting || 32;
  const remaining = stats?.remaining || 32;

  const boardedPercent = Math.round((boarded / totalBookings) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
    >
      <Card className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-sm transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold">Employee Boarding Summary</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
              {boardedPercent}% Boarded
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-xs">
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${boardedPercent}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block">TOTAL BOOKINGS</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {totalBookings} Reserved
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block">
                BOARDED
              </span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {boarded} Confirmed
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold block">
                WAITING
              </span>
              <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                {waiting} Passengers
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold block">
                REMAINING
              </span>
              <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                {remaining} Total
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

