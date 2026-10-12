package com.hireflow.modules.ai.provider;

import com.hireflow.modules.ai.MatchResult;
import com.hireflow.modules.application.Application;
import com.hireflow.modules.candidate.Candidate;
import com.hireflow.modules.job.Job;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.*;
import java.util.regex.Pattern;

@Component("baselineAiProvider")
public class BaselineAiProvider implements AiProvider {

    private static final Map<String, String> SKILL_ALIASES = new HashMap<>();

    static {
        SKILL_ALIASES.put("react", "react");
        SKILL_ALIASES.put("reactjs", "react");
        SKILL_ALIASES.put("react.js", "react");
        SKILL_ALIASES.put("node", "node.js");
        SKILL_ALIASES.put("nodejs", "node.js");
        SKILL_ALIASES.put("node.js", "node.js");
        SKILL_ALIASES.put("typescript", "typescript");
        SKILL_ALIASES.put("ts", "typescript");
        SKILL_ALIASES.put("javascript", "javascript");
        SKILL_ALIASES.put("js", "javascript");
        SKILL_ALIASES.put("python", "python");
        SKILL_ALIASES.put("py", "python");
        SKILL_ALIASES.put("java", "java");
        SKILL_ALIASES.put("spring", "spring boot");
        SKILL_ALIASES.put("spring boot", "spring boot");
        SKILL_ALIASES.put("springboot", "spring boot");
        SKILL_ALIASES.put("postgresql", "postgresql");
        SKILL_ALIASES.put("postgres", "postgresql");
        SKILL_ALIASES.put("sql", "sql");
        SKILL_ALIASES.put("mysql", "mysql");
        SKILL_ALIASES.put("docker", "docker");
        SKILL_ALIASES.put("kubernetes", "kubernetes");
        SKILL_ALIASES.put("k8s", "kubernetes");
        SKILL_ALIASES.put("aws", "aws");
        SKILL_ALIASES.put("amazon web services", "aws");
        SKILL_ALIASES.put("git", "git");
        SKILL_ALIASES.put("ci/cd", "ci/cd");
        SKILL_ALIASES.put("cicd", "ci/cd");
        SKILL_ALIASES.put("rest", "rest api");
        SKILL_ALIASES.put("rest api", "rest api");
        SKILL_ALIASES.put("restful", "rest api");
        SKILL_ALIASES.put("graphql", "graphql");
        SKILL_ALIASES.put("tailwind", "tailwind css");
        SKILL_ALIASES.put("tailwindcss", "tailwind css");
    }

    @Override
    public String getProviderName() {
        return "BASELINE";
    }

    @Override
    public MatchResult computeMatch(Application application) {
        Candidate candidate = application.getCandidate();
        Job job = application.getJob();

        // 1. Parse and normalize skills
        List<String> requiredSkills = parseSkills(job.getRequiredSkills());
        List<String> preferredSkills = parseSkills(job.getPreferredSkills());

        // 2. Build candidate text corpus
        StringBuilder candidateCorpus = new StringBuilder();
        if (candidate.getSkillsSummary() != null) candidateCorpus.append(" ").append(candidate.getSkillsSummary());
        if (candidate.getCurrentTitle() != null) candidateCorpus.append(" ").append(candidate.getCurrentTitle());
        if (candidate.getResumeText() != null) candidateCorpus.append(" ").append(candidate.getResumeText());
        String corpusLower = candidateCorpus.toString().toLowerCase();

        // 3. Match required skills
        List<String> matchingRequired = new ArrayList<>();
        List<String> missingRequired = new ArrayList<>();
        for (String skill : requiredSkills) {
            if (matchesSkill(skill, corpusLower)) {
                matchingRequired.add(skill);
            } else {
                missingRequired.add(skill);
            }
        }

        // 4. Match preferred skills
        List<String> matchingPreferred = new ArrayList<>();
        for (String skill : preferredSkills) {
            if (matchesSkill(skill, corpusLower)) {
                matchingPreferred.add(skill);
            }
        }

        // 5. Calculate scores
        // Required skills: 55 points max
        double reqRatio = requiredSkills.isEmpty() ? 1.0 : (double) matchingRequired.size() / requiredSkills.size();
        int reqScore = (int) Math.round(reqRatio * 55.0);

        // Preferred skills: 20 points max
        double prefRatio = preferredSkills.isEmpty() ? 1.0 : (double) matchingPreferred.size() / preferredSkills.size();
        int prefScore = (int) Math.round(prefRatio * 20.0);

        int skillsScore = Math.min(75, reqScore + prefScore);

        // Experience score: 25 points max
        int candExp = candidate.getYearsOfExperience() != null ? candidate.getYearsOfExperience() : 0;
        int minExp = job.getMinExperienceYears() != null ? job.getMinExperienceYears() : 0;
        int experienceScore;
        if (minExp <= 0) {
            experienceScore = 25;
        } else if (candExp >= minExp) {
            experienceScore = 25;
        } else {
            experienceScore = (int) Math.round(((double) candExp / minExp) * 25.0);
        }

        int overallScore = Math.min(100, Math.max(0, skillsScore + experienceScore));

        // 6. Generate summary
        String summary = String.format(
                "Candidate matches %d of %d required skills (%s) and %d preferred skills with %d years of relevant experience (role requires %d+ years).",
                matchingRequired.size(), requiredSkills.size(),
                matchingRequired.isEmpty() ? "none" : String.join(", ", matchingRequired),
                matchingPreferred.size(), candExp, minExp
        );

        // 7. Generate role-specific interview questions
        List<String> questions = generateInterviewQuestions(job, matchingRequired, missingRequired);

        MatchResult result = new MatchResult();
        result.setApplication(application);
        result.setCandidate(candidate);
        result.setJob(job);
        result.setOverallScore(overallScore);
        result.setSkillsScore(skillsScore);
        result.setExperienceScore(experienceScore);
        result.setMatchingRequiredSkills(String.join("; ", matchingRequired));
        result.setMissingRequiredSkills(String.join("; ", missingRequired));
        result.setMatchingPreferredSkills(String.join("; ", matchingPreferred));
        result.setSummary(summary);
        result.setInterviewQuestions(String.join("; ", questions));
        result.setProvider("BASELINE");
        result.setAlgorithmVersion("v1.0-deterministic");
        result.setCreatedAt(Instant.now());

        return result;
    }

    private List<String> parseSkills(String skillsStr) {
        if (skillsStr == null || skillsStr.trim().isEmpty()) return Collections.emptyList();
        return Arrays.stream(skillsStr.split("[,;\\n]"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .distinct()
                .toList();
    }

    private boolean matchesSkill(String skill, String text) {
        String normalized = normalizeSkill(skill);
        if (text.contains(normalized)) {
            return true;
        }
        // Word boundary regex
        String regex = "\\b" + Pattern.quote(normalized) + "\\b";
        return Pattern.compile(regex).matcher(text).find();
    }

    private String normalizeSkill(String skill) {
        String clean = skill.toLowerCase().trim();
        return SKILL_ALIASES.getOrDefault(clean, clean);
    }

    private List<String> generateInterviewQuestions(Job job, List<String> matchedSkills, List<String> missingSkills) {
        List<String> questions = new ArrayList<>();

        if (!matchedSkills.isEmpty()) {
            questions.add(String.format("Can you walk us through a production system where you designed and implemented features using %s?", matchedSkills.get(0)));
        }

        if (matchedSkills.size() > 1) {
            questions.add(String.format("How do you manage performance, state, and concurrency when working with %s?", matchedSkills.get(1)));
        }

        if (!missingSkills.isEmpty()) {
            questions.add(String.format("This role requires hands-on experience with %s. Have you worked with similar paradigms or how would you quickly ramp up on it?", missingSkills.get(0)));
        }

        questions.add(String.format("In your previous roles as %s, how did you balance technical debt with tight delivery schedules?", job.getTitle()));
        questions.add("Describe an incident in production that you personally troubleshot and resolved under time pressure.");

        return questions;
    }
}
