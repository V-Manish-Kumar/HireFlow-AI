package com.hireflow.modules.ai.dto;

import com.hireflow.modules.ai.MatchResult;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class MatchResultDto {
    private Long id;
    private Long applicationId;
    private Long candidateId;
    private Long jobId;
    private Integer overallScore;
    private Integer skillsScore;
    private Integer experienceScore;
    private List<String> matchingRequiredSkills;
    private List<String> missingRequiredSkills;
    private List<String> matchingPreferredSkills;
    private String summary;
    private List<String> interviewQuestions;
    private String provider;
    private String algorithmVersion;
    private String disclaimer = "Match scores are decision-support estimates based on algorithmic analysis of skills and experience, not objective probabilities of job success or hiring decisions.";
    private Instant createdAt;

    public MatchResultDto() {}

    public MatchResultDto(MatchResult entity) {
        this.id = entity.getId();
        if (entity.getApplication() != null) this.applicationId = entity.getApplication().getId();
        if (entity.getCandidate() != null) this.candidateId = entity.getCandidate().getId();
        if (entity.getJob() != null) this.jobId = entity.getJob().getId();
        this.overallScore = entity.getOverallScore();
        this.skillsScore = entity.getSkillsScore();
        this.experienceScore = entity.getExperienceScore();
        this.matchingRequiredSkills = splitToList(entity.getMatchingRequiredSkills());
        this.missingRequiredSkills = splitToList(entity.getMissingRequiredSkills());
        this.matchingPreferredSkills = splitToList(entity.getMatchingPreferredSkills());
        this.summary = entity.getSummary();
        this.interviewQuestions = splitToList(entity.getInterviewQuestions());
        this.provider = entity.getProvider();
        this.algorithmVersion = entity.getAlgorithmVersion();
        this.createdAt = entity.getCreatedAt();
    }

    private static List<String> splitToList(String text) {
        if (text == null || text.trim().isEmpty()) return Collections.emptyList();
        return Arrays.stream(text.split(";"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public Long getCandidateId() { return candidateId; }
    public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }

    public Integer getSkillsScore() { return skillsScore; }
    public void setSkillsScore(Integer skillsScore) { this.skillsScore = skillsScore; }

    public Integer getExperienceScore() { return experienceScore; }
    public void setExperienceScore(Integer experienceScore) { this.experienceScore = experienceScore; }

    public List<String> getMatchingRequiredSkills() { return matchingRequiredSkills; }
    public void setMatchingRequiredSkills(List<String> matchingRequiredSkills) { this.matchingRequiredSkills = matchingRequiredSkills; }

    public List<String> getMissingRequiredSkills() { return missingRequiredSkills; }
    public void setMissingRequiredSkills(List<String> missingRequiredSkills) { this.missingRequiredSkills = missingRequiredSkills; }

    public List<String> getMatchingPreferredSkills() { return matchingPreferredSkills; }
    public void setMatchingPreferredSkills(List<String> matchingPreferredSkills) { this.matchingPreferredSkills = matchingPreferredSkills; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<String> getInterviewQuestions() { return interviewQuestions; }
    public void setInterviewQuestions(List<String> interviewQuestions) { this.interviewQuestions = interviewQuestions; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getAlgorithmVersion() { return algorithmVersion; }
    public void setAlgorithmVersion(String algorithmVersion) { this.algorithmVersion = algorithmVersion; }

    public String getDisclaimer() { return disclaimer; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
