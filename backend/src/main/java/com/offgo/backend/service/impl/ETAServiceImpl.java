package com.offgo.backend.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.offgo.backend.constants.FleetConstants;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.tracking.ETAResponse;
import com.offgo.backend.entity.RouteStop;
import com.offgo.backend.entity.Schedule;
import com.offgo.backend.entity.ShuttleLocation;
import com.offgo.backend.enums.ETAStatus;
import com.offgo.backend.enums.ScheduleStatus;
import com.offgo.backend.exception.ResourceNotFoundException;
import com.offgo.backend.repository.RouteStopRepository;
import com.offgo.backend.repository.ScheduleRepository;
import com.offgo.backend.repository.ShuttleLocationRepository;
import com.offgo.backend.service.eta.ETAService;
import com.offgo.backend.util.DistanceUtil;
import com.offgo.backend.util.ETAUtil;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;

@Slf4j
@Service
@RequiredArgsConstructor
public class ETAServiceImpl implements ETAService {

    private final ScheduleRepository scheduleRepository;
    private final RouteStopRepository routeStopRepository;
    private final ShuttleLocationRepository shuttleLocationRepository;

    @Override
    public ApiResponse<ETAResponse> calculateETA(UUID shuttleId) {
        log.info("Calculating ETA for shuttle {}", shuttleId);
        // 1. Get latest shuttle location
        ShuttleLocation currentLocation =
                shuttleLocationRepository
                        .findTopByShuttleIdOrderByRecordedAtDesc(shuttleId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Location not found"));
        log.info(
        "Current Location : {}, {}",
        currentLocation.getLatitude(),
        currentLocation.getLongitude());
        // 2. Get active schedule
        Schedule schedule =
                scheduleRepository
                        .findFirstByShuttleIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                                shuttleId,
                                ScheduleStatus.ACTIVE,
                                LocalDate.now(),
                                LocalDate.now())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("No active schedule"));
        log.info(
        "Schedule {} found",
        schedule.getId());
        // 3. Get all route stops
        List<RouteStop> routeStops =
                routeStopRepository.findByRouteIdOrderByStopOrderAsc(
                        schedule.getRoute().getId());
        log.info(
        "{} route stops loaded",
        routeStops.size());
        if (routeStops.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No stops configured for this route");
        }

        // 4. Temporary next stop (first stop)
        RouteStop nextStop = routeStops.get(0);

        // 5. Calculate remaining distance
        double remainingDistance =
                DistanceUtil.calculateDistance(
                        currentLocation.getLatitude(),
                        currentLocation.getLongitude(),
                        nextStop.getStop().getLatitude(),
                        nextStop.getStop().getLongitude());
        log.info(
        "Remaining Distance {} km",
        remainingDistance);
        // 6. Calculate ETA
        int eta =
                ETAUtil.calculateETA(
                        remainingDistance,
                        FleetConstants.CITY_AVERAGE_SPEED);
        log.info(
        "ETA {} minutes",
        eta);
        // 7. Build response
        ETAResponse response =
                ETAResponse.builder()
                        .shuttleNumber(schedule.getShuttle().getVehicleNumber())
                        .currentStop("Calculating...")
                        .nextStop(nextStop.getStop().getStopName())
                        .remainingDistanceKm(remainingDistance)
                        .estimatedArrivalMinutes(eta)
                        .averageSpeed(FleetConstants.CITY_AVERAGE_SPEED)
                        .status(ETAStatus.ON_TIME)
                        .build();

        return ApiResponse.<ETAResponse>builder()
                .success(true)
                .message("ETA calculated successfully")
                .data(response)
                .build();
    }
}