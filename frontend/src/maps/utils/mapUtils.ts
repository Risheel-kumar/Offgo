import { MapBounds, MapCenter } from '../types/mapTypes';

/**
 * Calculates Haversine distance between two coordinates in kilometers.
 */
export const calculateDistanceKm = (point1: MapCenter, point2: MapCenter): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const dLng = ((point2.lng - point1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.lat * Math.PI) / 180) *
      Math.cos((point2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
};

/**
 * Computes bounding box for an array of coordinate points.
 */
export const getBoundingBox = (points: MapCenter[]): MapBounds | null => {
  if (!points || points.length === 0) return null;

  let north = -90;
  let south = 90;
  let east = -180;
  let west = 180;

  points.forEach((p) => {
    if (p.lat > north) north = p.lat;
    if (p.lat < south) south = p.lat;
    if (p.lng > east) east = p.lng;
    if (p.lng < west) west = p.lng;
  });

  return { north, south, east, west };
};

/**
 * Computes bearing/heading angle in degrees (0-360) between two points.
 */
export const calculateBearing = (start: MapCenter, end: MapCenter): number => {
  const startLat = (start.lat * Math.PI) / 180;
  const startLng = (start.lng * Math.PI) / 180;
  const endLat = (end.lat * Math.PI) / 180;
  const endLng = (end.lng * Math.PI) / 180;

  const dLng = endLng - startLng;
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
};

/**
 * Format lat/lng into human-readable strings.
 */
export const formatCoordinates = (coord?: MapCenter): string => {
  if (!coord) return 'N/A';
  return `${coord.lat.toFixed(4)}°, ${coord.lng.toFixed(4)}°`;
};
