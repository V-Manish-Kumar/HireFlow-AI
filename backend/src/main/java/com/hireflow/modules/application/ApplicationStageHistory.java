package com.hireflow.modules.application;

import com.hireflow.modules.user.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "application_stage_history")
public class ApplicationStageHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_stage")
    private ApplicationStage fromStage;

    @Enumerated(EnumType.STRING)
    @Column(name = "to_stage", nullable = false)
    private ApplicationStage toStage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by")
    private User changedBy;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public ApplicationStageHistory() {}

    public ApplicationStageHistory(Application application, ApplicationStage fromStage, ApplicationStage toStage, User changedBy, String comments) {
        this.application = application;
        this.fromStage = fromStage;
        this.toStage = toStage;
        this.changedBy = changedBy;
        this.comments = comments;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public ApplicationStage getFromStage() { return fromStage; }
    public void setFromStage(ApplicationStage fromStage) { this.fromStage = fromStage; }

    public ApplicationStage getToStage() { return toStage; }
    public void setToStage(ApplicationStage toStage) { this.toStage = toStage; }

    public User getChangedBy() { return changedBy; }
    public void setChangedBy(User changedBy) { this.changedBy = changedBy; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
