package com.offgo.backend.controller.attendance;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.offgo.backend.constants.AppConstants;
import com.offgo.backend.dto.request.attendance.AttendanceRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.attendance.AttendanceResponse;
import com.offgo.backend.service.attendance.AttendanceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(AppConstants.API_BASE + "/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/check-in")
    public ResponseEntity<ApiResponse<AttendanceResponse>> checkIn(
            @Valid @RequestBody AttendanceRequest request) {

        return ResponseEntity.ok(attendanceService.checkIn(request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getAll() {

        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<AttendanceResponse>> getByBooking(
            @PathVariable UUID bookingId) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceByBooking(bookingId));
    }
}