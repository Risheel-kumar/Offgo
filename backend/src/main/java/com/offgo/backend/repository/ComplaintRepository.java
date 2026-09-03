package com.offgo.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.offgo.backend.entity.Complaint;

public interface ComplaintRepository extends JpaRepository<Complaint, UUID> {

    @Query("select c from Complaint c left join fetch c.timeline t order by c.createdAt desc")
    List<Complaint> findAllByOrderByCreatedAtDesc();

    @Query("select c from Complaint c left join fetch c.timeline t where c.raisedById = :raisedById order by c.createdAt desc")
    List<Complaint> findByRaisedByIdOrderByCreatedAtDesc(UUID raisedById);
}
