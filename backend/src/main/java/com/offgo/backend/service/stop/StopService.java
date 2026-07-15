package com.offgo.backend.service.stop;

import java.util.List;
import java.util.UUID;

import com.offgo.backend.dto.request.stop.CreateStopRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.stop.StopResponse;

public interface StopService {

    ApiResponse<StopResponse> createStop(CreateStopRequest request);

    ApiResponse<List<StopResponse>> getAllStops();

    ApiResponse<StopResponse> getStopById(UUID id);

}