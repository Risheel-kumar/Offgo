import React, { useState, useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { GoogleMap, GoogleMapsProvider, CustomMarkerData } from '../../maps';
import { Button } from '../common/buttons/Button';
import {
  MapPin,
  Building2,
  Navigation,
  Layers,
  Compass,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { DriverTripNavigationState } from '../../services/driverNavigationService';

interface DriverGoogleMapProps {
  trip: DriverTripNavigationState | null;
  onSelectStop?: (stopId: string) => void;
  viewerRole?: 'driver' | 'employee';
  className?: string;
}

// Traffic Layer sub-component using native Google Maps JS API
const TrafficLayerOverlay: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const map = useMap();
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);

  useEffect(() => {
    if (!map) return;

    if (enabled) {
      if (!trafficLayerRef.current) {
        trafficLayerRef.current = new google.maps.TrafficLayer();
      }
      trafficLayerRef.current.setMap(map);
    } else if (trafficLayerRef.current) {
      trafficLayerRef.current.setMap(null);
    }

    return () => {
      if (trafficLayerRef.current) {
        trafficLayerRef.current.setMap(null);
      }
    };
  }, [map, enabled]);

  return null;
};

const DirectionsRouteOverlay: React.FC<{ trip: DriverTripNavigationState }> = ({ trip }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google?.maps) return;

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: false,
      preserveViewport: false,
      polylineOptions: { strokeColor: '#6366f1', strokeOpacity: 0.9, strokeWeight: 5 },
    });
    const remainingStops = trip.stops.slice(trip.activeStopIndex);
    const validStops = remainingStops.filter((stop) => {
      if (stop.isOfficeDestination) return false;
      return Boolean(stop.address) || (Number.isFinite(stop.lat) && Number.isFinite(stop.lng) && (stop.lat !== 0 || stop.lng !== 0));
    });

    directionsService.route({
      origin: { lat: trip.currentLocation.lat, lng: trip.currentLocation.lng },
      destination: trip.officeDestination.address || trip.officeDestination.name,
      waypoints: validStops.map((stop) => ({
        location: stop.address || { lat: stop.lat, lng: stop.lng },
        stopover: true,
      })),
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) directionsRenderer.setDirections(result);
    });

    return () => directionsRenderer.setMap(null);
  }, [map, trip]);

  return null;
};

export const DriverGoogleMap: React.FC<DriverGoogleMapProps> = ({
  trip,
  onSelectStop,
  viewerRole = 'driver',
  className = 'h-[460px] w-full',
}) => {
  const [trafficEnabled, setTrafficEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapTheme, setMapTheme] = useState<'dark' | 'light'>('dark');
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | undefined>(undefined);

  if (!trip) {
    return (
      <div className={`flex items-center justify-center bg-slate-900 text-slate-400 rounded-3xl border border-slate-800 ${className}`}>
        <span>Loading map telematics...</span>
      </div>
    );
  }

  // 1. Prepare Vehicle Marker
  const vehicleMarker: CustomMarkerData = {
    id: 'vehicle-driver-location',
    position: { lat: trip.currentLocation.lat, lng: trip.currentLocation.lng },
    title: `Shuttle ${trip.vehicleNumber}`,
    subtitle: `Driver: ${trip.driverName} | Speed: ${trip.currentLocation.speedKmH} km/h`,
    iconType: 'shuttle',
    status: trip.status === 'RUNNING' ? 'active' : 'idle',
    badgeText: viewerRole === 'driver' ? 'YOU (DRIVER)' : 'BOOKED SHUTTLE',
  };

  // 2. Prepare Stop Markers
  const stopMarkers: CustomMarkerData[] = trip.stops.map((stop) => {
    const isOffice = Boolean(stop.isOfficeDestination);
    const isCompleted = stop.status === 'COMPLETED';
    const isCurrent = stop.status === 'CURRENT';

    return {
      id: stop.id,
      position: { lat: stop.lat, lng: stop.lng },
      title: isOffice ? `OFFICE HQ: ${stop.name}` : `Stop ${stop.sequence}: ${stop.name}`,
      subtitle: isOffice
        ? `${stop.address} | Dropoff Destination`
        : `${stop.passengersWaiting} waiting | ETA ${stop.scheduledTime}`,
      iconType: 'stop',
      status: isCompleted ? 'completed' : isCurrent ? 'active' : 'idle',
      badgeText: isOffice ? 'OFFICE HQ' : `STOP ${stop.sequence}`,
      color: isOffice ? '#8b5cf6' : isCompleted ? '#10b981' : isCurrent ? '#3b82f6' : '#f59e0b',
    };
  });

  const isValidCoordinate = (position: { lat: number; lng: number }) =>
    Number.isFinite(position.lat) && Number.isFinite(position.lng) && (position.lat !== 0 || position.lng !== 0);
  const allMarkers = [vehicleMarker, ...stopMarkers].filter((marker) => isValidCoordinate(marker.position));
  const firstStop = trip.stops.find(isValidCoordinate);

  const handleMarkerSelect = (marker: CustomMarkerData) => {
    setSelectedMarkerId(marker.id);
    if (onSelectStop) {
      onSelectStop(marker.id);
    }
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-950 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : className}`}>
      <GoogleMapsProvider defaultTheme={mapTheme}>
        <GoogleMap
          center={firstStop ? { lat: firstStop.lat, lng: firstStop.lng } : { lat: trip.currentLocation.lat, lng: trip.currentLocation.lng }}
          zoom={12}
          theme={mapTheme}
          markers={allMarkers}
          polylines={[]}
          selectedMarkerId={selectedMarkerId}
          onMarkerSelect={handleMarkerSelect}
          className="h-full w-full"
        >
          <DirectionsRouteOverlay trip={trip} />
          <TrafficLayerOverlay enabled={trafficEnabled} />
        </GoogleMap>
      </GoogleMapsProvider>

      {/* Floating Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white shadow-xl space-y-1 max-w-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {trip.status === 'RUNNING' ? 'Live Route Telematics' : 'Last Known Route Location'}
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Current stop: <strong className="text-emerald-300">{trip.stops[trip.activeStopIndex]?.name || 'No active stop'}</strong>
            <span className="block mt-0.5">Route leads to <strong className="text-purple-300">{trip.officeDestination.name}</strong> via {Math.max(0, trip.stops.length - 2)} pickup waypoints.</span>
          </p>
        </div>
      </div>

      {/* Map Action Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setTrafficEnabled(!trafficEnabled)}
          className={`p-2.5 rounded-xl border font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 ${
            trafficEnabled
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800'
          }`}
          title="Toggle Traffic Layer"
        >
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline">{trafficEnabled ? 'Traffic On' : 'Traffic Off'}</span>
        </button>

        <button
          type="button"
          onClick={() => setMapTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          className="p-2.5 rounded-xl bg-slate-900/90 text-slate-300 border border-slate-700 font-bold text-xs shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center"
          title="Switch Map Theme"
        >
          <Compass className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2.5 rounded-xl bg-slate-900/90 text-slate-300 border border-slate-700 font-bold text-xs shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center"
          title="Toggle Fullscreen Map"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Destination Pin Overlay Banner at bottom of map */}
      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
        <div className="p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-purple-500/40 text-white shadow-2xl flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600 text-white font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-purple-300 font-mono uppercase tracking-wider block">
                FINAL DESTINATION
              </span>
              <h4 className="text-xs font-bold text-white">{trip.officeDestination.name}</h4>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">EST. ARRIVAL</span>
            <span className="text-xs font-bold text-emerald-400">{trip.progress.estimatedOfficeArrival}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
