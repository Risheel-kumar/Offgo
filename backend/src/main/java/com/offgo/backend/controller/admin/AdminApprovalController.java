package com.offgo.backend.controller.admin;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.admin.UserApprovalResponse;
import com.offgo.backend.entity.Employee;
import com.offgo.backend.entity.User;
import com.offgo.backend.enums.Department;
import com.offgo.backend.enums.Role;
import com.offgo.backend.enums.UserStatus;
import com.offgo.backend.repository.EmployeeRepository;
import com.offgo.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/approvals")
@RequiredArgsConstructor
public class AdminApprovalController {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserApprovalResponse>>> getApprovalRequests(
            @RequestParam(required = false) String roleFilter,
            @RequestParam(required = false) String statusFilter) {

        List<User> users = userRepository.findAll();

        List<UserApprovalResponse> list = users.stream()
                .filter(u -> statusFilter == null || "ALL".equalsIgnoreCase(statusFilter) || u.getStatus().name().equalsIgnoreCase(statusFilter))
                .filter(u -> roleFilter == null || "ALL".equalsIgnoreCase(roleFilter) || u.getRole().name().equalsIgnoreCase(roleFilter))
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.<List<UserApprovalResponse>>builder()
                .success(true)
                .message("Approval requests loaded successfully")
                .data(list)
                .timestamp(LocalDateTime.now())
                .build());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<UserApprovalResponse>> approveUser(@PathVariable String id) {
        User user = findUserByIdOrString(id);
        user.setStatus(UserStatus.ACTIVE);
        user.setActive(true);
        user.setEnabled(true);
        userRepository.save(user);

        if (user.getRole() == Role.EMPLOYEE && !employeeRepository.existsByEmail(user.getEmail())) {
            employeeRepository.save(Employee.builder()
                .employeeCode(user.getEmployeeId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .department(toDepartment(user.getDepartment()))
                .active(true)
                .build());
        }

        UserApprovalResponse resp = mapToResponse(user);
        resp.setStatus("APPROVED");
        resp.setReviewedBy("Admin System");
        resp.setReviewedAt(LocalDateTime.now().toString());

        return ResponseEntity.ok(ApiResponse.<UserApprovalResponse>builder()
                .success(true)
                .message("User approved successfully")
                .data(resp)
                .timestamp(LocalDateTime.now())
                .build());
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<UserApprovalResponse>> rejectUser(
            @PathVariable String id,
            @RequestBody(required = false) java.util.Map<String, String> body) {

        User user = findUserByIdOrString(id);
        user.setStatus(UserStatus.REJECTED);
        userRepository.save(user);

        String reason = body != null ? body.get("reason") : "Registration request declined by administrator.";

        UserApprovalResponse resp = mapToResponse(user);
        resp.setStatus("REJECTED");
        resp.setRejectionReason(reason);
        resp.setReviewedBy("Admin System");
        resp.setReviewedAt(LocalDateTime.now().toString());

        return ResponseEntity.ok(ApiResponse.<UserApprovalResponse>builder()
                .success(true)
                .message("User rejected successfully")
                .data(resp)
                .timestamp(LocalDateTime.now())
                .build());
    }

    private User findUserByIdOrString(String idStr) {
        try {
            UUID uuid = UUID.fromString(idStr);
            return userRepository.findById(uuid)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + idStr));
        } catch (IllegalArgumentException e) {
            return userRepository.findAll().stream()
                    .filter(u -> idStr.equalsIgnoreCase(u.getEmployeeId()) || idStr.equalsIgnoreCase(u.getEmail()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("User not found with identifier: " + idStr));
        }
    }

    private Department toDepartment(String department) {
        try {
            return Department.valueOf(department.trim().toUpperCase().replace(' ', '_'));
        } catch (IllegalArgumentException | NullPointerException e) {
            return Department.OPERATIONS;
        }
    }

    private UserApprovalResponse mapToResponse(User u) {
        return UserApprovalResponse.builder()
                .id(u.getId() != null ? u.getId().toString() : u.getEmployeeId())
                .userId(u.getId() != null ? u.getId().toString() : u.getEmployeeId())
                .fullName(u.getFirstName() + " " + u.getLastName())
                .email(u.getEmail())
                .phone(u.getPhoneNumber() != null ? u.getPhoneNumber() : "+1 (555) 000-0000")
                .role(u.getRole() != null ? u.getRole().name() : "EMPLOYEE")
                .department(u.getDepartment() != null ? u.getDepartment() : "Corporate Operations")
                .employeeIdOrDriverId(u.getEmployeeId() != null ? u.getEmployeeId() : "EMP-0000")
                .registrationDate(u.getCreatedAt() != null ? u.getCreatedAt().toString() : "2026-08-10 10:00 AM")
                .status(u.getStatus() == UserStatus.ACTIVE ? "APPROVED" :
                    u.getStatus() != null ? u.getStatus().name() : "PENDING")
                .build();
    }
}
