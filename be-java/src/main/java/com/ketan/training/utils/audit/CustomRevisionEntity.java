package com.ketan.training.utils.audit;

import org.hibernate.envers.DefaultRevisionEntity;
import org.hibernate.envers.RevisionEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@RevisionEntity(CustomRevisionListener.class)
@Table(name = "audit_info")
public class CustomRevisionEntity extends DefaultRevisionEntity {

    private String modifiedBy;

    public String getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
    }
}
