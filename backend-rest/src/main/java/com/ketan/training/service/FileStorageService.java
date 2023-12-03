package com.ketan.training.service;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ketan.training.dto.files.FileResponse;
import com.ketan.training.entity.FileRecords;
import com.ketan.training.entity.User;
import com.ketan.training.repository.FileRecordRepository;

import io.minio.GetObjectArgs;
import io.minio.GetObjectResponse;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final MinioClient minioClient;
    @Autowired
    private FileRecordRepository fileRecordRepository;

    @Value("${minio.bucket-name}")
    String bucketName;

    public FileResponse addFile(MultipartFile file) {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        try {
            String objName = file.getSize() + "_" + Instant.now().toString() + "_" + file.getOriginalFilename();
            PutObjectArgs objectArgs = PutObjectArgs.builder().object(objName).bucket(bucketName)
                    .stream(file.getInputStream(), file.getSize(), -1).contentType(file.getContentType()).build();

            minioClient.putObject(objectArgs);
            FileRecords records = new FileRecords();
            records.setFileName(file.getOriginalFilename());
            records.setFilePath(objName);
            records.setCreatedBy(loggedInUser);
            fileRecordRepository.save(records);
            return new FileResponse(objName, file.getOriginalFilename(), file.getContentType(), file.getSize());
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    public GetObjectResponse getFile(String objName) {
        try {
            return minioClient.getObject(GetObjectArgs.builder().object(objName).bucket(bucketName).build());
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    public void deleteFileFromMinio(String file) {
        try {
            minioClient.removeObject(RemoveObjectArgs.builder().object(file).bucket(bucketName).build());
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    public FileRecords deleteFiles(Long id) {
        FileRecords records = fileRecordRepository.findById(id).get();
        records.setActive(false);
        fileRecordRepository.save(records);
        return records;
    }

}
