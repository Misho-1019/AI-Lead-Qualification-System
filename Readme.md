# 🤖 AI Lead Qualification System  
### Full-Stack Lead Management & AI-Powered Qualification Platform

A production-oriented full-stack web application designed to **capture, analyze, and prioritize sales leads using AI-driven insights and automated workflows**.

This project focuses on **real-world lead qualification pipelines, backend architecture, and asynchronous AI processing** — not just form handling or CRUD operations.

---

## 🎯 Project Purpose

Modern sales teams often struggle to efficiently prioritize inbound leads, relying on manual review and inconsistent qualification criteria.

**AI Lead Qualification System** addresses this by:

- capturing structured lead data
- automatically triggering AI analysis via workflow automation
- scoring and prioritizing leads based on business context
- generating actionable insights and outreach suggestions
- enabling faster and more consistent decision-making

The system is designed to simulate a **real internal sales tool**, where AI is integrated into the workflow rather than treated as a standalone feature.

---

## 🚀 Core Features

### Lead Management

- Create and store structured lead profiles
- Capture business-relevant fields (company, role, budget, industry, etc.)
- Status lifecycle management (new, contacted, qualified, lost)
- Centralized dashboard for lead overview

### AI Qualification & Insights

- Automated lead scoring and prioritization
- AI-generated summary and qualification reasoning
- Suggested next steps for sales actions
- Generated outreach email (subject + body)

### Workflow Automation (n8n Integration)

- Lead creation triggers external automation workflow
- Asynchronous AI processing via webhook
- Secure internal callback for analysis persistence
- Reanalysis support for updated lead evaluation

### Dashboard & UX

- KPI overview (total leads, analyzed leads, high-priority leads, average score)
- Search, filter, and sort functionality
- Lead cards with key business insights
- Detailed lead view with full AI output

---

## 🌐 Live Demo

- **Frontend (Vercel):** https://ai-lead-qualification-system-liart.vercel.app  
- **Backend API (Render):** https://ai-lead-qualification-system.onrender.com  

> ⚠️ Note:  
> This is a portfolio deployment.  
> AI analysis is processed asynchronously and may take a few seconds to appear.

---

## 🖼️ Screenshots

### 1️⃣ Dashboard (Search, Filter, Cards)

![Dashboard Page](views/Screenshot%202026-04-29%20041519.png)

### 2️⃣ Leads List (KPIs + Lead Overview)

![Leads List Page](views/Screenshot%202026-04-29%20041740.png)

### 3️⃣ Lead Details (AI Analysis)

![Leads Details Page](views/Screenshot%202026-04-29%20041618.png)
![Leads Details Page](views/Screenshot%202026-04-29%20041636.png)

### 4️⃣ Create New Lead

![New Lead Page](views/Screenshot%202026-04-29%20041552.png)

---

## 🏗️ Architecture Overview

The application follows a layered client–server architecture with external workflow integration:

### Client Layer (Next.js)

- Server and client components
- Dashboard UI with filtering and sorting
- Form handling and user interactions
- API communication via centralized request layer

### Backend API (Express + TypeScript)

- RESTful endpoints for lead management
- Service-layer architecture for business logic
- Validation middleware and error handling
- Integration with external automation workflows

### Workflow Layer (n8n)

- Receives lead data from backend
- Performs AI processing (scoring, summarization, generation)
- Sends results back via secure webhook callback

### Data Layer (PostgreSQL + Prisma)

- Lead and analysis persistence
- One-to-one relationship between lead and analysis
- Indexed queries for efficient retrieval
- Structured schema aligned with business workflow

This mirrors real-world systems where **AI processing is asynchronous and decoupled from the core API**.

---

## 🔄 Lead Processing Flow (Key Concept)

1. User creates a lead via the frontend  
2. Backend stores the lead in the database  
3. Backend triggers an n8n workflow via webhook  
4. n8n performs AI-based analysis  
5. n8n sends results back via secure internal callback  
6. Backend stores the analysis  
7. Frontend reflects updated insights automatically  

---

## 🔒 Security Considerations

- Internal API protected via secret key verification
- Input validation on all critical endpoints
- CORS restricted to trusted frontend origin
- Security headers via Helmet middleware
- Environment variables used for sensitive configuration

---

## 🛠️ Tech Stack

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- React Hot Toast

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- n8n (workflow automation)

---

## ▶️ Running Locally

### 1️⃣ Backend

```bash
cd server
npm install
npm run dev
```

### 2️⃣ Frontend

```bash
cd client
npm install
npm run dev
```

### 3️⃣ Environment Variables

#### Backend `.env`

```env
DATABASE_URL=
PORT=3030
N8N_WEBHOOK_URL=
INTERNAL_API_KEY=
FRONTEND_URL=
```

#### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=
```

---

## 🌱 Future Improvements

- Priority-based filtering and advanced search
- Pagination and backend-driven querying
- Retry mechanism for failed AI workflows
- Rate limiting for public endpoints
- Enhanced error handling and user feedback
- Activity history for lead updates

---

## 👤 Author Note

Built with a production mindset, focusing on **real-world sales workflows, asynchronous AI processing, and clean backend architecture**.

This project demonstrates how AI can be integrated into a structured system to provide **practical business value**, rather than being used as an isolated feature.
