package com.offgo.backend.dto.response.complaint;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.offgo.backend.entity.ComplaintTimelineItem;
import com.offgo.backend.enums.ComplaintCategory;
import com.offgo.backend.enums.ComplaintPriority;
import com.offgo.backend.enums.ComplaintStatus;
import com.offgo.backend.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintResponse {

    private UUID id;

    private String complaintRef;

    private String subject;

    private ComplaintCategory category;

    private ComplaintPriority priority;

    private ComplaintStatus status;

    private String description;

    private String raisedBy;

    private UUID raisedById;

    private Role role;

    private String department;

    private String vehicleNumber;

    private String routeName;

    private String assignedTo;

    private String adminResponse;

    private String adminNotes;

    private String attachmentName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<ComplaintTimelineItem> timeline;
}
