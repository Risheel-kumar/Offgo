package com.offgo.backend.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.LinkedHashMap;

import com.offgo.backend.dto.response.tracking.LiveFleetLocationResponse;
import com.offgo.backend.dto.response.tracking.LocationHistoryResponse;
import com.offgo.backend.dto.request.location.UpdateLocationRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.location.LocationResponse;
import com.offgo.backend.dto.response.tracking.CurrentStopResponse;
import com.offgo.backend.dto.response.tracking.ETAResponse;
import com.offgo.backend.entity.RouteStop;
import com.offgo.backend.entity.Schedule;
import com.offgo.backend.entity.Shuttle;
import com.offgo.backend.exception.ResourceNotFoundException;
import com.offgo.backend.repository.RouteStopRepository;
import com.offgo.backend.repository.ScheduleRepository;
import com.offgo.backend.repository.ShuttleLocationRepository;
import com.offgo.backend.repository.ShuttleRepository;
import com.offgo.backend.service.tracking.TrackingService;
import com.offgo.backend.service.websocket.LiveTrackingPublisher;
import com.offgo.backend.util.DistanceUtil;
import com.offgo.backend.entity.ShuttleLocation;
import com.offgo.backend.enums.ScheduleStatus;
import com.offgo.backend.dto.response.tracking.UpdateLocationResponse;
import com.offgo.backend.dto.response.websocket.LiveLocationResponse;
import com.offgo.backend.dto.response.tracking.RouteProgressResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class TrackingServiceImpl implements TrackingService {
        private final LiveTrackingPublisher liveTrackingPublisher;
    private final ShuttleRepository shuttleRepository;
        private final RouteStopRepository routeStopRepository;
private final ShuttleLocationRepository shuttleLocationRepository;


private final ScheduleRepository scheduleRepository;

private final SimpMessagingTemplate messagingTemplate;

    @Override
    public ApiResponse<UpdateLocationResponse> updateLocation(
            UUID shuttleId,
            UpdateLocationRequest request) {
        log.info(
        "Location update requested");
        Shuttle shuttle =
                shuttleRepository.findById(shuttleId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Shuttle not found"));
        log.info(
        "Shuttle {} found",
        shuttle.getVehicleNumber());
        ShuttleLocation location =
                ShuttleLocation.builder()
                        .shuttle(shuttle)
                        .latitude(request.getLatitude())
                        .longitude(request.getLongitude())
                        .speed(request.getSpeed())
                        .heading(request.getHeading())
                        .recordedAt(LocalDateTime.now())
                        .build();

        shuttleLocationRepository.save(location);
        log.info(
        "Location saved");
        liveTrackingPublisher.publish(
        LiveLocationResponse.builder()
                .shuttleId(shuttle.getId())
                .vehicleNumber(shuttle.getVehicleNumber())
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .speed(location.getSpeed())
                .heading(location.getHeading())
                .timestamp(location.getRecordedAt())
                .build());
        log.info(
        "Live location published");
        return ApiResponse.<UpdateLocationResponse>builder()
                .success(true)
                .message("Location Updated")
                .data(
                        UpdateLocationResponse.builder()
                                .shuttleId(shuttleId)
                                .latitude(location.getLatitude())
                                .longitude(location.getLongitude())
                                .speed(location.getSpeed())
                                .heading(location.getHeading())
                                .recordedAt(location.getRecordedAt())
                                .build())
                .build();

    }

    @Override
    public ApiResponse<LocationResponse> getLocation(UUID shuttleId) {

        ShuttleLocation location =
                shuttleLocationRepository
                        .findTopByShuttleIdOrderByRecordedAtDesc(shuttleId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Location not found"));

        return ApiResponse.<LocationResponse>builder()
                .success(true)
                .message("Current Location")
                .data(
                        LocationResponse.builder()
                                .shuttleNumber(
                                        location.getShuttle()
                                                .getVehicleNumber())
                                .latitude(location.getLatitude())
                                .longitude(location.getLongitude())
                                .updatedAt(location.getRecordedAt())
                                .build())
                .build();

    }

    @Override
    public ApiResponse<ETAResponse> getETA(UUID shuttleId) {

        throw new UnsupportedOperationException(
                "ETA feature is under development.");

    }

    @Override
    public ApiResponse<List<LocationHistoryResponse>>
    getLocationHistory(UUID shuttleId) {

        List<ShuttleLocation> locations =
                shuttleLocationRepository
                        .findByShuttleIdOrderByRecordedAtDesc(shuttleId);

        List<LocationHistoryResponse> response =
                locations.stream()
                        .map(location ->
                                LocationHistoryResponse.builder()
                                        .latitude(location.getLatitude())
                                        .longitude(location.getLongitude())
                                        .speed(location.getSpeed())
                                        .heading(location.getHeading())
                                        .recordedAt(location.getRecordedAt())
                                        .build())
                        .collect(Collectors.toList());

        return ApiResponse.<List<LocationHistoryResponse>>builder()
                .success(true)
                .message("Location history fetched successfully")
                .data(response)
                .build();
    }

    @Override
        public ApiResponse<RouteProgressResponse> getRouteProgress(UUID shuttleId) {

        RouteProgressResponse response =
                RouteProgressResponse.builder()
                        .currentStop("Not Calculated")
                        .nextStop("Not Calculated")
                        .currentStopOrder(0)
                        .totalStops(0)
                        .progressPercentage(0.0)
                        .remainingDistanceKm(0.0)
                        .estimatedArrivalMinutes(0)
                        .build();

        return ApiResponse.<RouteProgressResponse>builder()
                .success(true)
                .message("Route progress placeholder")
                .data(response)
                .build();
        }


        @Override
        public ApiResponse<CurrentStopResponse> getCurrentStop(UUID shuttleId) {

        ShuttleLocation location =
                shuttleLocationRepository
                        .findTopByShuttleIdOrderByRecordedAtDesc(shuttleId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Location not found"));

        Schedule schedule =
                scheduleRepository
                        .findFirstByShuttleIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                                shuttleId,
                                ScheduleStatus.ACTIVE,
                                LocalDate.now(),
                                LocalDate.now())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No active schedule"));

        List<RouteStop> stops =
                routeStopRepository
                        .findByRouteIdOrderByStopOrderAsc(
                                schedule.getRoute().getId());

        if (stops.isEmpty()) {
                throw new ResourceNotFoundException(
                        "No route stops configured");
        }

        RouteStop nearest = null;
        double minimum = Double.MAX_VALUE;

        for (RouteStop stop : stops) {

                double distance =
                        DistanceUtil.calculateDistance(
                                location.getLatitude(),
                                location.getLongitude(),
                                stop.getStop().getLatitude(),
                                stop.getStop().getLongitude());

                if (distance < minimum) {

                minimum = distance;
                nearest = stop;

                }

        }

        RouteStop nextStop = nearest;

        int index = stops.indexOf(nearest);

        if (index < stops.size() - 1) {

                nextStop = stops.get(index + 1);

        }

        CurrentStopResponse response =
                CurrentStopResponse.builder()
                        .currentStop(
                                nearest.getStop().getStopName())
                        .nextStop(
                                nextStop.getStop().getStopName())
                        .distanceToCurrentStopKm(minimum)
                        .distanceToNextStopKm(
                                nextStop == nearest ? minimum :
                                        DistanceUtil.calculateDistance(
                                                location.getLatitude(),
                                                location.getLongitude(),
                                                nextStop.getStop().getLatitude(),
                                                nextStop.getStop().getLongitude()))
                        .stopOrder(
                                nearest.getStopOrder())
                        .build();

        return ApiResponse.<CurrentStopResponse>builder()
                .success(true)
                .message("Current stop calculated successfully")
                .data(response)
                .build();
        }

        @Override
        public ApiResponse<List<LiveFleetLocationResponse>> getLiveFleetLocations() {

        List<ShuttleLocation> locations =
                shuttleLocationRepository.findAllByOrderByRecordedAtDesc();

        Map<UUID, LiveFleetLocationResponse> latestLocations =
                new LinkedHashMap<>();

        for (ShuttleLocation location : locations) {

                UUID shuttleId = location.getShuttle().getId();

                if (!latestLocations.containsKey(shuttleId)) {

                latestLocations.put(
                        shuttleId,
                        LiveFleetLocationResponse.builder()
                                .shuttleId(shuttleId)
                                .vehicleNumber(
                                        location.getShuttle().getVehicleNumber())
                                .latitude(location.getLatitude())
                                .longitude(location.getLongitude())
                                .speed(location.getSpeed())
                                .heading(location.getHeading())
                                .updatedAt(location.getRecordedAt())
                                .build()
                );

                }

        }

        return ApiResponse.<List<LiveFleetLocationResponse>>builder()
                .success(true)
                .message("Live fleet locations fetched successfully")
                .data(List.copyOf(latestLocations.values()))
                .build();
        }
}