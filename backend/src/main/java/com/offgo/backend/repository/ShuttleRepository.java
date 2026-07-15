package com.offgo.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.offgo.backend.entity.Shuttle;

public interface ShuttleRepository extends JpaRepository<Shuttle, UUID> {

    boolean existsByVehicleNumber(String vehicleNumber);

    Optional<Shuttle> findByVehicleNumber(String vehicleNumber);
    long countByActiveTrue();

}