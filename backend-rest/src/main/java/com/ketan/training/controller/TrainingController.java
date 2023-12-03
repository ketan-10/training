package com.ketan.training.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ketan.training.dto.training.TrainingDto;
import com.ketan.training.dto.training.TrainingUpdateDto;
import com.ketan.training.entity.enums.TrainingStatus;
import com.ketan.training.service.TrainingService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/training")
public class TrainingController {
    private final TrainingService trainingService;

    @GetMapping("/audit-log/{training-id}")
    public List<Map<String, Object>> getAllData(@PathVariable("training-id") Long id) {
        return trainingService.getAllDataFromTable(id, "training_audit");
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingDto> getTrainingById(@PathVariable Long id) {
        TrainingDto training = trainingService.getTrainingById(id);
        return new ResponseEntity<>(training, HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TrainingDto> updateTrainingFields(@PathVariable Long id,
            @RequestBody Map<String, Object> fields) {
        TrainingDto training = trainingService.updateTrainingFields(id, fields);

        return new ResponseEntity<>(training, HttpStatus.OK);

    }

    @PutMapping("change-training-status/{id}")
    public ResponseEntity<TrainingDto> changeTrainingStatus(@PathVariable Long id,
            @RequestBody TrainingStatus trainingStatus) {
        TrainingDto training = trainingService.updateTrainingStatus(id, trainingStatus);
        return new ResponseEntity<>(training, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<TrainingDto>> getAllMyTraining() {
        List<TrainingDto> trainings = trainingService.getAllMyTraining();
        return new ResponseEntity<>(trainings, HttpStatus.OK);
    }

    @PutMapping("{id}")
    public ResponseEntity<TrainingDto> updateTraining(@PathVariable("id") Long trainingId,
            @RequestBody @Valid TrainingUpdateDto trainingUpdate) {
        TrainingDto updatedTraining = trainingService.updateTraining(trainingId, trainingUpdate);
        return new ResponseEntity<>(updatedTraining, HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteTraining(@PathVariable("id") Long trainingId) {
        trainingService.deleteTraining(trainingId);
        return new ResponseEntity<>("Training successfully deleted!", HttpStatus.OK);
    }

    @PostMapping("schedule/{id}")
    public ResponseEntity<TrainingDto> submitTraining(@PathVariable("id") Long trainingId) {
        TrainingDto trainingDto = trainingService.scheduleTrainings(trainingId);
        return new ResponseEntity<>(trainingDto, HttpStatus.OK);
    }
}
