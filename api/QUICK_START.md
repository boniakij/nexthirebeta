# Quick Start - Test Data

## TL;DR

```bash
cd api
php artisan migrate:fresh --seed
```

Or use the script:
```bash
cd api
./seed.sh
```

Done! Your database is now populated with test accounts.

## Available Test Accounts

### Admin
```
Email:    admin@nexthire.com
Password: admin@123
```

### Students (pick any)
```
Email:    student1@nexthire.com to student5@nexthire.com
Password: password123
```

### Trainers (pick any)
```
Email:    trainer1@nexthire.com to trainer3@nexthire.com
Password: password123
```

### Companies (pick any)
```
Email:    company1@nexthire.com to company3@nexthire.com
Password: password123
```

## What Gets Created

✅ **1 Admin Account** - Full system access
✅ **5 Student Accounts** - With profiles, skills, experience levels
✅ **3 Trainer Accounts** - With expertise, ratings, availability
✅ **3 Company Accounts** - With verification status, KYC info

All accounts are:
- ✓ Email verified
- ✓ Status set to "active"
- ✓ Phone numbers assigned
- ✓ Fully populated with realistic test data

## Next Steps

1. Login with any test account
2. Create relationships between accounts
3. Test features like:
   - Student hiring trainers
   - Companies posting jobs
   - Payment processing
   - Reviews and ratings
   - Notifications

For detailed information, see [TEST_DATA_SETUP.md](TEST_DATA_SETUP.md)
