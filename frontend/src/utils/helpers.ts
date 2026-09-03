export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

export function debounce<T extends (...args: any[]) => void>(fn: T, delayMs: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}

export function calculateEtaString(minutes: number): string {
  if (minutes <= 0) return 'Arriving now';
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
}

export function getDashboardRouteByRole(role?: string | null): string {
  if (!role) return '/admin/live-tracking';
  const normalized = role.toUpperCase();
  if (normalized === 'EMPLOYEE') return '/employee/dashboard';
  if (normalized === 'DRIVER') return '/driver/dashboard';
  return '/admin/live-tracking';
}
