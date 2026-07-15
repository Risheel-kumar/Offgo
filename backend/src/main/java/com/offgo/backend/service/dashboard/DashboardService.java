package com.offgo.backend.service.dashboard;

import java.util.UUID;

import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.dashboard.AdminDashboardResponse;
import com.offgo.backend.dto.response.dashboard.DriverDashboardResponse;
import com.offgo.backend.dto.response.dashboard.EmployeeDashboardResponse;

public interface DashboardService {

    ApiResponse<AdminDashboardResponse> getAdminDashboard();

    ApiResponse<EmployeeDashboardResponse> getEmployeeDashboard(
            UUID employeeId);

    ApiResponse<DriverDashboardResponse> getDriverDashboard(
            UUID driverId);

}