# ForeignLang - English Learning Platform

## Overview
ForeignLang is a comprehensive English learning platform featuring AI-powered tools, lesson management, and gamified learning experiences.

## Tech Stack
-   **Backend**: Spring Boot 3, Java 17, PostgreSQL.
-   **Frontend**: React (Vite), TypeScript, Tailwind CSS.
-   **Deployment**: Docker, Render.

## Prerequisites
-   Java 17+
-   Node.js 18+
-   PostgreSQL 14+ or Docker.

## Environment Variables
To run this application, you must set the following environment variables (locally in `.env` or in your Cloud Provider settings).

### Backend
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DB_URL` | Database Connection URL | `jdbc:postgresql://host:5432/db` |
| `DB_USERNAME` | Database Username | `postgres` |
| `DB_PASSWORD` | Database Password | `password` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `7216...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-...` |
| `SEPAY_API_TOKEN` | SePay API Token | `...` |
| `SEPAY_WEBHOOK_TOKEN` | SePay Webhook Token | `...` |
| `GEMINI_API_KEY` | Google Gemini AI Key | `AIza...` |

### Frontend
| Variable | Description |
| :--- | :--- |
| `VITE_API_BASE_URL` | Backend API URL (if separate) |

## Development
1.  **Backend**: `mvn spring-boot:run`
2.  **Frontend**: `cd frontend && npm run dev`

## Database Seeding
The application automatically seeds initial data on startup:
1.  **Schema Creation**: Hibernate automatically creates tables (`ddl-auto=update`).
2.  **Initial Data**: `DataSeeder` and `ContentDataSeeder` run on startup to populate:
    -   Default Users (Admin: `admin`/`admin123`, Teacher: `teacher`/`teacher123`).
    -   Sample Content (Topics, Lessons, Vocabulary).
    -   **Note**: Seeding is skipped if data already exists to prevent duplication.

## Security Features
- **Rate Limiting**: AI endpoints (`/api/v1/email/generate`, `/api/v1/chat/`) are protected against spam and abuse using Bucket4j (limit: 5 req/min per user/IP).
- **CORS Configuration**: Strict Cross-Origin Resource Sharing policy explicitly allowing only the configured frontend application.
- **API Documentation & Health**: Swagger UI (`/swagger-ui`) and Spring Boot Actuator (`/actuator`) are strictly secured and accessible only by users with the `ADMIN` role.
- **Global Error Handling**: Internal server errors are sanitized before reaching the client to prevent Java stack-trace information leaks.

## Deployment (Render)
1.  **Backend**: Deploy as a Web Service using the `Dockerfile`.
2.  **Frontend**: Deploy as a Static Site (`npm run build`, publish `dist`).
3.  **Database**: Create a PostgreSQL instance on Render or Neon.tech.
