package com.offgo.backend.controller.driver;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.offgo.backend.constants.AppConstants;
import com.offgo.backend.dto.request.driver.CreateDriverRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.driver.DriverResponse;
import com.offgo.backend.service.driver.DriverService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(AppConstants.API_BASE + "/drivers")
public class DriverController {

    private final DriverService driverService;

    @PostMapping
    public ResponseEntity<ApiResponse<DriverResponse>> createDriver(
            @Valid @RequestBody CreateDriverRequest request) {

        return ResponseEntity.ok(driverService.createDriver(request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DriverResponse>>> getAllDrivers() {

        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DriverResponse>> getDriverById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(driverService.getDriverById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DriverResponse>> updateDriver(@PathVariable UUID id, @Valid @RequestBody CreateDriverRequest request) {
        return ResponseEntity.ok(driverService.updateDriver(id, request));
    }

    @PatchMapping("/{id}/assignment")
    public ResponseEntity<ApiResponse<DriverResponse>> assignShuttle(@PathVariable UUID id, @RequestParam(required = false) UUID shuttleId) {
        return ResponseEntity.ok(driverService.assignShuttle(id, shuttleId));
    }

    @PostMapping("/{id}/navigation/start")
    public ResponseEntity<ApiResponse<DriverResponse>> startNavigation(@PathVariable UUID id) {
        return ResponseEntity.ok(driverService.startNavigation(id));
    }

    @PostMapping("/{id}/navigation/stop")
    public ResponseEntity<ApiResponse<DriverResponse>> stopNavigation(@PathVariable UUID id) {
        return ResponseEntity.ok(driverService.stopNavigation(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable UUID id) {
        driverService.deleteDriver(id);
        return ResponseEntity.noContent().build();
    }

}