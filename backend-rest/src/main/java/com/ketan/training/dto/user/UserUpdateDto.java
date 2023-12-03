package com.ketan.training.dto.user;

import com.ketan.training.entity.User;
import com.ketan.training.entity.enums.UserRole;
import com.ketan.training.entity.enums.UserStatus;

public record UserUpdateDto(String name, String email, UserRole role, UserStatus userStatus) {

    public void mutateUser(User user) {
        user.setName(name);
        user.setEmail(email);
        user.setRole(role);
        user.setUserStatus(userStatus);
    }
}
