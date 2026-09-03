import { useQuery } from '@tanstack/react-query';
import { expenseService } from '../services/expenseService';
import {
  OrganizationExpenseSummary,
  TransportExpenseReportItem,
  EmployeePersonalExpenses,
} from '../types';

export const EXPENSES_QUERY_KEY = 'transport-expenses';

export const useExpenseReport = () => {
  const summaryQuery = useQuery<OrganizationExpenseSummary, Error>({
    queryKey: [EXPENSES_QUERY_KEY, 'summary'],
    queryFn: () => expenseService.getOrganizationExpenseSummary(),
    staleTime: 1000 * 60, // 1m
  });

  const reportsQuery = useQuery<TransportExpenseReportItem[], Error>({
    queryKey: [EXPENSES_QUERY_KEY, 'reports'],
    queryFn: () => expenseService.getExpenseReportItems(),
    staleTime: 1000 * 60,
  });

  return {
    summary: summaryQuery.data,
    reports: reportsQuery.data || [],
    isLoadingSummary: summaryQuery.isLoading,
    isLoadingReports: reportsQuery.isLoading,
    error: summaryQuery.error || reportsQuery.error,
    refetch: () => {
      summaryQuery.refetch();
      reportsQuery.refetch();
    },
  };
};

export const useEmployeeExpenses = (employeeId?: string) => {
  return useQuery<EmployeePersonalExpenses, Error>({
    queryKey: [EXPENSES_QUERY_KEY, 'personal', employeeId],
    queryFn: () => expenseService.getEmployeePersonalExpenses(employeeId),
    staleTime: 1000 * 60,
  });
};
