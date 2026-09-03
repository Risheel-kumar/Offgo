import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/cards/Card';
import {
  AlertTriangle,
  Route,
  Calendar,
  Wrench,
  Megaphone,
  Bell,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { EnterpriseNotification } from '../../types';

interface TransportAlertsWidgetProps {
  notifications?: EnterpriseNotification[];
}

export const TransportAlertsWidget: React.FC<TransportAlertsWidgetProps> = ({ notifications = [] }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'TRIP_STARTED':
      case 'TRIP_COMPLETED':
      case 'BOOKING_CREATED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'ROUTE_UPDATED':
        return <Route className="w-4 h-4 text-blue-500" />;
      case 'SCHEDULE_UPDATED':
      case 'ANNOUNCEMENT':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'BOOKING_CANCELLED':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'SYSTEM_ALERT':
        return <Wrench className="w-4 h-4 text-orange-500" />;
      default:
        return <Megaphone className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'BOOKING_CANCELLED':
      case 'SYSTEM_ALERT':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200';
      case 'ROUTE_UPDATED':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-900 dark:text-blue-200';
      case 'SCHEDULE_UPDATED':
      case 'ANNOUNCEMENT':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-900 dark:text-purple-200';
      case 'TRIP_STARTED':
      case 'TRIP_COMPLETED':
      case 'BOOKING_CREATED':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-200';
      default:
        return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-500" />
          Transportation & Fleet Alerts
        </CardTitle>
        <span className="text-xs font-bold text-slate-400 font-mono">
          {notifications.length} Active Notices
        </span>
      </CardHeader>

      <CardContent className="space-y-3">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
            No active notices right now.
          </div>
        ) : (
          notifications.slice(0, 5).map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-2xl border ${getAlertStyle(alert.type)} transition-all`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 shadow-sm shrink-0">
                    {getAlertIcon(alert.type)}
                  </div>
                  <h4 className="font-extrabold text-xs">{alert.title}</h4>
                </div>

                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className="text-xs mt-2 pl-8 opacity-90 leading-relaxed font-medium">
                {alert.message}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
