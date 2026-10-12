package com.hireflow.modules.candidate;

import com.hireflow.modules.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    Optional<Candidate> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT c FROM Candidate c WHERE " +
           "(:recruiter IS NULL OR c.recruiter = :recruiter) AND " +
           "(:minExperience IS NULL OR c.yearsOfExperience >= :minExperience) AND " +
           "(:keyword IS NULL OR LOWER(c.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           " OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           " OR LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           " OR LOWER(c.currentTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           " OR LOWER(c.skillsSummary) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           " OR LOWER(c.location) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Candidate> searchCandidates(
            @Param("recruiter") User recruiter,
            @Param("minExperience") Integer minExperience,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    long countByRecruiter(User recruiter);
}
