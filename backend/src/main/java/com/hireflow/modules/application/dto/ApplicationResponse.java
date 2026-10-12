package com.hireflow.modules.application.dto;

import com.hireflow.modules.application.Application;
import com.hireflow.modules.application.ApplicationStage;
import java.time.Instant;

public class ApplicationResponse {
    private Long id;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String candidateTitle;
    private Integer candidateExperience;
    private String candidateSkills;
    private Long jobId;
    private String jobTitle;
    private String jobDepartment;
    private String jobLocation;
    private String jobRequiredSkills;
    private Long recruiterId;
    private String recruiterName;
    private ApplicationStage stage;
    private Instant interviewDate;
    private String notes;
    private Integer matchScore;
    private Instant createdAt;
    private Instant updatedAt;

    public ApplicationResponse() {}

    public ApplicationResponse(Application app, Integer matchScore) {
        this.id = app.getId();
        if (app.getCandidate() != null) {
            this.candidateId = app.getCandidate().getId();
            this.candidateName = app.getCandidate().getFullName();
            this.candidateEmail = app.getCandidate().getEmail();
            this.candidateTitle = app.getCandidate().getCurrentTitle();
            this.candidateExperience = app.getCandidate().getYearsOfExperience();
            this.candidateSkills = app.getCandidate().getSkillsSummary();
        }
        if (app.getJob() != null) {
            this.jobId = app.getJob().getId();
            this.jobTitle = app.getJob().getTitle();
            this.jobDepartment = app.getJob().getDepartment();
            this.jobLocation = app.getJob().getLocation();
            this.jobRequiredSkills = app.getJob().getRequiredSkills();
        }
        if (app.getRecruiter() != null) {
            this.recruiterId = app.getRecruiter().getId();
            this.recruiterName = app.getRecruiter().getFullName();
        }
        this.stage = app.getStage();
        this.interviewDate = app.getInterviewDate();
        this.notes = app.getNotes();
        this.matchScore = matchScore;
        this.createdAt = app.getCreatedAt();
        this.updatedAt = app.getUpdatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCandidateId() { return candidateId; }
    public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }

    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

    public String getCandidateEmail() { return candidateEmail; }
    public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }

    public String getCandidateTitle() { return candidateTitle; }
    public void setCandidateTitle(String candidateTitle) { this.candidateTitle = candidateTitle; }

    public Integer getCandidateExperience() { return candidateExperience; }
    public void setCandidateExperience(Integer candidateExperience) { this.candidateExperience = candidateExperience; }

    public String getCandidateSkills() { return candidateSkills; }
    public void setCandidateSkills(String candidateSkills) { this.candidateSkills = candidateSkills; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getJobDepartment() { return jobDepartment; }
    public void setJobDepartment(String jobDepartment) { this.jobDepartment = jobDepartment; }

    public String getJobLocation() { return jobLocation; }
    public void setJobLocation(String jobLocation) { this.jobLocation = jobLocation; }

    public String getJobRequiredSkills() { return jobRequiredSkills; }
    public void setJobRequiredSkills(String jobRequiredSkills) { this.jobRequiredSkills = jobRequiredSkills; }

    public Long getRecruiterId() { return recruiterId; }
    public void setRecruiterId(Long recruiterId) { this.recruiterId = recruiterId; }

    public String getRecruiterName() { return recruiterName; }
    public void setRecruiterName(String recruiterName) { this.recruiterName = recruiterName; }

    public ApplicationStage getStage() { return stage; }
    public void setStage(ApplicationStage stage) { this.stage = stage; }

    public Instant getInterviewDate() { return interviewDate; }
    public void setInterviewDate(Instant interviewDate) { this.interviewDate = interviewDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Integer getMatchScore() { return matchScore; }
    public void setMatchScore(Integer matchScore) { this.matchScore = matchScore; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
