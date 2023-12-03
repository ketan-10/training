package com.ketan.training.dto.trainingevent;

import java.sql.Date;

import com.ketan.training.entity.TrainingEvent;
import com.ketan.training.entity.enums.TrainingEventStatus;

public record TrainingEventUpdateDto(TrainingEventStatus status, Date from, Date to, Integer duration,
        Date completedOn) {
    public void mapTrainingEventUpdateDto(TrainingEvent trainingEvent) {
        trainingEvent.setStatus(status);
        trainingEvent.setFrom(from);
        trainingEvent.setTo(to);
        trainingEvent.setDuration(duration);
        trainingEvent.setCompletedOn(completedOn);
    }
}
