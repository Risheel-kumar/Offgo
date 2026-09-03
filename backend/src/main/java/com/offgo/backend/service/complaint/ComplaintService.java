package com.offgo.backend.service.complaint;

import java.util.List;
import java.util.UUID;

import com.offgo.backend.dto.request.complaint.CreateComplaintRequest;
import com.offgo.backend.dto.request.complaint.UpdateComplaintStatusRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.complaint.ComplaintResponse;
import com.offgo.backend.enums.Role;

public interface ComplaintService {

    ApiResponse<ComplaintResponse> createComplaint(
            UUID raisedById,
            String raisedByName,
            Role role,
            String department,
            CreateComplaintRequest request);

    ApiResponse<List<ComplaintResponse>> getAllComplaints();

    ApiResponse<List<ComplaintResponse>> getComplaintsByUser(UUID userId);

    ApiResponse<ComplaintResponse> updateComplaintStatus(UUID complaintId, UpdateComplaintStatusRequest request, String adminUserName);
}
