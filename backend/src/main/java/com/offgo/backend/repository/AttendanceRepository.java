package com.offgo.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.offgo.backend.entity.Attendance;
import com.offgo.backend.enums.AttendanceStatus;

public interface AttendanceRepository
        extends JpaRepository<Attendance, UUID> {

    Optional<Attendance> findByBookingId(UUID bookingId);
    long countByStatus(AttendanceStatus status);

}