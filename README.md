# HireFlow AI

HireFlow AI is an applicant tracking system for recruitment teams. It helps manage jobs, candidate profiles, interview stages, and AI-assisted candidate evaluation in a single workflow.

## Overview

This project combines:

- React 19 frontend with TypeScript
- Java Spring Boot backend
- PostgreSQL database
- Role-based access for admins, recruiters, hiring managers, and interviewers
- AI-based candidate matching and technical interview question generation

## Features

- Job requisition management with lifecycle tracking
- Candidate pool and resume parsing
- Recruiter pipeline workflow with stage transitions
- AI candidate matching with scoring and explainability
- User management and role-based access control
- Recruitment analytics and audit trail

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router 7, Recharts |
| Backend | Java 21, Spring Boot 3.3, Spring Data JPA, Spring Security 6 |
| Database | PostgreSQL 16/18, Hibernate ORM, Flyway |
| PDF Processing | Apache PDFBox |
| DevOps | Docker, Docker Compose, Vercel |

## Getting Started

### Prerequisites

- Java 21+
- Maven 3.9+
- Node.js 18+
- PostgreSQL 16/18

### Option 1: Docker Compose

```bash
git clone https://github.com/V-Manish-Kumar/HireFlow-AI.git
cd HireFlow-AI
cp .env.example .env
docker-compose up --build
```

Application URLs:

- Frontend: http://localhost:3000 (or http://localhost:5173)
- Backend API: http://localhost:8080/api
- Swagger UI: http://localhost:8080/swagger-ui/index.html

### Option 2: Run services separately

#### Start PostgreSQL

Create the database:

```sql
CREATE DATABASE hireflow_db;
```

#### Start backend

```bash
cd backend
mvn clean compile
mvn spring-boot:run
```

#### Start frontend

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173 in your browser.

## Default Test Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| Administrator | admin@email.com | admin |
| Recruiter | recruiter@hireflow.ai | password123 |
| Administrator | admin@hireflow.ai | password123 |

## Demo Flow

1. Sign in using one of the default accounts.
2. Open the dashboard to review hiring metrics.
3. Create or manage job openings.
4. Review candidates and resume details.
5. Move candidates through the hiring pipeline.
6. Explore AI candidate matching and analytics.

## Project Structure

```text
HireFlow-AI/
├── frontend/              # React frontend
├── backend/               # Spring Boot backend
├── docs/                  # Project documentation
├── docker-compose.yml     # Local services setup
├── vercel.json            # Frontend deployment config
├── package.json           # Root package config
├── .env.example           # Environment template
├── LICENSE                # MIT license
├── README.md              # Project overview
└── ...
```

## Documentation

- [System Architecture](docs/architecture.md)
- [Database Schema](docs/database-schema.md)
- [REST API Guide](docs/api-guide.md)
- [Interview Preparation Guide](docs/interview-preparation.md)

## License

This project is licensed under the MIT License.
