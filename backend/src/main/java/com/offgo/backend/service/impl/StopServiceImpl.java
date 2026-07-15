package com.offgo.backend.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.offgo.backend.dto.request.stop.CreateStopRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.stop.StopResponse;
import com.offgo.backend.entity.Stop;
import com.offgo.backend.exception.ResourceNotFoundException;
import com.offgo.backend.mapper.StopMapper;
import com.offgo.backend.repository.StopRepository;
import com.offgo.backend.service.stop.StopService;
import com.offgo.backend.validator.StopValidator;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
@Slf4j
@Service
@RequiredArgsConstructor
public class StopServiceImpl implements StopService {

    private final StopRepository stopRepository;
    private final StopMapper stopMapper;
    private final StopValidator stopValidator;

    @Override
    public ApiResponse<StopResponse> createStop(CreateStopRequest request) {

        stopValidator.validateCreate(request);
        log.info("Creating stop {}", request.getStopCode());
        Stop stop = stopMapper.toEntity(request);

        Stop savedStop = stopRepository.save(stop);
        log.info("Stop saved {}", savedStop.getId());

        return ApiResponse.<StopResponse>builder()
                .success(true)
                .message("Stop created successfully")
                .data(stopMapper.toResponse(savedStop))
                .build();
    }

    @Override
    public ApiResponse<List<StopResponse>> getAllStops() {
        log.info("Fetching all stops");
        List<StopResponse> stops = stopRepository.findAll()
                .stream()
                .map(stopMapper::toResponse)
                .toList();

        return ApiResponse.<List<StopResponse>>builder()
                .success(true)
                .message("Stops fetched successfully")
                .data(stops)
                .build();
    }

    @Override
    public ApiResponse<StopResponse> getStopById(UUID id) {
        log.info("Fetching stop {}", id);
        Stop stop = stopRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Stop not found"));

        return ApiResponse.<StopResponse>builder()
                .success(true)
                .message("Stop fetched successfully")
                .data(stopMapper.toResponse(stop))
                .build();
    }
}