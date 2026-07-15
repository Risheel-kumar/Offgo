package com.offgo.backend.validator;

import org.springframework.stereotype.Component;

import com.offgo.backend.dto.request.driver.CreateDriverRequest;
import com.offgo.backend.exception.DuplicateResourceException;
import com.offgo.backend.repository.DriverRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DriverValidator {

    private final DriverRepository driverRepository;

    public void validateCreate(CreateDriverRequest request) {

        if (driverRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new DuplicateResourceException(
                    "Employee ID already exists.");
        }

        if (driverRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Email already exists.");
        }

        if (driverRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicateResourceException(
                    "Phone number already exists.");
        }

        if (driverRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new DuplicateResourceException(
                    "License number already exists.");
        }

    }

}