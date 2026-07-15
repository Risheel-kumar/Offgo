package com.offgo.backend.service.route;

import java.util.List;
import java.util.UUID;

import com.offgo.backend.dto.request.route.CreateRouteRequest;
import com.offgo.backend.dto.request.route.UpdateRouteRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.route.RouteResponse;

public interface RouteService {

    ApiResponse<RouteResponse> createRoute(CreateRouteRequest request);

    ApiResponse<List<RouteResponse>> getAllRoutes();

    ApiResponse<RouteResponse> getRouteById(UUID id);

    ApiResponse<RouteResponse> updateRoute(
            UUID id,
            UpdateRouteRequest request);

    ApiResponse<String> deleteRoute(UUID id);

}