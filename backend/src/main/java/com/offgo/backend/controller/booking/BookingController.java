package com.offgo.backend.controller.booking;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.offgo.backend.constants.AppConstants;
import com.offgo.backend.dto.request.booking.CreateBookingRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.booking.BookingResponse;
import com.offgo.backend.enums.BookingStatus;
import com.offgo.backend.service.booking.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(AppConstants.API_BASE + "/bookings")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody CreateBookingRequest request) {

        return ResponseEntity.ok(
                bookingService.createBooking(request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {

        return ResponseEntity.ok(
                bookingService.getAllBookings());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingsByEmployeeId(
            @PathVariable UUID employeeId) {

        return ResponseEntity.ok(
                bookingService.getBookingsByEmployeeId(employeeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                bookingService.getBookingById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> cancelBooking(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                bookingService.cancelBooking(id));
    }

        @PutMapping("/{id}/status")
        public ResponseEntity<ApiResponse<BookingResponse>> updateStatus(
                        @PathVariable UUID id,
                        @RequestParam BookingStatus status) {
                return ResponseEntity.ok(bookingService.updateStatus(id, status));
        }

}