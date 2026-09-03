import React from 'react';
import {
  Users,
  History,
  DollarSign,
  Bus,
  UserCheck,
  BarChart3,
  GitMerge,
  Building2,
  AlertCircle,
  Activity,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { ReportMeta } from '../../../types/reports';

interface ReportCardProps {
  report: ReportMeta;
  onSelect: (report: ReportMeta) => void;
  isSelected?: boolean;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  History,
  DollarSign,
  Bus,
  UserCheck,
  BarChart3,
  GitMerge,
  Building2,
  AlertCircle,
  Activity,
};

export const ReportCard: React.FC<ReportCardProps> = ({ report, onSelect, isSelected }) => {
  const IconComponent = ICON_MAP[report.iconName] || FileText;

  return (
    <div
      onClick={() => onSelect(report)}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 shadow-xs hover:shadow-md'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
            <IconComponent className="w-5 h-5 stroke-[2]" />
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${report.badgeColor}`}>
            {report.badge}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1.5">
          {report.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {report.description}
        </p>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>Est. ~{report.estimatedPages} Pages</span>
        <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
          Generate & Preview
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
