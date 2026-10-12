package com.hireflow.modules.ai;

import com.hireflow.modules.application.Application;
import com.hireflow.modules.candidate.Candidate;
import com.hireflow.modules.job.Job;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "match_results")
public class MatchResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "overall_score", nullable = false)
    private Integer overallScore;

    @Column(name = "skills_score", nullable = false)
    private Integer skillsScore;

    @Column(name = "experience_score", nullable = false)
    private Integer experienceScore;

    @Column(name = "matching_required_skills", columnDefinition = "TEXT")
    private String matchingRequiredSkills;

    @Column(name = "missing_required_skills", columnDefinition = "TEXT")
    private String missingRequiredSkills;

    @Column(name = "matching_preferred_skills", columnDefinition = "TEXT")
    private String matchingPreferredSkills;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "interview_questions", columnDefinition = "TEXT")
    private String interviewQuestions;

    @Column(nullable = false)
    private String provider = "BASELINE";

    @Column(name = "algorithm_version", nullable = false)
    private String algorithmVersion = "v1.0-deterministic";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public MatchResult() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public Candidate getCandidate() { return candidate; }
    public void setCandidate(Candidate candidate) { this.candidate = candidate; }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }

    public Integer getSkillsScore() { return skillsScore; }
    public void setSkillsScore(Integer skillsScore) { this.skillsScore = skillsScore; }

    public Integer getExperienceScore() { return experienceScore; }
    public void setExperienceScore(Integer experienceScore) { this.experienceScore = experienceScore; }

    public String getMatchingRequiredSkills() { return matchingRequiredSkills; }
    public void setMatchingRequiredSkills(String matchingRequiredSkills) { this.matchingRequiredSkills = matchingRequiredSkills; }

    public String getMissingRequiredSkills() { return missingRequiredSkills; }
    public void setMissingRequiredSkills(String missingRequiredSkills) { this.missingRequiredSkills = missingRequiredSkills; }

    public String getMatchingPreferredSkills() { return matchingPreferredSkills; }
    public void setMatchingPreferredSkills(String matchingPreferredSkills) { this.matchingPreferredSkills = matchingPreferredSkills; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getInterviewQuestions() { return interviewQuestions; }
    public void setInterviewQuestions(String interviewQuestions) { this.interviewQuestions = interviewQuestions; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getAlgorithmVersion() { return algorithmVersion; }
    public void setAlgorithmVersion(String algorithmVersion) { this.algorithmVersion = algorithmVersion; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
