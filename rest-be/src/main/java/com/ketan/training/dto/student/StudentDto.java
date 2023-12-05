package com.ketan.training.dto.student;

import java.util.Date;

import com.ketan.training.dto.user.UserDto;
import com.ketan.training.entity.Student;

public record StudentDto(Long id, String uuid, String name, String email, String mobilePhone, String projectName,
        String designation, Boolean active, Date created_at, Date updated_at, UserDto createdBy) {

    public StudentDto(Student student) {
        this(student.getId(), student.getUuid(), student.getName(), student.getEmail(), student.getMobilePhone(),
                student.getProjectName(), student.getDesignation(), student.getActive(), student.getCreatedAt(),
                student.getUpdatedAt(), new UserDto(student.getCreatedBy()));

    }
}
