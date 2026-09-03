import React from 'react';
import { EnterpriseNotification } from '../../types';
import { Bell, Check, ArrowRight, AlertTriangle, Bus, Calendar, Info } from 'lucide-react';

interface NotificationWidgetProps {
  notifications: EnterpriseNotification[];
  onMarkRead?: (id: string) => void;
  onOpenNotificationCenter?: () => void;
}

export const NotificationWidget: React.FC<NotificationWidgetProps> = ({
  notifications,
  onMarkRead,
  onOpenNotificationCenter,
}) => {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 text-center shadow-sm">
        <Bell className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto mb-1" />
        <p className="text-xs text-slate-500">No new commute notifications.</p>
      </div>
    );
  }

  const recent = notifications.slice(0, 3);

  const getIcon = (type: string) => {
    switch (type) {
      case 'BOOKING_CREATED':
      case 'BOOKING_CANCELLED':
        return Calendar;
      case 'TRIP_STARTED':
      case 'TRIP_COMPLETED':
        return Bus;
      case 'SYSTEM_ALERT':
        return AlertTriangle;
      default:
        return Info;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Recent Commute Alerts
          </h3>
        </div>
        {onOpenNotificationCenter && (
          <button
            type="button"
            onClick={onOpenNotificationCenter}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            All Alerts
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {recent.map((n) => {
          const Icon = getIcon(n.type);
          return (
            <div
              key={n.id}
              className={`p-3 rounded-xl border transition-colors flex items-start gap-3 ${
                !n.read
                  ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
              }`}
            >
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-emerald-600 dark:text-emerald-400 shadow-2xs mt-0.5 shrink-0">
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {n.title}
                  </h4>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {n.message}
                </p>
              </div>

              {!n.read && onMarkRead && (
                <button
                  type="button"
                  onClick={() => onMarkRead(n.id)}
                  className="p-1 hover:bg-emerald-500/10 text-emerald-600 rounded shrink-0"
                  title="Mark as Read"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
