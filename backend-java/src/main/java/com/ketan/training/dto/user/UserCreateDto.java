package com.ketan.training.dto.user;

import com.ketan.training.entity.User;
import com.ketan.training.entity.enums.UserRole;
import com.ketan.training.entity.enums.UserStatus;

import jakarta.validation.constraints.Size;

public record UserCreateDto(String name, String email,
        @Size(min = 3, max = 20, message = "Password must be between 8 and 20 characters") String password,
        UserRole role, UserStatus userStatus) {

    public User mapUserCreateDtoToUser() {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        user.setUserStatus(userStatus);
        return user;
    }
}
