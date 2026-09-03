import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveTrackingVehicle } from '../../types';
import { ExternalLink, Navigation } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/cards/Card';
import { GoogleMap, GoogleMapsProvider, CustomMarkerData } from '../../maps';

interface LiveMapPreviewProps {
  vehicles: LiveTrackingVehicle[];
  selectedVehicleId?: string;
  onSelectVehicle?: (vehicle: LiveTrackingVehicle) => void;
}

export const LiveMapPreview: React.FC<LiveMapPreviewProps> = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
}) => {
  const navigate = useNavigate();

  // Convert LiveTrackingVehicle items to CustomMarkerData format
  const markers: CustomMarkerData[] = vehicles.map((v) => ({
    id: v.id,
    position: {
      lat: v.currentLocation.lat,
      lng: v.currentLocation.lng,
    },
    title: `${v.vehicleNumber} (${v.routeName})`,
    subtitle: `Driver: ${v.driverName} | Speed: ${v.speedKmH} km/h | ${v.currentLocation.address || 'In Transit'}`,
    iconType: 'shuttle',
    status: String(v.status) === 'ACTIVE' || String(v.status) === 'IN_TRANSIT' || String(v.status) === 'active' || String(v.status) === 'in_transit' ? 'active' : 'idle',
    badgeText: v.vehicleNumber,
    heading: v.heading,
    onClick: () => {
      if (onSelectVehicle) onSelectVehicle(v);
    },
  }));

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const mapCenter = selectedVehicle
    ? { lat: selectedVehicle.currentLocation.lat, lng: selectedVehicle.currentLocation.lng }
    : vehicles.length > 0
    ? { lat: vehicles[0].currentLocation.lat, lng: vehicles[0].currentLocation.lng }
    : { lat: 37.7749, lng: -122.4194 };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Navigation className="w-4 h-4 text-indigo-500" /> Live Google Maps Fleet Operations
          </CardTitle>
          <p className="text-xs text-slate-400">Google Maps Platform live position and vehicle telematics</p>
        </div>
        <button
          onClick={() => navigate('/admin/tracking')}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all cursor-pointer"
        >
          <span>Fleet Operations</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="h-[380px] w-full z-0 relative">
          <GoogleMapsProvider defaultTheme="dark">
            <GoogleMap
              center={mapCenter}
              zoom={12}
              theme="dark"
              markers={markers}
              selectedMarkerId={selectedVehicleId}
              onMarkerSelect={(m) => {
                if (m) {
                  const found = vehicles.find((v) => v.id === m.id);
                  if (found && onSelectVehicle) onSelectVehicle(found);
                }
              }}
              className="h-[380px] w-full"
            />
          </GoogleMapsProvider>
        </div>
      </CardContent>
    </Card>
  );
};
