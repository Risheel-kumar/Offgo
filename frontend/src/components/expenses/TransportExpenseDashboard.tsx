import React, { useState } from 'react';
import { ExpenseSummary } from './ExpenseSummary';
import { ExpenseChart } from './ExpenseChart';
import { ExpenseTable } from './ExpenseTable';
import { EmployeeExpenseDrawer } from './EmployeeExpenseDrawer';
import { TransportExpenseReportItem, OrganizationExpenseSummary } from '../../types';
import { Button } from '../common/buttons/Button';
import { Search, Download, FileSpreadsheet, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

interface TransportExpenseDashboardProps {
  summary: OrganizationExpenseSummary;
  reports: TransportExpenseReportItem[];
  isLoading?: boolean;
}

export const TransportExpenseDashboard: React.FC<TransportExpenseDashboardProps> = ({
  summary,
  reports,
  isLoading,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReport, setActiveReport] = useState<TransportExpenseReportItem | null>(null);

  // Export Handlers
  const handleExportCSV = () => {
    toast.success('Exporting Transport Expenses to CSV...');
  };

  const handleExportExcel = () => {
    toast.success('Generating Transport Expenses Excel workbook...');
  };

  const handlePrint = () => {
    toast.success('Opening print dialog for Transport Expense Report...');
    window.print();
  };

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDepartment === 'ALL' || r.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    const matchesPeriod = !r.recentTrips?.length || r.recentTrips.some((trip) => {
      const [year, month] = trip.date.split('-');
      return (selectedYear === 'ALL' || year === selectedYear) && (selectedMonth === 'ALL' || month === selectedMonth);
    });

    return matchesSearch && matchesDept && matchesStatus && matchesPeriod;
  });

  const departments = Array.from(new Set(reports.map((report) => report.department))).sort();
  const periods = Array.from(new Set(reports.flatMap((report) => (report.recentTrips || []).map((trip) => trip.date.slice(0, 7))))).sort().reverse();
  const years = Array.from(new Set(periods.map((period) => period.slice(0, 4))));
  const months = Array.from(new Set(periods.map((period) => period.slice(5, 7))));
  const topTravellers = [...filteredReports]
    .sort((a, b) => b.totalTrips - a.totalTrips || b.subsidizedCostINR - a.subsidizedCostINR)
    .slice(0, 5)
    .map((report) => ({ name: report.employeeName, dept: report.department, trips: report.totalTrips, costInr: report.subsidizedCostINR }));

  const totalEmployees = summary.totalEmployeesCount || reports.length;
  const totalTrips = summary.totalTripsCompleted || reports.reduce((acc, r) => acc + r.totalTrips, 0);
  const totalMonthlyCost = summary.totalExpenseINR || reports.reduce((acc, r) => acc + r.subsidizedCostINR, 0);
  const avgCostPerEmployee = totalEmployees ? totalMonthlyCost / totalEmployees : 0;

  const highestEmployee = reports.length
    ? reports.reduce((prev, curr) => (curr.totalTrips > prev.totalTrips ? curr : prev), reports[0])
    : { employeeName: 'N/A', department: 'N/A', totalTrips: 0, subsidizedCostINR: 0 };

  const lowestEmployee = reports.length
    ? reports.reduce((prev, curr) => (curr.totalTrips < prev.totalTrips ? curr : prev), reports[0])
    : { employeeName: 'N/A', department: 'N/A', totalTrips: 0, subsidizedCostINR: 0 };

  return (
    <div className="space-y-6">
      {/* Action Header & Exports */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Employee Transport Expense Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Internal organization transportation costs & HR payroll tax deduction audit.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-500" />}
          >
            Excel
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <ExpenseSummary
        totalEmployees={totalEmployees}
        totalTrips={totalTrips}
        totalMonthlyCostInr={totalMonthlyCost}
        avgCostPerEmployeeInr={avgCostPerEmployee}
        highestUsageEmployee={{
          name: highestEmployee.employeeName,
          dept: highestEmployee.department,
          trips: highestEmployee.totalTrips,
          costInr: highestEmployee.subsidizedCostINR,
        }}
        lowestUsageEmployee={{
          name: lowestEmployee.employeeName,
          dept: lowestEmployee.department,
          trips: lowestEmployee.totalTrips,
          costInr: lowestEmployee.subsidizedCostINR,
        }}
      />

      {/* Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter employee name, ID, or dept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none w-full md:w-64"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap text-xs">
          {/* Month */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold text-[11px]">Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none"
            >
              <option value="ALL">All months</option>
              {months.map((month) => <option key={month} value={month}>{month}</option>)}
            </select>
          </div>

          {/* Year */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold text-[11px]">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none"
            >
              <option value="ALL">All years</option>
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>

          {/* Department */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold text-[11px]">Dept:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold text-[11px]">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending Settlement</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visual Recharts Section */}
      <ExpenseChart
        monthlyTrend={summary.monthlyTrend}
        departmentBreakdown={summary.departmentBreakdown}
        topTravellers={topTravellers}
      />

      {/* Expense Data Table */}
      <ExpenseTable
        reports={filteredReports}
        isLoading={isLoading}
        onSelectEmployee={(rep) => setActiveReport(rep)}
      />

      {/* Employee Details Drawer */}
      <EmployeeExpenseDrawer
        isOpen={Boolean(activeReport)}
        onClose={() => setActiveReport(null)}
        report={activeReport}
      />
    </div>
  );
};
