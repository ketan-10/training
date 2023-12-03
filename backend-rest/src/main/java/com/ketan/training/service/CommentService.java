package com.ketan.training.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ketan.training.dto.comment.CommentDto;
import com.ketan.training.dto.user.UserDto;
import com.ketan.training.entity.Comment;
import com.ketan.training.entity.Training;
import com.ketan.training.entity.User;
import com.ketan.training.exception.CustomErrors;
import com.ketan.training.repository.CommentRepository;
import com.ketan.training.repository.TrainingRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CommentService {

    private CommentRepository commentRepository;
    private TrainingRepository trainingRepository;

    public CommentDto addComment(CommentDto commentCreateDto, Long id) {
        Training training = trainingRepository.findById(id)
                .orElseThrow(() -> new CustomErrors.BadRequestException("not found"));
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Comment comment = new Comment();
        comment.setComment(commentCreateDto.comment());
        comment.setTraining(training);
        comment.setCommentedBy(user);
        Comment saveComment = commentRepository.save(comment);
        return new CommentDto(saveComment.getId(), saveComment.getActive(), saveComment.getUpdated_at(),
                saveComment.getCreated_at(), saveComment.getComment(), new UserDto(saveComment.getCommentedBy()));
    }

    public List<CommentDto> getAllComments() {
        return commentRepository.findAll().stream().map(u -> new CommentDto(u.getId(), u.getActive(), u.getUpdated_at(),
                u.getCreated_at(), u.getComment(), new UserDto(u.getCommentedBy()))).toList();
    }

    public CommentDto getCommentById(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new CustomErrors.BadRequestException(" not found"));
        return new CommentDto(comment);
    }

    public List<CommentDto> getAllCommentByTrainingId(Long training_id) {
        List<Comment> commentByTrainingId = commentRepository.findCommentByTrainingId(training_id);
        List<CommentDto> commentDtoList = new ArrayList<>();
        for (Comment comment : commentByTrainingId) {
            CommentDto commentDto = new CommentDto(comment);
            commentDtoList.add(commentDto);
        }
        return commentDtoList;
    }
}
