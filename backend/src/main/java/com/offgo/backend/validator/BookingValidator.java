package com.offgo.backend.validator;

import org.springframework.stereotype.Component;

import com.offgo.backend.dto.request.booking.CreateBookingRequest;
import com.offgo.backend.exception.BadRequestException;
import com.offgo.backend.repository.BookingRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BookingValidator {

    private final BookingRepository bookingRepository;

    public void validate(CreateBookingRequest request) {

        if (bookingRepository.existsByEmployeeIdAndScheduleId(
                request.getEmployeeId(),
                request.getScheduleId())) {

            throw new BadRequestException(
                    "Employee already booked this schedule.");
        }

    }

}