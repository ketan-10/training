package com.ketan.training.controller;

import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ketan.training.dto.notification.NotificationDto;
import com.ketan.training.service.NotificationService;

@RestController
@AllArgsConstructor
@RequestMapping("/api/notification")
public class NotificationController {
    private final NotificationService notificationService;

    // route to get all notifications
    @GetMapping
    public ResponseEntity<List<NotificationDto>> getAllMyNotification() {
        List<NotificationDto> trainings = notificationService.getAllMyNotification();
        return new ResponseEntity<>(trainings, HttpStatus.OK);
    }

    // route to get all un-read notifications
    @GetMapping("/pending")
    public ResponseEntity<List<NotificationDto>> getAllMyPendingNotification() {
        List<NotificationDto> trainings = notificationService.getAllMyPendingNotification();
        return new ResponseEntity<>(trainings, HttpStatus.OK);
    }

    // route to mark notification as read
    @PutMapping("/clear/{id}")
    public ResponseEntity<NotificationDto> clearNotification(@PathVariable("id") Long id) {
        NotificationDto notification = notificationService.clearNotification(id);
        return new ResponseEntity<>(notification, HttpStatus.OK);
    }

    // route to mark all notifications as read
    @PutMapping("/clear-all")
    public ResponseEntity<List<NotificationDto>> clearAllMyNotification() {
        List<NotificationDto> notifications = notificationService.clearAllMyNotification();
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

    // route to get my unread notification count
    @GetMapping("/ping")
    public ResponseEntity<Long> ping() {
        Long count = notificationService.ping();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
}
