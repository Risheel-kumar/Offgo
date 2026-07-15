package com.offgo.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.offgo.backend.entity.Route;

public interface RouteRepository extends JpaRepository<Route, UUID> {

    boolean existsByRouteCode(String routeCode);

    Optional<Route> findByRouteCode(String routeCode);

}