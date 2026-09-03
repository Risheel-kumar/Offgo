import React from 'react';
import { CommuteAnalytics } from '../../types';
import { Bus, MapPin, Clock, Leaf, ShieldCheck, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatisticsCardsProps {
  analytics: CommuteAnalytics | null;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({ analytics }) => {
  if (!analytics) return null;

  const stats = [
    {
      id: 'trips',
      title: 'Trips This Month',
      value: analytics.tripsThisMonth,
      subtitle: `${analytics.completedTrips} completed`,
      icon: Bus,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    },
    {
      id: 'distance',
      title: 'Total Distance',
      value: `${analytics.totalDistanceKm} km`,
      subtitle: 'Commuted safely',
      icon: MapPin,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    },
    {
      id: 'duration',
      title: 'Avg. Travel Time',
      value: `${analytics.averageTravelTimeMinutes} mins`,
      subtitle: `${analytics.onTimeArrivalPercentage}% on-time rate`,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    },
    {
      id: 'carbon',
      title: 'CO₂ Saved',
      value: `${analytics.carbonSavedKg} kg`,
      subtitle: 'Eco-friendly commute',
      icon: Leaf,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-500/10 dark:bg-teal-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {stat.title}
              </span>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {stat.value}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium truncate">
              {stat.subtitle}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};
