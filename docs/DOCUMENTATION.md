# NextHire — Full Developer Documentation

> **Platform:** Mock Interview & Career Development Platform  
> **Domain:** mnexthire.com  
> **Stack:** Laravel 12 (API) · React + TypeScript (Frontend) · MySQL · Redis  
> **Version:** 1.0.0 | **Status:** DRAFT  
> **Target Markets:** Bangladesh · India · Pakistan  
> **Prepared by:** Boni Yeamin

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Repository Structure](#4-repository-structure)
5. [Environment Setup](#5-environment-setup)
6. [Database Design](#6-database-design)
7. [Backend — Laravel 12 API](#7-backend--laravel-12-api)
8. [Frontend — React + TypeScript](#8-frontend--react--typescript)
9. [Authentication System](#9-authentication-system)
10. [Role-Based Access Control](#10-role-based-access-control)
11. [Modules & Business Logic](#11-modules--business-logic)
12. [Gamification Engine](#12-gamification-engine)
13. [Payment System](#13-payment-system)
14. [Video Session System](#14-video-session-system)
15. [API Reference](#15-api-reference)
16. [Testing](#16-testing)
17. [Deployment & DevOps](#17-deployment--devops)
18. [Monitoring & Alerting](#18-monitoring--alerting)
19. [Security Checklist](#19-security-checklist)
20. [Workflows & Business Rules](#20-workflows--business-rules)

---

## 1. Project Overview

NextHire is a cloud-based, gamified Mock Interview & Career Development Platform. It connects students and job seekers with professional interview trainers through a structured marketplace with video sessions, gamification, and a B2B company hiring pipeline.

### Roles

| Role | Description |
|------|-------------|
| **Student** | Registers, books trainers, attends sessions, earns XP/badges |
| **Trainer** | Creates packages, conducts sessions, evaluates students, receives payouts |
| **Company** | Posts hiring campaigns, searches talent pool, conducts interviews |
| **Super Admin** | Manages users, approves trainers, verifies companies, views revenue |

### Key Business Rules

- Student pays → platform holds payment → session completed → trainer balance updated → weekly payout
- 20% platform commission deducted from every trainer payout
- Trainers cannot go live until admin-approved
- Companies must pass KYC before accessing the talent pool
- Refund allowed within 24 hours of booking only
- Video sessions capped at 60 minutes in MVP

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
│   React + TypeScript (Web)    │    Flutter (iOS / Android)      │
└────────────────┬───────────────┴──────────────────┬────────────┘
                 │ HTTPS / JSON                      │ HTTPS / JSON
┌────────────────▼───────────────────────────────────▼────────────┐
│                     Laravel 12 REST API                          │
│        api.mnexthire.com/v1 — JWT Auth — Role Middleware         │
├──────────────────────────────────────────────────────────────────┤
│  Services Layer                                                  │
│  AuthService · BookingService · PaymentService · XPService       │
│  BadgeService · LeaderboardService · VideoService · PayoutService│
├──────────────────────────────────────────────────────────────────┤
│  Queue (Laravel Horizon + Redis)                                  │
│  XP Awards · Badge Checks · Notifications · Payouts · Invoices   │
├──────────────────────────────────────────────────────────────────┤
│  Data Layer                                                      │
│  MySQL 8 (primary)  │  Redis 7 (cache/queue/leaderboard)        │
│  AWS S3 (files)     │  Meilisearch (search)                     │
└──────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼──────────────────┐
              │               │                  │
         Agora.io         SSLCommerz          AWS SES
       (Video SDK)     bKash/Nagad/Stripe    (Email)
                          (Payments)
```

---

## 3. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend Web | React + TypeScript | 18+ | SPA with SSR via Next.js 14 |
| Frontend Mobile | Flutter | 3.x | iOS & Android |
| Backend API | Laravel | 12.x | REST API, business logic |
| Database | MySQL | 8.0+ | Primary relational store |
| Cache / Queue | Redis | 7.x | Sessions, leaderboard, jobs, OTP |
| Queue Worker | Laravel Horizon | Latest | Background job processing |
| Video | Agora.io SDK | Latest | Real-time video sessions |
| Search | Meilisearch | 1.x | Trainer & candidate full-text search |
| File Storage | AWS S3 / DO Spaces | — | Resumes, avatars, invoices |
| Email | Amazon SES / Mailgun | — | Transactional emails |
| SMS | Twilio / SSL Wireless | — | OTP, session reminders |
| Containerization | Docker + Compose | Latest | Dev & production parity |
| CI/CD | GitHub Actions | — | Automated test and deploy |
| Monitoring | Sentry + Laravel Telescope | — | Error tracking, query profiling |

---

## 4. Repository Structure

### Monorepo Layout

```
nexthire/
├── api/                          # Laravel 12 Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/V1/   # API controllers by domain
│   │   │   │   ├── Auth/
│   │   │   │   ├── Student/
│   │   │   │   ├── Trainer/
│   │   │   │   ├── Company/
│   │   │   │   ├── Admin/
│   │   │   │   ├── Booking/
│   │   │   │   ├── Payment/
│   │   │   │   └── Gamification/
│   │   │   ├── Middleware/
│   │   │   │   ├── RoleMiddleware.php
│   │   │   │   └── EnsureEmailVerified.php
│   │   │   └── Requests/         # Form Request validation classes
│   │   ├── Models/               # Eloquent models
│   │   │   ├── User.php
│   │   │   ├── Student.php
│   │   │   ├── Trainer.php
│   │   │   ├── Company.php
│   │   │   ├── Package.php
│   │   │   ├── Interview.php
│   │   │   ├── Evaluation.php
│   │   │   ├── Payment.php
│   │   │   ├── Badge.php
│   │   │   ├── UserBadge.php
│   │   │   ├── PointsLedger.php
│   │   │   └── Review.php
│   │   ├── Services/             # Business logic
│   │   │   ├── AuthService.php
│   │   │   ├── BookingService.php
│   │   │   ├── PaymentService.php
│   │   │   ├── XPService.php
│   │   │   ├── BadgeService.php
│   │   │   ├── LeaderboardService.php
│   │   │   ├── VideoService.php
│   │   │   └── PayoutService.php
│   │   ├── Jobs/                 # Queue jobs
│   │   │   ├── AwardXP.php
│   │   │   ├── CheckBadgeUnlocks.php
│   │   │   ├── ProcessWeeklyPayouts.php
│   │   │   ├── GenerateInvoice.php
│   │   │   └── SendNotification.php
│   │   ├── Events/               # Domain events
│   │   │   ├── SessionCompleted.php
│   │   │   ├── PaymentReceived.php
│   │   │   └── BadgeUnlocked.php
│   │   ├── Listeners/
│   │   ├── Policies/             # Authorization policies
│   │   └── Enums/                # PHP 8.1+ backed enums
│   │       ├── UserRole.php
│   │       ├── InterviewStatus.php
│   │       └── PaymentStatus.php
│   ├── database/
│   │   ├── migrations/           # Ordered schema migrations
│   │   └── seeders/
│   │       ├── DatabaseSeeder.php
│   │       └── ProductionSeeder.php
│   ├── routes/
│   │   └── api.php               # Versioned API routes
│   └── tests/
│       ├── Unit/
│       └── Feature/
│
├── web/                          # React + TypeScript Frontend
│   ├── src/
│   │   ├── app/                  # Next.js App Router
│   │   │   ├── (auth)/           # Login, register, verify
│   │   │   ├── (student)/        # Student dashboard & pages
│   │   │   ├── (trainer)/        # Trainer dashboard & pages
│   │   │   ├── (company)/        # Company portal pages
│   │   │   └── (admin)/          # Admin panel pages
│   │   ├── components/
│   │   │   ├── ui/               # Base design system components
│   │   │   ├── gamification/     # XP bar, badge card, leaderboard
│   │   │   ├── booking/          # Booking flow components
│   │   │   └── video/            # Agora video UI components
│   │   ├── lib/
│   │   │   ├── api/              # API client (axios wrappers)
│   │   │   │   ├── client.ts
│   │   │   │   ├── auth.ts
│   │   │   │   ├── student.ts
│   │   │   │   ├── trainer.ts
│   │   │   │   └── payment.ts
│   │   │   └── auth/             # NextAuth.js session handling
│   │   ├── stores/               # Zustand global state
│   │   │   ├── authStore.ts
│   │   │   └── notificationStore.ts
│   │   └── types/                # Shared TypeScript types
│   │       └── index.ts
│   └── tests/
│
├── docker/
│   ├── nginx/
│   │   └── default.conf
│   ├── php/
│   │   └── Dockerfile
│   └── docker-compose.yml
│
├── .github/
│   └── workflows/
│       ├── test.yml
│       └── deploy.yml
│
└── docs/                         # This documentation lives here
    └── DOCUMENTATION.md
```

---

## 5. Environment Setup

### Prerequisites

- Docker Desktop (or Docker Engine + Compose)
- Node.js 20+
- PHP 8.3+ (for local development without Docker)
- Composer 2.x

### Clone & Start

```bash
git clone https://github.com/your-org/nexthire.git
cd nexthire

# Copy environment files
cp api/.env.example api/.env
cp web/.env.example web/.env.local

# Start all services
docker compose -f docker/docker-compose.yml up -d

# Install API dependencies
docker exec nexthire-app composer install
docker exec nexthire-app php artisan key:generate
docker exec nexthire-app php artisan migrate --seed

# Install Frontend dependencies
cd web && npm install && npm run dev
```

### Required Environment Variables

#### `api/.env`

```env
# Application
APP_NAME=NextHire
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=nexthire
DB_USERNAME=nexthire
DB_PASSWORD=secret

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=null

# JWT
JWT_SECRET=
JWT_ACCESS_TTL=15      # minutes
JWT_REFRESH_TTL=10080  # 7 days in minutes

# Queue
QUEUE_CONNECTION=redis
HORIZON_PREFIX=nexthire

# Storage (AWS S3)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=ap-southeast-1
AWS_BUCKET=nexthire-uploads

# Email
MAIL_MAILER=ses
AWS_SES_KEY=
AWS_SES_SECRET=
MAIL_FROM_ADDRESS=noreply@mnexthire.com

# SMS
TWILIO_SID=
TWILIO_TOKEN=
TWILIO_FROM=

# Payments
SSLCOMMERZ_STORE_ID=
SSLCOMMERZ_STORE_PASSWORD=
SSLCOMMERZ_IS_SANDBOX=true
BKASH_APP_KEY=
BKASH_APP_SECRET=
BKASH_USERNAME=
BKASH_PASSWORD=
STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=

# Video
AGORA_APP_ID=
AGORA_APP_CERTIFICATE=

# Search
MEILISEARCH_HOST=http://meilisearch:7700
MEILISEARCH_KEY=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Monitoring
SENTRY_LARAVEL_DSN=
```

#### `web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_AGORA_APP_ID=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

### Docker Services

```yaml
# docker/docker-compose.yml
version: '3.9'
services:
  app:
    build:
      context: ../api
      dockerfile: ../docker/php/Dockerfile
    container_name: nexthire-app
    volumes:
      - ../api:/var/www/html
    depends_on:
      - db
      - redis

  nginx:
    image: nginx:1.25-alpine
    container_name: nexthire-nginx
    ports:
      - "8000:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      - ../api:/var/www/html

  db:
    image: mysql:8.0
    container_name: nexthire-db
    environment:
      MYSQL_DATABASE: nexthire
      MYSQL_USER: nexthire
      MYSQL_PASSWORD: secret
      MYSQL_ROOT_PASSWORD: rootsecret
    volumes:
      - db_data:/var/lib/mysql
    ports:
      - "3306:3306"

  redis:
    image: redis:7-alpine
    container_name: nexthire-redis
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  horizon:
    build:
      context: ../api
      dockerfile: ../docker/php/Dockerfile
    container_name: nexthire-horizon
    command: php artisan horizon
    depends_on:
      - db
      - redis

  scheduler:
    build:
      context: ../api
      dockerfile: ../docker/php/Dockerfile
    container_name: nexthire-scheduler
    command: php artisan schedule:work
    depends_on:
      - db
      - redis

  meilisearch:
    image: getmeili/meilisearch:v1.6
    container_name: nexthire-search
    ports:
      - "7700:7700"
    volumes:
      - search_data:/meili_data

volumes:
  db_data:
  redis_data:
  search_data:
```

---

## 6. Database Design

### Migration Order

Migrations must run in this exact order to satisfy foreign key constraints:

```
1.  users
2.  students
3.  trainers
4.  companies
5.  packages
6.  trainer_availability
7.  interviews
8.  evaluations
9.  badges
10. user_badges
11. points_ledger
12. rankings
13. payments
14. invoices
15. reviews
16. hiring_campaigns
17. campaign_candidates
18. chats
19. notifications
```

### Table Schemas

#### `users`

```sql
CREATE TABLE users (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid        CHAR(36)      NOT NULL UNIQUE,
    email       VARCHAR(255)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    phone       VARCHAR(20)   NULL,
    role        ENUM('student','trainer','company','admin') NOT NULL,
    status      ENUM('active','suspended','pending') NOT NULL DEFAULT 'pending',
    email_verified_at TIMESTAMP NULL,
    google_id   VARCHAR(100)  NULL,
    profile_photo VARCHAR(500) NULL,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_role (role),
    INDEX idx_users_status (status)
);
```

#### `students`

```sql
CREATE TABLE students (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT UNSIGNED NOT NULL UNIQUE,
    full_name           VARCHAR(200)  NOT NULL,
    university          VARCHAR(300)  NULL,
    department          VARCHAR(200)  NULL,
    graduation_year     SMALLINT      NULL,
    skills              JSON          NOT NULL DEFAULT ('[]'),
    preferred_job_role  VARCHAR(200)  NULL,
    linkedin_url        VARCHAR(500)  NULL,
    github_url          VARCHAR(500)  NULL,
    resume_path         VARCHAR(500)  NULL,
    profile_completion  TINYINT UNSIGNED NOT NULL DEFAULT 0,
    total_xp            INT UNSIGNED  NOT NULL DEFAULT 0,
    current_level       TINYINT UNSIGNED NOT NULL DEFAULT 1,
    streak_days         SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    last_active_at      TIMESTAMP     NULL,
    country_code        CHAR(2)       NOT NULL DEFAULT 'BD',
    created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_students_total_xp (total_xp DESC),
    INDEX idx_students_country (country_code)
);
```

#### `trainers`

```sql
CREATE TABLE trainers (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT UNSIGNED NOT NULL UNIQUE,
    full_name           VARCHAR(200)  NOT NULL,
    bio                 TEXT          NULL,
    expertise_domains   JSON          NOT NULL DEFAULT ('[]'),
    years_experience    SMALLINT      NULL,
    certifications      JSON          NOT NULL DEFAULT ('[]'),
    company_experience  JSON          NOT NULL DEFAULT ('[]'),
    hourly_rate         DECIMAL(10,2) NULL,
    average_rating      DECIMAL(3,2)  NOT NULL DEFAULT 0.00,
    total_reviews       INT UNSIGNED  NOT NULL DEFAULT 0,
    total_sessions      INT UNSIGNED  NOT NULL DEFAULT 0,
    is_approved         BOOLEAN       NOT NULL DEFAULT FALSE,
    approved_at         TIMESTAMP     NULL,
    payout_info         JSON          NULL,
    country_code        CHAR(2)       NOT NULL DEFAULT 'BD',
    created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_trainers_is_approved (is_approved),
    INDEX idx_trainers_rating (average_rating DESC)
);
```

#### `companies`

```sql
CREATE TABLE companies (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT UNSIGNED NOT NULL UNIQUE,
    company_name        VARCHAR(300)  NOT NULL,
    company_website     VARCHAR(500)  NULL,
    industry            VARCHAR(200)  NULL,
    company_size        ENUM('1-10','11-50','51-200','201-500','500+') NULL,
    registration_number VARCHAR(200)  NULL,
    kyc_document_path   VARCHAR(500)  NULL,
    kyc_status          ENUM('pending','verified','rejected') NOT NULL DEFAULT 'pending',
    is_verified         BOOLEAN       NOT NULL DEFAULT FALSE,
    verified_at         TIMESTAMP     NULL,
    hr_contact_name     VARCHAR(200)  NULL,
    hr_contact_email    VARCHAR(255)  NULL,
    logo_path           VARCHAR(500)  NULL,
    country_code        CHAR(2)       NOT NULL DEFAULT 'BD',
    created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_companies_kyc_status (kyc_status),
    INDEX idx_companies_is_verified (is_verified)
);
```

#### `packages`

```sql
CREATE TABLE packages (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    trainer_id          BIGINT UNSIGNED NOT NULL,
    title               VARCHAR(300)  NOT NULL,
    description         TEXT          NULL,
    price               DECIMAL(10,2) NOT NULL,
    session_count       TINYINT UNSIGNED NOT NULL DEFAULT 1,
    duration_minutes    SMALLINT UNSIGNED NOT NULL DEFAULT 60,
    interview_type      VARCHAR(100)  NOT NULL,
    domain              VARCHAR(100)  NOT NULL,
    difficulty          ENUM('beginner','intermediate','advanced') NOT NULL,
    language            VARCHAR(50)   NOT NULL DEFAULT 'English',
    is_live             BOOLEAN       NOT NULL DEFAULT TRUE,
    includes_cv_review  BOOLEAN       NOT NULL DEFAULT FALSE,
    is_active           BOOLEAN       NOT NULL DEFAULT TRUE,
    total_bookings      INT UNSIGNED  NOT NULL DEFAULT 0,
    created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
    INDEX idx_packages_domain (domain),
    INDEX idx_packages_active (is_active),
    INDEX idx_packages_trainer (trainer_id)
);
```

#### `trainer_availability`

```sql
CREATE TABLE trainer_availability (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    trainer_id  BIGINT UNSIGNED NOT NULL,
    date        DATE          NOT NULL,
    start_time  TIME          NOT NULL,
    end_time    TIME          NOT NULL,
    is_booked   BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
    UNIQUE KEY uq_trainer_slot (trainer_id, date, start_time),
    INDEX idx_availability_date (trainer_id, date, is_booked)
);
```

#### `interviews`

```sql
CREATE TABLE interviews (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id          BIGINT UNSIGNED NOT NULL,
    trainer_id          BIGINT UNSIGNED NOT NULL,
    package_id          BIGINT UNSIGNED NOT NULL,
    availability_id     BIGINT UNSIGNED NULL,
    scheduled_at        TIMESTAMP     NOT NULL,
    duration_minutes    SMALLINT UNSIGNED NOT NULL,
    status              ENUM('scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'scheduled',
    meeting_link        VARCHAR(500)  NULL,
    meeting_id          VARCHAR(200)  NULL,
    agora_channel       VARCHAR(200)  NULL,
    completed_at        TIMESTAMP     NULL,
    cancelled_at        TIMESTAMP     NULL,
    cancelled_reason    TEXT          NULL,
    xp_awarded          INT UNSIGNED  NOT NULL DEFAULT 0,
    created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id)  REFERENCES students(id),
    FOREIGN KEY (trainer_id)  REFERENCES trainers(id),
    FOREIGN KEY (package_id)  REFERENCES packages(id),
    INDEX idx_interviews_student   (student_id),
    INDEX idx_interviews_trainer   (trainer_id),
    INDEX idx_interviews_scheduled (scheduled_at),
    INDEX idx_interviews_status    (status)
);
```

#### `evaluations`

```sql
CREATE TABLE evaluations (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    interview_id            BIGINT UNSIGNED NOT NULL UNIQUE,
    trainer_id              BIGINT UNSIGNED NOT NULL,
    student_id              BIGINT UNSIGNED NOT NULL,
    communication_score     TINYINT UNSIGNED NOT NULL CHECK (communication_score BETWEEN 1 AND 10),
    technical_score         TINYINT UNSIGNED NOT NULL CHECK (technical_score BETWEEN 1 AND 10),
    confidence_score        TINYINT UNSIGNED NOT NULL CHECK (confidence_score BETWEEN 1 AND 10),
    problem_solving_score   TINYINT UNSIGNED NOT NULL CHECK (problem_solving_score BETWEEN 1 AND 10),
    english_score           TINYINT UNSIGNED NOT NULL CHECK (english_score BETWEEN 1 AND 10),
    hr_readiness_score      TINYINT UNSIGNED NOT NULL CHECK (hr_readiness_score BETWEEN 1 AND 10),
    overall_level           ENUM('not_ready','beginner','intermediate','advanced','industry_ready') NOT NULL,
    feedback_text           TEXT          NULL,
    created_at              TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interview_id) REFERENCES interviews(id),
    FOREIGN KEY (trainer_id)   REFERENCES trainers(id),
    FOREIGN KEY (student_id)   REFERENCES students(id)
);
```

#### `badges` and `user_badges`

```sql
CREATE TABLE badges (
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug             VARCHAR(100)  NOT NULL UNIQUE,
    name             VARCHAR(200)  NOT NULL,
    description      TEXT          NULL,
    icon_path        VARCHAR(500)  NULL,
    xp_reward        INT UNSIGNED  NOT NULL DEFAULT 25,
    unlock_condition JSON          NOT NULL,
    category         ENUM('achievement','skill','milestone','special') NOT NULL,
    created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_badges (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id  BIGINT UNSIGNED NOT NULL,
    badge_id    BIGINT UNSIGNED NOT NULL,
    unlocked_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id)   REFERENCES badges(id),
    UNIQUE KEY uq_student_badge (student_id, badge_id)
);
```

#### `points_ledger`

```sql
CREATE TABLE points_ledger (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id   BIGINT UNSIGNED NOT NULL,
    xp_amount    INT             NOT NULL,
    event_type   VARCHAR(100)   NOT NULL,
    reference_id BIGINT UNSIGNED NULL,
    description  VARCHAR(300)   NULL,
    created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_ledger_student (student_id),
    INDEX idx_ledger_created (created_at)
);
```

#### `payments`

```sql
CREATE TABLE payments (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payer_id        BIGINT UNSIGNED NOT NULL,
    payee_id        BIGINT UNSIGNED NULL,
    interview_id    BIGINT UNSIGNED NULL,
    amount          DECIMAL(12,2) NOT NULL,
    commission      DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    trainer_amount  DECIMAL(12,2) GENERATED ALWAYS AS (amount - commission) VIRTUAL,
    currency        CHAR(3)       NOT NULL DEFAULT 'BDT',
    gateway         ENUM('sslcommerz','bkash','nagad','stripe','paypal') NOT NULL,
    gateway_txn_id  VARCHAR(200)  NULL UNIQUE,
    status          ENUM('pending','completed','failed','refunded','payout_pending','paid') NOT NULL DEFAULT 'pending',
    invoice_path    VARCHAR(500)  NULL,
    payout_processed_at TIMESTAMP NULL,
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (payer_id)     REFERENCES users(id),
    FOREIGN KEY (payee_id)     REFERENCES users(id),
    FOREIGN KEY (interview_id) REFERENCES interviews(id),
    INDEX idx_payments_status  (status),
    INDEX idx_payments_gateway (gateway_txn_id)
);
```

#### `reviews`

```sql
CREATE TABLE reviews (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id  BIGINT UNSIGNED NOT NULL,
    trainer_id  BIGINT UNSIGNED NOT NULL,
    interview_id BIGINT UNSIGNED NOT NULL UNIQUE,
    rating      TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT          NULL,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id)   REFERENCES students(id),
    FOREIGN KEY (trainer_id)   REFERENCES trainers(id),
    FOREIGN KEY (interview_id) REFERENCES interviews(id),
    INDEX idx_reviews_trainer (trainer_id)
);
```

#### `hiring_campaigns`

```sql
CREATE TABLE hiring_campaigns (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id      BIGINT UNSIGNED NOT NULL,
    title           VARCHAR(300)  NOT NULL,
    job_role        VARCHAR(200)  NOT NULL,
    description     TEXT          NULL,
    requirements    JSON          NULL,
    domain          VARCHAR(100)  NULL,
    status          ENUM('draft','active','archived') NOT NULL DEFAULT 'draft',
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE campaign_candidates (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    campaign_id     BIGINT UNSIGNED NOT NULL,
    student_id      BIGINT UNSIGNED NOT NULL,
    stage           ENUM('invited','interviewed','shortlisted','hired','rejected') NOT NULL DEFAULT 'invited',
    notes           TEXT          NULL,
    invited_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES hiring_campaigns(id),
    FOREIGN KEY (student_id)  REFERENCES students(id),
    UNIQUE KEY uq_campaign_student (campaign_id, student_id)
);
```

#### `notifications`

```sql
CREATE TABLE notifications (
    id          CHAR(36)      PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    type        VARCHAR(100)  NOT NULL,
    title       VARCHAR(300)  NOT NULL,
    body        TEXT          NULL,
    data        JSON          NULL,
    read_at     TIMESTAMP     NULL,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_user_unread (user_id, read_at)
);
```

### Redis Cache Keys

| Key Pattern | TTL | Content |
|-------------|-----|---------|
| `leaderboard:global` | 1 hour | Sorted set: `student_id → XP` (global) |
| `leaderboard:country:{code}` | 1 hour | Sorted set: `student_id → XP` per country |
| `leaderboard:category:{slug}` | 1 hour | Sorted set: `student_id → XP` per domain |
| `user:session:{token}` | 15 min | JWT access token payload |
| `otp:{phone}` | 5 min | Phone OTP value |
| `trainer:packages:{id}` | 30 min | Cached trainer packages JSON |
| `student:profile:{id}` | 15 min | Student profile data |
| `xp:levels` | 24 hours | Level threshold definitions |

---

## 7. Backend — Laravel 12 API

### PHP Enums

```php
// app/Enums/UserRole.php
enum UserRole: string {
    case Student = 'student';
    case Trainer = 'trainer';
    case Company = 'company';
    case Admin   = 'admin';
}

// app/Enums/InterviewStatus.php
enum InterviewStatus: string {
    case Scheduled   = 'scheduled';
    case InProgress  = 'in_progress';
    case Completed   = 'completed';
    case Cancelled   = 'cancelled';
}

// app/Enums/PaymentStatus.php
enum PaymentStatus: string {
    case Pending        = 'pending';
    case Completed      = 'completed';
    case Failed         = 'failed';
    case Refunded       = 'refunded';
    case PayoutPending  = 'payout_pending';
    case Paid           = 'paid';
}
```

### Route Structure

```php
// routes/api.php
Route::prefix('v1')->group(function () {

    // Public
    Route::prefix('auth')->group(function () {
        Route::post('register',         [AuthController::class, 'register']);
        Route::post('login',            [AuthController::class, 'login']);
        Route::post('verify-email',     [AuthController::class, 'verifyEmail']);
        Route::post('forgot-password',  [AuthController::class, 'forgotPassword']);
        Route::post('reset-password',   [AuthController::class, 'resetPassword']);
        Route::post('google',           [AuthController::class, 'googleLogin']);
        Route::post('refresh',          [AuthController::class, 'refresh']);
    });

    Route::get('trainers',                  [TrainerController::class, 'index']);
    Route::get('trainers/{id}',             [TrainerController::class, 'show']);
    Route::get('trainers/{id}/availability',[TrainerController::class, 'availability']);
    Route::get('leaderboard/global',        [LeaderboardController::class, 'global']);
    Route::get('leaderboard/country/{code}',[LeaderboardController::class, 'byCountry']);
    Route::get('badges',                    [BadgeController::class, 'index']);
    Route::get('xp/levels',                 [XPController::class, 'levels']);
    Route::get('students/{id}/public',      [StudentController::class, 'publicProfile']);

    // Payment webhooks (signed, not JWT)
    Route::post('payments/sslcommerz/callback', [PaymentController::class, 'sslcommerzCallback']);
    Route::post('payments/bkash/callback',      [PaymentController::class, 'bkashCallback']);
    Route::post('payments/stripe/webhook',      [PaymentController::class, 'stripeWebhook']);

    // Authenticated
    Route::middleware(['auth:api', 'email.verified'])->group(function () {

        Route::post('auth/logout',     [AuthController::class, 'logout']);
        Route::post('auth/phone-otp',  [AuthController::class, 'sendOTP']);
        Route::post('auth/verify-otp', [AuthController::class, 'verifyOTP']);

        // Student routes
        Route::middleware('role:student')->prefix('students')->group(function () {
            Route::get('me',                StudentController::class . '@me');
            Route::put('me',                StudentController::class . '@update');
            Route::post('me/resume',        StudentController::class . '@uploadResume');
            Route::get('me/dashboard',      StudentController::class . '@dashboard');
            Route::get('me/sessions',       StudentController::class . '@sessions');
            Route::get('me/evaluations',    StudentController::class . '@evaluations');
            Route::get('me/badges',         StudentController::class . '@badges');
            Route::get('me/xp-history',     StudentController::class . '@xpHistory');
        });

        // Trainer routes
        Route::middleware('role:trainer')->prefix('trainers/me')->group(function () {
            Route::get('/',                 [TrainerController::class, 'me']);
            Route::put('/',                 [TrainerController::class, 'update']);
            Route::get('dashboard',         [TrainerController::class, 'dashboard']);
            Route::get('earnings',          [TrainerController::class, 'earnings']);
            Route::apiResource('packages',  PackageController::class);
            Route::get('sessions',          [TrainerController::class, 'sessions']);
            Route::post('availability',     [TrainerController::class, 'setAvailability']);
            Route::post('evaluations/{interview_id}', [EvaluationController::class, 'store']);
        });

        // Shared booking & interview
        Route::post('bookings',                 [BookingController::class, 'store']);
        Route::get('bookings/{id}',             [BookingController::class, 'show']);
        Route::post('bookings/{id}/cancel',     [BookingController::class, 'cancel']);
        Route::get('interviews/{id}',           [InterviewController::class, 'show']);
        Route::post('interviews/{id}/join',     [InterviewController::class, 'join']);
        Route::post('interviews/{id}/complete', [InterviewController::class, 'complete'])
            ->middleware('role:trainer');

        // Payments
        Route::post('payments/initiate',        [PaymentController::class, 'initiate']);
        Route::get('payments/history',          [PaymentController::class, 'history']);
        Route::get('payments/{id}/invoice',     [PaymentController::class, 'invoice']);

        // Gamification
        Route::get('leaderboard/me/rank',       [LeaderboardController::class, 'myRank']);
        Route::get('badges/me',                 [BadgeController::class, 'myBadges']);

        // Company routes
        Route::middleware('role:company')->prefix('companies/me')->group(function () {
            Route::get('dashboard',             [CompanyController::class, 'dashboard']);
            Route::apiResource('campaigns',     CampaignController::class);
            Route::post('campaigns/{id}/invite',[CampaignController::class, 'invite']);
            Route::get('candidates',            [CompanyController::class, 'candidates']);
            Route::put('candidates/{id}/status',[CompanyController::class, 'updateCandidateStatus']);
            Route::get('inbox',                 [InboxController::class, 'index']);
            Route::post('inbox',                [InboxController::class, 'send']);
        });

        // Admin routes
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::get('dashboard',                     [AdminController::class, 'dashboard']);
            Route::get('users',                         [AdminController::class, 'users']);
            Route::put('users/{id}/status',             [AdminController::class, 'updateUserStatus']);
            Route::get('trainers/pending',              [AdminController::class, 'pendingTrainers']);
            Route::post('trainers/{id}/approve',        [AdminController::class, 'approveTrainer']);
            Route::get('companies/pending',             [AdminController::class, 'pendingCompanies']);
            Route::post('companies/{id}/verify',        [AdminController::class, 'verifyCompany']);
            Route::get('reports/revenue',               [AdminController::class, 'revenueReport']);
            Route::post('badges',                       [AdminController::class, 'createBadge']);
            Route::post('notifications/broadcast',      [AdminController::class, 'broadcast']);
            Route::get('payouts/pending',               [AdminController::class, 'pendingPayouts']);
            Route::post('payouts/{id}/process',         [AdminController::class, 'processPayout']);
        });
    });
});
```

### API Response Format

All responses follow a consistent envelope:

```json
// Success
{
  "success": true,
  "data": { },
  "meta": {
    "per_page": 20,
    "next_cursor": "abc123"
  }
}

// Error
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

### Rate Limiting

```php
// app/Http/Middleware/ThrottleRequests (configured in RouteServiceProvider)
// Authenticated: 60 requests/minute
// Unauthenticated: 10 requests/minute
// Auth endpoints: 5 attempts/minute (login, register)
```

### Key Service Classes

#### `XPService.php`

```php
class XPService
{
    const XP_EVENTS = [
        'first_interview'       => 200,
        'complete_interview'    => 100,
        'industry_ready_eval'   => 300,
        'daily_login'           => 10,
        'streak_7_days'         => 50,
        'streak_30_days'        => 200,
        'badge_unlocked'        => 25,
        'profile_complete'      => 150,
        'five_star_review'      => 75,  // trainers only
    ];

    public function award(Student $student, string $event, int $referenceId = null): void
    {
        $xp = self::XP_EVENTS[$event] ?? 0;
        if ($xp === 0) return;

        DB::transaction(function () use ($student, $event, $xp, $referenceId) {
            // Record in ledger
            PointsLedger::create([
                'student_id'   => $student->id,
                'xp_amount'    => $xp,
                'event_type'   => $event,
                'reference_id' => $referenceId,
            ]);

            // Update student total and level
            $student->increment('total_xp', $xp);
            $student->refresh();
            $student->update(['current_level' => $this->calculateLevel($student->total_xp)]);

            // Update Redis leaderboard
            Redis::zincrby("leaderboard:global", $xp, $student->id);
            Redis::zincrby("leaderboard:country:{$student->country_code}", $xp, $student->id);
        });

        // Dispatch badge check job
        CheckBadgeUnlocks::dispatch($student);
    }

    public function calculateLevel(int $totalXP): int
    {
        $thresholds = [0, 200, 500, 1000, 2000, 3500, 5500, 8000, 11500, 15000];
        $level = 1;
        foreach ($thresholds as $i => $threshold) {
            if ($totalXP >= $threshold) $level = $i + 1;
        }
        return min($level, 10);
    }
}
```

#### `BadgeService.php`

```php
class BadgeService
{
    public function checkUnlocks(Student $student): void
    {
        $earnedSlugs = $student->badges()->pluck('slug')->toArray();
        $allBadges   = Badge::whereNotIn('slug', $earnedSlugs)->get();

        foreach ($allBadges as $badge) {
            if ($this->conditionMet($student, $badge->unlock_condition)) {
                $student->badges()->attach($badge->id, ['unlocked_at' => now()]);

                // Award XP for badge unlock
                app(XPService::class)->award($student, 'badge_unlocked', $badge->id);

                // Notify student
                $student->user->notify(new BadgeUnlockedNotification($badge));

                event(new BadgeUnlocked($student, $badge));
            }
        }
    }

    private function conditionMet(Student $student, array $condition): bool
    {
        return match ($condition['type']) {
            'sessions'         => $student->interviews()->completed()->count() >= $condition['count'],
            'domain_sessions'  => $student->interviews()->completed()->where('domain', $condition['domain'])->count() >= $condition['count'],
            'streak'           => $student->streak_days >= $condition['days'],
            'profile_complete' => $student->profile_completion >= 100,
            'xp_in_days'       => $this->xpInLastDays($student, $condition['xp'], $condition['days']),
            'leaderboard_rank' => $this->getCountryRank($student) <= $condition['rank'],
            'score'            => $this->avgScoreInCategory($student, $condition['category'], $condition['min_score'], $condition['sessions']),
            default            => false,
        };
    }
}
```

#### `PaymentService.php`

```php
class PaymentService
{
    const COMMISSION_RATE = 0.20; // 20%

    public function initiate(Student $student, Package $package, string $gateway, string $slotId): array
    {
        $amount     = $package->price;
        $commission = round($amount * self::COMMISSION_RATE, 2);

        $payment = Payment::create([
            'payer_id'    => $student->user_id,
            'payee_id'    => $package->trainer->user_id,
            'amount'      => $amount,
            'commission'  => $commission,
            'currency'    => 'BDT',
            'gateway'     => $gateway,
            'status'      => PaymentStatus::Pending,
        ]);

        return match($gateway) {
            'sslcommerz' => $this->sslcommerzInit($payment, $student),
            'bkash'      => $this->bkashInit($payment, $student),
            'stripe'     => $this->stripeInit($payment, $student),
            default      => throw new \InvalidArgumentException("Unsupported gateway: {$gateway}"),
        };
    }

    public function handleCallback(string $gateway, array $payload): void
    {
        // Verify webhook signature first
        $this->verifySignature($gateway, $payload);

        $txnId   = $payload['tran_id'] ?? $payload['trxID'] ?? $payload['id'];
        $payment = Payment::where('gateway_txn_id', $txnId)->firstOrFail();

        if ($this->isSuccess($gateway, $payload)) {
            $payment->update(['status' => PaymentStatus::Completed]);

            // Confirm booking
            $payment->interview->update(['status' => InterviewStatus::Scheduled]);

            // Generate invoice asynchronously
            GenerateInvoice::dispatch($payment);

            // Notify student and trainer
            SendNotification::dispatch($payment->interview, 'booking_confirmed');
        } else {
            $payment->update(['status' => PaymentStatus::Failed]);
        }
    }
}
```

---

## 8. Frontend — React + TypeScript

### TypeScript Types

```typescript
// src/types/index.ts

export type UserRole = 'student' | 'trainer' | 'company' | 'admin';

export interface User {
  id: number;
  uuid: string;
  email: string;
  role: UserRole;
  profile_photo: string | null;
  status: 'active' | 'suspended' | 'pending';
}

export interface Student {
  id: number;
  user: User;
  full_name: string;
  university: string | null;
  department: string | null;
  skills: string[];
  preferred_job_role: string | null;
  resume_path: string | null;
  profile_completion: number;
  total_xp: number;
  current_level: number;
  streak_days: number;
  country_code: string;
}

export interface Trainer {
  id: number;
  user: User;
  full_name: string;
  bio: string | null;
  expertise_domains: string[];
  years_experience: number | null;
  average_rating: number;
  total_reviews: number;
  total_sessions: number;
  is_approved: boolean;
  packages: Package[];
}

export interface Package {
  id: number;
  trainer_id: number;
  trainer?: Trainer;
  title: string;
  description: string | null;
  price: number;
  session_count: number;
  duration_minutes: number;
  interview_type: string;
  domain: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  is_live: boolean;
  includes_cv_review: boolean;
  is_active: boolean;
}

export interface Interview {
  id: number;
  student: Student;
  trainer: Trainer;
  package: Package;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  meeting_link: string | null;
  agora_channel: string | null;
  xp_awarded: number;
}

export interface Evaluation {
  id: number;
  interview_id: number;
  communication_score: number;
  technical_score: number;
  confidence_score: number;
  problem_solving_score: number;
  english_score: number;
  hr_readiness_score: number;
  overall_level: 'not_ready' | 'beginner' | 'intermediate' | 'advanced' | 'industry_ready';
  feedback_text: string | null;
}

export interface Badge {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon_path: string | null;
  xp_reward: number;
  category: 'achievement' | 'skill' | 'milestone' | 'special';
  unlocked_at?: string;
}

export interface LeaderboardEntry {
  rank: number;
  student_id: number;
  name: string;
  avatar: string | null;
  xp: number;
  level: number;
  badges_count: number;
  country: string;
}

export interface Payment {
  id: number;
  amount: number;
  commission: number;
  currency: string;
  gateway: string;
  status: string;
  invoice_path: string | null;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    per_page: number;
    next_cursor: string | null;
    total?: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface XPLevel {
  level: number;
  name: string;
  xp_required: number;
}
```

### API Client

```typescript
// src/lib/api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT on every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refresh_token: refreshToken }
        );
        localStorage.setItem('access_token', data.data.access_token);
        original.headers.Authorization = `Bearer ${data.data.access_token}`;
        return apiClient(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

```typescript
// src/lib/api/auth.ts
import apiClient from './client';
import { ApiResponse, User } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  password_confirmation: string;
  role: 'student' | 'trainer' | 'company';
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/register', payload),

  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/login', payload),

  logout: () =>
    apiClient.post('/auth/logout'),

  refresh: (refresh_token: string) =>
    apiClient.post<ApiResponse<AuthTokens>>('/auth/refresh', { refresh_token }),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string, password_confirmation: string) =>
    apiClient.post('/auth/reset-password', { token, password, password_confirmation }),
};
```

### Zustand Auth Store

```typescript
// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { authApi } from '@/lib/api/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (access: string, refresh: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const { data } = await authApi.login({ email, password });
        set({
          user: data.data.user,
          accessToken: data.data.tokens.access_token,
          refreshToken: data.data.tokens.refresh_token,
          isAuthenticated: true,
        });
      },

      logout: async () => {
        try { await authApi.logout(); } catch {}
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh }),
    }),
    { name: 'nexthire-auth', partialize: (s) => ({ accessToken: s.accessToken, refreshToken: s.refreshToken, user: s.user }) }
  )
);
```

### Design System Tokens

```typescript
// src/lib/design-tokens.ts
export const colors = {
  primary:  { 600: '#1A56DB', 50: '#EFF6FF' },
  success:  { 500: '#0E9F6E' },
  purple:   { 600: '#7E3AF2' },
  gray:     { 900: '#111928', 500: '#6B7280' },
  red:      { 600: '#E02424' },
  yellow:   { 400: '#E3A008' },
} as const;

export const XP_LEVELS = [
  { level: 1,  name: 'Newcomer',       xp_required: 0 },
  { level: 2,  name: 'Explorer',       xp_required: 200 },
  { level: 3,  name: 'Learner',        xp_required: 500 },
  { level: 4,  name: 'Challenger',     xp_required: 1000 },
  { level: 5,  name: 'Achiever',       xp_required: 2000 },
  { level: 6,  name: 'Professional',   xp_required: 3500 },
  { level: 7,  name: 'Expert',         xp_required: 5500 },
  { level: 8,  name: 'Elite',          xp_required: 8000 },
  { level: 9,  name: 'Master',         xp_required: 11500 },
  { level: 10, name: 'Industry Ready', xp_required: 15000 },
];
```

---

## 9. Authentication System

### JWT Configuration (Laravel)

```php
// config/jwt.php (tymon/jwt-auth)
return [
    'ttl'           => env('JWT_ACCESS_TTL', 15),   // minutes
    'refresh_ttl'   => env('JWT_REFRESH_TTL', 10080), // 7 days
    'algo'          => 'HS256',
    'blacklist_enabled' => true,
];
```

### Registration Flow

```
POST /auth/register
  → Validate (email unique, role valid, password ≥ 8 chars)
  → Hash password (bcrypt, cost 12)
  → Create user (status = pending)
  → Create role-specific profile (student/trainer/company)
  → Send email verification link
  → Return 201 with user object
```

### Login Flow

```
POST /auth/login
  → Validate credentials
  → Check email_verified_at not null
  → Check status = active
  → Generate access token (15 min) + refresh token (7 days)
  → Record last_active_at
  → Return tokens + user object
```

### Token Refresh Flow

```
POST /auth/refresh
  → Validate refresh token (not expired, not blacklisted)
  → Issue new access token
  → Optionally rotate refresh token
  → Return new tokens
```

### Google OAuth Flow

```
POST /auth/google  { code: "..." }
  → Exchange code for Google profile
  → Find or create user by google_id / email
  → If new: auto-verify email, set status = active
  → Issue JWT tokens
  → Return tokens + user
```

---

## 10. Role-Based Access Control

### Middleware

```php
// app/Http/Middleware/RoleMiddleware.php
class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = auth('api')->user();

        if (!$user || !in_array($user->role, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden: insufficient permissions',
            ], 403);
        }

        return $next($request);
    }
}
```

### Route Guards (React)

```typescript
// src/components/auth/RoleGuard.tsx
'use client';
import { useAuthStore } from '@/stores/authStore';
import { redirect } from 'next/navigation';
import { UserRole } from '@/types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) redirect('/login');
  if (!user || !allowedRoles.includes(user.role)) redirect('/unauthorized');

  return <>{children}</>;
}
```

---

## 11. Modules & Business Logic

### Booking Flow (Step by Step)

```
1. Student calls POST /bookings
   Body: { package_id, availability_id }

2. BookingService:
   a. Lock availability slot (DB transaction + SELECT FOR UPDATE)
   b. Check slot is_booked = false → throw 409 if taken
   c. Create interview record (status = pending_payment)
   d. Mark availability slot as is_booked = true
   e. Return interview_id

3. Student calls POST /payments/initiate
   Body: { interview_id, gateway: 'sslcommerz' }

4. PaymentService:
   a. Create payment record (status = pending)
   b. Call gateway SDK to get payment URL
   c. Return { payment_url, payment_id }

5. Student redirected to gateway → completes payment

6. Gateway calls POST /payments/{gateway}/callback (signed webhook)

7. PaymentService.handleCallback():
   a. Verify webhook signature
   b. Update payment status = completed
   c. Update interview status = scheduled
   d. Generate meeting link (Agora channel name)
   e. Dispatch GenerateInvoice job
   f. Dispatch SendNotification job (student + trainer)
```

### Session Completion Flow

```
1. Trainer calls POST /interviews/{id}/complete

2. InterviewController:
   a. Verify caller is the interview's trainer
   b. Verify interview status = in_progress
   c. Update status = completed, completed_at = now()

3. SessionCompleted event fired → triggers:
   a. AwardXP job (student gets +100 XP, or +200 if first interview)
   b. CheckBadgeUnlocks job
   c. Update trainer.total_sessions
   d. Update payment status = payout_pending
   e. SendNotification (session complete, evaluation reminder)

4. Trainer calls POST /trainers/me/evaluations/{interview_id}

5. EvaluationController:
   a. Save evaluation scores
   b. Calculate if overall_level = 'industry_ready'
      → If yes: award student +300 XP
   c. Notify student (evaluation ready)
```

### Weekly Payout Flow

```
Scheduled: Every Monday 02:00 UTC (Laravel Scheduler)

PayoutService.processWeeklyPayouts():
  1. Find all payments WHERE status = payout_pending
     AND completed_at <= 7 days ago (settlement delay)
  2. Group by payee_id (trainer)
  3. For each trainer:
     a. Sum trainer_amount (amount - commission)
     b. Check payout_info not null
     c. Call bank/mobile wallet API
     d. Update payment.status = paid, payout_processed_at = now()
     e. Notify trainer (payout sent)
  4. Log all payouts in payout_log table
```

### Leaderboard Update

```
On every XP award:
  Redis::zincrby("leaderboard:global", $xp, $student_id)
  Redis::zincrby("leaderboard:country:{code}", $xp, $student_id)

Leaderboard read (GET /leaderboard/global):
  $entries = Redis::zrevrange("leaderboard:global", 0, 99, 'WITHSCORES')
  Hydrate student names/avatars from MySQL (cached per student)

Rank lookup (GET /leaderboard/me/rank):
  $globalRank  = Redis::zrevrank("leaderboard:global", $student_id) + 1
  $countryRank = Redis::zrevrank("leaderboard:country:{code}", $student_id) + 1
```

---

## 12. Gamification Engine

### XP Events Reference

| Event | XP | Trigger | Notes |
|-------|----|---------|-------|
| `complete_interview` | +100 | Session completed | Per session |
| `first_interview` | +200 | Session completed | One-time bonus (in addition to +100) |
| `industry_ready_eval` | +300 | Evaluation submitted | Top evaluation bonus |
| `daily_login` | +10 | User login | Once per calendar day |
| `streak_7_days` | +50 | Login 7 consecutive days | Milestone |
| `streak_30_days` | +200 | Login 30 consecutive days | Major milestone |
| `badge_unlocked` | +25 | Any badge unlocked | Per badge |
| `profile_complete` | +150 | Profile reaches 100% | One-time bonus |
| `five_star_review` | +75 | Trainer receives 5-star | Trainer gamification |

### Level System

| Level | Name | XP Required |
|-------|------|-------------|
| 1 | Newcomer | 0 |
| 2 | Explorer | 200 |
| 3 | Learner | 500 |
| 4 | Challenger | 1,000 |
| 5 | Achiever | 2,000 |
| 6 | Professional | 3,500 |
| 7 | Expert | 5,500 |
| 8 | Elite | 8,000 |
| 9 | Master | 11,500 |
| 10 | Industry Ready | 15,000+ |

### Badge Library

| Badge | Slug | Unlock Condition |
|-------|------|-----------------|
| First Interview | `first_interview` | Complete 1st session |
| HR Master | `hr_master` | Complete 5 HR interview sessions |
| Coding Expert | `coding_expert` | Score 9+ in technical on 3 sessions |
| 10 Interviews | `ten_interviews` | Complete 10 total sessions |
| Company Ready | `company_ready` | Receive Industry Ready evaluation |
| Top 100 Bangladesh | `top_100_bd` | Rank in country top 100 |
| Global Top Performer | `global_top` | Rank in global top 500 |
| 7-Day Streak | `streak_7` | Login 7 consecutive days |
| Profile Champion | `profile_100` | Complete profile 100% |
| Rising Star | `rising_star` | Gain 1000 XP in 7 days |
| Speed Learner | `speed_learner` | Book 3 sessions in first week |
| Reviewer | `reviewer` | Submit 5 trainer reviews |
| DevOps Specialist | `devops_spec` | Complete 3 DevOps domain sessions |
| Cybersecurity Pro | `cyber_pro` | Complete 3 Cybersecurity domain sessions |
| Communication Ace | `comm_ace` | Score 9+ on communication in 5 sessions |

### Leaderboard Types

Three leaderboard scopes are maintained in Redis:

1. `leaderboard:global` — all students worldwide
2. `leaderboard:country:{BD|IN|PK}` — per country
3. `leaderboard:category:{domain_slug}` — per interview domain (phase 2)

All are Redis sorted sets, refreshed incrementally on every XP award, TTL 1 hour.

---

## 13. Payment System

### Supported Gateways

| Gateway | Currency | Region | Type |
|---------|----------|--------|------|
| SSLCommerz | BDT | Bangladesh | Card + Mobile Banking |
| bKash | BDT | Bangladesh | Mobile Wallet |
| Nagad | BDT | Bangladesh | Mobile Wallet |
| Stripe | USD | International | Card |
| PayPal | USD | International | Wallet |

### Webhook Security

Each gateway webhook must be signature-verified before processing:

```php
// SSLCommerz: Hash validation
private function verifySSLCommerz(array $payload): bool
{
    $hash = md5(
        $payload['amount'] . $payload['currency'] .
        $payload['tran_id'] . env('SSLCOMMERZ_STORE_PASSWORD')
    );
    return $hash === $payload['verify_sign'];
}

// Stripe: Signature verification
private function verifyStripe(Request $request): bool
{
    $sig = $request->header('Stripe-Signature');
    Stripe\Webhook::constructEvent(
        $request->getContent(),
        $sig,
        env('STRIPE_WEBHOOK_SECRET')
    );
    return true; // throws if invalid
}
```

### Commission Calculation

```
Amount paid by student:    1000 BDT
Platform commission (20%):  200 BDT
Trainer receives:           800 BDT
```

### Payment Status State Machine

```
pending
  ↓ (gateway success callback)
completed
  ↓ (session completed, settlement delay passes)
payout_pending
  ↓ (weekly payout job runs)
paid

pending → failed      (gateway failure callback)
completed → refunded  (cancel within 24h)
```

---

## 14. Video Session System

### Agora Integration

```php
// app/Services/VideoService.php
class VideoService
{
    public function generateToken(string $channelName, int $uid): string
    {
        return RtcTokenBuilder::buildTokenWithUid(
            config('agora.app_id'),
            config('agora.app_certificate'),
            $channelName,
            $uid,
            RtcTokenBuilder::RoleAttendee,
            time() + 7200  // 2 hours
        );
    }

    public function createChannel(Interview $interview): string
    {
        $channel = 'interview_' . $interview->id . '_' . Str::random(8);
        $interview->update(['agora_channel' => $channel]);
        return $channel;
    }
}
```

```typescript
// src/lib/agora/useVideoSession.ts
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { useState, useEffect, useRef } from 'react';

export function useVideoSession(channelName: string, token: string) {
  const clientRef  = useRef<IAgoraRTCClient | null>(null);
  const [joined, setJoined]   = useState(false);
  const [users, setUsers]     = useState<any[]>([]);
  const [localTracks, setLocalTracks] = useState<any>(null);

  useEffect(() => {
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;

    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      setUsers(prev => [...prev.filter(u => u.uid !== user.uid), user]);
    });

    client.on('user-unpublished', (user) => {
      setUsers(prev => prev.filter(u => u.uid !== user.uid));
    });

    return () => { client.leave(); };
  }, []);

  const join = async () => {
    const client = clientRef.current!;
    const uid    = await client.join(process.env.NEXT_PUBLIC_AGORA_APP_ID!, channelName, token);
    const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
    await client.publish([audioTrack, videoTrack]);
    setLocalTracks({ audioTrack, videoTrack });
    setJoined(true);
  };

  const leave = async () => {
    localTracks?.audioTrack?.close();
    localTracks?.videoTrack?.close();
    await clientRef.current?.leave();
    setJoined(false);
  };

  return { joined, users, localTracks, join, leave };
}
```

### Session Flow (API Calls)

```
1. GET  /interviews/{id}          → Get interview details + channel name
2. POST /interviews/{id}/join     → Mark joined, receive Agora token
3. [Video session runs]
4. POST /interviews/{id}/complete → (Trainer only) End session
5. POST /trainers/me/evaluations/{id} → Submit scorecard
```

---

## 15. API Reference

### Base URL
`https://api.mnexthire.com/v1`

### Authentication
All protected routes require: `Authorization: Bearer {access_token}`

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | None | Register new user |
| POST | `/auth/login` | None | Login, get JWT tokens |
| POST | `/auth/logout` | Bearer | Invalidate token |
| POST | `/auth/refresh` | Refresh Token | Get new access token |
| POST | `/auth/verify-email` | None | Verify email with link token |
| POST | `/auth/forgot-password` | None | Send reset email |
| POST | `/auth/reset-password` | None | Reset with token |
| POST | `/auth/google` | None | Google OAuth |
| POST | `/auth/phone-otp` | Bearer | Send OTP to phone |
| POST | `/auth/verify-otp` | Bearer | Verify OTP |

### Student Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/students/me` | Student | Own profile |
| PUT | `/students/me` | Student | Update profile |
| POST | `/students/me/resume` | Student | Upload resume PDF (max 5MB) |
| GET | `/students/me/dashboard` | Student | Dashboard summary |
| GET | `/students/me/sessions` | Student | Session list (paginated) |
| GET | `/students/me/evaluations` | Student | Received evaluations |
| GET | `/students/me/badges` | Student | Earned badges |
| GET | `/students/me/xp-history` | Student | XP ledger |
| GET | `/students/{id}/public` | None | Public profile |

### Trainer Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/trainers` | None | List trainers (filterable) |
| GET | `/trainers/{id}` | None | Trainer public profile |
| PUT | `/trainers/me` | Trainer | Update own profile |
| GET | `/trainers/me/dashboard` | Trainer | Dashboard |
| GET | `/trainers/me/earnings` | Trainer | Earnings breakdown |
| POST | `/trainers/me/packages` | Trainer | Create package |
| PUT | `/trainers/me/packages/{id}` | Trainer | Update package |
| DELETE | `/trainers/me/packages/{id}` | Trainer | Deactivate package |
| GET | `/trainers/me/packages` | Trainer | Own packages |
| GET | `/trainers/me/sessions` | Trainer | Sessions |
| POST | `/trainers/me/availability` | Trainer | Set calendar slots |
| GET | `/trainers/{id}/availability` | Student | Open slots |
| POST | `/trainers/me/evaluations/{id}` | Trainer | Submit evaluation |

### Booking & Interview Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/bookings` | Student | Create booking |
| GET | `/bookings/{id}` | Student/Trainer | Booking details |
| POST | `/bookings/{id}/cancel` | Student | Cancel (refund policy applies) |
| GET | `/interviews/{id}` | Student/Trainer | Interview + meeting link |
| POST | `/interviews/{id}/join` | Student/Trainer | Get Agora token |
| POST | `/interviews/{id}/complete` | Trainer | Mark completed |

### Payment Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments/initiate` | Student | Start payment, get gateway URL |
| POST | `/payments/sslcommerz/callback` | Signed webhook | SSLCommerz IPN |
| POST | `/payments/bkash/callback` | Signed webhook | bKash callback |
| POST | `/payments/stripe/webhook` | Signed webhook | Stripe webhook |
| GET | `/payments/history` | Student/Trainer | Payment history |
| GET | `/payments/{id}/invoice` | Student | Invoice PDF |
| GET | `/admin/payouts/pending` | Admin | Pending payouts |
| POST | `/admin/payouts/{id}/process` | Admin | Process payout |

### Gamification Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/leaderboard/global` | None | Top 100 global |
| GET | `/leaderboard/country/{code}` | None | Top 100 by country |
| GET | `/leaderboard/me/rank` | Student | Own rank |
| GET | `/badges` | None | All badges |
| GET | `/badges/me` | Student | Earned badges |
| GET | `/xp/levels` | None | Level thresholds |

### Company Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/companies/register` | None | Register company |
| GET | `/companies/me/dashboard` | Company | Company dashboard |
| POST | `/companies/me/campaigns` | Company | Create campaign |
| GET | `/companies/me/campaigns` | Company | Own campaigns |
| POST | `/companies/me/campaigns/{id}/invite` | Company | Invite candidate |
| GET | `/companies/me/candidates` | Company | Talent pool search |
| PUT | `/companies/me/candidates/{id}/status` | Company | Pipeline stage update |
| GET | `/companies/me/inbox` | Company | Inbox |
| POST | `/companies/me/inbox` | Company | Send message |

### Admin Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/dashboard` | Admin | Platform stats |
| GET | `/admin/users` | Admin | All users |
| PUT | `/admin/users/{id}/status` | Admin | Activate/suspend |
| GET | `/admin/trainers/pending` | Admin | Pending approvals |
| POST | `/admin/trainers/{id}/approve` | Admin | Approve trainer |
| GET | `/admin/companies/pending` | Admin | Pending KYC |
| POST | `/admin/companies/{id}/verify` | Admin | Verify company |
| GET | `/admin/reports/revenue` | Admin | Revenue report |
| POST | `/admin/badges` | Admin | Create badge |
| POST | `/admin/notifications/broadcast` | Admin | Broadcast notification |

### Sample Requests & Responses

#### `POST /auth/login`

Request:
```json
{
  "email": "student@example.com",
  "password": "SecurePass123"
}
```

Response `200`:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 42,
      "uuid": "a1b2c3d4-...",
      "email": "student@example.com",
      "role": "student"
    },
    "tokens": {
      "access_token": "eyJ...",
      "refresh_token": "dXJ...",
      "expires_in": 900
    }
  }
}
```

#### `POST /bookings`

Request:
```json
{
  "package_id": 15,
  "availability_id": 88
}
```

Response `201`:
```json
{
  "success": true,
  "data": {
    "interview_id": 201,
    "status": "pending_payment",
    "package": { "title": "Software Engineering Mock", "price": 500 },
    "scheduled_at": "2026-06-15T10:00:00Z"
  }
}
```

#### `POST /payments/initiate`

Request:
```json
{
  "interview_id": 201,
  "gateway": "sslcommerz"
}
```

Response `200`:
```json
{
  "success": true,
  "data": {
    "payment_id": 99,
    "payment_url": "https://sandbox.sslcommerz.com/gwprocess/...",
    "amount": 500,
    "currency": "BDT"
  }
}
```

#### `POST /trainers/me/evaluations/{interview_id}`

Request:
```json
{
  "communication_score": 8,
  "technical_score": 9,
  "confidence_score": 7,
  "problem_solving_score": 8,
  "english_score": 7,
  "hr_readiness_score": 8,
  "overall_level": "advanced",
  "feedback_text": "Strong technical skills. Work on confidence during behavioral questions."
}
```

Response `201`:
```json
{
  "success": true,
  "data": {
    "evaluation_id": 55,
    "xp_awarded": 100,
    "interview_status": "completed"
  }
}
```

#### `GET /leaderboard/global`

Response `200`:
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "student_id": 101,
      "name": "Rahim Ahmed",
      "avatar": "https://cdn.mnexthire.com/avatars/101.jpg",
      "xp": 4820,
      "level": 8,
      "badges_count": 12,
      "country": "BD"
    }
  ],
  "meta": {
    "total": 9420,
    "per_page": 50,
    "next_cursor": "abc123"
  }
}
```

---

## 16. Testing

### Strategy Overview

| Layer | Tool | Coverage Target |
|-------|------|----------------|
| Laravel Unit Tests | PHPUnit / Pest | ≥ 80% line coverage on Services |
| Laravel Feature Tests | PHPUnit / Pest | 100% of API endpoint scenarios |
| Frontend Component Tests | Vitest + React Testing Library | ≥ 70% component coverage |
| E2E Tests | Cypress | All critical user journeys |
| Mobile Tests | Flutter Test | ≥ 70% widget test coverage |
| Load Tests | k6 | 500 VU, 5 min sustained |

### Running Tests

```bash
# Backend unit + feature tests
docker exec nexthire-app php artisan test --parallel

# Specific test file
docker exec nexthire-app php artisan test tests/Feature/Auth/LoginTest.php

# Frontend unit tests
cd web && npm run test

# E2E tests (Cypress)
cd web && npm run cypress:open

# Load tests
k6 run tests/load/leaderboard.js
```

### Authentication Test Cases

| TC-ID | Test Case | Expected | Priority |
|-------|-----------|----------|----------|
| TC-AUTH-001 | Register valid student email | 201, email sent | Critical |
| TC-AUTH-002 | Register duplicate email | 422 error | Critical |
| TC-AUTH-003 | Login correct credentials | 200, tokens returned | Critical |
| TC-AUTH-004 | Login wrong password | 401 | Critical |
| TC-AUTH-005 | Access protected route, no token | 401 | Critical |
| TC-AUTH-006 | Student token on trainer route | 403 | High |
| TC-AUTH-007 | Refresh before expiry | 200, new access token | High |
| TC-AUTH-008 | Expired refresh token | 401 | High |
| TC-AUTH-009 | Forgot password registered email | 200, reset email | Medium |
| TC-AUTH-010 | Reset with expired token | 422 | Medium |

### Booking Test Cases

| TC-ID | Test Case | Expected | Priority |
|-------|-----------|----------|----------|
| TC-BOOK-001 | Book available slot | 201, payment URL | Critical |
| TC-BOOK-002 | Book taken slot | 409 Conflict | Critical |
| TC-BOOK-003 | SSLCommerz sandbox success | status → scheduled | Critical |
| TC-BOOK-004 | Payment failure callback | status → failed | Critical |
| TC-BOOK-005 | Cancel within 24h | 200, refund initiated | High |
| TC-BOOK-006 | Cancel after 24h | 422 | Medium |
| TC-BOOK-007 | XP awarded on completion | student XP +100 | High |
| TC-BOOK-008 | Badge check on session complete | badge unlocked if met | High |

### Gamification Test Cases

| TC-ID | Test Case | Expected | Priority |
|-------|-----------|----------|----------|
| TC-GAME-001 | XP for daily login | +10 XP in ledger | High |
| TC-GAME-002 | 7-day streak bonus | +50 XP on day 7 | High |
| TC-GAME-003 | Leaderboard updates within 60s | Redis sorted set updated | High |
| TC-GAME-004 | First interview badge | Badge in profile | Critical |
| TC-GAME-005 | Badge not awarded prematurely | Badge absent | High |
| TC-GAME-006 | Level up on threshold | current_level++ | High |

### Load Test Scenarios (k6)

| Scenario | VUs | Duration | Pass Threshold |
|----------|-----|----------|----------------|
| GET /leaderboard/global | 200 | 5 min | p95 < 300ms, errors < 1% |
| POST /auth/login | 100 | 3 min | p95 < 200ms, errors < 0.5% |
| GET /trainers (search) | 300 | 5 min | p95 < 500ms, errors < 1% |
| POST /bookings | 50 | 2 min | p95 < 800ms, errors < 0.5% |
| Video session join | 100 | 10 min | latency < 150ms |

### Security Test Checklist

- [ ] SQL Injection: All params tested with payloads via SQLMap
- [ ] XSS: All inputs sanitized, CSP headers validated
- [ ] IDOR: Cross-user access attempts on all resource endpoints
- [ ] Auth bypass: JWT algorithm confusion, expired token reuse
- [ ] Rate limiting: Burst >60 req/min returns 429
- [ ] File upload: Malicious types blocked (PDF/image only)
- [ ] Payment webhooks: Replay attack tested
- [ ] Privilege escalation: Student → admin endpoint attempts

---

## 17. Deployment & DevOps

### Environment Strategy

| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| Development | `feature/*` | localhost | Local development |
| Staging | `develop` | staging.mnexthire.com | Integration QA |
| UAT | `release/*` | uat.mnexthire.com | User acceptance testing |
| Production | `main` | mnexthire.com / api.mnexthire.com | Live |

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: ['**']
  pull_request:
    branches: [develop, main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: nexthire_test
        ports: ['3306:3306']
      redis:
        image: redis:7-alpine
        ports: ['6379:6379']

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP 8.3
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          extensions: pdo_mysql, redis, bcmath

      - name: Install Composer deps
        working-directory: api
        run: composer install --no-interaction

      - name: Run PHP CS Fixer
        working-directory: api
        run: vendor/bin/php-cs-fixer fix --dry-run --diff

      - name: Run PHPUnit
        working-directory: api
        run: php artisan test --parallel
        env:
          DB_CONNECTION: mysql
          DB_HOST: 127.0.0.1
          DB_DATABASE: nexthire_test

      - name: Setup Node 20
        uses: actions/setup-node@v4
        with: { node-version: '20' }

      - name: Install & Test Frontend
        working-directory: web
        run: |
          npm ci
          npm run lint
          npm run test:ci

  deploy-staging:
    needs: lint-and-test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build & Push Docker Image
        run: |
          docker build -t $ECR_REGISTRY/nexthire-api:$GITHUB_SHA ./api
          docker push $ECR_REGISTRY/nexthire-api:$GITHUB_SHA
      - name: Deploy to Staging
        run: |
          ssh deploy@staging.mnexthire.com "
            docker pull $ECR_REGISTRY/nexthire-api:$GITHUB_SHA &&
            docker compose -f /opt/nexthire/docker-compose.yml up -d --no-deps app &&
            docker exec nexthire-app php artisan migrate --force
          "
```

### Infrastructure (MVP)

| Component | Service | MVP Spec | Scale Spec |
|-----------|---------|----------|------------|
| Web/API Server | AWS EC2 / DO Droplet | 4 vCPU, 8GB RAM | Auto-scaling group |
| Database | AWS RDS MySQL / DO Managed DB | db.t3.medium | db.r6g.large + read replica |
| Cache | AWS ElastiCache Redis | 1 node, 1GB | Cluster mode, 3 nodes |
| File Storage | AWS S3 / DO Spaces | Standard | Standard + CDN |
| CDN | CloudFront / Cloudflare | — | Edge caching |
| Containers | Docker Compose | Single host | Kubernetes |
| Email | Amazon SES | — | Dedicated IP |
| Video | Agora.io | Pay-per-minute | Reserved |

### Server Hardening

```bash
# UFW firewall
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow from TRUSTED_IP to any port 22
ufw enable

# Fail2Ban
apt install fail2ban
systemctl enable fail2ban

# SSL (Let's Encrypt)
certbot --nginx -d mnexthire.com -d api.mnexthire.com
```

Nginx security headers:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'nonce-...'" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### Database Backup

```bash
# Daily automated backup (cron)
0 2 * * * mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASS nexthire | gzip | \
  aws s3 cp - s3://nexthire-backups/mysql/$(date +%Y-%m-%d).sql.gz

# Redis backup
0 3 * * * redis-cli BGSAVE && \
  aws s3 cp /var/lib/redis/dump.rdb s3://nexthire-backups/redis/$(date +%Y-%m-%d).rdb
```

Recovery objectives:
- **RTO:** < 4 hours
- **RPO:** < 24 hours
- Quarterly disaster recovery drills to staging

### Launch Checklist

| Category | Task | Owner |
|----------|------|-------|
| DNS | Point mnexthire.com A record to production | DevOps |
| SSL | Install Let's Encrypt + auto-renewal | DevOps |
| Payments | SSLCommerz production merchant ID | Backend |
| Payments | bKash production credentials | Backend |
| Email | SES verified domain for mnexthire.com | DevOps |
| Video | Agora production App ID + certificate | Backend |
| Storage | S3 bucket CORS + read policy | DevOps |
| Security | OWASP ZAP scan — no critical findings | Security |
| Performance | k6 load test passed at 500 VU | QA |
| Smoke Test | All 6 critical user flows manual walkthrough | QA |
| Monitoring | Sentry + UptimeRobot alerts verified | DevOps |
| Backup | Manual backup + restore tested | DevOps |
| Legal | Privacy Policy + Terms of Service published | Product |
| Go Live | Flip DNS, monitor 30 min, team on standby | All |

---

## 18. Monitoring & Alerting

| Metric | Tool | Alert Threshold |
|--------|------|----------------|
| API error rate | Sentry | > 1% of requests in 5 min |
| Response time p95 | CloudWatch / DO | > 1s for 5 min |
| CPU usage | CloudWatch | > 80% for 10 min |
| Memory usage | CloudWatch | > 85% for 5 min |
| DB connections | RDS Metrics | > 80% of max_connections |
| Queue backlog | Laravel Horizon | > 500 pending jobs |
| Disk usage | CloudWatch | > 75% |
| Uptime | UptimeRobot | Any 5xx or timeout |
| Failed payment rate | Custom metric | > 5% in 1 hour |

### Key Dashboards

- **Laravel Telescope** — local/staging: query profiling, failed jobs, slow requests
- **Sentry** — error tracking with release tracking and breadcrumbs
- **Laravel Horizon** — queue throughput, failed jobs, supervisor status
- **UptimeRobot** — public endpoint uptime with alert escalation

---

## 19. Security Checklist

### API Security

- [ ] All endpoints use HTTPS only
- [ ] JWT tokens signed with HS256, secret rotated quarterly
- [ ] bcrypt password hashing, cost factor = 12
- [ ] Rate limiting applied: 60 req/min (auth), 5 req/min (login/register)
- [ ] Role middleware on every protected route
- [ ] Input validation via Laravel Form Requests on all endpoints
- [ ] SQL injection prevention via Eloquent ORM (no raw queries)
- [ ] Mass assignment protection via `$fillable` on all models
- [ ] File uploads: mime-type validated, stored outside web root

### Payment Security

- [ ] Webhook signatures verified before processing (all gateways)
- [ ] Payment amounts re-calculated server-side (never trust client amount)
- [ ] Idempotency keys stored (replay attack prevention)
- [ ] No card data stored on platform (PCI DSS — gateways handle cards)

### Infrastructure Security

- [ ] Secrets in AWS Secrets Manager / environment variables (never git)
- [ ] Database: no public network access, firewall rules enforced
- [ ] SSH: key-based only, root login disabled
- [ ] Fail2Ban: brute-force protection on SSH and Nginx
- [ ] PHP: `expose_php = Off`, dangerous functions disabled
- [ ] OWASP Top 10 reviewed and addressed before each production release

---

## 20. Workflows & Business Rules

### Student Full Flow

```
Register → Email Verify → Complete Profile → Upload Resume
→ Search Trainer (filter: domain, price, rating, language)
→ View Trainer Profile → Select Package
→ Choose Available Time Slot → Payment
→ Booking Confirmed (email + in-app notification)
→ Join Video Session at Scheduled Time
→ Session Completed by Trainer
→ Receive Evaluation + XP + Badge Check
→ Rate & Review Trainer
→ View Updated Leaderboard Rank
```

### Trainer Full Flow

```
Register → Email Verify → Complete Professional Profile
→ Submit for Admin Review → Admin Approval (24-48h)
→ Create Interview Packages → Set Calendar Availability → Go Live
→ Receive Booking Notification
→ Join Video Session → Conduct Interview
→ Mark Session Completed → Submit Evaluation Scorecard
→ Earning Added (amount - 20% commission)
→ Weekly Payout to Bank / Mobile Wallet
```

### Company Full Flow

```
Register → Submit KYC Documents → Admin KYC Review
→ Admin Verifies → Verified Company Badge Awarded
→ Access HR Dashboard → Create Hiring Campaign
→ Search Talent Pool (filter: skill, domain, score, location)
→ Invite Candidates → Schedule Interviews
→ Conduct Sessions → Score Candidates
→ Move Pipeline (Invited → Interviewed → Shortlisted → Hired)
→ View Hiring Analytics
```

### Admin Full Flow

```
Login → Platform Dashboard (stats, revenue, activity)
→ Review Pending Trainer Applications → Approve / Reject
→ Review Company KYC → Verify / Reject
→ Manage Users (activate / suspend)
→ Process Trainer Payouts
→ View Revenue Reports
→ Manage Badges & Gamification
→ Moderate Content / Reviews
→ Send Broadcast Notifications
```

### Domain Categories

| Domain | Sub-domains |
|--------|-------------|
| Software Engineering | Frontend, Backend, Full-Stack, Mobile, System Design |
| Cybersecurity | Ethical Hacking, SOC Analyst, Network Security, Cloud Security |
| DevOps / Cloud | AWS, GCP, Azure, Kubernetes, CI/CD, Infrastructure |
| Data & AI | Data Science, ML, Data Engineering, Analytics |
| HR / Behavioral | General HR, Competency-Based, Leadership, Communication |
| Business / Finance | Product Management, Business Analyst, Banking, Accounting |
| Design | UI/UX, Graphic Design, Product Design |
| Government / Viva | BCS, Bank Viva, University Viva, Job Exam Prep |

### Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| API Response Time | p95 < 200ms under normal load |
| Video Latency | < 150ms via Agora |
| Uptime | 99.5% monthly SLA |
| Concurrent Users | 500 (MVP) → 5,000 (Phase 2) |
| Page Load | < 3s on 4G mobile connection |
| Accessibility | WCAG 2.1 Level AA |
| Languages | English + Bangla (i18n) |
| Backup Retention | 30 days (DB), 90 days (files) |

---

## Appendix A — Glossary

| Term | Definition |
|------|-----------|
| MVP | Minimum Viable Product — first shippable version |
| XP | Experience Points — gamification currency |
| JWT | JSON Web Token — stateless auth standard |
| SSLCommerz | Bangladesh's leading online payment gateway |
| bKash | Leading mobile financial service in Bangladesh |
| Agora.io | Real-time audio/video SDK |
| IDOR | Insecure Direct Object Reference (OWASP Top 10) |
| BDT | Bangladeshi Taka |
| B2B | Business-to-Business features |
| KYC | Know Your Customer — identity verification |
| VU | Virtual Users — load test concurrency unit |
| AOF | Redis Append-Only File persistence mode |
| RTO | Recovery Time Objective — max acceptable downtime |
| RPO | Recovery Point Objective — max acceptable data loss |
| Horizon | Laravel's Redis queue dashboard |

---

## Appendix B — Development Phase Timeline

| Phase | Duration | Deliverables |
|-------|----------|-------------|
| 0: Setup | Week 1 | Monorepo, Docker, CI/CD, DB migrations |
| 1: Auth & Users | Weeks 2–3 | Registration, JWT, email verify, Google OAuth, role middleware |
| 2: Student & Trainer Core | Weeks 4–6 | Profiles, packages CRUD, trainer search, availability |
| 3: Booking & Payment | Weeks 7–8 | Booking flow, SSLCommerz, bKash, invoice generation |
| 4: Video & Sessions | Week 9 | Agora integration, join flow, completion |
| 5: Gamification | Week 10 | XP engine, badges, Redis leaderboard |
| 6: Company Module | Week 11 | Company portal, campaigns, talent pool, pipeline |
| 7: Admin Panel | Week 12 | User management, approvals, revenue dashboard |
| 8: Mobile App | Weeks 13–16 | Flutter: auth, home, booking, profile, video |
| 9: Polish & Launch | Weeks 17–18 | Performance tuning, security audit, production deploy |

---

*NextHire v1.0.0 — Documentation generated 2026-06-05*  
*Prepared by: Boni Yeamin | mnexthire.com*
