package com.ketan.training.controller;

import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ketan.training.dto.trainingevent.TrainingEventCreateDto;
import com.ketan.training.dto.trainingevent.TrainingEventDto;
import com.ketan.training.service.TrainingEventService;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/training-event")
public class TrainingEventController {
    private TrainingEventService trainingEventService;

    @PostMapping("/create/{training_id}")
    public ResponseEntity<List<TrainingEventDto>> createEvents(@RequestBody List<TrainingEventCreateDto> createDto,
            @PathVariable("training_id") Long id) {
        List<TrainingEventDto> trainingEventDto = trainingEventService.createEvents(createDto, id);
        return new ResponseEntity<>(trainingEventDto, HttpStatus.OK);
    }

    @PutMapping("/replace/{training_id}")
    public ResponseEntity<List<TrainingEventDto>> replaceEvents(@RequestBody List<TrainingEventCreateDto> createDto,
            @PathVariable("training_id") Long id) {
        List<TrainingEventDto> trainingEventDto = trainingEventService.replaceEvents(createDto, id);
        return new ResponseEntity<>(trainingEventDto, HttpStatus.OK);
    }

    @GetMapping("/all-event-by-training-id/{training_id}")
    public ResponseEntity<List<TrainingEventDto>> getAllEventByTrainingId(@PathVariable("training_id") Long id) {
        List<TrainingEventDto> trainingEventDto = trainingEventService.allEventByTrainingId(id);
        return new ResponseEntity<>(trainingEventDto, HttpStatus.OK);
    }

}
