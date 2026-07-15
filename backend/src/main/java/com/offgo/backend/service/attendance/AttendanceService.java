package com.offgo.backend.service.attendance;

import java.util.List;
import java.util.UUID;

import com.offgo.backend.dto.request.attendance.AttendanceRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.attendance.AttendanceResponse;

public interface AttendanceService {

    ApiResponse<AttendanceResponse> checkIn(
            AttendanceRequest request);

    ApiResponse<List<AttendanceResponse>> getAllAttendance();

    ApiResponse<AttendanceResponse> getAttendanceByBooking(
            UUID bookingId);

}