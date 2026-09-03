package com.offgo.backend.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.offgo.backend.dto.request.schedule.CreateScheduleRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.schedule.ScheduleResponse;
import com.offgo.backend.entity.Driver;
import com.offgo.backend.entity.Route;
import com.offgo.backend.entity.Schedule;
import com.offgo.backend.entity.Shuttle;
import com.offgo.backend.exception.ResourceNotFoundException;
import com.offgo.backend.mapper.ScheduleMapper;
import com.offgo.backend.repository.DriverRepository;
import com.offgo.backend.repository.RouteRepository;
import com.offgo.backend.repository.ScheduleRepository;
import com.offgo.backend.repository.ShuttleRepository;
import com.offgo.backend.service.schedule.ScheduleService;
import com.offgo.backend.validator.ScheduleValidator;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final DriverRepository driverRepository;
    private final RouteRepository routeRepository;
    private final ShuttleRepository shuttleRepository;
    private final ScheduleValidator validator;
    private final ScheduleMapper mapper;

    @Override
    public ApiResponse<ScheduleResponse> createSchedule(
            CreateScheduleRequest request) {
        log.info("Creating new schedule");
        validator.validate(request);

        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Route not found"));
        log.info("Route selected {}", route.getRouteCode());
        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Driver not found"));
        log.info("Driver selected {}", driver.getEmployeeId());
        Shuttle shuttle = shuttleRepository.findById(request.getShuttleId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Shuttle not found"));
        log.info("Shuttle selected {}", shuttle.getVehicleNumber());
        if (!route.isActive()) {
            throw new IllegalStateException("Route is inactive.");
        }

        if (!driver.isActive()) {
            throw new IllegalStateException("Driver is inactive.");
        }

        if (!shuttle.isActive()) {
            throw new IllegalStateException("Shuttle is inactive.");
        }

                shuttle.setTrackingEnabled(false);
                shuttle.setStatus(com.offgo.backend.enums.ShuttleStatus.INACTIVE);
                shuttleRepository.save(shuttle);

        Schedule schedule = Schedule.builder()
                .route(route)
                .driver(driver)
                .shuttle(shuttle)
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        Schedule savedSchedule = scheduleRepository.save(schedule);
        log.info(
        "Schedule {} created",
        savedSchedule.getId());
        return ApiResponse.<ScheduleResponse>builder()
                .success(true)
                .message("Schedule created successfully")
                .data(mapper.toResponse(savedSchedule))
                .build();
    }

    @Override
    public ApiResponse<List<ScheduleResponse>> getAllSchedules() {
        log.info("Fetching all schedules");
        List<ScheduleResponse> list =
                scheduleRepository.findAll()
                        .stream()
                        .map(mapper::toResponse)
                        .toList();

        return ApiResponse.<List<ScheduleResponse>>builder()
                .success(true)
                .message("Schedules fetched successfully")
                .data(list)
                .build();
    }

    @Override
    public ApiResponse<ScheduleResponse> getScheduleById(UUID id) {
        log.info(
        "Fetching schedule {}",
        id);
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Schedule not found"));

        return ApiResponse.<ScheduleResponse>builder()
                .success(true)
                .message("Schedule fetched successfully")
                .data(mapper.toResponse(schedule))
                .build();
    }
}