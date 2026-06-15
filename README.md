# NextHire

NextHire is a comprehensive full-stack Mock Interview & Career Development Platform designed to connect students with expert trainers and hiring companies. The platform features an advanced gamification engine, multi-role access (Student, Trainer, Company, Admin), live video sessions, and integrated payment processing.

## 🚀 Key Features

### 👨‍🎓 For Students
- **Book Sessions:** Browse expert trainers and book 1:1 or group mock interviews.
- **Earn XP & Badges:** Gamified learning experience with levels, leaderboards, and achievements.
- **Get Feedback:** Receive detailed evaluations, confidence scores, and improvement tips.
- **Career Growth:** Track progress and connect with hiring companies.

### 👨‍🏫 For Trainers
- **Package Management:** Create flexible interview packages with custom pricing and requirements.
- **Flexible Availability:** Manage weekly schedules, blocked dates, and specific time slots.
- **Conduct Sessions:** Integrated live video sessions via Agora.io.
- **Earnings & Payouts:** Track session earnings and manage weekly payouts.

### 🏢 For Companies
- **Hiring Campaigns:** Create campaigns to find top talent based on interview performance.
- **Candidate Search:** Search through verified candidates with proven mock interview records.
- **Direct Messaging:** Inbox system to connect with potential hires.

### ⚙️ Core System Capabilities
- **Gamification Engine:** Real-time XP tracking, multi-tier badges, and global/country leaderboards.
- **Payment Processing:** SSLCommerz, bKash, and Stripe integrations for secure payments and refunds.
- **Real-time Video:** High-quality video sessions with screen sharing.
- **Admin Dashboard:** Comprehensive control over users, commission settings, feed algorithms, and platform analytics.

---

## 🛠 Tech Stack

**Frontend:**
- React 19
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (Icons)

**Backend:**
- Laravel 12 (REST API)
- PHP 8.2+
- MySQL / PostgreSQL
- Redis (Caching & Queues)

**External Services:**
- Agora.io (Video sessions)
- AWS S3 (Storage)
- SSLCommerz / bKash (Payments)

---

## 📁 Project Structure

```text
nexthire/
├── api/                  # Laravel 12 Backend API
│   ├── app/              # Controllers, Models, Services
│   ├── database/         # Migrations, Seeders, Factories
│   ├── routes/           # API Endpoints (api.php)
│   └── ...
├── web/                  # Next.js 16 Frontend
│   ├── src/app/          # App Router Pages
│   ├── src/components/   # Reusable UI Components
│   ├── src/lib/          # API Client & Utilities
│   └── ...
└── docs/                 # Platform Documentation & Specifications
```

---

## 💻 Local Development Setup

NextHire uses a local-first development approach. Follow these instructions to run the application locally.

### Prerequisites
- PHP 8.2+ & Composer
- Node.js 20+ & npm
- MySQL / PostgreSQL
- Redis (Optional for local development)

### Backend Setup (Laravel)

1. Navigate to the API directory:
   ```bash
   cd api
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Setup environment variables:
   ```bash
   cp .env.example .env
   # Update DB_DATABASE, DB_USERNAME, DB_PASSWORD in .env
   ```
4. Generate application keys:
   ```bash
   php artisan key:generate
   php artisan jwt:secret
   ```
5. Run migrations and seed test data:
   ```bash
   php artisan migrate:fresh --seed
   php artisan db:seed --class=XPLevelSeeder
   php artisan db:seed --class=XPRuleSeeder
   php artisan db:seed --class=BadgeSeeder
   ```
6. Start the development server:
   ```bash
   php artisan serve --port=8001
   ```

### Frontend Setup (Next.js)

1. Navigate to the Web directory:
   ```bash
   cd web
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`.

---

## 🧪 Test Credentials

After running the database seeders, you can log in using the following test accounts (Password for all: `password123`, except Admin: `admin@123`):

- **Admin:** `admin@nexthire.com`
- **Student:** `student1@nexthire.com`
- **Trainer:** `trainer1@nexthire.com`
- **Company:** `company1@nexthire.com`

---

## 📄 Documentation

For detailed technical specifications, architecture overviews, and module implementations, please refer to the files located in the `docs/` directory.

- `PLATFORM_ANALYSIS.md` - Overall system architecture and business model
- `ENDPOINTS.md` - API documentation
- `STUDENT_MODULE_IMPLEMENTATION.md` - Student features technical spec
- `COMPANY_MODULE_IMPLEMENTATION.md` - Company features technical spec
