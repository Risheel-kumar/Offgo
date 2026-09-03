package com.offgo.backend.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.offgo.backend.dto.request.employee.CreateEmployeeRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.employee.EmployeeResponse;
import com.offgo.backend.entity.Employee;
import com.offgo.backend.exception.ResourceNotFoundException;
import com.offgo.backend.mapper.EmployeeMapper;
import com.offgo.backend.repository.EmployeeRepository;
import com.offgo.backend.service.employee.EmployeeService;
import com.offgo.backend.validator.EmployeeValidator;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;
    private final EmployeeValidator employeeValidator;

    @Override
    public ApiResponse<EmployeeResponse> createEmployee(CreateEmployeeRequest request) {

        employeeValidator.validate(request);
        log.info("Creating employee: {}", request.getEmployeeCode());
        Employee employee = employeeMapper.toEntity(request);

        employee = employeeRepository.save(employee);
        log.info("Employee saved with ID {}", employee.getId());
        return ApiResponse.<EmployeeResponse>builder()
                .success(true)
                .message("Employee created successfully")
                .data(employeeMapper.toResponse(employee))
                .build();
    }

    @Override
    public ApiResponse<List<EmployeeResponse>> getAllEmployees() {
        log.info("Fetching all employees");
        List<EmployeeResponse> employees = employeeRepository.findAll()
                .stream()
                .filter(Employee::isActive)
                .map(employeeMapper::toResponse)
                .toList();

        return ApiResponse.<List<EmployeeResponse>>builder()
                .success(true)
                .message("Employees fetched successfully")
                .data(employees)
                .build();
    }

    @Override
    public ApiResponse<EmployeeResponse> getEmployeeById(UUID id) {
        log.info("Fetching employee {}", id);
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        return ApiResponse.<EmployeeResponse>builder()
                .success(true)
                .message("Employee fetched successfully")
                .data(employeeMapper.toResponse(employee))
                .build();
    }

    @Override
    public ApiResponse<String> deleteEmployee(UUID id) {
        log.info("Deactivating employee {}", id);
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        employee.setActive(false);

        employeeRepository.save(employee);

        return ApiResponse.<String>builder()
                .success(true)
                .message("Employee deactivated successfully")
                .data("SUCCESS")
                .build();
    }
}