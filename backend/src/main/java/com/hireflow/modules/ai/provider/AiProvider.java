package com.hireflow.modules.ai.provider;

import com.hireflow.modules.ai.MatchResult;
import com.hireflow.modules.application.Application;

public interface AiProvider {
    MatchResult computeMatch(Application application);
    String getProviderName();
}
