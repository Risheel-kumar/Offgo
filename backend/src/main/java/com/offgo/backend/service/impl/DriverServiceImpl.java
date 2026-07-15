package com.offgo.backend.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.offgo.backend.dto.request.driver.CreateDriverRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.driver.DriverResponse;
import com.offgo.backend.entity.Driver;
import com.offgo.backend.exception.ResourceNotFoundException;
import com.offgo.backend.mapper.DriverMapper;
import com.offgo.backend.repository.DriverRepository;
import com.offgo.backend.service.driver.DriverService;
import com.offgo.backend.validator.DriverValidator;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;

@Slf4j
@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final DriverMapper driverMapper;
    private final DriverValidator driverValidator;

    @Override
    public ApiResponse<DriverResponse> createDriver(
            CreateDriverRequest request) {

        driverValidator.validateCreate(request);
        log.info("Creating driver {}", request.getEmployeeId());
        Driver driver = driverMapper.toEntity(request);

        Driver savedDriver = driverRepository.save(driver);
        log.info("Driver saved {}", savedDriver.getId());
        return ApiResponse.<DriverResponse>builder()
                .success(true)
                .message("Driver created successfully")
                .data(driverMapper.toResponse(savedDriver))
                .build();
    }

    @Override
    public ApiResponse<List<DriverResponse>> getAllDrivers() {
        log.info("Fetching all drivers");
        List<DriverResponse> drivers = driverRepository.findAll()
                .stream()
                .map(driverMapper::toResponse)
                .toList();

        return ApiResponse.<List<DriverResponse>>builder()
                .success(true)
                .message("Drivers fetched successfully")
                .data(drivers)
                .build();
    }

    @Override
    public ApiResponse<DriverResponse> getDriverById(UUID id) {
        log.info("Fetching driver {}", id);
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Driver not found."));

        return ApiResponse.<DriverResponse>builder()
                .success(true)
                .message("Driver fetched successfully")
                .data(driverMapper.toResponse(driver))
                .build();
    }

}