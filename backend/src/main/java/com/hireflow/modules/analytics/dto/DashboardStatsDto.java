package com.hireflow.modules.analytics.dto;

import com.hireflow.modules.application.dto.ApplicationResponse;
import com.hireflow.modules.audit.dto.AuditEventDto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalActiveJobs;
    private long totalCandidates;
    private long totalApplications;
    private long interviewsScheduled;
    private double hiringConversionRate;
    private Map<String, Long> applicationsByStage;
    private List<ApplicationResponse> recentApplications;
    private List<AuditEventDto> recentActivity;

    public DashboardStatsDto() {}

    public long getTotalActiveJobs() { return totalActiveJobs; }
    public void setTotalActiveJobs(long totalActiveJobs) { this.totalActiveJobs = totalActiveJobs; }

    public long getTotalCandidates() { return totalCandidates; }
    public void setTotalCandidates(long totalCandidates) { this.totalCandidates = totalCandidates; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public long getInterviewsScheduled() { return interviewsScheduled; }
    public void setInterviewsScheduled(long interviewsScheduled) { this.interviewsScheduled = interviewsScheduled; }

    public double getHiringConversionRate() { return hiringConversionRate; }
    public void setHiringConversionRate(double hiringConversionRate) { this.hiringConversionRate = hiringConversionRate; }

    public Map<String, Long> getApplicationsByStage() { return applicationsByStage; }
    public void setApplicationsByStage(Map<String, Long> applicationsByStage) { this.applicationsByStage = applicationsByStage; }

    public List<ApplicationResponse> getRecentApplications() { return recentApplications; }
    public void setRecentApplications(List<ApplicationResponse> recentApplications) { this.recentApplications = recentApplications; }

    public List<AuditEventDto> getRecentActivity() { return recentActivity; }
    public void setRecentActivity(List<AuditEventDto> recentActivity) { this.recentActivity = recentActivity; }
}
