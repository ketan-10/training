package com.ketan.training.dto.comment;

import java.util.Date;

import com.ketan.training.dto.user.UserDto;
import com.ketan.training.entity.Comment;

public record CommentDto(Long id, Boolean active, Date updated_at, Date created_at, String comment, UserDto user) {

    public CommentDto(Comment comment) {
        this(comment.getId(), comment.getActive(), comment.getUpdated_at(), comment.getCreated_at(),
                comment.getComment(), new UserDto(comment.getCommentedBy()));

    }
}
