package com.hireflow.modules.audit;

import com.hireflow.common.PagedResponse;
import com.hireflow.modules.audit.dto.AuditEventDto;
import com.hireflow.modules.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {

    private final AuditEventRepository auditEventRepository;

    public AuditService(AuditEventRepository auditEventRepository) {
        this.auditEventRepository = auditEventRepository;
    }

    public void recordEvent(User user, String action, String entityType, Long entityId, String details) {
        AuditEvent event = new AuditEvent(user, action, entityType, entityId, details, null);
        auditEventRepository.save(event);
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public PagedResponse<AuditEventDto> getAuditEvents(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditEvent> eventPage = auditEventRepository.findAllByOrderByCreatedAtDesc(pageable);
        List<AuditEventDto> dtoList = eventPage.getContent().stream()
                .map(AuditEventDto::new)
                .toList();

        return new PagedResponse<>(
                dtoList,
                eventPage.getNumber(),
                eventPage.getSize(),
                eventPage.getTotalElements(),
                eventPage.getTotalPages(),
                eventPage.isLast()
        );
    }
}
