import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import {
  Home,
  Ticket,
  Navigation,
  LifeBuoy,
  LayoutDashboard,
  Compass,
  AlertCircle,
} from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  isLive?: boolean;
}

export const MobileBottomTabBar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const role = user?.role || 'EMPLOYEE';

  // Role-aware tab configuration ensuring 'My Bookings', 'Live Tracking', and 'Support' are prioritized
  const getTabsForRole = (): TabItem[] => {
    switch (role) {
      case 'ADMIN':
      case 'FLEET_MANAGER':
        return [
          {
            id: 'admin-dash',
            label: 'Overview',
            path: '/admin/live-tracking',
            icon: LayoutDashboard,
          },
          {
            id: 'admin-tracking',
            label: 'Live Tracking',
            path: '/admin/live-tracking',
            icon: Navigation,
            isLive: true,
          },
          {
            id: 'admin-support',
            label: 'Support',
            path: '/admin/complaints',
            icon: AlertCircle,
          },
        ];

      case 'DRIVER':
        return [
          {
            id: 'driver-dash',
            label: 'Console',
            path: '/driver/dashboard',
            icon: Compass,
          },
          {
            id: 'driver-tracking',
            label: 'Live Tracking',
            path: '/driver/navigation',
            icon: Navigation,
            isLive: true,
          },
          {
            id: 'driver-support',
            label: 'Support',
            path: '/driver/complaints',
            icon: AlertCircle,
          },
        ];

      case 'EMPLOYEE':
      default:
        return [
          {
            id: 'emp-home',
            label: 'Commute',
            path: '/employee/dashboard',
            icon: Home,
          },
          {
            id: 'emp-booking',
            label: 'My Bookings',
            path: '/employee/booking',
            icon: Ticket,
          },
          {
            id: 'emp-track',
            label: 'Live Tracking',
            path: '/employee/track',
            icon: Navigation,
            isLive: true,
          },
          {
            id: 'emp-support',
            label: 'Support',
            path: '/employee/complaints',
            icon: LifeBuoy,
          },
        ];
    }
  };

  const tabs = getTabsForRole();

  return (
    <div
      id="mobile-bottom-tab-bar"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-slate-900/95 dark:bg-slate-950/95 bg-white/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/80 shadow-2xl px-2 py-1.5 pb-safe"
    >
      <nav aria-label="Mobile Navigation" className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path || location.pathname.startsWith(`${tab.path}/`);

          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              id={`mobile-tab-${tab.id}`}
              className={({ isActive: linkActive }) => {
                const active = linkActive || isActive;
                return `relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 min-h-[52px] rounded-2xl transition-all duration-200 select-none touch-manipulation focus:outline-none ${
                  active
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`;
              }}
            >
              {/* Active Tab Background Pill */}
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTabPill"
                  className="absolute inset-0 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl border border-indigo-200/60 dark:border-indigo-500/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Tab Icon Container */}
              <div className="relative z-10 flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.75]'
                  }`}
                />

                {/* Live Green Pulsing Beacon for Live Tracking Tab */}
                {tab.isLive && (
                  <span className="absolute -top-0.5 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                )}
              </div>

              {/* Tab Label */}
              <span className="relative z-10 text-[10px] tracking-tight mt-1 leading-none font-medium truncate max-w-full">
                {tab.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
