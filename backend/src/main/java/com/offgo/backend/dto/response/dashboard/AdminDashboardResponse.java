package com.offgo.backend.dto.response.dashboard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardResponse {

    private long totalEmployees;

    private long totalDrivers;

    private long totalShuttles;

    private long totalRoutes;

    private long totalSchedules;

    private long totalBookings;

    private long totalAttendance;

    private long activeShuttles;

}