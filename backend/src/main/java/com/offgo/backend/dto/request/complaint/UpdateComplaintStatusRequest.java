package com.offgo.backend.dto.request.complaint;

import com.offgo.backend.enums.ComplaintStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateComplaintStatusRequest {

    @NotNull
    private ComplaintStatus status;

    private String adminNotes;

    private String adminResponse;

    private String assignedTo;
}
