package com.offgo.backend.service.tracking;

import java.util.UUID;
import java.util.List;
import com.offgo.backend.dto.response.tracking.LiveFleetLocationResponse;
import com.offgo.backend.dto.response.tracking.LocationHistoryResponse;
import com.offgo.backend.dto.response.tracking.RouteProgressResponse;
import com.offgo.backend.dto.request.location.UpdateLocationRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.location.LocationResponse;
import com.offgo.backend.dto.response.tracking.CurrentStopResponse;
import com.offgo.backend.dto.response.tracking.ETAResponse;
import com.offgo.backend.dto.response.tracking.LiveFleetLocationResponse;
import com.offgo.backend.dto.response.tracking.LocationHistoryResponse;
import com.offgo.backend.dto.response.tracking.UpdateLocationResponse;

public interface TrackingService {
    ApiResponse<CurrentStopResponse> getCurrentStop(UUID shuttleId);
    ApiResponse<UpdateLocationResponse> updateLocation(
        UUID shuttleId,
        UpdateLocationRequest request);

    ApiResponse<LocationResponse> getLocation(
            UUID shuttleId);

    ApiResponse<ETAResponse> getETA(UUID shuttleId);

    ApiResponse<List<LocationHistoryResponse>>
    getLocationHistory(UUID shuttleId);

        ApiResponse<RouteProgressResponse>
        getRouteProgress(UUID shuttleId);

        ApiResponse<List<LiveFleetLocationResponse>>
        getLiveFleetLocations();

}