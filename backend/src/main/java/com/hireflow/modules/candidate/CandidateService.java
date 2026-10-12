package com.hireflow.modules.candidate;

import com.hireflow.common.BadRequestException;
import com.hireflow.common.PagedResponse;
import com.hireflow.common.ResourceNotFoundException;
import com.hireflow.common.UnauthorizedException;
import com.hireflow.modules.application.ApplicationRepository;
import com.hireflow.modules.audit.AuditService;
import com.hireflow.modules.candidate.dto.CandidateRequest;
import com.hireflow.modules.candidate.dto.CandidateResponse;
import com.hireflow.modules.user.Role;
import com.hireflow.modules.user.User;
import com.hireflow.modules.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final ApplicationRepository applicationRepository;
    private final ResumeProcessingService resumeProcessingService;
    private final UserService userService;
    private final AuditService auditService;

    public CandidateService(CandidateRepository candidateRepository,
                            ApplicationRepository applicationRepository,
                            ResumeProcessingService resumeProcessingService,
                            UserService userService,
                            AuditService auditService) {
        this.candidateRepository = candidateRepository;
        this.applicationRepository = applicationRepository;
        this.resumeProcessingService = resumeProcessingService;
        this.userService = userService;
        this.auditService = auditService;
    }

    public PagedResponse<CandidateResponse> getCandidates(int page, int size, String sortField, String sortDir,
                                                          Integer minExperience, String keyword) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir.toUpperCase()), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Candidate> candidatePage = candidateRepository.searchCandidates(null, minExperience, keyword, pageable);

        List<CandidateResponse> responses = candidatePage.getContent().stream()
                .map(candidate -> {
                    long appCount = applicationRepository.countByCandidateId(candidate.getId());
                    return new CandidateResponse(candidate, appCount);
                })
                .toList();

        return new PagedResponse<>(
                responses,
                candidatePage.getNumber(),
                candidatePage.getSize(),
                candidatePage.getTotalElements(),
                candidatePage.getTotalPages(),
                candidatePage.isLast()
        );
    }

    public CandidateResponse getCandidateById(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "id", id));
        long appCount = applicationRepository.countByCandidateId(candidate.getId());
        return new CandidateResponse(candidate, appCount);
    }

    @Transactional
    public CandidateResponse createCandidate(CandidateRequest request) {
        User currentUser = userService.getCurrentUser();
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        if (candidateRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("Candidate with email '" + normalizedEmail + "' already exists");
        }

        Candidate candidate = new Candidate();
        candidate.setFirstName(request.getFirstName().trim());
        candidate.setLastName(request.getLastName().trim());
        candidate.setEmail(normalizedEmail);
        candidate.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        candidate.setLocation(request.getLocation() != null ? request.getLocation().trim() : null);
        candidate.setCurrentTitle(request.getCurrentTitle() != null ? request.getCurrentTitle().trim() : null);
        candidate.setYearsOfExperience(request.getYearsOfExperience() != null ? request.getYearsOfExperience() : 0);
        candidate.setSkillsSummary(request.getSkillsSummary() != null ? request.getSkillsSummary().trim() : null);
        candidate.setResumeText(request.getResumeText() != null ? request.getResumeText().trim() : null);
        candidate.setRecruiter(currentUser);

        Candidate saved = candidateRepository.save(candidate);
        auditService.recordEvent(currentUser, "CREATE_CANDIDATE", "Candidate", saved.getId(), "Added candidate profile: " + saved.getFullName());
        return new CandidateResponse(saved, 0);
    }

    @Transactional
    public CandidateResponse updateCandidate(Long id, CandidateRequest request) {
        User currentUser = userService.getCurrentUser();
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "id", id));

        verifyOwnership(candidate, currentUser);

        String normalizedEmail = request.getEmail().toLowerCase().trim();
        if (!candidate.getEmail().equals(normalizedEmail) && candidateRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("Candidate with email '" + normalizedEmail + "' already exists");
        }

        candidate.setFirstName(request.getFirstName().trim());
        candidate.setLastName(request.getLastName().trim());
        candidate.setEmail(normalizedEmail);
        candidate.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        candidate.setLocation(request.getLocation() != null ? request.getLocation().trim() : null);
        candidate.setCurrentTitle(request.getCurrentTitle() != null ? request.getCurrentTitle().trim() : null);
        candidate.setYearsOfExperience(request.getYearsOfExperience() != null ? request.getYearsOfExperience() : 0);
        candidate.setSkillsSummary(request.getSkillsSummary() != null ? request.getSkillsSummary().trim() : null);
        if (request.getResumeText() != null) {
            candidate.setResumeText(request.getResumeText().trim());
        }

        Candidate saved = candidateRepository.save(candidate);
        long appCount = applicationRepository.countByCandidateId(saved.getId());
        auditService.recordEvent(currentUser, "UPDATE_CANDIDATE", "Candidate", saved.getId(), "Updated profile: " + saved.getFullName());
        return new CandidateResponse(saved, appCount);
    }

    @Transactional
    public CandidateResponse uploadResume(Long id, MultipartFile file) {
        User currentUser = userService.getCurrentUser();
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "id", id));

        verifyOwnership(candidate, currentUser);

        ResumeProcessingService.ProcessedResume processed = resumeProcessingService.processResumeFile(file);
        candidate.setResumeFilePath(processed.getStoredFilePath());
        candidate.setResumeOriginalFilename(processed.getOriginalFilename());
        candidate.setResumeText(processed.getExtractedText());

        Candidate saved = candidateRepository.save(candidate);
        long appCount = applicationRepository.countByCandidateId(saved.getId());
        auditService.recordEvent(currentUser, "UPLOAD_RESUME", "Candidate", saved.getId(), "Uploaded and extracted PDF resume: " + processed.getOriginalFilename());
        return new CandidateResponse(saved, appCount);
    }

    @Transactional
    public void deleteCandidate(Long id) {
        User currentUser = userService.getCurrentUser();
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "id", id));

        verifyOwnership(candidate, currentUser);

        candidateRepository.delete(candidate);
        auditService.recordEvent(currentUser, "DELETE_CANDIDATE", "Candidate", id, "Deleted candidate: " + candidate.getFullName());
    }

    private void verifyOwnership(Candidate candidate, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            return;
        }
        if (!candidate.getRecruiter().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to modify this candidate profile");
        }
    }
}
