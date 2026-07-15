package com.offgo.backend.service.eta;

import java.util.UUID;

import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.tracking.ETAResponse;

public interface ETAService {

    ApiResponse<ETAResponse> calculateETA(UUID shuttleId);

}