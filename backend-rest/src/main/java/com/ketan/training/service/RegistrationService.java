package com.ketan.training.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ketan.training.entity.Student;
import com.ketan.training.dto.student.StudentDto;
import com.ketan.training.entity.Registration;
import com.ketan.training.entity.Training;
import com.ketan.training.exception.CustomErrors;
import com.ketan.training.repository.StudentRepository;
import com.ketan.training.repository.RegistrationRepository;
import com.ketan.training.repository.TrainingRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RegistrationService {

    @Autowired
    private TrainingRepository trainingRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    public String registerStudent(Long trainingId, ArrayList<Long> studentIds) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new CustomErrors.BadRequestException("Training not found"));

        List<Registration> registrations = new ArrayList<>();
        for (Long studentId : studentIds) {
            Registration registration = new Registration();
            Student student = studentRepository.findById(studentId).orElseThrow(
                    () -> new CustomErrors.BadRequestException("Student with ID: " + studentId + " Not found"));
            registration.setId(registration.getId());
            registration.setActive(registration.getActive());
            registration.setUpdatedAt(registration.getUpdatedAt());
            registration.setCreatedAt(registration.getCreatedAt());
            registration.setTraining(training);
            registration.setStudent(student);
            registrations.add(registration);
        }

        registrationRepository.deleteByTrainingId(trainingId);
        registrationRepository.saveAll(registrations);

        return "Register Successfully";
    }

    public List<StudentDto> getRegisteredStudents(Long trainingId) {
        return studentRepository.findAllByRegistrationsTrainingId(trainingId).stream().map(StudentDto::new).toList();
    }

}
