# AlphaResearch

> **Status: In Development (Phase 3 complete) — not production-ready yet.**

AI-powered financial research platform that helps investors, analysts, and financial professionals research companies, analyze financial data, and generate investment insights.

## Tech Stack

| Technology        | Version | Role                        |
| ----------------- | ------- | --------------------------- |
| Next.js           | 16      | Full-stack framework        |
| React             | 19      | UI rendering                |
| TypeScript        | 5       | Language (strict mode)      |
| TailwindCSS       | 4       | Styling                     |
| shadcn/ui         | 4       | Component library (Base UI) |
| Prisma            | 7       | ORM with driver adapter     |
| PostgreSQL        | 17      | Primary database            |
| Redis             | 7       | Cache                       |
| Better Auth       | 1.x     | Authentication              |
| Docker Compose    | -       | Local dev infrastructure    |
| ESLint + Prettier | 9 / 3   | Linting and formatting      |
| Husky             | 9       | Git hooks (pre-commit)      |

## Architecture

```
Frontend (React + Next.js App Router)
  | HTTP / Server Actions
API Layer (Route Handlers + Server Actions + Middleware)
  | Function calls
Service Layer (Business Logic)
  | Domain objects
Repository Layer (Data Access via Prisma)
  | SQL
Infrastructure (PostgreSQL, Redis, External APIs)
```

Dependencies point **down only**. The frontend never accesses the database directly.

## What's Built

### Phase 1 — Foundation & Planning

- Product vision, feature set, and user stories
- System architecture with layered design and bounded contexts
- Domain model with 12 database tables across 4 bounded contexts
- Development roadmap (8 phases)

### Phase 2 — Project Bootstrap & Infrastructure

- Next.js 16 project with TypeScript strict mode (`noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`)
- Docker Compose for PostgreSQL 17 and Redis 7 (with health checks)
- Prisma 7 schema with driver adapter pattern (`pg` + `@prisma/adapter-pg`)
- Environment variable validation (`@t3-oss/env-nextjs` + Zod)
- ESLint 9 flat config + Prettier + Husky pre-commit hooks with lint-staged
- shadcn/ui v4 component library initialized
- Folder structure following layered architecture

### Phase 3 — Authentication

- Better Auth with email/password, Prisma adapter, database sessions
- Auth API catch-all route (`/api/auth/[...all]`)
- Client-side auth SDK (`signIn`, `signUp`, `signOut`, `useSession`)
- Server-side session helper for React Server Components
- Auth middleware for route protection (cookie-based gate)
- Login and register forms with error handling and loading states
- Dashboard layout with header, user nav, and sign-out
- Landing page with AlphaResearch branding
- Initial database migration (all 12 schema tables)

## Project Structure

```
src/
  app/
    (auth)/              # Auth pages (login, register) — centered card layout
    (dashboard)/         # Protected pages (dashboard) — header + nav layout
    api/auth/[...all]/   # Better Auth API handler
    layout.tsx           # Root layout
    page.tsx             # Landing page
  components/
    auth/                # Login and register form components
    layout/              # User nav, headers
    ui/                  # shadcn/ui primitives (button, card, input, label, separator)
  lib/
    auth-client.ts       # Client-side auth SDK
    auth-server.ts       # Server-side session helper
    db.ts                # Prisma client singleton (driver adapter pattern)
    env.ts               # Environment variable validation
    utils.ts             # Utility functions (cn)
  server/
    auth/                # Better Auth server configuration
prisma/
  schema.prisma          # Database schema (12 models, 4 bounded contexts)
  migrations/            # Prisma migrations
prisma.config.ts         # Prisma 7 config (project root — required location)
docker/
  docker-compose.yml     # PostgreSQL + Redis
```

## Database Schema

Four bounded contexts with 12 models:

- **Identity & Access** — User, Session, Account, Verification
- **Company Data** — Company, FinancialData, StockPrice
- **AI Research** — Conversation, Message, Report
- **Workspace** — Workspace, SavedCompany, Note

## Getting Started

### Prerequisites

- Node.js 20+
- Docker Desktop

### Setup

1. Clone the repository:

```bash
git clone https://github.com/giorgioccc/AlphaResearch.git
cd AlphaResearch
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env.local
```

4. Start the database and cache:

```bash
docker compose -f docker/docker-compose.yml up -d
```

5. Run the database migration:

```bash
npx prisma migrate dev
```

6. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Available Scripts

| Script                | Description                   |
| --------------------- | ----------------------------- |
| `npm run dev`         | Start development server      |
| `npm run build`       | Production build              |
| `npm run lint`        | Run ESLint                    |
| `npm run lint:fix`    | Run ESLint with auto-fix      |
| `npm run format`      | Format code with Prettier     |
| `npm run typecheck`   | Run TypeScript type checking  |
| `npm run db:generate` | Generate Prisma client        |
| `npm run db:migrate`  | Run database migrations       |
| `npm run db:push`     | Push schema without migration |
| `npm run db:studio`   | Open Prisma Studio            |

## Roadmap

| Phase | Name                         | Status  |
| ----- | ---------------------------- | ------- |
| 1     | Foundation & Planning        | Done    |
| 2     | Project Bootstrap & Infra    | Done    |
| 3     | Authentication               | Done    |
| 4     | Company Data & Financial API | Next    |
| 5     | AI Research Chat             | Planned |
| 6     | Workspaces & Organization    | Planned |
| 7     | Observability & Hardening    | Planned |
| 8     | Reports, Alerts & Advanced   | Planned |
