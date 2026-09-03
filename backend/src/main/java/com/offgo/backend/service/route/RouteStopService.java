package com.offgo.backend.service.route;

import java.util.List;
import java.util.UUID;

import com.offgo.backend.dto.request.route.AssignStopRequest;
import com.offgo.backend.dto.request.route.ReorderRouteStopsRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.route.RouteStopResponse;

public interface RouteStopService {

    ApiResponse<RouteStopResponse> assignStop(
            UUID routeId,
            AssignStopRequest request);

    ApiResponse<List<RouteStopResponse>> getStopsOfRoute(
            UUID routeId);

    ApiResponse<List<RouteStopResponse>> reorderStops(
            UUID routeId,
            ReorderRouteStopsRequest request);

        void removeStop(UUID routeId, UUID stopId);

}