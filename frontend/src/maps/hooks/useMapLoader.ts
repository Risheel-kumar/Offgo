import { useGoogleMapsContext } from '../providers/GoogleMapsProvider';

export const useMapLoader = () => {
  const { isLoaded, loadError, hasValidKey, apiKey } = useGoogleMapsContext();

  return {
    isLoaded,
    loadError,
    hasValidKey,
    apiKey,
  };
};
