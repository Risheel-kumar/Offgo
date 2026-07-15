package com.offgo.backend.repository;

import java.util.List;
import java.util.UUID;
import java.util.Optional;
import java.util.UUID;

import com.offgo.backend.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.offgo.backend.entity.Booking;
import com.offgo.backend.enums.BookingStatus;

public interface BookingRepository
        extends JpaRepository<Booking, UUID> {

    List<Booking> findByScheduleId(UUID scheduleId);
    Optional<Booking> findByQrToken(String qrToken);
    List<Booking> findByEmployeeId(UUID employeeId);
    
    long countByScheduleId(UUID scheduleId);

    boolean existsByEmployeeIdAndScheduleId(
            UUID employeeId,
            UUID scheduleId);

    List<Booking> findByScheduleIdAndStatus(
            UUID scheduleId,
            BookingStatus status);

        Optional<Booking> findFirstByEmployeeIdOrderByCreatedAtDesc(UUID employeeId);
        long countByStatus(BookingStatus status);

}