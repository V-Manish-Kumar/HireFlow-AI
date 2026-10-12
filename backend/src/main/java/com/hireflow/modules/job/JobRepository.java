package com.hireflow.modules.job;

import com.hireflow.modules.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    @Query("SELECT j FROM Job j WHERE " +
           "(:recruiter IS NULL OR j.recruiter = :recruiter) AND " +
           "(:status IS NULL OR j.status = :status) AND " +
           "(:department IS NULL OR LOWER(j.department) = LOWER(:department)) AND " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           " OR LOWER(j.requiredSkills) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           " OR LOWER(j.location) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Job> searchJobs(
            @Param("recruiter") User recruiter,
            @Param("status") JobStatus status,
            @Param("department") String department,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    long countByStatus(JobStatus status);

    long countByRecruiterAndStatus(User recruiter, JobStatus status);

    long countByRecruiter(User recruiter);

    @Query("SELECT DISTINCT j.department FROM Job j ORDER BY j.department")
    List<String> findDistinctDepartments();
}
