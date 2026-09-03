import { useMap } from '@vis.gl/react-google-maps';
import { useGoogleMapsContext } from '../providers/GoogleMapsProvider';
import { MapCenter } from '../types/mapTypes';

export const useGoogleMap = () => {
  const map = useMap();
  const context = useGoogleMapsContext();

  const panTo = (center: MapCenter) => {
    if (map) {
      map.panTo(center);
    }
  };

  const setZoom = (zoomLevel: number) => {
    if (map) {
      map.setZoom(zoomLevel);
    }
  };

  const fitBounds = (bounds: google.maps.LatLngBoundsLiteral) => {
    if (map) {
      map.fitBounds(bounds);
    }
  };

  return {
    map,
    panTo,
    setZoom,
    fitBounds,
    themeMode: context.themeMode,
    setThemeMode: context.setThemeMode,
    hasValidKey: context.hasValidKey,
  };
};
