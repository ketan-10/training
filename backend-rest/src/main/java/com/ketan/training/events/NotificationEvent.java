package com.ketan.training.events;

import org.springframework.context.ApplicationEvent;

import com.ketan.training.dto.notification.NotificationDto;

import lombok.Getter;

@Getter
public class NotificationEvent extends ApplicationEvent {
    private NotificationDto notificationDto;

    public NotificationEvent(Object source, NotificationDto notificationDto) {
        super(source);
        this.notificationDto = notificationDto;
    }
}
