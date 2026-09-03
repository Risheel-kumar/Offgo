import React from 'react';
import { PageHeader } from '../../components/common/headers/PageHeader';
import { TransportExpenseDashboard } from '../../components/expenses/TransportExpenseDashboard';
import { useExpenseReport } from '../../hooks/useExpenses';
import { OrganizationExpenseSummary } from '../../types';

export const AdminExpensesPage: React.FC = () => {
  const { summary, reports, isLoadingSummary, isLoadingReports, error } = useExpenseReport();
  const emptySummary: OrganizationExpenseSummary = {
    currentMonthName: 'All periods',
    totalExpenseINR: 0,
    previousMonthExpenseINR: 0,
    monthlyGrowthPercent: 0,
    budgetAllocatedUSD: 0,
    budgetUtilizationPercent: 0,
    totalTripsCompleted: 0,
    averageCostPerTripINR: 0,
    departmentBreakdown: [],
    monthlyTrend: [],
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Transport Expenses"
        subtitle="Review employee travel charges and inspect expenses by department."
      />
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load transport expenses.</div>}
      <TransportExpenseDashboard
        summary={summary || emptySummary}
        reports={reports}
        isLoading={isLoadingSummary || isLoadingReports}
      />
    </div>
  );
};
