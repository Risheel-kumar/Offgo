package com.offgo.backend.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import org.junit.jupiter.api.Test;

import com.offgo.backend.dto.response.booking.BookingResponse;
import com.offgo.backend.entity.Booking;
import com.offgo.backend.entity.Driver;
import com.offgo.backend.entity.Employee;
import com.offgo.backend.entity.Route;
import com.offgo.backend.entity.Schedule;
import com.offgo.backend.entity.Shuttle;
import com.offgo.backend.enums.BookingStatus;
import com.offgo.backend.enums.Department;
import com.offgo.backend.enums.RouteStatus;
import com.offgo.backend.enums.ShuttleStatus;
import com.offgo.backend.enums.VehicleType;

class BookingMapperTest {

    @Test
    void shouldMapBookingToAdminResponseWithRouteAndEmployeeDetails() {
        UUID employeeId = UUID.randomUUID();
        UUID routeId = UUID.randomUUID();
        UUID shuttleId = UUID.randomUUID();
        UUID scheduleId = UUID.randomUUID();
        UUID driverId = UUID.randomUUID();

        Employee employee = Employee.builder()
                .id(employeeId)
                .employeeCode("EMP-1001")
                .firstName("Jane")
                .lastName("Doe")
                .email("jane.doe@company.com")
                .phoneNumber("9999999999")
                .department(Department.ENGINEERING)
                .active(true)
                .build();

        Driver driver = Driver.builder()
                .id(driverId)
                .employeeId("DRV-1001")
                .firstName("John")
                .lastName("Driver")
                .email("john.driver@offgo.fleet.com")
                .phoneNumber("8888888888")
                .licenseNumber("LIC-123")
                .experience(5)
                .active(true)
                .build();

        Route route = Route.builder()
                .id(routeId)
                .routeCode("RT-EX-01")
                .routeName("HQ Financial District Express Line A")
                .source("Financial District Terminal")
                .destination("Off-Go Innovation HQ")
                .distanceKm(new BigDecimal("12.50"))
                .estimatedDurationMinutes(35)
                .status(RouteStatus.ACTIVE)
                .active(true)
                .build();

        Shuttle shuttle = Shuttle.builder()
                .id(shuttleId)
                .vehicleNumber("OFF-GO-104")
                .vehicleName("Ford E-Transit Custom")
                .vehicleType(VehicleType.VAN)
                .capacity(14)
                .availableSeats(14)
                .status(ShuttleStatus.ACTIVE)
                .active(true)
                .build();

        Schedule schedule = Schedule.builder()
                .id(scheduleId)
                .route(route)
                .driver(driver)
                .shuttle(shuttle)
                .departureTime(LocalTime.of(7, 30))
                .arrivalTime(LocalTime.of(8, 10))
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusDays(30))
                .build();

        Booking booking = Booking.builder()
                .id(UUID.randomUUID())
                .employee(employee)
                .schedule(schedule)
                .seatNumber(4)
                .status(BookingStatus.APPROVED)
                .qrToken("qr-token-123")
                .build();

        BookingResponse response = new BookingMapper().toResponse(booking);

        assertNotNull(response);
        assertEquals(employeeId, response.getEmployeeId());
        assertEquals("Jane Doe", response.getEmployeeName());
        assertEquals("ENGINEERING", response.getEmployeeDepartment());
        assertEquals(routeId, response.getRouteId());
        assertEquals("RT-EX-01", response.getRouteCode());
        assertEquals("Off-Go Innovation HQ", response.getDropStopName());
        assertEquals("Financial District Terminal", response.getPickupStopName());
        assertEquals("John Driver", response.getDriverName());
        assertEquals("OFF-GO-104", response.getShuttleNumber());
        assertEquals(LocalDate.now().toString(), response.getTravelDate());
        assertEquals("07:30:00", response.getPickupTime());
        assertEquals("08:10:00", response.getDropTime());
        assertEquals(BookingStatus.APPROVED, response.getStatus());
    }
}
