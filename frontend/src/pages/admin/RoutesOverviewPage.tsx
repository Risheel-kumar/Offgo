import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/common/headers/PageHeader';
import { Card, CardContent } from '../../components/common/cards/Card';
import { Button } from '../../components/common/buttons/Button';
import { Input } from '../../components/common/inputs/Input';
import { useShuttle, useUpdateShuttle } from '../../hooks/useShuttles';
import { useCreateRoute, useRoute } from '../../hooks/useRoutes';
import { useDrivers } from '../../hooks/useDrivers';
import { ROUTE_STOPS_QUERY_KEY, useAssignStopToRoute, useRemoveStopFromRoute, useReorderRouteStops, useRouteStops } from '../../hooks/useRouteStops';
import { AssignedRouteStop, CreateRoutePayload, StopDetailItem } from '../../types';
import { stopService } from '../../services/stopService';
import { routeStopService } from '../../services/routeStopService';
import { MapPin, Plus, Trash2, Pencil, ExternalLink, Route as RouteIcon } from 'lucide-react';
import { GoogleMapsProvider } from '../../maps';
import toast from 'react-hot-toast';

interface LocationValue {
  text: string;
  lat: number;
  lng: number;
}

const LocationInput: React.FC<{
  label: string;
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  required?: boolean;
}> = ({ label, value, onChange, required }) => {
  const places = useMapsLibrary('places');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const openInGoogleMaps = () => {
    if (!value.text.trim()) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value.text)}`, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'geometry', 'name'],
    });
    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const location = place.geometry?.location;
      onChangeRef.current({
        text: place.formatted_address || place.name || inputRef.current?.value || '',
        lat: location?.lat() ?? 0,
        lng: location?.lng() ?? 0,
      });
    });
    return () => listener.remove();
  }, [places]);

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={value.text}
          required={required}
          onChange={(event) => onChange({ ...value, text: event.target.value, lat: 0, lng: 0 })}
          placeholder="Type an address or search Google Maps"
          className="min-w-0 flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"
        />
        <button type="button" onClick={openInGoogleMaps} disabled={!value.text.trim()} title="Open in Google Maps" className="rounded-lg border border-slate-200 px-2 text-slate-500 hover:text-indigo-500 disabled:opacity-40 dark:border-slate-800"><ExternalLink className="h-4 w-4" /></button>
      </div>
    </div>
  );
};

export const RoutesOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shuttleId = searchParams.get('shuttleId');
  const { data: shuttle, isLoading: isShuttleLoading } = useShuttle(shuttleId || undefined);
  const routeId = shuttle?.assignedRoute?.id || null;
  const { data: route, isLoading: isRouteLoading } = useRoute(routeId);
  const { data: routeStops = [], isLoading: areStopsLoading } = useRouteStops(routeId);
  const { allDrivers } = useDrivers();
  const createRouteMutation = useCreateRoute();
  const updateShuttleMutation = useUpdateShuttle();
  const assignStopMutation = useAssignStopToRoute();
  const removeStopMutation = useRemoveStopFromRoute();
  const reorderStopMutation = useReorderRouteStops();
  const queryClient = useQueryClient();
  const [stops, setStops] = useState<StopDetailItem[]>([]);
  const [stopQuery, setStopQuery] = useState('');
  const [stopLocation, setStopLocation] = useState<LocationValue>({ text: '', lat: 0, lng: 0 });
  const [isCreatingStop, setIsCreatingStop] = useState(false);
  const [editingStopId, setEditingStopId] = useState<string | null>(null);
  const [editingStop, setEditingStop] = useState<LocationValue>({ text: '', lat: 0, lng: 0 });
  const [routeForm, setRouteForm] = useState({
    code: '', name: '', source: { text: '', lat: 0, lng: 0 } as LocationValue,
    destination: { text: '', lat: 0, lng: 0 } as LocationValue, driverId: '',
  });
  const autoOrderedRouteRef = React.useRef<string | null>(null);

  useEffect(() => {
    stopService.getStops().then(setStops).catch(() => setStops([]));
  }, []);

  const filteredStops = useMemo(() => stops.filter((stop) =>
    `${stop.name} ${stop.address}`.toLowerCase().includes(stopQuery.trim().toLowerCase())
  ).slice(0, 6), [stops, stopQuery]);

  const createRoute = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!shuttle) return;
    const payload = {
      name: routeForm.name,
      description: `Route assigned to ${shuttle.vehicleNumber}`,
      startPoint: { name: routeForm.source.text, address: routeForm.source.text, lat: routeForm.source.lat, lng: routeForm.source.lng },
      destination: { name: routeForm.destination.text, address: routeForm.destination.text, lat: routeForm.destination.lat, lng: routeForm.destination.lng },
      totalDistanceKm: 1,
      estimatedDurationMinutes: 15,
      status: 'ACTIVE' as const,
      code: routeForm.code,
      driverId: routeForm.driverId || undefined,
    } as CreateRoutePayload & { code: string };
    try {
      const createdRoute = await createRouteMutation.mutateAsync(payload);
      await updateShuttleMutation.mutateAsync({
        id: shuttle.id,
        vehicleNumber: shuttle.vehicleNumber,
        vehicleType: shuttle.vehicleType,
        manufacturer: shuttle.manufacturer,
        model: shuttle.model,
        capacity: shuttle.capacity,
        registrationNumber: shuttle.registrationNumber,
        registrationDate: shuttle.registrationDate,
        status: shuttle.status === 'MAINTENANCE'
          ? 'MAINTENANCE'
          : shuttle.status === 'INACTIVE'
            ? 'INACTIVE'
            : 'IN_SERVICE',
        assignedRouteId: createdRoute.id,
      });
      toast.success('Route created and assigned to this vehicle.');
      navigate(`/admin/routes?shuttleId=${encodeURIComponent(shuttle.id)}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Unable to create route.');
    }
  };

  const addStop = async (stop: StopDetailItem) => {
    if (!routeId) return;
    try {
      const currentStops = await queryClient.fetchQuery({
        queryKey: [ROUTE_STOPS_QUERY_KEY, routeId],
        queryFn: () => routeStopService.getRouteStops(routeId),
        staleTime: 0,
      });
      if (currentStops.some((assignedStop) => assignedStop.stopId === stop.id)) {
        setStopQuery('');
        toast.error('This stop is already assigned to this route.');
        return;
      }

      const assignedStop = await assignStopMutation.mutateAsync({ routeId, stopId: stop.id, sequenceOrder: currentStops.length + 1, estimatedArrivalMinutes: currentStops.length * 10 });
      setStopQuery('');
      const nextStops = [...currentStops, assignedStop];
      queryClient.setQueryData([ROUTE_STOPS_QUERY_KEY, routeId], nextStops);
      const uniqueStops = nextStops.filter((candidate, index, all) => all.findIndex((item) => item.stopId === candidate.stopId) === index);
      if (uniqueStops.length === nextStops.length) {
        try {
          await reorderStopsByDistance(uniqueStops, false);
        } catch {
          // The stop is already saved; ordering can be retried from the route controls.
        }
      }
      toast.success('Stop added to this route.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Unable to add stop.');
    }
  };

  const createAndAddStop = async () => {
    if (!routeId || !stopLocation.text.trim() || isCreatingStop) return;
    setIsCreatingStop(true);
    try {
      let coordinates = { lat: stopLocation.lat, lng: stopLocation.lng };
      if ((!coordinates.lat || !coordinates.lng) && window.google?.maps) {
        const result = await new google.maps.Geocoder().geocode({ address: stopLocation.text.trim() });
        const location = result.results[0]?.geometry.location;
        if (location) coordinates = { lat: location.lat(), lng: location.lng() };
      }
      if (!coordinates.lat || !coordinates.lng) {
        toast.error('Choose a Google Maps suggestion or enter a valid location.');
        return;
      }
      const requestedAddress = stopLocation.text.trim().toLowerCase();
      const alreadyOnRoute = routeStops.some((assignedStop) =>
        assignedStop.address.trim().toLowerCase() === requestedAddress
        || (Math.abs(assignedStop.lat - coordinates.lat) < 0.00001 && Math.abs(assignedStop.lng - coordinates.lng) < 0.00001)
      );
      if (alreadyOnRoute) {
        toast.error('This stop is already available in this route.');
        return;
      }
      const matchingStop = stops.find((stop) => {
        const sameAddress = stop.address.trim().toLowerCase() === stopLocation.text.trim().toLowerCase();
        const sameCoordinates = Math.abs(stop.lat - coordinates.lat) < 0.00001 && Math.abs(stop.lng - coordinates.lng) < 0.00001;
        return sameAddress || sameCoordinates;
      });
      if (matchingStop) {
        await addStop(matchingStop);
        setStopLocation({ text: '', lat: 0, lng: 0 });
        return;
      }
      const created = await stopService.createStop({ name: stopLocation.text.trim(), address: stopLocation.text.trim(), ...coordinates, city: 'San Francisco', zone: 'Unassigned', status: 'ACTIVE' });
      setStops((current) => [created, ...current]);
      await addStop(created);
      setStopLocation({ text: '', lat: 0, lng: 0 });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Unable to create route stop.');
    } finally {
      setIsCreatingStop(false);
    }
  };

  const saveStop = async (stop: AssignedRouteStop) => {
    if (!editingStop.text.trim()) return;
    try {
      let coordinates = { lat: editingStop.lat, lng: editingStop.lng };
      if ((!coordinates.lat || !coordinates.lng) && window.google?.maps) {
        const result = await new google.maps.Geocoder().geocode({ address: editingStop.text.trim() });
        const location = result.results[0]?.geometry.location;
        if (location) coordinates = { lat: location.lat(), lng: location.lng() };
      }
      await stopService.updateStop({ id: stop.stopId, name: editingStop.text.trim(), address: editingStop.text.trim(), ...coordinates });
      await queryClient.invalidateQueries({ queryKey: [ROUTE_STOPS_QUERY_KEY, routeId] });
      setEditingStopId(null);
      toast.success('Route stop updated.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Unable to update route stop.');
    }
  };

  const reorderStopsByDistance = async (stopsToOrder = routeStops, showError = true) => {
    if (!routeId || stopsToOrder.length < 2 || !route?.startPoint) return;
    try {
      const source = route.startPoint;
      if (!Number.isFinite(source.lat) || !Number.isFinite(source.lng) || (source.lat === 0 && source.lng === 0)) return;
      const toRadians = (value: number) => value * Math.PI / 180;
      const distanceFromSource = (stop: AssignedRouteStop) => {
        if (!Number.isFinite(stop.lat) || !Number.isFinite(stop.lng) || (stop.lat === 0 && stop.lng === 0)) return Number.POSITIVE_INFINITY;
        const latitudeDelta = toRadians(stop.lat - source.lat);
        const longitudeDelta = toRadians(stop.lng - source.lng);
        const latitudeOne = toRadians(source.lat);
        const latitudeTwo = toRadians(stop.lat);
        const haversine = Math.sin(latitudeDelta / 2) ** 2
          + Math.cos(latitudeOne) * Math.cos(latitudeTwo) * Math.sin(longitudeDelta / 2) ** 2;
        return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
      };
      const ordered = [...stopsToOrder].sort((first, second) => distanceFromSource(first) - distanceFromSource(second));

      const reorderedStops = await reorderStopMutation.mutateAsync({ routeId, stopIdsInOrder: ordered.map((stop) => stop.stopId) });
      queryClient.setQueryData([ROUTE_STOPS_QUERY_KEY, routeId], reorderedStops);
      toast.success('Route stops ordered from source to destination.');
    } catch (error: any) {
      if (showError) {
        toast.error(error?.response?.data?.message || 'Unable to reorder route stops.');
      }
    }
  };

  useEffect(() => {
    if (!routeId || !route?.startPoint || areStopsLoading || routeStops.length < 2 || autoOrderedRouteRef.current === routeId) return;
    autoOrderedRouteRef.current = routeId;
    void reorderStopsByDistance(routeStops, false);
  }, [routeId, route?.startPoint, areStopsLoading, routeStops]);

  const removeStop = async (stopId: string) => {
    if (!routeId || !window.confirm('Remove this stop from the route?')) return;
    try {
      await removeStopMutation.mutateAsync({ routeId, stopId });
      queryClient.setQueryData<AssignedRouteStop[]>(
        [ROUTE_STOPS_QUERY_KEY, routeId],
        (current = []) => current.filter((stop) => stop.stopId !== stopId),
      );
      toast.success('Stop removed from this route.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Unable to remove stop.');
    }
  };

  if (!shuttleId) return <EmptyRouteState message="Select a vehicle from Shuttle Fleet to manage its route." />;
  if (isShuttleLoading) return <p className="text-sm text-slate-500">Loading vehicle route...</p>;
  if (!shuttle) return <EmptyRouteState message="The selected vehicle could not be found." />;

  return (
    <GoogleMapsProvider defaultTheme="light">
      <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader title={`${shuttle.vehicleNumber} Route`} subtitle="Manage the route and stops assigned to this vehicle." />
      {!routeId ? (
        <Card><CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-3"><RouteIcon className="w-5 h-5 text-indigo-500" /><div><h2 className="text-sm font-bold text-slate-900 dark:text-white">Create a route for this vehicle</h2><p className="text-xs text-slate-500">This route will be assigned only to {shuttle.vehicleNumber}.</p></div></div>
          <form onSubmit={createRoute} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Route Code" value={routeForm.code} onChange={(e) => setRouteForm({ ...routeForm, code: e.target.value })} required />
            <Input label="Route Name" value={routeForm.name} onChange={(e) => setRouteForm({ ...routeForm, name: e.target.value })} required />
            <LocationInput label="Source" value={routeForm.source} onChange={(source) => setRouteForm({ ...routeForm, source })} required />
            <LocationInput label="Destination" value={routeForm.destination} onChange={(destination) => setRouteForm({ ...routeForm, destination })} required />
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Assign Driver</label>
              <select
                value={routeForm.driverId}
                onChange={(e) => setRouteForm({ ...routeForm, driverId: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"
              >
                <option value="">Unassigned</option>
                {allDrivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name} ({driver.driverId})</option>)}
              </select>
            </div>
            <div className="sm:col-span-2"><Button type="submit" variant="primary" isLoading={createRouteMutation.isPending || updateShuttleMutation.isPending} leftIcon={<Plus className="w-4 h-4" />}>Create and Assign Route</Button></div>
          </form>
        </CardContent></Card>
      ) : (
        <>
          <Card><CardContent className="p-5 space-y-2">{isRouteLoading ? <p className="text-sm text-slate-500">Loading route...</p> : route ? <><div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-indigo-500" /><h2 className="text-base font-bold text-slate-900 dark:text-white">{route.code} · {route.name}</h2></div><p className="text-xs text-slate-500">{route.startPoint.name} → {route.destination.name}</p></> : <p className="text-sm text-slate-500">The assigned route could not be loaded.</p>}</CardContent></Card>
          <Card><CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between"><div><h2 className="text-sm font-bold text-slate-900 dark:text-white">Stops on this route</h2><p className="text-xs text-slate-500">Stops are persisted and used by the shuttle for this route.</p></div><Button type="button" variant="outline" size="sm" onClick={() => void reorderStopsByDistance()} isLoading={reorderStopMutation.isPending} leftIcon={<RouteIcon className="w-4 h-4" />}>Order by source</Button></div>
            <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-3 sm:grid-cols-[1fr_1fr_auto]">
              <input value={stopQuery} onChange={(event) => setStopQuery(event.target.value)} placeholder="Search existing stop" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900" />
              <LocationInput label="New stop location" value={stopLocation} onChange={setStopLocation} />
              <Button type="button" variant="primary" size="sm" onClick={createAndAddStop} isLoading={isCreatingStop || assignStopMutation.isPending} leftIcon={<Plus className="w-4 h-4" />}>Create stop</Button>
            </div>
            {stopQuery && filteredStops.length > 0 && <div className="rounded-lg border border-slate-200 dark:border-slate-800">{filteredStops.map((stop) => <button key={stop.id} type="button" onClick={() => addStop(stop)} className="flex w-full items-center justify-between border-b border-slate-100 px-3 py-2 text-left text-xs last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"><span>{stop.name}<span className="ml-2 text-slate-400">{stop.address}</span></span><Plus className="h-4 w-4 text-indigo-500" /></button>)}</div>}
            {areStopsLoading ? <p className="text-xs text-slate-500">Loading stops...</p> : !route ? <p className="text-xs text-slate-500">Route details unavailable.</p> : <div className="space-y-0">
              <div className="flex items-center gap-3 border-t border-slate-100 py-3 text-xs dark:border-slate-800"><span className="rounded-md bg-emerald-500/10 px-2 py-1 font-semibold text-emerald-600 dark:text-emerald-300">Source</span><span className="text-slate-700 dark:text-slate-300">{route.startPoint.name}</span></div>
              {routeStops.length === 0 && <p className="border-t border-slate-100 py-3 text-xs text-slate-500 dark:border-slate-800">No intermediate stops assigned yet.</p>}
              {routeStops.map((stop) => <div key={stop.stopId} className="border-t border-slate-100 py-3 text-xs dark:border-slate-800">
              {editingStopId === stop.stopId ? <div className="flex items-end gap-2"><div className="min-w-0 flex-1"><LocationInput label="Edit stop location" value={editingStop} onChange={setEditingStop} /></div><Button type="button" variant="primary" size="sm" onClick={() => saveStop(stop)}>Save</Button><Button type="button" variant="outline" size="sm" onClick={() => setEditingStopId(null)}>Cancel</Button></div> : <div className="flex items-center justify-between"><span className="text-slate-700 dark:text-slate-300">{stop.sequenceOrder}. {stop.name} <span className="text-slate-400">{stop.address}</span></span><span className="flex items-center gap-1"><button type="button" title="Edit stop" onClick={() => { setEditingStopId(stop.stopId); setEditingStop({ text: stop.address || stop.name, lat: stop.lat, lng: stop.lng }); }} className="rounded-md p-1.5 text-indigo-500 hover:bg-indigo-500/10"><Pencil className="w-4 h-4" /></button><button type="button" title="Remove stop" onClick={() => removeStop(stop.stopId)} disabled={removeStopMutation.isPending} className="rounded-md p-1.5 text-rose-500 hover:bg-rose-500/10"><Trash2 className="w-4 h-4" /></button></span></div>}
              </div>)}
              <div className="flex items-center gap-3 border-t border-slate-100 py-3 text-xs dark:border-slate-800"><span className="rounded-md bg-purple-500/10 px-2 py-1 font-semibold text-purple-600 dark:text-purple-300">Destination</span><span className="text-slate-700 dark:text-slate-300">{route.destination.name}</span></div>
            </div>}
          </CardContent></Card>
        </>
      )}
      </div>
    </GoogleMapsProvider>
  );
};

const EmptyRouteState: React.FC<{ message: string }> = ({ message }) => <Card><CardContent className="p-6 text-sm text-slate-500">{message}</CardContent></Card>;
