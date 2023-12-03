package com.ketan.training.dto.student;

import com.ketan.training.entity.Student;

public record StudentInputDto(String email) {
    public Student studentInputMapper() {
        Student student = new Student();
        student.setEmail(email);
        return student;
    }
}
