package com.offgo.backend.validator;

import org.springframework.stereotype.Component;

import com.offgo.backend.dto.request.shuttle.CreateShuttleRequest;
import com.offgo.backend.dto.request.shuttle.UpdateShuttleRequest;
import com.offgo.backend.entity.Shuttle;
import com.offgo.backend.exception.DuplicateResourceException;
import com.offgo.backend.repository.ShuttleRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ShuttleValidator {

    private final ShuttleRepository shuttleRepository;

    public void validateCreate(CreateShuttleRequest request) {

        if (shuttleRepository.existsByVehicleNumber(
                request.getVehicleNumber())) {

            throw new DuplicateResourceException(
                    "Vehicle number already exists.");
        }

    }

    public void validateUpdate(
            Shuttle shuttle,
            UpdateShuttleRequest request) {

        shuttleRepository
                .findByVehicleNumber(request.getVehicleNumber())
                .ifPresent(existing -> {

                    if (!existing.getId().equals(shuttle.getId())) {

                        throw new DuplicateResourceException(
                                "Vehicle number already exists.");

                    }
                });
    }

}