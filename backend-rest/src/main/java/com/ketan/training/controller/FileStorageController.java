package com.ketan.training.controller;

import io.minio.GetObjectResponse;
import io.swagger.v3.oas.annotations.Operation;

import java.util.Arrays;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ketan.training.dto.files.FileResponse;
import com.ketan.training.entity.FileRecords;
import com.ketan.training.service.FileStorageService;

@RestController
@AllArgsConstructor
@RequestMapping("/api/files")
public class FileStorageController {
    private final FileStorageService fileStorageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileResponse> fileUpload(@RequestPart("file") MultipartFile file) {
        FileResponse response = fileStorageService.addFile(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("{file}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Download a File")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable String file) {
        GetObjectResponse fileResponse = fileStorageService.getFile(file);
        var headers = fileResponse.headers();
        long size = Long.parseLong(headers.get("Content-Length"));

        String originalName = file;
        try {
            originalName = Arrays.stream(fileResponse.object().split("_")).skip(2).collect(Collectors.joining("_"));
        } catch (Exception e) {
        }

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM).contentLength(size)
                .header("Content-disposition", "attachment; filename=" + originalName)
                .body(new InputStreamResource(fileResponse));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<FileRecords> deleteById(@PathVariable Long id) {
        FileRecords fileRecords = fileStorageService.deleteFiles(id);
        return new ResponseEntity<>(fileRecords, HttpStatus.OK);
    }

}
