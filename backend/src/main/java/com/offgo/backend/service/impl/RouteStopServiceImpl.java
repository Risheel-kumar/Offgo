package com.offgo.backend.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.offgo.backend.dto.request.route.AssignStopRequest;
import com.offgo.backend.dto.request.route.ReorderRouteStopsRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.route.RouteStopResponse;
import com.offgo.backend.entity.Route;
import com.offgo.backend.entity.RouteStop;
import com.offgo.backend.entity.Stop;
import com.offgo.backend.exception.ResourceNotFoundException;
import com.offgo.backend.mapper.RouteStopMapper;
import com.offgo.backend.repository.RouteRepository;
import com.offgo.backend.repository.RouteStopRepository;
import com.offgo.backend.repository.StopRepository;
import com.offgo.backend.service.route.RouteStopService;
import com.offgo.backend.validator.RouteStopValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
@RequiredArgsConstructor
public class RouteStopServiceImpl implements RouteStopService {

    private final RouteRepository routeRepository;
    private final StopRepository stopRepository;
    private final RouteStopRepository routeStopRepository;
    private final RouteStopMapper routeStopMapper;
    private final RouteStopValidator validator;

    @Override
        @Transactional
    public ApiResponse<RouteStopResponse> assignStop(
            UUID routeId,
            AssignStopRequest request) {
        log.info(
        "Adding stop to route");
        validator.validateAssignment(routeId, request.getStopId());

        Route route = routeRepository.findById(routeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Route not found"));
        log.info(
        "Route {} selected",
        route.getRouteCode());
        Stop stop = stopRepository.findById(request.getStopId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Stop not found"));
        log.info(
        "Stop {} selected",
        stop.getStopCode());
        RouteStop routeStop = RouteStop.builder()
                .route(route)
                .stop(stop)
                .stopOrder(request.getStopOrder())
                .estimatedArrivalOffsetMinutes(
                        request.getEstimatedArrivalOffsetMinutes())
                .build();

        routeStop = routeStopRepository.save(routeStop);
        log.info(
        "Route stop added");
        return ApiResponse.<RouteStopResponse>builder()
                .success(true)
                .message("Stop assigned successfully")
                .data(routeStopMapper.toResponse(routeStop))
                .build();
    }

    @Override
        @Transactional(readOnly = true)
    public ApiResponse<List<RouteStopResponse>> getStopsOfRoute(
            UUID routeId) {
        log.info(
        "Fetching stops for route {}",
        routeId);
        List<RouteStopResponse> responses =
                routeStopRepository.findByRouteIdOrderByStopOrderAsc(routeId)
                        .stream()
                        .map(routeStopMapper::toResponse)
                        .toList();

        return ApiResponse.<List<RouteStopResponse>>builder()
                .success(true)
                .message("Stops fetched successfully")
                .data(responses)
                .build();
    }

    @Override
    @Transactional
    public ApiResponse<List<RouteStopResponse>> reorderStops(
            UUID routeId,
            ReorderRouteStopsRequest request) {
        List<RouteStop> currentStops = routeStopRepository.findByRouteIdOrderByStopOrderAsc(routeId);
        if (currentStops.size() != request.getStopIdsInOrder().size()
                || currentStops.stream().map(stop -> stop.getStop().getId()).distinct().count() != request.getStopIdsInOrder().stream().distinct().count()
                || !currentStops.stream().allMatch(stop -> request.getStopIdsInOrder().contains(stop.getStop().getId()))) {
            throw new IllegalArgumentException("Reorder request must contain every stop assigned to this route exactly once");
        }

        for (int index = 0; index < request.getStopIdsInOrder().size(); index++) {
            UUID stopId = request.getStopIdsInOrder().get(index);
            RouteStop routeStop = routeStopRepository.findByRouteIdAndStopId(routeId, stopId)
                    .orElseThrow(() -> new ResourceNotFoundException("Stop is not assigned to this route"));
            routeStop.setStopOrder(index + 1);
            routeStopRepository.save(routeStop);
        }

        List<RouteStopResponse> responses = routeStopRepository.findByRouteIdOrderByStopOrderAsc(routeId)
                .stream().map(routeStopMapper::toResponse).toList();
        return ApiResponse.<List<RouteStopResponse>>builder()
                .success(true)
                .message("Stops reordered successfully")
                .data(responses)
                .build();
    }

        @Override
        @Transactional
        public void removeStop(UUID routeId, UUID stopId) {
                if (!routeStopRepository.existsByRouteIdAndStopId(routeId, stopId)) {
                        throw new ResourceNotFoundException("Stop is not assigned to this route");
                }
                routeStopRepository.deleteByRouteIdAndStopId(routeId, stopId);
        }

}