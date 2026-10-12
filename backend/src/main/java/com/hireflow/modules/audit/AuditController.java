package com.hireflow.modules.audit;

import com.hireflow.common.ApiResponse;
import com.hireflow.common.PagedResponse;
import com.hireflow.modules.audit.dto.AuditEventDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/audit-events")
@Tag(name = "Audit History", description = "System audit trail and activity log endpoints")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    @Operation(summary = "Get paginated audit trail events")
    public ResponseEntity<ApiResponse<PagedResponse<AuditEventDto>>> getAuditEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<AuditEventDto> response = auditService.getAuditEvents(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
