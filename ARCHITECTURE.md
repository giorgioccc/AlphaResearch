# AlphaResearch — Architecture & Roadmap

## Product Vision

AI-powered financial research platform that helps investors, analysts, and students research companies, analyze financial data, and generate investment insights.

## Architecture

```
Frontend (React + Next.js App Router)
  ↓ HTTP / Server Actions
API Layer (Route Handlers + Server Actions + Middleware)
  ↓ Function calls
Service Layer (Business Logic)
  ↓ Domain objects
Repository Layer (Data Access via Prisma)
  ↓ SQL
Infrastructure (PostgreSQL, Redis, External APIs)
```

Dependencies point DOWN only. Never import from a layer above.

## Stack

| Technology  | Role                 | Layer          |
| ----------- | -------------------- | -------------- |
| Next.js 16  | Full-stack framework | All            |
| React 19    | UI rendering         | Frontend       |
| TailwindCSS | Styling              | Frontend       |
| shadcn/ui   | Component library    | Frontend       |
| Prisma      | ORM                  | Repository     |
| PostgreSQL  | Primary database     | Infrastructure |
| Redis       | Cache + sessions     | Infrastructure |
| Better Auth | Authentication       | Service        |
| Inngest     | Background jobs      | Service        |
| Sentry      | Error tracking       | Infrastructure |
| PostHog     | Product analytics    | Infrastructure |
| Docker      | Containerization     | Infrastructure |

## Bounded Contexts (MVP)

1. **Identity & Access** — Users, sessions, accounts, roles, plans
2. **Company Data** — Companies, financial statements, stock prices
3. **AI Research** — Conversations, messages, reports
4. **Workspace** — Workspaces, saved companies, notes

## Development Phases

| Phase | Name                         | Status  |
| ----- | ---------------------------- | ------- |
| 1     | Foundation & Planning        | Done    |
| 2     | Project Bootstrap & Infra    | Done    |
| 3     | Authentication               | Done    |
| 4     | Company Data & Financial API | Next    |
| 5     | AI Research Chat (MVP done)  | Planned |
| 6     | Workspaces & Organization    | Planned |
| 7     | Observability & Hardening    | Planned |
| 8     | Reports, Alerts & Advanced   | Planned |
