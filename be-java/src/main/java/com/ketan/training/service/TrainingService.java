package com.ketan.training.service;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.ReflectionUtils;

import com.ketan.training.dto.notification.NotificationDto;
import com.ketan.training.dto.training.TrainingCreateDto;
import com.ketan.training.dto.training.TrainingCronDto;
import com.ketan.training.dto.training.TrainingDto;
import com.ketan.training.dto.training.TrainingRequestUpdateDto;
import com.ketan.training.dto.training.TrainingUpdateDto;
import com.ketan.training.entity.Training;
import com.ketan.training.entity.User;
import com.ketan.training.entity.enums.NotificationType;
import com.ketan.training.entity.enums.TrainingStatus;
import com.ketan.training.entity.enums.UserRole;
import com.ketan.training.events.NotificationEvent;
import com.ketan.training.exception.CustomErrors;
import com.ketan.training.repository.TrainingRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TrainingService {
    private final TrainingRepository trainingRepository;

    private ApplicationEventPublisher applicationEventPublisher;
    private final JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> getAllDataFromTable(Long id, String tableName) {
        return jdbcTemplate.queryForList("SELECT * FROM " + tableName + " JOIN audit_info ON " + tableName
                + ".rev=audit_info.id WHERE " + tableName + ".id=" + id);
    }

    public TrainingDto updateTrainingFields(Long id, Map<String, Object> fields) {
        Optional<Training> existingTraining = trainingRepository.findById(id);
        if (!existingTraining.isPresent())
            return null;

        Training training = existingTraining.get();
        fields.forEach((key, value) -> {
            Field field = ReflectionUtils.findField(Training.class, key);
            if (field != null) {
                field.setAccessible(true);
                ReflectionUtils.setField(field, training, value);
            }
        });
        return new TrainingDto(trainingRepository.save(training));

    }

    public TrainingDto updateTrainingStatus(Long id, TrainingStatus trainingStatus) {
        Optional<Training> optionalTraining = trainingRepository.findById(id);
        if (optionalTraining.isPresent()) {
            Training training = optionalTraining.get();
            training.setStatus(trainingStatus);
            return new TrainingDto(trainingRepository.save(training));
        } else {
            throw new CustomErrors.NotFoundException("Training Not Found");
        }
    }

    public List<TrainingCronDto> findDueDates() {
        return trainingRepository.findDueDate(12, 27).stream().map(TrainingCronDto::new).toList();
    }

    public List<TrainingDto> getAllMyTrainingRequests() {

        // fetch logged in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // if user is manager, return only trainings created by him
        if (loggedInUser.getRole().equals(UserRole.REQUESTER)) {
            return trainingRepository.findAllByCreatedById(loggedInUser.getId()).stream()
                    .filter(t -> t.getStatus() == TrainingStatus.REQUESTED).map(TrainingDto::new).toList();
        }

        return trainingRepository.findByStatus(TrainingStatus.REQUESTED).stream().map(TrainingDto::new).toList();
    }

    public List<TrainingDto> getAllMyTraining() {
        // fetch logged in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // if user is manager, return only trainings created by him
        if (loggedInUser.getRole().equals(UserRole.REQUESTER)) {
            return trainingRepository.findAllByCreatedById(loggedInUser.getId()).stream()
                    .filter(t -> t.getStatus() != TrainingStatus.REQUESTED).map(TrainingDto::new).toList();
        }

        // if user is internal team, return all trainings
        return trainingRepository.findAll().stream().filter(t -> t.getStatus() != TrainingStatus.REQUESTED)
                .map(TrainingDto::new).toList();
    }

    public TrainingDto createTrainingRequest(TrainingCreateDto trainingCreate) {

        // fetch logged in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Training training = trainingCreate.mapTrainingCreateDtoToTraining();
        training.setCreatedBy(loggedInUser);
        Training insertedTraining = trainingRepository.save(training);

        // trigger notification
        applicationEventPublisher.publishEvent(new NotificationEvent(this, NotificationDto.builder()
                .createdBy(loggedInUser.getId()).toAdmin(true).type(NotificationType.TRAINING_REQUEST_CREATED)
                .message(
                        "Training '" + training.getTrainingName() + "' has been requested by " + loggedInUser.getName())
                .url("/" + training.getId()).build()));

        return new TrainingDto(insertedTraining);
    }

    public void deleteTraining(Long trainingId) {
        trainingRepository.softDelete(trainingId);
    }

    public void approveTraining(Long trainingId) {
        // TODO trigger notification
        trainingRepository.updateStatus(trainingId, TrainingStatus.IN_PROGRESS);
    }

    public TrainingDto updateTrainingRequest(Long trainingId, TrainingRequestUpdateDto trainingUpdate) {
        Training training = trainingRepository.findById(trainingId).orElseThrow();
        trainingUpdate.mutateTraining(training);
        return new TrainingDto(trainingRepository.save(training));
    }

    public TrainingDto scheduleTrainings(Long trainingId) {
        trainingRepository.updateStatus(trainingId, TrainingStatus.SCHEDULED);
        var optionalTraining = trainingRepository.findById(trainingId);
        if (optionalTraining.isEmpty())
            throw new CustomErrors.NotFoundException("Training not found");
        return new TrainingDto(optionalTraining.get());
    }

    public TrainingDto updateTraining(Long trainingId, TrainingUpdateDto trainingUpdate) {
        Training training = trainingRepository.findById(trainingId).orElseThrow();
        trainingUpdate.mutateTraining(training);
        return new TrainingDto(trainingRepository.save(training));
    }

    public TrainingDto getTrainingById(Long id) {
        return new TrainingDto(trainingRepository.findById(id).orElseThrow());

    }

}
