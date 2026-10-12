# HireFlow AI — System Architecture Document

## 1. Architectural Philosophy: The Modular Monolith

HireFlow AI is designed as a **production-oriented Modular Monolith**. Instead of introducing the operational overhead, network latency, and distributed data consistency challenges of premature microservices, the system maintains clean internal bounded contexts while running within a single cohesive deployment unit.

```
                           +---------------------------+
                           |  React 19 + Vite Frontend |
                           |  (Tailwind CSS, Lucide)   |
                           +-------------+-------------+
                                         |
                                  HTTPS / REST
                                         |
                           +-------------v-------------+
                           |   Spring Boot 3.3 Backend |
                           |  (Spring Security 6, JWT) |
                           +-------------+-------------+
                                         |
          +---------------+--------------+--------------+---------------+
          |               |              |              |               |
    +-----v-----+   +-----v-----+  +-----v-----+  +-----v-----+   +-----v-----+
    |   Auth    |   |   Jobs    |  |Candidates |  |Applications|  |Analytics  |
    | & Users   |   |  Module   |  |  Module   |  | & Pipeline |  |  Module   |
    +-----------+   +-----------+  +-----------+  +-----------+   +-----------+
          |               |              |              |               |
          |         +-----v-----+        |        +-----v-----+         |
          |         |  Audit    |        |        |    AI     |         |
          |         |  Module   |        |        | Matching  |         |
          |         +-----------+        |        +-----+-----+         |
          |                              |              |               |
          +---------------+--------------+--------------+---------------+
                                         |
                           +-------------v-------------+
                           |   PostgreSQL 16/18 DB     |
                           |   (Flyway Migrations)     |
                           +---------------------------+
```

---

## 2. Module Boundaries & Responsibilities

| Module | Primary Responsibilities | Dependencies |
| :--- | :--- | :--- |
| **Authentication & Users** | User registration, BCrypt password hashing, JWT signing/verification, Role-based Access Control (`RECRUITER`, `ADMIN`). | `UserRepository` |
| **Job Management** | Job opening lifecycle (`DRAFT`, `OPEN`, `CLOSED`), department catalog, experience & skill requirements, ownership verification. | `JobRepository`, `AuditService` |
| **Candidate Management** | Candidate directory, duplicate email detection, talent profiles, PDF resume storage, text extraction. | `CandidateRepository`, `ResumeProcessingService` |
| **Resume Processing** | Multi-part PDF upload validation (type check, 10MB size limit), safe filesystem storage, Apache PDFBox text extraction. | Apache PDFBox, Local Disk |
| **Application & Pipeline** | Candidate-to-job application linking, duplicate prevention, stage transitions (`APPLIED` → `SCREENING` → `SHORTLISTED` → `INTERVIEW` → `OFFER` → `HIRED`), transition rule validation, timestamped stage history. | `JobRepository`, `CandidateRepository`, `NotificationService`, `AuditService`, `AiMatchingService` |
| **AI Matching Engine** | Provider-independent candidate evaluation, skill alias normalization, experience weighting, explainable breakdown, technical interview question generation. | `BaselineAiProvider`, `LlmAiProvider` |
| **Recruitment Analytics** | Database-aggregated pipeline funnels, monthly intake velocity, application distribution across jobs, dashboard KPIs. | `ApplicationRepository`, `JobRepository` |
| **Notifications** | In-app notification creation, unread count tracking, state updates. | `NotificationRepository` |
| **Audit Trail** | Immutable security and operational audit logging. | `AuditEventRepository` |

---

## 3. Extensible AI Provider Abstraction

Candidate matching implements the **Strategy Pattern** via the `AiProvider` interface:

```java
public interface AiProvider {
    MatchResult computeMatch(Application application);
    String getProviderName();
}
```

### Implementations:
1. **`BaselineAiProvider` (Deterministic Foundation)**:
   - Evaluates required skill coverage (55% weighting) using word-boundary matching and synonym/alias normalization (e.g. `react.js` = `react`, `postgres` = `postgresql`, `k8s` = `kubernetes`).
   - Evaluates preferred skill coverage (20% weighting).
   - Evaluates minimum experience ratio (25% weighting).
   - Generates contextual technical interview questions tailored to matched and missing skills.
   - Guaranteed 0 latency external dependency; always available.

2. **`LlmAiProvider` (Optional LLM Integration)**:
   - Configurable via `AI_API_KEY`, `AI_MODEL`, and `AI_API_URL` environment variables.
   - Augments baseline facts with structured model reasoning.
   - **Fault-Tolerant Fallback**: If the external provider experiences network timeout, quota exhaustion, or parsing failures, it seamlessly delegates back to `BaselineAiProvider` without impacting user operations.

---

## 4. Security & Authorization Architecture

1. **Stateless JWT Authentication**:
   - Cryptographically signed with HMAC-SHA256 (`Keys.hmacShaKeyFor`).
   - Tokens contain `userId`, `email`, and `role`.
   - Injected into every authorized frontend request via Axios interceptors (`Authorization: Bearer <token>`).

2. **Role-Based Access Control (RBAC)**:
   - Spring Security 6 Method Security (`@EnableMethodSecurity`).
   - Distinguishes between `RECRUITER` and `ADMIN`.

3. **Ownership Verification & IDOR Protection**:
   - Recruiters can only modify, delete, or advance jobs and candidates they own or manage within their tenant company.
   - Admin roles retain organization-wide supervisory access.

---

## 5. Microservice Extraction Roadmap

If organizational scale requires extracting independent microservices in the future:

1. **AI Matching Service Extraction**:
   - Extract `com.hireflow.modules.ai` into an independent Python or Java service (`hireflow-ai-worker`).
   - Connect via an asynchronous message broker (e.g., Apache Kafka or RabbitMQ).
   - When an application is created or a resume is uploaded, the core monolith publishes `ApplicationCreatedEvent`.
   - The AI worker consumes the event, evaluates the candidate, and publishes `MatchCompletedEvent` which the core monolith consumes to update `match_results`.

2. **Notification Service Extraction**:
   - Extract `NotificationService` into a standalone service handling multi-channel delivery (WebSockets, SendGrid email, Slack webhooks).
