# Test Data Seeding Implementation Summary

## Overview

Comprehensive test data seeding system has been implemented for the NextHire platform. The system creates realistic test accounts across all user roles (Admin, Students, Trainers, Companies) with fully populated profiles.

## Files Created

### Factories
| File | Purpose | Accounts Created |
|------|---------|------------------|
| `api/database/factories/StudentFactory.php` | Generates realistic student profiles | Used for 5 test students |
| `api/database/factories/TrainerFactory.php` | Generates trainer profiles with expertise | Used for 3 test trainers |
| `api/database/factories/CompanyFactory.php` | Generates company profiles with KYC data | Used for 3 test companies |

### Seeders
| File | Purpose |
|------|---------|
| `api/database/seeders/DatabaseSeeder.php` | Main seeder orchestrating all account creation |

### Documentation
| File | Purpose |
|------|---------|
| `api/TEST_DATA_SETUP.md` | Comprehensive setup guide with credentials and troubleshooting |
| `api/QUICK_START.md` | Quick reference for running seeders |
| `api/seed.sh` | Executable script for easy seeding (bash) |

### Updated Files
| File | Changes |
|------|---------|
| `api/database/factories/UserFactory.php` | Updated to match actual User table schema (removed 'name') |
| `api/app/Models/Company.php` | Updated fillable array and added casts to match migration |

## Test Accounts Created

### Admin Account (1)
```
Email:    admin@nexthire.com
Password: admin@123
Phone:    +8801700000001
Status:   Active
```

### Student Accounts (5)
```
Email:    student1@nexthire.com through student5@nexthire.com
Password: password123
Phone:    +8801700000002 through +8801700000006
Status:   Active

Each student includes:
✓ Full name (Bengali names)
✓ University (BUET, DU, IUB, BRAC, NSU, ULAB)
✓ Department (CS, Software Eng, IT, Electronics, Electrical)
✓ Graduation year (2023-2027)
✓ Skills (React, Python, Node.js, Java, Go, Vue.js)
✓ Preferred job role
✓ LinkedIn & GitHub URLs
✓ Experience points (100-5000)
✓ Level (1-20)
✓ Streak tracking
✓ Country code (BD)
```

### Trainer Accounts (3)
```
Email:    trainer1@nexthire.com through trainer3@nexthire.com
Password: password123
Phone:    +8801710000002 through +8801710000004
Status:   Active

Each trainer includes:
✓ Full name (Professional titles: Dr., Prof., Eng.)
✓ Bio (auto-generated)
✓ Expertise domains (Web Dev, Python, Mobile, Cloud, Data Science, DevOps)
✓ Years of experience (2-15 years)
✓ Certifications (AWS, Kubernetes, Google Cloud, etc.)
✓ Company experience
✓ Hourly rate ($30-$100)
✓ Average rating (4.0-5.0)
✓ Review and session counts
✓ Approval status (80% approved)
✓ Payout information
✓ Country code (BD)
```

### Company Accounts (3)
```
Email:    company1@nexthire.com through company3@nexthire.com
Password: password123
Phone:    +8801720000002 through +8801720000004
Status:   Active

Each company includes:
✓ Company name
✓ Company website
✓ Industry (IT, Software, Finance, E-Commerce, Healthcare Tech, EdTech)
✓ Company size (1-10, 11-50, 51-200, 201-500, 500+)
✓ Registration number
✓ KYC status (Pending, Verified, Rejected)
✓ Verification status
✓ HR contact name and email
✓ Country code (BD)
```

## How to Use

### Quick Start
```bash
cd api
php artisan migrate:fresh --seed
```

### Or using the script
```bash
cd api
./seed.sh
```

### Seed existing database (without migrations)
```bash
cd api
php artisan db:seed
```

## Data Population Strategy

1. **User Creation** - Creates base user accounts with email, password, role, and status
2. **Profile Linking** - Creates Student/Trainer/Company records linked to users via foreign keys
3. **Realistic Data** - Uses Faker library to generate realistic profiles
4. **Consistent Naming** - Uses Bengali/Bangladeshi names and references appropriate to the context
5. **Status Consistency** - All test accounts are set to "active" status with verified emails

## Database Relationships

```
users (1) ───── (1) students
       ├─ (1) trainers
       └─ (1) companies
```

Each relationship is properly enforced with:
- Foreign key constraints (`user_id`)
- Cascade delete on user deletion
- Proper model relationships defined

## Key Features

✅ **Multiple Roles** - Admin, Student, Trainer, Company accounts
✅ **Comprehensive Profiles** - Each account type has full profile data
✅ **Realistic Data** - Uses Faker for authentic test data
✅ **Regional Context** - Bangladesh-specific universities, names, and settings
✅ **Email Verified** - All accounts have verified emails by default
✅ **Active Status** - All accounts ready to use immediately
✅ **Easy Setup** - Simple commands to create all test data
✅ **Customizable** - Easy to modify factories and seeders for different data
✅ **Script Support** - Bash script included for convenience
✅ **Documentation** - Comprehensive guides included

## Customization

### Add More Student Accounts
Edit `api/database/seeders/DatabaseSeeder.php`:
```php
$studentEmails = [
    'student1@nexthire.com',
    'student2@nexthire.com',
    // Add more here
    'student6@nexthire.com',
];
```

### Modify Student Factory
Edit `api/database/factories/StudentFactory.php` to change:
- Skills array
- Universities list
- Job roles
- XP ranges
- Level distribution

### Modify Trainer Factory
Edit `api/database/factories/TrainerFactory.php` to change:
- Expertise domains
- Hourly rates
- Certifications
- Years of experience

## Technical Details

### Model Updates Required
- **User Model** - Already configured with UUID generation and role enum
- **Student Model** - Already has factory auto-discovery
- **Trainer Model** - Already has factory auto-discovery
- **Company Model** - Updated with correct fillable array and casts

### Factories
- All factories use `fake()` helper from Faker library
- Proper casting for JSON fields (skills, expertise_domains, etc.)
- Datetime fields properly cast for database
- Boolean fields handled correctly

### Seeder
- Uses `WithoutModelEvents` to avoid triggering observers during seeding
- Provides console output showing what's being created
- Uses Helper methods for name generation
- Proper error handling for relationships

## Testing the Setup

After running seeders:

1. **Verify Database**
   ```bash
   php artisan tinker
   >>> App\Models\User::all()->count() // Should show 12 users
   >>> App\Models\Student::all()->count() // Should show 5 students
   ```

2. **Test Login** with any test account credentials

3. **Verify Relationships**
   ```bash
   php artisan tinker
   >>> $user = App\Models\User::first();
   >>> $user->student // Should work for student users
   >>> $user->trainer // Should work for trainer users
   ```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database doesn't exist | Run `migrate:fresh` first |
| Models not found | Run `composer install` and `composer dump-autoload` |
| Syntax errors | Check PHP version (^8.2) and Laravel version (^12.0) |
| Foreign key constraint fails | Ensure migrations run in correct order |
| Faker not found | Ensure `fakerphp/faker` is installed via Composer |

## Performance Notes

- Seeding 12 accounts with all relationships: < 1 second
- Can be extended to seed thousands of records if needed
- Each account creation uses proper database transactions
- No N+1 query issues in seeder design

## Next Steps

1. ✅ Run `php artisan migrate:fresh --seed`
2. ✅ Login with any test account
3. ✅ Create relationships (hire trainers, post jobs, etc.)
4. ✅ Test payment flows
5. ✅ Test interview and evaluation features
6. ✅ Test notifications and messaging

## References

- **Laravel Factory Documentation:** https://laravel.com/docs/eloquent-factories
- **Laravel Seeding:** https://laravel.com/docs/seeding
- **Faker Documentation:** https://github.com/FakerPHP/Faker
- **Test Data Setup:** See `api/TEST_DATA_SETUP.md`
- **Quick Reference:** See `api/QUICK_START.md`
