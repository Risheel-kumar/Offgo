package com.offgo.backend.service.employee;

import java.util.List;
import java.util.UUID;

import com.offgo.backend.dto.request.employee.CreateEmployeeRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.employee.EmployeeResponse;

public interface EmployeeService {

    ApiResponse<EmployeeResponse> createEmployee(
            CreateEmployeeRequest request);

    ApiResponse<List<EmployeeResponse>> getAllEmployees();

    ApiResponse<EmployeeResponse> getEmployeeById(UUID id);

    ApiResponse<String> deleteEmployee(UUID id);
}