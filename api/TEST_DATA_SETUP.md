# Test Data Setup Guide

This guide explains how to seed the database with test data for development and testing.

## Overview

The test data seeder creates sample accounts for all user roles:
- **1 Admin Account**
- **5 Student Accounts**
- **3 Trainer Accounts**
- **3 Company Accounts**

All test accounts use the password `password123` (except admin which uses `admin@123`).

## Prerequisites

1. Ensure your environment is set up:
   ```bash
   cd api
   composer install
   ```

2. Configure your `.env` file with database credentials:
   ```bash
   cp .env.example .env
   ```

3. Ensure database is running (adjust these based on your setup):
   ```bash
   # If using Docker
   docker-compose up -d
   
   # If using local MySQL/PostgreSQL
   # Ensure your database service is running
   ```

## Running the Seeders

### Option 1: Fresh Migration + Seeding (Recommended for development)
This will drop all existing tables and recreate them with test data:

```bash
cd api
php artisan migrate:fresh --seed
```

### Option 2: Seed Only (Add test data to existing schema)
If migrations have already been run:

```bash
cd api
php artisan db:seed
```

### Option 3: Seed without Model Events
If you want to bypass any model observers/events:

```bash
cd api
php artisan db:seed --class=DatabaseSeeder
```

## Test Account Credentials

### Admin Account
- **Email:** `admin@nexthire.com`
- **Password:** `admin@123`
- **Phone:** `+8801700000001`

### Student Accounts
| Email | Password |
|-------|----------|
| `student1@nexthire.com` | `password123` |
| `student2@nexthire.com` | `password123` |
| `student3@nexthire.com` | `password123` |
| `student4@nexthire.com` | `password123` |
| `student5@nexthire.com` | `password123` |

**Student Details:**
- Full names with Bangladesh names
- Universities (BUET, DU, IUB, BRAC, NSU, ULAB)
- Departments (Computer Science, Software Engineering, IT, etc.)
- Skills (React, Python, Node.js, Java, Go, Vue.js, etc.)
- Preferred job roles (Frontend, Backend, Full Stack, Data Engineer, etc.)
- Experience points, levels, and streak data
- LinkedIn and GitHub profile URLs

### Trainer Accounts
| Email | Password |
|-------|----------|
| `trainer1@nexthire.com` | `password123` |
| `trainer2@nexthire.com` | `password123` |
| `trainer3@nexthire.com` | `password123` |

**Trainer Details:**
- Professional titles (Dr., Prof., Eng.)
- Expertise domains (Web Dev, Python, Mobile, Cloud, Data Science, DevOps)
- Years of experience (2-15 years)
- Certifications (AWS, Kubernetes, Google Cloud, etc.)
- Hourly rates ($30-$100)
- Ratings and session history
- Payout information
- Approval status (80% are approved)

### Company Accounts
| Email | Password |
|-------|----------|
| `company1@nexthire.com` | `password123` |
| `company2@nexthire.com` | `password123` |
| `company3@nexthire.com` | `password123` |

**Company Details:**
- Company names and websites
- Industries (IT, Software, Finance, E-Commerce, Healthcare Tech, EdTech)
- Company sizes (1-10, 11-50, 51-200, 201-500, 500+)
- Registration numbers
- KYC status (Pending, Verified, Rejected)
- Verification status
- HR contact information
- Logo paths

## Database Schema

The seeder respects the following relationships:

```
User (1) ──── (1) Student
    ├──── (1) Trainer
    └──── (1) Company
```

Each student/trainer/company record is properly linked to their parent user account with foreign key constraints.

## Customizing Test Data

To customize the test data, edit the following files:

1. **DatabaseSeeder.php** - Main seeder that controls which accounts are created
2. **StudentFactory.php** - Generates random student data
3. **TrainerFactory.php** - Generates random trainer data
4. **CompanyFactory.php** - Generates random company data

### Example: Add more students

Edit `database/seeders/DatabaseSeeder.php`:

```php
$studentEmails = [
    'student1@nexthire.com',
    'student2@nexthire.com',
    // Add more emails here
    'student6@nexthire.com',
    'student7@nexthire.com',
];
```

## Troubleshooting

### "SQLSTATE[HY000]: General error: 1030 Got error..."
**Solution:** Ensure your database is running and you have proper credentials in `.env`

### "PDOException: SQLSTATE[42P06]: Duplicate schema"
**Solution:** Use `migrate:fresh` to drop and recreate tables:
```bash
php artisan migrate:fresh --seed
```

### "Class not found" errors
**Solution:** Ensure Composer dependencies are installed:
```bash
composer install
```

### Models have no fillable attributes
**Solution:** Check that model `$fillable` arrays match the migration columns

## Best Practices

1. **Development:** Use `migrate:fresh --seed` to start with clean data
2. **Testing:** Use seeders in your test setup with `RefreshDatabase` trait
3. **Production:** Never seed production databases with test data
4. **Backup:** Always backup your database before running migrations
5. **Version Control:** Keep seeders in version control but exclude sensitive `.env` files

## Next Steps

After seeding, you can:

1. Login with any test account
2. Create relationships (students hiring trainers, companies posting jobs, etc.)
3. Test payment flows with the created accounts
4. Test interview and evaluation features
5. Verify notification and chat systems

For API testing, use the test credentials with your authentication endpoints.
