package com.offgo.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.offgo.backend.entity.ShuttleLocation;

public interface ShuttleLocationRepository
        extends JpaRepository<ShuttleLocation, UUID> {

    Optional<ShuttleLocation>
    findTopByShuttleIdOrderByRecordedAtDesc(UUID shuttleId);

    List<ShuttleLocation>
    findByShuttleIdOrderByRecordedAtDesc(UUID shuttleId);

    List<ShuttleLocation> findByShuttleId(UUID shuttleId);

    List<ShuttleLocation>
    findAllByOrderByRecordedAtDesc();
}