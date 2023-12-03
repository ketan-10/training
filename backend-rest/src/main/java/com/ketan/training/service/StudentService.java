package com.ketan.training.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ketan.training.dto.student.StudentCreateDto;
import com.ketan.training.dto.student.StudentDto;
import com.ketan.training.dto.student.StudentInputDto;
import com.ketan.training.dto.student.StudentUpdateDto;
import com.ketan.training.entity.Student;
import com.ketan.training.entity.User;
import com.ketan.training.repository.StudentRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    public List<StudentDto> checkExistedStudent(List<StudentInputDto> inputStudents) {

        List<StudentDto> existingStuents = new ArrayList<>();

        for (StudentInputDto user : inputStudents) {
            if (studentRepository.existsByEmail(user.email())) {
                StudentDto addExistingStudent = new StudentDto(studentRepository.findFirstByEmail(user.email()));
                existingStuents.add(addExistingStudent);
            }
        }
        return existingStuents;
    }

    public StudentDto createStudent(StudentCreateDto studentCreateDto) {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Student student = studentCreateDto.studentCreateDtoMapper();

        student.setCreatedBy(loggedInUser);
        Student addStudent = studentRepository.save(student);
        return new StudentDto(addStudent);

    }

    public StudentDto updateStudent(Long id, StudentUpdateDto studentUpdateDto) {
        Student student = studentRepository.findById(id).orElseThrow();
        studentUpdateDto.mapStudent(student);
        return new StudentDto(studentRepository.save(student));

    }

    public List<StudentDto> getAllStudent() {
        return studentRepository.findAll().stream().map(StudentDto::new).toList();
    }

    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id).orElseThrow();
        return new StudentDto(student);
    }
}