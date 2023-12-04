package com.ketan.training.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.ketan.training.entity.Notification;

import jakarta.transaction.Transactional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findAllByTargetId(Long userId);

    List<Notification> findByToAdmin(Boolean toAdmin);

    List<Notification> findAllByTargetIdAndIsRead(Long userId, Boolean read);

    List<Notification> findByToAdminAndIsRead(Boolean toAdmin, Boolean read);

    Long countByTargetIdAndIsRead(Long userId, Boolean read);

    Long countByToAdminAndIsRead(Boolean toAdmin, Boolean read);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("update #{#entityName} e set e.active=false where e.id=?1")
    public void softDelete(Long id);
}
