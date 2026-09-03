import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '../../../context/SidebarContext';
import { useAuth } from '../../../context/AuthContext';
import { getNavSectionsForRole } from '../../../constants/navItems';
import { getDashboardRouteByRole } from '../../../utils/helpers';
import { Role } from '../../../types';
import { apiClient } from '../../../api/axios';
import {
  Bus,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Navigation,
  GitMerge,
  Users,
  BarChart3,
  Settings,
  Home,
  Ticket,
  QrCode,
  MapPin,
  Compass,
  CalendarCheck,
  Scan,
  X,
  ShieldCheck,
  UserCheck,
  Truck,
  DollarSign,
  AlertCircle,
  User,
  KeyRound,
  PencilLine,
  LogOut,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5 shrink-0" />,
  Navigation: <Navigation className="w-5 h-5 shrink-0" />,
  GitMerge: <GitMerge className="w-5 h-5 shrink-0" />,
  Bus: <Bus className="w-5 h-5 shrink-0" />,
  Users: <Users className="w-5 h-5 shrink-0" />,
  BarChart3: <BarChart3 className="w-5 h-5 shrink-0" />,
  Settings: <Settings className="w-5 h-5 shrink-0" />,
  Home: <Home className="w-5 h-5 shrink-0" />,
  Ticket: <Ticket className="w-5 h-5 shrink-0" />,
  QrCode: <QrCode className="w-5 h-5 shrink-0" />,
  MapPin: <MapPin className="w-5 h-5 shrink-0" />,
  Compass: <Compass className="w-5 h-5 shrink-0" />,
  CalendarCheck: <CalendarCheck className="w-5 h-5 shrink-0" />,
  Scan: <Scan className="w-5 h-5 shrink-0" />,
  UserCheck: <UserCheck className="w-5 h-5 shrink-0" />,
  DollarSign: <DollarSign className="w-5 h-5 shrink-0" />,
  AlertCircle: <AlertCircle className="w-5 h-5 shrink-0" />,
};

export const Sidebar: React.FC = () => {
  const { isCollapsed, toggleCollapse, isMobileOpen, closeMobile } = useSidebar();
  const { user, logout, updateUser } = useAuth();
  const location = useLocation();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileSection, setProfileSection] = useState<'details' | 'edit' | 'password'>('details');
  const [isSaving, setIsSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || user?.name?.split(' ')[0] || '',
    lastName: user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phoneNumber: user?.phone || '',
    department: user?.department || '',
    employeeId: user?.employeeId || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const role: Role = user?.role || 'ADMIN';
  const navSections = getNavSectionsForRole(role);

  useEffect(() => {
    setProfileForm({
      firstName: user?.firstName || user?.name?.split(' ')[0] || '',
      lastName: user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phoneNumber: user?.phone || '',
      department: user?.department || '',
      employeeId: user?.employeeId || '',
    });
  }, [user]);

  const sectionTitle = useMemo(() => {
    if (profileSection === 'details') return 'Profile Details';
    if (profileSection === 'edit') return 'Edit Profile';
    return 'Change Password';
  }, [profileSection]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const payload = {
        firstName: profileForm.firstName?.trim() || user?.firstName || user?.name?.split(' ')[0] || '',
        lastName: profileForm.lastName?.trim() || user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
        email: profileForm.email?.trim() || user?.email || '',
        phoneNumber: (profileForm.phoneNumber || user?.phone || '').toString().replace(/\s+/g, '').replace(/[^\d]/g, ''),
        department: profileForm.department?.trim() || user?.department || '',
        employeeId: profileForm.employeeId?.trim() || user?.employeeId || '',
      };

      const response = await apiClient.put('/users/me', payload);
      const profile = response.data?.data ?? response.data;
      const updatedUser = {
        ...user,
        name: `${profile.firstName || profileForm.firstName} ${profile.lastName || profileForm.lastName}`.trim(),
        email: profile.email || profileForm.email,
        phone: profile.phoneNumber || profileForm.phoneNumber,
        department: profile.department || profileForm.department,
        employeeId: profile.employeeId || profileForm.employeeId,
      };
      updateUser(updatedUser);
      setProfileOpen(false);
      setProfileMenuOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setIsSaving(true);

    try {
      await apiClient.patch('/users/me/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setProfileOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Close drawer on ESC key press
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        closeMobile();
      }
    },
    [isMobileOpen, closeMobile]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderNavItems = (isDrawer = false) => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800 selection:bg-indigo-500 selection:text-white">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800 shrink-0">
        <NavLink
          to={getDashboardRouteByRole(user?.role)}
          onClick={() => isDrawer && closeMobile()}
          className="flex items-center gap-3 group overflow-hidden"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-600/30">
            <Bus className="w-5 h-5" />
          </div>
          {(!isCollapsed || isDrawer) && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-baseline gap-1.5"
            >
              <span className="text-white font-extrabold text-xl tracking-tight font-sans">
                Off-Go
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                PRO
              </span>
            </motion.div>
          )}
        </NavLink>

        {/* Desktop Collapse Toggle Button */}
        {!isDrawer && (
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}

        {/* Drawer Close Button */}
        {isDrawer && (
          <button
            onClick={closeMobile}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
            aria-label="Close Navigation Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Profile settings card */}
      {(!isCollapsed || isDrawer) && (
        <div className="p-3 mx-4 my-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
          <button
            type="button"
            onClick={() => setProfileMenuOpen((prev) => !prev)}
            className="flex w-full items-center gap-3 rounded-xl text-left transition-colors hover:bg-slate-700/60 p-1.5"
            aria-expanded={profileMenuOpen}
            aria-label="Toggle profile menu"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 ring-2 ring-indigo-500/30">
              {user?.name?.substring(0, 2).toUpperCase() || 'OG'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-white truncate">{user?.name || 'Enterprise User'}</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 truncate">
                {user?.role || 'ADMIN'}
              </div>
            </div>
            <div className="rounded-lg bg-slate-900 px-1.5 py-1 text-slate-400">
              {profileMenuOpen ? '▴' : '▾'}
            </div>
          </button>

          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-1.5 text-xs pt-2">
                  <button
                    onClick={() => {
                      setProfileSection('details');
                      setProfileOpen(true);
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    Profile Details
                  </button>
                  <button
                    onClick={() => {
                      setProfileSection('edit');
                      setProfileOpen(true);
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    <PencilLine className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setProfileSection('password');
                      setProfileOpen(true);
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    Change Password
                  </button>
                  <button
                    onClick={async () => {
                      setProfileMenuOpen(false);
                      await logout();
                      if (isDrawer) closeMobile();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-5 custom-scrollbar">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            {(!isCollapsed || isDrawer) && (
              <h4 className="px-2 text-[10px] font-mono font-extrabold tracking-wider text-slate-400 uppercase mb-1">
                {section.title}
              </h4>
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => isDrawer && closeMobile()}
                    title={isCollapsed && !isDrawer ? item.label : undefined}
                    className={({ isActive }) =>
                      `relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all select-none ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border-l-4 border-indigo-300 font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                      } ${isCollapsed && !isDrawer ? 'justify-center' : ''}`
                    }
                  >
                    <span className="shrink-0">{iconMap[item.iconName] || <Bus className="w-5 h-5" />}</span>

                    {(!isCollapsed || isDrawer) && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}

                    {(!isCollapsed || isDrawer) && item.badge && (
                      <span
                        className={`ml-auto text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                          item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 p-4">
                <h3 className="text-sm font-bold text-white">{sectionTitle}</h3>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                  aria-label="Close profile settings"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 p-4 text-sm text-slate-200">
                {profileSection === 'details' && (
                  <>
                    <div className="rounded-xl bg-slate-800 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400">Full Name</div>
                      <div className="mt-1 font-medium text-white">{user?.name || 'N/A'}</div>
                    </div>
                    <div className="rounded-xl bg-slate-800 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400">Email</div>
                      <div className="mt-1 font-medium text-white">{user?.email || 'N/A'}</div>
                    </div>
                    <div className="rounded-xl bg-slate-800 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400">Department</div>
                      <div className="mt-1 font-medium text-white">{user?.department || 'N/A'}</div>
                    </div>
                    <div className="rounded-xl bg-slate-800 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400">Employee ID</div>
                      <div className="mt-1 font-medium text-white">{user?.employeeId || 'N/A'}</div>
                    </div>
                  </>
                )}

                {profileSection === 'edit' && (
                  <div className="space-y-3">
                    <input
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      placeholder="First name"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400"
                    />
                    <input
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      placeholder="Last name"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400"
                    />
                    <input
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      placeholder="Email"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400"
                    />
                    <input
                      value={profileForm.phoneNumber}
                      onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                      placeholder="Phone number"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400"
                    />
                    <input
                      value={profileForm.department}
                      onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                      placeholder="Department"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400"
                    />
                    <input
                      value={profileForm.employeeId}
                      onChange={(e) => setProfileForm({ ...profileForm, employeeId: e.target.value })}
                      placeholder="Employee ID"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400"
                    />
                  </div>
                )}

                {profileSection === 'password' && (
                  <div className="space-y-3">
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="Current password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400"
                    />
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="New password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400"
                    />
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="Confirm password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setProfileOpen(false)}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={profileSection === 'password' ? handlePasswordChange : handleSaveProfile}
                    disabled={isSaving}
                    className="flex-1 rounded-xl bg-indigo-600 px-3 py-2 font-medium text-white disabled:opacity-60"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );

  return (
    <>
      {/* Persistent Desktop & Laptop Sidebar (≥992px) */}
      <aside
        className={`hidden lg:flex flex-col h-screen sticky top-0 border-r border-slate-800 bg-slate-900 z-30 shrink-0 shadow-sm transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-56 xl:w-64'
        }`}
      >
        {renderNavItems(false)}
      </aside>

      {/* Slide-in Navigation Drawer for Tablet (<992px) & Mobile (<768px) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Navigation Drawer">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobile}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Slide-in Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="relative w-80 max-w-[85vw] sm:max-w-[320px] h-full bg-slate-900 border-r border-slate-800 z-10 shadow-2xl overflow-hidden flex flex-col"
            >
              {renderNavItems(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

