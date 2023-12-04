package com.ketan.training.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.ketan.training.dto.user.UserDto;
import com.ketan.training.entity.User;

import jakarta.transaction.Transactional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("update #{#entityName} e set e.active=false where e.id=?1")
    public void softDelete(Long id);

    @Query("SELECT u FROM User u WHERE u.email = ?1")
    UserDto getByEmail(String email);
}
