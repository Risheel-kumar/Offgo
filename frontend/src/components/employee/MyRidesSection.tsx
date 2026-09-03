import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/cards/Card';
import { Button } from '../common/buttons/Button';
import { Modal } from '../common/dialogs/Modal';
import {
  Calendar,
  Clock,
  MapPin,
  Bus,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  ChevronRight,
  ShieldCheck,
  User,
  Ticket,
} from 'lucide-react';
import { Booking } from '../../types';
import toast from 'react-hot-toast';

interface MyRidesSectionProps {
  upcomingBookings: Booking[];
  bookingHistory: Booking[];
  onCancelBooking?: (bookingId: string) => void;
}

export const MyRidesSection: React.FC<MyRidesSectionProps> = ({
  upcomingBookings,
  bookingHistory,
  onCancelBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'RECENT'>('UPCOMING');
  const [selectedRideDetails, setSelectedRideDetails] = useState<Booking | null>(null);

  const currentRides = (activeTab === 'UPCOMING' ? upcomingBookings : bookingHistory)
    .slice()
    .sort((a, b) => {
      const getComparableTime = (booking: Booking) => {
        if (!booking.date) return 0;

        const match = (booking.pickupTime || '00:00 AM').match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        let hour = 0;
        let minute = 0;

        if (match) {
          hour = Number(match[1]);
          minute = Number(match[2]);
          const meridiem = match[3].toUpperCase();
          if (meridiem === 'PM' && hour !== 12) hour += 12;
          if (meridiem === 'AM' && hour === 12) hour = 0;
        }

        const base = new Date(`${booking.date}T00:00:00`);
        base.setHours(hour, minute, 0, 0);
        return base.getTime();
      };

      return getComparableTime(b) - getComparableTime(a);
    });

  const handleCancel = (id: string) => {
    if (onCancelBooking) {
      onCancelBooking(id);
    }
    toast.success('Shuttle booking cancelled successfully.');
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-500" />
          My Rides & Reservations
        </CardTitle>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('UPCOMING')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'UPCOMING'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('RECENT')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'RECENT'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Recent History ({bookingHistory.length})
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {currentRides.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-medium">
            {activeTab === 'UPCOMING' ? 'No upcoming rides found.' : 'No recent ride history found.'}
          </div>
        ) : (
          <div className="max-h-[440px] overflow-y-auto pr-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentRides.map((ride) => (
                <div
                  key={ride.id}
                  className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
                >
                {/* Header Row */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {ride.bookingRef || 'BKG-2026-9001'}
                    </span>
                    {ride.seatNumber && (
                      <span className="text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded">
                        Seat: {ride.seatNumber}
                      </span>
                    )}
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      ride.status === 'CONFIRMED'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : ride.status === 'COMPLETED'
                        ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                        : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                    }`}
                  >
                    {ride.status === 'CONFIRMED' && <CheckCircle2 className="w-3 h-3" />}
                    {ride.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                    <span className="flex items-center gap-1.5">
                      <Bus className="w-4 h-4 text-indigo-500" />
                      {ride.routeName}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      Vehicle: {ride.shuttleNumber || ride.shuttleVehicleNumber || 'OG-BUS-104'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 grid grid-cols-2 gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-500" /> Pickup
                      </span>
                      <p className="font-semibold text-slate-900 dark:text-white mt-0.5 truncate">
                        {ride.pickupStopName || ride.pickupStop || 'Scheduled Stop'}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" /> Drop
                      </span>
                      <p className="font-semibold text-slate-900 dark:text-white mt-0.5 truncate">
                        {ride.dropStopName || ride.dropoffStop || 'Tech Park Gate'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Trip Date: <strong>{ride.date}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Time: <strong>{ride.pickupTime}</strong>
                    </span>
                  </div>
                </div>

                {/* Card Action Row */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRideDetails(ride)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    View Details
                  </Button>

                  {activeTab === 'UPCOMING' && ride.status !== 'CANCELLED' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancel(ride.id)}
                      leftIcon={<XCircle className="w-3.5 h-3.5" />}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Ride Details Modal */}
      {selectedRideDetails && (
        <Modal
          isOpen={!!selectedRideDetails}
          onClose={() => setSelectedRideDetails(null)}
          title="Shuttle Reservation Details"
        >
          <div className="space-y-4 p-1">
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold text-indigo-400">
                  {selectedRideDetails.bookingRef || 'BKG-2026-9001'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {selectedRideDetails.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Route Name</span>
                  <p className="font-bold text-white mt-0.5">{selectedRideDetails.routeName}</p>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Shuttle Vehicle</span>
                  <p className="font-bold text-white mt-0.5">{selectedRideDetails.shuttleNumber || selectedRideDetails.shuttleVehicleNumber || 'OG-BUS-104'}</p>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Pickup Stop</span>
                  <p className="font-bold text-emerald-400 mt-0.5">{selectedRideDetails.pickupStopName || selectedRideDetails.pickupStop || 'Indiranagar'}</p>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Drop Stop</span>
                  <p className="font-bold text-rose-400 mt-0.5">{selectedRideDetails.dropStopName || selectedRideDetails.dropoffStop || 'Tech Park'}</p>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Date & Time</span>
                  <p className="font-bold text-white mt-0.5">{selectedRideDetails.date} @ {selectedRideDetails.pickupTime}</p>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Assigned Seat</span>
                  <p className="font-bold text-indigo-400 mt-0.5 font-mono">SEAT {selectedRideDetails.seatNumber || '14A'}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Employer Subsidized ($0 Out of Pocket)</span>
                <span className="font-mono text-emerald-400 font-bold">100% COVERED</span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedRideDetails(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
};
