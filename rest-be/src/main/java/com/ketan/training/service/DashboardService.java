package com.ketan.training.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ketan.training.dto.dashboard.DashboardCountDto;
import com.ketan.training.entity.User;
import com.ketan.training.entity.enums.TrainingStatus;
import com.ketan.training.entity.enums.UserRole;
import com.ketan.training.repository.StudentRepository;
import com.ketan.training.repository.TrainingRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class DashboardService {

    @Autowired
    private TrainingRepository trainingRepository;

    @Autowired
    private StudentRepository studentRepository;

    public DashboardCountDto getDashStatusCount() {

        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (loggedInUser.getRole().equals(UserRole.REQUESTER)) {
            return new DashboardCountDto(
                    trainingRepository.countByStatusAndCreatedById(TrainingStatus.REQUESTED, loggedInUser.getId()),
                    studentRepository.count(), trainingRepository.countByCreatedById(loggedInUser.getId()));
        }
        return new DashboardCountDto(trainingRepository.countByStatus(TrainingStatus.REQUESTED),
                studentRepository.count(), trainingRepository.count());
    }
}
