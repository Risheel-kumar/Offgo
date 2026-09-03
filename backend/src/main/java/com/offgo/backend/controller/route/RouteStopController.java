package com.offgo.backend.controller.route;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.offgo.backend.constants.AppConstants;
import com.offgo.backend.dto.request.route.AssignStopRequest;
import com.offgo.backend.dto.request.route.ReorderRouteStopsRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.route.RouteStopResponse;
import com.offgo.backend.service.route.RouteStopService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(AppConstants.API_BASE + "/routes")
public class RouteStopController {

    private final RouteStopService routeStopService;

    @PostMapping("/{routeId}/stops")
    public ResponseEntity<ApiResponse<RouteStopResponse>> assignStop(
            @PathVariable UUID routeId,
            @Valid @RequestBody AssignStopRequest request) {

        return ResponseEntity.ok(
                routeStopService.assignStop(routeId, request));
    }

    @GetMapping("/{routeId}/stops")
    public ResponseEntity<ApiResponse<List<RouteStopResponse>>> getStops(
            @PathVariable UUID routeId) {

        return ResponseEntity.ok(
                routeStopService.getStopsOfRoute(routeId));
    }

    @PutMapping("/{routeId}/stops/reorder")
    public ResponseEntity<ApiResponse<List<RouteStopResponse>>> reorderStops(
            @PathVariable UUID routeId,
            @Valid @RequestBody ReorderRouteStopsRequest request) {
        return ResponseEntity.ok(routeStopService.reorderStops(routeId, request));
    }

    @DeleteMapping("/{routeId}/stops/{stopId}")
    public ResponseEntity<Void> removeStop(
            @PathVariable UUID routeId,
            @PathVariable UUID stopId) {
        routeStopService.removeStop(routeId, stopId);
        return ResponseEntity.noContent().build();
    }

}