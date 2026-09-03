import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportService, AVAILABLE_REPORTS_LIST } from '../services/reportService';
import { ReportType, ReportFilterOptions, ReportDataPayload } from '../types/reports';
import toast from 'react-hot-toast';

export const useReports = () => {
  const statsQuery = useQuery({
    queryKey: ['reports-stats'],
    queryFn: () => reportService.getStats(),
  });

  return {
    availableReports: AVAILABLE_REPORTS_LIST,
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,
  };
};

export const useReportHistory = () => {
  return useQuery({
    queryKey: ['reports-history'],
    queryFn: () => reportService.getHistory(),
  });
};

export const useGenerateReport = () => {
  return useMutation({
    mutationFn: async ({
      type,
      filters,
    }: {
      type: ReportType;
      filters: ReportFilterOptions;
    }): Promise<ReportDataPayload> => {
      // simulate slight generation latency
      await new Promise((resolve) => setTimeout(resolve, 300));
      return reportService.generateReport(type, filters);
    },
    onSuccess: (data) => {
      toast.success(`${data.title} generated successfully!`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to generate report.');
    },
  });
};

export const useDownloadReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      format,
    }: {
      data: ReportDataPayload;
      format: 'PDF' | 'EXCEL' | 'CSV' | 'PRINT';
    }) => {
      if (format === 'CSV') {
        reportService.downloadCSV(data);
      } else if (format === 'EXCEL') {
        reportService.downloadExcel(data);
      } else if (format === 'PRINT' || format === 'PDF') {
        reportService.printReport(data);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reports-history'] });
      queryClient.invalidateQueries({ queryKey: ['reports-stats'] });
      toast.success(`Report downloaded in ${variables.format} format.`);
    },
  });
};
