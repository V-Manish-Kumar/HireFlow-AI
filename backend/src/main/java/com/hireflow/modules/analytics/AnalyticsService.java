package com.hireflow.modules.analytics;

import com.hireflow.modules.analytics.dto.ApplicationTrendDto;
import com.hireflow.modules.analytics.dto.DashboardStatsDto;
import com.hireflow.modules.analytics.dto.PipelineFunnelDto;
import com.hireflow.modules.application.Application;
import com.hireflow.modules.application.ApplicationRepository;
import com.hireflow.modules.application.ApplicationService;
import com.hireflow.modules.application.ApplicationStage;
import com.hireflow.modules.application.dto.ApplicationResponse;
import com.hireflow.modules.audit.AuditEvent;
import com.hireflow.modules.audit.AuditEventRepository;
import com.hireflow.modules.audit.dto.AuditEventDto;
import com.hireflow.modules.candidate.CandidateRepository;
import com.hireflow.modules.job.JobRepository;
import com.hireflow.modules.job.JobStatus;
import com.hireflow.modules.user.User;
import com.hireflow.modules.user.UserService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final JobRepository jobRepository;
    private final CandidateRepository candidateRepository;
    private final ApplicationRepository applicationRepository;
    private final AuditEventRepository auditEventRepository;
    private final ApplicationService applicationService;
    private final UserService userService;

    public AnalyticsService(JobRepository jobRepository,
                            CandidateRepository candidateRepository,
                            ApplicationRepository applicationRepository,
                            AuditEventRepository auditEventRepository,
                            ApplicationService applicationService,
                            UserService userService) {
        this.jobRepository = jobRepository;
        this.candidateRepository = candidateRepository;
        this.applicationRepository = applicationRepository;
        this.auditEventRepository = auditEventRepository;
        this.applicationService = applicationService;
        this.userService = userService;
    }

    public DashboardStatsDto getDashboardStats() {
        User currentUser = userService.getCurrentUser();

        long activeJobs = jobRepository.countByStatus(JobStatus.OPEN);
        long candidates = candidateRepository.count();
        long totalApplications = applicationRepository.count();
        long interviewsScheduled = applicationRepository.countByStage(ApplicationStage.INTERVIEW);
        long hiredCount = applicationRepository.countByStage(ApplicationStage.HIRED);

        double conversionRate = totalApplications > 0
                ? Math.round(((double) hiredCount / totalApplications) * 1000.0) / 10.0
                : 0.0;

        // Stage breakdown via DB aggregation
        List<Object[]> stageCounts = applicationRepository.countApplicationsByStage(null);
        Map<String, Long> stageMap = new LinkedHashMap<>();
        for (ApplicationStage stage : ApplicationStage.values()) {
            stageMap.put(stage.name(), 0L);
        }
        for (Object[] row : stageCounts) {
            ApplicationStage stage = (ApplicationStage) row[0];
            Long count = (Long) row[1];
            stageMap.put(stage.name(), count);
        }

        // Recent 5 applications
        List<ApplicationResponse> recentApps = applicationService.getApplications(
                0, 5, "createdAt", "desc", null, null, null
        ).getContent();

        // Recent 5 activity logs
        List<AuditEventDto> recentActivity = auditEventRepository.findAllByOrderByCreatedAtDesc(
                PageRequest.of(0, 5)
        ).getContent().stream().map(AuditEventDto::new).toList();

        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setTotalActiveJobs(activeJobs);
        stats.setTotalCandidates(candidates);
        stats.setTotalApplications(totalApplications);
        stats.setInterviewsScheduled(interviewsScheduled);
        stats.setHiringConversionRate(conversionRate);
        stats.setApplicationsByStage(stageMap);
        stats.setRecentApplications(recentApps);
        stats.setRecentActivity(recentActivity);

        return stats;
    }

    public List<PipelineFunnelDto> getPipelineFunnel() {
        long total = applicationRepository.count();
        List<Object[]> stageCounts = applicationRepository.countApplicationsByStage(null);

        Map<ApplicationStage, Long> map = new EnumMap<>(ApplicationStage.class);
        for (Object[] row : stageCounts) {
            map.put((ApplicationStage) row[0], (Long) row[1]);
        }

        ApplicationStage[] funnelOrder = {
                ApplicationStage.APPLIED,
                ApplicationStage.SCREENING,
                ApplicationStage.SHORTLISTED,
                ApplicationStage.INTERVIEW,
                ApplicationStage.OFFER,
                ApplicationStage.HIRED
        };

        List<PipelineFunnelDto> funnel = new ArrayList<>();
        for (ApplicationStage stage : funnelOrder) {
            long count = map.getOrDefault(stage, 0L);
            double pct = total > 0 ? Math.round(((double) count / total) * 1000.0) / 10.0 : 0.0;
            funnel.add(new PipelineFunnelDto(stage.name(), count, pct));
        }

        return funnel;
    }

    public List<ApplicationTrendDto> getApplicationTrends() {
        // Query recent applications to group by month
        List<Application> apps = applicationRepository.findAll(Sort.by(Sort.Direction.ASC, "createdAt"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy").withZone(ZoneId.systemDefault());

        Map<String, long[]> monthly = new LinkedHashMap<>();

        // Initialize last 6 months buckets
        for (Application app : apps) {
            String month = formatter.format(app.getCreatedAt());
            monthly.putIfAbsent(month, new long[]{0, 0});
            monthly.get(month)[0]++; // total
            if (app.getStage() == ApplicationStage.HIRED) {
                monthly.get(month)[1]++; // hired
            }
        }

        List<ApplicationTrendDto> trends = new ArrayList<>();
        monthly.forEach((period, counts) -> {
            trends.add(new ApplicationTrendDto(period, counts[0], counts[1]));
        });

        if (trends.isEmpty()) {
            trends.add(new ApplicationTrendDto("Current", 0, 0));
        }

        return trends;
    }

    public List<Map<String, Object>> getApplicationsByJob() {
        List<Object[]> rows = applicationRepository.countApplicationsByJob(null);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> item = new HashMap<>();
            item.put("jobId", row[0]);
            item.put("jobTitle", row[1]);
            item.put("applicationCount", row[2]);
            result.add(item);
        }
        return result;
    }
}
