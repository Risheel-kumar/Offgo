import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, User, Calendar, MapPin, Bus, Navigation, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { CreateBookingPayload } from '../../types';
import { useEmployees } from '../../hooks/useEmployees';
import { useRoutes } from '../../hooks/useRoutes';
import { useSchedules } from '../../hooks/useSchedules';
import { useQuery } from '@tanstack/react-query';
import { routeStopService } from '../../services/routeStopService';

interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateBookingPayload) => Promise<void>;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({ isOpen, onClose, onSubmit }) => {
  const { allEmployees, isLoading: employeesLoading } = useEmployees();
  const { allRoutes, isLoading: routesLoading } = useRoutes();
  const { allSchedules, isLoading: schedulesLoading } = useSchedules();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [travelDate, setTravelDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [pickupStopId, setPickupStopId] = useState<string>('');
  const [dropStopId, setDropStopId] = useState<string>('');
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
  const [seatNumber, setSeatNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const availableSchedules = allSchedules.filter((schedule) => schedule.status !== 'CANCELLED');
  const selectedSchedule = availableSchedules.find((schedule) => schedule.id === selectedScheduleId);
  const selectedRouteId = selectedSchedule?.routeId || '';
  const { data: routeStops = [], isLoading: stopsLoading } = useQuery({
    queryKey: ['booking-route-stops', selectedRouteId],
    queryFn: () => routeStopService.getRouteStops(selectedRouteId),
    enabled: Boolean(selectedRouteId),
  });

  React.useEffect(() => {
    if (!selectedEmployeeId && allEmployees[0]) setSelectedEmployeeId(allEmployees[0].id);
    if (!selectedScheduleId && availableSchedules[0]) setSelectedScheduleId(availableSchedules[0].id);
  }, [allEmployees, availableSchedules, selectedEmployeeId, selectedScheduleId]);

  React.useEffect(() => {
    if (routeStops.length > 0) {
      setPickupStopId((current) => routeStops.some((stop) => stop.stopId === current) ? current : routeStops[0].stopId);
      setDropStopId((current) => routeStops.some((stop) => stop.stopId === current) ? current : routeStops[routeStops.length - 1].stopId);
    }
  }, [routeStops]);

  if (!isOpen) return null;

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        employeeId: selectedEmployeeId,
        routeId: selectedRouteId,
        scheduleId: selectedScheduleId,
        travelDate,
        pickupStopId,
        dropStopId,
        seatNumber,
        notes,
      });
      setStep(1);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEmployee = allEmployees.find((employee) => employee.id === selectedEmployeeId);
  const selectedPickup = routeStops.find((stop) => stop.stopId === pickupStopId);
  const selectedDrop = routeStops.find((stop) => stop.stopId === dropStopId);
  const selectedRoute = allRoutes.find((route) => route.id === selectedRouteId);
  const dataLoading = employeesLoading || routesLoading || schedulesLoading || stopsLoading;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <div>
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                Step {step} of 4 — Reservation Wizard
              </span>
              <h2 className="text-lg font-bold text-slate-100">
                {step === 1 && 'Select Passenger Profile'}
                {step === 2 && 'Set Travel Itinerary & Date'}
                {step === 3 && 'Choose Route & Shuttle Line'}
                {step === 4 && 'Confirm Reservation & Issue Pass'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="grid grid-cols-4 bg-slate-900 border-b border-slate-800 text-center text-xs">
            {['1. Employee', '2. Travel', '3. Route', '4. Confirm'].map((label, index) => {
              const stepNum = index + 1;
              const isActive = step === stepNum;
              const isCompleted = step > stepNum;
              return (
                <div
                  key={label}
                  className={`py-2 px-1 border-r last:border-0 border-slate-800 font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border-b-2 border-b-blue-500'
                      : isCompleted
                      ? 'text-emerald-400'
                      : 'text-slate-500'
                  }`}
                >
                  {label}
                </div>
              );
            })}
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {dataLoading && <p className="rounded-lg bg-slate-900 p-3 text-xs text-slate-400">Loading employees, schedules, routes, and stops...</p>}
            {!dataLoading && allEmployees.length === 0 && <p className="rounded-lg bg-amber-500/10 p-3 text-xs text-amber-300">No employees are available in the backend.</p>}
            {!dataLoading && availableSchedules.length === 0 && <p className="rounded-lg bg-amber-500/10 p-3 text-xs text-amber-300">No active schedules are available for booking.</p>}
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">Select Employee</label>
                <div className="space-y-2">
                  {allEmployees.map((emp) => (
                    <div
                      key={emp.id}
                      onClick={() => setSelectedEmployeeId(emp.id)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        selectedEmployeeId === emp.id
                          ? 'bg-blue-600/10 border-blue-500 text-slate-100'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-blue-400">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{emp.name}</p>
                          <p className="text-xs text-slate-400">{emp.email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-blue-400 font-medium">{emp.department}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Select Travel Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Pickup Stop Location
                  </label>
                  <select
                    value={pickupStopId}
                    onChange={(e) => setPickupStopId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    {routeStops.map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Dropoff Destination Stop
                  </label>
                  <select
                    value={dropStopId}
                    onChange={(e) => setDropStopId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    {routeStops.map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <label className="text-xs font-semibold text-slate-300 block">Available Routes</label>
                <div className="space-y-3">
                  {availableSchedules.map((schedule) => {
                    const route = allRoutes.find((item) => item.id === schedule.routeId);
                    return (
                    <div
                      key={schedule.id}
                      onClick={() => setSelectedScheduleId(schedule.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedScheduleId === schedule.id
                          ? 'bg-blue-600/10 border-blue-500'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-blue-400">{schedule.code || schedule.id}</span>
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">
                          {schedule.shuttleNumber || 'Shuttle assigned'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-100">{route?.name || schedule.routeName}</h4>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                        <span>Shuttle: <strong className="text-slate-200">{schedule.shuttleNumber || 'Unassigned'}</strong></span>
                        <span>Driver: <strong className="text-slate-200">{schedule.driverName || 'Unassigned'}</strong></span>
                        <span>Arrival: <strong className="text-slate-200">{schedule.arrivalTime}</strong></span>
                      </div>
                    </div>
                    );
                  })}
                </div>

                <div className="pt-2 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Preferred Seat
                    </label>
                    <input
                      type="text"
                      value={seatNumber}
                      onChange={(e) => setSeatNumber(e.target.value)}
                      placeholder="e.g. 04B"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Special Notes
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Front row"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Reservation Summary
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-slate-400 block">Passenger</span>
                      <strong className="text-slate-100 text-sm">{selectedEmployee?.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Travel Date</span>
                      <strong className="text-slate-100 text-sm">{travelDate}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-slate-400 block">Pickup Location</span>
                      <strong className="text-slate-200">{selectedPickup?.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Dropoff Destination</span>
                      <strong className="text-slate-200">{selectedDrop?.name}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Route & Line</span>
                      <strong className="text-blue-400">{selectedRoute?.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Seat Number</span>
                      <strong className="text-emerald-400 font-mono text-sm">{seatNumber}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300">
                  <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                  <span>
                    A digital QR boarding pass will automatically be issued and sent to the employee's portal.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={dataLoading || (step === 1 && !selectedEmployeeId) || (step === 2 && (!pickupStopId || !dropStopId)) || (step === 3 && !selectedScheduleId)}
                className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Confirm & Create Booking'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
