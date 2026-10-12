package com.hireflow.modules.application;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ApplicationStageTest {

    @Test
    @DisplayName("APPLIED stage can move to SCREENING or SHORTLISTED")
    void testAppliedTransitions() {
        assertTrue(ApplicationStage.APPLIED.canTransitionTo(ApplicationStage.SCREENING));
        assertTrue(ApplicationStage.APPLIED.canTransitionTo(ApplicationStage.SHORTLISTED));
        assertTrue(ApplicationStage.APPLIED.canTransitionTo(ApplicationStage.REJECTED));
        assertTrue(ApplicationStage.APPLIED.canTransitionTo(ApplicationStage.WITHDRAWN));
        assertFalse(ApplicationStage.APPLIED.canTransitionTo(ApplicationStage.HIRED));
    }

    @Test
    @DisplayName("SCREENING stage can move forward to SHORTLISTED or INTERVIEW, and back to APPLIED")
    void testScreeningTransitions() {
        assertTrue(ApplicationStage.SCREENING.canTransitionTo(ApplicationStage.SHORTLISTED));
        assertTrue(ApplicationStage.SCREENING.canTransitionTo(ApplicationStage.INTERVIEW));
        assertTrue(ApplicationStage.SCREENING.canTransitionTo(ApplicationStage.APPLIED));
        assertTrue(ApplicationStage.SCREENING.canTransitionTo(ApplicationStage.REJECTED));
        assertFalse(ApplicationStage.SCREENING.canTransitionTo(ApplicationStage.HIRED));
    }

    @Test
    @DisplayName("OFFER stage can transition to HIRED upon acceptance")
    void testOfferTransitions() {
        assertTrue(ApplicationStage.OFFER.canTransitionTo(ApplicationStage.HIRED));
        assertTrue(ApplicationStage.OFFER.canTransitionTo(ApplicationStage.REJECTED));
        assertTrue(ApplicationStage.OFFER.canTransitionTo(ApplicationStage.WITHDRAWN));
    }

    @Test
    @DisplayName("HIRED and WITHDRAWN are terminal states")
    void testTerminalStates() {
        assertFalse(ApplicationStage.HIRED.canTransitionTo(ApplicationStage.APPLIED));
        assertFalse(ApplicationStage.HIRED.canTransitionTo(ApplicationStage.OFFER));
        assertFalse(ApplicationStage.WITHDRAWN.canTransitionTo(ApplicationStage.APPLIED));
    }
}
