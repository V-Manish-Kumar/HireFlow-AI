package com.hireflow.modules.audit.dto;

import com.hireflow.modules.audit.AuditEvent;
import java.time.Instant;

public class AuditEventDto {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String action;
    private String entityType;
    private Long entityId;
    private String details;
    private String ipAddress;
    private Instant createdAt;

    public AuditEventDto() {}

    public AuditEventDto(AuditEvent entity) {
        this.id = entity.getId();
        if (entity.getUser() != null) {
            this.userId = entity.getUser().getId();
            this.userName = entity.getUser().getFullName();
            this.userEmail = entity.getUser().getEmail();
        }
        this.action = entity.getAction();
        this.entityType = entity.getEntityType();
        this.entityId = entity.getEntityId();
        this.details = entity.getDetails();
        this.ipAddress = entity.getIpAddress();
        this.createdAt = entity.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
