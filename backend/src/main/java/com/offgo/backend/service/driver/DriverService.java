package com.offgo.backend.service.driver;

import java.util.List;
import java.util.UUID;

import com.offgo.backend.dto.request.driver.CreateDriverRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.driver.DriverResponse;

public interface DriverService {

    ApiResponse<DriverResponse> createDriver(
            CreateDriverRequest request);

    ApiResponse<List<DriverResponse>> getAllDrivers();

    ApiResponse<DriverResponse> getDriverById(UUID id);

    ApiResponse<DriverResponse> updateDriver(UUID id, CreateDriverRequest request);

    ApiResponse<DriverResponse> assignShuttle(UUID id, UUID shuttleId);

    ApiResponse<DriverResponse> startNavigation(UUID id);

    ApiResponse<DriverResponse> stopNavigation(UUID id);

    void deleteDriver(UUID id);

}