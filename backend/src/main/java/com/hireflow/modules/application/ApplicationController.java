package com.hireflow.modules.application;

import com.hireflow.common.ApiResponse;
import com.hireflow.common.PagedResponse;
import com.hireflow.modules.application.dto.ApplicationHistoryDto;
import com.hireflow.modules.application.dto.ApplicationRequest;
import com.hireflow.modules.application.dto.ApplicationResponse;
import com.hireflow.modules.application.dto.StageUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@Tag(name = "Applications", description = "Recruitment application tracking and hiring pipeline endpoints")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    @Operation(summary = "Search and filter recruitment applications with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> getApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Long jobId,
            @RequestParam(required = false) ApplicationStage stage,
            @RequestParam(required = false) String keyword) {
        PagedResponse<ApplicationResponse> response = applicationService.getApplications(page, size, sortField, sortDir, jobId, stage, keyword);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/job/{jobId}")
    @Operation(summary = "Get all applications for a specific job (ideal for Kanban pipeline)")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getApplicationsForJob(@PathVariable Long jobId) {
        List<ApplicationResponse> list = applicationService.getApplicationsForJob(jobId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get application details by ID")
    public ResponseEntity<ApiResponse<ApplicationResponse>> getApplicationById(@PathVariable Long id) {
        ApplicationResponse response = applicationService.getApplicationById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @Operation(summary = "Create an application linking candidate to a job")
    public ResponseEntity<ApiResponse<ApplicationResponse>> createApplication(@Valid @RequestBody ApplicationRequest request) {
        ApplicationResponse response = applicationService.createApplication(request);
        return ResponseEntity.ok(ApiResponse.success("Application created successfully", response));
    }

    @PatchMapping("/{id}/stage")
    @Operation(summary = "Advance or update application stage with transition validation")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateStage(
            @PathVariable Long id,
            @Valid @RequestBody StageUpdateRequest request) {
        ApplicationResponse response = applicationService.updateStage(id, request);
        return ResponseEntity.ok(ApiResponse.success("Application stage updated successfully", response));
    }

    @GetMapping("/{id}/history")
    @Operation(summary = "Get timestamped stage change history for an application")
    public ResponseEntity<ApiResponse<List<ApplicationHistoryDto>>> getApplicationHistory(@PathVariable Long id) {
        List<ApplicationHistoryDto> history = applicationService.getApplicationHistory(id);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
