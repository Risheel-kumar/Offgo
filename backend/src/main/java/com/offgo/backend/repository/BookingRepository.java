package com.offgo.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.offgo.backend.entity.Booking;
import com.offgo.backend.enums.BookingStatus;

public interface BookingRepository
        extends JpaRepository<Booking, UUID> {

    List<Booking> findByScheduleId(UUID scheduleId);
    Optional<Booking> findByQrToken(String qrToken);
    List<Booking> findByEmployeeId(UUID employeeId);
    
    long countByScheduleId(UUID scheduleId);

    boolean existsByEmployeeIdAndScheduleIdAndStatusNot(
            UUID employeeId,
            UUID scheduleId,
            BookingStatus status);

    List<Booking> findByScheduleIdAndStatus(
            UUID scheduleId,
            BookingStatus status);

        Optional<Booking> findFirstByEmployeeIdOrderByCreatedAtDesc(UUID employeeId);
        long countByStatus(BookingStatus status);

}