package com.ketan.training.dto.student;

import com.ketan.training.entity.Student;

public record StudentUpdateDto(String name, String email, String mobilePhone, String projectName, String designation) {

    public void mapStudent(Student student) {
        student.setName(name);
        student.setEmail(email);
        student.setMobilePhone(mobilePhone);
        student.setDesignation(designation);
        student.setProjectName(projectName);
    }
}