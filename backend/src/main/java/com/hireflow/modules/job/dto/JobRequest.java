package com.hireflow.modules.job.dto;

import com.hireflow.modules.job.EmploymentType;
import com.hireflow.modules.job.JobStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class JobRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Employment type is required")
    private EmploymentType employmentType = EmploymentType.FULL_TIME;

    @NotBlank(message = "Description is required")
    private String description;

    private String responsibilities;

    @NotBlank(message = "Required skills are required")
    private String requiredSkills;

    private String preferredSkills;

    @Min(value = 0, message = "Minimum experience must be 0 or greater")
    private Integer minExperienceYears = 0;

    private JobStatus status = JobStatus.OPEN;

    public JobRequest() {}

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
}
