package com.offgo.backend.dto.response.driver;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import com.offgo.backend.enums.DriverStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DriverResponse {

    private UUID id;

    private String employeeId;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private String licenseNumber;

    private LocalDate licenseExpiry;

    private Integer experience;

    private DriverStatus status;

    private boolean active;

    private UUID shuttleId;

    private String shuttleNumber;

    private LocalDateTime createdAt;

}