package com.offgo.backend.controller.dashboard;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.offgo.backend.constants.AppConstants;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.dashboard.AdminDashboardResponse;
import com.offgo.backend.dto.response.dashboard.DriverDashboardResponse;
import com.offgo.backend.dto.response.dashboard.EmployeeDashboardResponse;
import com.offgo.backend.service.dashboard.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(AppConstants.API_BASE + "/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>>
    adminDashboard() {

        return ResponseEntity.ok(
                dashboardService.getAdminDashboard());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<EmployeeDashboardResponse>>
    employeeDashboard(
            @PathVariable UUID employeeId) {

        return ResponseEntity.ok(
                dashboardService.getEmployeeDashboard(employeeId));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<ApiResponse<DriverDashboardResponse>>
    driverDashboard(
            @PathVariable UUID driverId) {

        return ResponseEntity.ok(
                dashboardService.getDriverDashboard(driverId));
    }

}