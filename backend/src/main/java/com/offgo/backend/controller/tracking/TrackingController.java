package com.offgo.backend.controller.tracking;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.offgo.backend.dto.response.tracking.CurrentStopResponse;
import com.offgo.backend.dto.response.tracking.LiveFleetLocationResponse;
import com.offgo.backend.dto.response.tracking.LocationHistoryResponse;
import com.offgo.backend.dto.response.tracking.RouteProgressResponse;
import com.offgo.backend.constants.AppConstants;
import com.offgo.backend.dto.request.location.UpdateLocationRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.location.LocationResponse;
import com.offgo.backend.dto.response.tracking.LocationHistoryResponse;
import com.offgo.backend.dto.response.tracking.UpdateLocationResponse;
import com.offgo.backend.service.tracking.TrackingService;
import com.offgo.backend.dto.response.location.LocationResponse;
import com.offgo.backend.dto.response.tracking.UpdateLocationResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(AppConstants.API_BASE + "/tracking")
public class TrackingController {

    private final TrackingService trackingService;

    @PutMapping("/{shuttleId}")
    public ResponseEntity<ApiResponse<UpdateLocationResponse>>
    updateLocation(
            @PathVariable UUID shuttleId,
            @Valid @RequestBody UpdateLocationRequest request) {

        return ResponseEntity.ok(
                trackingService.updateLocation(shuttleId, request));
    }

    @GetMapping("/live")
        public ResponseEntity<ApiResponse<List<LiveFleetLocationResponse>>> getLiveFleetLocations() {

        return ResponseEntity.ok(
                trackingService.getLiveFleetLocations());

        }

    @GetMapping("/{shuttleId}")
    public ResponseEntity<ApiResponse<LocationResponse>>
    getLocation(
            @PathVariable UUID shuttleId) {

        return ResponseEntity.ok(
                trackingService.getLocation(shuttleId));
    }

    @GetMapping("/{shuttleId}/history")
    public ResponseEntity<ApiResponse<List<LocationHistoryResponse>>>
    getHistory(
            @PathVariable UUID shuttleId) {

        return ResponseEntity.ok(
                trackingService.getLocationHistory(shuttleId));
    }

    @GetMapping("/{shuttleId}/progress")
        public ResponseEntity<ApiResponse<RouteProgressResponse>>
        getProgress(
                @PathVariable UUID shuttleId) {

        return ResponseEntity.ok(
                trackingService.getRouteProgress(shuttleId));

        }

        @GetMapping("/{shuttleId}/current-stop")
        public ResponseEntity<ApiResponse<CurrentStopResponse>>
        currentStop(
                @PathVariable UUID shuttleId){

        return ResponseEntity.ok(
                trackingService.getCurrentStop(shuttleId));

        }

}