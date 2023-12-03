package com.ketan.training.service;

import java.util.Optional;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ketan.training.dto.auth.AuthenticationResponse;
import com.ketan.training.dto.auth.LoginRequest;
import com.ketan.training.dto.notification.NotificationDto;
import com.ketan.training.dto.user.UserCreateDto;
import com.ketan.training.dto.user.UserDto;
import com.ketan.training.entity.User;
import com.ketan.training.entity.enums.NotificationType;
import com.ketan.training.entity.enums.UserStatus;
import com.ketan.training.events.NotificationEvent;
import com.ketan.training.exception.CustomErrors;
import com.ketan.training.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AuthenticationService {

    private UserRepository userRepository;

    private JwtService jwtService;

    private AuthenticationManager authenticationManager;

    private ApplicationEventPublisher applicationEventPublisher;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserDto userRegistrationRequest(UserCreateDto userCreateDto) {
        Optional<User> existingUser = userRepository.findByEmail(userCreateDto.email());

        if (existingUser.isPresent()) {
            switch (existingUser.get().getUserStatus()) {
            case ACTIVE -> throw new CustomErrors.BadRequestException("User already present");
            case PENDING -> throw new CustomErrors.DuplicateException("Request already pending");
            default -> throw new CustomErrors.UnauthorizedException("Unauthorized User");
            }
        }
        User user = userCreateDto.mapUserCreateDtoToUser();
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setUserStatus(UserStatus.PENDING);
        User savedUser = userRepository.save(user);

        // Trigger notification
        applicationEventPublisher.publishEvent(new NotificationEvent(this,
                NotificationDto.builder().toAdmin(true).type(NotificationType.USER_REGISTRATION)
                        .message("' " + userCreateDto.name() + " ' has requested for account registration")
                        .url("/" + userCreateDto.email()).build()));
        return new UserDto(savedUser);
    }

    public AuthenticationResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new CustomErrors.BadRequestException("User not found"));

        if (user.getUserStatus() != UserStatus.ACTIVE)
            throw new CustomErrors.UnauthorizedException("User is not active");

        authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        UserDto userDto = new UserDto(user);
        return new AuthenticationResponse(jwtService.generateToken(user), userDto);
    }

    public UserDto forgetPasswordRequest(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomErrors.BadRequestException("User not found"));
        applicationEventPublisher.publishEvent(new NotificationEvent(this, NotificationDto.builder()
                .createdBy(user.getId()).toAdmin(true).type(NotificationType.FORGET_PASSWORD)
                .message("'" + user.getName() + "' has forgotten the password, requesting to change the password")
                .url("/" + user.getId()).build()));
        return new UserDto(user);
    }

}
