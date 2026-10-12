package com.hireflow.modules.application;

import java.util.List;
import java.util.Set;

public enum ApplicationStage {
    APPLIED,
    SCREENING,
    SHORTLISTED,
    INTERVIEW,
    OFFER,
    HIRED,
    REJECTED,
    WITHDRAWN;

    public boolean canTransitionTo(ApplicationStage targetStage) {
        if (this == targetStage) {
            return true;
        }

        // Terminal stages cannot transition further
        if (this == HIRED || this == WITHDRAWN) {
            return false;
        }

        // Any active stage can be moved to REJECTED or WITHDRAWN
        if (targetStage == REJECTED || targetStage == WITHDRAWN) {
            return true;
        }

        // Allow moving back from REJECTED to review again
        if (this == REJECTED) {
            return targetStage == SCREENING || targetStage == APPLIED;
        }

        // Progressive pipeline stages allow forward and one-step back movements
        return switch (this) {
            case APPLIED -> targetStage == SCREENING || targetStage == SHORTLISTED;
            case SCREENING -> targetStage == APPLIED || targetStage == SHORTLISTED || targetStage == INTERVIEW;
            case SHORTLISTED -> targetStage == SCREENING || targetStage == INTERVIEW || targetStage == OFFER;
            case INTERVIEW -> targetStage == SHORTLISTED || targetStage == OFFER;
            case OFFER -> targetStage == INTERVIEW || targetStage == HIRED;
            default -> false;
        };
    }
}
