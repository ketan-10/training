package com.ketan.training.entity;

import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;
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
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

import com.ketan.training.entity.enums.TrainingEventMode;
import com.ketan.training.entity.enums.TrainingEventType;
import com.ketan.training.entity.enums.TrainingLevel;
import com.ketan.training.entity.enums.TrainingScope;
import com.ketan.training.entity.enums.TrainingStatus;
import com.ketan.training.entity.enums.TrainingUrgency;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@SQLRestriction("active=true")
@Table(name = "training")
@Audited
public class Training {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "training_name")
    private String trainingName;

    @Column(name = "participants_count")
    private Integer participantsCount;

    @Enumerated(EnumType.STRING)
    private TrainingLevel level;

    @Column(name = "participants_file_path")
    private String participantsFilePath;

    @Column(name = "syllabus_file_path")
    private String syllabusFilePath;

    @Enumerated(EnumType.STRING)
    private TrainingUrgency urgency;

    @Enumerated(EnumType.STRING)
    private TrainingEventMode mode;

    @Enumerated(EnumType.STRING)
    private TrainingEventType type;

    @Column(name = "description")
    private String description;

    private String schedule;

    @Enumerated(EnumType.STRING)
    private TrainingStatus status = TrainingStatus.REQUESTED;

    @Column(name = "category")
    private String category;

    @Column(name = "is_registration_required")
    private Boolean isRegistrationRequired = false;

    @Column(name = "category_sub")
    private String categorySub;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "no_of_hours")
    private Integer noOfHours;

    private String tags;

    private Boolean active = true;

    // TODO temporary to be moved to TrainingEvent table
    private String trainer;

    // TODO temporary to be moved to TrainingEvent table
    private String moderator;

    // TODO temporary to be moved to TrainingEvent table
    private String link;

    // TODO temporary to be moved to Comments table
    private String remarks;

    @CreationTimestamp
    @Column(name = "created_at")
    private Date createdAt;

    private String attendancePath;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(name = "approval_mail_attachment_file")
    private String approvalMailAttachmentFile;

    @ManyToOne(fetch = FetchType.EAGER)
    @NotAudited
    @JoinColumn(nullable = false, name = "created_by", referencedColumnName = "id")
    private User createdBy;

    @OneToMany(mappedBy = "training", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @NotAudited
    private List<Registration> registrations;

    @OneToMany(mappedBy = "training", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @NotAudited
    private List<TrainingEvent> TrainingEvents;

    @Column(name = "other_training_event")
    private String otherTrainingEvent;

    @Column(name = "training_scope")
    @Enumerated(EnumType.STRING)
    private TrainingScope trainingScope;

    @Column(name = "start_date")
    private Date startDate;

    @PrePersist
    @PreUpdate
    void setDefaults() {
        if (this.active == null) {
            this.active = true;
        }
    }
}
