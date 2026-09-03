package com.offgo.backend.dto.response.user;

import com.offgo.backend.enums.Role;
import com.offgo.backend.enums.UserStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponse {

    private String id;

    private String firstName;

    private String lastName;

    private String email;

    private String employeeId;

    private String phoneNumber;

    private String department;

    private Role role;

    private UserStatus status;

}