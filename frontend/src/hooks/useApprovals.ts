import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalService } from '../services/approvalService';
import { UserApprovalRequest, UserApprovalFilterOptions } from '../types';

export const APPROVALS_QUERY_KEY = 'user-approvals';

export const usePendingApprovals = (filters?: UserApprovalFilterOptions) => {
  const queryClient = useQueryClient();

  const query = useQuery<UserApprovalRequest[], Error>({
    queryKey: [APPROVALS_QUERY_KEY, filters],
    queryFn: () => approvalService.getApprovalRequests(filters),
    staleTime: 1000 * 30,
  });

  return {
    requests: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    invalidateApprovals: () => {
      queryClient.invalidateQueries({ queryKey: [APPROVALS_QUERY_KEY] });
    },
  };
};

export const useApproveUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserApprovalRequest, Error, string>({
    mutationFn: (id: string) => approvalService.approveUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPROVALS_QUERY_KEY] });
    },
  });
};

export const useRejectUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserApprovalRequest, Error, { id: string; reason?: string }>({
    mutationFn: ({ id, reason }) => approvalService.rejectUser(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPROVALS_QUERY_KEY] });
    },
  });
};
