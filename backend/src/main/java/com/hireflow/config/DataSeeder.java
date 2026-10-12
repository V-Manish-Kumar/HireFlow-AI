package com.hireflow.config;

import com.hireflow.modules.ai.AiMatchingService;
import com.hireflow.modules.application.Application;
import com.hireflow.modules.application.ApplicationRepository;
import com.hireflow.modules.application.ApplicationStage;
import com.hireflow.modules.application.ApplicationStageHistory;
import com.hireflow.modules.application.ApplicationStageHistoryRepository;
import com.hireflow.modules.candidate.Candidate;
import com.hireflow.modules.candidate.CandidateRepository;
import com.hireflow.modules.job.EmploymentType;
import com.hireflow.modules.job.Job;
import com.hireflow.modules.job.JobRepository;
import com.hireflow.modules.job.JobStatus;
import com.hireflow.modules.notification.NotificationService;
import com.hireflow.modules.notification.NotificationType;
import com.hireflow.modules.user.Role;
import com.hireflow.modules.user.User;
import com.hireflow.modules.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final CandidateRepository candidateRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationStageHistoryRepository historyRepository;
    private final AiMatchingService aiMatchingService;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;
    private final boolean seedDataEnabled;

    public DataSeeder(UserRepository userRepository,
                      JobRepository jobRepository,
                      CandidateRepository candidateRepository,
                      ApplicationRepository applicationRepository,
                      ApplicationStageHistoryRepository historyRepository,
                      AiMatchingService aiMatchingService,
                      NotificationService notificationService,
                      PasswordEncoder passwordEncoder,
                      @Value("${app.demo.seed-data:true}") boolean seedDataEnabled) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.candidateRepository = candidateRepository;
        this.applicationRepository = applicationRepository;
        this.historyRepository = historyRepository;
        this.aiMatchingService = aiMatchingService;
        this.notificationService = notificationService;
        this.passwordEncoder = passwordEncoder;
        this.seedDataEnabled = seedDataEnabled;
    }

    @Override
    public void run(String... args) {
        ensureAdminUser();

        if (!seedDataEnabled) {
            log.info("Demo data seeding is disabled.");
            return;
        }

        if (userRepository.existsByEmail("recruiter@hireflow.ai")) {
            log.info("Database already populated with demo data. Skipping demo data seeding.");
            return;
        }

        log.info("Initializing HireFlow AI demonstration dataset...");

        // 1. Seed Users
        User recruiter = new User(
                "recruiter@hireflow.ai",
                passwordEncoder.encode("password123"),
                "Alex Rivera",
                Role.RECRUITER,
                "HireFlow Enterprise Solutions"
        );
        userRepository.save(recruiter);

        User admin = new User(
                "admin@hireflow.ai",
                passwordEncoder.encode("password123"),
                "Sarah Connor",
                Role.ADMIN,
                "HireFlow HQ"
        );
        userRepository.save(admin);

        // 2. Seed Jobs
        Job job1 = createJob(
                "Senior Full Stack Engineer",
                "Engineering",
                "San Francisco, CA (Hybrid)",
                EmploymentType.FULL_TIME,
                "We are seeking a seasoned Full Stack Engineer to lead our enterprise talent intelligence platform. You will build highly responsive interfaces, design resilient REST APIs, and integrate machine learning workflows.",
                "Architect scalable micro-frontends and reactive APIs; Mentor junior engineers; Optimize PostgreSQL database queries; Collaborate with AI product teams.",
                "React, TypeScript, Java, Spring Boot, PostgreSQL, Docker",
                "Kubernetes, Tailwind CSS, AWS, GraphQL",
                5,
                JobStatus.OPEN,
                recruiter
        );

        Job job2 = createJob(
                "AI Application Engineer",
                "Artificial Intelligence",
                "New York, NY (Remote)",
                EmploymentType.FULL_TIME,
                "Join our AI innovation lab to build enterprise LLM-powered recruitment assistance agents, semantic search systems, and automated resume parsing pipelines.",
                "Deploy generative AI models; Build safe tool-calling abstractions; Optimize vector search and similarity scoring; Maintain privacy-preserving data processing.",
                "Python, TypeScript, REST API, Docker, Machine Learning",
                "FastAPI, React, PostgreSQL, LangChain",
                3,
                JobStatus.OPEN,
                recruiter
        );

        Job job3 = createJob(
                "Frontend Platform Architect",
                "Product Experience",
                "Seattle, WA (On-site)",
                EmploymentType.FULL_TIME,
                "Lead frontend architectural design, design system standardization, and web performance optimization across multiple high-traffic SaaS applications.",
                "Establish core component library; Lead accessibility (WCAG 2.1 AA) compliance; Optimize Core Web Vitals; Guide modern TypeScript engineering practices.",
                "React, TypeScript, Tailwind CSS, Webpack, Testing Library",
                "Next.js, CI/CD, Vite, GraphQL",
                6,
                JobStatus.OPEN,
                recruiter
        );

        Job job4 = createJob(
                "DevOps & Site Reliability Engineer",
                "Infrastructure",
                "Austin, TX (Remote)",
                EmploymentType.FULL_TIME,
                "Drive cloud infrastructure automation, CI/CD pipeline reliability, and observability for mission-critical recruitment enterprise applications.",
                "Manage Kubernetes clusters; Automate Terraform configurations; Build Prometheus/Grafana dashboards; Conduct security compliance audits.",
                "Kubernetes, Docker, AWS, CI/CD, Terraform, Linux",
                "PostgreSQL, Python, Helm",
                4,
                JobStatus.OPEN,
                recruiter
        );

        jobRepository.saveAll(List.of(job1, job2, job3, job4));

        // 3. Seed Candidates (10 fictional realistic candidates)
        Candidate c1 = createCandidate("Maya", "Patel", "maya.patel@example.com", "+1-415-555-0101", "San Francisco, CA", "Senior Software Engineer", 6, "React, TypeScript, Java, Spring Boot, PostgreSQL, Docker, AWS", "Senior engineer with 6 years building high-scale Java Spring Boot and React web apps. Experienced in database performance tuning and containerized architectures.", recruiter);
        Candidate c2 = createCandidate("Ethan", "Zhang", "ethan.zhang@example.com", "+1-206-555-0102", "Seattle, WA", "Full Stack Developer", 4, "React, TypeScript, Node.js, PostgreSQL, Tailwind CSS, Docker", "Passionate full-stack developer experienced with React, Node.js, and relational database systems.", recruiter);
        Candidate c3 = createCandidate("Sophia", "Rodriguez", "sophia.rodriguez@example.com", "+1-512-555-0103", "Austin, TX", "AI/ML Engineer", 4, "Python, Machine Learning, TypeScript, Docker, REST API, PostgreSQL", "Specializes in applying LLMs, structured text extraction, and predictive matching models in enterprise systems.", recruiter);
        Candidate c4 = createCandidate("Liam", "Nakamura", "liam.nakamura@example.com", "+1-650-555-0104", "San Jose, CA", "Lead Frontend Architect", 8, "React, TypeScript, Tailwind CSS, Webpack, Next.js, CI/CD, Testing Library", "Frontend platform architect with 8 years building enterprise design systems and high-performance SPAs.", recruiter);
        Candidate c5 = createCandidate("Olivia", "Kim", "olivia.kim@example.com", "+1-212-555-0105", "New York, NY", "DevOps & Cloud Engineer", 5, "Kubernetes, Docker, AWS, CI/CD, Terraform, Linux, PostgreSQL", "Experienced SRE handling cloud migrations, multi-region Kubernetes deployments, and automated CI/CD.", recruiter);
        Candidate c6 = createCandidate("Lucas", "Bennett", "lucas.bennett@example.com", "+1-312-555-0106", "Chicago, IL", "Backend Java Specialist", 5, "Java, Spring Boot, PostgreSQL, Docker, REST API, Kubernetes", "Backend engineer dedicated to clean architecture, Spring Boot microservices, and high-throughput databases.", recruiter);
        Candidate c7 = createCandidate("Chloe", "Dubois", "chloe.dubois@example.com", "+1-617-555-0107", "Boston, MA", "Junior Full Stack Engineer", 2, "React, JavaScript, Python, SQL, HTML, CSS", "Motivated software engineer with foundational experience in React frontend development and relational databases.", recruiter);
        Candidate c8 = createCandidate("Marcus", "Johnson", "marcus.johnson@example.com", "+1-404-555-0108", "Atlanta, GA", "Staff Software Engineer", 9, "Java, Spring Boot, React, TypeScript, PostgreSQL, Docker, Kubernetes, AWS", "Staff engineer with 9+ years leading enterprise cloud-native applications and engineering teams.", recruiter);
        Candidate c9 = createCandidate("Aria", "Gupta", "aria.gupta@example.com", "+1-303-555-0109", "Denver, CO", "Product-Focused UI Engineer", 4, "React, TypeScript, Tailwind CSS, CSS3, Testing Library", "UI specialist experienced in accessible component libraries, animations, and frontend testing.", recruiter);
        Candidate c10 = createCandidate("Noah", "Vanderbilt", "noah.vanderbilt@example.com", "+1-206-555-0110", "Bellevue, WA", "Cloud Platform Engineer", 3, "Docker, Linux, AWS, CI/CD, Python", "Cloud engineer building containerized delivery pipelines and serverless backend integrations.", recruiter);

        candidateRepository.saveAll(List.of(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10));

        // 4. Seed Applications across pipeline stages
        Application a1 = createApplication(c1, job1, ApplicationStage.INTERVIEW, "Outstanding match score; completed initial phone screen with flying colors.", recruiter);
        Application a2 = createApplication(c2, job1, ApplicationStage.SCREENING, "Strong React background; reviewing Java experience.", recruiter);
        Application a3 = createApplication(c8, job1, ApplicationStage.OFFER, "Executive offer letter approved and sent.", recruiter);
        Application a4 = createApplication(c3, job2, ApplicationStage.SHORTLISTED, "Impressive generative AI background, invited for technical challenge.", recruiter);
        Application a5 = createApplication(c7, job2, ApplicationStage.APPLIED, "New application received via career portal.", recruiter);
        Application a6 = createApplication(c4, job3, ApplicationStage.HIRED, "Signed offer letter! Start date: First Monday of next month.", recruiter);
        Application a7 = createApplication(c9, job3, ApplicationStage.INTERVIEW, "On-site panel interview scheduled for Thursday 2 PM.", recruiter);
        Application a8 = createApplication(c5, job4, ApplicationStage.SHORTLISTED, "Strong Kubernetes and Terraform track record.", recruiter);
        Application a9 = createApplication(c10, job4, ApplicationStage.REJECTED, "Does not meet minimum 4 years Kubernetes production requirement.", recruiter);
        Application a10 = createApplication(c6, job1, ApplicationStage.SHORTLISTED, "Deep Spring Boot skills, solid candidate for platform team.", recruiter);

        applicationRepository.saveAll(List.of(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10));

        // 5. Seed stage history
        recordHistory(a1, ApplicationStage.APPLIED, ApplicationStage.SCREENING, recruiter, "Passed initial resume review");
        recordHistory(a1, ApplicationStage.SCREENING, ApplicationStage.SHORTLISTED, recruiter, "Approved by hiring manager");
        recordHistory(a1, ApplicationStage.SHORTLISTED, ApplicationStage.INTERVIEW, recruiter, "Technical interview scheduled");

        recordHistory(a3, ApplicationStage.APPLIED, ApplicationStage.SCREENING, recruiter, "Application screened");
        recordHistory(a3, ApplicationStage.SCREENING, ApplicationStage.SHORTLISTED, recruiter, "Shortlisted");
        recordHistory(a3, ApplicationStage.SHORTLISTED, ApplicationStage.INTERVIEW, recruiter, "Panel interviews completed");
        recordHistory(a3, ApplicationStage.INTERVIEW, ApplicationStage.OFFER, recruiter, "Formal offer extended");

        recordHistory(a6, ApplicationStage.APPLIED, ApplicationStage.SCREENING, recruiter, "Screened");
        recordHistory(a6, ApplicationStage.SCREENING, ApplicationStage.SHORTLISTED, recruiter, "Shortlisted");
        recordHistory(a6, ApplicationStage.SHORTLISTED, ApplicationStage.INTERVIEW, recruiter, "Technical loop passed");
        recordHistory(a6, ApplicationStage.INTERVIEW, ApplicationStage.OFFER, recruiter, "Offer accepted");
        recordHistory(a6, ApplicationStage.OFFER, ApplicationStage.HIRED, recruiter, "Candidate successfully hired!");

        // 6. Compute AI Match scores for applications
        List<Application> allApps = applicationRepository.findAll();
        for (Application app : allApps) {
            try {
                aiMatchingService.matchApplication(app.getId());
            } catch (Exception e) {
                log.warn("Error seeding AI match for app {}: {}", app.getId(), e.getMessage());
            }
        }

        // 7. Seed Notifications
        notificationService.createNotification(
                recruiter,
                "Interview Scheduled",
                "Maya Patel scheduled for Senior Full Stack Engineer interview.",
                NotificationType.STAGE_CHANGE,
                "/applications/" + a1.getId()
        );
        notificationService.createNotification(
                recruiter,
                "Offer Accepted!",
                "Liam Nakamura officially accepted offer for Frontend Platform Architect.",
                NotificationType.STAGE_CHANGE,
                "/applications/" + a6.getId()
        );
        notificationService.createNotification(
                recruiter,
                "New Application Received",
                "Chloe Dubois applied for AI Application Engineer.",
                NotificationType.NEW_APPLICATION,
                "/applications/" + a5.getId()
        );

        log.info("Demo data seeding completed successfully! Recruiter login: recruiter@hireflow.ai / password123");
    }

    private Job createJob(String title, String dept, String loc, EmploymentType type, String desc, String resp, String reqSkills, String prefSkills, int minExp, JobStatus status, User recruiter) {
        Job j = new Job();
        j.setTitle(title);
        j.setDepartment(dept);
        j.setLocation(loc);
        j.setEmploymentType(type);
        j.setDescription(desc);
        j.setResponsibilities(resp);
        j.setRequiredSkills(reqSkills);
        j.setPreferredSkills(prefSkills);
        j.setMinExperienceYears(minExp);
        j.setStatus(status);
        j.setRecruiter(recruiter);
        return j;
    }

    private Candidate createCandidate(String first, String last, String email, String phone, String loc, String title, int exp, String skills, String resumeText, User recruiter) {
        Candidate c = new Candidate();
        c.setFirstName(first);
        c.setLastName(last);
        c.setEmail(email);
        c.setPhone(phone);
        c.setLocation(loc);
        c.setCurrentTitle(title);
        c.setYearsOfExperience(exp);
        c.setSkillsSummary(skills);
        c.setResumeText(resumeText);
        c.setResumeOriginalFilename(first.toLowerCase() + "_" + last.toLowerCase() + "_resume.pdf");
        c.setRecruiter(recruiter);
        return c;
    }

    private Application createApplication(Candidate cand, Job job, ApplicationStage stage, String notes, User recruiter) {
        Application a = new Application();
        a.setCandidate(cand);
        a.setJob(job);
        a.setStage(stage);
        a.setNotes(notes);
        a.setRecruiter(recruiter);
        if (stage == ApplicationStage.INTERVIEW) {
            a.setInterviewDate(Instant.now().plus(2, ChronoUnit.DAYS));
        }
        return a;
    }

    private void recordHistory(Application app, ApplicationStage from, ApplicationStage to, User user, String comments) {
        ApplicationStageHistory h = new ApplicationStageHistory(app, from, to, user, comments);
        historyRepository.save(h);
    }

    private void ensureAdminUser() {
        java.util.Optional<User> adminOpt = userRepository.findByEmail("admin@email.com");
        if (adminOpt.isEmpty()) {
            User admin = new User(
                    "admin@email.com",
                    passwordEncoder.encode("admin"),
                    "System Administrator",
                    Role.ADMIN,
                    "HireFlow Enterprise"
            );
            userRepository.save(admin);
            log.info("Seeded primary administrator account: admin@email.com / admin");
        } else {
            User admin = adminOpt.get();
            admin.setRole(Role.ADMIN);
            admin.setPasswordHash(passwordEncoder.encode("admin"));
            userRepository.save(admin);
            log.info("Verified primary administrator account: admin@email.com / admin");
        }
    }
}
