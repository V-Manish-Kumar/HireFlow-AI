package com.hireflow.modules.analytics;

import com.hireflow.common.ApiResponse;
import com.hireflow.modules.analytics.dto.ApplicationTrendDto;
import com.hireflow.modules.analytics.dto.DashboardStatsDto;
import com.hireflow.modules.analytics.dto.PipelineFunnelDto;
import com.hireflow.modules.audit.AuditService;
import com.hireflow.modules.audit.dto.AuditEventDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Analytics & Dashboard", description = "Recruitment dashboard stats and funnel analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final AuditService auditService;

    public AnalyticsController(AnalyticsService analyticsService, AuditService auditService) {
        this.analyticsService = analyticsService;
        this.auditService = auditService;
    }

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get overall recruiter dashboard stats from database queries")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        DashboardStatsDto stats = analyticsService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/dashboard/activity")
    @Operation(summary = "Get recent recruiter activity log")
    public ResponseEntity<ApiResponse<List<AuditEventDto>>> getRecentActivity(@RequestParam(defaultValue = "10") int limit) {
        List<AuditEventDto> activity = auditService.getAuditEvents(0, limit).getContent();
        return ResponseEntity.ok(ApiResponse.success(activity));
    }

    @GetMapping("/analytics/pipeline")
    @Operation(summary = "Get recruitment pipeline funnel breakdown")
    public ResponseEntity<ApiResponse<List<PipelineFunnelDto>>> getPipelineFunnel() {
        List<PipelineFunnelDto> funnel = analyticsService.getPipelineFunnel();
        return ResponseEntity.ok(ApiResponse.success(funnel));
    }

    @GetMapping("/analytics/applications-over-time")
    @Operation(summary = "Get monthly application trends")
    public ResponseEntity<ApiResponse<List<ApplicationTrendDto>>> getApplicationTrends() {
        List<ApplicationTrendDto> trends = analyticsService.getApplicationTrends();
        return ResponseEntity.ok(ApiResponse.success(trends));
    }

    @GetMapping("/analytics/jobs")
    @Operation(summary = "Get application distribution across jobs")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getApplicationsByJob() {
        List<Map<String, Object>> jobs = analyticsService.getApplicationsByJob();
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }
}
