import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/headers/PageHeader';
import { Card, CardContent } from '../../components/common/cards/Card';
import { DriverGoogleMap } from '../../components/driver/DriverGoogleMap';
import { useMyUpcomingBookings, useTodayTrip } from '../../hooks/useEmployeePortal';
import { routeService } from '../../services/routeService';
import { routeStopService } from '../../services/routeStopService';
import { RouteDetailItem } from '../../types';
import { DriverTripNavigationState } from '../../services/driverNavigationService';
import { ArrowRight, CalendarDays, Clock3, MapPin, PlusCircle } from 'lucide-react';

export const EmployeeTrackPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: todayTrip, isLoading, isError } = useTodayTrip();
  const { data: upcomingBookings = [] } = useMyUpcomingBookings();
  const [route, setRoute] = useState<RouteDetailItem | null>(null);
  const [routeStops, setRouteStops] = useState<Awaited<ReturnType<typeof routeStopService.getRouteStops>>>([]);
  const [routeError, setRouteError] = useState(false);

  const upcomingReservations = [...upcomingBookings]
    .filter((booking) => {
      const bookingDate = booking.date ? new Date(`${booking.date}T23:59:59`).getTime() : 0;
      const now = Date.now();
      return bookingDate >= now || booking.status === 'PENDING' || booking.status === 'CONFIRMED';
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const liveReservation = todayTrip;
  const selectedBooking = useMemo(() => {
    if (!liveReservation) return upcomingReservations[0] || null;
    return upcomingReservations.find((booking) => booking.routeId === liveReservation.routeId || booking.shuttleId === liveReservation.shuttleId) || {
      id: liveReservation.id,
      bookingRef: liveReservation.code || liveReservation.id,
      routeId: liveReservation.routeId,
      routeName: liveReservation.routeName,
      shuttleId: liveReservation.shuttleId,
      shuttleNumber: liveReservation.shuttleNumber,
      pickupStop: liveReservation.currentStop?.name || liveReservation.nextStop?.name,
      pickupTime: liveReservation.startTime || 'Scheduled',
      status: liveReservation.status || 'SCHEDULED',
      date: new Date().toISOString().slice(0, 10),
    };
  }, [liveReservation, upcomingReservations]);

  useEffect(() => {
    let cancelled = false;
    const routeId = selectedBooking?.routeId || liveReservation?.routeId;
    if (!routeId) {
      setRoute(null);
      setRouteStops([]);
      return;
    }

    setRouteError(false);
    Promise.all([routeService.getRouteById(routeId), routeStopService.getRouteStops(routeId)])
      .then(([routeData, stops]) => {
        if (cancelled) return;
        setRoute(routeData);
        setRouteStops(stops);
      })
      .catch(() => {
        if (!cancelled) setRouteError(true);
      });

    return () => { cancelled = true; };
  }, [liveReservation?.routeId, selectedBooking?.routeId]);

  const navigationTrip = useMemo(() => {
    if (!selectedBooking || !route) return null;
    const live = liveReservation;
    const isNavigationStarted = ['IN_TRANSIT', 'AT_STOP'].includes(String(live?.status || '').toUpperCase());
    const pickupName = selectedBooking.pickupStopName || selectedBooking.pickupStop || '';
    const dropName = selectedBooking.dropStopName || selectedBooking.dropoffStop || '';
    const stops = routeStops.map((stop, index) => ({
      id: stop.id,
      sequence: index + 1,
      name: stop.name,
      address: stop.address,
      scheduledTime: stop.scheduledTime || selectedBooking.pickupTime,
      estimatedArrivalMinutes: stop.estimatedArrivalMinutes,
      lat: stop.lat,
      lng: stop.lng,
      passengersWaiting: stop.name.toLowerCase() === pickupName.toLowerCase() ? 1 : 0,
      passengersBoarded: 0,
      passengersDropped: stop.name.toLowerCase() === dropName.toLowerCase() ? 1 : 0,
      status: stop.name.toLowerCase() === pickupName.toLowerCase() ? 'CURRENT' as const : 'UPCOMING' as const,
    }));
    const pickupIndex = Math.max(0, stops.findIndex((stop) => stop.name.toLowerCase() === pickupName.toLowerCase()));
    const source = {
      id: 'route-source', sequence: 0, name: route.startPoint.name, address: route.startPoint.address,
      scheduledTime: selectedBooking.pickupTime, estimatedArrivalMinutes: 0,
      lat: route.startPoint.lat, lng: route.startPoint.lng, passengersWaiting: 0,
      passengersBoarded: 0, passengersDropped: 0, status: 'COMPLETED' as const,
    };
    const destination = {
      id: 'destination', sequence: stops.length + 1, name: route.destination.name, address: route.destination.address,
      scheduledTime: live?.nextStop?.estimatedArrival || selectedBooking.pickupTime,
      estimatedArrivalMinutes: route.estimatedDurationMinutes, lat: route.destination.lat, lng: route.destination.lng,
      passengersWaiting: 0, passengersBoarded: 0, passengersDropped: 1, status: 'UPCOMING' as const, isOfficeDestination: true,
    };
    const currentLocation = live ? { lat: live.lat || live.currentLocation?.lat || route.startPoint.lat, lng: live.lng || live.currentLocation?.lng || route.startPoint.lng, speedKmH: live.currentSpeedKmh || 0, heading: live.heading || 0 } : { lat: route.startPoint.lat, lng: route.startPoint.lng, speedKmH: 0, heading: 0 };
    return {
      tripId: selectedBooking.scheduleId || selectedBooking.id,
      shuttleId: selectedBooking.shuttleId || live?.shuttleId || '', tripCode: selectedBooking.bookingRef,
      routeName: selectedBooking.routeName, vehicleNumber: selectedBooking.shuttleNumber || live?.shuttleNumber || 'Unassigned',
      driverName: live?.driverName || 'Assigned driver', status: isNavigationStarted ? 'RUNNING' as const : 'SCHEDULED' as const,
      currentLocation, routeSource: route.startPoint, officeDestination: route.destination,
      stops: [source, ...stops, destination], activeStopIndex: pickupIndex + 1,
      passengerStats: { totalBookings: 1, boarded: 0, waiting: 1, remaining: 1 },
      progress: { completedStopsCount: 0, totalStopsCount: stops.length + 2, distanceCoveredKm: 0, remainingDistanceKm: route.totalDistanceKm, estimatedOfficeArrival: destination.scheduledTime, percentage: 0 },
    } satisfies DriverTripNavigationState;
  }, [liveReservation, route, routeStops, selectedBooking]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="My Commute"
        subtitle={liveReservation ? 'Live reservation in progress.' : 'Track your upcoming shuttle reservations.'}
      />

      {isLoading && (
        <Card>
          <CardContent className="p-6 text-sm text-slate-500">Loading your commute details...</CardContent>
        </Card>
      )}

      {isError && (
        <Card>
          <CardContent className="p-6 text-sm text-red-600">Unable to load your commute details right now.</CardContent>
        </Card>
      )}

      {!isLoading && !isError && selectedBooking && navigationTrip && (
        <div className="space-y-6">
          <Card className="border-indigo-200 bg-indigo-50/60 dark:border-indigo-900/60 dark:bg-indigo-950/20">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                    {navigationTrip.status === 'RUNNING' ? 'Live reservation' : 'Scheduled reservation'}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{selectedBooking.routeName}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {selectedBooking.shuttleNumber || 'Shuttle pending assignment'} · Driver: {navigationTrip.driverName}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                  {navigationTrip.status === 'RUNNING' ? 'Navigation active' : 'Navigation scheduled'}
                </span>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/60">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500"><CalendarDays className="h-4 w-4 text-indigo-500" /> Date</div>
                  <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">{selectedBooking.date}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/60">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500"><Clock3 className="h-4 w-4 text-indigo-500" /> Departure</div>
                  <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">{selectedBooking.pickupTime}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/60">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500"><MapPin className="h-4 w-4 text-indigo-500" /> Board at</div>
                  <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">{selectedBooking.pickupStopName || selectedBooking.pickupStop || 'Pickup stop'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {navigationTrip.status !== 'RUNNING' && (
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/20">
              <CardContent className="p-4 text-sm font-medium text-amber-800 dark:text-amber-200">
                Navigation for {selectedBooking.routeName} ({selectedBooking.shuttleNumber || 'assigned shuttle'}, {selectedBooking.pickupTime}) will start soon.
              </CardContent>
            </Card>
          )}

          {routeError ? (
            <Card><CardContent className="p-6 text-sm text-red-600">Unable to load the booked route map right now.</CardContent></Card>
          ) : (
            <DriverGoogleMap trip={navigationTrip} viewerRole="employee" className="h-[520px] w-full" />
          )}
        </div>
      )}

      {!isLoading && !isError && !selectedBooking && (
        <>
          {upcomingReservations.length > 0 ? (
            <div className="space-y-4">
              {upcomingReservations.map((reservation) => (
                <Card key={reservation.id || reservation.bookingRef}>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                          Upcoming reservation
                        </p>
                        <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                          {reservation.routeName}
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
                          <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-indigo-500" /> {reservation.date}</span>
                          <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-indigo-500" /> {reservation.pickupTime}</span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
                        {reservation.status}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-800/80">
                        <span className="block text-xs uppercase tracking-[0.15em] text-slate-500">Pickup</span>
                        <span className="mt-1 block font-semibold text-slate-900 dark:text-white">
                          {reservation.pickupStopName || reservation.pickupStop || 'Pickup stop'}
                        </span>
                      </div>
                      <div className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-800/80">
                        <span className="block text-xs uppercase tracking-[0.15em] text-slate-500">Drop-off</span>
                        <span className="mt-1 block font-semibold text-slate-900 dark:text-white">
                          {reservation.dropStopName || reservation.dropoffStop || 'Drop location'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
              <CardContent className="flex flex-col items-center justify-center gap-4 p-10 text-center">
                <div className="rounded-full bg-indigo-100 p-4 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                  <PlusCircle className="h-8 w-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">No upcoming trips</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Please make a reservation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/employee/booking')}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                >
                  Make a reservation
                  <ArrowRight className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
