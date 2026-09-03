import React from 'react';
import { MetricCard } from '../common/cards/MetricCard';
import { DashboardMetrics } from '../../types';
import {
  Users,
  Car,
  Bus,
  Route as RouteIcon,
  CalendarDays,
  Ticket,
  UserCheck,
  Radio,
} from 'lucide-react';

interface StatisticsSectionProps {
  metrics: DashboardMetrics;
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({ metrics }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Key Performance Indicators (KPIs)
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees */}
        <MetricCard
          title="Total Employees"
          value={metrics.totalEmployees.toLocaleString()}
          change={{ value: '+84 this month', type: 'increase', timeframe: 'Registered in HR' }}
          icon={<Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          iconBgColor="bg-indigo-50 dark:bg-indigo-500/10"
        />

        {/* Total Drivers */}
        <MetricCard
          title="Active Drivers"
          value={metrics.totalDrivers.toString()}
          change={{ value: '100% Verified', type: 'neutral', timeframe: 'Licensed & active' }}
          icon={<Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          iconBgColor="bg-blue-50 dark:bg-blue-500/10"
        />

        {/* Total Shuttles */}
        <MetricCard
          title="Fleet Size (Shuttles)"
          value={metrics.totalShuttles.toString()}
          change={{ value: `${metrics.activeShuttles} Active now`, type: 'increase', timeframe: 'In transit / dispatch' }}
          icon={<Bus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-500/10"
        />

        {/* Total Routes */}
        <MetricCard
          title="Active Routes"
          value={metrics.totalRoutes.toString()}
          change={{ value: '+2 new lines', type: 'increase', timeframe: 'Corridor coverage' }}
          icon={<RouteIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          iconBgColor="bg-amber-50 dark:bg-amber-500/10"
        />

        {/* Total Schedules */}
        <MetricCard
          title="Daily Schedules"
          value={metrics.totalSchedules.toString()}
          change={{ value: 'Peak Hours Active', type: 'neutral', timeframe: 'Morning & evening runs' }}
          icon={<CalendarDays className="w-5 h-5 text-violet-600 dark:text-violet-400" />}
          iconBgColor="bg-violet-50 dark:bg-violet-500/10"
        />

        {/* Total Bookings */}
        <MetricCard
          title="Total Bookings"
          value={metrics.totalBookings.toLocaleString()}
          change={{ value: '+18.4%', type: 'increase', timeframe: 'vs last week' }}
          icon={<Ticket className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
          iconBgColor="bg-rose-50 dark:bg-rose-500/10"
        />

        {/* Attendance Rate */}
        <MetricCard
          title="Daily Attendance"
          value={`${metrics.attendanceRatePercent}%`}
          change={{ value: `${metrics.totalAttendance} checked-in`, type: 'increase', timeframe: 'QR scanned' }}
          icon={<UserCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
          iconBgColor="bg-teal-50 dark:bg-teal-500/10"
        />

        {/* Active Shuttles */}
        <MetricCard
          title="Active Shuttles"
          value={`${metrics.activeShuttles} / ${metrics.totalShuttles}`}
          change={{ value: `${metrics.onTimePercentage}% On-Time`, type: 'increase', timeframe: 'GPS tracked' }}
          icon={<Radio className="w-5 h-5 text-sky-600 dark:text-sky-400 animate-pulse" />}
          iconBgColor="bg-sky-50 dark:bg-sky-500/10"
        />
      </div>
    </div>
  );
};
