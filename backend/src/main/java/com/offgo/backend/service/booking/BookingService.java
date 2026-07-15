package com.offgo.backend.service.booking;

import java.util.List;
import java.util.UUID;

import com.offgo.backend.dto.request.booking.CreateBookingRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.booking.BookingResponse;

public interface BookingService {

    ApiResponse<BookingResponse> createBooking(
            CreateBookingRequest request);

    ApiResponse<List<BookingResponse>> getAllBookings();

    ApiResponse<BookingResponse> getBookingById(
            UUID id);

    ApiResponse<String> cancelBooking(
            UUID id);

}