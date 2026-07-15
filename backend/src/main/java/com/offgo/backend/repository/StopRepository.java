package com.offgo.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.offgo.backend.entity.Stop;

public interface StopRepository extends JpaRepository<Stop, UUID> {

    boolean existsByStopCode(String stopCode);

    Optional<Stop> findByStopCode(String stopCode);

}