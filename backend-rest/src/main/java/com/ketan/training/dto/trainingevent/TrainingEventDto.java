package com.ketan.training.dto.trainingevent;

import java.util.Date;

import com.ketan.training.dto.user.UserDto;
import com.ketan.training.entity.TrainingEvent;
import com.ketan.training.entity.enums.TrainingEventStatus;

public record TrainingEventDto(Long id, Long fkTraining, UserDto createdBy, TrainingEventStatus status, Date from,
        Date to, Date completedOn, Boolean active, Date createdAt, Date updatedAt) {
    public TrainingEventDto(TrainingEvent trainingEvent) {
        this(trainingEvent.getId(), trainingEvent.getTraining().getId(), new UserDto(trainingEvent.getCreatedBy()),
                trainingEvent.getStatus(), trainingEvent.getFrom(), trainingEvent.getTo(),
                trainingEvent.getCompletedOn(), trainingEvent.getActive(), trainingEvent.getCreatedAt(),
                trainingEvent.getUpdatedAt());
    }
}
