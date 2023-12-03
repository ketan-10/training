package com.ketan.training.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.history.RevisionRepository;
import org.springframework.data.repository.query.Param;

import com.ketan.training.entity.Training;
import com.ketan.training.entity.enums.TrainingStatus;

import jakarta.transaction.Transactional;

public interface TrainingRepository extends RevisionRepository<Training, Long, Long>, JpaRepository<Training, Long> {

    Long countByStatusAndCreatedById(TrainingStatus status, Long userId);

    Long countByStatus(TrainingStatus status);

    Long countByCreatedById(Long userId);

    @Query(value = "select * from training where "
            + "(urgency = 'P1' and date(created_at) = SUBDATE(CURDATE(), INTERVAL :p1 DAY)) "
            + "or (urgency = 'P2' and date(created_at) = SUBDATE(CURDATE(), INTERVAL :p2 DAY));", nativeQuery = true)
    List<Training> findDueDate(@Param("p1") int intervalP1, @Param("p2") int intervalP2);

    List<Training> findAllByCreatedById(Long userId);

    List<Training> findByStatus(TrainingStatus status);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("UPDATE Training SET status = :status WHERE id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") TrainingStatus status);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("update #{#entityName} e set e.active=false where e.id=?1")
    public void softDelete(Long id);

}
