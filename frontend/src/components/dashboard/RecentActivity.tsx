import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/cards/Card';
import { ActivityLogItem } from '../../types';
import {
  UserPlus,
  Ticket,
  Car,
  MapPin,
  Bus,
  Clock,
} from 'lucide-react';

interface RecentActivityProps {
  activities: ActivityLogItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: ActivityLogItem['type']) => {
    switch (type) {
      case 'EMPLOYEE_ADDED':
        return <UserPlus className="w-3.5 h-3.5 text-indigo-500" />;
      case 'BOOKING_CREATED':
        return <Ticket className="w-3.5 h-3.5 text-emerald-500" />;
      case 'DRIVER_ASSIGNED':
        return <Car className="w-3.5 h-3.5 text-blue-500" />;
      case 'ROUTE_UPDATED':
        return <MapPin className="w-3.5 h-3.5 text-amber-500" />;
      case 'SHUTTLE_DISPATCHED':
        return <Bus className="w-3.5 h-3.5 text-violet-500" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="w-4 h-4 text-indigo-500" /> Operational Activity Stream
        </CardTitle>
        <p className="text-xs text-slate-400">Live system audit log and event feed</p>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-1 overflow-y-auto space-y-4 custom-scrollbar max-h-[360px]">
        <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-800 space-y-4">
          {activities.map((act) => (
            <div key={act.id} className="relative group">
              {/* Timeline Node Dot */}
              <div className="absolute -left-[21px] top-0.5 p-1 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-2xs">
                {getActivityIcon(act.type)}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {act.title}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 shrink-0">
                    {act.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {act.description}
                </p>
                {act.user && (
                  <div className="text-[10px] text-slate-400 font-medium">
                    Triggered by: <span className="text-indigo-600 dark:text-indigo-400">{act.user}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
