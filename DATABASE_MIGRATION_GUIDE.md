# Database Migration Guide - NextHire API

**Date:** June 5, 2026  
**Database:** MySQL  
**Total Tables:** 20  
**Total Migrations:** 20  

---

## 📊 Database Configuration

```
Driver:     MySQL
Host:       127.0.0.1
Port:       3306
Database:   nexthire3
Username:   root
Password:   (empty)
```

**Location:** `/home/boni/Desktop/nexthire/api/.env`

---

## 🗄️ Tables to be Created (20 Total)

### Core Tables

1. **users** - User accounts (admin, student, trainer, company)
   - Columns: id, uuid, email, password, role, status, phone, google_id, profile_photo
   - Indexes: role, status

2. **students** - Student profiles
   - Columns: id, user_id, full_name, university, department, skills, XP, level
   - Foreign Key: user_id → users.id (cascade delete)
   - Indexes: total_xp, country_code

3. **trainers** - Trainer profiles
   - Columns: id, user_id, full_name, bio, expertise_domains, years_experience, rating
   - Foreign Key: user_id → users.id (cascade delete)
   - Indexes: is_approved, average_rating

4. **companies** - Company profiles
   - Columns: id, user_id, company_name, industry, company_size, kyc_status
   - Foreign Key: user_id → users.id (cascade delete)
   - Indexes: kyc_status

### Feature Tables

5. **packages** - Trainer packages (mock interview courses)
   - Columns: id, trainer_id, title, price, duration_minutes, domain, difficulty
   - Foreign Key: trainer_id → trainers.id

6. **interviews** - Interview sessions
   - Columns: id, student_id, trainer_id, package_id, scheduled_at, status, meeting_link
   - Foreign Keys: student_id, trainer_id, package_id
   - Indexes: status, scheduled_at

7. **evaluations** - Session evaluations
   - Columns: id, interview_id, communication_score, technical_score, feedback_text
   - Foreign Key: interview_id → interviews.id
   - Indexes: interview_id

8. **trainer_availability** - Available time slots for trainers
   - Columns: id, trainer_id, date, start_time, end_time, is_booked
   - Foreign Key: trainer_id → trainers.id
   - Indexes: date, is_booked

### Payment Tables

9. **payments** - Payment transactions
   - Columns: id, interview_id, amount, gateway, status, transaction_id
   - Foreign Key: interview_id → interviews.id
   - Indexes: status, gateway

10. **invoices** - Payment invoices
    - Columns: id, payment_id, invoice_number, amount, issued_at
    - Foreign Key: payment_id → payments.id

### Gamification Tables

11. **badges** - Badge definitions
    - Columns: id, slug, name, description, xp_reward, category, unlock_condition
    - Unique: slug

12. **user_badges** - Earned badges
    - Columns: id, user_id, badge_id, unlocked_at
    - Foreign Keys: user_id, badge_id
    - Indexes: user_id

13. **points_ledger** - XP transaction log
    - Columns: id, user_id, xp_amount, event_type, reference_id, created_at
    - Foreign Key: user_id → users.id
    - Indexes: user_id, event_type

14. **rankings** - Leaderboard rankings
    - Columns: id, user_id, global_rank, country_rank, updated_at
    - Foreign Key: user_id → users.id
    - Unique: user_id

### Company Hiring Tables

15. **hiring_campaigns** - Job posting campaigns
    - Columns: id, company_id, title, job_role, description, domain, status
    - Foreign Key: company_id → companies.id
    - Indexes: status

16. **campaign_candidates** - Candidates for campaigns
    - Columns: id, campaign_id, student_id, stage, notes, created_at
    - Foreign Keys: campaign_id, student_id
    - Indexes: campaign_id, stage

### Communication Tables

17. **chats** - Messages between users
    - Columns: id, sender_id, recipient_id, message, is_read, created_at
    - Foreign Keys: sender_id, recipient_id
    - Indexes: recipient_id, is_read

18. **notifications** - User notifications
    - Columns: id, user_id, type, title, body, data, read_at, created_at
    - Foreign Key: user_id → users.id
    - Indexes: user_id, read_at

19. **reviews** - Trainer reviews/ratings
    - Columns: id, trainer_id, student_id, rating, comment, created_at
    - Foreign Keys: trainer_id, student_id
    - Indexes: trainer_id

### Token Table

20. **refresh_tokens** - JWT refresh tokens
    - Columns: id, user_id, token, expires_at, created_at
    - Foreign Key: user_id → users.id
    - Indexes: user_id, expires_at

---

## 🚀 Migration Steps

### Step 1: Check MySQL is Running

```bash
# Verify MySQL is accessible
mysql -u root -e "SELECT VERSION();"

# Or check service status
systemctl status mysql

# If not running, start it
sudo systemctl start mysql
```

### Step 2: Create Database (if not exists)

```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS nexthire3;"
mysql -u root -e "SHOW DATABASES LIKE 'nexthire3';"
```

### Step 3: Run Migrations

#### Option A: Fresh Migration (Recommended - Wipes and rebuilds)

```bash
cd /home/boni/Desktop/nexthire/api
php artisan migrate:fresh --force
```

**What it does:**
- Drops all existing tables (if any)
- Runs all 20 migrations
- Creates fresh database schema
- Takes ~5-10 seconds

**Expected Output:**
```
Dropped all tables successfully.
Migration: 2026_06_05_000001_create_users_table
Migration: 2026_06_05_000002_create_students_table
Migration: 2026_06_05_000003_create_trainers_table
...
Migration: 2026_06_05_000020_create_refresh_tokens_table
Batch 1
Database seeding completed successfully.
```

#### Option B: Standard Migration (Incremental - keeps existing data)

```bash
cd /home/boni/Desktop/nexthire/api
php artisan migrate
```

**What it does:**
- Runs only new/pending migrations
- Preserves existing data
- Good for production deployments
- Only runs if migrations haven't run before

#### Option C: Fresh Migration with Test Data

```bash
cd /home/boni/Desktop/nexthire/api
php artisan migrate:fresh --force
php artisan db:seed
```

**What it does:**
- Fresh database
- Creates all 20 tables
- Seeds 12 test accounts (1 admin, 5 students, 3 trainers, 3 companies)
- Ready for immediate testing

---

## ✅ Verify Migrations

### Check if Migrations Ran

```bash
cd /home/boni/Desktop/nexthire/api

# Check migration status
php artisan migrate:status

# Expected output: all migrations should show "Ran" with date/time
```

### Verify Tables in MySQL

```bash
mysql -u root nexthire3 -e "SHOW TABLES;"

# Expected output:
# badges
# campaign_candidates
# chats
# companies
# evaluations
# hiring_campaigns
# invoices
# interviews
# notifications
# packages
# payments
# points_ledger
# rankings
# refresh_tokens
# reviews
# students
# trainer_availability
# trainers
# user_badges
# users
```

### Check Table Structure

```bash
# Check users table structure
mysql -u root nexthire3 -e "DESCRIBE users;"

# Check students table structure
mysql -u root nexthire3 -e "DESCRIBE students;"

# Count records
mysql -u root nexthire3 -e "SELECT COUNT(*) as user_count FROM users;"
```

---

## 🔄 Migration Workflow

### For Development

1. **Initial Setup**
   ```bash
   php artisan migrate:fresh --force
   php artisan db:seed
   ```

2. **Create New Migration (if needed)**
   ```bash
   php artisan make:migration add_new_column_to_users_table
   ```

3. **Run Migration**
   ```bash
   php artisan migrate
   ```

4. **Rollback (if needed)**
   ```bash
   php artisan migrate:rollback
   ```

### For Production

1. **Back up database**
   ```bash
   mysqldump -u root nexthire3 > backup.sql
   ```

2. **Run pending migrations only**
   ```bash
   php artisan migrate
   ```

3. **Never use migrate:fresh in production** (loses data!)

---

## 🐛 Troubleshooting

### Issue: "Access denied for user 'root'@'localhost'"

**Solution:**
```bash
# Check MySQL is running
sudo systemctl start mysql

# Check .env has correct credentials
cat .env | grep DB_

# Test connection
mysql -u root -e "SELECT 1;"
```

### Issue: "Unknown database 'nexthire3'"

**Solution:**
```bash
# Create database
mysql -u root -e "CREATE DATABASE nexthire3;"

# Verify
mysql -u root -e "SHOW DATABASES LIKE 'nexthire3';"
```

### Issue: "SQLSTATE[HY000]: General error: 1030 Got error..."

**Solution:**
```bash
# Check MySQL disk space
df -h

# Restart MySQL
sudo systemctl restart mysql

# Re-run migration
php artisan migrate:fresh --force
```

### Issue: "Syntax error or access violation"

**Solution:**
```bash
# Check migration file syntax
php artisan migrate --step=1 --verbose

# Drop all and retry
php artisan migrate:refresh --force
```

---

## 📋 Migration Files Location

All migration files are located in:
```
/home/boni/Desktop/nexthire/api/database/migrations/
```

Files are named with timestamp:
```
2026_06_05_000001_create_users_table.php
2026_06_05_000002_create_students_table.php
2026_06_05_000003_create_trainers_table.php
...
2026_06_05_000020_create_refresh_tokens_table.php
```

---

## 🔑 Key Relationships

```
users
├── students (one-to-one)
├── trainers (one-to-one)
├── companies (one-to-one)
├── interviews (one-to-many as student or trainer)
├── chats (one-to-many as sender or recipient)
├── notifications (one-to-many)
├── reviews (one-to-many as student or trainer)
├── user_badges (one-to-many)
├── points_ledger (one-to-many)
└── refresh_tokens (one-to-many)

trainers
├── packages (one-to-many)
├── interviews (one-to-many)
├── trainer_availability (one-to-many)
└── reviews (one-to-many)

students
├── interviews (one-to-many)
├── campaign_candidates (one-to-many)
└── reviews (one-to-many)

companies
└── hiring_campaigns (one-to-many)

hiring_campaigns
└── campaign_candidates (one-to-many)

interviews
├── evaluations (one-to-one)
└── payments (one-to-one)

badges
└── user_badges (one-to-many)
```

---

## ✨ Migration Features

✅ **Automatic Timestamps**
- created_at and updated_at on all tables
- Automatically maintained by Laravel

✅ **Foreign Keys**
- Cascade delete for dependent records
- Enforces data integrity

✅ **Indexes**
- Performance optimization
- Faster queries on frequently searched fields

✅ **JSON Columns**
- skills (students table)
- expertise_domains (trainers table)
- unlock_condition (badges table)
- data (notifications table)

✅ **Enums**
- role: student, trainer, company, admin
- status: active, suspended, pending

---

## 📊 Database Diagram

```
┌──────────────┐
│    users     │
├──────────────┤
│ id (PK)      │
│ uuid (UNIQUE)│
│ email        │
│ role         │
│ status       │
└──────────────┘
       │
       ├─→ students
       ├─→ trainers
       │    ├─→ packages
       │    ├─→ trainer_availability
       │    └─→ reviews
       ├─→ companies
       │    └─→ hiring_campaigns
       │         └─→ campaign_candidates
       │
       ├─→ interviews
       │    ├─→ evaluations
       │    └─→ payments
       │         └─→ invoices
       │
       ├─→ chats
       ├─→ notifications
       ├─→ refresh_tokens
       ├─→ user_badges
       │    └─→ badges
       └─→ points_ledger
```

---

## 🎯 Quick Commands

```bash
# Navigate to API
cd /home/boni/Desktop/nexthire/api

# Fresh migration + seed
php artisan migrate:fresh --force && php artisan db:seed

# Check status
php artisan migrate:status

# Create new migration
php artisan make:migration create_table_name

# Run pending migrations
php artisan migrate

# Rollback last batch
php artisan migrate:rollback

# Rollback all
php artisan migrate:reset --force

# List all tables
mysql -u root nexthire3 -e "SHOW TABLES;"

# Check table structure
mysql -u root nexthire3 -e "DESCRIBE users;"

# Count records
mysql -u root nexthire3 -e "SELECT COUNT(*) FROM users;"
```

---

## ✅ Verification Checklist

After running migrations:

- [ ] MySQL is running
- [ ] nexthire3 database exists
- [ ] All 20 tables created
- [ ] Foreign keys established
- [ ] Indexes created
- [ ] Migration status shows "Ran" for all
- [ ] Test data seeded (if db:seed ran)
- [ ] No errors in migration output

---

## 📝 Notes

- Migrations run in order by timestamp
- Each migration creates/modifies one aspect
- Rollback removes changes in reverse order
- Never manually modify migrations after running
- Always test migrations on local first
- Backup database before production migrations

---

**Status:** Ready to migrate  
**Date:** June 5, 2026  
**Version:** 1.0
