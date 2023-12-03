package com.ketan.training.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ketan.training.entity.TrainingEvent;

import jakarta.transaction.Transactional;

@Repository
public interface TrainingEventRepository extends JpaRepository<TrainingEvent, Long> {

    @Query(value = "SELECT * FROM training_event te WHERE te.fk_training = ?1", nativeQuery = true)
    List<TrainingEvent> allEventByTrainingId(Long id);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("update #{#entityName} e set e.active=false where e.id=?1")
    public void softDelete(Long id);

    @Transactional
    public List<TrainingEvent> deleteByTrainingId(Long trainingId);
}
