package com.hireflow.modules.ai;

import com.hireflow.modules.ai.provider.BaselineAiProvider;
import com.hireflow.modules.application.Application;
import com.hireflow.modules.candidate.Candidate;
import com.hireflow.modules.job.Job;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BaselineAiProviderTest {

    private BaselineAiProvider aiProvider;

    @BeforeEach
    void setUp() {
        aiProvider = new BaselineAiProvider();
    }

    @Test
    @DisplayName("Matches skills and normalizes aliases correctly with high score")
    void testPerfectMatchCandidate() {
        Job job = new Job();
        job.setTitle("Senior Full Stack Engineer");
        job.setRequiredSkills("React, Java, PostgreSQL");
        job.setPreferredSkills("Docker, Kubernetes");
        job.setMinExperienceYears(4);

        Candidate candidate = new Candidate();
        candidate.setFirstName("Alice");
        candidate.setLastName("Dev");
        candidate.setYearsOfExperience(5);
        candidate.setSkillsSummary("Experienced in reactjs, java, postgres, docker, and k8s.");
        candidate.setResumeText("Developed large scale microservices in Java and React.js with PostgreSQL backend.");

        Application app = new Application();
        app.setJob(job);
        app.setCandidate(candidate);

        MatchResult result = aiProvider.computeMatch(app);

        assertNotNull(result);
        assertTrue(result.getOverallScore() >= 80, "Expected high score >= 80, got: " + result.getOverallScore());
        assertEquals(25, result.getExperienceScore());
        assertTrue(result.getMatchingRequiredSkills().contains("React"));
        assertTrue(result.getMatchingRequiredSkills().contains("Java"));
        assertTrue(result.getMatchingRequiredSkills().contains("PostgreSQL"));
        assertTrue(result.getMissingRequiredSkills().isEmpty());
        assertNotNull(result.getInterviewQuestions());
        assertFalse(result.getInterviewQuestions().isEmpty());
    }

    @Test
    @DisplayName("Accurately identifies missing required skills and lowers score")
    void testMissingSkillsCandidate() {
        Job job = new Job();
        job.setTitle("AI Engineer");
        job.setRequiredSkills("Python, PyTorch, Kubernetes");
        job.setPreferredSkills("LangChain");
        job.setMinExperienceYears(5);

        Candidate candidate = new Candidate();
        candidate.setFirstName("Bob");
        candidate.setLastName("Coder");
        candidate.setYearsOfExperience(2);
        candidate.setSkillsSummary("JavaScript, CSS, HTML");
        candidate.setResumeText("Frontend developer focused on UI design.");

        Application app = new Application();
        app.setJob(job);
        app.setCandidate(candidate);

        MatchResult result = aiProvider.computeMatch(app);

        assertNotNull(result);
        assertTrue(result.getOverallScore() < 50, "Expected low score < 50, got: " + result.getOverallScore());
        assertTrue(result.getMissingRequiredSkills().contains("Python"));
        assertTrue(result.getMissingRequiredSkills().contains("Kubernetes"));
    }
}
