package com.hireflow.modules.ai;

import com.hireflow.common.ApiResponse;
import com.hireflow.modules.ai.dto.MatchResultDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Tag(name = "AI Candidate Matching", description = "AI matching analysis and explainability endpoints")
public class AiMatchingController {

    private final AiMatchingService aiMatchingService;

    public AiMatchingController(AiMatchingService aiMatchingService) {
        this.aiMatchingService = aiMatchingService;
    }

    @PostMapping("/applications/{id}/match")
    @Operation(summary = "Run AI candidate matching analysis on an application")
    public ResponseEntity<ApiResponse<MatchResultDto>> matchApplication(@PathVariable Long id) {
        MatchResultDto result = aiMatchingService.matchApplication(id);
        return ResponseEntity.ok(ApiResponse.success("AI match analysis completed", result));
    }

    @GetMapping("/applications/{id}/match-results")
    @Operation(summary = "Get latest AI match result for an application")
    public ResponseEntity<ApiResponse<MatchResultDto>> getMatchResults(@PathVariable Long id) {
        MatchResultDto result = aiMatchingService.getLatestMatchResult(id);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/candidates/{candidateId}/jobs/{jobId}/match")
    @Operation(summary = "Get AI match score for a candidate and job pair")
    public ResponseEntity<ApiResponse<MatchResultDto>> getMatchForPair(
            @PathVariable Long candidateId,
            @PathVariable Long jobId) {
        MatchResultDto result = aiMatchingService.getMatchForCandidateAndJob(candidateId, jobId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
