package com.offgo.backend.validator;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.offgo.backend.dto.request.schedule.CreateScheduleRequest;
import com.offgo.backend.entity.Schedule;
import com.offgo.backend.exception.BadRequestException;
import com.offgo.backend.repository.ScheduleRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ScheduleValidator {

    private final ScheduleRepository scheduleRepository;

    public void validate(CreateScheduleRequest request) {

        if (request.getArrivalTime()
                .isBefore(request.getDepartureTime())) {

            throw new BadRequestException(
                    "Arrival time must be after departure time.");
        }

        if (request.getEndDate()
                .isBefore(request.getStartDate())) {

            throw new BadRequestException(
                    "End date must be after start date.");
        }

        validateDriverConflict(request);

        validateShuttleConflict(request);
    }

    private void validateDriverConflict(
            CreateScheduleRequest request) {

        List<Schedule> schedules =
                scheduleRepository.findByDriverId(
                        request.getDriverId());

        checkConflict(
                schedules,
                request.getStartDate(),
                request.getEndDate(),
                request.getDepartureTime(),
                request.getArrivalTime(),
                "Driver");
    }

    private void validateShuttleConflict(
            CreateScheduleRequest request) {

        List<Schedule> schedules =
                scheduleRepository.findByShuttleId(
                        request.getShuttleId());

        checkConflict(
                schedules,
                request.getStartDate(),
                request.getEndDate(),
                request.getDepartureTime(),
                request.getArrivalTime(),
                "Shuttle");
    }

    private void checkConflict(
            List<Schedule> schedules,
            LocalDate startDate,
            LocalDate endDate,
            LocalTime departure,
            LocalTime arrival,
            String resource) {

        for (Schedule schedule : schedules) {

            boolean dateOverlap =
                    !endDate.isBefore(schedule.getStartDate())
                    && !startDate.isAfter(schedule.getEndDate());

            boolean timeOverlap =
                    departure.isBefore(schedule.getArrivalTime())
                    && arrival.isAfter(schedule.getDepartureTime());

            if (dateOverlap && timeOverlap) {

                throw new BadRequestException(
                        resource + " already has a schedule during this time.");

            }
        }
    }
}