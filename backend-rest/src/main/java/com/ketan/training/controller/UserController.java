package com.ketan.training.controller;

import java.security.Principal;
import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ketan.training.dto.user.UserCreateDto;
import com.ketan.training.dto.user.UserDto;
import com.ketan.training.dto.user.UserUpdateDto;
import com.ketan.training.entity.User;
import com.ketan.training.entity.enums.UserRole;
import com.ketan.training.service.UserService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private UserService userService;

    @PutMapping("/change-password")
    public ResponseEntity<UserDto> changePassword(@RequestParam("currentPassword") String currentPassword,
            @RequestParam("newPassword") String newPassword, Principal principal) {

        String userEmail = principal.getName();
        UserDto userDto = userService.changePassword(userEmail, currentPassword, newPassword);
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/generate-new-password/{userId}")
    @PreAuthorize(UserRole.Authority.ADMIN)
    public ResponseEntity<String> generateNewPassword(@PathVariable("userId") Long userId) {
        String password = userService.generateNewPassword(userId);
        return new ResponseEntity<>(password, HttpStatus.OK);
    }

    @PutMapping("/approve-registration/{userId}")
    @PreAuthorize(UserRole.Authority.ADMIN)
    public ResponseEntity<UserDto> approveRegistration(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(userService.approveRegistration(userId));
    }

    @PutMapping("/reject-registration/{userId}")
    @PreAuthorize(UserRole.Authority.ADMIN)
    public ResponseEntity<UserDto> rejectRegistration(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(userService.rejectRegistration(userId));
    }

    @PostMapping
    @PreAuthorize(UserRole.Authority.ADMIN)
    public ResponseEntity<?> createUser(@Valid @RequestBody UserCreateDto userCreate) {
        if (userService.isEmailPresent(userCreate.email())) {
            return new ResponseEntity<>("User already exists", HttpStatus.FOUND);
        }
        UserDto savedUser = userService.createUser(userCreate);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    // build get user by id REST API
    @GetMapping("{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("id") Long userId) {
        UserDto user = userService.getUserById(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PutMapping("{id}")
    @PreAuthorize(UserRole.Authority.ADMIN)
    public ResponseEntity<UserDto> updateUser(@PathVariable("id") Long userId,
            @RequestBody UserUpdateDto userUpdateDto) {
        UserDto user = userService.updateUser(userId, userUpdateDto);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    @PreAuthorize(UserRole.Authority.ADMIN)
    public ResponseEntity<String> deleteUser(@PathVariable("id") Long userId) {
        userService.deleteUser(userId);
        return new ResponseEntity<>("User successfully deleted!", HttpStatus.OK);
    }

    @GetMapping("/me")
    public UserDto getLoggedUser() {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return new UserDto(loggedInUser);

    }
}
