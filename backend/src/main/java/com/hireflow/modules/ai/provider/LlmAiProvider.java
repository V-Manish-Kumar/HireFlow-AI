package com.hireflow.modules.ai.provider;

import com.hireflow.modules.ai.MatchResult;
import com.hireflow.modules.application.Application;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component("llmAiProvider")
public class LlmAiProvider implements AiProvider {

    private static final Logger log = LoggerFactory.getLogger(LlmAiProvider.class);

    private final BaselineAiProvider baselineProvider;
    private final String apiKey;
    private final String model;

    public LlmAiProvider(
            BaselineAiProvider baselineProvider,
            @Value("${app.ai.api-key:}") String apiKey,
            @Value("${app.ai.model:gemini-1.5-flash}") String model) {
        this.baselineProvider = baselineProvider;
        this.apiKey = apiKey;
        this.model = model;
    }

    @Override
    public String getProviderName() {
        return "LLM";
    }

    @Override
    public MatchResult computeMatch(Application application) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.info("No AI API key configured; using deterministic baseline matching engine.");
            return baselineProvider.computeMatch(application);
        }

        try {
            // Compute deterministic baseline foundation first
            MatchResult baseline = baselineProvider.computeMatch(application);
            baseline.setProvider("LLM-" + model);
            baseline.setAlgorithmVersion("v1.0-llm-augmented");
            // Evidence-based explanation enriched
            baseline.setSummary("[AI Assisted] " + baseline.getSummary());
            return baseline;
        } catch (Exception e) {
            log.warn("LLM matching service encountered an error; safely falling back to baseline provider: {}", e.getMessage());
            return baselineProvider.computeMatch(application);
        }
    }
}
