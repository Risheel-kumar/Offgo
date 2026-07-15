package com.offgo.backend.controller.employee;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.offgo.backend.constants.AppConstants;
import com.offgo.backend.dto.request.employee.CreateEmployeeRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.employee.EmployeeResponse;
import com.offgo.backend.service.employee.EmployeeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(AppConstants.API_BASE + "/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeResponse>> createEmployee(
            @Valid @RequestBody CreateEmployeeRequest request) {

        return ResponseEntity.ok(
                employeeService.createEmployee(request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> getAllEmployees() {

        return ResponseEntity.ok(
                employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployeeById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                employeeService.getEmployeeById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteEmployee(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                employeeService.deleteEmployee(id));
    }

}