# HireFlow AI — Frontend (React 19 + TypeScript + Vite)

The enterprise recruiter interface for **HireFlow AI**, featuring candidate talent pools, interactive Kanban pipelines, AI match reports, recruitment analytics, and user role administration.

## 🚀 Quick Start (Local)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application runs on `http://localhost:5173`. Requests to `/api/*` are automatically proxied to `http://localhost:8080`.

## 🌐 Vercel Deployment

### Deploy Option A: Root Directory set to `frontend`
1. In the Vercel Dashboard, create a **New Project** and import the repository: `https://github.com/V-Manish-Kumar/HireFlow-AI.git`.
2. Set **Root Directory** to `frontend`.
3. Vercel automatically detects **Vite**.
4. In **Environment Variables**, add:
   - `VITE_API_BASE_URL`: URL of your deployed Spring Boot backend (e.g., `https://hireflow-backend.up.railway.app/api` or `https://backend.onrender.com/api`).
5. Click **Deploy**.

### Deploy Option B: Deploy from Monorepo Root
The root `vercel.json` and `package.json` handle building the frontend from repository root automatically.

### SPA Routing Support
`vercel.json` includes rewrite rules to ensure client-side routing (`/candidates`, `/jobs`, `/admin`, `/login`, etc.) does not 404 on page refresh.

## 📦 Production Build Verification

```bash
npm run build
```
Build output is generated into the `dist/` directory.
