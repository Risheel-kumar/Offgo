import React from 'react';
import { User, Bus, MapPin, Calendar, Clock, Navigation, CheckCircle2, AlertCircle, RefreshCw, XCircle, Ticket } from 'lucide-react';
import { BookingDetailItem, BookingStatus } from '../../types';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'APPROVED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Approved
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          Pending
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <XCircle className="w-3.5 h-3.5" />
          Cancelled
        </span>
      );
    case 'NO_SHOW':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
          <AlertCircle className="w-3.5 h-3.5" />
          No Show
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
          {status}
        </span>
      );
  }
};

export const BookingSummaryCard: React.FC<{ booking: BookingDetailItem }> = ({ booking }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono text-blue-400 font-semibold">{booking.code}</span>
          <h3 className="text-sm font-semibold text-slate-100">{booking.routeName}</h3>
        </div>
        <BookingStatusBadge status={booking.bookingStatus} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
          <span>{booking.travelDate}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Bus className="w-4 h-4 text-slate-500 shrink-0" />
          <span>Shuttle {booking.shuttleNumber}</span>
        </div>
      </div>
    </div>
  );
};

export const PassengerCard: React.FC<{ booking: BookingDetailItem }> = ({ booking }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
      {booking.employeeAvatar ? (
        <img
          src={booking.employeeAvatar}
          alt={booking.employeeName}
          className="w-11 h-11 rounded-full object-cover border border-slate-700"
        />
      ) : (
        <div className="w-11 h-11 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold">
          <User className="w-5 h-5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-100 truncate">{booking.employeeName}</h4>
          <span className="text-[11px] font-mono text-slate-400">{booking.employeeId}</span>
        </div>
        <p className="text-xs text-slate-400 truncate">{booking.employeeEmail}</p>
        <span className="inline-block mt-1 text-[10px] font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
          {booking.employeeDepartment}
        </span>
      </div>
    </div>
  );
};

export const TripCard: React.FC<{ booking: BookingDetailItem }> = ({ booking }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <Navigation className="w-4 h-4 text-blue-400" />
        Trip Itinerary
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        <div className="relative">
          <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-slate-900" />
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-medium block uppercase">Boarding Stop</span>
              <p className="text-xs font-semibold text-slate-200">{booking.pickupStopName}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <Clock className="w-3 h-3" />
              {booking.pickupTime}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-slate-900" />
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-medium block uppercase">Dropoff Stop</span>
              <p className="text-xs font-semibold text-slate-200">{booking.dropStopName}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              <MapPin className="w-3 h-3" />
              {booking.dropTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BookingPass: React.FC<{ booking: BookingDetailItem }> = ({ booking }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-emerald-100" />
          <span className="font-bold tracking-wide text-sm">OFF-GO BOARDING RESERVATION</span>
        </div>
        <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded border border-white/20">
          {booking.code}
        </span>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-slate-400 block mb-0.5">Passenger</span>
          <span className="font-semibold text-slate-200 text-sm block">{booking.employeeName}</span>
          <span className="text-slate-400 text-[11px]">{booking.employeeDepartment}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Assigned Seat</span>
          <span className="inline-block px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-sm rounded">
            Seat {booking.seatNumber}
          </span>
        </div>

        <div className="col-span-2 border-t border-slate-800 pt-3 grid grid-cols-2 gap-2">
          <div>
            <span className="text-slate-400 block mb-0.5">Pickup Location</span>
            <span className="text-slate-200 font-medium">{booking.pickupStopName}</span>
            <span className="text-emerald-400 block font-mono mt-0.5">{booking.pickupTime}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Dropoff Destination</span>
            <span className="text-slate-200 font-medium">{booking.dropStopName}</span>
            <span className="text-indigo-400 block font-mono mt-0.5">{booking.dropTime}</span>
          </div>
        </div>

        <div className="col-span-2 border-t border-slate-800 pt-3 flex items-center justify-between text-slate-400 text-[11px]">
          <span>Vehicle: <strong className="text-slate-200">{booking.shuttleNumber}</strong></span>
          <span>Travel Date: <strong className="text-slate-200">{booking.travelDate}</strong></span>
        </div>
      </div>
    </div>
  );
};
