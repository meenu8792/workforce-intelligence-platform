# Final Review Demo Guide

**Application:** AI-Powered Workforce Analytics & Talent Intelligence Dashboard  
**Live URL:** https://aiworkforcesystem.netlify.app/  
**Target duration:** 5 minutes

## Before recording

- Open the live site and confirm it loads.
- Use demonstration accounts and seeded demo data only.
- Confirm the dashboard, Talent Intelligence area, and Workforce Copilot can be opened.
- Close unrelated tabs and notifications.
- Start screen recording only after the app is ready.
- Do not display secrets or real employee information.

## Five-minute run of show

### 0:00–0:30 — Introduction

“Good morning. Our project is the AI-Powered Workforce Analytics and Talent Intelligence Dashboard. It brings workforce operations and analytical views into one role-oriented web application.”

### 0:30–1:10 — Role-oriented experience

Show the dashboard/navigation and explain the four intended roles: Admin, HR, Manager, and Employee. Describe only the access restrictions you have actually tested.

### 1:10–2:00 — Workforce overview

Show KPI cards and one chart. Explain that visual summaries help users review employee, attendance, and workforce information in one place.

### 2:00–2:45 — Talent insights

Show skill, performance, training, or attrition-related fields. Explain that these are signals for human review and planning, not guaranteed predictions.

### 2:45–3:50 — Workforce Copilot

Ask one supported question, such as attendance rate or skill gaps. Explain that the current implementation uses supported question matching and calculations over application state. Do not claim a live external LLM or validated machine-learning model unless that is verified in the code.

### 3:50–4:25 — Data and technology

Mention Next.js, React, TypeScript, Tailwind CSS, Zustand, Recharts, and CSV parsing. Explain that the repository includes Drizzle/PostgreSQL configuration, but its schema entry point is currently empty and the demo data is generated in the application.

### 4:25–5:00 — Close

“The main value is the combination of role-oriented workforce workflows, visual summaries, talent-related information, and a conversational way to access supported insights. These features aim to make workforce information easier to review and support informed decisions. Thank you; I’m happy to take questions.”

## Q&A reminders

- Dataset: deterministic seeded demonstration records; the seed builder generates 120 employee records.
- Copilot: keyword/rule-based supported queries and calculations in the current component, not evidence of a live LLM integration.
- Database: PostgreSQL/Drizzle packages and configuration exist, but confirm active runtime persistence before claiming all records are stored in PostgreSQL.
- Prediction accuracy: do not provide a percentage without measured evaluation results.
- Role security: describe the intended role structure; claim secure enforcement only after testing server-side controls.

## Recording and publishing

1. Record the working application using a screen recorder.
2. Keep the video to approximately 5 minutes and ensure text is readable.
3. Review the video for private data, secrets, loading errors, and incorrect claims.
4. Upload it to the team's approved location (e.g. unlisted video or repository release) and paste the real URL here.
