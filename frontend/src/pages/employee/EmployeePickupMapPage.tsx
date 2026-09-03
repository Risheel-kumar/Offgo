import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import { ArrowLeft, Check, LocateFixed, MapPin, Search } from 'lucide-react';
import { GoogleMap, GoogleMapsProvider, CustomMarkerData } from '../../maps';
import { stopService } from '../../services/stopService';
import { StopDetailItem } from '../../types';

const distanceKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const radians = (value: number) => value * Math.PI / 180;
  const dLat = radians(b.lat - a.lat);
  const dLng = radians(b.lng - a.lng);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
};

const PlacesSearch: React.FC<{ onSelect: (location: { lat: number; lng: number }, label: string) => void }> = ({ onSelect }) => {
  const places = useMapsLibrary('places');
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const autocomplete = new places.Autocomplete(inputRef.current, { fields: ['formatted_address', 'geometry', 'name'] });
    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const location = place.geometry?.location;
      if (location) onSelect({ lat: location.lat(), lng: location.lng() }, place.formatted_address || place.name || 'Selected address');
    });
    return () => listener.remove();
  }, [places, onSelect]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
      <input ref={inputRef} placeholder="Search bus stop or address" className="w-full rounded-xl border border-slate-700 bg-slate-900 px-10 py-2.5 text-sm text-white outline-none focus:border-emerald-500" />
    </div>
  );
};

const FitMap: React.FC<{ points: { lat: number; lng: number }[]; enabled: boolean }> = ({ points, enabled }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !enabled || points.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    points.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, 56);
  }, [map, points, enabled]);
  return null;
};

const CenterOnFirstLocation: React.FC<{ location: { lat: number; lng: number } | null }> = ({ location }) => {
  const map = useMap();
  const hasCentered = React.useRef(false);

  useEffect(() => {
    if (!map || !location || hasCentered.current) return;
    map.panTo(location);
    map.setZoom(15);
    hasCentered.current = true;
  }, [map, location]);

  return null;
};

export const EmployeePickupMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [stops, setStops] = useState<StopDetailItem[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedStop, setSelectedStop] = useState<StopDetailItem | null>(null);
  const [searchLabel, setSearchLabel] = useState('');

  useEffect(() => {
    stopService.getStops().then(setStops).catch(() => setStops([]));
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => undefined,
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const selectNearest = (point: { lat: number; lng: number }, label = '') => {
    setSelectedLocation(point);
    setSearchLabel(label);
    const nearest = [...stops].sort((first, second) => distanceKm(point, first) - distanceKm(point, second))[0];
    if (nearest) setSelectedStop(nearest);
  };

  const markerData: CustomMarkerData[] = useMemo(() => stops.filter((stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lng)).map((stop) => ({
    id: `pickup-${stop.id}`,
    position: { lat: stop.lat, lng: stop.lng },
    title: `Pickup stop: ${stop.name}`,
    subtitle: `${stop.address} | Click to select this pickup stop`,
    iconType: 'stop',
    status: selectedStop?.id === stop.id ? 'active' : 'idle',
    badgeText: selectedStop?.id === stop.id ? 'SELECTED' : 'STOP',
    color: selectedStop?.id === stop.id ? '#22c55e' : '#f59e0b',
    onClick: () => {
      setSelectedLocation({ lat: stop.lat, lng: stop.lng });
      setSelectedStop(stop);
      setSearchLabel(stop.address || stop.name);
    },
  })), [stops, selectedStop]);

  const points = stops.filter((stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lng)).map((stop) => ({ lat: stop.lat, lng: stop.lng }));
  const center = selectedLocation || location || points[0] || { lat: 0, lng: 0 };

  const confirm = () => {
    if (!selectedStop) return;
    const routeId = searchParams.get('routeId') || '';
    const date = searchParams.get('date') || '';
    navigate(`/employee/dashboard?routeId=${encodeURIComponent(routeId)}&pickupStopId=${encodeURIComponent(selectedStop.id)}&pickup=${encodeURIComponent(selectedStop.name)}&pickupAddress=${encodeURIComponent(selectedStop.address || '')}&date=${encodeURIComponent(date)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white">
      <header className="flex items-center gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3">
        <button type="button" onClick={() => navigate(-1)} className="rounded-lg p-2 hover:bg-slate-800" title="Back"><ArrowLeft className="h-5 w-5" /></button>
        <div className="min-w-0 flex-1"><h1 className="text-base font-bold">Choose pickup bus stop</h1><p className="text-xs text-slate-400">Select the nearest stop to your live location before reserving.</p></div>
        {selectedStop && <button type="button" onClick={confirm} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"><Check className="h-4 w-4" /> Use this stop</button>}
      </header>
      <div className="relative flex-1">
        <GoogleMapsProvider defaultTheme="dark">
          <div className="absolute left-4 right-4 top-4 z-10 max-w-md space-y-2">
            <PlacesSearch onSelect={selectNearest} />
            <div className="rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-slate-300">{searchLabel || 'Allow location access or search an address to find the nearest bus stop.'}</div>
          </div>
          <GoogleMap center={center} zoom={13} theme="dark" markers={markerData} polylines={[]} className="h-full w-full" onMapClick={(event) => event.detail.latLng && selectNearest(event.detail.latLng)}>
            <FitMap points={points} enabled={!location && !selectedLocation} />
            <CenterOnFirstLocation location={location} />
          </GoogleMap>
        </GoogleMapsProvider>
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <MapPin className="h-10 w-10 -translate-y-5 fill-emerald-500 text-white drop-shadow-lg" />
        </div>
        {selectedStop && selectedLocation && <div className="absolute bottom-5 left-4 right-4 z-10 mx-auto max-w-lg rounded-2xl border border-emerald-500/40 bg-slate-900/95 p-4 shadow-xl"><div className="flex items-start gap-3"><LocateFixed className="mt-0.5 h-5 w-5 text-emerald-400" /><div><p className="text-sm font-bold">{selectedStop.name}</p><p className="text-xs text-slate-400">{selectedStop.address}</p><p className="mt-1 text-xs font-semibold text-emerald-300">{distanceKm(selectedLocation, selectedStop).toFixed(1)} km from your selected location</p></div><MapPin className="ml-auto h-5 w-5 text-amber-400" /></div></div>}
      </div>
    </div>
  );
};

export default EmployeePickupMapPage;
