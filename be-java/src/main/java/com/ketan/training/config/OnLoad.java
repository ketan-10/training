package com.ketan.training.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.ketan.training.entity.User;
import com.ketan.training.entity.enums.UserRole;
import com.ketan.training.repository.UserRepository;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OnLoad implements ApplicationRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    String bucketName;

    @Value("${admin.email}")
    String adminEmail;

    @Value("${admin.password}")
    String adminPassword;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        userRepository.findByEmail("admin@gmail.com").ifPresentOrElse(user -> {
            System.out.println("admin already exists");
        }, () -> {
            User user = new User();
            user.setEmail(adminEmail);
            user.setName("admin");
            user.setPassword(passwordEncoder.encode(adminPassword));
            user.setRole(UserRole.ADMIN);
            userRepository.save(user);
        });

        if (!minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build())) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
        }
    }
}
