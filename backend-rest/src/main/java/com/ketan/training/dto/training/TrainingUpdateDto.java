package com.ketan.training.dto.training;

import jakarta.validation.constraints.NotNull;

import java.util.Date;

import com.ketan.training.entity.Training;
import com.ketan.training.entity.enums.*;

public record TrainingUpdateDto(@NotNull String trainingName, Integer participantsCount, TrainingLevel level,
        String participantsFilePath, String syllabusFilePath, TrainingUrgency urgency, TrainingEventMode mode,
        String categorySub, Date endDate, Integer noOfHours, String description, TrainingEventType type,
        String category, Boolean isRegistrationRequired, String tags, String trainer, String moderator, String link,
        String remarks, String otherTrainingEvent, TrainingScope trainingScope, Date startDate, String attendancePath,
        String approvalMailAttachmentFile) {

    public void mutateTraining(Training training) {
        training.setTrainingName(trainingName);
        training.setParticipantsCount(participantsCount);
        training.setLevel(level);
        training.setParticipantsFilePath(participantsFilePath);
        training.setSyllabusFilePath(syllabusFilePath);
        training.setUrgency(urgency);
        training.setMode(mode);
        training.setCategory(category);
        training.setCategorySub(categorySub);
        training.setEndDate((endDate));
        training.setNoOfHours((noOfHours));
        training.setType(type);
        training.setDescription(description);
        training.setIsRegistrationRequired(isRegistrationRequired);
        training.setTags(tags);

        // TODO: move to TrainingEvent
        training.setTrainer(trainer);
        training.setModerator(moderator);
        training.setLink(link);

        // TODO: move to Comments
        training.setRemarks(remarks);
        training.setOtherTrainingEvent(otherTrainingEvent);
        training.setTrainingScope(trainingScope);
        training.setStartDate(startDate);
        training.setAttendancePath(attendancePath);
        training.setApprovalMailAttachmentFile(approvalMailAttachmentFile);

    }
}
