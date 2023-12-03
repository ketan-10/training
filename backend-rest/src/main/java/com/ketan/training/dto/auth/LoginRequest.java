package com.ketan.training.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record LoginRequest(@Email(message = "Invalid email address") String email,
        @Size(min = 3, max = 20, message = "Password must be between 8 and 20 characters") String password) {
}