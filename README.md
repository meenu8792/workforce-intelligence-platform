# Workforce Intelligence Platform

A workforce-management web application built with Next.js, React, TypeScript, Tailwind CSS, Zustand, and Recharts. It brings role-oriented workforce workflows and visual summaries into one interface.

**Project Presentation**
**[View / Download](docs/Workforce_Intelligence_Platform_Presentation.pptx)** 
  This presentation introduces the project's objectives, key features, technology stack, and application workflow.
## Project Demo
Watch the recorded demonstration of the Workforce Intelligence Platform.

- **[Watch / Download Demo Video](https://github.com/meenu8792/workforce-intelligence-platform/releases/tag/demo-v1.0)**
- **[Launch Live Application](https://aiworkforcesystem.netlify.app/)**
- **[View Source Code](https://github.com/meenu8792/workforce-intelligence-platform)**
- **[View Agile Documentation](https://github.com/meenu8792/workforce-intelligence-platform/blob/main/docs/AGILE_DELIVERY.md)**

## Main capabilities

- Role-oriented experiences for Admin, HR, Manager, and Employee users.
- Workforce records and seeded demonstration data.
- Attendance, leave, shifts, timesheets, salary records, issues, notifications, and audit-related views.
- Workforce dashboards and chart-based summaries.
- Talent-related fields and insights, including skills, performance, training, and attrition-risk labels.
- Workforce Copilot with supported question patterns and calculations against the current application state.
- CSV import support using PapaParse.

> **Data and AI note:** The repository seeds a deterministic demonstration dataset (120 employee records plus related workforce records). Copilot logic in `src/components/WorkforceCopilot.tsx` uses rule/keyword matching and calculations over application data; do not describe it as a live LLM integration or a validated predictive model unless separately implemented and tested. Insights support human review and do not guarantee prediction accuracy.

## Technology

- Next.js 16 and React 19
- TypeScript
- Tailwind CSS 4
- Zustand for client-side state
- Recharts for visualisations
- PapaParse for CSV parsing
- Drizzle ORM and `pg` PostgreSQL driver are included in the project
- ESLint and TypeScript for code checks

## Requirements

- Node.js compatible with the versions required by the installed Next.js release
- npm
- PostgreSQL only if using the database connection path

## Install and run locally

1. Clone the repository:

   ```bash
   git clone https://github.com/meenu8792/workforce-intelligence-platform.git
   cd workforce-intelligence-platform
   ```

2. Install dependencies:

   ```bash
   npm ci
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Available scripts

- `npm run dev` — start the Next.js development server
- `npm run build` — create a production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript checks

Run `npm run build`, `npm run lint`, and `npm run typecheck` before submitting changes.

## Data and database configuration

The application initialises demo workforce records in `src/lib/seed.ts` and manages client-side state in `src/lib/store.ts` using Zustand persistence. The repository also includes PostgreSQL/Drizzle setup under `src/db` and `drizzle.config.json`. The current schema entry point `src/db/schema.ts` does not define database tables, so verify database-backed persistence and deployment environment configuration before describing PostgreSQL as the active store for all application records.
