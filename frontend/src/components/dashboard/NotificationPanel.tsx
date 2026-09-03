import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/cards/Card';
import { AppNotification } from '../../types';
import { Bell, AlertTriangle, Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface NotificationPanelProps {
  notifications: AppNotification[];
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications: initialNotifs }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifs);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'ALERT':
        return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="w-4 h-4 text-indigo-500" /> Dispatch Alerts
          </CardTitle>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
              {unreadCount} Unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Mark all read
          </button>
        )}
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-1 overflow-y-auto space-y-2.5 custom-scrollbar max-h-[360px]">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">No active dispatch alerts.</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => toggleRead(n.id)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                n.read
                  ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 text-slate-500'
                  : 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/60 shadow-2xs text-slate-800 dark:text-slate-100'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {getIcon(n.type)}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs truncate">{n.title}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                    {n.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
