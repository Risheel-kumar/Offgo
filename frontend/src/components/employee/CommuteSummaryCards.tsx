import React from 'react';
import { Card } from '../common/cards/Card';
import {
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  MapPin,
  Timer,
} from 'lucide-react';
import { CommuteAnalytics } from '../../types';

interface CommuteSummaryCardsProps {
  analytics?: CommuteAnalytics | null;
}

export const CommuteSummaryCards: React.FC<CommuteSummaryCardsProps> = ({ analytics }) => {
  const data = {
    tripsThisMonth: analytics?.totalTripsMonth || 22,
    completedTrips: analytics?.completedTrips || 20,
    upcomingTrips: analytics?.upcomingTrips || 2,
    currentMonthExpenseUSD: analytics?.savedExpenseUSD || 660,
    averageTravelTimeMins: analytics?.averageTimeMins || 28,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Trips This Month */}
      <Card className="p-4 flex flex-col justify-between space-y-2 border-indigo-500/20">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
            Trips This Month
          </span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {data.tripsThisMonth}
          </h3>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3" /> +12% vs last month
          </p>
        </div>
      </Card>

      {/* Completed Trips */}
      <Card className="p-4 flex flex-col justify-between space-y-2 border-emerald-500/20">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
            Completed Trips
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {data.completedTrips}
          </h3>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
            100% On-time Boarding
          </p>
        </div>
      </Card>

      {/* Upcoming Trips */}
      <Card className="p-4 flex flex-col justify-between space-y-2 border-blue-500/20">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
            Upcoming Trips
          </span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {data.upcomingTrips}
          </h3>
          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-0.5">
            Scheduled for Today & Tomorrow
          </p>
        </div>
      </Card>

      {/* Current Month Expense */}
      <Card className="p-4 flex flex-col justify-between space-y-2 border-amber-500/20">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
            Current Month Expense
          </span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            ${data.currentMonthExpenseUSD}
          </h3>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold mt-0.5">
            $0 Out of Pocket (Subsidized)
          </p>
        </div>
      </Card>

      {/* Average Travel Time */}
      <Card className="p-4 flex flex-col justify-between space-y-2 border-purple-500/20">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
            Average Travel Time
          </span>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
            <Timer className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {data.averageTravelTimeMins} mins
          </h3>
          <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-0.5">
            Express Dedicated Bus Lane
          </p>
        </div>
      </Card>
    </div>
  );
};
