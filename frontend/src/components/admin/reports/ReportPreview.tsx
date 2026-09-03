import React from 'react';
import { ShieldCheck, ArrowLeft, Building2, Calendar, User, Sliders } from 'lucide-react';
import { ReportDataPayload } from '../../../types/reports';
import { ReportSummary } from './ReportSummary';
import { ReportCharts } from './ReportCharts';
import { ReportTable } from './ReportTable';
import { DownloadActions } from './DownloadActions';

interface ReportPreviewProps {
  reportData: ReportDataPayload;
  onBack: () => void;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ reportData, onBack }) => {
  const { appliedFilters } = reportData;

  const filterTags = [
    appliedFilters.department !== 'ALL' && `Dept: ${appliedFilters.department}`,
    appliedFilters.vehicleId !== 'ALL' && `Vehicle: ${appliedFilters.vehicleId}`,
    appliedFilters.routeId !== 'ALL' && `Route: ${appliedFilters.routeId}`,
    appliedFilters.tripStatus !== 'ALL' && `Status: ${appliedFilters.tripStatus}`,
    appliedFilters.month !== 'ALL' && `Month: ${appliedFilters.month}`,
    `Year: ${appliedFilters.year}`,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Action Header Bar (hidden when printing) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Available Reports</span>
        </button>

        <DownloadActions reportData={reportData} />
      </div>

      {/* Main Printable Enterprise Report Document Paper Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl print:shadow-none print:border-none print:p-0">
        
        {/* =========================================================
            1. COVER & BRAND HEADER
           ========================================================= */}
        <div className="border-b-2 border-indigo-600 dark:border-indigo-500 pb-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            {/* Logo & Brand Identity */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                OG
              </div>
              <div>
                <div className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  OFF-GO ENTERPRISE
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    Official Audit Report
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Corporate Mobility Management & Fleet Intelligence Platform
                </p>
              </div>
            </div>

            {/* Document Metadata Box */}
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs space-y-1.5 min-w-[240px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Generated:
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{reportData.generatedAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Prepared By:
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{reportData.generatedBy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Security:
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">RESTRICTED / INTERNAL</span>
              </div>
            </div>
          </div>

          {/* Report Main Title */}
          <div className="mt-8">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2">
              {reportData.title}
            </h1>
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              {reportData.subtitle}
            </p>
          </div>

          {/* Applied Filters Tags Bar */}
          {filterTags.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" /> Applied Parameters:
              </span>
              {filterTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* =========================================================
            2. EXECUTIVE SUMMARY & STATS METRICS
           ========================================================= */}
        <ReportSummary
          metrics={reportData.summaryMetrics}
          executiveNotes={reportData.executiveNotes}
        />

        {/* =========================================================
            3. VISUALIZATION CHARTS
           ========================================================= */}
        <ReportCharts
          title={reportData.chartTitle}
          chartType={reportData.chartType}
          data={reportData.chartData}
        />

        {/* =========================================================
            4. DETAILED DATA TABLE
           ========================================================= */}
        <ReportTable
          columns={reportData.tableColumns}
          data={reportData.tableData}
        />

        {/* =========================================================
            5. PROFESSIONAL REPORT FOOTER
           ========================================================= */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>Off-Go Mobility Enterprise Solutions Inc. • Operations Division</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Confidential & Proprietary</span>
            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px]">
              Page 1 of 1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
