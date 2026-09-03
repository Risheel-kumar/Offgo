package com.offgo.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.offgo.backend.entity.Driver;

public interface DriverRepository
        extends JpaRepository<Driver, UUID> {

    boolean existsByEmployeeId(String employeeId);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByLicenseNumber(String licenseNumber);

    Optional<Driver> findByEmployeeId(String employeeId);

    Optional<Driver> findByShuttleId(UUID shuttleId);

}