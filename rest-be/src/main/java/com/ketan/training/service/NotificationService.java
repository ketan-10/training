package com.ketan.training.service;

import java.util.List;

import org.springframework.context.event.EventListener;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ketan.training.dto.notification.NotificationDto;
import com.ketan.training.entity.Notification;
import com.ketan.training.entity.User;
import com.ketan.training.entity.enums.UserRole;
import com.ketan.training.events.NotificationEvent;
import com.ketan.training.repository.NotificationRepository;
import com.ketan.training.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @EventListener
    public void handleCustomEvent(NotificationEvent notificationEvent) {
        NotificationDto notificationDto = notificationEvent.getNotificationDto();
        createNotification(notificationDto);
    }

    private void createNotification(NotificationDto notificationDto) {
        Notification notification = convertToEntity(notificationDto);
        if (notificationDto.getCreatedBy() != null)
            notification.setCreatedBy(userRepository.findById(notificationDto.getCreatedBy()).orElse(null));
        if (notificationDto.getTargetUser() != null)
            notification.setTarget(userRepository.findById(notificationDto.getTargetUser()).orElse(null));
        notificationRepository.save(notification);
    }

    public List<NotificationDto> getAllMyNotification() {
        // fetch logged in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (loggedInUser.getRole().equals(UserRole.ADMIN)) {
            return notificationRepository.findByToAdmin(true).stream().map(this::convertToDto).toList();
        }

        return notificationRepository.findAllByTargetId(loggedInUser.getId()).stream().map(this::convertToDto).toList();
    }

    public List<NotificationDto> getAllMyPendingNotification() {
        // fetch logged in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (loggedInUser.getRole().equals(UserRole.ADMIN)) {
            return notificationRepository.findByToAdminAndIsRead(true, false).stream().map(this::convertToDto).toList();
        }

        return notificationRepository.findAllByTargetIdAndIsRead(loggedInUser.getId(), false).stream()
                .map(this::convertToDto).toList();
    }

    public NotificationDto clearNotification(Long id) {
        Notification notification = notificationRepository.findById(id).orElseThrow();
        notification.setIsRead(true);
        Notification updatedNotification = notificationRepository.save(notification);
        return convertToDto(updatedNotification);
    }

    public List<NotificationDto> clearAllMyNotification() {

        // fetch logged in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // if user is internal team, clear all notification
        List<Notification> notifications;
        if (loggedInUser.getRole().equals(UserRole.ADMIN)) {
            notifications = notificationRepository.findByToAdminAndIsRead(true, false);
        } else {
            notifications = notificationRepository.findAllByTargetIdAndIsRead(loggedInUser.getId(), false);
        }

        notifications.forEach(notification -> notification.setIsRead(true));
        List<Notification> updatedNotifications = notificationRepository.saveAll(notifications);
        return updatedNotifications.stream().map(this::convertToDto).toList();
    }

    public Long ping() {
        // fetch logged in user
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (loggedInUser.getRole().equals(UserRole.ADMIN)) {
            return notificationRepository.countByToAdminAndIsRead(true, false);
        }
        return notificationRepository.countByTargetIdAndIsRead(loggedInUser.getId(), false);
    }

    private NotificationDto convertToDto(Notification notification) {
        return NotificationDto.builder().id(notification.getId())
                .createdBy(notification.getCreatedBy() == null ? null : notification.getCreatedBy().getId())
                .targetUser(notification.getTarget() == null ? null : notification.getTarget().getId())
                .toAdmin(notification.getToAdmin()).type(notification.getType()).message(notification.getMessage())
                .url(notification.getUrl()).isRead(notification.getIsRead()).active(notification.getActive())
                .createdAt(notification.getCreatedAt()).updatedAt(notification.getUpdatedAt()).build();
    }

    private Notification convertToEntity(NotificationDto notificationDto) {
        Notification notification = new Notification();
        notification.setToAdmin(notificationDto.getToAdmin());
        notification.setType(notificationDto.getType());
        notification.setMessage(notificationDto.getMessage());
        notification.setUrl(notificationDto.getUrl());
        notification.setIsRead(notificationDto.getIsRead());
        notification.setActive(notificationDto.getActive());
        notification.setCreatedAt(notificationDto.getCreatedAt());
        notification.setUpdatedAt(notificationDto.getUpdatedAt());
        return notification;
    }
}
