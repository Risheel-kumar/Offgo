package com.offgo.backend.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.offgo.backend.dto.request.shuttle.CreateShuttleRequest;
import com.offgo.backend.dto.request.shuttle.UpdateShuttleRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.shuttle.ShuttleResponse;
import com.offgo.backend.entity.Shuttle;
import com.offgo.backend.exception.ResourceNotFoundException;
import com.offgo.backend.mapper.ShuttleMapper;
import com.offgo.backend.repository.ShuttleRepository;
import com.offgo.backend.service.shuttle.ShuttleService;
import com.offgo.backend.validator.ShuttleValidator;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
@Slf4j
@Service
@RequiredArgsConstructor
public class ShuttleServiceImpl implements ShuttleService {

    private final ShuttleRepository shuttleRepository;
    private final ShuttleValidator shuttleValidator;
    private final ShuttleMapper shuttleMapper;

    @Override
    public ApiResponse<ShuttleResponse> createShuttle(
            CreateShuttleRequest request) {

        shuttleValidator.validateCreate(request);
        log.info("Creating shuttle {}", request.getVehicleNumber());
        Shuttle shuttle = shuttleMapper.toEntity(request);

        Shuttle savedShuttle = shuttleRepository.save(shuttle);
        log.info("Shuttle saved {}", savedShuttle.getId());

        return ApiResponse.<ShuttleResponse>builder()
                .success(true)
                .message("Shuttle Created Successfully")
                .data(shuttleMapper.toResponse(savedShuttle))
                .build();

    }

    @Override
    public ApiResponse<List<ShuttleResponse>> getAllShuttles() {
        log.info("Fetching all shuttles");
        List<ShuttleResponse> shuttles =
                shuttleRepository.findAll()
                        .stream()
                        .map(shuttleMapper::toResponse)
                        .toList();

        return ApiResponse.<List<ShuttleResponse>>builder()
                .success(true)
                .message("Shuttles fetched successfully")
                .data(shuttles)
                .build();
    }


    @Override
    public ApiResponse<ShuttleResponse> getShuttleById(UUID id) {
        log.info("Fetching shuttle {}", id);
        Shuttle shuttle = shuttleRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Shuttle not found."));

        return ApiResponse.<ShuttleResponse>builder()
                .success(true)
                .message("Shuttle fetched successfully")
                .data(shuttleMapper.toResponse(shuttle))
                .build();
    }

    @Override
    public ApiResponse<ShuttleResponse> updateShuttle(
            UUID id,
            UpdateShuttleRequest request) {
        log.info("Updating shuttle {}", id);
        Shuttle shuttle = shuttleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Shuttle not found"));

        shuttleValidator.validateUpdate(shuttle, request);

        shuttleMapper.updateEntity(shuttle, request);

        Shuttle updated = shuttleRepository.save(shuttle);

        return ApiResponse.<ShuttleResponse>builder()
                .success(true)
                .message("Shuttle Updated Successfully")
                .data(shuttleMapper.toResponse(updated))
                .build();

    }

}