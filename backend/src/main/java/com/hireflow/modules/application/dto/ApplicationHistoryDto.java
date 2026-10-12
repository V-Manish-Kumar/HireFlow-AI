package com.hireflow.modules.application.dto;

import com.hireflow.modules.application.ApplicationStage;
import com.hireflow.modules.application.ApplicationStageHistory;
import java.time.Instant;

public class ApplicationHistoryDto {
    private Long id;
    private ApplicationStage fromStage;
    private ApplicationStage toStage;
    private String changedByName;
    private String comments;
    private Instant createdAt;

    public ApplicationHistoryDto() {}

    public ApplicationHistoryDto(ApplicationStageHistory entity) {
        this.id = entity.getId();
        this.fromStage = entity.getFromStage();
        this.toStage = entity.getToStage();
        if (entity.getChangedBy() != null) {
            this.changedByName = entity.getChangedBy().getFullName();
        }
        this.comments = entity.getComments();
        this.createdAt = entity.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ApplicationStage getFromStage() { return fromStage; }
    public void setFromStage(ApplicationStage fromStage) { this.fromStage = fromStage; }

    public ApplicationStage getToStage() { return toStage; }
    public void setToStage(ApplicationStage toStage) { this.toStage = toStage; }

    public String getChangedByName() { return changedByName; }
    public void setChangedByName(String changedByName) { this.changedByName = changedByName; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
