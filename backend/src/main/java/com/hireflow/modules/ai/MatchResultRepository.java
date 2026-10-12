package com.hireflow.modules.ai;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MatchResultRepository extends JpaRepository<MatchResult, Long> {
    Optional<MatchResult> findTopByApplicationIdOrderByCreatedAtDesc(Long applicationId);
    Optional<MatchResult> findTopByCandidateIdAndJobIdOrderByCreatedAtDesc(Long candidateId, Long jobId);
}
