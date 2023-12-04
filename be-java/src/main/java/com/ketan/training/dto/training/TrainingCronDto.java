package com.ketan.training.dto.training;

import java.util.Date;

import com.ketan.training.entity.Training;

public record TrainingCronDto(Long id, Date created_at, String training_name, Long created_by) {
    public TrainingCronDto(Training training) {
        this(training.getId(), training.getCreatedAt(), training.getTrainingName(), training.getCreatedBy().getId());
    }
}
