package com.ketan.training.dto.student;

import com.ketan.training.entity.Student;

public record StudentCreateDto(String uuid, String name, String email, String mobilePhone, String projectName,
        String designation) {

    public Student studentCreateDtoMapper() {
        Student student = new Student();
        student.setUuid(uuid);
        student.setName(name);
        student.setEmail(email);
        student.setMobilePhone(mobilePhone);
        student.setProjectName(projectName);
        student.setDesignation(designation);
        return student;
    }
}