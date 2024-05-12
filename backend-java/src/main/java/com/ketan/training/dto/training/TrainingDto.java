package com.ketan.training.dto.training;

import java.util.Date;

import com.ketan.training.dto.user.UserDto;
import com.ketan.training.entity.Training;
import com.ketan.training.entity.enums.*;

public record TrainingDto(Long id, String trainingName, Integer participantsCount, TrainingLevel level,
        String participantsFilePath, String syllabusFilePath, TrainingUrgency urgency, TrainingEventMode mode,
        TrainingEventType type, TrainingStatus status, String category, String description,
        Boolean isRegistrationRequired, String categorySub, Date endDate, Integer noOfHours, String tags,
        Date createdAt, Date updatedAt, UserDto createdBy, String trainer, String moderator, String link,
        String remarks, String otherTrainingEvent, TrainingScope trainingScope, Date StartDate, String attendancePath,
        String approvalMailAttachmentFile) {

    public TrainingDto(Training training) {
        this(training.getId(), training.getTrainingName(), training.getParticipantsCount(), training.getLevel(),
                training.getParticipantsFilePath(), training.getSyllabusFilePath(), training.getUrgency(),
                training.getMode(), training.getType(), training.getStatus(), training.getCategory(),
                training.getDescription(), training.getIsRegistrationRequired(), training.getCategorySub(),
                training.getEndDate(), training.getNoOfHours(), training.getTags(), training.getCreatedAt(),
                training.getUpdatedAt(), new UserDto(training.getCreatedBy()), training.getTrainer(),
                training.getModerator(), training.getLink(), training.getRemarks(), training.getOtherTrainingEvent(),
                training.getTrainingScope(), training.getStartDate(), training.getAttendancePath(),
                training.getApprovalMailAttachmentFile());
    }
}
