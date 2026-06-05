# NextHire Local-First Development Plan

> Goal: build the product quickly on the local machine first, then move to Docker when the project is feature-complete and ready for team-wide shipping.

## Why This Plan

Early in a project, Docker often adds setup time, slower feedback loops, and extra debugging surface area. For NextHire, the faster path is:

1. Build and validate features locally.
2. Stabilize flows, schema, and environment variables.
3. Containerize once the app is ready to be shared, tested consistently, and deployed.

## Strategy

Use a local-first workflow during active feature development:

- Backend runs directly with PHP and Composer.
- Frontend runs directly with Node.js and Next.js.
- Database stays lightweight during early development.
- External services stay mocked, sandboxed, or optional until needed.

Move to Docker only after the product reaches a stable milestone:

- Core user journeys work end to end.
- Schema changes slow down.
- Environment variables are known.
- Team members need reproducible setup.
- Deployment preparation becomes more important than raw development speed.

## Phase 1: Local Foundation

### Objective

Get the project running on one machine with the shortest possible feedback loop.

### Recommended Local Setup

- Backend: Laravel running locally from `api/`
- Frontend: Next.js running locally from `web/`
- Database: SQLite for early backend work, or local MySQL only if relational parity is immediately required
- Queue/cache: keep simple during early development; enable Redis only when a feature truly depends on it

### Local Development Rules

- Prefer direct local commands over containers during feature building.
- Keep `.env` values optimized for local machine paths and localhost URLs.
- Use sandbox credentials for payments, email, SMS, and video integrations.
- Avoid coupling routine frontend/backend work to Docker health.

### Suggested Local Commands

Backend:

```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate
php artisan serve
```

Frontend:

```bash
cd web
npm install
npm run dev
```

### Recommended Local Environment Adjustments

For local-first work, prefer values like:

```env
APP_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

If using SQLite locally, switch from the Docker-oriented defaults to a local database configuration before running migrations.

## Phase 2: Core Feature Development

### Objective

Finish the product using the fastest workflow possible without introducing deployment complexity too early.

### Focus Areas

- Authentication and role flows
- Trainer, student, company, and admin journeys
- Booking and payment flows
- Interview session lifecycle
- Notifications, reviews, and gamification
- Frontend state, validation, and API integration

### Team Rule

During this phase, Docker is not the source of truth. The source of truth is the working local app and the codebase itself.

## Phase 3: Stabilization Before Docker

### Exit Criteria

Do not shift to Docker-first development until most of these are true:

- Main product flows work locally without major blockers
- Database schema is mostly stable
- API routes and payloads stop changing every day
- Required environment variables are known and documented
- Background jobs, cache, and storage needs are understood
- The team is ready for repeatable onboarding and QA setup

### Hardening Tasks

- Clean up `.env.example` files for non-Docker local usage
- Remove dead code and placeholder integrations
- Confirm migrations run cleanly from a fresh database
- Add smoke tests for auth, booking, and payment-critical paths
- Verify frontend production build succeeds
- Document required third-party credentials

## Phase 4: Shift to Docker

### Objective

Package the now-stable application so every developer, QA environment, and deployment target uses the same runtime shape.

### What Changes Here

- Docker becomes the shared runtime contract
- Services run together with Compose
- Database, Redis, and search service parity improves
- Environment setup becomes more reproducible

