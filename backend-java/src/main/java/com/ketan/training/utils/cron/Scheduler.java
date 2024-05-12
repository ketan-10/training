package com.ketan.training.utils.cron;

import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.ketan.training.dto.notification.NotificationDto;
import com.ketan.training.dto.training.TrainingCronDto;
import com.ketan.training.entity.enums.NotificationType;
import com.ketan.training.events.NotificationEvent;
import com.ketan.training.service.TrainingService;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class Scheduler {
    private ApplicationEventPublisher applicationEventPublisher;
    private TrainingService trainingService;

    // Trigger cron at every 12:01 am midnight
    @Scheduled(cron = "1 0 0 * * *")
    public void triggerCron() {
        if (!trainingService.findDueDates().isEmpty()) {
            for (TrainingCronDto training : trainingService.findDueDates()) {
                applicationEventPublisher.publishEvent(new NotificationEvent(this, NotificationDto.builder()
                        .createdBy(1L).toAdmin(true).type(NotificationType.TRAINING_DUE_ALERT)
                        .message("Requested '" + training.training_name() + "' training will be due in three Days ")
                        .url("/" + training.id()).build()));
            }
        }
    }

    public List<TrainingCronDto> manualTriggerCron() {
        triggerCron();
        return trainingService.findDueDates();
    }
}
