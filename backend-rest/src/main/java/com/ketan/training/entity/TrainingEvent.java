package com.ketan.training.entity;

import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;
import com.ketan.training.entity.enums.TrainingEventStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
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
@Table(name = "training_event")
public class TrainingEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "fk_training", referencedColumnName = "id")
    private Training training;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "created_by", referencedColumnName = "id")
    private User createdBy;

    @OneToMany(mappedBy = "trainingEvent", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Attendance> attendances;

    @OneToMany(mappedBy = "trainingEvent", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<TrainerTrainingMapping> trainerTrainingMappings;

    @Enumerated(EnumType.STRING)
    private TrainingEventStatus status = TrainingEventStatus.PENDING;

    @Column(nullable = false, name = "from_time")
    private Date from;

    @Column(nullable = false, name = "to_time")
    private Date to;

    @Column(name = "completed_on")
    private Date completedOn;

    private Integer duration;

    private Boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    @PrePersist
    @PreUpdate
    void setDefaults() {
        if (this.active == null)
            this.active = true;
        if (this.status == null)
            this.status = TrainingEventStatus.PENDING;
    }
}
