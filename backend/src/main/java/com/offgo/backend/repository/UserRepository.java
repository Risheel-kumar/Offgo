package com.offgo.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.offgo.backend.entity.User;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    boolean existsByEmployeeId(String employeeId);
    boolean existsByPhoneNumber(String phoneNumber);

}