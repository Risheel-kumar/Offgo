import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/cards/Card';
import {
  Activity,
  Ticket,
  UserCheck,
  Play,
  CheckCircle2,
  UserPlus,
  Calendar,
  Clock,
} from 'lucide-react';

export interface ActivityTimelineItem {
  id: string;
  type:
    | 'BOOKING_CREATED'
    | 'DRIVER_ASSIGNED'
    | 'TRIP_STARTED'
    | 'TRIP_COMPLETED'
    | 'USER_APPROVED'
    | 'SCHEDULE_CREATED';
  title: string;
  description: string;
  timestamp: string;
}

const mockTimelineItems: ActivityTimelineItem[] = [
  {
    id: 'act-1',
    type: 'TRIP_STARTED',
    title: 'Trip Started',
    description: 'Shuttle OG-BUS-104 initiated Outer Ring Road Express route with 24 passengers.',
    timestamp: '2 mins ago',
  },
  {
    id: 'act-2',
    type: 'BOOKING_CREATED',
    title: 'Booking Created',
    description: 'Employee Sarah Jenkins reserved seat 14A on ORR Express for 08:30 AM departure.',
    timestamp: '8 mins ago',
  },
  {
    id: 'act-3',
    type: 'DRIVER_ASSIGNED',
    title: 'Driver Assigned',
    description: 'Driver Karan Sharma assigned to Whitefield Shuttle OG-BUS-202 for evening shift.',
    timestamp: '15 mins ago',
  },
  {
    id: 'act-4',
    type: 'USER_APPROVED',
    title: 'User Approved',
    description: 'Admin approved registration request for new employee Alex Rivera (Engineering).',
    timestamp: '28 mins ago',
  },
  {
    id: 'act-5',
    type: 'TRIP_COMPLETED',
    title: 'Trip Completed',
    description: 'Koramangala Loop OG-BUS-108 completed morning run with 100% on-time rating.',
    timestamp: '42 mins ago',
  },
  {
    id: 'act-6',
    type: 'SCHEDULE_CREATED',
    title: 'Schedule Created',
    description: 'New weekend overtime shuttle schedule published for Whitefield Campus.',
    timestamp: '1 hour ago',
  },
];

export const RecentActivityTimeline: React.FC = () => {
  const getIcon = (type: ActivityTimelineItem['type']) => {
    switch (type) {
      case 'BOOKING_CREATED':
        return <Ticket className="w-3.5 h-3.5 text-indigo-500" />;
      case 'DRIVER_ASSIGNED':
        return <UserCheck className="w-3.5 h-3.5 text-blue-500" />;
      case 'TRIP_STARTED':
        return <Play className="w-3.5 h-3.5 text-amber-500" />;
      case 'TRIP_COMPLETED':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'USER_APPROVED':
        return <UserPlus className="w-3.5 h-3.5 text-teal-500" />;
      case 'SCHEDULE_CREATED':
        return <Calendar className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-500" />
          Operations Activity Timeline
        </CardTitle>
        <span className="text-[11px] font-mono text-slate-400">Live Real-time Feed</span>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative pl-4 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {mockTimelineItems.map((item) => (
            <div key={item.id} className="relative flex items-start gap-3 group">
              <div className="absolute -left-4 top-0.5 p-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm z-10">
                {getIcon(item.type)}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 w-full space-y-1 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">
                    {item.title}
                  </h5>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
