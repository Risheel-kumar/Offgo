package com.offgo.backend.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.offgo.backend.entity.Schedule;
import com.offgo.backend.enums.ScheduleStatus;

public interface ScheduleRepository
        extends JpaRepository<Schedule, UUID> {

    List<Schedule> findByDriverId(UUID driverId);

    List<Schedule> findByShuttleId(UUID shuttleId);

    List<Schedule> findByRouteId(UUID routeId);

    Optional<Schedule>
    findFirstByShuttleIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            UUID shuttleId,
            ScheduleStatus status,
            LocalDate startDate,
        LocalDate endDate);
}