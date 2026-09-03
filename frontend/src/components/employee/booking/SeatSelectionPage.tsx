import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Bus,
  CheckCircle,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { VehicleInfoCard } from './VehicleInfoCard';
import { BookingSummaryCard } from './BookingSummaryCard';
import { useAvailableSeats, useSeatSelection, useConfirmBooking } from '../../../hooks/useSeatSelection';
import { useAuth } from '../../../context/AuthContext';
import { RouteDetailItem, ScheduleItem, SeatBookingPayload, LiveTrackingVehicle } from '../../../types';
import { ROUTES } from '../../../constants/routes';
import { routeService } from '../../../services/routeService';
import { trackingService } from '../../../services/trackingService';
import { useSchedules } from '../../../hooks/useSchedules';

const distanceBetweenKm = (first: { lat: number; lng: number }, second: { lat: number; lng: number }) => {
  const radians = (value: number) => value * Math.PI / 180;
  const dLat = radians(second.lat - first.lat);
  const dLng = radians(second.lng - first.lng);
  const value = Math.sin(dLat / 2) ** 2
    + Math.cos(radians(first.lat)) * Math.cos(radians(second.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
};

const getVehicleForRoute = (routeId: string | undefined, fleet: LiveTrackingVehicle[]) => {
  if (!routeId) return null;
  return fleet.find((vehicle) => vehicle.routeId === routeId)
    || fleet.find((vehicle) => vehicle.routeName.toLowerCase().includes(routeId.toLowerCase()))
    || null;
};

const isAllowedBookingDate = (dateString: string): boolean => {
  if (!dateString) return false;
  const selectedDate = new Date(`${dateString}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(selectedDate.getTime()) && selectedDate >= today;
};

export const SeatSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeStep, setActiveStep] = useState<number>(() => (searchParams.has('pickupStopId') ? 2 : 1));
  const { allSchedules } = useSchedules();
  const { user } = useAuth();

  const [routeOptions, setRouteOptions] = useState<RouteDetailItem[]>([]);
  const [liveFleet, setLiveFleet] = useState<LiveTrackingVehicle[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>(() => searchParams.get('routeId') || '');
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(() => searchParams.get('scheduleId') || '');
  const [pickupStopId, setPickupStopId] = useState<string>('');
  const [dropStopId, setDropStopId] = useState<string>('');
  const [routeDisplayName, setRouteDisplayName] = useState<string>('');
  const [destinationDisplayName, setDestinationDisplayName] = useState<string>('');
  const [selectedShift, setSelectedShift] = useState<string>('');
  const [boardingStopName, setBoardingStopName] = useState<string>('');
  const [boardingStopEtaMinutes, setBoardingStopEtaMinutes] = useState<number | null>(null);
  const [shuttleNumberDisplay, setShuttleNumberDisplay] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [bookingPass, setBookingPass] = useState<{
    bookingCode: string;
    passId: string;
    seatNumber: string;
    routeName: string;
    travelDate: string;
    shiftTime: string;
    pickupStop: string;
    dropStop: string;
    vehicleNumber: string;
  } | null>(null);

  const todayDate = new Date().toISOString().split('T')[0];
  const [travelDate, setTravelDate] = useState<string>(() => searchParams.get('date') || todayDate);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const [routes, fleet] = await Promise.all([
          routeService.getRoutes(),
          trackingService.getLiveFleet(),
        ]);

        if (cancelled) return;
        setRouteOptions(routes);
        if (!selectedRouteId && routes.length > 0) {
          setSelectedRouteId(routes[0].id);
        }
        setLiveFleet(fleet);
      } catch {
        if (!cancelled) {
          setRouteOptions([]);
          setLiveFleet([]);
        }
      }
    };

    void loadData();
    const refreshId = window.setInterval(() => {
      void trackingService.getLiveFleet().then((fleet) => {
        if (!cancelled) setLiveFleet(fleet);
      }).catch(() => undefined);
    }, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(refreshId);
    };
  }, [selectedRouteId]);

  const currentRoute = useMemo(
    () => routeOptions.find((route) => route.id === selectedRouteId) || routeOptions[0] || null,
    [routeOptions, selectedRouteId],
  );

  const routeSchedules = useMemo<ScheduleItem[]>(() => {
    if (!currentRoute) return [];
    return [...allSchedules]
      .filter((schedule) => schedule.routeId === currentRoute.id || schedule.routeName === currentRoute.name)
      .filter((schedule) => schedule.status !== 'CANCELLED')
      .sort((first, second) => {
        const firstValue = new Date(`${first.startDate || first.createdDate || todayDate}T${first.departureTime || '00:00'}`).getTime();
        const secondValue = new Date(`${second.startDate || second.createdDate || todayDate}T${second.departureTime || '00:00'}`).getTime();
        return firstValue - secondValue;
      });
  }, [allSchedules, currentRoute, todayDate]);

  const selectedSchedule = useMemo(
    () => routeSchedules.find((schedule) => schedule.id === selectedScheduleId) || routeSchedules[0] || null,
    [routeSchedules, selectedScheduleId],
  );

  const selectedVehicle = useMemo(
    () => getVehicleForRoute(currentRoute?.id, liveFleet) || (currentRoute?.assignedShuttle ? {
      id: currentRoute.assignedShuttle.id,
      vehicleNumber: currentRoute.assignedShuttle.vehicleNumber,
      driverName: currentRoute.driverName || 'Assigned Driver',
      routeId: currentRoute.id,
      routeName: currentRoute.name,
      currentLocation: { lat: 0, lng: 0, address: 'Current route corridor' },
      speedKmH: 30,
      heading: 0,
      status: 'ON_TIME',
      occupancy: 0,
      capacity: 0,
      lastUpdated: 'Now',
    } as LiveTrackingVehicle : null),
    [currentRoute, liveFleet],
  );

  const { selectedSeat, selectSeat, clearSelection } = useSeatSelection();
  const confirmMutation = useConfirmBooking();
  const { data: seatLayout, isLoading: isLayoutLoading } = useAvailableSeats(
    selectedVehicle?.id || currentRoute?.assignedShuttle?.id || 'live-shuttle',
    selectedVehicle?.driverName || currentRoute?.driverName || 'Assigned Driver',
    selectedVehicle?.vehicleNumber || currentRoute?.assignedShuttle?.vehicleNumber || 'OFF-GO',
    currentRoute?.driverName || 'Assigned Driver',
  );

  useEffect(() => {
    const routeId = searchParams.get('routeId');
    const scheduleId = searchParams.get('scheduleId');
    const pickupStopIdFromParams = searchParams.get('pickupStopId');
    const pickupNameFromParams = searchParams.get('pickup');
    const routeNameFromParams = searchParams.get('routeName');
    const destinationFromParams = searchParams.get('destination');
    const shuttleNumberFromParams = searchParams.get('shuttleNumber');
    const dateFromParams = searchParams.get('date');
    const etaMinutesFromParams = Number(searchParams.get('etaMinutes'));

    if (routeId) setSelectedRouteId(routeId);
    if (scheduleId) setSelectedScheduleId(scheduleId);
    if (pickupStopIdFromParams) {
      setPickupStopId(pickupStopIdFromParams);
      setActiveStep(2);
    }
    if (pickupNameFromParams) setBoardingStopName(pickupNameFromParams);
    if (routeNameFromParams) setRouteDisplayName(routeNameFromParams);
    if (destinationFromParams) setDestinationDisplayName(destinationFromParams);
    if (shuttleNumberFromParams) setShuttleNumberDisplay(shuttleNumberFromParams);
    if (dateFromParams) setTravelDate(dateFromParams);
    if (Number.isFinite(etaMinutesFromParams)) setBoardingStopEtaMinutes(etaMinutesFromParams);
  }, [searchParams]);

  useEffect(() => {
    if (!currentRoute) return;

    const fallbackPickup = currentRoute.stops[0];
    const fallbackDrop = currentRoute.stops[currentRoute.stops.length - 1];

    if (!pickupStopId && fallbackPickup) {
      setPickupStopId(fallbackPickup.id);
      setBoardingStopName(fallbackPickup.name);
    }

    if (!dropStopId && fallbackDrop) {
      setDropStopId(fallbackDrop.id);
    }

    if (!routeDisplayName) {
      setRouteDisplayName(currentRoute.name);
    }
    if (!destinationDisplayName && fallbackDrop) {
      setDestinationDisplayName(fallbackDrop.name);
    }
    if (!shuttleNumberDisplay && selectedVehicle) {
      setShuttleNumberDisplay(selectedVehicle.vehicleNumber);
    }
  }, [currentRoute, pickupStopId, dropStopId, routeDisplayName, destinationDisplayName, shuttleNumberDisplay, selectedVehicle]);

  useEffect(() => {
    if (!selectedSchedule) return;
    setSelectedShift(selectedSchedule.departureTime);
    if (!travelDate || travelDate === todayDate) {
      const scheduleDate = selectedSchedule.startDate || selectedSchedule.createdDate || todayDate;
      setTravelDate(scheduleDate);
    }
  }, [selectedSchedule, travelDate, todayDate]);

  useEffect(() => {
    if (!selectedVehicle || !currentRoute || currentRoute.stops.length === 0) {
      setBoardingStopEtaMinutes(null);
      return;
    }

    const pickupStop = currentRoute.stops.find((stop) => stop.id === pickupStopId) || currentRoute.stops[0];
    if (!pickupStop) return;

    const fromLocation = selectedVehicle.currentLocation;
    if (!fromLocation || !Number.isFinite(fromLocation.lat) || !Number.isFinite(fromLocation.lng)) {
      setBoardingStopEtaMinutes(null);
      return;
    }

    const etaMinutes = Math.max(1, Math.round((distanceBetweenKm(fromLocation, { lat: pickupStop.lat, lng: pickupStop.lng }) / (selectedVehicle.speedKmH > 5 ? selectedVehicle.speedKmH : 25)) * 60));
    setBoardingStopEtaMinutes(etaMinutes);
  }, [currentRoute, pickupStopId, selectedVehicle]);

  useEffect(() => {
    if (!currentRoute) return;
    const pickupStop = currentRoute.stops.find((stop) => stop.id === pickupStopId) || currentRoute.stops[0];
    if (pickupStop) setBoardingStopName(pickupStop.name);
  }, [currentRoute, pickupStopId]);

  useEffect(() => {
    if (!isAllowedBookingDate(travelDate)) {
      setTravelDate(todayDate);
      setValidationError('You can only book tickets for today or upcoming days.');
      return;
    }
    setValidationError(null);
  }, [travelDate, todayDate]);

  useEffect(() => {
    if (activeStep !== 2 || selectedSeat || !seatLayout) return;
    const firstAvailableSeat = seatLayout.seats.find((seat) => seat.status === 'AVAILABLE' || seat.status === 'PRIORITY');
    if (firstAvailableSeat) selectSeat(firstAvailableSeat);
  }, [activeStep, seatLayout, selectedSeat, selectSeat]);

  const handleProceedToSeats = () => {
    if (!isAllowedBookingDate(travelDate)) {
      setValidationError('You can only book tickets for today or upcoming days.');
      return;
    }

    clearSelection();
    setValidationError(null);
    setActiveStep(2);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSeat) {
      setValidationError('Please select a seat from the shuttle layout before confirming.');
      return;
    }

    if (!isAllowedBookingDate(travelDate)) {
      setValidationError('You can only book tickets for today or upcoming days.');
      return;
    }

    if (!currentRoute) {
      setValidationError('Route details are not available yet.');
      return;
    }

    try {
      const pickupObj = currentRoute.stops.find((stop) => stop.id === pickupStopId) || currentRoute.stops[0];
      const dropObj = currentRoute.stops.find((stop) => stop.id === dropStopId) || currentRoute.stops[currentRoute.stops.length - 1];
      const payload: SeatBookingPayload = {
        routeId: currentRoute.id,
        routeName: routeDisplayName || currentRoute.name,
        shuttleId: selectedVehicle?.id || currentRoute.assignedShuttle?.id || 'live-shuttle',
        shuttleNumber: shuttleNumberDisplay || selectedVehicle?.vehicleNumber || currentRoute.assignedShuttle?.vehicleNumber || 'OFF-GO',
        travelDate,
        shiftTime: selectedShift || selectedSchedule?.departureTime || 'Departure time',
        pickupStopId: pickupStopId || pickupObj?.id || 'pickup-stop',
        pickupStopName: pickupObj ? pickupObj.name : boardingStopName || 'Selected Stop',
        dropStopId: dropStopId || dropObj?.id || 'drop-stop',
        dropStopName: dropObj ? dropObj.name : destinationDisplayName || 'Destination Stop',
        seatNumber: selectedSeat.seatNumber,
        seatCategory: selectedSeat.category,
        employeeId: user?.id || user?.employeeId || 'emp-curr-01',
        employeeName: user?.name || user?.email || 'Employee',
      };

      const res = await confirmMutation.mutateAsync(payload);
      setBookingPass({
        bookingCode: res.bookingCode,
        passId: res.passId,
        seatNumber: selectedSeat.seatNumber,
        routeName: payload.routeName,
        travelDate: payload.travelDate,
        shiftTime: payload.shiftTime,
        pickupStop: payload.pickupStopName,
        dropStop: payload.dropStopName,
        vehicleNumber: payload.shuttleNumber,
      });
      navigate(ROUTES.EMPLOYEE.PASS);
    } catch (error: any) {
      setValidationError(error.message || 'Seat reservation failed. Please pick another seat.');
    }
  };

  const handleRouteSelect = (routeId: string) => {
    setSelectedRouteId(routeId);
    setSelectedScheduleId('');
    const selectedRoute = routeOptions.find((route) => route.id === routeId);
    if (selectedRoute) {
      const firstStop = selectedRoute.stops[0];
      const lastStop = selectedRoute.stops[selectedRoute.stops.length - 1];
      setPickupStopId(firstStop?.id || '');
      setDropStopId(lastStop?.id || '');
      setBoardingStopName(firstStop?.name || '');
      setRouteDisplayName(selectedRoute.name);
      setDestinationDisplayName(lastStop?.name || selectedRoute.destination?.name || 'Destination');
      if (selectedVehicle) {
        setShuttleNumberDisplay(selectedVehicle.vehicleNumber);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto text-xs">
          {[
            { step: 1, label: '1. Route & Shift' },
            { step: 2, label: '2. Ticket Details' },
            { step: 3, label: '3. Boarding Pass Issued' },
          ].map((item) => {
            const isActive = activeStep === item.step;
            const isCompleted = activeStep > item.step;
            return (
              <div
                key={item.step}
                className={`flex items-center gap-2 font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : isCompleted
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-500'
                }`}
              >
                <span>{item.label}</span>
                {isCompleted && <CheckCircle className="w-3.5 h-3.5" />}
              </div>
            );
          })}
        </div>

        {activeStep === 2 && (
          <button
            onClick={() => setActiveStep(1)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Route</span>
          </button>
        )}
      </div>

      {activeStep === 1 && currentRoute && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Bus className="w-5 h-5 text-indigo-400" /> Select Shuttle Route
                </h3>
                <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                  {routeOptions.length} Active Routes
                </span>
              </div>

              <div className="space-y-3">
                {routeOptions.map((route) => {
                  const isSelected = selectedRouteId === route.id;
                  return (
                    <div
                      key={route.id}
                      onClick={() => handleRouteSelect(route.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border-blue-500 ring-1 ring-blue-500/50 shadow-lg shadow-blue-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                          {route.code}
                        </span>
                        <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Shuttle: {route.assignedShuttle?.vehicleNumber || selectedVehicle?.vehicleNumber || 'OFF-GO'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-100">{route.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <span>From: <strong className="text-slate-300">{route.startPoint?.name || route.startPoint?.address || 'Source'}</strong></span>
                        <span>&bull;</span>
                        <span>To: <strong className="text-slate-300">{route.destination?.name || route.destination?.address || 'Destination'}</strong></span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Clock className="w-5 h-5 text-emerald-400" /> Select Date & Shift Time
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Commute Date
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    min={todayDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500 shadow-inner"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Bookings are allowed only for today or upcoming dates.</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Shift Time (Route Departure)
                  </label>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-emerald-300 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    {selectedShift || selectedSchedule?.departureTime || 'Calculating...'}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Automatically set from the matching backend schedule.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                <MapPin className="w-5 h-5 text-rose-400" /> Select Boarding & Drop Stops
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Pickup Boarding Stop</label>
                  <select
                    value={pickupStopId}
                    onChange={(e) => setPickupStopId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    {currentRoute.stops.map((stop) => (
                      <option key={stop.id} value={stop.id}>{stop.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Drop-off Destination</label>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-emerald-300 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {currentRoute.stops[currentRoute.stops.length - 1]?.name || destinationDisplayName || 'Final Stop'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToSeats}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 mt-4 cursor-pointer transition-all"
              >
                <span>Review Booking Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeStep === 2 && currentRoute && (
        <div className="space-y-6">
          {seatLayout && <VehicleInfoCard layout={seatLayout} />}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {isLayoutLoading ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-400 font-mono">Preparing your ticket...</p>
                </div>
              ) : seatLayout ? (
                <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-12 text-center space-y-3">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-100">Ticket has been confirmed</p>
                  <p className="text-xs text-slate-400">Your reservation is ready and will be locked in when you confirm the booking.</p>
                </div>
              ) : null}
            </div>

            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 space-y-4">
              <BookingSummaryCard
                shuttleName={selectedVehicle?.driverName || 'Assigned shuttle'}
                vehicleNumber={shuttleNumberDisplay || selectedVehicle?.vehicleNumber || 'OFF-GO'}
                routeName={routeDisplayName || currentRoute.name}
                pickupStopName={currentRoute.stops.find((stop) => stop.id === pickupStopId)?.name || boardingStopName || 'Boarding Stop'}
                dropStopName={currentRoute.stops.find((stop) => stop.id === dropStopId)?.name || destinationDisplayName || 'Destination Stop'}
                shiftTime={selectedShift || selectedSchedule?.departureTime || 'Departure time'}
                travelDate={travelDate}
                etaMinutes={boardingStopEtaMinutes}
                selectedSeat={selectedSeat}
                isSubmitting={confirmMutation.isPending}
                onConfirmBooking={handleConfirmBooking}
                validationError={validationError}
              />
            </div>
          </div>
        </div>
      )}

      {activeStep === 3 && bookingPass && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Reservation Confirmed
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-2">
              Seat #{bookingPass.seatNumber} Locked!
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Your live pass is now available in the digital boarding pass section.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                navigate(ROUTES.EMPLOYEE.PASS);
                setActiveStep(1);
                setBookingPass(null);
                clearSelection();
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Open Digital Boarding Pass
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
