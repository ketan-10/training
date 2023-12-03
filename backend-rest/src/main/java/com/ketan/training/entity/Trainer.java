package com.ketan.training.entity;

import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@SQLRestriction("active=true")
@Table(name = "trainer", indexes = { @Index(columnList = "name", name = "trainer_name"),
        @Index(columnList = "email", name = "trainer_email") })
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "uuid", nullable = false)
    private String uuid;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(name = "mobile_phone", nullable = false)
    private String mobilePhone;

    @Column(nullable = false)
    private String designation;

    private Boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "created_by", referencedColumnName = "id")
    private User user;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "trainer", cascade = CascadeType.ALL)
    private List<TrainerTrainingMapping> TrainerTrainingMappings;

    @PrePersist
    @PreUpdate
    void setDefaults() {
        if (this.active == null) {
            this.active = true;
        }
    }
}
