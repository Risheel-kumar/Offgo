import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMap } from '@vis.gl/react-google-maps';
import { Card } from '../common/cards/Card';
import { Button } from '../common/buttons/Button';
import { Calendar, Bus, Search, ArrowRight, Sparkles, CheckCircle2, LocateFixed, Navigation } from 'lucide-react';
import { routeService } from '../../services/routeService';
import { GoogleMap, GoogleMapsProvider, CustomMarkerData } from '../../maps';
import { trackingService } from '../../services/trackingService';
import { seatService } from '../../services/seatService';
import { LiveTrackingVehicle, RouteDetailItem } from '../../types';
import toast from 'react-hot-toast';

type RouteOption = {
  id: string;
  code: string;
  name: string;
  source: string;
  destination: string;
  stops: Array<{ id: string; name: string; lat: number; lng: number; address: string }>;
};

const toDisplayText = (value: unknown, fallback: string): string => {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (value && typeof value === 'object') {
    const item = value as Record<string, unknown>;
    const label = item.name ?? item.stopName ?? item.address ?? item.code;
    if (typeof label === 'string' || typeof label === 'number') return String(label);
  }
  return fallback;
};

const hasValidCoordinates = (location: { lat?: number; lng?: number } | null | undefined) => {
  if (!location) return false;
  const lat = Number(location.lat);
  const lng = Number(location.lng);
  return Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0);
};

const buildRouteStops = (route: RouteDetailItem): RouteOption['stops'] => {
  const explicitStops = (route.stops || []).map((stop, index) => ({
    id: toDisplayText(stop.id, `route-stop-${index + 1}`),
    name: toDisplayText(stop.name, `Stop ${index + 1}`),
    lat: Number(stop.lat),
    lng: Number(stop.lng),
    address: toDisplayText(stop.address, 'Shuttle stop'),
  }));

  const firstBackendStop = explicitStops[0];
  const lastBackendStop = explicitStops[explicitStops.length - 1];

  const sourceStop = hasValidCoordinates(route.startPoint)
    ? {
        id: 'route-source',
        name: toDisplayText(route.startPoint.name, 'Source'),
        lat: Number(route.startPoint.lat),
        lng: Number(route.startPoint.lng),
        address: toDisplayText(route.startPoint.address, 'Route source'),
      }
    : firstBackendStop ? {
        id: 'route-source',
        name: toDisplayText(route.startPoint?.name || firstBackendStop.name, 'Source'),
        lat: Number(firstBackendStop.lat),
        lng: Number(firstBackendStop.lng),
        address: toDisplayText(route.startPoint?.address || firstBackendStop.address, 'Route source'),
      } : null;

  const destinationStop = hasValidCoordinates(route.destination)
    ? {
        id: 'route-destination',
        name: toDisplayText(route.destination.name, 'Destination'),
        lat: Number(route.destination.lat),
        lng: Number(route.destination.lng),
        address: toDisplayText(route.destination.address, 'Route destination'),
      }
    : lastBackendStop ? {
        id: 'route-destination',
        name: toDisplayText(route.destination?.name || lastBackendStop.name, 'Destination'),
        lat: Number(lastBackendStop.lat),
        lng: Number(lastBackendStop.lng),
        address: toDisplayText(route.destination?.address || lastBackendStop.address, 'Route destination'),
      } : null;

  const mergedStops = [sourceStop, ...explicitStops, destinationStop].filter(
    (stop): stop is { id: string; name: string; lat: number; lng: number; address: string } =>
      Boolean(stop) && Number.isFinite(stop.lat) && Number.isFinite(stop.lng) && !(stop.lat === 0 && stop.lng === 0),
  );

  const uniqueStops: RouteOption['stops'] = [];
  const seenKeys = new Set<string>();

  mergedStops.forEach((stop) => {
    const key = `${stop.lat.toFixed(6)}:${stop.lng.toFixed(6)}`;
    if (seenKeys.has(key)) return;
    seenKeys.add(key);
    uniqueStops.push(stop);
  });

  return uniqueStops;
};

const toRouteOption = (route: RouteDetailItem): RouteOption => {
  const routeStops = buildRouteStops(route);

  return {
    id: toDisplayText(route.id, 'route'),
    code: toDisplayText(route.code, 'RT'),
    name: toDisplayText(route.name, 'Shuttle route'),
    source: toDisplayText(route.startPoint?.name ?? route.startPoint?.address, 'Source'),
    destination: toDisplayText(route.destination?.name ?? route.destination?.address, 'Destination'),
    stops: routeStops,
  };
};

const distanceToPathKm = (point: { lat: number; lng: number }, path: { lat: number; lng: number }[]) => {
  if (path.length === 0) return Number.POSITIVE_INFINITY;
  const latitudeScale = 111.32;
  const longitudeScale = 111.32 * Math.cos((point.lat * Math.PI) / 180);
  const toPlane = (location: { lat: number; lng: number }) => ({
    x: (location.lng - point.lng) * longitudeScale,
    y: (location.lat - point.lat) * latitudeScale,
  });
  let minimumDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < path.length - 1; index += 1) {
    const start = toPlane(path[index]);
    const end = toPlane(path[index + 1]);
    const segmentX = end.x - start.x;
    const segmentY = end.y - start.y;
    const segmentLengthSquared = segmentX ** 2 + segmentY ** 2;
    const projection = segmentLengthSquared === 0
      ? 0
      : Math.max(0, Math.min(1, ((-start.x) * segmentX + (-start.y) * segmentY) / segmentLengthSquared));
    minimumDistance = Math.min(minimumDistance, Math.hypot(start.x + projection * segmentX, start.y + projection * segmentY));
  }

  return minimumDistance;
};

const getGoogleRoutePath = (route: RouteOption): Promise<{ lat: number; lng: number }[]> => {
  if (!window.google?.maps || !window.google.maps.DirectionsService || route.stops.length < 2) return Promise.resolve([]);

  return new Promise((resolve) => {
    const [originStop] = route.stops;
    const destinationStop = route.stops[route.stops.length - 1];
    new google.maps.DirectionsService().route({
      origin: { lat: originStop.lat, lng: originStop.lng },
      destination: { lat: destinationStop.lat, lng: destinationStop.lng },
      waypoints: route.stops.slice(1, -1).map((stop) => ({ location: { lat: stop.lat, lng: stop.lng }, stopover: true })),
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      resolve(status === google.maps.DirectionsStatus.OK && result
        ? result.routes[0]?.overview_path.map((point) => ({ lat: point.lat(), lng: point.lng() })) ?? []
        : []);
    });
  });
};

const RouteDirectionsOverlay: React.FC<{ route: RouteOption | undefined }> = ({ route }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google?.maps || !google.maps.DirectionsService || !route || route.stops.length < 2) return;

    const origin = route.stops[0];
    const destinationStop = route.stops[route.stops.length - 1];
    const waypoints = route.stops.slice(1, -1).map((stop) => ({
      location: { lat: stop.lat, lng: stop.lng },
      stopover: true,
    }));

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: false,
      preserveViewport: false,
      polylineOptions: { strokeColor: '#6366f1', strokeOpacity: 0.9, strokeWeight: 5 },
    });

    directionsService.route({
      origin: { lat: origin.lat, lng: origin.lng },
      destination: { lat: destinationStop.lat, lng: destinationStop.lng },
      waypoints,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        directionsRenderer.setDirections(result);
      }
    });

    return () => directionsRenderer.setMap(null);
  }, [map, route]);

  return null;
};

const EmployeeRouteViewport: React.FC<{ points: { lat: number; lng: number }[] }> = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length < 2) return;

    const bounds = new google.maps.LatLngBounds();
    points.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, 48);
  }, [map, points]);

  return null;
};

export const ReserveSeatWidget: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [liveShuttles, setLiveShuttles] = useState<LiveTrackingVehicle[]>([]);
  const [routeDistances, setRouteDistances] = useState<Record<string, number>>({});
  const [routePaths, setRoutePaths] = useState<Record<string, { lat: number; lng: number }[]>>({});
  const [routeAvailability, setRouteAvailability] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [routes, vehicles] = await Promise.all([
          routeService.getRoutes(),
          trackingService.getLiveFleet(),
        ]);

        const mappedRoutes = routes.map((route) => toRouteOption(route));

        setRouteOptions(mappedRoutes);
        setLiveShuttles(vehicles);

        if (!mappedRoutes.length) {
          return;
        }

        const routeFromQuery = searchParams.get('routeId');
        const dateFromQuery = searchParams.get('date');
        if (dateFromQuery) setDate(dateFromQuery);
        setSelectedRouteId(routeFromQuery && mappedRoutes.some((route) => route.id === routeFromQuery)
          ? routeFromQuery
          : '');

      } catch (error) {
        console.error('Error loading options in ReserveSeatWidget:', error);
      }
    };

    loadOptions();

    const trackingRefresh = window.setInterval(() => {
      trackingService.getLiveFleet().then(setLiveShuttles).catch(() => undefined);
    }, 10000);

    return () => window.clearInterval(trackingRefresh);
  }, [searchParams]);

  const selectedRoute = routeOptions.find((route) => route.id === selectedRouteId);
  const routeCandidateStops = selectedRoute?.stops ?? [];

  useEffect(() => {
    if (!userLocation || routeOptions.length === 0) {
      setRouteDistances({});
      return;
    }

    let cancelled = false;
    const calculateDistances = async () => {
      const distances = await Promise.all(routeOptions.map(async (route) => {
        const googlePath = await getGoogleRoutePath(route);
        const path = googlePath.length > 1 ? googlePath : route.stops.map((stop) => ({ lat: stop.lat, lng: stop.lng }));
        if (googlePath.length > 1 && !cancelled) {
          setRoutePaths((current) => ({ ...current, [route.id]: googlePath }));
        }
        return [route.id, distanceToPathKm(userLocation, path)] as const;
      }));
      if (!cancelled) setRouteDistances(Object.fromEntries(distances));
    };

    calculateDistances();
    return () => { cancelled = true; };
  }, [routeOptions, userLocation]);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    let watchId: number | undefined;

    const updateLocation = (position: GeolocationPosition) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      console.warn('Could not access employee location for nearest-stop calculation:', error);
    };

    if (navigator.geolocation.watchPosition) {
      watchId = navigator.geolocation.watchPosition(updateLocation, handleError, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 20000,
      });
    } else {
      navigator.geolocation.getCurrentPosition(updateLocation, handleError, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 20000,
      });
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const refreshAvailability = async () => {
      const availability: Record<string, boolean> = {};

      await Promise.all(routeOptions.map(async (route) => {
        const vehicle = liveShuttles.find((item) => {
          const routeText = `${route.code} ${route.name}`.toLowerCase();
          const vehicleText = `${item.routeCode || ''} ${item.routeName || ''}`.toLowerCase();
          return vehicleText.includes(routeText) || routeText.includes(vehicleText);
        });

        if (!vehicle) {
          availability[route.id] = true;
          return;
        }

        try {
          const layout = await seatService.getSeatLayout(vehicle.id, vehicle.routeName, vehicle.vehicleNumber, vehicle.driverName);
          availability[route.id] = (layout.availableCount ?? 0) > 0;
        } catch {
          availability[route.id] = true;
        }
      }));

      if (!cancelled) {
        setRouteAvailability(availability);
      }
    };

    void refreshAvailability();
    return () => { cancelled = true; };
  }, [routeOptions, liveShuttles]);

  useEffect(() => {
    if (selectedRouteId && routeAvailability[selectedRouteId] === false) {
      setSelectedRouteId('');
    }
  }, [selectedRouteId, routeAvailability]);

  const orderedRouteOptions = useMemo(() => [...routeOptions]
    .filter((route) => routeAvailability[route.id] !== false)
    .sort((first, second) => (
      (routeDistances[first.id] ?? Number.POSITIVE_INFINITY) - (routeDistances[second.id] ?? Number.POSITIVE_INFINITY)
    )), [routeOptions, routeAvailability, routeDistances]);
  
  const routeMapPoints = useMemo(() => {
    if (!selectedRoute) return [];

    const orderedStops = [...routeCandidateStops].sort((a, b) => (a.sequenceOrder ?? 0) - (b.sequenceOrder ?? 0));
    const sourceStop = orderedStops[0] ?? null;
    const destinationStop = orderedStops[orderedStops.length - 1] ?? null;

    const stops = orderedStops.map((stop, index) => {
      const isFirst = index === 0 && Boolean(sourceStop);
      const isLast = index === orderedStops.length - 1 && Boolean(destinationStop);

      return {
        ...stop,
        name: isFirst ? selectedRoute.source || stop.name : isLast ? selectedRoute.destination || stop.name : stop.name,
        mapLabel: isFirst ? 'Source' : isLast ? 'Destination' : `Route ${String.fromCharCode(64 + index)}`,
        isSelectedPickup: false,
      };
    });

    if (stops.length >= 2) {
      return stops;
    }

    const fallbackSource = sourceStop ?? (selectedRoute.stops[0] ? { ...selectedRoute.stops[0], name: selectedRoute.source || selectedRoute.stops[0].name, mapLabel: 'Source' } : null);
    const fallbackDestination = destinationStop ?? (selectedRoute.stops[selectedRoute.stops.length - 1] ? { ...selectedRoute.stops[selectedRoute.stops.length - 1], name: selectedRoute.destination || selectedRoute.stops[selectedRoute.stops.length - 1].name, mapLabel: 'Destination' } : null);

    return [fallbackSource, fallbackDestination].filter(Boolean) as typeof stops;
  }, [selectedRoute, routeCandidateStops]);

  const routeCoordinates = useMemo(
    () => routeMapPoints
      .filter((stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lng))
      .map((stop) => ({ lat: stop.lat, lng: stop.lng })),
    [routeMapPoints]
  );

  const selectedRoutePath = useMemo(() => {
    if (routePaths[selectedRouteId]?.length) return routePaths[selectedRouteId];
    if (routeCoordinates.length >= 2) return routeCoordinates;
    return [];
  }, [routeCoordinates, routePaths, selectedRouteId]);

  const selectedRouteVehicle = selectedRoute
    ? liveShuttles.find((vehicle) => {
        const routeText = `${selectedRoute.code} ${selectedRoute.name}`.toLowerCase();
        const vehicleText = `${vehicle.routeCode || ''} ${vehicle.routeName || ''}`.toLowerCase();
        return vehicleText.includes(routeText) || routeText.includes(vehicleText);
      })
    : liveShuttles[0];

  const mapCenter =
    userLocation
      ? { lat: userLocation.lat, lng: userLocation.lng }
      : routeCoordinates.length > 0
        ? { lat: routeCoordinates[0].lat, lng: routeCoordinates[0].lng }
        : selectedRouteVehicle?.currentLocation
        ? { lat: selectedRouteVehicle.currentLocation.lat, lng: selectedRouteVehicle.currentLocation.lng }
        : { lat: 0, lng: 0 };
  const hasRouteLocation = Boolean(selectedRoute?.source && selectedRoute.destination);

  const routeMarkers: CustomMarkerData[] = routeMapPoints.map((stop, index) => {
    const isPickupMarker = (stop as any).isSelectedPickup;
    const isSource = index === 0;
    const isDestination = index === routeMapPoints.length - 1;

    return {
      id: stop.id,
      position: { lat: stop.lat, lng: stop.lng },
      title: isSource ? selectedRoute?.source || stop.name : isDestination ? selectedRoute?.destination || stop.name : stop.name,
      subtitle: `${stop.address || 'Shuttle stop'} · ${stop.mapLabel || (isSource ? 'Source' : isDestination ? 'Destination' : 'Route stop')}`,
      iconType: 'stop',
      status: isSource ? 'active' : isDestination ? 'completed' : 'idle',
      badgeText: undefined,
      color: isPickupMarker ? '#f59e0b' : (isSource ? '#22c55e' : isDestination ? '#8b5cf6' : '#6366f1'),
    };
  });

  const userMarker: CustomMarkerData | null = userLocation ? {
    id: 'employee-live-location',
    position: { lat: userLocation.lat, lng: userLocation.lng },
    title: 'Your live location',
    subtitle: 'Nearest shuttle stop suggestions are based on this position',
    iconType: 'user',
    status: 'active',
    badgeText: 'You',
    color: '#22c55e',
  } : null;

  const liveVehicleMarker: CustomMarkerData | null = selectedRouteVehicle ? {
    id: selectedRouteVehicle.id,
    position: { lat: selectedRouteVehicle.currentLocation.lat, lng: selectedRouteVehicle.currentLocation.lng },
    title: `${selectedRouteVehicle.vehicleNumber} • ${selectedRouteVehicle.routeName}`,
    subtitle: `Driver: ${selectedRouteVehicle.driverName} | Speed: ${selectedRouteVehicle.speedKmH} km/h | ${selectedRouteVehicle.currentLocation.address}`,
    iconType: 'shuttle',
    status: 'active',
    badgeText: selectedRouteVehicle.vehicleNumber,
    heading: selectedRouteVehicle.heading,
    color: '#10b981',
  } : null;

  const liveMarkers = [...routeMarkers, ...(userMarker ? [userMarker] : []), ...(liveVehicleMarker ? [liveVehicleMarker] : [])];

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    try {
      if (!userLocation) {
        toast.error('Allow location access before choosing a boarding stop.');
        setIsSearching(false);
        return;
      }
      if (!selectedRouteId) {
        toast.error('Select a route before booking a seat.');
        setIsSearching(false);
        return;
      }
      
      setIsSearching(false);
      const routeName = selectedRoute ? `${selectedRoute.code} - ${selectedRoute.name}` : 'Commute Route';
      toast.success(`Choose a boarding stop for ${routeName}.`);
      
      navigate(`/employee/booking?routeId=${encodeURIComponent(selectedRouteId)}&routeCode=${encodeURIComponent(selectedRoute.code)}&routeName=${encodeURIComponent(selectedRoute.name)}&destination=${encodeURIComponent(selectedRoute.destination)}&date=${encodeURIComponent(date)}&lat=${encodeURIComponent(String(userLocation.lat))}&lng=${encodeURIComponent(String(userLocation.lng))}`);
    } catch (error) {
      setIsSearching(false);
      toast.error('Failed to proceed with reservation.');
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 border-indigo-500/30 text-white shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Quick Shuttle Reservation
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Reserve Your Commute Seat
            </h2>
            <p className="text-xs text-slate-300">
              Choose a date and route, then select the nearest boarding stop.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs font-mono text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> 100% Employer Subsidized
          </div>
        </div>

        <form onSubmit={handleReserve} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Select Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <LocateFixed className="w-3.5 h-3.5 text-emerald-400" /> Current Location
              </label>
              <div className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-xs text-white shadow-inner">
                <span className="truncate">{userLocation ? `${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}` : 'Waiting for live location...'}</span>
                <span className="ml-2 shrink-0 text-emerald-300">{userLocation ? 'Live' : 'Required'}</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Routes are ranked by distance from your live location.
              </p>
            </div>

            <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-blue-400" /> Available Routes
              </label>
              <div className="max-h-32 space-y-1 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900/90 p-1.5 shadow-inner">
                {!userLocation ? (
                  <p className="px-3 py-2 text-xs text-slate-400">Waiting for live location to rank routes.</p>
                ) : orderedRouteOptions.map((route) => {
                  const distance = routeDistances[route.id];
                  const isSelected = route.id === selectedRouteId;
                  return (
                    <button
                      key={route.id}
                      type="button"
                      onClick={() => setSelectedRouteId(route.id)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-xs transition-colors ${isSelected ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                      <span className="min-w-0 truncate"><strong>{route.code}</strong> - {route.name}</span>
                      <span className="shrink-0 text-[10px] text-emerald-300">
                        {userLocation && Number.isFinite(distance) ? `${distance.toFixed(1)} km from path` : 'Waiting for location'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.8fr] gap-4">
            <div className="rounded-2xl border border-indigo-500/20 bg-slate-950/60 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-semibold">
                  <Navigation className="h-3.5 w-3.5 text-indigo-400" />
                  {selectedRoute ? `${selectedRoute.code} Route` : 'Live Shuttle Route'}
                </div>
                {userLocation ? (
                  <span className="flex items-center gap-1 text-emerald-300">
                    <LocateFixed className="h-3.5 w-3.5" /> Live location
                  </span>
                ) : (
                  <span className="text-slate-400">Location unavailable</span>
                )}
              </div>

              <div className="h-[260px] w-full">
                  {selectedRoutePath.length > 0 || routeCoordinates.length > 0 || userLocation || hasRouteLocation ? (
                  <GoogleMapsProvider defaultTheme="dark">
                    <GoogleMap
                      center={mapCenter}
                      zoom={12}
                      theme="dark"
                      markers={liveMarkers}
                      polylines={[]}
                      className="h-[260px] w-full"
                    >
                      <EmployeeRouteViewport points={selectedRoutePath.length > 1 ? selectedRoutePath : routeCoordinates} />
                      <RouteDirectionsOverlay route={selectedRoute} />
                    </GoogleMap>
                  </GoogleMapsProvider>
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-900/70 px-4 text-sm text-slate-300">
                    No shuttle route data available yet. Check back once the route schedule is published.
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span>Real-time availability update &bull; Instant Confirmation</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSearching}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/25 px-6 font-bold"
            >
              Reserve Seat Now
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};
