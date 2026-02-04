# ForeignLang - MVP Functional Requirements & Roadmap

## Overview
**Goal:** Build a web-based platform for Academic English & Workplace Skills improvement within 12 weeks.
**Team:** 4 Developers (Java/.NET background), 2 Content Creators.
**Stack:** Java 17/21, Spring Boot 3.x, PostgreSQL, Docker.

---

## Step 1: Functional Requirements (MVP Scope)

We will structure the application into modular components to allow parallel development. Given the mixed .NET/Java background, we will use standard N-Tier architecture terms (Controller, Service, Repository) which are common to both ecosystems.

### Module 1: Identity & Access Management (IAM)
**Dependencies:** `Spring Security`, `OAuth2 Client`, `Spring Data JPA`
**Owner:** Java Dev
**Core Features:**
1.  **Google OAuth2 Login:**
    *   Secure login flow using Google as the Identity Provider.
    *   Auto-registration of new users into the `users` table upon first login.
2.  **Role-Based Access Control (RBAC):**
    *   **Guest:** Access to Landing Page & Consultant Bot only.
    *   **Learner:** Access to Lessons, Templates, and AI tools (subject to quotas).
    *   **Admin:** Access to CMS dashboard.
3.  **JWT / Session Management:** Secure session handling for API requests.

### Module 2: Subscription & Usage Core
**Dependencies:** `Spring Data JPA`, `Spring Web`
**Owner:** .NET Dev 1 (Logic heavy)
**Core Features:**
1.  **Daily Usage Tracking:**
    *   Count every call made to the AI Service.
    *   Reset counters automatically at 00:00 UTC (Scheduled Task).
2.  **Quota Enforcement Middleware:**
    *   Interceptor/Filter to check `current_usage < daily_limit` before forwarding requests to AI.
    *   Return `403 Forbidden` or specific error code if limit reached.
3.  **Subscription State:**
    *   Simple toggle or status (`FREE`, `PREMIUM`).
    *   (MVP Simplification) Admin can manually upgrade users, or a simple "I paid" mock button for demo.

### Module 3: Dynamic Content Management (CMS)
**Dependencies:** `Spring Data JPA`, `Spring Web`
**Owner:** .NET Dev 2 (CRUD heavy)
**Core Features:**
1.  **Lesson & Topic Management:**
    *   Admin APIs to Create/Update/Delete Topics (e.g., "Business Emails").
    *   Rich text storage for lesson content.
2.  **Template Repository:**
    *   Store structure for emails/reports (e.g., "Subject: [Topic]... Body: Dear [Name]...").
3.  **Vocabulary Bank:**
    *   CRUD for key terms and definitions linked to Topics.

### Module 4: AI Orchestration Service
**Dependencies:** `Spring Web` (WebClient/RestClient), `AI SDK` (LangChain4j or direct API)
**Owner:** AI Specialist
**Core Features:**
1.  **Prompt Engineering Layer:**
    *   Centralized management of System Prompts for different personas.
2.  **Consultant Bot (Public):**
    *   Lightweight bot for site navigation and basic FAQs.
3.  **Mini-Teacher (Context Aware):**
    *   Chat endpoint that accepts `current_lesson_id` context to answer specific questions.
4.  **Evaluator Engine:**
    *   Endpoint accepting user text input.
    *   Returns structured JSON: `{ "score": 8, "corrections": [...], "tone_analysis": "..." }`.

---

## Development Phases (12 Weeks)

*   **Weeks 1-2:** Project Setup, Docker DB, OAuth2 Hello World, Database Design.
*   **Weeks 3-5:** CMS Module (Content Creators need this early to start inputting data).
*   **Weeks 6-8:** AI Integration & Usage Tracking (The core logic).
*   **Weeks 9-10:** Frontend Integration (Thymeleaf or React/Angular depending on team skills) & UI Polish.
*   **Weeks 11-12:** Testing, Bug Fixes, Deployment Prep.
