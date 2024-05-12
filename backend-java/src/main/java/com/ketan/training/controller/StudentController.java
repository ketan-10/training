package com.ketan.training.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ketan.training.dto.student.StudentCreateDto;
import com.ketan.training.dto.student.StudentDto;
import com.ketan.training.dto.student.StudentInputDto;
import com.ketan.training.dto.student.StudentUpdateDto;
import com.ketan.training.service.StudentService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/students")
public class StudentController {
    private StudentService studentService;

    @PostMapping("/existing-students")
    public ResponseEntity<List<StudentDto>> checkExistedStudnets(@RequestBody List<StudentInputDto> studentInputDto) {
        List<StudentDto> studentDto = studentService.checkExistedStudent(studentInputDto);
        return new ResponseEntity<>(studentDto, HttpStatus.OK);

    }

    @PostMapping
    public ResponseEntity<StudentDto> createStudent(@RequestBody StudentCreateDto studentCreate) {
        StudentDto savedStudent = studentService.createStudent(studentCreate);
        return new ResponseEntity<>(savedStudent, HttpStatus.CREATED);
    }

    @PostMapping("/all")
    public ResponseEntity<List<StudentDto>> createStudent(@RequestBody List<StudentCreateDto> studentsCreate) {

        return new ResponseEntity<>(studentsCreate.stream().map(studentService::createStudent).toList(),
                HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDto> updateStudent(@PathVariable Long id,
            @RequestBody StudentUpdateDto studentUpdateDto) {
        StudentDto studentDto = studentService.updateStudent(id, studentUpdateDto);
        return new ResponseEntity<>(studentDto, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<StudentDto>> getAllStudent() {
        List<StudentDto> allStudent = studentService.getAllStudent();
        return new ResponseEntity<>(allStudent, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable Long id) {
        StudentDto studentDto = studentService.getStudentById(id);
        return new ResponseEntity<>(studentDto, HttpStatus.OK);
    }

}
