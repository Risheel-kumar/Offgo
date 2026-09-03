import React from 'react';
import { Eye, Trash2, Bus, MapPin, User, Ticket } from 'lucide-react';
import { BookingDetailItem } from '../../types';
import { BookingStatusBadge } from './Cards';

interface BookingTableProps {
  bookings: BookingDetailItem[];
  onSelectBooking: (booking: BookingDetailItem) => void;
  onDeleteBooking: (id: string) => void;
}

export const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  onSelectBooking,
  onDeleteBooking,
}) => {
  return (
    <div className="w-full">
      {/* Desktop Enterprise Table */}
      <div className="hidden lg:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[620px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950/80 sticky top-0 backdrop-blur-md z-10 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Passenger</th>
                <th className="py-3 px-4">Route & Line</th>
                <th className="py-3 px-4">Shuttle / Driver</th>
                <th className="py-3 px-4">Pickup / Drop</th>
                <th className="py-3 px-4">Travel Date</th>
                <th className="py-3 px-4">Seat</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  onClick={() => onSelectBooking(booking)}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  {/* Booking ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                    {booking.code}
                  </td>

                  {/* Passenger */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      {booking.employeeAvatar ? (
                        <img
                          src={booking.employeeAvatar}
                          alt={booking.employeeName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-slate-200 block">{booking.employeeName}</span>
                        <span className="text-[11px] text-slate-400">{booking.employeeDepartment}</span>
                      </div>
                    </div>
                  </td>

                  {/* Route */}
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-200 block">{booking.routeName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{booking.routeCode}</span>
                  </td>

                  {/* Shuttle / Driver */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <Bus className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{booking.shuttleNumber}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block">{booking.driverName}</span>
                  </td>

                  {/* Pickup / Drop */}
                  <td className="py-3.5 px-4">
                    <div className="text-slate-200 font-medium truncate max-w-[150px]">
                      {booking.pickupStopName}
                    </div>
                    <div className="text-slate-400 text-[11px] truncate max-w-[150px]">
                      &rarr; {booking.dropStopName}
                    </div>
                  </td>

                  {/* Travel Date */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-slate-300 block">{booking.travelDate}</span>
                    <span className="text-[11px] text-emerald-400 font-mono">{booking.pickupTime}</span>
                  </td>

                  {/* Seat */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono font-bold text-xs rounded">
                      {booking.seatNumber}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <BookingStatusBadge status={booking.bookingStatus} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelectBooking(booking)}
                        className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                        title="View Pass Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteBooking(booking.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile & Tablet Card Layout */}
      <div className="lg:hidden space-y-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            onClick={() => onSelectBooking(booking)}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-blue-400" />
                <span className="font-mono text-xs font-bold text-blue-400">{booking.code}</span>
              </div>
              <BookingStatusBadge status={booking.bookingStatus} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-100">{booking.employeeName}</h4>
                <p className="text-xs text-slate-400">{booking.routeName}</p>
              </div>
              <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono font-bold text-xs rounded">
                Seat {booking.seatNumber}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 block">Pickup</span>
                <span className="font-medium truncate block">{booking.pickupStopName}</span>
                <span className="text-[11px] text-emerald-400 font-mono">{booking.pickupTime}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Travel Date</span>
                <span className="font-medium block">{booking.travelDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
