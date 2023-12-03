package com.ketan.training.dto.user;

import java.util.Date;

import com.ketan.training.entity.User;
import com.ketan.training.entity.enums.UserRole;
import com.ketan.training.entity.enums.UserStatus;

public record UserDto(Long id, String name, String email, UserRole role, UserStatus userStatus, Date createdAt,
        Date updatedAt) {
    public UserDto(User user) {
        this(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getUserStatus(), user.getCreatedAt(),
                user.getUpdatedAt());
    }
}
