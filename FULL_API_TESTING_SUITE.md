# Full API Testing Suite - NextHire Platform

**Date:** June 5, 2026  
**API Version:** 1.0.0  
**Total Endpoints:** 78  
**Test Cases:** 200+  

---

## 📋 Testing Plan Overview

### Total Endpoints by Section

| Section | Count | Status |
|---------|-------|--------|
| Authentication | 10 | 🟢 Ready |
| Student | 9 | 🟢 Ready |
| Trainer (Public) | 3 | 🟢 Ready |
| Trainer (Auth) | 11 | 🟢 Ready |
| Booking | 3 | 🟢 Ready |
| Interview/Session | 3 | 🟢 Ready |
| Payment | 8 | 🟢 Ready |
| Gamification | 6 | 🟢 Ready |
| Company | 9 | 🟢 Ready |
| Admin | 10 | 🟢 Ready |
| Notifications | 3 | 🟢 Ready |
| **TOTAL** | **78** | **🟢 Ready** |

---

## 🧪 Test Categories

### 1. Success Path Tests (✅)
- Valid requests with correct data
- Expected 200/201 responses
- Verify response structure
- Check data accuracy

### 2. Error Path Tests (❌)
- Invalid requests
- Missing required fields
- Wrong data types
- Unauthorized access
- Expected 4xx/5xx responses

### 3. Authentication Tests (🔐)
- Token validation
- Role-based access
- Protected routes
- Token expiry
- Refresh token flow

### 4. Validation Tests (✔️)
- Email validation
- Password requirements
- Data type validation
- Length constraints
- Unique constraints

### 5. Edge Cases (⚠️)
- Rate limiting
- Pagination boundaries
- Concurrent requests
- Large data payloads
- Special characters

---

## 🔐 SECTION 1: AUTHENTICATION (10 Endpoints)

### 1.1 Register User
**Endpoint:** `POST /auth/register`

**Success Test:**
```bash
curl -X POST http://localhost:8001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@nexthire.com",
    "password": "Password123",
    "password_confirmation": "Password123",
    "role": "student"
  }'
```

**Expected:** 201 + User created in DB
**Error Tests:**
- [ ] Duplicate email → 422
- [ ] Invalid email format → 422
- [ ] Password too short → 422
- [ ] Missing required fields → 422

**Verify:**
- [ ] Response has user.id
- [ ] Response has user.uuid
- [ ] Status is "pending"
- [ ] Email verification token generated
- [ ] Test for all roles (student, trainer, company)

---

### 1.2 Login User
**Endpoint:** `POST /auth/login`

**Success Test:**
```bash
curl -X POST http://localhost:8001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@nexthire.com",
    "password": "password123"
  }'
```

**Expected:** 200 + tokens + user data
**Tests:**
- [ ] Valid credentials → 200 + tokens
- [ ] Invalid password → 401
- [ ] Wrong email → 401
- [ ] Unverified email → 403
- [ ] Suspended account → 403

**Verify:**
- [ ] access_token returned
- [ ] refresh_token returned
- [ ] expires_in = 900 (15 min)
- [ ] User data returned
- [ ] No password in response

---

### 1.3 Logout User
**Endpoint:** `POST /auth/logout`

**Success Test:**
```bash
curl -X POST http://localhost:8001/api/v1/auth/logout \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

**Tests:**
- [ ] Valid token → 200
- [ ] No token → 401
- [ ] Invalid token → 401

**Verify:**
- [ ] Tokens are invalidated
- [ ] Cannot use token after logout

---

### 1.4 Verify Email
**Endpoint:** `POST /auth/verify-email`

**Success Test:**
```bash
curl -X POST http://localhost:8001/api/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "verification-token"
  }'
```

**Tests:**
- [ ] Valid token → 200
- [ ] Expired token → 422
- [ ] Invalid token → 422
- [ ] Already verified → 422

**Verify:**
- [ ] User status changes to "active"
- [ ] Can login after verification

---

### 1.5 Refresh Token
**Endpoint:** `POST /auth/refresh`

**Success Test:**
```bash
curl -X POST http://localhost:8001/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "refresh-token"
  }'
```

**Tests:**
- [ ] Valid refresh token → 200
- [ ] Expired refresh token → 401
- [ ] Invalid token → 401

**Verify:**
- [ ] New access_token returned
- [ ] Can use new token

---

### 1.6 Forgot Password
**Endpoint:** `POST /auth/forgot-password`

**Test:**
```bash
curl -X POST http://localhost:8001/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "student1@nexthire.com"}'
```

**Tests:**
- [ ] Valid email → 200
- [ ] Invalid email → 200 (security: no user enumeration)

---

### 1.7 Reset Password
**Endpoint:** `POST /auth/reset-password`

**Tests:**
- [ ] Valid token + password → 200
- [ ] Expired token → 422
- [ ] Password mismatch → 422

---

### 1.8-1.10: OAuth & OTP
**Endpoints:**
- `POST /auth/google` - Google OAuth
- `POST /auth/phone-otp` - Send OTP
- `POST /auth/verify-otp` - Verify OTP

**Status:** Optional (requires external services)

---

## 👤 SECTION 2: STUDENT (9 Endpoints)

### 2.1 Get Student Profile
**Endpoint:** `GET /students/me`

**Tests:**
- [ ] With valid token → 200 + student data
- [ ] Without token → 401
- [ ] With trainer token → 403 (wrong role)

**Verify:**
- [ ] Response includes all fields
- [ ] Correct student data returned

---

### 2.2 Update Student Profile
**Endpoint:** `PUT /students/me`

**Tests:**
- [ ] Update single field → 200
- [ ] Update all fields → 200
- [ ] Invalid data type → 422
- [ ] Partial update → 200

**Verify:**
- [ ] profile_completion updated
- [ ] XP awarded if profile completes

---

### 2.3 Upload Resume
**Endpoint:** `POST /students/me/resume`

**Tests:**
- [ ] Valid PDF → 200
- [ ] Wrong format (DOC) → 422
- [ ] File too large (>5MB) → 422
- [ ] No file → 422

---

### 2.4 Get Dashboard
**Endpoint:** `GET /students/me/dashboard`

**Verify:**
- [ ] Stats section
- [ ] Upcoming sessions
- [ ] Recent evaluations
- [ ] Badges
- [ ] Recommended trainers

---

### 2.5 Get Sessions
**Endpoint:** `GET /students/me/sessions`

**Tests:**
- [ ] No filter → all sessions
- [ ] `?status=upcoming` → upcoming only
- [ ] `?status=completed` → completed only
- [ ] Pagination works

---

### 2.6 Get Evaluations
**Endpoint:** `GET /students/me/evaluations`

**Verify:**
- [ ] List of evaluations
- [ ] Radar chart data included
- [ ] Pagination works

---

### 2.7 Get Badges
**Endpoint:** `GET /students/me/badges`

**Verify:**
- [ ] Earned badges
- [ ] Locked badges with progress
- [ ] Badge count

---

### 2.8 Get XP History
**Endpoint:** `GET /students/me/xp-history`

**Verify:**
- [ ] XP events listed
- [ ] Event types
- [ ] Pagination

---

### 2.9 Public Student Profile
**Endpoint:** `GET /students/{id}/public`

**Tests:**
- [ ] Valid student ID → 200
- [ ] Invalid student ID → 404
- [ ] No token needed → 200

**Verify:**
- [ ] No sensitive data (email, phone)
- [ ] Public data only

---

## 🏫 SECTION 3: TRAINER (14 Endpoints)

### Public Endpoints (3)

**3.1 Get Trainers List**
**Endpoint:** `GET /trainers`

**Tests:**
- [ ] No filter → all trainers
- [ ] `?domain=Software Engineering` → filtered
- [ ] `?min_rating=4.5` → filtered
- [ ] `?max_price=500` → filtered
- [ ] `?search=name` → search
- [ ] Pagination with cursor

---

**3.2 Get Trainer Details**
**Endpoint:** `GET /trainers/{id}`

**Tests:**
- [ ] Valid ID → 200
- [ ] Invalid ID → 404
- [ ] Includes packages
- [ ] Includes reviews
- [ ] Rating breakdown included

---

**3.3 Get Trainer Availability**
**Endpoint:** `GET /trainers/{id}/availability`

**Tests:**
- [ ] Valid ID → 200
- [ ] Date range filtering
- [ ] Booked slots marked

---

### Authenticated Endpoints (11)

**3.4 Get My Profile**
**Endpoint:** `GET /trainers/me`

**Tests:**
- [ ] Trainer can access → 200
- [ ] Non-trainer cannot → 403
- [ ] Includes payout info

---

**3.5 Update Profile**
**Endpoint:** `PUT /trainers/me`

**Tests:**
- [ ] Update bio → 200
- [ ] Update expertise → 200
- [ ] Update payout info → 200

---

**3.6 Get Dashboard**
**Endpoint:** `GET /trainers/me/dashboard`

**Verify:**
- [ ] Stats (earnings, sessions, rating)
- [ ] Upcoming sessions
- [ ] Pending evaluations
- [ ] Monthly earnings chart
- [ ] Recent reviews

---

**3.7 Get Earnings**
**Endpoint:** `GET /trainers/me/earnings`

**Verify:**
- [ ] Total earnings
- [ ] Monthly breakdown
- [ ] Payout history
- [ ] Pending payout

---

**3.8 Get Packages**
**Endpoint:** `GET /trainers/me/packages`

**Tests:**
- [ ] All packages listed
- [ ] Package details included

---

**3.9 Create Package**
**Endpoint:** `POST /trainers/me/packages`

**Tests:**
- [ ] Valid package → 201
- [ ] Invalid data → 422
- [ ] All fields required

---

**3.10 Update Package**
**Endpoint:** `PUT /trainers/me/packages/{id}`

**Tests:**
- [ ] Update price → 200
- [ ] Update status → 200
- [ ] Only own package → 403

---

**3.11 Delete Package**
**Endpoint:** `DELETE /trainers/me/packages/{id}`

**Tests:**
- [ ] Delete own package → 200
- [ ] Delete others' package → 403
- [ ] Soft delete (not hard delete)

---

**3.12 Get My Sessions**
**Endpoint:** `GET /trainers/me/sessions`

**Verify:**
- [ ] Trainer's sessions listed
- [ ] Student info included

---

**3.13 Set Availability**
**Endpoint:** `POST /trainers/me/availability`

**Tests:**
- [ ] Add time slots → 201
- [ ] Overlapping slots → 422
- [ ] Past dates → 422

---

**3.14 Submit Evaluation**
**Endpoint:** `POST /trainers/me/evaluations/{interview_id}`

**Tests:**
- [ ] Valid evaluation → 201
- [ ] All scores required → 422
- [ ] Already evaluated → 409
- [ ] XP awarded

---

## 📅 SECTION 4: BOOKING (3 Endpoints)

**4.1 Create Booking**
**Endpoint:** `POST /bookings`

**Tests:**
- [ ] Valid booking → 201
- [ ] Slot already booked → 409
- [ ] Invalid package → 404
- [ ] Invalid availability → 404

---

**4.2 Get Booking**
**Endpoint:** `GET /bookings/{id}`

**Tests:**
- [ ] Own booking → 200
- [ ] Others' booking → 403
- [ ] Invalid ID → 404

---

**4.3 Cancel Booking**
**Endpoint:** `POST /bookings/{id}/cancel`

**Tests:**
- [ ] Within 24h → 200 + refund initiated
- [ ] After 24h → 422 (no refund)
- [ ] Already completed → 422

---

## 🎥 SECTION 5: INTERVIEW/SESSION (3 Endpoints)

**5.1 Get Interview**
**Endpoint:** `GET /interviews/{id}`

**Verify:**
- [ ] Agora channel name
- [ ] Meeting link
- [ ] Student & trainer info

---

**5.2 Join Session**
**Endpoint:** `POST /interviews/{id}/join`

**Tests:**
- [ ] Within 30min of session → 200 + Agora token
- [ ] Too early (>30min) → 403
- [ ] Session started → 403

---

**5.3 Complete Session**
**Endpoint:** `POST /interviews/{id}/complete`

**Tests:**
- [ ] Trainer can complete → 200
- [ ] Student cannot complete → 403
- [ ] Already completed → 409

---

## 💳 SECTION 6: PAYMENT (8 Endpoints)

**6.1 Initiate Payment**
**Endpoint:** `POST /payments/initiate`

**Tests:**
- [ ] Valid interview → 200 + payment_url
- [ ] Already paid → 409
- [ ] Invalid gateway → 422

---

**6.2-6.4 Payment Callbacks**
**Endpoints:**
- `POST /payments/sslcommerz/callback`
- `POST /payments/bkash/callback`
- `POST /payments/stripe/webhook`

**Tests:**
- [ ] Valid callback → 200
- [ ] Payment marked complete
- [ ] XP awarded to student

---

**6.5 Get Payment History**
**Endpoint:** `GET /payments/history`

**Verify:**
- [ ] All payments listed
- [ ] Pagination works

---

**6.6 Get Invoice**
**Endpoint:** `GET /payments/{id}/invoice`

**Tests:**
- [ ] Own payment → PDF download
- [ ] Others' payment → 403

---

**6.7-6.8 Admin Payout Endpoints**
**Endpoints:**
- `GET /admin/payouts/pending`
- `POST /admin/payouts/{id}/process`

---

## 🏆 SECTION 7: GAMIFICATION (6 Endpoints)

**7.1 Global Leaderboard**
**Endpoint:** `GET /leaderboard/global`

**Tests:**
- [ ] Top 50 returned
- [ ] Pagination works
- [ ] Current user marked

---

**7.2 Country Leaderboard**
**Endpoint:** `GET /leaderboard/country/{code}`

**Tests:**
- [ ] Valid country code → 200
- [ ] Invalid country → 404

---

**7.3 My Rank**
**Endpoint:** `GET /leaderboard/me/rank`

**Verify:**
- [ ] Global rank
- [ ] Country rank
- [ ] XP to next rank

---

**7.4 All Badges**
**Endpoint:** `GET /badges`

**Verify:**
- [ ] All badge definitions
- [ ] Unlock conditions

---

**7.5 My Badges**
**Endpoint:** `GET /badges/me`

**Verify:**
- [ ] Earned badges
- [ ] Locked badges with progress

---

**7.6 XP Levels**
**Endpoint:** `GET /xp/levels`

**Verify:**
- [ ] All 10 levels
- [ ] XP required per level

---

## 🏢 SECTION 8: COMPANY (9 Endpoints)

**8.1 Register Company**
**Endpoint:** `POST /companies/register`

**Tests:**
- [ ] Valid registration → 201
- [ ] Duplicate email → 422
- [ ] Creates user + company

---

**8.2 Get Dashboard**
**Endpoint:** `GET /companies/me/dashboard`

**Verify:**
- [ ] KYC status
- [ ] Stats (campaigns, candidates, interviews)
- [ ] Active campaigns
- [ ] Recent candidates

---

**8.3 Get Campaigns**
**Endpoint:** `GET /companies/me/campaigns`

**Tests:**
- [ ] All campaigns
- [ ] `?status=active` filter
- [ ] Pagination

---

**8.4 Create Campaign**
**Endpoint:** `POST /companies/me/campaigns`

**Tests:**
- [ ] Valid campaign → 201
- [ ] Missing fields → 422

---

**8.5 Invite Candidate**
**Endpoint:** `POST /companies/me/campaigns/{id}/invite`

**Tests:**
- [ ] Valid invite → 201
- [ ] Already invited → 409

---

**8.6 Get Candidates**
**Endpoint:** `GET /companies/me/candidates`

**Tests:**
- [ ] All candidates
- [ ] Filtering & search
- [ ] Pagination

---

**8.7 Update Candidate Status**
**Endpoint:** `PUT /companies/me/candidates/{id}/status`

**Tests:**
- [ ] Valid stage transition → 200
- [ ] Invalid transition → 422

---

**8.8 Get Inbox**
**Endpoint:** `GET /companies/me/inbox`

**Verify:**
- [ ] Messages from candidates
- [ ] Unread count

---

**8.9 Send Message**
**Endpoint:** `POST /companies/me/inbox`

**Tests:**
- [ ] Send message → 201
- [ ] Invalid student → 404

---

## 👨‍💼 SECTION 9: ADMIN (10 Endpoints)

**9.1 Dashboard**
**Endpoint:** `GET /admin/dashboard`

**Verify:**
- [ ] Platform stats
- [ ] Revenue charts
- [ ] Activity feed
- [ ] Pending approvals

---

**9.2 Get Users**
**Endpoint:** `GET /admin/users`

**Tests:**
- [ ] Filter by role
- [ ] Filter by status
- [ ] Search by email
- [ ] Pagination

---

**9.3 Update User Status**
**Endpoint:** `PUT /admin/users/{id}/status`

**Tests:**
- [ ] Suspend user → 200
- [ ] Activate user → 200

---

**9.4 Get Pending Trainers**
**Endpoint:** `GET /admin/trainers/pending`

**Verify:**
- [ ] List of pending trainers
- [ ] Profile details included

---

**9.5 Approve Trainer**
**Endpoint:** `POST /admin/trainers/{id}/approve`

**Tests:**
- [ ] Approve trainer → 200
- [ ] Trainer notified
- [ ] Trainer is_approved = true

---

**9.6 Get Pending Companies**
**Endpoint:** `GET /admin/companies/pending`

**Verify:**
- [ ] List pending companies
- [ ] KYC document included

---

**9.7 Verify Company**
**Endpoint:** `POST /admin/companies/{id}/verify`

**Tests:**
- [ ] Verify company → 200
- [ ] Company notified

---

**9.8 Revenue Reports**
**Endpoint:** `GET /admin/reports/revenue`

**Tests:**
- [ ] Date range filtering
- [ ] Grouping by period
- [ ] Revenue by gateway

---

**9.9 Create Badge**
**Endpoint:** `POST /admin/badges`

**Tests:**
- [ ] Create badge → 201
- [ ] Invalid data → 422

---

**9.10 Broadcast Notification**
**Endpoint:** `POST /admin/notifications/broadcast`

**Tests:**
- [ ] Send to all → 200
- [ ] Send to specific role → 200
- [ ] Multiple channels

---

## 🔔 SECTION 10: NOTIFICATIONS (3 Endpoints)

**10.1 Get Notifications**
**Endpoint:** `GET /notifications`

**Tests:**
- [ ] All notifications
- [ ] `?unread_only=true` filter
- [ ] Pagination

---

**10.2 Mark All Read**
**Endpoint:** `POST /notifications/read-all`

**Tests:**
- [ ] Mark all as read → 200

---

**10.3 Mark Read**
**Endpoint:** `POST /notifications/{id}/read`

**Tests:**
- [ ] Mark single as read → 200
- [ ] Others' notification → 403

---

## 📊 Testing Metrics

### Success Rate Targets
- **Happy Path Tests:** 95%+ pass rate
- **Error Tests:** 100% correct error codes
- **Validation Tests:** 100% correct validation
- **Performance:** <500ms response time

### Coverage Requirements
- **Endpoints:** 100% (78/78)
- **HTTP Methods:** 100%
- **Status Codes:** All documented codes tested
- **Error Scenarios:** All documented errors tested
- **Validation Rules:** All rules tested

---

## 🔍 Test Execution Checklist

### Pre-Test
- [ ] API server running on :8001
- [ ] Database seeded with 12 accounts
- [ ] curl or Postman available
- [ ] Test results directory available

### During Testing
- [ ] Document start time
- [ ] Record all test results
- [ ] Note any unexpected behaviors
- [ ] Capture error messages
- [ ] Test with multiple accounts/roles

### Post-Test
- [ ] Generate test report
- [ ] Identify failures
- [ ] Document issues
- [ ] Create fix tickets
- [ ] Re-run failed tests

---

## 📝 Test Result Template

For each endpoint tested:
```
ENDPOINT: POST /auth/login
STATUS: ✅ PASS / ❌ FAIL / ⚠️ PARTIAL

SUCCESS TESTS:
- [x] Valid credentials → 200
- [x] Token returned
- [x] User data correct

ERROR TESTS:
- [x] Invalid password → 401
- [x] Wrong email → 401
- [x] Unverified email → 403

VALIDATION TESTS:
- [x] Missing email → 422
- [x] Missing password → 422

NOTES: All tests passing. Response time ~150ms.
```

---

## 🎯 Final Checklist

- [ ] All 78 endpoints tested
- [ ] 200+ test cases executed
- [ ] <5% failure rate acceptable
- [ ] All error codes verified
- [ ] All validations working
- [ ] Response times acceptable
- [ ] Database integrity maintained
- [ ] No data corruption
- [ ] Ready for production

---

**Total Estimated Testing Time:** 4-6 hours (manual), 30 minutes (automated)

**Status:** Ready to begin comprehensive testing

