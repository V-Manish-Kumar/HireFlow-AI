package com.hireflow.modules.job;

import com.hireflow.common.PagedResponse;
import com.hireflow.common.ResourceNotFoundException;
import com.hireflow.common.UnauthorizedException;
import com.hireflow.modules.application.ApplicationRepository;
import com.hireflow.modules.audit.AuditService;
import com.hireflow.modules.job.dto.JobRequest;
import com.hireflow.modules.job.dto.JobResponse;
import com.hireflow.modules.user.Role;
import com.hireflow.modules.user.User;
import com.hireflow.modules.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final UserService userService;
    private final AuditService auditService;

    public JobService(JobRepository jobRepository,
                      ApplicationRepository applicationRepository,
                      UserService userService,
                      AuditService auditService) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.userService = userService;
        this.auditService = auditService;
    }

    public PagedResponse<JobResponse> getJobs(int page, int size, String sortField, String sortDir,
                                             JobStatus status, String department, String keyword) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir.toUpperCase()), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        // Allow recruiter to view all company jobs, but recruiters can also see their own
        Page<Job> jobPage = jobRepository.searchJobs(null, status, department, keyword, pageable);

        List<JobResponse> responses = jobPage.getContent().stream()
                .map(job -> {
                    long appCount = applicationRepository.countByJobId(job.getId());
                    return new JobResponse(job, appCount);
                })
                .toList();

        return new PagedResponse<>(
                responses,
                jobPage.getNumber(),
                jobPage.getSize(),
                jobPage.getTotalElements(),
                jobPage.getTotalPages(),
                jobPage.isLast()
        );
    }

    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));
        long appCount = applicationRepository.countByJobId(job.getId());
        return new JobResponse(job, appCount);
    }

    @Transactional
    public JobResponse createJob(JobRequest request) {
        User currentUser = userService.getCurrentUser();

        Job job = new Job();
        job.setTitle(request.getTitle().trim());
        job.setDepartment(request.getDepartment().trim());
        job.setLocation(request.getLocation().trim());
        job.setEmploymentType(request.getEmploymentType());
        job.setDescription(request.getDescription().trim());
        job.setResponsibilities(request.getResponsibilities() != null ? request.getResponsibilities().trim() : null);
        job.setRequiredSkills(request.getRequiredSkills().trim());
        job.setPreferredSkills(request.getPreferredSkills() != null ? request.getPreferredSkills().trim() : null);
        job.setMinExperienceYears(request.getMinExperienceYears());
        job.setStatus(request.getStatus() != null ? request.getStatus() : JobStatus.OPEN);
        job.setRecruiter(currentUser);

        Job saved = jobRepository.save(job);
        auditService.recordEvent(currentUser, "CREATE_JOB", "Job", saved.getId(), "Created job opening: " + saved.getTitle());
        return new JobResponse(saved, 0);
    }

    @Transactional
    public JobResponse updateJob(Long id, JobRequest request) {
        User currentUser = userService.getCurrentUser();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        verifyOwnership(job, currentUser);

        job.setTitle(request.getTitle().trim());
        job.setDepartment(request.getDepartment().trim());
        job.setLocation(request.getLocation().trim());
        job.setEmploymentType(request.getEmploymentType());
        job.setDescription(request.getDescription().trim());
        job.setResponsibilities(request.getResponsibilities() != null ? request.getResponsibilities().trim() : null);
        job.setRequiredSkills(request.getRequiredSkills().trim());
        job.setPreferredSkills(request.getPreferredSkills() != null ? request.getPreferredSkills().trim() : null);
        job.setMinExperienceYears(request.getMinExperienceYears());
        if (request.getStatus() != null) {
            job.setStatus(request.getStatus());
        }

        Job saved = jobRepository.save(job);
        long appCount = applicationRepository.countByJobId(saved.getId());
        auditService.recordEvent(currentUser, "UPDATE_JOB", "Job", saved.getId(), "Updated job: " + saved.getTitle());
        return new JobResponse(saved, appCount);
    }

    @Transactional
    public JobResponse updateStatus(Long id, JobStatus status) {
        User currentUser = userService.getCurrentUser();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        verifyOwnership(job, currentUser);

        job.setStatus(status);
        Job saved = jobRepository.save(job);
        long appCount = applicationRepository.countByJobId(saved.getId());
        auditService.recordEvent(currentUser, "UPDATE_JOB_STATUS", "Job", saved.getId(), "Changed job status to " + status);
        return new JobResponse(saved, appCount);
    }

    @Transactional
    public void deleteJob(Long id) {
        User currentUser = userService.getCurrentUser();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        verifyOwnership(job, currentUser);

        jobRepository.delete(job);
        auditService.recordEvent(currentUser, "DELETE_JOB", "Job", id, "Deleted job: " + job.getTitle());
    }

    public List<String> getDepartments() {
        return jobRepository.findDistinctDepartments();
    }

    private void verifyOwnership(Job job, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            return;
        }
        if (!job.getRecruiter().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to modify this job posting");
        }
    }
}
