package com.ketan.training.service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ketan.training.dto.user.UserCreateDto;
import com.ketan.training.dto.user.UserDto;
import com.ketan.training.dto.user.UserUpdateDto;
import com.ketan.training.entity.User;
import com.ketan.training.entity.enums.UserStatus;
import com.ketan.training.exception.CustomErrors;
import com.ketan.training.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {

    private UserRepository userRepository;

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public boolean isEmailPresent(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isPresent();
    }

    public String generateNewPassword(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomErrors.BadRequestException("User not found"));
        String password = generateRandomString(8);
        user.setPassword(bCryptPasswordEncoder.encode(password));
        userRepository.save(user);
        return password;
    }

    public UserDto changePassword(String email, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomErrors.BadRequestException("User not found"));

        if (!bCryptPasswordEncoder.matches(currentPassword, user.getPassword())) {
            throw new CustomErrors.UnauthorizedException("Invalid current password");
        }

        user.setPassword(bCryptPasswordEncoder.encode(newPassword));
        User savedUser = userRepository.save(user);

        return new UserDto(savedUser);
    }

    private String generateRandomString(int length) {
        // 48 -> ascii for '0'
        // 122 -> ascii for 'z'
        // Filter non-alphanumeric.
        return new Random().ints(48, 123).filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97)).limit(length)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append).toString();
    }

    public UserDto approveRegistration(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomErrors.BadRequestException("User not found"));
        if (user.getUserStatus() == UserStatus.ACTIVE) {
            throw new CustomErrors.BadRequestException("User Already Active");
        }
        user.setUserStatus(UserStatus.ACTIVE);
        User savedUser = userRepository.save(user);
        return new UserDto(savedUser);
    }

    public UserDto rejectRegistration(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomErrors.BadRequestException("User not found"));
        if (user.getUserStatus() == UserStatus.INACTIVE) {
            throw new CustomErrors.BadRequestException("The user's registration request has been denied");
        }
        user.setUserStatus(UserStatus.INACTIVE);
        User savedUser = userRepository.save(user);
        return new UserDto(savedUser);
    }

    public UserDto createUser(UserCreateDto userCreate) {
        User user = userCreate.mapUserCreateDtoToUser();
        user.setPassword(bCryptPasswordEncoder.encode(userCreate.password()));
        User savedUser = userRepository.save(user);
        return new UserDto(savedUser);
    }

    public UserDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomErrors.BadRequestException("User not found"));
        return new UserDto(user);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(UserDto::new).toList();
    }

    public UserDto updateUser(Long id, UserUpdateDto userUpdateDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomErrors.BadRequestException("User not found"));

        userUpdateDto.mutateUser(user);
        User updatedUser = userRepository.save(user);
        return new UserDto(updatedUser);
    }

    public void deleteUser(Long userId) {
        userRepository.softDelete(userId);
    }
}
