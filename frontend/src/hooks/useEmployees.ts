import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '../services/employeeService';
import { CreateEmployeePayload, EmployeeFilterOptions } from '../types';
import { useMemo } from 'react';

export const EMPLOYEE_KEYS = {
  all: ['employees'] as const,
  list: (filters?: Record<string, unknown>) => ['employees', 'list', filters] as const,
  details: (id: string) => ['employees', 'details', id] as const,
};

export function useEmployees(filters?: Partial<EmployeeFilterOptions>) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: EMPLOYEE_KEYS.list(filters),
    queryFn: () => employeeService.getEmployees(),
    staleTime: 0,
    refetchInterval: 5000,
  });

  const employees = query.data || [];

  const filteredEmployees = useMemo(() => {
    if (!filters) return employees;

    return employees.filter((emp) => {
      // Search Query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = emp.name.toLowerCase().includes(q);
        const matchesId = emp.employeeId.toLowerCase().includes(q);
        const matchesEmail = emp.email.toLowerCase().includes(q);
        const matchesPhone = emp.phone.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesEmail && !matchesPhone) return false;
      }

      // Status Filter
      if (filters.statusFilter && filters.statusFilter !== 'ALL') {
        if (emp.status !== filters.statusFilter) return false;
      }

      // Department Filter
      if (filters.departmentFilter && filters.departmentFilter !== 'ALL') {
        if (emp.department !== filters.departmentFilter) return false;
      }

      // Assigned Shuttle Filter
      if (filters.shuttleFilter && filters.shuttleFilter !== 'ALL') {
        if (filters.shuttleFilter === 'ASSIGNED') {
          if (!emp.assignedShuttle) return false;
        } else if (filters.shuttleFilter === 'UNASSIGNED') {
          if (emp.assignedShuttle) return false;
        } else {
          if (emp.assignedShuttle?.shuttleId !== filters.shuttleFilter) return false;
        }
      }

      // Booking Status Filter
      if (filters.bookingStatusFilter && filters.bookingStatusFilter !== 'ALL') {
        if (!emp.currentBooking || emp.currentBooking.status !== filters.bookingStatusFilter) {
          return false;
        }
      }

      return true;
    });
  }, [employees, filters]);

  return {
    employees: filteredEmployees,
    allEmployees: employees,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: query.refetch,
    invalidateEmployees: () => queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.all }),
  };
}

export function useEmployee(id?: string) {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.details(id || ''),
    queryFn: () => employeeService.getEmployeeById(id!),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => employeeService.createEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.all });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeService.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.all });
    },
  });
}
