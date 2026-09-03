package com.offgo.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.offgo.backend.entity.RouteStop;

@Repository
public interface RouteStopRepository extends JpaRepository<RouteStop, UUID> {
    
    List<RouteStop> findByRouteIdOrderByStopOrderAsc(UUID routeId);

    boolean existsByRouteIdAndStopId(
            UUID routeId,
            UUID stopId);

    java.util.Optional<RouteStop> findByRouteIdAndStopId(UUID routeId, UUID stopId);

    @Transactional
    void deleteByRouteIdAndStopId(UUID routeId, UUID stopId);

}