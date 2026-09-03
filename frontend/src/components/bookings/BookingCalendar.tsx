import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, User, Bus } from 'lucide-react';
import { BookingDetailItem } from '../../types';
import { BookingStatusBadge } from './Cards';

interface BookingCalendarProps {
  bookings: BookingDetailItem[];
  onSelectBooking: (booking: BookingDetailItem) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({ bookings, onSelectBooking }) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-07-22');

  const filteredForDate = bookings.filter((b) => b.travelDate === selectedDate);

  // Calendar dates list for week preview
  const daysList = [
    { dayName: 'Mon', date: '2026-07-20' },
    { dayName: 'Tue', date: '2026-07-21' },
    { dayName: 'Wed', date: '2026-07-22' },
    { dayName: 'Thu', date: '2026-07-23' },
    { dayName: 'Fri', date: '2026-07-24' },
    { dayName: 'Sat', date: '2026-07-25' },
    { dayName: 'Sun', date: '2026-07-26' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      {/* Calendar Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Shuttle Reservation Schedule</h3>
            <p className="text-xs text-slate-400">Daily passenger dispatch schedule overview</p>
          </div>
        </div>

        {/* Date Selector Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {daysList.map((d) => {
            const isSelected = selectedDate === d.date;
            const count = bookings.filter((b) => b.travelDate === d.date).length;
            return (
              <button
                key={d.date}
                onClick={() => setSelectedDate(d.date)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex flex-col items-center min-w-[54px] transition-all border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{d.dayName}</span>
                <span className="text-[10px] font-mono opacity-80">{d.date.split('-')[2]}</span>
                {count > 0 && (
                  <span
                    className={`mt-1 px-1.5 py-0.2 text-[9px] rounded-full font-bold ${
                      isSelected ? 'bg-white text-blue-600' : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings Timeline for selected date */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Reservations for {selectedDate} ({filteredForDate.length} Bookings)
        </h4>

        {filteredForDate.length === 0 ? (
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-8 text-center text-slate-400 text-xs">
            No shuttle reservations scheduled for this date.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredForDate.map((booking) => (
              <div
                key={booking.id}
                onClick={() => onSelectBooking(booking)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 text-sm block group-hover:text-blue-400 transition-colors">
                      {booking.employeeName}
                    </span>
                    <span className="text-xs text-slate-400 block">{booking.routeName}</span>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Clock className="w-3 h-3" />
                        {booking.pickupTime}
                      </span>
                      <span>•</span>
                      <span>Stop: {booking.pickupStopName}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="inline-block px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono font-bold text-xs rounded">
                    Seat {booking.seatNumber}
                  </span>
                  <div className="mt-1">
                    <BookingStatusBadge status={booking.bookingStatus} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
