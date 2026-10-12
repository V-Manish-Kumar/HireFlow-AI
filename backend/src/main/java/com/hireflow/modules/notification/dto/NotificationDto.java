package com.hireflow.modules.notification.dto;

import com.hireflow.modules.notification.Notification;
import com.hireflow.modules.notification.NotificationType;
import java.time.Instant;

public class NotificationDto {
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private boolean read;
    private String linkUrl;
    private Instant createdAt;

    public NotificationDto() {}

    public NotificationDto(Notification entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.message = entity.getMessage();
        this.type = entity.getType();
        this.read = entity.isRead();
        this.linkUrl = entity.getLinkUrl();
        this.createdAt = entity.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public String getLinkUrl() { return linkUrl; }
    public void setLinkUrl(String linkUrl) { this.linkUrl = linkUrl; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
