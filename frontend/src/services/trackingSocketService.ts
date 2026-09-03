import { LiveTrackingVehicle } from '../types';

type Listener = (data: LiveTrackingVehicle[]) => void;

/**
 * WebSocket / Server-Sent Events architecture wrapper for live GPS telemetry stream.
 * Allows seamless hot-swapping from HTTP Polling to WebSockets without changing React UI components.
 */
class TrackingSocketService {
  private listeners: Set<Listener> = new Set();
  private isConnected: boolean = false;
  private socket: WebSocket | null = null;

  public connect(url?: string): void {
    if (this.isConnected) return;

    if (url && typeof window !== 'undefined' && 'WebSocket' in window) {
      try {
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
          this.isConnected = true;
          console.log('[TrackingSocket] Live GPS Telemetry WebSocket Connected.');
        };
        this.socket.onmessage = (event) => {
          try {
            const data: LiveTrackingVehicle[] = JSON.parse(event.data);
            this.notify(data);
          } catch (err) {
            console.error('[TrackingSocket] Failed to parse telemetry payload', err);
          }
        };
        this.socket.onclose = () => {
          this.isConnected = false;
          console.warn('[TrackingSocket] Telemetry WebSocket connection closed.');
        };
      } catch (err) {
        console.warn('[TrackingSocket] WebSocket initialization fallback to polling', err);
      }
    } else {
      this.isConnected = true;
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public notify(data: LiveTrackingVehicle[]): void {
    this.listeners.forEach((listener) => listener(data));
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
  }

  public getStatus(): boolean {
    return this.isConnected;
  }
}

export const trackingSocketService = new TrackingSocketService();
