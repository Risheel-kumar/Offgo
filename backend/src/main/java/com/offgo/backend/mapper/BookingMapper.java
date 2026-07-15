package com.offgo.backend.mapper;

import org.springframework.stereotype.Component;

import com.offgo.backend.dto.response.booking.BookingResponse;
import com.offgo.backend.entity.Booking;

@Component
public class BookingMapper {

    public BookingResponse toResponse(Booking booking) {

        return BookingResponse.builder()
                .id(booking.getId())
                .employeeName(
                        booking.getEmployee().getFirstName()
                        + " "
                        + booking.getEmployee().getLastName())
                .routeName(
                        booking.getSchedule()
                               .getRoute()
                               .getRouteName())
                .shuttleNumber(
                        booking.getSchedule()
                               .getShuttle()
                               .getVehicleNumber())
                .seatNumber(booking.getSeatNumber())
                .status(booking.getStatus())
                .build();
    }

}