import { ShuttleSeatLayout, SeatItem, SeatStatus, SeatCategory, SeatBookingPayload } from '../types';
import apiClient from '../api/axios';

/**
 * Helper to generate realistic seating layout for various shuttle models
 */
const generateSeatLayout = (
  vehicleId: string,
  vehicleNumber: string,
  shuttleName: string,
  driverName: string,
  capacity: number = 22
): ShuttleSeatLayout => {
  const seats: SeatItem[] = [];
  const rows = Math.ceil((capacity - 4) / 4) + 1; // 4 seats per row + rear bench
  const columns = 4; // Col 0: Left Window, Col 1: Left Aisle, Col 2: Right Aisle, Col 3: Right Window

  // Pre-configured reserved seats for realistic simulation
  const reservedSeatNumbers = ['01A', '02B', '03A', '04C', '05D', '06B'];
  const blockedSeatNumbers = ['01C']; // Driver proximity or safety buffer
  const prioritySeatNumbers = ['01B', '02A']; // Wheelchair/Senior/Accessible priority

  let seatIndex = 1;

  for (let r = 1; r <= rows; r++) {
    // If it's the last row, generate a 5-seat rear bench
    if (r === rows) {
      const rearCols = [0, 1, 2, 3];
      rearCols.forEach((colIndex) => {
        const seatNum = `${r.toString().padStart(2, '0')}${String.fromCharCode(65 + colIndex)}`;
        seats.push({
          id: `seat-${vehicleId}-${seatNum}`,
          seatNumber: seatNum,
          row: r,
          column: colIndex,
          status: 'AVAILABLE',
          category: 'REAR',
          featureBadge: colIndex === 0 || colIndex === 3 ? 'WINDOW' : undefined,
        });
      });
      break;
    }

    // Standard 2+2 rows (Cols: 0=A/Window, 1=B/Aisle, 2=C/Aisle, 3=D/Window)
    for (let c = 0; c < columns; c++) {
      if (seats.length >= capacity) break;

      const letter = String.fromCharCode(65 + c);
      const seatNum = `${r.toString().padStart(2, '0')}${letter}`;

      let category: SeatCategory = 'AISLE';
      if (c === 0 || c === 3) category = 'WINDOW';

      let status: SeatStatus = 'AVAILABLE';
      let isPriority = false;
      let reservedBy: string | undefined = undefined;
      let featureBadge: 'WINDOW' | 'EXTRA_LEGROOM' | 'ACCESSIBLE' | 'POPULAR' | undefined = undefined;

      if (c === 0 || c === 3) featureBadge = 'WINDOW';
      if (r === 1) featureBadge = 'EXTRA_LEGROOM';

      if (reservedSeatNumbers.includes(seatNum)) {
        status = 'RESERVED';
        reservedBy = 'Reserved Passenger';
      } else if (blockedSeatNumbers.includes(seatNum)) {
        status = 'BLOCKED';
      } else if (prioritySeatNumbers.includes(seatNum)) {
        status = 'PRIORITY';
        isPriority = true;
        featureBadge = 'ACCESSIBLE';
      }

      seats.push({
        id: `seat-${vehicleId}-${seatNum}`,
        seatNumber: seatNum,
        row: r,
        column: c,
        status,
        category,
        isPriority,
        reservedBy,
        featureBadge,
      });

      seatIndex++;
    }
  }

  const availableCount = seats.filter((s) => s.status === 'AVAILABLE' || s.status === 'PRIORITY').length;
  const bookedCount = seats.filter((s) => s.status === 'RESERVED').length;
  const blockedCount = seats.filter((s) => s.status === 'BLOCKED' || s.status === 'UNAVAILABLE').length;

  return {
    vehicleId,
    vehicleNumber,
    shuttleName,
    driverName,
    capacity: seats.length,
    totalRows: rows,
    columnsPerRow: 4,
    layoutPattern: '2+2',
    driverPosition: 'RIGHT',
    entrancePosition: 'LEFT_FRONT',
    seats,
    availableCount,
    bookedCount,
    reservedCount: bookedCount,
    blockedCount,
  };
};

// In-memory store for seats across sessions
const layoutCache: Record<string, ShuttleSeatLayout> = {};
const shuttleSeatStats: Record<string, { totalSeats: number; availableSeats: number; bookedSeats: number }> = {};

const ensureSeatStats = (vehicleId: string, capacity: number) => {
  const safeCapacity = Math.max(0, Number(capacity) || 0);
  if (!shuttleSeatStats[vehicleId]) {
    shuttleSeatStats[vehicleId] = {
      totalSeats: safeCapacity,
      availableSeats: safeCapacity,
      bookedSeats: 0,
    };
  }

  const stats = shuttleSeatStats[vehicleId];
  stats.totalSeats = Math.max(safeCapacity, stats.totalSeats || safeCapacity);
  stats.availableSeats = Math.max(0, Number(stats.availableSeats ?? stats.totalSeats));
  stats.bookedSeats = Math.max(0, Number(stats.bookedSeats ?? 0));
  if (stats.availableSeats + stats.bookedSeats > stats.totalSeats) {
    stats.availableSeats = Math.max(0, stats.totalSeats - stats.bookedSeats);
  }
  return stats;
};

export const seatService = {
  /**
   * Get seat layout for a given shuttle, date and shift
   */
  async getSeatLayout(
    vehicleId: string = 'shuttle-101',
    shuttleName: string = 'Outer Ring Road Express Shuttle',
    vehicleNumber: string = 'OFF-GO-101',
    driverName: string = 'David Miller'
  ): Promise<ShuttleSeatLayout> {
    const cacheKey = `${vehicleId}`;
    if (!layoutCache[cacheKey]) {
      const totalSeats = 20;
      const stats = ensureSeatStats(vehicleId, totalSeats);
      const layout = generateSeatLayout(
        vehicleId,
        vehicleNumber,
        shuttleName,
        driverName,
        totalSeats
      );
      layout.availableCount = stats.availableSeats;
      layout.bookedCount = stats.bookedSeats;
      layout.reservedCount = stats.bookedSeats;
      layoutCache[cacheKey] = layout;
    }

    const layout = JSON.parse(JSON.stringify(layoutCache[cacheKey])) as ShuttleSeatLayout;
    const stats = ensureSeatStats(vehicleId, layout.capacity);
    layout.totalRows = layout.totalRows || 1;
    layout.availableCount = stats.availableSeats;
    layout.bookedCount = stats.bookedSeats;
    layout.reservedCount = stats.bookedSeats;
    return layout;
  },

  /**
   * Validate if selected seat is available
   */
  async validateSeatAvailability(
    vehicleId: string,
    seatNumber: string
  ): Promise<{ available: boolean; message?: string }> {
    const layout = await this.getSeatLayout(vehicleId);
    const seat = layout.seats.find((s) => s.seatNumber === seatNumber);

    if (!seat) {
      return { available: false, message: `Seat ${seatNumber} does not exist on this shuttle.` };
    }

    if (seat.status === 'RESERVED') {
      return { available: false, message: `Seat ${seatNumber} was just reserved by another passenger.` };
    }

    if (seat.status === 'BLOCKED' || seat.status === 'UNAVAILABLE') {
      return { available: false, message: `Seat ${seatNumber} is currently blocked for operational reasons.` };
    }

    return { available: true };
  },

  /**
   * Submit seat booking reservation
   */
  async confirmSeatBooking(payload: SeatBookingPayload): Promise<{
    success: boolean;
    bookingCode: string;
    passId: string;
    message: string;
  }> {
    if (!payload.scheduleId) {
      throw new Error('No schedule was selected for this shuttle.');
    }

    const employeesResponse = await apiClient.get('/employees');
    const employees = employeesResponse.data?.data ?? employeesResponse.data ?? [];
    const employee = employees.find((candidate: any) =>
      String(candidate.employeeCode ?? '').toLowerCase() === String(payload.employeeCode ?? '').toLowerCase()
      || String(candidate.email ?? '').toLowerCase() === String(payload.employeeEmail ?? '').toLowerCase()
    );

    if (!employee?.id) {
      throw new Error('Your employee profile is not configured in the employee directory.');
    }

    const response = await apiClient.post('/bookings', {
      employeeId: employee.id,
      scheduleId: payload.scheduleId,
    });
    const booking = response.data?.data ?? response.data;

    // Validate availability
    const check = await this.validateSeatAvailability(payload.shuttleId, payload.seatNumber);
    if (!check.available) {
      throw new Error(check.message || 'Selected seat is no longer available.');
    }

    const stats = ensureSeatStats(payload.shuttleId, layoutCache[payload.shuttleId]?.capacity || 20);
    if (stats.availableSeats <= 0) {
      throw new Error('This shuttle is fully booked. Please choose another route.');
    }

    // Update seat status in cache to RESERVED
    if (layoutCache[payload.shuttleId]) {
      const seat = layoutCache[payload.shuttleId].seats.find((s) => s.seatNumber === payload.seatNumber);
      if (seat) {
        seat.status = 'RESERVED';
        seat.reservedBy = payload.employeeName;
        layoutCache[payload.shuttleId].availableCount = Math.max(0, layoutCache[payload.shuttleId].availableCount - 1);
        layoutCache[payload.shuttleId].bookedCount = Math.max(0, layoutCache[payload.shuttleId].bookedCount + 1);
        layoutCache[payload.shuttleId].reservedCount = layoutCache[payload.shuttleId].bookedCount;
      }
    }

    stats.availableSeats = Math.max(0, stats.availableSeats - 1);
    stats.bookedSeats = Math.min(stats.totalSeats, stats.bookedSeats + 1);
    if (layoutCache[payload.shuttleId]) {
      layoutCache[payload.shuttleId].availableCount = stats.availableSeats;
      layoutCache[payload.shuttleId].bookedCount = stats.bookedSeats;
      layoutCache[payload.shuttleId].reservedCount = stats.bookedSeats;
    }

    const bookingCode = booking.bookingRef || `BOOK-${booking.id}`;
    const passId = String(booking.id);

    return {
      success: true,
      bookingCode,
      passId,
      message: `Seat ${payload.seatNumber} successfully booked on ${payload.routeName}!`,
    };
  },
};
