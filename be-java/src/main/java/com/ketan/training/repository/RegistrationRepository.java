package com.ketan.training.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.ketan.training.entity.Registration;

import jakarta.transaction.Transactional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("update #{#entityName} e set e.active=false where e.id=?1")
    public void softDelete(Long id);

    @Transactional
    public List<Registration> deleteByTrainingId(Long trainingId);

    public List<Registration> findAllByTrainingId(Long trainingId);

}
