package com.ketan.training.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ketan.training.dto.trainingevent.TrainingEventCreateDto;
import com.ketan.training.dto.trainingevent.TrainingEventDto;
import com.ketan.training.entity.Training;
import com.ketan.training.entity.TrainingEvent;
import com.ketan.training.entity.User;
import com.ketan.training.exception.CustomErrors;
import com.ketan.training.repository.TrainingEventRepository;
import com.ketan.training.repository.TrainingRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TrainingEventService {

    private TrainingEventRepository trainingEventRepository;
    private TrainingRepository trainingRepository;

    public TrainingEventDto getTrainingEventById(Long id) {
        TrainingEvent trainingEvent = trainingEventRepository.findById(id).orElseThrow();
        return new TrainingEventDto(trainingEvent);
    }

    public List<TrainingEventDto> createEvents(List<TrainingEventCreateDto> createDto, Long trainingId) {
        User loginUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new CustomErrors.NotFoundException("Training not found"));

        List<TrainingEvent> trainingEvents = createDto.stream().map(dto -> {
            TrainingEvent trainingEvent = dto.mapTrainingCreateDto();
            trainingEvent.setTraining(training);
            trainingEvent.setCreatedBy(loginUser);
            return trainingEvent;
        }).toList();

        return trainingEventRepository.saveAll(trainingEvents).stream().map(TrainingEventDto::new).toList();
    }

    public List<TrainingEventDto> replaceEvents(List<TrainingEventCreateDto> createDto, Long trainingId) {

        trainingEventRepository.deleteByTrainingId(trainingId);
        return this.createEvents(createDto, trainingId);
    }

    public List<TrainingEventDto> allEventByTrainingId(Long id) {
        List<TrainingEvent> trainingEvents = trainingEventRepository.allEventByTrainingId(id);
        return trainingEvents.stream().map(TrainingEventDto::new).toList();
    }
}
