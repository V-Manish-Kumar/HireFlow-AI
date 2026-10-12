package com.hireflow.modules.application.dto;

import com.hireflow.modules.application.ApplicationStage;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public class StageUpdateRequest {

    @NotNull(message = "Stage is required")
    private ApplicationStage stage;

    private String comments;
    private Instant interviewDate;

    public StageUpdateRequest() {}

    public StageUpdateRequest(ApplicationStage stage, String comments, Instant interviewDate) {
        this.stage = stage;
        this.comments = comments;
        this.interviewDate = interviewDate;
    }

    public ApplicationStage getStage() { return stage; }
    public void setStage(ApplicationStage stage) { this.stage = stage; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public Instant getInterviewDate() { return interviewDate; }
    public void setInterviewDate(Instant interviewDate) { this.interviewDate = interviewDate; }
}
