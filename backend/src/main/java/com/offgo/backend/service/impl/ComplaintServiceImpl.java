package com.offgo.backend.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.offgo.backend.dto.request.complaint.CreateComplaintRequest;
import com.offgo.backend.dto.request.complaint.UpdateComplaintStatusRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.complaint.ComplaintResponse;
import com.offgo.backend.entity.Complaint;
import com.offgo.backend.entity.ComplaintTimelineItem;
import com.offgo.backend.enums.ComplaintStatus;
import com.offgo.backend.enums.Role;
import com.offgo.backend.exception.ResourceNotFoundException;
import com.offgo.backend.repository.ComplaintRepository;
import com.offgo.backend.service.complaint.ComplaintService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;

    @Override
    public ApiResponse<ComplaintResponse> createComplaint(
            UUID raisedById,
            String raisedByName,
            Role role,
            String department,
            CreateComplaintRequest request) {

        Complaint complaint = Complaint.builder()
                .complaintRef(generateTicketRef())
                .subject(request.getSubject())
                .category(request.getCategory())
                .priority(request.getPriority())
                .status(ComplaintStatus.PENDING)
                .description(request.getDescription())
                .raisedBy(raisedByName)
                .raisedById(raisedById)
                .role(role)
                .department(department)
                .attachmentName(request.getAttachmentName())
                .timeline(new ArrayList<>())
                .build();

        ComplaintTimelineItem created = ComplaintTimelineItem.builder()
                .id("t-" + UUID.randomUUID())
                .action("Complaint Ticket Created")
                .performedBy(raisedByName)
                .role(role)
                .timestamp(LocalDateTime.now())
                .build();

        complaint.getTimeline().add(created);
        Complaint saved = complaintRepository.save(complaint);

        return ApiResponse.<ComplaintResponse>builder()
                .success(true)
                .message("Complaint created successfully")
                .data(toResponse(saved))
                .build();
    }

    @Override
    public ApiResponse<List<ComplaintResponse>> getAllComplaints() {
        List<ComplaintResponse> complaints = complaintRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();

        return ApiResponse.<List<ComplaintResponse>>builder()
                .success(true)
                .message("Complaints fetched successfully")
                .data(complaints)
                .build();
    }

    @Override
    public ApiResponse<List<ComplaintResponse>> getComplaintsByUser(UUID userId) {
        List<ComplaintResponse> complaints = complaintRepository.findByRaisedByIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();

        return ApiResponse.<List<ComplaintResponse>>builder()
                .success(true)
                .message("User complaints fetched successfully")
                .data(complaints)
                .build();
    }

    @Override
    public ApiResponse<ComplaintResponse> updateComplaintStatus(UUID complaintId, UpdateComplaintStatusRequest request, String adminUserName) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        complaint.setStatus(request.getStatus());
        if (request.getAssignedTo() != null) {
            complaint.setAssignedTo(request.getAssignedTo());
        }
        if (request.getAdminNotes() != null) {
            complaint.setAdminNotes(request.getAdminNotes());
        }
        if (request.getAdminResponse() != null) {
            complaint.setAdminResponse(request.getAdminResponse());
        }

        complaint.getTimeline().add(ComplaintTimelineItem.builder()
                .id("t-" + UUID.randomUUID())
                .action("Status changed to " + request.getStatus())
                .performedBy(adminUserName)
                .role(Role.ADMIN)
                .timestamp(LocalDateTime.now())
                .note(request.getAdminNotes() != null ? request.getAdminNotes() : request.getAdminResponse())
                .build());

        Complaint updated = complaintRepository.save(complaint);

        return ApiResponse.<ComplaintResponse>builder()
                .success(true)
                .message("Complaint status updated successfully")
                .data(toResponse(updated))
                .build();
    }

    private ComplaintResponse toResponse(Complaint complaint) {
        List<ComplaintTimelineItem> timeline = complaint.getTimeline() == null
                ? new ArrayList<>()
                : new ArrayList<>(complaint.getTimeline());

        return ComplaintResponse.builder()
                .id(complaint.getId())
                .complaintRef(complaint.getComplaintRef())
                .subject(complaint.getSubject())
                .category(complaint.getCategory())
                .priority(complaint.getPriority())
                .status(complaint.getStatus())
                .description(complaint.getDescription())
                .raisedBy(complaint.getRaisedBy())
                .raisedById(complaint.getRaisedById())
                .role(complaint.getRole())
                .department(complaint.getDepartment())
                .vehicleNumber(complaint.getVehicleNumber())
                .routeName(complaint.getRouteName())
                .assignedTo(complaint.getAssignedTo())
                .adminResponse(complaint.getAdminResponse())
                .adminNotes(complaint.getAdminNotes())
                .attachmentName(complaint.getAttachmentName())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .timeline(timeline)
                .build();
    }

    private String generateTicketRef() {
        return "TKT-" + Long.toString(System.currentTimeMillis() % 1000000L, 36).toUpperCase();
    }
}
