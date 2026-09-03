import React, { useState, useRef, useEffect } from 'react';
import { useSidebar } from '../../../context/SidebarContext';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { SearchBar } from '../../common/inputs/SearchBar';
import { IconButton } from '../../common/buttons/IconButton';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  CheckCircle2,
  AlertCircle,
  Bus,
  User,
  LogOut,
  ChevronDown,
  Shield,
} from 'lucide-react';
import { AppNotification } from '../../../types';
import { formatTime } from '../../../utils/formatters';

const initialNotifications: AppNotification[] = [
  {
    id: 'n1',
    title: 'Shuttle DEL-04 Delayed',
    message: 'Route Outer Ring Road is experiencing 12 min traffic delay.',
    type: 'WARNING',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: 'n2',
    title: 'Seat Reserved Successfully',
    message: 'Pass #OG-9021 confirmed for 08:30 AM Electronic City Shuttle.',
    type: 'SUCCESS',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: 'n3',
    title: 'Geofence Breach Alert',
    message: 'Shuttle BLR-12 deviated from assigned route path by 1.2km.',
    type: 'ALERT',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
  },
];

export const Navbar: React.FC = () => {
  const { toggleMobile } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const { user, switchRole, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-6 flex items-center justify-between gap-4 shadow-xs">
      {/* Left: Mobile & Tablet Hamburger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={toggleMobile}
          className="lg:hidden flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Quick Switcher Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Shield className="w-3.5 h-3.5 text-indigo-500" />
          <span>Role:</span>
          <select
            value={user?.role || 'ADMIN'}
            onChange={(e) => switchRole(e.target.value as any)}
            className="bg-transparent border-none text-indigo-600 dark:text-indigo-400 font-bold focus:outline-none cursor-pointer"
          >
            <option value="ADMIN">Admin</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="DRIVER">Driver</option>
          </select>
        </div>

        {/* Theme Toggle Button */}
        <IconButton
          icon={theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          label="Toggle Theme"
          onClick={toggleTheme}
          variant="ghost"
          size="md"
        />

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Notifications ({unreadCount} unread)
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 custom-scrollbar">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-500">No notifications.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-3 ${
                        !n.read ? 'bg-indigo-500/5 dark:bg-indigo-500/10' : ''
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          n.type === 'ALERT'
                            ? 'bg-rose-500/10 text-rose-500'
                            : n.type === 'WARNING'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-emerald-500/10 text-emerald-500'
                        }`}
                      >
                        {n.type === 'ALERT' ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </div>
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                            {n.title}
                          </h5>
                          <span className="text-[10px] text-slate-400">
                            {formatTime(n.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-indigo-500/30">
              {user?.name?.substring(0, 2).toUpperCase() || 'OG'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {user?.name}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {user?.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Account Settings
                </button>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
