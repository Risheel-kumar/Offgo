import { useState, useEffect, useCallback } from 'react';
import {
  driverNavigationService,
  DriverTripNavigationState,
  DriverNavigationStop,
} from '../services/driverNavigationService';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useDrivers } from './useDrivers';

/**
 * Hook to manage the driver's current trip state & live telemetry
 */
export function useCurrentTrip() {
  const { user } = useAuth();
  const { allDrivers, isLoading: isDriversLoading } = useDrivers();
  const driver = allDrivers.find((item) => item.email.toLowerCase() === user?.email?.toLowerCase())
    ?? allDrivers.find((item) => item.driverId.toLowerCase() === (user?.employeeId || '').toLowerCase())
    ?? allDrivers.find((item) => item.id === user?.id)
    ?? allDrivers[0];
  const [trip, setTrip] = useState<DriverTripNavigationState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTrip = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await driverNavigationService.getCurrentTrip(driver?.id || user?.id || user?.employeeId);
      setTrip(data);
    } catch {
      const fallback = await driverNavigationService.getCurrentTrip();
      setTrip(fallback);
      toast.error('Using synced route data for this driver session.');
    } finally {
      setIsLoading(false);
    }
  }, [driver?.id, user?.id, user?.employeeId]);

  useEffect(() => {
    refreshTrip();
  }, [refreshTrip]);

  useEffect(() => {
    if (!trip?.shuttleId || trip.status !== 'RUNNING') return;
    const interval = window.setInterval(async () => {
      try {
        const currentLocation = await driverNavigationService.getLatestLocation(trip.shuttleId);
        setTrip((current) => current ? { ...current, currentLocation } : current);
      } catch {
        // Keep the last known location when telemetry is temporarily unavailable.
      }
    }, 5000);
    return () => window.clearInterval(interval);
  }, [trip?.shuttleId, trip?.status]);

  useEffect(() => {
    if (!trip?.shuttleId || trip.status !== 'RUNNING' || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          speedKmH: Math.max(0, (position.coords.speed || 0) * 3.6),
          heading: position.coords.heading || trip.currentLocation.heading || 0,
        };
        setTrip((current) => current ? { ...current, currentLocation } : current);
        void driverNavigationService.publishLocation(trip.shuttleId, currentLocation).catch(() => undefined);
      },
      () => undefined,
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [trip?.shuttleId, trip?.status]);

  return { trip, setTrip, isLoading: isLoading || isDriversLoading, refreshTrip };
}

/**
 * Hook to manage driver navigation route stops, active stop, and office destination
 */
export function useDriverRoute(trip: DriverTripNavigationState | null) {
  const stops: DriverNavigationStop[] = trip?.stops || [];
  const activeStopIndex = trip?.activeStopIndex ?? 0;
  const currentStop = stops[activeStopIndex] || null;
  const nextStop = stops[activeStopIndex + 1] || null;
  const officeDestination = trip?.officeDestination || {
    name: '',
    address: '',
    lat: 0,
    lng: 0,
  };
  const distanceToCurrentStopMeters = trip && currentStop
    ? calculateDistanceMeters(trip.currentLocation.lat, trip.currentLocation.lng, currentStop.lat, currentStop.lng)
    : null;

  return {
    stops,
    activeStopIndex,
    currentStop,
    nextStop,
    officeDestination,
    distanceToCurrentStopMeters,
    isWithinArrivalRadius: distanceToCurrentStopMeters !== null && distanceToCurrentStopMeters <= 100,
  };
}

function calculateDistanceMeters(firstLat: number, firstLng: number, secondLat: number, secondLng: number) {
  const earthRadius = 6371000;
  const latitudeDelta = (secondLat - firstLat) * Math.PI / 180;
  const longitudeDelta = (secondLng - firstLng) * Math.PI / 180;
  const value = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(firstLat * Math.PI / 180) * Math.cos(secondLat * Math.PI / 180) * Math.sin(longitudeDelta / 2) ** 2;
  return 2 * earthRadius * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

/**
 * Hook to handle trip execution controls (Start Shift, Mark Completed, Pause, Resume, End)
 */
export function useNavigation(onStateChange?: (updatedTrip: DriverTripNavigationState) => void, trip?: DriverTripNavigationState | null) {
  const { user } = useAuth();
  const { allDrivers } = useDrivers();
  const driver = allDrivers.find((item) => item.email.toLowerCase() === user?.email?.toLowerCase())
    ?? allDrivers.find((item) => item.driverId.toLowerCase() === (user?.employeeId || '').toLowerCase())
    ?? allDrivers.find((item) => item.id === user?.id)
    ?? allDrivers[0];
  const [isProcessing, setIsProcessing] = useState(false);

  const startShift = useCallback(async () => {
    setIsProcessing(true);
    try {
      const updated = await driverNavigationService.startShift(driver?.id);
      toast.success('Shift started! Navigation route loaded to Office HQ.');
      if (onStateChange) onStateChange(updated);
      return updated;
    } catch {
      toast.error('Failed to start shift.');
    } finally {
      setIsProcessing(false);
    }
  }, [driver?.id, onStateChange]);

  const markStopCompleted = useCallback(
    async (stopId: string) => {
      setIsProcessing(true);
      try {
        if (!trip) throw new Error('No active trip is loaded.');
        const stopIndex = trip.stops.findIndex((stop) => stop.id === stopId);
        if (stopIndex < 0) throw new Error('Stop is not part of the active trip.');
        const updatedStops = trip.stops.map((stop, index) => index === stopIndex ? { ...stop, status: 'COMPLETED' as const } : stop);
        const nextIndex = Math.min(stopIndex + 1, updatedStops.length - 1);
        if (updatedStops[nextIndex] && nextIndex !== stopIndex) updatedStops[nextIndex] = { ...updatedStops[nextIndex], status: 'CURRENT' };
        const completedCount = updatedStops.filter((stop) => stop.status === 'COMPLETED').length;
        const updated: DriverTripNavigationState = {
          ...trip,
          stops: updatedStops,
          activeStopIndex: nextIndex,
          status: nextIndex === stopIndex ? 'COMPLETED' : trip.status,
          progress: { ...trip.progress, completedStopsCount: completedCount, percentage: Math.round(completedCount / updatedStops.length * 100) },
        };
        const completedStop = updated.stops.find((s) => s.id === stopId);
        if (completedStop?.isOfficeDestination) {
          toast.success('Office Destination reached! Trip successfully completed.');
        } else {
          toast.success(`Stop completed: ${completedStop?.name}`);
        }
        if (onStateChange) onStateChange(updated);
        return updated;
      } catch {
        toast.error('Failed to update stop status.');
      } finally {
        setIsProcessing(false);
      }
    },
    [onStateChange, trip]
  );

  const pauseTrip = useCallback(async () => {
    setIsProcessing(true);
    try {
      const updated = await driverNavigationService.pauseTrip();
      toast('Trip navigation paused.', { icon: '⏸️' });
      if (onStateChange) onStateChange(updated);
      return updated;
    } catch {
      toast.error('Failed to pause trip.');
    } finally {
      setIsProcessing(false);
    }
  }, [onStateChange]);

  const resumeTrip = useCallback(async () => {
    setIsProcessing(true);
    try {
      const updated = await driverNavigationService.resumeTrip();
      toast.success('Trip navigation resumed.');
      if (onStateChange) onStateChange(updated);
      return updated;
    } catch {
      toast.error('Failed to resume trip.');
    } finally {
      setIsProcessing(false);
    }
  }, [onStateChange]);

  const endTrip = useCallback(async () => {
    setIsProcessing(true);
    try {
      const updated = await driverNavigationService.endTrip(driver?.id);
      toast.success('Trip ended! Telematics logged to server.');
      if (onStateChange) onStateChange(updated);
      return updated;
    } catch {
      toast.error('Failed to end trip.');
    } finally {
      setIsProcessing(false);
    }
  }, [driver?.id, onStateChange]);

  const resetTrip = useCallback(async () => {
    setIsProcessing(true);
    try {
      const updated = await driverNavigationService.resetTrip();
      toast.success('Shift reset to initial state.');
      if (onStateChange) onStateChange(updated);
      return updated;
    } catch {
      toast.error('Failed to reset trip.');
    } finally {
      setIsProcessing(false);
    }
  }, [onStateChange]);

  return {
    isProcessing,
    startShift,
    markStopCompleted,
    pauseTrip,
    resumeTrip,
    endTrip,
    resetTrip,
  };
}

/**
 * Hook to calculate directions and polyline coordinates between origin, waypoints, and office destination
 */
export function useDirections(trip: DriverTripNavigationState | null) {
  if (!trip) {
    return { origin: null, destination: null, waypoints: [], polylinePath: [] };
  }

  const origin = trip.currentLocation;
  const destination = trip.officeDestination;
  const waypoints = trip.stops.map((s) => ({
    lat: s.lat,
    lng: s.lng,
    name: s.name,
    isCompleted: s.status === 'COMPLETED',
  }));

  const polylinePath = [
    { lat: origin.lat, lng: origin.lng },
    ...trip.stops.map((s) => ({ lat: s.lat, lng: s.lng })),
  ];

  return {
    origin,
    destination,
    waypoints,
    polylinePath,
  };
}
