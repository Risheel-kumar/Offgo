import { useQuery } from '@tanstack/react-query';
import { fleetService } from '../services/fleetService';
import { LiveTrackingVehicle, FleetSummaryMetrics } from '../types';

export const FLEET_QUERY_KEY = 'fleet-operations';

export const useFleet = () => {
  const vehiclesQuery = useQuery<LiveTrackingVehicle[], Error>({
    queryKey: [FLEET_QUERY_KEY, 'vehicles'],
    queryFn: () => fleetService.getFleetVehicles(),
    refetchInterval: 5000, // Live telematics refresh every 5s
  });

  const metricsQuery = useQuery<FleetSummaryMetrics, Error>({
    queryKey: [FLEET_QUERY_KEY, 'metrics'],
    queryFn: () => fleetService.getFleetMetrics(),
    refetchInterval: 10000,
  });

  return {
    vehicles: vehiclesQuery.data || [],
    metrics: metricsQuery.data,
    isLoadingVehicles: vehiclesQuery.isLoading,
    isLoadingMetrics: metricsQuery.isLoading,
    refetch: () => {
      vehiclesQuery.refetch();
      metricsQuery.refetch();
    },
  };
};

export const useFleetTracking = (vehicleId?: string) => {
  const { vehicles, isLoadingVehicles, refetch } = useFleet();
  const selectedVehicle = vehicles.find((v) => v.id === vehicleId || v.shuttleId === vehicleId);

  return {
    selectedVehicle,
    vehicles,
    isLoading: isLoadingVehicles,
    refetch,
  };
};
