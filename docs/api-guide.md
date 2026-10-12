# HireFlow AI — REST API Developer Guide

## 1. Overview & Base URL

HireFlow AI provides a RESTful API compliant with OpenAPI 3.0 standards.

- **Base URL**: `http://localhost:8080/api`
- **Interactive Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **Raw OpenAPI JSON Spec**: `http://localhost:8080/v3/api-docs`

---

## 2. Standard Response Format

All responses follow a consistent envelope:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-10-12T14:30:02.615Z"
}
```

### Validation Error Format (HTTP 400):
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "email": "Invalid email format",
    "password": "Password must be at least 6 characters"
  },
  "timestamp": "2026-10-12T14:30:02.615Z"
}
```

---

## 3. Endpoints Catalog

### Authentication
- `POST /api/auth/register` — Register a recruiter or administrator
- `POST /api/auth/login` — Login and receive JWT bearer token
- `GET /api/auth/me` — Retrieve profile of currently authenticated user

#### Sample Login Request:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recruiter@hireflow.ai",
    "password": "password123"
  }'
```

---

### Dashboard & Analytics
- `GET /api/dashboard/stats` — Overall metrics (active jobs, candidates, conversion rate)
- `GET /api/dashboard/activity` — Recent activity log
- `GET /api/analytics/pipeline` — Funnel breakdown across hiring stages
- `GET /api/analytics/applications-over-time` — Monthly application trends
- `GET /api/analytics/jobs` — Applicant count distributed across jobs

---

### Job Openings
- `GET /api/jobs` — Paginated jobs with keyword, status, and department filters
- `POST /api/jobs` — Create a new job opening
- `GET /api/jobs/{id}` — Get single job posting details
- `PUT /api/jobs/{id}` — Update job details (title, skills, description)
- `PATCH /api/jobs/{id}/status` — Update job status (`DRAFT`, `OPEN`, `CLOSED`)
- `DELETE /api/jobs/{id}` — Delete job opening

---

### Candidate Pool & Resumes
- `GET /api/candidates` — Paginated candidates with keyword and minExperience filters
- `POST /api/candidates` — Add candidate profile (duplicate email rejected)
- `GET /api/candidates/{id}` — Get single candidate profile
- `PUT /api/candidates/{id}` — Update candidate profile
- `POST /api/candidates/{id}/resume` — Multi-part PDF upload with PDFBox text extraction
- `DELETE /api/candidates/{id}` — Delete candidate profile

---

### Recruitment Applications & Pipeline
- `GET /api/applications` — Paginated applications with job, stage, and keyword filters
- `GET /api/applications/job/{jobId}` — All applications for a specific job (ideal for Kanban)
- `POST /api/applications` — Link candidate to a job (duplicate prevention enforced)
- `GET /api/applications/{id}` — Application details and latest match score
- `PATCH /api/applications/{id}/stage` — Advance stage with transition validation and timestamped history
- `GET /api/applications/{id}/history` — Application stage audit timeline

---

### AI Candidate Matching
- `POST /api/applications/{id}/match` — Run AI matching analysis
- `GET /api/applications/{id}/match-results` — Get latest evaluation results
- `GET /api/candidates/{candidateId}/jobs/{jobId}/match` — Evaluate candidate/job pair

#### Sample AI Match Result Response:
```json
{
  "success": true,
  "message": "AI match analysis completed",
  "data": {
    "id": 1,
    "applicationId": 1,
    "candidateId": 1,
    "jobId": 1,
    "overallScore": 92,
    "skillsScore": 67,
    "experienceScore": 25,
    "matchingRequiredSkills": ["React", "TypeScript", "Java", "Spring Boot", "PostgreSQL"],
    "missingRequiredSkills": [],
    "matchingPreferredSkills": ["Docker", "AWS"],
    "summary": "Candidate matches 5 of 5 required skills (React, TypeScript, Java, Spring Boot, PostgreSQL) and 2 preferred skills with 6 years of relevant experience (role requires 5+ years).",
    "interviewQuestions": [
      "Can you walk us through a production system where you designed and implemented features using React?",
      "How do you manage performance, state, and concurrency when working with TypeScript?",
      "In your previous roles as Senior Full Stack Engineer, how did you balance technical debt with tight delivery schedules?"
    ],
    "provider": "BASELINE",
    "algorithmVersion": "v1.0-deterministic",
    "disclaimer": "Match scores are decision-support estimates based on algorithmic analysis of skills and experience, not objective probabilities of job success or hiring decisions."
  }
}
```

---

### Notifications & Audit
- `GET /api/notifications` — Paginated notifications
- `GET /api/notifications/unread-count` — Count of unread alerts
- `PATCH /api/notifications/{id}/read` — Mark notification read
- `POST /api/notifications/read-all` — Mark all read
- `GET /api/audit-events` — Paginated audit events log

---

### Administration & Access Governance (`ROLE_ADMIN` only)
- `GET /api/admin/users` — List all registered platform users
- `GET /api/admin/users/{id}` — Retrieve specific user details
- `POST /api/admin/users` — Create user with designated role (`ADMIN`, `RECRUITER`, `HIRING_MANAGER`, `INTERVIEWER`)
- `PUT /api/admin/users/{id}/role` — Update a user's role and permission privileges
- `PUT /api/admin/users/{id}` — Update user profile details and credentials
- `DELETE /api/admin/users/{id}` — Delete user account (with safeguards against deleting own active admin account)

