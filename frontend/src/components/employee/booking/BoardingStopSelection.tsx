import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Bell, CalendarClock, CheckCircle2, LocateFixed, MapPin } from 'lucide-react';
import { routeStopService } from '../../../services/routeStopService';
import { routeService } from '../../../services/routeService';
import { AssignedRouteStop, LiveTrackingVehicle, RouteDetailItem, ScheduleItem } from '../../../types';
import { trackingService } from '../../../services/trackingService';
import { useSchedules } from '../../../hooks/useSchedules';

const distanceKm = (first: { lat: number; lng: number }, second: { lat: number; lng: number }) => {
  const radians = (value: number) => value * Math.PI / 180;
  const dLat = radians(second.lat - first.lat);
  const dLng = radians(second.lng - first.lng);
  const value = Math.sin(dLat / 2) ** 2
    + Math.cos(radians(first.lat)) * Math.cos(radians(second.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
};

const hasCoordinate = (point?: { lat?: number; lng?: number } | null) => {
  if (!point) return false;
  const lat = Number(point.lat);
  const lng = Number(point.lng);
  return Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0);
};

const buildMergedRouteStops = (route: RouteDetailItem | null, assignedStops: AssignedRouteStop[]) => {
  const orderedAssignedStops = [...assignedStops].sort((first, second) => first.sequenceOrder - second.sequenceOrder);

  const sourceStop = hasCoordinate(route?.startPoint)
    ? {
        id: 'route-source',
        stopId: 'route-source',
        code: 'SOURCE',
        name: route?.startPoint?.name || 'Source',
        address: route?.startPoint?.address || 'Route source',
        lat: Number(route?.startPoint?.lat ?? 0),
        lng: Number(route?.startPoint?.lng ?? 0),
        landmark: '',
        city: '',
        zone: '',
        sequenceOrder: 0,
        estimatedArrivalMinutes: 0,
        travelTimeFromPrevMinutes: 0,
        distanceFromPrevKm: 0,
        status: 'ACTIVE' as const,
        passengerBoardingCount: 0,
        passengerAlightingCount: 0,
        scheduledTime: '',
      }
    : orderedAssignedStops[0]
      ? {
          ...orderedAssignedStops[0],
          id: 'route-source',
          stopId: 'route-source',
          name: route?.startPoint?.name || orderedAssignedStops[0].name || 'Source',
          address: route?.startPoint?.address || orderedAssignedStops[0].address || 'Route source',
          sequenceOrder: 0,
          estimatedArrivalMinutes: 0,
        }
      : null;

  const destinationStop = hasCoordinate(route?.destination)
    ? {
        id: 'route-destination',
        stopId: 'route-destination',
        code: 'DESTINATION',
        name: route?.destination?.name || 'Destination',
        address: route?.destination?.address || 'Route destination',
        lat: Number(route?.destination?.lat ?? 0),
        lng: Number(route?.destination?.lng ?? 0),
        landmark: '',
        city: '',
        zone: '',
        sequenceOrder: 999999,
        estimatedArrivalMinutes: 0,
        travelTimeFromPrevMinutes: 0,
        distanceFromPrevKm: 0,
        status: 'ACTIVE' as const,
        passengerBoardingCount: 0,
        passengerAlightingCount: 0,
        scheduledTime: '',
      }
    : orderedAssignedStops[orderedAssignedStops.length - 1]
      ? {
          ...orderedAssignedStops[orderedAssignedStops.length - 1],
          id: 'route-destination',
          stopId: 'route-destination',
          name: route?.destination?.name || orderedAssignedStops[orderedAssignedStops.length - 1].name || 'Destination',
          address: route?.destination?.address || orderedAssignedStops[orderedAssignedStops.length - 1].address || 'Route destination',
          sequenceOrder: 999999,
          estimatedArrivalMinutes: 0,
        }
      : null;

  const mergedStops = [sourceStop, ...orderedAssignedStops, destinationStop].filter(Boolean) as AssignedRouteStop[];
  const seen = new Set<string>();

  return mergedStops.filter((stop) => {
    const coordinateKey = `${Number(stop.lat).toFixed(6)}:${Number(stop.lng).toFixed(6)}`;
    if (!Number.isFinite(stop.lat) || !Number.isFinite(stop.lng) || !(stop.lat !== 0 || stop.lng !== 0)) return false;
    if (seen.has(coordinateKey)) return false;
    seen.add(coordinateKey);
    return true;
  });
};

export const BoardingStopSelection: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeId = searchParams.get('routeId') || '';
  const routeCode = searchParams.get('routeCode') || '';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(() => {
    const lat = Number(searchParams.get('lat'));
    const lng = Number(searchParams.get('lng'));
    return Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0 ? { lat, lng } : null;
  });
  const [stops, setStops] = useState<AssignedRouteStop[]>([]);
  const [selectedStopId, setSelectedStopId] = useState('');
  const [selectedScheduleId, setSelectedScheduleId] = useState(searchParams.get('scheduleId') || '');
  const [shuttle, setShuttle] = useState<LiveTrackingVehicle | null>(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const notifiedStopRef = useRef('');
  const { allSchedules } = useSchedules();

  const routeSchedules = useMemo<ScheduleItem[]>(() => {
    if (!routeId) return [];

    return [...allSchedules]
      .filter((schedule) => schedule.routeId === routeId && schedule.status !== 'CANCELLED')
      .sort((first, second) => {
        const firstDate = new Date(`${first.startDate || date}T${first.departureTime || '00:00'}`).getTime();
        const secondDate = new Date(`${second.startDate || date}T${second.departureTime || '00:00'}`).getTime();
        return firstDate - secondDate;
      });
  }, [allSchedules, date, routeId]);

  const selectedSchedule = useMemo(
    () => routeSchedules.find((schedule) => schedule.id === selectedScheduleId) || null,
    [routeSchedules, selectedScheduleId],
  );

  useEffect(() => {
    if (location || !navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => undefined,
      { enableHighAccuracy: true, maximumAge: 20000, timeout: 15000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [location]);

  useEffect(() => {
    if (!routeId) return;

    let active = true;

    const loadStops = async () => {
      try {
        const [assignedStops, routeDetails] = await Promise.all([
          routeStopService.getRouteStops(routeId),
          routeService.getRouteById(routeId).catch(() => null),
        ]);

        if (!active) return;
        setStops(buildMergedRouteStops(routeDetails, assignedStops));
      } catch {
        if (active) setStops([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadStops();
    return () => {
      active = false;
    };
  }, [routeId]);

  useEffect(() => {
    let active = true;
    const loadShuttle = async () => {
      const fleet = await trackingService.getLiveFleet();
      if (!active) return;
      const matching = fleet.find((vehicle) => vehicle.routeId === routeId)
        || fleet.find((vehicle) => routeCode && (vehicle.routeCode === routeCode || vehicle.routeName.toLowerCase().includes(routeCode.toLowerCase())));
      setShuttle(matching || null);
    };
    void loadShuttle();
    const refreshId = window.setInterval(() => void loadShuttle(), 15000);
    return () => {
      active = false;
      window.clearInterval(refreshId);
    };
  }, [routeId]);

  const firstUnpassedIndex = useMemo(() => {
    if (!shuttle || stops.length === 0) return 0;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    stops.forEach((stop, index) => {
      const distance = distanceKm(shuttle.currentLocation, stop);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    return nearestIndex;
  }, [shuttle, stops]);

  const remainingStops = useMemo(() => stops.slice(firstUnpassedIndex), [stops, firstUnpassedIndex]);

  const etaMinutesFor = (stop: AssignedRouteStop) => {
    if (!shuttle) return null;
    const distance = distanceKm(shuttle.currentLocation, stop);
    const speed = shuttle.speedKmH > 5 ? shuttle.speedKmH : 25;
    return Math.max(1, Math.round((distance / speed) * 60));
  };

  useEffect(() => {
    if (!selectedStopId || !shuttle) return;
    const selectedStop = remainingStops.find((stop) => stop.stopId === selectedStopId);
    const eta = selectedStop ? etaMinutesFor(selectedStop) : null;
    if (!selectedStop || eta === null) {
      setSelectedStopId('');
      return;
    }

    if (eta > 10 || notifiedStopRef.current === selectedStop.stopId) {
      return;
    }
    const message = `Your shuttle is expected at ${selectedStop.name} in about ${eta} minutes.`;
    setNotificationMessage(message);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Shuttle arrival reminder', { body: message });
    }
    notifiedStopRef.current = selectedStop.stopId;

    if ('Notification' in window && Notification.permission === 'default') {
      void Notification.requestPermission();
    }
    return undefined;
  }, [selectedStopId, shuttle, remainingStops]);

  useEffect(() => {
    if (!stops.length) return;
    if (!selectedStopId || !stops.some((stop) => stop.stopId === selectedStopId)) {
      setSelectedStopId(stops[0].stopId);
    }
  }, [selectedStopId, stops]);

  const orderedStops = useMemo(() => {
    if (!location) return stops;
    return [...stops].sort((first, second) => distanceKm(location, first) - distanceKm(location, second));
  }, [location, stops]);

  const continueToSeats = () => {
    if (!selectedScheduleId || !selectedStopId) return;
    const selectedStop = stops.find((stop) => stop.stopId === selectedStopId);
    if (!selectedStop) return;

    const eta = shuttle ? etaMinutesFor(selectedStop) : Number(searchParams.get('etaMinutes')) || 10;
    const routeCode = searchParams.get('routeCode') || '';
    const routeName = searchParams.get('routeName') || '';
    const destination = searchParams.get('destination') || '';
    const fallbackShuttleNumber = shuttle?.vehicleNumber || searchParams.get('shuttleNumber') || routeCode || 'OFF-GO';
    const effectiveDate = selectedSchedule?.startDate || date;

    navigate(`/employee/booking?routeId=${encodeURIComponent(routeId)}&routeCode=${encodeURIComponent(routeCode)}&routeName=${encodeURIComponent(routeName)}&destination=${encodeURIComponent(destination)}&scheduleId=${encodeURIComponent(selectedScheduleId)}&pickupStopId=${encodeURIComponent(selectedStop.stopId)}&pickup=${encodeURIComponent(selectedStop.name)}&pickupAddress=${encodeURIComponent(selectedStop.address)}&etaMinutes=${encodeURIComponent(String(eta))}&shuttleNumber=${encodeURIComponent(fallbackShuttleNumber)}&date=${encodeURIComponent(effectiveDate)}&lat=${encodeURIComponent(String(location?.lat ?? ''))}&lng=${encodeURIComponent(String(location?.lng ?? ''))}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate(-1)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" title="Back"><ArrowLeft className="h-5 w-5" /></button>
        <div><h2 className="text-lg font-bold text-slate-900 dark:text-white">Choose an assigned schedule</h2><p className="text-xs text-slate-500">Select the upcoming trip for this bus before choosing your boarding stop.</p></div>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300"><LocateFixed className="h-4 w-4" />{location ? `Live location: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : 'Waiting for live location...'}{shuttle && <span className="ml-auto">Shuttle: {shuttle.vehicleNumber}</span>}</div>
      {notificationMessage && <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300"><Bell className="h-4 w-4" />{notificationMessage}</div>}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <CalendarClock className="h-4 w-4 text-indigo-500" />
          Upcoming assigned schedules
        </div>

        {routeSchedules.length === 0 ? (
          <p className="text-sm text-slate-500">No upcoming schedules are assigned for this route.</p>
        ) : (
          <div className="space-y-3">
            {routeSchedules.map((schedule) => {
              const isSelected = selectedScheduleId === schedule.id;
              const scheduleDate = schedule.startDate || date;

              return (
                <button
                  key={schedule.id}
                  type="button"
                  onClick={() => setSelectedScheduleId(schedule.id)}
                  className={`w-full rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-950/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{scheduleDate}</p>
                      <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{schedule.startLocation} → {schedule.endLocation}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-indigo-500" />}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
                      <span className="block text-[10px] uppercase tracking-[0.15em] text-slate-400">Departure</span>
                      <span className="mt-1 block font-bold">{schedule.departureTime}</span>
                    </div>
                    <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
                      <span className="block text-[10px] uppercase tracking-[0.15em] text-slate-400">Arrival</span>
                      <span className="mt-1 block font-bold">{schedule.arrivalTime}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {!selectedScheduleId && routeSchedules.length > 0 && (
        <p className="text-xs text-amber-600 dark:text-amber-300">Choose an assigned schedule to unlock the boarding-stop list.</p>
      )}

      {selectedScheduleId && (
        <>
          {loading ? <p className="text-sm text-slate-500">Loading route stops...</p> : remainingStops.length === 0 ? <p className="text-sm text-slate-500">No unpassed boarding stops are available for this route.</p> : <div className="space-y-2">{orderedStops.filter((stop) => remainingStops.some((remaining) => remaining.stopId === stop.stopId)).map((stop, index) => { const selected = selectedStopId === stop.stopId; const eta = etaMinutesFor(stop); return <button key={stop.stopId} type="button" onClick={() => setSelectedStopId(stop.stopId)} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${selected ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900'}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${selected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>{index + 1}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">{stop.name}</span><span className="block truncate text-xs text-slate-500">{stop.address}</span></span>{eta !== null && <span className="shrink-0 text-xs font-semibold text-emerald-600 dark:text-emerald-300">ETA {eta} min</span>}{selected && <CheckCircle2 className="h-5 w-5 shrink-0 text-indigo-500" />}</button>; })}</div>}
          <button type="button" disabled={!selectedScheduleId || !selectedStopId} onClick={continueToSeats} className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"><MapPin className="mr-2 inline h-4 w-4" />Continue to booking review</button>
        </>
      )}
    </div>
  );
};
