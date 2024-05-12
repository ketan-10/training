package com.ketan.training.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ketan.training.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query(value = "SELECT * FROM comment WHERE fk_training = :trainingId", nativeQuery = true)
    List<Comment> findCommentByTrainingId(@Param("trainingId") Long trainingId);

}
