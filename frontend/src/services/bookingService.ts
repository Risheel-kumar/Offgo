import apiClient from '../api/axios';
import { BookingDetailItem, BookingFilterOptions, CreateBookingPayload, UpdateBookingPayload } from '../types';

const unwrap = (response: any) => response.data?.data ?? response.data;

const mapBooking = (booking: any): BookingDetailItem => ({
  id: String(booking.id),
  code: booking.code || String(booking.id),
  employeeId: String(booking.employeeId || ''),
  employeeName: booking.employeeName || '',
  employeeEmail: booking.employeeEmail || '',
  employeeDepartment: booking.employeeDepartment || '',
  employeeAvatar: booking.employeeAvatar,
  routeId: String(booking.routeId || ''),
  routeName: booking.routeName || '',
  routeCode: booking.routeCode || '',
  shuttleId: String(booking.shuttleId || ''),
  shuttleNumber: booking.shuttleNumber || '',
  driverId: String(booking.driverId || ''),
  driverName: booking.driverName || '',
  pickupStopId: String(booking.pickupStopId || ''),
  pickupStopName: booking.pickupStopName || '',
  dropStopId: String(booking.dropStopId || ''),
  dropStopName: booking.dropStopName || '',
  seatNumber: booking.seatNumber != null ? String(booking.seatNumber) : '',
  transportChargeInr: Number(booking.transportChargeInr ?? 0),
  bookingDate: booking.bookingDate || '',
  travelDate: booking.travelDate || '',
  pickupTime: booking.pickupTime || '',
  dropTime: booking.dropTime || '',
  bookingStatus: booking.status === 'BOOKED' ? 'APPROVED' : booking.status || booking.bookingStatus || 'PENDING',
  createdTime: booking.createdTime || '',
  notes: booking.notes || '',
});

export const bookingService = {
  getBookings: async (filters?: BookingFilterOptions): Promise<BookingDetailItem[]> => {
    const response = await apiClient.get('/bookings');
    let bookings = (unwrap(response) as any[]).map(mapBooking);
    const query = filters?.searchQuery?.trim().toLowerCase();
    if (query) bookings = bookings.filter((booking) =>
      `${booking.code} ${booking.employeeName} ${booking.shuttleNumber} ${booking.routeName}`.toLowerCase().includes(query)
    );
    if (filters?.bookingStatusFilter && filters.bookingStatusFilter !== 'ALL') {
      bookings = bookings.filter((booking) => booking.bookingStatus === filters.bookingStatusFilter);
    }
    return bookings;
  },

  getBookingById: async (id: string): Promise<BookingDetailItem> => {
    const response = await apiClient.get(`/bookings/${id}`);
    return mapBooking(unwrap(response));
  },

  createBooking: async (payload: CreateBookingPayload): Promise<BookingDetailItem> => {
    const response = await apiClient.post('/bookings', {
      employeeId: payload.employeeId,
      scheduleId: payload.scheduleId,
    });
    return mapBooking(unwrap(response));
  },

  updateBooking: async (payload: UpdateBookingPayload): Promise<BookingDetailItem> => {
    if (!payload.bookingStatus) return bookingService.getBookingById(payload.id);
    const status = payload.bookingStatus === 'CONFIRMED' ? 'APPROVED' : payload.bookingStatus;
    const response = await apiClient.put(`/bookings/${payload.id}/status`, undefined, {
      params: { status },
    });
    return mapBooking(unwrap(response));
  },

  deleteBooking: async (id: string): Promise<boolean> => {
    await apiClient.delete(`/bookings/${id}`);
    return true;
  },
};
