package com.offgo.backend.mapper;

import org.springframework.stereotype.Component;

import com.offgo.backend.dto.response.schedule.ScheduleResponse;
import com.offgo.backend.entity.Schedule;

@Component
public class ScheduleMapper {

    public ScheduleResponse toResponse(Schedule schedule) {

        return ScheduleResponse.builder()
                .id(schedule.getId())
                .routeId(schedule.getRoute().getId())
                .driverId(schedule.getDriver().getId())
                .shuttleId(schedule.getShuttle().getId())
                .trackingEnabled(schedule.getShuttle().isTrackingEnabled())
                .routeName(schedule.getRoute().getRouteName())
                .driverName(
                        schedule.getDriver().getFirstName()
                        + " "
                        + schedule.getDriver().getLastName())
                .shuttleNumber(
                        schedule.getShuttle().getVehicleNumber())
                .departureTime(schedule.getDepartureTime())
                .arrivalTime(schedule.getArrivalTime())
                .startDate(schedule.getStartDate())
                .endDate(schedule.getEndDate())
                .status(schedule.getStatus())
                .build();

    }

}