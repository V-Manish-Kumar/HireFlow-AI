package com.hireflow.modules.ai;

import com.hireflow.common.ResourceNotFoundException;
import com.hireflow.modules.ai.dto.MatchResultDto;
import com.hireflow.modules.ai.provider.AiProvider;
import com.hireflow.modules.application.Application;
import com.hireflow.modules.application.ApplicationRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AiMatchingService {

    private final ApplicationRepository applicationRepository;
    private final MatchResultRepository matchResultRepository;
    private final AiProvider selectedProvider;

    public AiMatchingService(
            ApplicationRepository applicationRepository,
            MatchResultRepository matchResultRepository,
            @Qualifier("baselineAiProvider") AiProvider baselineProvider,
            @Qualifier("llmAiProvider") AiProvider llmProvider,
            @Value("${app.ai.provider:baseline}") String configuredProvider) {
        this.applicationRepository = applicationRepository;
        this.matchResultRepository = matchResultRepository;
        this.selectedProvider = "llm".equalsIgnoreCase(configuredProvider) ? llmProvider : baselineProvider;
    }

    @Transactional
    public MatchResultDto matchApplication(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        MatchResult result = selectedProvider.computeMatch(application);
        MatchResult saved = matchResultRepository.save(result);
        return new MatchResultDto(saved);
    }

    public MatchResultDto getLatestMatchResult(Long applicationId) {
        return matchResultRepository.findTopByApplicationIdOrderByCreatedAtDesc(applicationId)
                .map(MatchResultDto::new)
                .orElse(null);
    }

    public MatchResultDto getMatchForCandidateAndJob(Long candidateId, Long jobId) {
        return matchResultRepository.findTopByCandidateIdAndJobIdOrderByCreatedAtDesc(candidateId, jobId)
                .map(MatchResultDto::new)
                .orElse(null);
    }
}
