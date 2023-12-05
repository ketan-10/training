package com.ketan.training.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ketan.training.dto.auth.AuthenticationResponse;
import com.ketan.training.dto.auth.LoginRequest;
import com.ketan.training.dto.user.UserCreateDto;
import com.ketan.training.dto.user.UserDto;
import com.ketan.training.service.AuthenticationService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/forget-password-request")
    public ResponseEntity<UserDto> forgetPasswordRequest(@RequestBody String email) {
        UserDto userDto = authenticationService.forgetPasswordRequest(email);
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authenticationService.login(request));
    }

    @PostMapping("/registration-request")
    public ResponseEntity<UserDto> userRegistrationRequest(@Valid @RequestBody UserCreateDto userCreateDto) {
        return ResponseEntity.ok(authenticationService.userRegistrationRequest(userCreateDto));
    }

}
