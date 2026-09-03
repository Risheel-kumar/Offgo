package com.offgo.backend.service.impl;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.dashboard.AdminDashboardResponse;
import com.offgo.backend.dto.response.dashboard.DriverDashboardResponse;
import com.offgo.backend.dto.response.dashboard.EmployeeDashboardResponse;
import com.offgo.backend.entity.Booking;
import com.offgo.backend.entity.Employee;
import com.offgo.backend.enums.BookingStatus;
import com.offgo.backend.exception.ResourceNotFoundException;
import com.offgo.backend.repository.AttendanceRepository;
import com.offgo.backend.repository.BookingRepository;
import com.offgo.backend.repository.DriverRepository;
import com.offgo.backend.repository.EmployeeRepository;
import com.offgo.backend.repository.RouteRepository;
import com.offgo.backend.repository.ScheduleRepository;
import com.offgo.backend.repository.ShuttleRepository;
import com.offgo.backend.service.dashboard.DashboardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

        LocalDate today = LocalDate.now();
        Set<BookingStatus> excludedStatuses = Set.of(
                BookingStatus.CANCELLED,
                BookingStatus.COMPLETED,
                BookingStatus.REJECTED,
                BookingStatus.NO_SHOW);
        Booking booking = bookingRepository.findByEmployeeId(employeeId).stream()
                .filter(candidate -> candidate.getSchedule() != null)
                .filter(candidate -> !excludedStatuses.contains(candidate.getStatus()))
                .filter(candidate -> candidate.getSchedule().getEndDate() == null
                        || !candidate.getSchedule().getEndDate().isBefore(today))
                .min(Comparator
                        .comparing((Booking candidate) -> candidate.getSchedule().getStartDate(),
                                Comparator.nullsLast(Comparator.naturalOrder()))
                        .thenComparing(candidate -> candidate.getSchedule().getDepartureTime(),
                                Comparator.nullsLast(Comparator.naturalOrder())))
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
        var driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new com.offgo.backend.exception.ResourceNotFoundException("Driver not found"));
        var schedules = scheduleRepository.findByDriverId(driverId);
        var bookings = schedules.stream()
                .flatMap(schedule -> bookingRepository.findByScheduleId(schedule.getId()).stream())
                .toList();
        var currentSchedule = schedules.stream().findFirst().orElse(null);
        return ApiResponse.<DriverDashboardResponse>builder()
                .success(true)
                .message("Driver dashboard loaded successfully")
                .data(DriverDashboardResponse.builder()
                        .driverName(driver.getFirstName() + " " + driver.getLastName())
                        .shuttleNumber(currentSchedule == null ? null : currentSchedule.getShuttle().getVehicleNumber())
                        .routeName(currentSchedule == null ? null : currentSchedule.getRoute().getRouteName())
                        .completedTrips((int) schedules.stream().filter(schedule -> schedule.getStatus().name().equals("COMPLETED")).count())
                        .todaysPassengers(bookings.size())
                        .build())
                .build();

    }

}