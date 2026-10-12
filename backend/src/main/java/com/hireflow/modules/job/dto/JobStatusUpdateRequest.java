package com.hireflow.modules.job.dto;

import com.hireflow.modules.job.JobStatus;
import jakarta.validation.constraints.NotNull;

public class JobStatusUpdateRequest {

    @NotNull(message = "Job status is required")
    private JobStatus status;

    public JobStatusUpdateRequest() {}

    public JobStatusUpdateRequest(JobStatus status) {
        this.status = status;
    }

    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }
}
