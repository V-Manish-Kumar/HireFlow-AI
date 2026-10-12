package com.hireflow.modules.job.dto;

import com.hireflow.modules.job.EmploymentType;
import com.hireflow.modules.job.Job;
import com.hireflow.modules.job.JobStatus;

import java.time.Instant;

public class JobResponse {
    private Long id;
    private String title;
    private String department;
    private String location;
    private EmploymentType employmentType;
    private String description;
    private String responsibilities;
    private String requiredSkills;
    private String preferredSkills;
    private Integer minExperienceYears;
    private JobStatus status;
    private Long recruiterId;
    private String recruiterName;
    private long applicationCount;
    private Instant createdAt;
    private Instant updatedAt;

    public JobResponse() {}

    public JobResponse(Job job, long applicationCount) {
        this.id = job.getId();
        this.title = job.getTitle();
        this.department = job.getDepartment();
        this.location = job.getLocation();
        this.employmentType = job.getEmploymentType();
        this.description = job.getDescription();
        this.responsibilities = job.getResponsibilities();
        this.requiredSkills = job.getRequiredSkills();
        this.preferredSkills = job.getPreferredSkills();
        this.minExperienceYears = job.getMinExperienceYears();
        this.status = job.getStatus();
        if (job.getRecruiter() != null) {
            this.recruiterId = job.getRecruiter().getId();
            this.recruiterName = job.getRecruiter().getFullName();
        }
        this.applicationCount = applicationCount;
        this.createdAt = job.getCreatedAt();
        this.updatedAt = job.getUpdatedAt();
    }

    public JobResponse(Job job) {
        this(job, 0);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public EmploymentType getEmploymentType() { return employmentType; }
    public void setEmploymentType(EmploymentType employmentType) { this.employmentType = employmentType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getResponsibilities() { return responsibilities; }
    public void setResponsibilities(String responsibilities) { this.responsibilities = responsibilities; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getPreferredSkills() { return preferredSkills; }
    public void setPreferredSkills(String preferredSkills) { this.preferredSkills = preferredSkills; }

    public Integer getMinExperienceYears() { return minExperienceYears; }
    public void setMinExperienceYears(Integer minExperienceYears) { this.minExperienceYears = minExperienceYears; }

    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }

    public Long getRecruiterId() { return recruiterId; }
    public void setRecruiterId(Long recruiterId) { this.recruiterId = recruiterId; }

    public String getRecruiterName() { return recruiterName; }
    public void setRecruiterName(String recruiterName) { this.recruiterName = recruiterName; }

    public long getApplicationCount() { return applicationCount; }
    public void setApplicationCount(long applicationCount) { this.applicationCount = applicationCount; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
