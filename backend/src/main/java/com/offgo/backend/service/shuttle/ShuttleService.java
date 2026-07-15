package com.offgo.backend.service.shuttle;

import java.util.List;
import java.util.UUID;

import com.offgo.backend.dto.request.shuttle.CreateShuttleRequest;
import com.offgo.backend.dto.request.shuttle.UpdateShuttleRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.shuttle.ShuttleResponse;

public interface ShuttleService {

    ApiResponse<ShuttleResponse> createShuttle(
            CreateShuttleRequest request);

    ApiResponse<List<ShuttleResponse>> getAllShuttles();

    ApiResponse<ShuttleResponse> getShuttleById(UUID id);

    ApiResponse<ShuttleResponse> updateShuttle(
        UUID id,
        UpdateShuttleRequest request);

}