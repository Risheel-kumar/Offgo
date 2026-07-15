package com.offgo.backend.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.offgo.backend.dto.request.route.CreateRouteRequest;
import com.offgo.backend.dto.request.route.UpdateRouteRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.route.RouteResponse;
import com.offgo.backend.entity.Route;
import com.offgo.backend.exception.ResourceNotFoundException;
import com.offgo.backend.mapper.RouteMapper;
import com.offgo.backend.repository.RouteRepository;
import com.offgo.backend.service.route.RouteService;
import com.offgo.backend.validator.RouteValidator;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
@Slf4j
@Service
@RequiredArgsConstructor
public class RouteServiceImpl implements RouteService {

    private final RouteRepository routeRepository;
    private final RouteMapper routeMapper;
    private final RouteValidator routeValidator;

    @Override
    public ApiResponse<RouteResponse> createRoute(CreateRouteRequest request) {

        routeValidator.validateCreate(request);
        log.info("Creating route {}", request.getRouteCode());
        Route route = routeMapper.toEntity(request);

        Route savedRoute = routeRepository.save(route);
        log.info("Route saved {}", savedRoute.getId());

        return ApiResponse.<RouteResponse>builder()
                .success(true)
                .message("Route created successfully")
                .data(routeMapper.toResponse(savedRoute))
                .build();
    }

    @Override
    public ApiResponse<List<RouteResponse>> getAllRoutes() {
        log.info("Fetching all routes");
        List<RouteResponse> routes = routeRepository.findAll()
                .stream()
                .filter(Route::isActive)
                .map(routeMapper::toResponse)
                .toList();

        return ApiResponse.<List<RouteResponse>>builder()
                .success(true)
                .message("Routes fetched successfully")
                .data(routes)
                .build();
    }

    @Override
    public ApiResponse<RouteResponse> getRouteById(UUID id) {
        log.info("Fetching route {}", id);
        Route route = routeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Route not found"));

        return ApiResponse.<RouteResponse>builder()
                .success(true)
                .message("Route fetched successfully")
                .data(routeMapper.toResponse(route))
                .build();
    }

    @Override
    public ApiResponse<RouteResponse> updateRoute(
            UUID id,
            UpdateRouteRequest request) {
        log.info("Updating route {}", id);
        Route route = routeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Route not found"));

        routeMapper.updateEntity(route, request);

        Route updatedRoute = routeRepository.save(route);

        return ApiResponse.<RouteResponse>builder()
                .success(true)
                .message("Route updated successfully")
                .data(routeMapper.toResponse(updatedRoute))
                .build();
    }

    @Override
    public ApiResponse<String> deleteRoute(UUID id) {
        log.info("Deleting route {}", id);
        Route route = routeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Route not found"));

        route.setActive(false);

        routeRepository.save(route);

        return ApiResponse.<String>builder()
                .success(true)
                .message("Route deleted successfully")
                .data("SUCCESS")
                .build();
    }

}