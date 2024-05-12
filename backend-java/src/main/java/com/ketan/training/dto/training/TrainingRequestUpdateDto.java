package com.ketan.training.dto.training;

import java.util.Date;

import com.ketan.training.entity.Training;
import com.ketan.training.entity.enums.*;

public record TrainingRequestUpdateDto(String trainingName, Integer participantsCount, TrainingLevel level,
        String participantsFilePath, String syllabusFilePath, TrainingUrgency urgency, TrainingEventMode mode,
        String categorySub, Date endDate, Integer noOfHours, String description, TrainingEventType type,
        String category, Boolean isRegistrationRequired, String tags, String otherTrainingEvent,
        TrainingScope trainingScope, Date startDate, String remarks, String attendancePath,
        String approvalMailAttachmentFile) {

    public void mutateTraining(Training training) {

        training.setTrainingName(trainingName());
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
        training.setOtherTrainingEvent(otherTrainingEvent);
        training.setTrainingScope(trainingScope);
        training.setStartDate(startDate);
        training.setRemarks(remarks);
        training.setAttendancePath(attendancePath);
        training.setApprovalMailAttachmentFile(approvalMailAttachmentFile);
    }
}
