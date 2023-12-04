package com.ketan.training.dto.auth;

import com.ketan.training.dto.user.UserDto;

public record AuthenticationResponse(String token, UserDto userDto) {
}
