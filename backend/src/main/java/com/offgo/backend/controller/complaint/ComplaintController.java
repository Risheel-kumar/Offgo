package com.offgo.backend.controller.complaint;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.offgo.backend.constants.AppConstants;
import com.offgo.backend.dto.request.complaint.CreateComplaintRequest;
import com.offgo.backend.dto.request.complaint.UpdateComplaintStatusRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.complaint.ComplaintResponse;
import com.offgo.backend.enums.Role;
import com.offgo.backend.service.complaint.ComplaintService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(AppConstants.API_BASE + "/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ApiResponse<ComplaintResponse>> createComplaint(
            @RequestParam UUID raisedById,
            @RequestParam String raisedByName,
            @RequestParam Role role,
            @RequestParam(required = false) String department,
            @Valid @RequestBody CreateComplaintRequest request) {

        return ResponseEntity.ok(
                complaintService.createComplaint(raisedById, raisedByName, role, department, request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getComplaintsByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(complaintService.getComplaintsByUser(userId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ComplaintResponse>> updateComplaintStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateComplaintStatusRequest request,
            @RequestParam(defaultValue = "System Administrator") String adminUserName) {

        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, request, adminUserName));
    }
}
