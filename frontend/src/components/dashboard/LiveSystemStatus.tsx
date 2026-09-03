import React from 'react';
import { Card } from '../common/cards/Card';
import { Users, Bus, Calendar, Clock, AlertTriangle, XCircle } from 'lucide-react';

interface LiveSystemStatusProps {
  metrics?: {
    onlineDrivers?: number;
    runningShuttles?: number;
    todaysTrips?: number;
    pendingApprovals?: number;
    delayedTrips?: number;
    cancelledTrips?: number;
  };
}

export const LiveSystemStatus: React.FC<LiveSystemStatusProps> = ({ metrics }) => {
  const data = {
    onlineDrivers: metrics?.onlineDrivers ?? 18,
    runningShuttles: metrics?.runningShuttles ?? 14,
    todaysTrips: metrics?.todaysTrips ?? 86,
    pendingApprovals: metrics?.pendingApprovals ?? 5,
    delayedTrips: metrics?.delayedTrips ?? 2,
    cancelledTrips: metrics?.cancelledTrips ?? 1,
  };

  const statusCards = [
    {
      title: 'Online Drivers',
      value: data.onlineDrivers,
      icon: Users,
      color: 'border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
      badge: 'Active & Checked-In',
    },
    {
      title: 'Running Shuttles',
      value: data.runningShuttles,
      icon: Bus,
      color: 'border-indigo-500/20 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10',
      badge: 'In Transit on Route',
    },
    {
      title: "Today's Trips",
      value: data.todaysTrips,
      icon: Calendar,
      color: 'border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-500/10',
      badge: 'Scheduled Dispatches',
    },
    {
      title: 'Pending Approvals',
      value: data.pendingApprovals,
      icon: Clock,
      color: 'border-amber-500/20 text-amber-600 dark:text-amber-400 bg-amber-500/10',
      badge: 'Action Required',
    },
    {
      title: 'Delayed Trips',
      value: data.delayedTrips,
      icon: AlertTriangle,
      color: 'border-orange-500/20 text-orange-600 dark:text-orange-400 bg-orange-500/10',
      badge: 'Traffic Slowdowns',
    },
    {
      title: 'Cancelled Trips',
      value: data.cancelledTrips,
      icon: XCircle,
      color: 'border-rose-500/20 text-rose-600 dark:text-rose-400 bg-rose-500/10',
      badge: 'User / Weather Void',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Live System Operational Status
        </h3>
        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Telematics Stream Active
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statusCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="p-3.5 space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 truncate">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-lg ${card.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {card.value}
                </h4>
                <p className="text-[10px] text-slate-400 truncate font-medium mt-0.5">
                  {card.badge}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
