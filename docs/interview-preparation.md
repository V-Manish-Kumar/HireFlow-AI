# HireFlow AI — Technical Interview Preparation & Architecture Defense

This document is prepared to guide architectural and full-stack technical interview discussions for a **Full Stack Software Engineer Intern / Junior Full Stack** role.

---

## 1. Top Architectural Talking Points

### Q: Why did you build a Modular Monolith instead of Microservices?
> **Answer**:
> "For an enterprise ATS of this scale, introducing microservices on day one introduces premature complexity: distributed transactions across job and candidate databases, network latency for relational queries, and the overhead of service meshes. Instead, I architected HireFlow AI as a **Modular Monolith** with strict module boundaries (authentication, jobs, candidates, applications, AI matching, analytics, audit).
> 
> Each module encapsulates its own repositories, services, and DTOs. When we need to scale individual compute-heavy operations—such as PDF resume extraction or LLM matching—we can easily extract the `ai` module into an asynchronous background worker communicating over a Kafka event bus without having to rewrite any core domain logic."

---

### Q: How does the AI Candidate Matching Engine work?
> **Answer**:
> "I designed the AI integration with a **provider-independent strategy abstraction** (`AiProvider`).
> 
> 1. **Baseline Deterministic Engine**:
>    - Builds an inverted skill corpus combining candidate tags, titles, and extracted resume plaintext.
>    - Normalizes common tech synonyms and aliases (e.g., `react.js` -> `react`, `postgres` -> `postgresql`, `k8s` -> `kubernetes`).
>    - Scores required skills with primary weight (55 points), preferred skills with secondary weight (20 points), and candidate experience ratio (25 points).
>    - Synthesizes dynamic, role-tailored technical interview questions based on both verified strengths and identified skill gaps.
> 
> 2. **Ethical AI & Explainability**:
>    - The system never makes automated rejection decisions.
>    - Scores are presented with a full explainable breakdown (which skills matched, which are missing, and why).
>    - The UI includes an explicit decision-support disclaimer reminding recruiters that scores are algorithmic estimates, not objective hiring predictions.
> 
> 3. **Fault-Tolerant LLM Augmentation**:
>    - An optional `LlmAiProvider` can enrich summaries with generative reasoning. If the external LLM provider experiences network timeouts, quota limits, or parsing errors, the system gracefully and transparently falls back to the deterministic baseline."

---

### Q: How did you ensure database integrity and performance?
> **Answer**:
> "1. **Unique Constraints**: A database-level unique constraint `uq_candidate_job(candidate_id, job_id)` prevents accidental duplicate applications for the same candidate and job opening.
> 2. **Normalized Email Identity**: Candidate email addresses are normalized to lowercase on ingestion with unique indexes to prevent duplicate candidate records.
> 3. **SQL Aggregations vs. In-Memory Calculation**: The dashboard metrics and funnel charts are calculated directly in PostgreSQL using `COUNT()` and `GROUP BY` aggregations rather than pulling entire tables into Java heap memory.
> 4. **Indexes**: Added B-tree indexes on `recruiter_id`, `status`, `stage`, and full text fields for optimal query execution plans.
> 5. **Schema Versioning**: Used Flyway migrations (`V1__init_schema.sql`) to ensure database version control is reproducible across all environments."

---

### Q: How is Security and Authorization handled?
> **Answer**:
> "1. **Spring Security 6 with JWT**: Completely stateless session management (`SessionCreationPolicy.STATELESS`).
> 2. **Password Security**: Passwords are never stored in plaintext; hashed using `BCryptPasswordEncoder`.
> 3. **IDOR & Ownership Verification**: Before updating or closing a job or candidate, the service verifies that the authenticated recruiter owns the resource (or holds an `ADMIN` role), preventing Insecure Direct Object References.
> 4. **File Upload Hardening**: Multi-part resume uploads are validated for `.pdf` magic extension, restricted to 10MB, stored outside the public web root with UUID filenames, and parsed securely using Apache PDFBox."

---

### Q: How would you scale HireFlow AI to 100,000+ candidates?
> **Answer**:
> "1. **Full-Text Search Engine**: Migrate keyword skill queries from PostgreSQL `LIKE` to PostgreSQL `tsvector`/GIN indexes or dedicated Elasticsearch / OpenSearch clusters.
> 2. **Asynchronous Resume Parsing**: Offload PDFBox parsing and LLM inference to a background queue (e.g. RabbitMQ / Celery / AWS SQS) so HTTP request threads return immediately with a job ID.
> 3. **Object Storage**: Store resume files in AWS S3 or Cloudflare R2 with pre-signed URLs instead of local disk storage.
> 4. **Read Replicas & Caching**: Cache job opening metadata and distinct departments in Redis, and route dashboard read analytics to a PostgreSQL read replica."
