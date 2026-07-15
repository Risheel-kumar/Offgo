package com.offgo.backend.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.offgo.backend.dto.request.route.AssignStopRequest;
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
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
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

}