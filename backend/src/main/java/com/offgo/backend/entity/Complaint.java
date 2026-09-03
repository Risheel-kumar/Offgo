package com.offgo.backend.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.offgo.backend.enums.ComplaintCategory;
import com.offgo.backend.enums.ComplaintPriority;
import com.offgo.backend.enums.ComplaintStatus;
import com.offgo.backend.enums.Role;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "complaints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 30)
    private String complaintRef;

    @Column(nullable = false)
    private String subject;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ComplaintStatus status = ComplaintStatus.PENDING;

    @Column(nullable = false, length = 4000)
    private String description;

    @Column(nullable = false)
    private String raisedBy;

    @Column(nullable = false)
    private UUID raisedById;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column
    private String department;

    @Column
    private String vehicleNumber;

    @Column
    private String routeName;

    @Column
    private String assignedTo;

    @Column(length = 2000)
    private String adminResponse;

    @Column(length = 2000)
    private String adminNotes;

    @Column
    private String attachmentName;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "complaint_timeline", joinColumns = @JoinColumn(name = "complaint_id"))
    @Builder.Default
    private List<ComplaintTimelineItem> timeline = new ArrayList<>();
}
