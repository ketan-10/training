package com.ketan.training.controller;

import jakarta.validation.Valid;

import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ketan.training.dto.training.TrainingCreateDto;
import com.ketan.training.dto.training.TrainingDto;
import com.ketan.training.dto.training.TrainingRequestUpdateDto;
import com.ketan.training.service.TrainingService;

@RestController
@AllArgsConstructor
@RequestMapping("/api/training/requests")
public class TrainingRequestController {
    private final TrainingService trainingService;

    @GetMapping
    public ResponseEntity<List<TrainingDto>> getAllMyTrainingRequests() {
        List<TrainingDto> trainings = trainingService.getAllMyTrainingRequests();
        return new ResponseEntity<>(trainings, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<TrainingDto> createTrainingRequest(@RequestBody @Valid TrainingCreateDto trainingCreate) {
        TrainingDto training = trainingService.createTrainingRequest(trainingCreate);
        return new ResponseEntity<>(training, HttpStatus.OK);
    }

    @PutMapping("{id}")
    public ResponseEntity<TrainingDto> updateTrainingRequest(@PathVariable("id") Long trainingId,
            @RequestBody TrainingRequestUpdateDto trainingUpdate) {
        TrainingDto updatedTraining = trainingService.updateTrainingRequest(trainingId, trainingUpdate);
        return new ResponseEntity<>(updatedTraining, HttpStatus.OK);
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<String> approveTrainingRequest(@PathVariable("id") Long trainingId) {
        trainingService.approveTraining(trainingId);
        return new ResponseEntity<>("Training Approved!", HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public TrainingDto getById(@PathVariable Long id) {

        return trainingService.getTrainingById(id);

    }
}
