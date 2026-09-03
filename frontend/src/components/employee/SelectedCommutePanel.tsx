import React, { useEffect, useMemo, useState } from 'react';
import { Bus, MapPin, Navigation } from 'lucide-react';
import { routeService } from '../../services/routeService';
import { stopService } from '../../services/stopService';
import { trackingService } from '../../services/trackingService';
import { LiveTrackingVehicle, RouteDetailItem, StopDetailItem } from '../../types';

interface SelectedCommutePanelProps {
  routeId: string;
  pickupStopId: string;
}

const distanceKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const radians = (value: number) => value * Math.PI / 180;
  const dLat = radians(b.lat - a.lat);
  const dLng = radians(b.lng - a.lng);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
};

export const SelectedCommutePanel: React.FC<SelectedCommutePanelProps> = ({ routeId, pickupStopId }) => {
  const [route, setRoute] = useState<RouteDetailItem | null>(null);
  const [pickupStop, setPickupStop] = useState<StopDetailItem | null>(null);
  const [shuttles, setShuttles] = useState<LiveTrackingVehicle[]>([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const [routes, stops, fleet] = await Promise.all([
        routeService.getRoutes(),
        stopService.getStops(),
        trackingService.getLiveFleet(),
      ]);
      if (!active) return;
      setRoute(routes.find((item) => item.id === routeId) || null);
      setPickupStop(stops.find((item) => item.id === pickupStopId) || null);
      setShuttles(fleet);
    };
    void load();
    const refresh = window.setInterval(() => trackingService.getLiveFleet().then(setShuttles).catch(() => undefined), 10000);
    return () => {
      active = false;
      window.clearInterval(refresh);
    };
  }, [routeId, pickupStopId]);

  const orderedShuttles = useMemo(() => {
    if (!pickupStop) return shuttles;
    return [...shuttles].sort((first, second) => distanceKm(first.currentLocation, pickupStop) - distanceKm(second.currentLocation, pickupStop));
  }, [pickupStop, shuttles]);

  if (!route) return null;

  return (
    <section className="grid gap-6 rounded-2xl border border-emerald-500/30 bg-slate-950 p-5 text-white lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300"><Navigation className="h-4 w-4" /> Selected commute route</div>
        <h2 className="mt-2 text-xl font-black">{route.code} · {route.name}</h2>
        <p className="mt-1 text-xs text-slate-400">Pickup: {pickupStop?.address || 'Selected bus stop'}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-lg bg-emerald-500/20 px-3 py-2 text-emerald-200">Source: {route.startPoint.name}</span>
          {route.stops.map((stop) => <span key={stop.id} className="rounded-lg bg-indigo-500/20 px-3 py-2 text-indigo-200">{stop.name}</span>)}
          <span className="rounded-lg bg-purple-500/20 px-3 py-2 text-purple-200">Destination: {route.destination.name}</span>
        </div>
      </div>
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-bold"><Bus className="h-4 w-4 text-amber-300" /> Shuttles nearest to pickup</div>
        <div className="space-y-2">
          {orderedShuttles.map((shuttle) => (
            <div key={shuttle.id} className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-3 py-2">
              <div><p className="text-sm font-semibold">{shuttle.vehicleNumber}</p><p className="text-[11px] text-slate-400">{shuttle.routeName} · {shuttle.status}</p></div>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-300"><MapPin className="h-3 w-3" />{pickupStop ? `${distanceKm(shuttle.currentLocation, pickupStop).toFixed(1)} km` : 'Live'}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
