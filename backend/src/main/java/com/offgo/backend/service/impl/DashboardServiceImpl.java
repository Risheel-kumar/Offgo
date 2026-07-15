package com.offgo.backend.service.impl;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.dashboard.AdminDashboardResponse;
import com.offgo.backend.dto.response.dashboard.DriverDashboardResponse;
import com.offgo.backend.dto.response.dashboard.EmployeeDashboardResponse;
import com.offgo.backend.entity.Booking;
import com.offgo.backend.entity.Employee;
import com.offgo.backend.exception.ResourceNotFoundException;
import com.offgo.backend.repository.AttendanceRepository;
import com.offgo.backend.repository.BookingRepository;
import com.offgo.backend.repository.DriverRepository;
import com.offgo.backend.repository.EmployeeRepository;
import com.offgo.backend.repository.RouteRepository;
import com.offgo.backend.repository.ScheduleRepository;
import com.offgo.backend.repository.ShuttleRepository;
import com.offgo.backend.service.dashboard.DashboardService;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl
        implements DashboardService {

    private final EmployeeRepository employeeRepository;

    private final DriverRepository driverRepository;

    private final ShuttleRepository shuttleRepository;

    private final RouteRepository routeRepository;

    private final ScheduleRepository scheduleRepository;

    private final BookingRepository bookingRepository;

    private final AttendanceRepository attendanceRepository;

    @Override
    public ApiResponse<AdminDashboardResponse>
    getAdminDashboard() {
        log.info("Loading Admin Dashboard");
        AdminDashboardResponse response =
                AdminDashboardResponse.builder()

                .totalEmployees(
                        employeeRepository.count())

                .totalDrivers(
                        driverRepository.count())

                .totalShuttles(
                        shuttleRepository.count())

                .totalRoutes(
                        routeRepository.count())

                .totalSchedules(
                        scheduleRepository.count())

                .totalBookings(
                        bookingRepository.count())

                .totalAttendance(
                        attendanceRepository.count())

                .activeShuttles(
                        shuttleRepository.countByActiveTrue())

                .build();
        log.info("Dashboard loaded successfully");
            return ApiResponse.<AdminDashboardResponse>builder()
                    .success(true)
                    .message("Dashboard loaded successfully")
                    .data(response)
                    .build();

        }

        @Override
    public ApiResponse<EmployeeDashboardResponse> getEmployeeDashboard(UUID employeeId) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        Booking booking = bookingRepository
                .findFirstByEmployeeIdOrderByCreatedAtDesc(employeeId)
                .orElse(null);

        EmployeeDashboardResponse response =
                EmployeeDashboardResponse.builder()
                        .employeeName(
                                employee.getFirstName() + " " + employee.getLastName())
                        .currentBooking(
                                booking != null ? booking.getId().toString() : "No Booking")
                        .shuttleNumber(
                                booking != null
                                        ? booking.getSchedule().getShuttle().getVehicleNumber()
                                        : "-")
                        .routeName(
                                booking != null
                                        ? booking.getSchedule().getRoute().getRouteName()
                                        : "-")
                        .qrCodeUrl(
                                booking != null
                                        ? "/api/v1/qr/" + booking.getId()
                                        : "-")
                        .etaMinutes(0)
                        .build();

        return ApiResponse.<EmployeeDashboardResponse>builder()
                .success(true)
                .message("Employee dashboard loaded successfully")
                .data(response)
                .build();
    }
    @Override
    public ApiResponse<DriverDashboardResponse>
    getDriverDashboard(UUID driverId) {

        return ApiResponse.<DriverDashboardResponse>builder()
                .success(true)
                .message("Driver dashboard coming soon")
                .data(null)
                .build();

    }

}