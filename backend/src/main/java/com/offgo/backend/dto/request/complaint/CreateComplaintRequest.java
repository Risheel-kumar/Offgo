package com.offgo.backend.dto.request.complaint;

import com.offgo.backend.enums.ComplaintCategory;
import com.offgo.backend.enums.ComplaintPriority;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateComplaintRequest {

    @NotBlank
    private String subject;

    @NotNull
    private ComplaintCategory category;

    @NotNull
    private ComplaintPriority priority;

    @NotBlank
    @Size(max = 4000)
    private String description;

    private String attachmentName;
}
