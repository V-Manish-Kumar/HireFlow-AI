# HireFlow AI — Enterprise AI Recruitment Platform

HireFlow AI is a modern, production-ready AI-powered Applicant Tracking System (ATS) built with a **React 19 + TypeScript** frontend, **Java Spring Boot 3** backend, **PostgreSQL** database, and an **explainable AI candidate matching engine**.

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-green?style=flat&logo=springboot)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2F18-blue?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)

---

## 🚀 Key Features

- **Recruiter Operations Dashboard**: Real-time analytics tracking active jobs, talent pools, scheduled interviews, and hiring conversion rates.
- **Job Requisition Management**: Full lifecycle management (`DRAFT`, `OPEN`, `CLOSED`), department catalogs, required/preferred skill criteria, and recruiter ownership authorization.
- **Candidate Pool & Resume Extraction**: Talent directory with search, filtering, duplicate candidate detection via normalized email, and multi-part PDF resume text extraction via **Apache PDFBox 3.0**.
- **Interactive Hiring Pipeline (Kanban)**: Visual workflow stages (`APPLIED` → `SCREENING` → `SHORTLISTED` → `INTERVIEW` → `OFFER` → `HIRED` / `REJECTED`), transition rule validation, and timestamped stage audit history.
- **Explainable AI Candidate Matching**:
  - Provider-independent AI abstraction (`AiProvider`).
  - Deterministic skill matching engine with synonym/alias normalization (`react.js` = `react`, `k8s` = `kubernetes`, `postgres` = `postgresql`).
  - Weighted scoring: Required Skills (55 pts), Preferred Skills (20 pts), Experience Alignment (25 pts).
  - Dynamic role-tailored technical interview question generation.
  - Ethical AI notice: Decision-support estimates with zero automated rejections.
  - Optional LLM provider integration with automatic graceful fallback.
- **User Role Governance (Admin Portal)**:
  - Role management: `ADMIN`, `RECRUITER`, `HIRING_MANAGER`, `INTERVIEWER`.
  - Admin controls for onboarding users, role reassignments, and account deactivation.
- **Recruitment Analytics**: Conversion funnels, monthly intake velocity, and applicant distribution across jobs powered by SQL aggregations and **Recharts**.
- **Audit History & Compliance**: Immutable compliance audit trail and in-app recruiter notifications.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, React Router 7, Axios, Recharts, Lucide Icons |
| **Backend** | Java 21, Spring Boot 3.3, Spring Data JPA, Spring Security 6, Bean Validation, Actuator |
| **Database** | PostgreSQL 16/18, Hibernate ORM, Flyway Migrations |
| **Security** | JWT (HMAC-SHA256 via `jjwt` 0.12.6), BCrypt Password Hashing, RBAC |
| **PDF Processing** | Apache PDFBox 3.0 |
| **Cloud & DevOps** | Vercel (Frontend), Docker, Docker Compose, Nginx, OpenAPI 3.0 / Swagger UI |

---

## 🌐 Vercel Deployment Guide

Deploying the HireFlow AI frontend to **Vercel** is pre-configured and ready out of the box with zero configuration needed.

### Method 1: Deploy with Root Directory set to `frontend` (Recommended)

1. **Import Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/new).
   - Click **Add New...** → **Project**.
   - Import `https://github.com/V-Manish-Kumar/HireFlow-AI.git`.
2. **Configure Project Settings**:
   - **Framework Preset**: `Vite` (automatically detected).
   - **Root Directory**: Click *Edit* and select `frontend`.
   - **Build Command**: `npm run build` (or default `tsc -b && vite build`).
   - **Output Directory**: `dist`.
3. **Set Environment Variables**:
   Under **Environment Variables**, add:
   ```env
   VITE_API_BASE_URL=https://your-backend-api.railway.app/api
   ```
   *(Replace with your live Spring Boot backend API URL, or leave blank if using a local backend proxy)*.
4. **Deploy**:
   - Click **Deploy**. Vercel will build and serve your production application with global edge CDN caching and automatic HTTPS.

### Method 2: Deploy from Repository Root

The repository includes a top-level `vercel.json` and `package.json`. If you import the repository with Root Directory as `./` (default):
- Vercel executes `cd frontend && npm install && npm run build`.
- Artifacts are served from `frontend/dist`.
- Client-side SPA routes (`/candidates`, `/jobs`, `/admin`, etc.) are automatically rewritten to `/index.html` to avoid 404 errors.

---

## ⚡ Local Development Quick Start

### Option 1: Docker Compose (All-in-one)

```bash
# Clone and enter repository
git clone https://github.com/V-Manish-Kumar/HireFlow-AI.git
cd HireFlow-AI

# Copy environment variables
cp .env.example .env

# Launch PostgreSQL, Spring Boot backend, and React frontend
docker-compose up --build
```
- Frontend UI: `http://localhost:3000` (or `http://localhost:5173`)
- Backend API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

---

### Option 2: Running Locally Step-by-Step

#### 1. Prerequisites
- **Java 21** or later (`java -version`)
- **Maven 3.9+** (`mvn -v`)
- **Node.js 18+** (`node -v`)
- **PostgreSQL 16/18** running on port `5432` with a database named `hireflow_db`.

#### 2. Start PostgreSQL
Ensure PostgreSQL is active and create database `hireflow_db`:
```sql
CREATE DATABASE hireflow_db;
```

#### 3. Start Spring Boot Backend
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```
*Flyway will automatically apply `V1__init_schema.sql` and `DataSeeder` will populate demo jobs, candidates, and AI matching evaluations.*

#### 4. Start React Frontend
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173` in your browser.

---

## 🔑 Default Test Credentials

Sign in using the pre-seeded credentials:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Primary Administrator** | `admin@email.com` | `admin` | Full user management, role governance, system audit & control |
| **Recruiter** | `recruiter@hireflow.ai` | `password123` | Pipeline management, job postings, candidate evaluations |
| **Secondary Administrator** | `admin@hireflow.ai` | `password123` | Platform administration access |

---

## 🎯 Demonstration Walkthrough Scenario

1. **Sign In as Administrator**: Navigate to `http://localhost:5173/login`, enter `admin@email.com` and `admin`, and click **Sign In to Workspace**.
2. **Access User Management**: In the left sidebar under **Administration**, click **User Management**. View all registered platform users, create new members, delete accounts, or instantly switch user roles (`ADMIN`, `RECRUITER`, `HIRING_MANAGER`, `INTERVIEWER`).
3. **Review Dashboard**: View live database KPI cards (Active Jobs, Candidates, Total Applications, Interviews, Conversion Rate), recruitment funnel distribution, and recent applications.
4. **Manage Job Openings**: Open **Job Openings**, search by department or skills, click **Create Job Opening** to define a new requisition, or click into **Senior Full Stack Engineer** to view applicants.
5. **Candidate Directory & PDF Resumes**: Open **Candidate Pool**, search candidates, filter by experience, and view profile details. Use **Upload PDF** to upload a resume file; watch Apache PDFBox parse the document and extract plaintext.
6. **Interactive Kanban Pipeline**: Open **Hiring Pipeline** to view the Kanban board. Filter by job requisition, and click **Move** on any candidate card to advance them through the validated stages (`Applied` → `Screening` → `Shortlisted` → `Interview` → `Offer` → `Hired`).
7. **AI Candidate Matching Report**: Click on any application (e.g., Maya Patel for Senior Full Stack Engineer). Inspect the **Candidate Evaluation Report**:
   - Overall Match Score (0–100) with Skills vs Experience breakdown.
   - Matched Required Skills pills (with green checkmarks).
   - Missing Qualifications pills (if any).
   - Matched Preferred Skills pills.
   - Contextual AI-generated Technical Interview Questions.
   - Click **Re-run Evaluation** to recalculate metrics in real-time.
8. **Recruitment Analytics**: Open **Recruitment Analytics** to inspect Recharts conversion funnel bars, monthly application intake trends, and job distributions.
9. **Audit Trail & OpenAPI**: Navigate to **Settings** to check Spring Boot Actuator `/actuator/health` telemetry and open **Swagger UI** (`http://localhost:8080/swagger-ui/index.html`) for interactive API testing.

---

## 🧪 Testing Commands

### Backend Automated Unit Tests
```bash
cd backend
mvn test
```
*Executes JUnit 5 and Mockito tests covering `BaselineAiProvider`, skill alias normalization, `ApplicationStage` transition validation, and `AuthService` registration.*

### Frontend Production Build Verification
```bash
cd frontend
npm run build
```
*Executes TypeScript compiler (`tsc -b`) and Vite production bundler.*

---

## 📦 Repository Structure

```
HireFlow-AI/
├── frontend/                # React 19 + Vite + TypeScript frontend
│   ├── src/
│   │   ├── components/      # UI components (Kanban, Modals, Badges, Layout)
│   │   ├── context/         # Auth & Notification contexts
│   │   ├── pages/           # 12+ application views (Dashboard, Jobs, Candidates, Admin)
│   │   ├── services/        # Axios API clients
│   │   └── types/           # TypeScript interfaces
│   ├── vercel.json          # Vercel SPA routing rewrite configuration
│   └── package.json
├── backend/                 # Spring Boot 3.3 Maven backend
│   ├── src/main/java/com/hireflow/
│   │   ├── config/          # Security, JWT, CORS, OpenAPI, DataSeeder
│   │   └── modules/         # Modular monolith business modules (Auth, Job, Candidate, AI, etc.)
│   └── src/main/resources/
│       ├── application.yml  # Spring Boot configuration
│       └── db/migration/    # Flyway schema migrations
├── docs/                    # Architectural & database documentation
├── docker-compose.yml       # Production container orchestration
├── vercel.json              # Top-level Vercel monorepo configuration
├── package.json             # Top-level build script for Vercel
├── .env.example             # Environment configuration template
└── README.md
```

---

## 📖 Additional Documentation

- [System Architecture](docs/architecture.md) — Modular monolith design, module boundaries, and microservice extraction strategy.
- [Database Schema](docs/database-schema.md) — Entity-relationship diagram, indexing strategies, and Flyway migrations.
- [REST API Guide](docs/api-guide.md) — Endpoint specifications, request/response payloads, and curl commands.
- [Interview Preparation Guide](docs/interview-preparation.md) — Technical defense notes and architecture talking points.

---

## 📄 License

This project is licensed under the MIT License.
