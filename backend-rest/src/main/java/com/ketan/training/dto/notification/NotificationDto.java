package com.ketan.training.dto.notification;

import java.util.Date;

import com.ketan.training.entity.enums.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationDto {

    private Long id;

    private Long createdBy;

    private Long targetUser;

    private Boolean toAdmin;

    private NotificationType type;

    private String message;

    private String url;

    private Boolean isRead;

    private Boolean active;

    private Date createdAt;

    private Date updatedAt;
}
