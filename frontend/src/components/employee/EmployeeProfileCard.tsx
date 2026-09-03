import React from 'react';
import { EmployeeProfile } from '../../types';
import { User, Mail, Phone, Building2, Shield, MapPin, Edit3, Settings } from 'lucide-react';

interface EmployeeProfileCardProps {
  profile: EmployeeProfile | null;
  onOpenProfileDrawer?: () => void;
}

export const EmployeeProfileCard: React.FC<EmployeeProfileCardProps> = ({
  profile,
  onOpenProfileDrawer,
}) => {
  if (!profile) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-500" />
          My Commute Pass
        </h3>
        {onOpenProfileDrawer && (
          <button
            type="button"
            onClick={onOpenProfileDrawer}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-lg transition-colors"
            title="Edit Profile & Preferences"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3.5">
        <img
          src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
          alt={profile.fullName}
          className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-sm"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {profile.fullName}
            </h4>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {profile.employeeId}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {profile.designation}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{profile.department}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-xs pt-2">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            Email
          </span>
          <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
            {profile.email}
          </span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            Preferred Stop
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
            {profile.preferredPickupStopName || 'Financial District Terminal'}
          </span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            Emergency SOS
          </span>
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
            {profile.emergencyContactPhone || '+1 (555) 882-9901'}
          </span>
        </div>
      </div>

      {onOpenProfileDrawer && (
        <button
          type="button"
          onClick={onOpenProfileDrawer}
          className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit Profile & Preferences
        </button>
      )}
    </div>
  );
};
