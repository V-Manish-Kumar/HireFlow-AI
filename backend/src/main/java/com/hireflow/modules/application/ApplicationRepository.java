package com.hireflow.modules.application;

import com.hireflow.modules.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Optional<Application> findByCandidateIdAndJobId(Long candidateId, Long jobId);

    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);

    List<Application> findByCandidateId(Long candidateId);

    List<Application> findByJobId(Long jobId);

    long countByJobId(Long jobId);

    long countByCandidateId(Long candidateId);

    long countByStage(ApplicationStage stage);

    long countByRecruiter(User recruiter);

    long countByRecruiterAndStage(User recruiter, ApplicationStage stage);

    @Query("SELECT a FROM Application a " +
           "JOIN a.candidate c " +
           "JOIN a.job j " +
           "WHERE (:recruiter IS NULL OR a.recruiter = :recruiter) AND " +
           "(:jobId IS NULL OR j.id = :jobId) AND " +
           "(:stage IS NULL OR a.stage = :stage) AND " +
           "(:keyword IS NULL OR LOWER(c.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           " OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           " OR LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           " OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           " OR LOWER(j.department) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Application> searchApplications(
            @Param("recruiter") User recruiter,
            @Param("jobId") Long jobId,
            @Param("stage") ApplicationStage stage,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @Query("SELECT a.stage, COUNT(a) FROM Application a " +
           "WHERE (:recruiter IS NULL OR a.recruiter = :recruiter) " +
           "GROUP BY a.stage")
    List<Object[]> countApplicationsByStage(@Param("recruiter") User recruiter);

    @Query("SELECT a.job.id, a.job.title, COUNT(a) FROM Application a " +
           "WHERE (:recruiter IS NULL OR a.recruiter = :recruiter) " +
           "GROUP BY a.job.id, a.job.title ORDER BY COUNT(a) DESC")
    List<Object[]> countApplicationsByJob(@Param("recruiter") User recruiter);
}
