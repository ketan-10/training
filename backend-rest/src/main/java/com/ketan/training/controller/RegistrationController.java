package com.ketan.training.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ketan.training.dto.student.StudentDto;
import com.ketan.training.service.RegistrationService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @PostMapping("/register/{trainingId}")
    public ResponseEntity<String> registerStudent(@PathVariable Long trainingId,
            @RequestBody ArrayList<Long> studentID) {

        String registration = registrationService.registerStudent(trainingId, studentID);

        return new ResponseEntity<>(registration, HttpStatus.OK);
    }

    @GetMapping("/register/{trainingId}")
    public ResponseEntity<List<StudentDto>> getRegisteredStudents(@PathVariable Long trainingId) {

        return new ResponseEntity<>(registrationService.getRegisteredStudents(trainingId), HttpStatus.OK);
    }

}
