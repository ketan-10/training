-- +goose Up
SET FOREIGN_KEY_CHECKS=0;
CREATE TABLE IF NOT EXISTS `user` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) DEFAULT NULL,
    `role` ENUM('admin', 'requester') NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE `user_email`(`email`, `active`),
    FULLTEXT KEY `user_username` (`username`)
) ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS `training` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `training_name` varchar(255) NOT NULL,
    `mode` ENUM('physical', 'virtual', 'online') NULL,
    `type` ENUM('project_base', 'organization_base', 'self_training') NULL,
    `requested_by` INT,
    `is_registration_required` BOOLEAN DEFAULT false,
    `tags` varchar(255),
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` INT NULL,
    PRIMARY KEY (`id`),
    INDEX `training_training_name`(`training_name`),
    FOREIGN KEY (`requested_by`) REFERENCES `user`(`id`) ON DELETE NO ACTION,
    FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE NO ACTION,
    FULLTEXT KEY `training_training_name_fulltext` (training_name)
) ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS `training_event` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `fk_training` INT NOT NULL,
    `status` ENUM('completed', 'pending', 'canceled', 'postponed', 'rejected') NOT NULL DEFAULT 'pending',
    `from` DATETIME NOT NULL COMMENT "Active from date",
    `completed_on` DATETIME NOT NULL COMMENT "Active from date",
    `duration` INT,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` INT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`fk_training`) REFERENCES `training`(`id`) ON DELETE NO ACTION,
    FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE NO ACTION
) ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS `students` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `uuid` varchar(255) NOT NULL,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `mobile_phone` varchar(255) NOT NULL,
    `class_name` varchar(255) NOT NULL,
    `designation` varchar(255) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` INT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE NO ACTION,
    UNIQUE `student_id_uniq`(`uuid`, `active`),
    FULLTEXT KEY `student_id` (uuid),
    FULLTEXT KEY `student_name` (`name`),
    FULLTEXT KEY `student_email` (`email`)

) ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS `trainers` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `uuid` varchar(255) NULL,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `mobile_phone` varchar(255) NOT NULL,
    `designation` varchar(255) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` INT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE NO ACTION,
    FULLTEXT KEY `trainer_name` (`name`),
    FULLTEXT KEY `trainer_email` (`email`)
) ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS `trainer_training_mapping` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `fk_training_event` INT NOT NULL,
    `fk_trainer` INT NOT NULL,
    `fk_student` INT NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`fk_training_event`) REFERENCES `training_event`(`id`) ON DELETE NO ACTION,
    FOREIGN KEY (`fk_trainer`) REFERENCES `trainers`(`id`) ON DELETE NO ACTION,
    FOREIGN KEY (`fk_student`) REFERENCES `students`(`id`) ON DELETE NO ACTION
) ENGINE=INNODB;



CREATE TABLE IF NOT EXISTS `registrations` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `fk_student` INT NOT NULL,
    `fk_training` INT NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`fk_training`) REFERENCES `training`(`id`) ON DELETE NO ACTION,
    FOREIGN KEY (`fk_student`) REFERENCES `students`(`id`) ON DELETE NO ACTION
) ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS `attendances` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `fk_training_event` INT NOT NULL,
    `fk_student` INT NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`fk_training_event`) REFERENCES `training_event`(`id`) ON DELETE NO ACTION,
    FOREIGN KEY (`fk_student`) REFERENCES `students`(`id`) ON DELETE NO ACTION
) ENGINE=INNODB;




