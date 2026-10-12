package com.hireflow.modules.job;

import com.hireflow.common.ApiResponse;
import com.hireflow.common.PagedResponse;
import com.hireflow.modules.job.dto.JobRequest;
import com.hireflow.modules.job.dto.JobResponse;
import com.hireflow.modules.job.dto.JobStatusUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Jobs", description = "Job opening lifecycle and management endpoints")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    @Operation(summary = "Search and filter job postings with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> getJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) JobStatus status,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String keyword) {
        PagedResponse<JobResponse> response = jobService.getJobs(page, size, sortField, sortDir, status, department, keyword);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get job posting details by ID")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable Long id) {
        JobResponse response = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @Operation(summary = "Create a new job posting")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(@Valid @RequestBody JobRequest request) {
        JobResponse response = jobService.createJob(request);
        return ResponseEntity.ok(ApiResponse.success("Job created successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing job posting")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request) {
        JobResponse response = jobService.updateJob(id, request);
        return ResponseEntity.ok(ApiResponse.success("Job updated successfully", response));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update job status (DRAFT, OPEN, CLOSED)")
    public ResponseEntity<ApiResponse<JobResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody JobStatusUpdateRequest request) {
        JobResponse response = jobService.updateStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Job status updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a job posting")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(ApiResponse.success("Job deleted successfully", null));
    }

    @GetMapping("/departments")
    @Operation(summary = "List all existing distinct job departments")
    public ResponseEntity<ApiResponse<List<String>>> getDepartments() {
        List<String> departments = jobService.getDepartments();
        return ResponseEntity.ok(ApiResponse.success(departments));
    }
}
