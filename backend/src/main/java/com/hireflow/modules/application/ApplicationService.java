package com.hireflow.modules.application;

import com.hireflow.common.BadRequestException;
import com.hireflow.common.PagedResponse;
import com.hireflow.common.ResourceNotFoundException;
import com.hireflow.modules.ai.AiMatchingService;
import com.hireflow.modules.ai.MatchResultRepository;
import com.hireflow.modules.application.dto.ApplicationHistoryDto;
import com.hireflow.modules.application.dto.ApplicationRequest;
import com.hireflow.modules.application.dto.ApplicationResponse;
import com.hireflow.modules.application.dto.StageUpdateRequest;
import com.hireflow.modules.audit.AuditService;
import com.hireflow.modules.candidate.Candidate;
import com.hireflow.modules.candidate.CandidateRepository;
import com.hireflow.modules.job.Job;
import com.hireflow.modules.job.JobRepository;
import com.hireflow.modules.notification.NotificationService;
import com.hireflow.modules.notification.NotificationType;
import com.hireflow.modules.user.User;
import com.hireflow.modules.user.UserService;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationStageHistoryRepository historyRepository;
    private final CandidateRepository candidateRepository;
    private final JobRepository jobRepository;
    private final MatchResultRepository matchResultRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    private final AuditService auditService;
    private final AiMatchingService aiMatchingService;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            ApplicationStageHistoryRepository historyRepository,
            CandidateRepository candidateRepository,
            JobRepository jobRepository,
            MatchResultRepository matchResultRepository,
            UserService userService,
            NotificationService notificationService,
            AuditService auditService,
            @Lazy AiMatchingService aiMatchingService) {
        this.applicationRepository = applicationRepository;
        this.historyRepository = historyRepository;
        this.candidateRepository = candidateRepository;
        this.jobRepository = jobRepository;
        this.matchResultRepository = matchResultRepository;
        this.userService = userService;
        this.notificationService = notificationService;
        this.auditService = auditService;
        this.aiMatchingService = aiMatchingService;
    }

    public PagedResponse<ApplicationResponse> getApplications(int page, int size, String sortField, String sortDir,
                                                              Long jobId, ApplicationStage stage, String keyword) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir.toUpperCase()), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Application> appPage = applicationRepository.searchApplications(null, jobId, stage, keyword, pageable);

        List<ApplicationResponse> responses = appPage.getContent().stream()
                .map(this::toResponse)
                .toList();

        return new PagedResponse<>(
                responses,
                appPage.getNumber(),
                appPage.getSize(),
                appPage.getTotalElements(),
                appPage.getTotalPages(),
                appPage.isLast()
        );
    }

    public List<ApplicationResponse> getApplicationsForJob(Long jobId) {
        return applicationRepository.findByJobId(jobId).stream()
                .map(this::toResponse)
                .toList();
    }

    public ApplicationResponse getApplicationById(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", id));
        return toResponse(app);
    }

    @Transactional
    public ApplicationResponse createApplication(ApplicationRequest request) {
        User currentUser = userService.getCurrentUser();

        Candidate candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "id", request.getCandidateId()));

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", request.getJobId()));

        if (applicationRepository.existsByCandidateIdAndJobId(candidate.getId(), job.getId())) {
            throw new BadRequestException("Candidate " + candidate.getFullName() + " already has an application for " + job.getTitle());
        }

        Application application = new Application();
        application.setCandidate(candidate);
        application.setJob(job);
        application.setRecruiter(currentUser);
        application.setStage(ApplicationStage.APPLIED);
        application.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);

        Application saved = applicationRepository.save(application);

        // Record initial stage in history
        ApplicationStageHistory history = new ApplicationStageHistory(
                saved, null, ApplicationStage.APPLIED, currentUser, "Initial application submitted"
        );
        historyRepository.save(history);

        // Compute initial AI match score asynchronously or inline
        try {
            aiMatchingService.matchApplication(saved.getId());
        } catch (Exception ignored) {}

        // Notification & Audit
        notificationService.createNotification(
                job.getRecruiter(),
                "New Application Received",
                candidate.getFullName() + " applied for " + job.getTitle(),
                NotificationType.NEW_APPLICATION,
                "/applications/" + saved.getId()
        );

        auditService.recordEvent(
                currentUser, "CREATE_APPLICATION", "Application", saved.getId(),
                "Candidate " + candidate.getFullName() + " applied for " + job.getTitle()
        );

        return toResponse(saved);
    }

    @Transactional
    public ApplicationResponse updateStage(Long id, StageUpdateRequest request) {
        User currentUser = userService.getCurrentUser();
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", id));

        ApplicationStage fromStage = application.getStage();
        ApplicationStage toStage = request.getStage();

        if (fromStage == toStage) {
            // Still allow updating interview date or comments
            if (request.getInterviewDate() != null) {
                application.setInterviewDate(request.getInterviewDate());
            }
            if (request.getComments() != null) {
                application.setNotes(request.getComments());
            }
            return toResponse(applicationRepository.save(application));
        }

        if (!fromStage.canTransitionTo(toStage)) {
            throw new BadRequestException(String.format("Invalid stage transition from %s to %s", fromStage, toStage));
        }

        application.setStage(toStage);
        if (request.getInterviewDate() != null) {
            application.setInterviewDate(request.getInterviewDate());
        }
        if (request.getComments() != null && !request.getComments().trim().isEmpty()) {
            application.setNotes(request.getComments().trim());
        }

        Application saved = applicationRepository.save(application);

        // Log history
        ApplicationStageHistory history = new ApplicationStageHistory(
                saved, fromStage, toStage, currentUser, request.getComments()
        );
        historyRepository.save(history);

        // Notify recruiter
        notificationService.createNotification(
                saved.getJob().getRecruiter(),
                "Application Stage Updated",
                String.format("%s moved to %s for %s", saved.getCandidate().getFullName(), toStage, saved.getJob().getTitle()),
                NotificationType.STAGE_CHANGE,
                "/applications/" + saved.getId()
        );

        auditService.recordEvent(
                currentUser, "UPDATE_APPLICATION_STAGE", "Application", saved.getId(),
                String.format("Moved %s from %s to %s", saved.getCandidate().getFullName(), fromStage, toStage)
        );

        return toResponse(saved);
    }

    public List<ApplicationHistoryDto> getApplicationHistory(Long applicationId) {
        return historyRepository.findByApplicationIdOrderByCreatedAtDesc(applicationId).stream()
                .map(ApplicationHistoryDto::new)
                .toList();
    }

    private ApplicationResponse toResponse(Application app) {
        Integer score = matchResultRepository.findTopByApplicationIdOrderByCreatedAtDesc(app.getId())
                .map(m -> m.getOverallScore())
                .orElse(null);
        return new ApplicationResponse(app, score);
    }
}
