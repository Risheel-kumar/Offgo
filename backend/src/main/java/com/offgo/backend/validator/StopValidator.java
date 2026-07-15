package com.offgo.backend.validator;

import org.springframework.stereotype.Component;

import com.offgo.backend.dto.request.stop.CreateStopRequest;
import com.offgo.backend.exception.DuplicateResourceException;
import com.offgo.backend.repository.StopRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class StopValidator {

    private final StopRepository stopRepository;

    public void validateCreate(CreateStopRequest request) {

        if (stopRepository.existsByStopCode(request.getStopCode())) {

            throw new DuplicateResourceException(
                    "Stop code already exists.");

        }

    }

}