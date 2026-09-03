package com.offgo.backend.mapper;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;

import org.springframework.stereotype.Component;

import com.offgo.backend.dto.response.booking.BookingResponse;
import com.offgo.backend.entity.Booking;
import com.offgo.backend.entity.Route;
import com.offgo.backend.entity.RouteStop;

@Component
public class BookingMapper {

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");

    private String resolvePickupStopName(Route route) {
        if (route == null) return null;

        if (route.getRouteStops() == null || route.getRouteStops().isEmpty()) {
            return route.getSource();
        }

        return route.getRouteStops().stream()
                .filter(routeStop -> routeStop != null && routeStop.getStop() != null && routeStop.getStop().getStopName() != null)
                .sorted(Comparator.comparingInt(routeStop -> {
                    Integer order = routeStop.getStopOrder();
                    return order == null ? Integer.MAX_VALUE : order;
                }))
                .map(routeStop -> routeStop.getStop().getStopName())
                .findFirst()
                .orElse(route.getSource());
    }

    private String resolveDropStopName(Route route) {
        if (route == null) return null;

        if (route.getRouteStops() == null || route.getRouteStops().isEmpty()) {
            return route.getDestination();
        }

        return route.getRouteStops().stream()
                .filter(routeStop -> routeStop != null && routeStop.getStop() != null && routeStop.getStop().getStopName() != null)
                .sorted(Comparator.comparingInt((RouteStop routeStop) -> {
                    Integer order = routeStop.getStopOrder();
                    return order == null ? Integer.MIN_VALUE : order;
                }).reversed())
                .map(routeStop -> routeStop.getStop().getStopName())
                .findFirst()
                .orElse(route.getDestination());
    }

    public BookingResponse toResponse(Booking booking) {
        var schedule = booking.getSchedule();
        var route = schedule.getRoute();
        var employee = booking.getEmployee();
        var shuttle = schedule.getShuttle();
        var driver = schedule.getDriver();

        return BookingResponse.builder()
                .id(booking.getId())
                .employeeId(employee.getId())
                .scheduleId(schedule.getId())
                .routeId(route.getId())
                .shuttleId(shuttle.getId())
                .driverId(driver != null ? driver.getId() : null)
                .bookingRef(booking.getQrToken())
                .employeeName(employee.getFirstName() + " " + employee.getLastName())
                .employeeEmail(employee.getEmail())
                .employeeDepartment(employee.getDepartment() != null ? employee.getDepartment().name() : null)
                .routeName(route.getRouteName())
                .routeCode(route.getRouteCode())
                .shuttleNumber(shuttle.getVehicleNumber())
                .driverName(driver != null ? driver.getFirstName() + " " + driver.getLastName() : null)
                .pickupStopName(resolvePickupStopName(route))
                .dropStopName(resolveDropStopName(route))
                .pickupTime(schedule.getDepartureTime() != null ? schedule.getDepartureTime().format(TIME_FORMATTER) : null)
                .dropTime(schedule.getArrivalTime() != null ? schedule.getArrivalTime().format(TIME_FORMATTER) : null)
                .travelDate(schedule.getStartDate() != null ? schedule.getStartDate().toString() : null)
                .bookingDate(booking.getCreatedAt() != null ? booking.getCreatedAt().toLocalDate().toString() : null)
                .seatNumber(booking.getSeatNumber())
                .transportChargeInr(booking.getTransportChargeInr() != null ? booking.getTransportChargeInr() : BigDecimal.ZERO)
                .status(booking.getStatus())
                .createdTime(booking.getCreatedAt() != null ? booking.getCreatedAt().toString() : null)
                .build();
    }

}