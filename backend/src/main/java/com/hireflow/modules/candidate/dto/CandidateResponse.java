package com.hireflow.modules.candidate.dto;

import com.hireflow.modules.candidate.Candidate;
import java.time.Instant;

public class CandidateResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String currentTitle;
    private Integer yearsOfExperience;
    private String skillsSummary;
    private String resumeFilePath;
    private String resumeOriginalFilename;
    private String resumeText;
    private Long recruiterId;
    private String recruiterName;
    private long applicationCount;
    private Instant createdAt;
    private Instant updatedAt;

    public CandidateResponse() {}

    public CandidateResponse(Candidate candidate, long applicationCount) {
        this.id = candidate.getId();
        this.firstName = candidate.getFirstName();
        this.lastName = candidate.getLastName();
        this.fullName = candidate.getFullName();
        this.email = candidate.getEmail();
        this.phone = candidate.getPhone();
        this.location = candidate.getLocation();
        this.currentTitle = candidate.getCurrentTitle();
        this.yearsOfExperience = candidate.getYearsOfExperience();
        this.skillsSummary = candidate.getSkillsSummary();
        this.resumeFilePath = candidate.getResumeFilePath();
        this.resumeOriginalFilename = candidate.getResumeOriginalFilename();
        this.resumeText = candidate.getResumeText();
        if (candidate.getRecruiter() != null) {
            this.recruiterId = candidate.getRecruiter().getId();
            this.recruiterName = candidate.getRecruiter().getFullName();
        }
        this.applicationCount = applicationCount;
        this.createdAt = candidate.getCreatedAt();
        this.updatedAt = candidate.getUpdatedAt();
    }

    public CandidateResponse(Candidate candidate) {
        this(candidate, 0);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCurrentTitle() { return currentTitle; }
    public void setCurrentTitle(String currentTitle) { this.currentTitle = currentTitle; }

    public Integer getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }

    public String getSkillsSummary() { return skillsSummary; }
    public void setSkillsSummary(String skillsSummary) { this.skillsSummary = skillsSummary; }

    public String getResumeFilePath() { return resumeFilePath; }
    public void setResumeFilePath(String resumeFilePath) { this.resumeFilePath = resumeFilePath; }

    public String getResumeOriginalFilename() { return resumeOriginalFilename; }
    public void setResumeOriginalFilename(String resumeOriginalFilename) { this.resumeOriginalFilename = resumeOriginalFilename; }

    public String getResumeText() { return resumeText; }
    public void setResumeText(String resumeText) { this.resumeText = resumeText; }

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
