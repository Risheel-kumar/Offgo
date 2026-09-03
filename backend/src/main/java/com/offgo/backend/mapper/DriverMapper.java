package com.offgo.backend.mapper;

import org.springframework.stereotype.Component;

import com.offgo.backend.dto.request.driver.CreateDriverRequest;
import com.offgo.backend.dto.response.driver.DriverResponse;
import com.offgo.backend.entity.Driver;

@Component
public class DriverMapper {

    public Driver toEntity(CreateDriverRequest request) {

        return Driver.builder()
                .employeeId(request.getEmployeeId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .licenseNumber(request.getLicenseNumber())
                .licenseExpiry(request.getLicenseExpiry())
                .experience(request.getExperience())
                .build();

    }

    public DriverResponse toResponse(Driver driver) {

        return DriverResponse.builder()
                .id(driver.getId())
                .employeeId(driver.getEmployeeId())
                .firstName(driver.getFirstName())
                .lastName(driver.getLastName())
                .email(driver.getEmail())
                .phoneNumber(driver.getPhoneNumber())
                .licenseNumber(driver.getLicenseNumber())
                .licenseExpiry(driver.getLicenseExpiry())
                .experience(driver.getExperience())
                .status(driver.getStatus())
                .active(driver.isActive())
                .shuttleId(driver.getShuttle() != null ? driver.getShuttle().getId() : null)
                .shuttleNumber(driver.getShuttle() != null ? driver.getShuttle().getVehicleNumber() : null)
                .createdAt(driver.getCreatedAt())
                .build();

    }

}