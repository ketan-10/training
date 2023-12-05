package com.ketan.training.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ketan.training.dto.comment.CommentDto;
import com.ketan.training.service.CommentService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {
    private CommentService commentService;

    @GetMapping("/get-by-training-id/{id}")
    public ResponseEntity<List<CommentDto>> getCommentByTrainingId(@PathVariable Long id) {
        List<CommentDto> comment = commentService.getAllCommentByTrainingId(id);
        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<CommentDto> getCommentById(@PathVariable Long id) {
        CommentDto comment = commentService.getCommentById(id);
        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

    @PostMapping("/add/{training_id}")
    public ResponseEntity<CommentDto> addComment(@RequestBody CommentDto commentDto,
            @PathVariable("training_id") Long id) {
        CommentDto addComment = commentService.addComment(commentDto, id);

        return new ResponseEntity<>(addComment, HttpStatus.CREATED);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<CommentDto>> getAllComment() {
        List<CommentDto> comments = commentService.getAllComments();
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
}
