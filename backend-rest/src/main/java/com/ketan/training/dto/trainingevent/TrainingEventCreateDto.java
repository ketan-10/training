package com.ketan.training.dto.trainingevent;

import java.util.Date;

import com.ketan.training.entity.TrainingEvent;
import com.ketan.training.entity.enums.TrainingEventStatus;

public record TrainingEventCreateDto(TrainingEventStatus status, Date from, Date to, Integer duration) {
    public TrainingEvent mapTrainingCreateDto() {
        TrainingEvent trainingEvent = new TrainingEvent();
        trainingEvent.setStatus(status);
        trainingEvent.setFrom(from);
        trainingEvent.setTo(to);
        trainingEvent.setDuration(duration);
        return trainingEvent;
    }
}
