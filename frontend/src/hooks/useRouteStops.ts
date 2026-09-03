import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { routeStopService } from '../services/routeStopService';
import {
  AssignedRouteStop,
  AssignStopToRoutePayload,
  ReorderRouteStopsPayload,
} from '../types';

export const ROUTE_STOPS_QUERY_KEY = 'routeStops';

/**
 * Custom hook to fetch assigned stops for a specific route ID
 */
export const useRouteStops = (routeId: string | null) => {
  return useQuery<AssignedRouteStop[], Error>({
    queryKey: [ROUTE_STOPS_QUERY_KEY, routeId],
    queryFn: () => routeStopService.getRouteStops(routeId!),
    enabled: !!routeId,
    staleTime: 1000 * 15,
  });
};

/**
 * Custom hook to assign a new stop to a route
 */
export const useAssignStopToRoute = () => {
  const queryClient = useQueryClient();

  return useMutation<AssignedRouteStop, Error, AssignStopToRoutePayload>({
    mutationFn: (payload) => routeStopService.assignStopToRoute(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ROUTE_STOPS_QUERY_KEY, variables.routeId],
      });
    },
  });
};

/**
 * Custom hook to reorder assigned stops
 */
export const useReorderRouteStops = () => {
  const queryClient = useQueryClient();

  return useMutation<AssignedRouteStop[], Error, ReorderRouteStopsPayload>({
    mutationFn: (payload) => routeStopService.reorderRouteStops(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ROUTE_STOPS_QUERY_KEY, variables.routeId],
      });
    },
  });
};

/**
 * Custom hook to remove an assigned stop from a route
 */
export const useRemoveStopFromRoute = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { routeId: string; stopId: string }>({
    mutationFn: ({ routeId, stopId }) =>
      routeStopService.removeStopFromRoute(routeId, stopId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<AssignedRouteStop[]>(
        [ROUTE_STOPS_QUERY_KEY, variables.routeId],
        (current = []) => current.filter((stop) => stop.stopId !== variables.stopId),
      );
      queryClient.invalidateQueries({
        queryKey: [ROUTE_STOPS_QUERY_KEY, variables.routeId],
      });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
};
