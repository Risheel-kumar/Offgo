import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Clock,
  Download,
  Search,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  BarChart2,
} from 'lucide-react';
import { useReports, useGenerateReport } from '../../../hooks/useReports';
import { ReportMeta, ReportFilterOptions, ReportDataPayload } from '../../../types/reports';
import { ReportCard } from './ReportCard';
import { ReportFilters } from './ReportFilters';
import { ReportPreview } from './ReportPreview';
import { ReportHistory } from './ReportHistory';

const INITIAL_FILTERS: ReportFilterOptions = {
  dateRange: { start: '2026-07-01', end: '2026-07-31' },
  month: '07',
  year: '2026',
  department: 'ALL',
  employeeId: 'ALL',
  driverId: 'ALL',
  vehicleId: 'ALL',
  routeId: 'ALL',
  tripStatus: 'ALL',
};

export const ReportsDashboard: React.FC = () => {
  const { availableReports, stats } = useReports();
  const generateMutation = useGenerateReport();

  const [selectedReportMeta, setSelectedReportMeta] = useState<ReportMeta | null>(null);
  const [activeReportData, setActiveReportData] = useState<ReportDataPayload | null>(null);
  const [filters, setFilters] = useState<ReportFilterOptions>(INITIAL_FILTERS);
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Reports' },
    { id: 'OPERATIONAL', label: 'Operational' },
    { id: 'FINANCIAL', label: 'Financial' },
    { id: 'HR_TRAVEL', label: 'HR & Travel' },
    { id: 'COMPLIANCE', label: 'Compliance' },
  ];

  const filteredReports = availableReports.filter((report) => {
    const matchesCategory = selectedCategory === 'ALL' || report.category === selectedCategory;
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectReport = (reportMeta: ReportMeta) => {
    setSelectedReportMeta(reportMeta);
    generateMutation.mutate(
      { type: reportMeta.id, filters },
      {
        onSuccess: (data) => {
          setActiveReportData(data);
        },
      }
    );
  };

  const handleApplyFilters = () => {
    if (selectedReportMeta) {
      generateMutation.mutate(
        { type: selectedReportMeta.id, filters },
        {
          onSuccess: (data) => {
            setActiveReportData(data);
          },
        }
      );
    }
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    if (selectedReportMeta) {
      generateMutation.mutate(
        { type: selectedReportMeta.id, filters: INITIAL_FILTERS },
        {
          onSuccess: (data) => {
            setActiveReportData(data);
          },
        }
      );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
              <BarChart2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Reports & Analytics Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate, preview, and export enterprise operational, financial, and commute analytics reports.
          </p>
        </div>

        {selectedReportMeta && activeReportData && (
          <button
            onClick={() => setShowFilterBar((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
            <span>{showFilterBar ? 'Hide Filters' : 'Configure Report Filters'}</span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Available Reports
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {stats?.availableReportsCount || 10} Reports
          </div>
          <p className="text-[11px] text-slate-400 mt-1">10 Enterprise Templates</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Generated Today
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {stats?.generatedTodayCount || 3} Reports
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            +2 since morning shift
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Last Generated
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
            {stats?.lastGeneratedTime || 'Today, 04:15 AM'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Auto-scheduled or manual</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Downloaded Reports
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {stats?.totalDownloadedCount || 49} Exports
          </div>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">PDF, Excel & CSV formats</p>
        </div>
      </div>

      {/* VIEW 1: ACTIVE REPORT PREVIEW VIEW */}
      {activeReportData && selectedReportMeta ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          {/* Filter Bar Drawer */}
          {showFilterBar && (
            <ReportFilters
              filters={filters}
              onChange={setFilters}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
            />
          )}

          <ReportPreview
            reportData={activeReportData}
            onBack={() => {
              setActiveReportData(null);
              setSelectedReportMeta(null);
            }}
          />
        </motion.div>
      ) : (
        /* VIEW 2: AVAILABLE REPORTS CATALOG & CARDS GRID */
        <div className="space-y-6">
          {/* Category Tabs & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search report templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Available Report Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Available Enterprise Reports ({filteredReports.length})
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                Click any report to generate instantly
              </span>
            </div>

            {generateMutation.isPending && (
              <div className="p-8 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl text-center mb-6">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-2" />
                <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  Generating enterprise dataset and analytics visualizations...
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onSelect={handleSelectReport}
                  isSelected={selectedReportMeta?.id === report.id}
                />
              ))}
            </div>
          </div>

          {/* Report History & Audit Trail */}
          <ReportHistory />
        </div>
      )}
    </div>
  );
};
