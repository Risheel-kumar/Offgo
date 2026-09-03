import React from 'react';

export interface MapCenter {
  lat: number;
  lng: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export type MapThemeMode = 'light' | 'dark' | 'auto';

export interface CustomMarkerData {
  id: string;
  position: MapCenter;
  title?: string;
  subtitle?: string;
  iconType?: 'shuttle' | 'bus' | 'stop' | 'user' | 'driver' | 'station' | 'terminal';
  status?: 'active' | 'in_transit' | 'idle' | 'delayed' | 'completed' | 'alert';
  badgeText?: string;
  color?: string;
  heading?: number; // direction angle for shuttle movement
  onClick?: () => void;
  data?: Record<string, unknown>;
}

export interface MapPolylineData {
  id: string;
  path: MapCenter[];
  color?: string;
  weight?: number;
  opacity?: number;
  dashed?: boolean;
}

export interface MapControlsConfig {
  showZoom?: boolean;
  showFullscreen?: boolean;
  showMapTypeToggle?: boolean;
  showStreetView?: boolean;
  showThemeToggle?: boolean;
  showRecenter?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface GoogleMapProps {
  center?: MapCenter;
  zoom?: number;
  theme?: MapThemeMode;
  markers?: CustomMarkerData[];
  polylines?: MapPolylineData[];
  selectedMarkerId?: string;
  onMarkerSelect?: (marker: CustomMarkerData | null) => void;
  onMapClick?: (e: { detail: { latLng: MapCenter | null } }) => void;
  onCameraChanged?: (e: { detail: { center: MapCenter } }) => void;
  controls?: MapControlsConfig;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  gestureHandling?: 'cooperative' | 'greedy' | 'none' | 'auto';
  disableDefaultUI?: boolean;
}
