package com.offgo.backend.config;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BookingSchemaMigration {

    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    @SuppressWarnings("unused")
    void ensureTransportChargeColumn() {
        jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS transport_charge_inr NUMERIC(10,2)");
        jdbcTemplate.update("UPDATE bookings b SET transport_charge_inr = COALESCE(r.distance_km, 0) * 7 FROM schedules s JOIN routes r ON r.id = s.route_id WHERE b.schedule_id = s.id AND (b.transport_charge_inr IS NULL OR b.transport_charge_inr = 0)");
    }
}
