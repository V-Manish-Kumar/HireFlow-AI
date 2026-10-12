package com.hireflow.modules.candidate;

import com.hireflow.common.ApiResponse;
import com.hireflow.common.PagedResponse;
import com.hireflow.modules.candidate.dto.CandidateRequest;
import com.hireflow.modules.candidate.dto.CandidateResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/candidates")
@Tag(name = "Candidates", description = "Candidate talent directory and resume management endpoints")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @GetMapping
    @Operation(summary = "Search and filter candidate profiles with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<CandidateResponse>>> getCandidates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Integer minExperience,
            @RequestParam(required = false) String keyword) {
        PagedResponse<CandidateResponse> response = candidateService.getCandidates(page, size, sortField, sortDir, minExperience, keyword);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get candidate profile details by ID")
    public ResponseEntity<ApiResponse<CandidateResponse>> getCandidateById(@PathVariable Long id) {
        CandidateResponse response = candidateService.getCandidateById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @Operation(summary = "Create a new candidate profile")
    public ResponseEntity<ApiResponse<CandidateResponse>> createCandidate(@Valid @RequestBody CandidateRequest request) {
        CandidateResponse response = candidateService.createCandidate(request);
        return ResponseEntity.ok(ApiResponse.success("Candidate created successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing candidate profile")
    public ResponseEntity<ApiResponse<CandidateResponse>> updateCandidate(
            @PathVariable Long id,
            @Valid @RequestBody CandidateRequest request) {
        CandidateResponse response = candidateService.updateCandidate(id, request);
        return ResponseEntity.ok(ApiResponse.success("Candidate updated successfully", response));
    }

    @PostMapping(value = "/{id}/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload PDF resume and trigger text extraction")
    public ResponseEntity<ApiResponse<CandidateResponse>> uploadResume(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        CandidateResponse response = candidateService.uploadResume(id, file);
        return ResponseEntity.ok(ApiResponse.success("Resume uploaded and parsed successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a candidate profile")
    public ResponseEntity<ApiResponse<Void>> deleteCandidate(@PathVariable Long id) {
        candidateService.deleteCandidate(id);
        return ResponseEntity.ok(ApiResponse.success("Candidate deleted successfully", null));
    }
}
