# NextHire API Testing - Master Guide

**Date:** June 5, 2026  
**API Version:** 1.0.0  
**Total Tests:** 200+  
**Estimated Duration:** 4-6 hours (manual) / 30 min (automated)

---

## 📚 Testing Documentation Overview

### Quick Links

| Document | Purpose | Location |
|----------|---------|----------|
| **FULL_API_TESTING_SUITE.md** | Complete testing guide (5,000+ lines) | `/home/boni/Desktop/nexthire/` |
| **AUTH_TESTING_PLAN.md** | Authentication testing (12 test cases) | `/home/boni/Desktop/nexthire/` |
| **AUTH_TESTING_SUMMARY.md** | Auth quick reference | `/home/boni/Desktop/nexthire/` |
| **API_COMPLETION_REVIEW.md** | API endpoint review (78/78 endpoints) | `/home/boni/Desktop/nexthire/` |
| **ENDPOINTS.md** | API documentation | `/home/boni/Desktop/nexthire/docs/` |
| **test_auth.sh** | Automated auth test script | `/home/boni/Desktop/nexthire/api/` |

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Start API Server
```bash
cd /home/boni/Desktop/nexthire/api
php artisan serve --port=8001
```

### Step 2: Run Quick Test
```bash
cd /home/boni/Desktop/nexthire/api
bash test_auth.sh
```

### Step 3: Check Results
```bash
cat /tmp/auth_test_results.txt
```

---

## 📊 Testing Sections

### Section 1: Authentication (10 Endpoints)
**Time:** 30 minutes
**Tests:** 12 manual + 9 automated
**File:** `AUTH_TESTING_PLAN.md`

Topics covered:
- User registration (all roles)
- Email verification
- Login/logout
- Token management
- Password reset
- Error handling

**Quick Test:**
```bash
bash test_auth.sh
```

---

### Section 2: Student APIs (9 Endpoints)
**Time:** 45 minutes
**Tests:** 15+
**File:** `FULL_API_TESTING_SUITE.md` (Section 2)

Topics covered:
- Profile management
- Dashboard access
- Session history
- Evaluation records
- Badge tracking
- XP history

**Key Endpoints:**
```
GET  /students/me
PUT  /students/me
POST /students/me/resume
GET  /students/me/dashboard
GET  /students/me/sessions
GET  /students/me/evaluations
GET  /students/me/badges
GET  /students/me/xp-history
GET  /students/{id}/public
```

---

### Section 3: Trainer APIs (14 Endpoints)
**Time:** 1 hour
**Tests:** 20+
**File:** `FULL_API_TESTING_SUITE.md` (Section 3)

Topics covered:
- Trainer discovery
- Profile management
- Package management
- Availability scheduling
- Earnings tracking
- Session management
- Evaluation submission

**Key Endpoints:**
```
GET  /trainers
GET  /trainers/{id}
GET  /trainers/{id}/availability
GET  /trainers/me
PUT  /trainers/me
GET  /trainers/me/dashboard
GET  /trainers/me/earnings
GET  /trainers/me/packages
POST /trainers/me/packages
PUT  /trainers/me/packages/{id}
DELETE /trainers/me/packages/{id}
GET  /trainers/me/sessions
POST /trainers/me/availability
POST /trainers/me/evaluations/{interview_id}
```

---

### Section 4: Booking & Interview (6 Endpoints)
**Time:** 30 minutes
**Tests:** 10+
**File:** `FULL_API_TESTING_SUITE.md` (Sections 4-5)

Topics covered:
- Booking creation
- Session joining
- Session completion
- Cancellation with refunds
- Interview management

**Key Endpoints:**
```
POST /bookings
GET  /bookings/{id}
POST /bookings/{id}/cancel
GET  /interviews/{id}
POST /interviews/{id}/join
POST /interviews/{id}/complete
```

---

### Section 5: Payment (8 Endpoints)
**Time:** 45 minutes
**Tests:** 15+
**File:** `FULL_API_TESTING_SUITE.md` (Section 6)

Topics covered:
- Payment initiation
- Gateway callbacks (5 gateways)
- Invoice generation
- Admin payout management

**Key Endpoints:**
```
POST /payments/initiate
POST /payments/sslcommerz/callback
POST /payments/bkash/callback
POST /payments/stripe/webhook
GET  /payments/history
GET  /payments/{id}/invoice
GET  /admin/payouts/pending
POST /admin/payouts/{id}/process
```

---

### Section 6: Gamification (6 Endpoints)
**Time:** 30 minutes
**Tests:** 10+
**File:** `FULL_API_TESTING_SUITE.md` (Section 7)

Topics covered:
- Global leaderboard
- Country-specific ranking
- Badge system
- XP levels
- Personal ranking

**Key Endpoints:**
```
GET /leaderboard/global
GET /leaderboard/country/{code}
GET /leaderboard/me/rank
GET /badges
GET /badges/me
GET /xp/levels
```

---

### Section 7: Company APIs (9 Endpoints)
**Time:** 45 minutes
**Tests:** 15+
**File:** `FULL_API_TESTING_SUITE.md` (Section 8)

Topics covered:
- Company registration
- Campaign management
- Candidate tracking
- Interview scheduling
- Messaging system

**Key Endpoints:**
```
POST /companies/register
GET  /companies/me/dashboard
GET  /companies/me/campaigns
POST /companies/me/campaigns
POST /companies/me/campaigns/{id}/invite
GET  /companies/me/candidates
PUT  /companies/me/candidates/{id}/status
GET  /companies/me/inbox
POST /companies/me/inbox
```

---

### Section 8: Admin APIs (10 Endpoints)
**Time:** 1 hour
**Tests:** 15+
**File:** `FULL_API_TESTING_SUITE.md` (Section 9)

Topics covered:
- Platform dashboard
- User management
- Trainer approval workflow
- Company KYC verification
- Revenue reports
- Badge creation
- Notifications broadcast

**Key Endpoints:**
```
GET  /admin/dashboard
GET  /admin/users
PUT  /admin/users/{id}/status
GET  /admin/trainers/pending
POST /admin/trainers/{id}/approve
GET  /admin/companies/pending
POST /admin/companies/{id}/verify
GET  /admin/reports/revenue
POST /admin/badges
POST /admin/notifications/broadcast
```

---

### Section 9: Notifications (3 Endpoints)
**Time:** 15 minutes
**Tests:** 5+
**File:** `FULL_API_TESTING_SUITE.md` (Section 10)

Topics covered:
- Notification retrieval
- Mark as read
- Broadcast management

**Key Endpoints:**
```
GET  /notifications
POST /notifications/read-all
POST /notifications/{id}/read
```

---

## ✅ Test Accounts (12 Total)

### Admin
```
Email:    admin@nexthire.com
Password: admin@123
```

### Students (5)
```
student1@nexthire.com / password123
student2@nexthire.com / password123
student3@nexthire.com / password123
student4@nexthire.com / password123
student5@nexthire.com / password123
```

### Trainers (3)
```
trainer1@nexthire.com / password123
trainer2@nexthire.com / password123
trainer3@nexthire.com / password123
```

### Companies (3)
```
company1@nexthire.com / password123
company2@nexthire.com / password123
company3@nexthire.com / password123
```

---

## 🧪 Testing Approach

### Manual Testing (Recommended for first run)
1. **Read** the test case documentation
2. **Execute** the curl command
3. **Verify** the response matches expected
4. **Document** the result

**Pros:**
- Understand each endpoint deeply
- Catch unexpected behaviors
- Build familiarity with API

**Time:** 4-6 hours for all 78 endpoints

### Automated Testing (Quick verification)
1. **Run** the test script
2. **Review** the test results
3. **Check** failed tests
4. **Debug** as needed

**Pros:**
- Fast execution
- Repeatable results
- Good for regression testing

**Time:** 30 minutes

### Hybrid Approach (Recommended)
1. **Run** automated auth tests (30 min)
2. **Manually test** core sections (2-3 hours)
3. **Spot check** remaining endpoints (1-2 hours)

---

## 📋 Testing Checklist

### Pre-Testing
- [ ] API running on port 8001: `php artisan serve --port=8001`
- [ ] Database seeded: `php artisan db:seed`
- [ ] curl installed and working
- [ ] Test documentation opened
- [ ] Terminal/console ready
- [ ] 4-6 hours available

### During Testing
- [ ] Testing one section at a time
- [ ] Documenting each result
- [ ] Noting response times
- [ ] Recording error messages
- [ ] Testing multiple user roles
- [ ] Checking both success and error paths

### After Testing
- [ ] Review all test results
- [ ] Identify any failures
- [ ] Log issues found
- [ ] Create fixes if needed
- [ ] Re-test failed cases
- [ ] Generate final report

---

## 📝 Test Result Template

For each endpoint, record:

```
═══════════════════════════════════════════════════════════════

ENDPOINT: POST /auth/login
METHOD: POST
URL: http://localhost:8001/api/v1/auth/login

STATUS: ✅ PASS / ❌ FAIL / ⚠️ PARTIAL

SUCCESS TESTS:
- [x] Valid credentials → Status 200
- [x] Tokens returned
- [x] User data correct
- [x] Response time < 500ms

ERROR TESTS:
- [x] Invalid password → Status 401
- [x] Wrong email → Status 401
- [x] Unverified email → Status 403

VALIDATION TESTS:
- [x] Missing email → Status 422
- [x] Missing password → Status 422

NOTES:
All tests passing. Response times optimal.

═══════════════════════════════════════════════════════════════
```

---

## 🎯 Success Criteria

### Minimum Requirements
- ✅ 90%+ endpoints working
- ✅ All critical paths passing
- ✅ No data corruption
- ✅ Proper error handling
- ✅ Authentication working

### Quality Standards
- ✅ 95%+ happy path tests passing
- ✅ 100% error codes correct
- ✅ <500ms response times
- ✅ Clean error messages
- ✅ Database integrity maintained

### Production Ready
- ✅ 100% critical endpoints tested
- ✅ <5% non-critical failures
- ✅ All validations working
- ✅ Rate limiting functional
- ✅ No security vulnerabilities

---

## 🐛 Common Issues & Solutions

### Issue: Connection Refused
```bash
# Make sure API is running
php artisan serve --port=8001
```

### Issue: Token Expired
```bash
# Get new token from login
curl -X POST http://localhost:8001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "student1@nexthire.com", "password": "password123"}'
```

### Issue: Database Error
```bash
# Re-seed database
php artisan migrate:fresh --force
php artisan db:seed
```

### Issue: Test Script Permission
```bash
# Make script executable
chmod +x test_auth.sh
```

### Issue: Invalid JSON Response
```bash
# Check API logs
tail -f storage/logs/laravel.log

# Verify curl syntax
curl -X POST http://localhost:8001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{...}'  # Valid JSON
```

---

## 📊 Testing Time Estimates

| Section | Endpoints | Tests | Time |
|---------|-----------|-------|------|
| Authentication | 10 | 12 | 30 min |
| Student | 9 | 15 | 45 min |
| Trainer | 14 | 20 | 60 min |
| Company | 9 | 15 | 45 min |
| Admin | 10 | 15 | 60 min |
| Booking | 3 | 10 | 30 min |
| Payment | 8 | 15 | 45 min |
| Gamification | 6 | 10 | 30 min |
| Interview | 3 | 5 | 15 min |
| Notifications | 3 | 5 | 15 min |
| **TOTAL** | **78** | **200+** | **5-6 hr** |

---

## 🎓 Recommended Testing Order

1. **Authentication First** (Foundation)
   - All other tests depend on auth
   - Get tokens, understand API format
   - Time: 30 min

2. **Student APIs** (Primary user)
   - Core feature of platform
   - Many other features depend on this
   - Time: 45 min

3. **Trainer APIs** (Secondary user)
   - Complementary to student
   - Payment integration test
   - Time: 60 min

4. **Company APIs** (Tertiary user)
   - Hiring workflow
   - Candidate management
   - Time: 45 min

5. **Booking & Interview** (Integration)
   - Brings together student + trainer
   - Payment processing
   - Time: 30 min

6. **Admin APIs** (Management)
   - System oversight
   - Approval workflows
   - Time: 60 min

7. **Gamification** (Features)
   - Leaderboard, badges, XP
   - Time: 30 min

8. **Notifications** (Support)
   - Event notifications
   - Time: 15 min

9. **Spot Checks** (Verification)
   - Random endpoints
   - Remaining edge cases
   - Time: 30 min

---

## 📈 Expected Results Summary

### If All Tests Pass (100%)
```
✅ API is production-ready
✅ Ready for frontend integration
✅ Ready for user acceptance testing
✅ Ready for deployment
```

### If 95%+ Tests Pass
```
✅ API is mostly production-ready
⚠️ Review and fix remaining issues
⚠️ Re-test after fixes
✅ Ready for deployment after fixes
```

### If <95% Tests Pass
```
❌ API needs significant fixes
❌ Debug and fix all critical issues
❌ Re-test entire suite
❌ Not ready for deployment
```

---

## 📞 Support & Resources

### API Documentation
- **File:** `/home/boni/Desktop/nexthire/docs/ENDPOINTS.md`
- **Coverage:** All 78 endpoints
- **Format:** Request/response examples

### Testing Guides
- **Auth:** `AUTH_TESTING_PLAN.md` (12 test cases)
- **Full API:** `FULL_API_TESTING_SUITE.md` (200+ tests)
- **Summary:** `AUTH_TESTING_SUMMARY.md` (quick ref)

### Test Scripts
- **Automated:** `test_auth.sh` (auth tests)
- **Status:** Executable, ready to run

### Logs & Debugging
- **API Logs:** `storage/logs/laravel.log`
- **Database:** `nexthire3`
- **Port:** `8001`

---

## ✨ Final Notes

- **Tests are isolated:** Don't affect production
- **Tests are repeatable:** Can run multiple times
- **Tests are comprehensive:** Cover all 78 endpoints
- **Tests are documented:** Each case has expected results
- **Tests are automated:** Can be run via script

---

## 🎉 You're Ready!

Everything you need to thoroughly test the NextHire API is ready:

✅ Complete API documentation (78 endpoints)
✅ Comprehensive testing plans (200+ test cases)
✅ Automated test scripts (auth module)
✅ Test accounts (12 available)
✅ Expected results (all endpoints)
✅ Troubleshooting guide (common issues)

**Start testing now!**

```bash
# Step 1: Start API
cd /home/boni/Desktop/nexthire/api
php artisan serve --port=8001

# Step 2: Run tests (another terminal)
bash test_auth.sh

# Step 3: Check results
cat /tmp/auth_test_results.txt
```

---

**Document Version:** 1.0  
**Last Updated:** June 5, 2026  
**Status:** Ready for Testing
