import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { routeService } from '../services/routeService';
import {
  RouteDetailItem,
  RouteFilterOptions,
  CreateRoutePayload,
  UpdateRoutePayload,
} from '../types';

export const ROUTES_QUERY_KEY = 'routes';

/**
 * Custom Hook to fetch filtered routes list
 */
export const useRoutes = (filters?: RouteFilterOptions) => {
  const queryClient = useQueryClient();

  const query = useQuery<RouteDetailItem[], Error>({
    queryKey: [ROUTES_QUERY_KEY, filters],
    queryFn: () => routeService.getRoutes(filters),
    staleTime: 1000 * 30, // 30 seconds
  });

  const allRoutesQuery = useQuery<RouteDetailItem[], Error>({
    queryKey: [ROUTES_QUERY_KEY, 'all'],
    queryFn: () => routeService.getRoutes(),
    staleTime: 1000 * 30,
  });

  return {
    routes: query.data || [],
    allRoutes: allRoutesQuery.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: () => {
      query.refetch();
      allRoutesQuery.refetch();
    },
    invalidateRoutes: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTES_QUERY_KEY] });
    },
  };
};

/**
 * Custom Hook to fetch a single route by ID
 */
export const useRoute = (id: string | null) => {
  return useQuery<RouteDetailItem, Error>({
    queryKey: [ROUTES_QUERY_KEY, id],
    queryFn: () => routeService.getRouteById(id!),
    enabled: !!id,
    staleTime: 1000 * 30,
  });
};

/**
 * Custom Hook to create a new route
 */
export const useCreateRoute = () => {
  const queryClient = useQueryClient();

  return useMutation<RouteDetailItem, Error, CreateRoutePayload>({
    mutationFn: (payload) => routeService.createRoute(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTES_QUERY_KEY] });
    },
  });
};

/**
 * Custom Hook to update an existing route
 */
export const useUpdateRoute = () => {
  const queryClient = useQueryClient();

  return useMutation<RouteDetailItem, Error, UpdateRoutePayload>({
    mutationFn: (payload) => routeService.updateRoute(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTES_QUERY_KEY] });
    },
  });
};

/**
 * Custom Hook to delete a route
 */
export const useDeleteRoute = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (id) => routeService.deleteRoute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTES_QUERY_KEY] });
    },
  });
};
