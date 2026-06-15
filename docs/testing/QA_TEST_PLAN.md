# NextHire QA Test Plan & Execution Guide

Generated from: AI_TESTING_PROMPT.md
Date: 2026-06-15
Project: NextHire (Mock Interview & Career Development Platform)

---

## Table of Contents

1. [Testing Strategy](#testing-strategy)
2. [Test Environment Setup](#test-environment-setup)
3. [Test Data & Fixtures](#test-data--fixtures)
4. [Backend API Test Cases](#backend-api-test-cases)
5. [Frontend UI Test Cases](#frontend-ui-test-cases)
6. [End-to-End User Journeys](#end-to-end-user-journeys)
7. [Security & Permission Tests](#security--permission-tests)
8. [Payment & Commission Tests](#payment--commission-tests)
9. [Withdrawal & Payout Tests](#withdrawal--payout-tests)
10. [Automation Test Plan](#automation-test-plan)
11. [Manual QA Checklist](#manual-qa-checklist)
12. [Bug Report Template](#bug-report-template)
13. [Release Readiness Checklist](#release-readiness-checklist)

---

## 1. Testing Strategy

### Testing Pyramid

```
Level 1 (Unit Tests): 40% - Laravel model tests, validation rules
Level 2 (Integration Tests): 35% - API + Database, Payment gateway mocks
Level 3 (E2E Tests): 25% - Full user workflows from UI to payment
```

### Test Phases

| Phase | Duration | Focus | Deliverable |
|-------|----------|-------|-------------|
| Phase 1 | Week 1 | Auth, Trainer Package CRUD | API test report |
| Phase 2 | Week 2 | Availability, Feed, Booking | API + UI test report |
| Phase 3 | Week 3 | Payment, Commission, Wallet | Payment test report |
| Phase 4 | Week 4 | Withdrawal, Admin, Security | Security + Compliance |
| Phase 5 | Week 5 | E2E, Load, Performance | Performance report |

### Test Execution Frequency

- **Smoke Tests**: Every commit (15 mins)
- **Regression Tests**: Daily (1 hour)
- **Full Suite**: Before release (4 hours)

---

## 2. Test Environment Setup

### Backend Setup

```bash
# Database
-mysql+ with test schema
- Redis for caching/sessions
- Test data seeding script

# Laravel Setup
APP_ENV=testing
APP_DEBUG=true
DB_DATABASE=nexthire_test
MAIL_DRIVER=log
QUEUE_DRIVER=sync
```

### Frontend Setup

```bash
# Next.js Testing
NODE_ENV=test
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Browser Testing
Playwright v1.40+
Headless mode for CI/CD
```

### Payment Gateway Mocks

```
SSLCommerz Sandbox
Bkash Sandbox
Nagad Sandbox
All webhooks mocked locally
```

### API Base URLs

```
Development: http://localhost:8000/api
Staging: https://api-staging.nexthire.local/api
Testing: http://localhost:8000/api (with fixtures)
```

---

## 3. Test Data & Fixtures

### Test Users

| Role | Email | Password | Status | Notes |
|------|-------|----------|--------|-------|
| Student 1 | student1@test.com | Test@1234 | Active | Used for booking tests |
| Student 2 | student2@test.com | Test@1234 | Active | Used for duplicate booking |
| Trainer 1 | trainer1@test.com | Test@1234 | Approved | Has packages & availability |
| Trainer 2 | trainer2@test.com | Test@1234 | Pending | Needs admin approval |
| Admin 1 | admin@test.com | Test@1234 | Active | Full permissions |

### Test Packages

```json
{
  "Package 1": {
    "id": 101,
    "title": "HR Mock Interview for Freshers",
    "category": "HR Interview",
    "difficulty_level": "beginner",
    "price": 800,
    "currency": "BDT",
    "trainer_id": 1,
    "status": "active",
    "available_slots": 5
  },
  "Package 2": {
    "id": 102,
    "title": "Technical Interview - Backend",
    "category": "Technical Interview",
    "difficulty_level": "intermediate",
    "price": 1200,
    "currency": "BDT",
    "trainer_id": 1,
    "status": "draft",
    "available_slots": 0
  }
}
```

### Test Availability Slots

```
Trainer 1:
- Monday: 14:00-15:00 (available)
- Tuesday: 15:00-16:00 (booked by student1)
- Wednesday: 14:00-15:00 (available)
- Thursday: 16:00-17:00 (blocked)
```

---

## 4. Backend API Test Cases

### 4.1 Authentication APIs

#### TC-AUTH-001: Register New Student

| Field | Value |
|-------|-------|
| Test ID | TC-AUTH-001 |
| Module | Authentication |
| Priority | Critical |
| Endpoint | POST /auth/register |
| **Preconditions** | None |
| **Steps** | 1. Send valid student registration payload<br>2. Verify email sent<br>3. Click verification link |
| **Expected Result** | Status: 200<br>Email verified<br>JWT token returned<br>User role = student |
| **Test Data** | email: newstudent@test.com<br>password: Test@1234<br>name: New Student |

#### TC-AUTH-002: Login with Valid Credentials

| Field | Value |
|-------|-------|
| Test ID | TC-AUTH-002 |
| Module | Authentication |
| Priority | Critical |
| Endpoint | POST /auth/login |
| **Preconditions** | User account exists (student1@test.com) |
| **Steps** | 1. Send login request<br>2. Verify response has token<br>3. Decode JWT to verify claims |
| **Expected Result** | Status: 200<br>JWT token valid<br>Token contains user_id, role, email |
| **Test Data** | email: student1@test.com<br>password: Test@1234 |

#### TC-AUTH-003: Login with Wrong Password

| Field | Value |
|-------|-------|
| Test ID | TC-AUTH-003 |
| Module | Authentication |
| Priority | High |
| Endpoint | POST /auth/login |
| **Preconditions** | User account exists |
| **Steps** | 1. Send login with wrong password<br>2. Check error response |
| **Expected Result** | Status: 401<br>Message: "Invalid credentials" |
| **Test Data** | email: student1@test.com<br>password: WrongPassword |

#### TC-AUTH-004: Access Protected Route Without Token

| Field | Value |
|-------|-------|
| Test ID | TC-AUTH-004 |
| Module | Authentication |
| Priority | Critical |
| Endpoint | GET /trainers/me/packages |
| **Preconditions** | Token not provided |
| **Steps** | 1. Send request without Authorization header<br>2. Verify response |
| **Expected Result** | Status: 401<br>Message: "Unauthenticated" |

#### TC-AUTH-005: Access Trainer Route with Student Token

| Field | Value |
|-------|-------|
| Test ID | TC-AUTH-005 |
| Module | Authentication |
| Priority | Critical |
| Endpoint | GET /trainers/me/packages |
| **Preconditions** | Authenticated as student |
| **Steps** | 1. Login as student<br>2. Use token to access trainer endpoint<br>3. Check authorization |
| **Expected Result** | Status: 403<br>Message: "Unauthorized" |

---

### 4.2 Trainer Package APIs

#### TC-PKG-001: Create Package as Draft

| Field | Value |
|-------|-------|
| Test ID | TC-PKG-001 |
| Module | Trainer Packages |
| Priority | Critical |
| Endpoint | POST /trainers/me/packages |
| **Preconditions** | Authenticated as trainer |
| **Steps** | 1. Send create package payload with status=draft<br>2. Verify response<br>3. Query GET /trainers/me/packages/{id} |
| **Expected Result** | Status: 201<br>Package created with id<br>status = draft<br>Can be edited |
| **Test Data** | See sample in AI_TESTING_PROMPT.md |

#### TC-PKG-002: Update Package Fields

| Field | Value |
|-------|-------|
| Test ID | TC-PKG-002 |
| Module | Trainer Packages |
| Priority | High |
| Endpoint | PUT /trainers/me/packages/{id} |
| **Preconditions** | Package exists in draft status |
| **Steps** | 1. Update title and price<br>2. Send PUT request<br>3. Verify updated fields |
| **Expected Result** | Status: 200<br>Fields updated<br>updated_at timestamp changed |

#### TC-PKG-003: Create Package Without Required Fields

| Field | Value |
|-------|-------|
| Test ID | TC-PKG-003 |
| Module | Trainer Packages |
| Priority | High |
| Endpoint | POST /trainers/me/packages |
| **Preconditions** | Authenticated as trainer |
| **Steps** | 1. Send payload with missing title<br>2. Check validation |
| **Expected Result** | Status: 422<br>Error: "title is required" |

#### TC-PKG-004: Set Negative Price

| Field | Value |
|-------|-------|
| Test ID | TC-PKG-004 |
| Module | Trainer Packages |
| Priority | High |
| Endpoint | POST /trainers/me/packages |
| **Preconditions** | None |
| **Steps** | 1. Send price = -100<br>2. Check validation |
| **Expected Result** | Status: 422<br>Error: "price must be positive" |

#### TC-PKG-005: Discount Price Greater Than Regular Price

| Field | Value |
|-------|-------|
| Test ID | TC-PKG-005 |
| Module | Trainer Packages |
| Priority | High |
| Endpoint | POST /trainers/me/packages |
| **Preconditions** | None |
| **Steps** | 1. Send price=100, discount_price=200<br>2. Validate |
| **Expected Result** | Status: 422<br>Error: "discount cannot exceed price" |

#### TC-PKG-006: Publish Package (Draft to Active)

| Field | Value |
|-------|-------|
| Test ID | TC-PKG-006 |
| Module | Trainer Packages |
| Priority | Critical |
| Endpoint | PATCH /trainers/me/packages/{id}/publish |
| **Preconditions** | Package in draft status<br>Has availability |
| **Steps** | 1. Send publish request<br>2. Verify status change<br>3. Check admin approval requirement |
| **Expected Result** | Status: 200<br>status = pending_review OR active (depends on config)<br>Package eligible for feed |

#### TC-PKG-007: Duplicate Package

| Field | Value |
|-------|-------|
| Test ID | TC-PKG-007 |
| Module | Trainer Packages |
| Priority | Medium |
| Endpoint | PATCH /trainers/me/packages/{id}/duplicate |
| **Preconditions** | Package exists |
| **Steps** | 1. Send duplicate request<br>2. Verify new package created<br>3. Check title has "Copy" suffix |
| **Expected Result** | Status: 200<br>New package with same data<br>status = draft |

#### TC-PKG-008: Hide Package from Feed

| Field | Value |
|-------|-------|
| Test ID | TC-PKG-008 |
| Module | Trainer Packages |
| Priority | High |
| Endpoint | PATCH /trainers/me/packages/{id}/hide |
| **Preconditions** | Package is active |
| **Steps** | 1. Send hide request<br>2. Check feed API response<br>3. Package should not appear |
| **Expected Result** | Status: 200<br>Package status = hidden<br>Removed from GET /feed/packages |

---

### 4.3 Trainer Availability APIs

#### TC-AVL-001: Create Weekly Schedule

| Field | Value |
|-------|-------|
| Test ID | TC-AVL-001 |
| Module | Trainer Availability |
| Priority | Critical |
| Endpoint | POST /trainers/me/availability/weekly-schedule |
| **Preconditions** | Authenticated as trainer |
| **Steps** | 1. Send weekly schedule<br>2. Define slots for each day<br>3. Verify slots created |
| **Expected Result** | Status: 201<br>Slots created for all days<br>Each slot has start_time, end_time |
| **Test Data** | Monday-Friday 14:00-18:00, Saturday 10:00-16:00 |

#### TC-AVL-002: Block Date Range

| Field | Value |
|-------|-------|
| Test ID | TC-AVL-002 |
| Module | Trainer Availability |
| Priority | High |
| Endpoint | POST /trainers/me/availability/block-dates |
| **Preconditions** | Availability slots exist |
| **Steps** | 1. Block dates 2026-06-20 to 2026-06-25<br>2. Check student sees no slots on those dates |
| **Expected Result** | Status: 201<br>Dates blocked<br>Blocked slots not visible to students |

#### TC-AVL-003: View Student-Visible Available Slots

| Field | Value |
|-------|-------|
| Test ID | TC-AVL-003 |
| Module | Trainer Availability |
| Priority | High |
| Endpoint | GET /trainers/{trainer_id}/available-slots?package_id={id} |
| **Preconditions** | Trainer has package with availability<br>Non-booked slots exist |
| **Steps** | 1. Call endpoint as student<br>2. Verify only available slots returned |
| **Expected Result** | Status: 200<br>Array of available slots<br>Booked slots excluded<br>Blocked dates excluded |

#### TC-AVL-004: Cannot Overlap Availability Slots

| Field | Value |
|-------|-------|
| Test ID | TC-AVL-004 |
| Module | Trainer Availability |
| Priority | High |
| Endpoint | POST /trainers/me/availability |
| **Preconditions** | Slot 14:00-15:00 exists |
| **Steps** | 1. Try to create overlapping slot 14:30-15:30<br>2. Check validation |
| **Expected Result** | Status: 422<br>Error: "slot overlaps with existing" |

---

### 4.4 Feed APIs

#### TC-FEED-001: Get Active Published Packages

| Field | Value |
|-------|-------|
| Test ID | TC-FEED-001 |
| Module | Feed |
| Priority | Critical |
| Endpoint | GET /feed/packages |
| **Preconditions** | Active packages exist |
| **Steps** | 1. Call feed endpoint<br>2. Verify only active shown<br>3. Check draft/rejected excluded |
| **Expected Result** | Status: 200<br>Only active packages<br>Each has trainer info, price, availability |

#### TC-FEED-002: Feed Hides Draft Packages

| Field | Value |
|-------|-------|
| Test ID | TC-FEED-002 |
| Module | Feed |
| Priority | High |
| Endpoint | GET /feed/packages |
| **Preconditions** | Draft package exists |
| **Steps** | 1. Get all packages as admin<br>2. Get feed as student<br>3. Compare |
| **Expected Result** | Draft not in feed<br>Draft visible in trainer's own packages |

#### TC-FEED-003: Filter by Category

| Field | Value |
|-------|-------|
| Test ID | TC-FEED-003 |
| Module | Feed |
| Priority | High |
| Endpoint | GET /feed/packages?category=HR%20Interview |
| **Preconditions** | Packages in multiple categories |
| **Steps** | 1. Filter by "HR Interview"<br>2. Verify only HR packages |
| **Expected Result** | Status: 200<br>Only HR Interview category<br>Pagination works |

#### TC-FEED-004: Filter by Country

| Field | Value |
|-------|-------|
| Test ID | TC-FEED-004 |
| Module | Feed |
| Priority | High |
| Endpoint | GET /feed/packages?country_code=BD |
| **Preconditions** | Trainers from different countries |
| **Steps** | 1. Filter by BD<br>2. Check trainer country |
| **Expected Result** | Status: 200<br>Only Bangladesh trainers<br>Country flag correct |

#### TC-FEED-005: Search Packages

| Field | Value |
|-------|-------|
| Test ID | TC-FEED-005 |
| Module | Feed |
| Priority | High |
| Endpoint | GET /feed/packages?search=interview |
| **Preconditions** | Packages with "interview" in title |
| **Steps** | 1. Search for "interview"<br>2. Check results |
| **Expected Result** | Status: 200<br>All matching titles<br>Partial matches OK |

---

### 4.5 Student Booking APIs

#### TC-BK-001: Create Booking with Valid Slot

| Field | Value |
|-------|-------|
| Test ID | TC-BK-001 |
| Module | Student Booking |
| Priority | Critical |
| Endpoint | POST /bookings |
| **Preconditions** | Student logged in<br>Package has available slot |
| **Steps** | 1. Send booking payload<br>2. Verify booking created<br>3. Check status = pending_payment |
| **Expected Result** | Status: 201<br>booking_id returned<br>status = pending_payment |
| **Test Data** | trainer_id: 1, package_id: 101, slot_id: 501 |

#### TC-BK-002: Cannot Book Unavailable Slot

| Field | Value |
|-------|-------|
| Test ID | TC-BK-002 |
| Module | Student Booking |
| Priority | High |
| Endpoint | POST /bookings |
| **Preconditions** | Slot already booked |
| **Steps** | 1. Try to book same slot<br>2. Check error |
| **Expected Result** | Status: 422<br>Error: "slot unavailable" |

#### TC-BK-003: Cannot Book Own Trainer's Package

| Field | Value |
|-------|-------|
| Test ID | TC-BK-003 |
| Module | Student Booking |
| Priority | High |
| Endpoint | POST /bookings |
| **Preconditions** | User is both student and trainer |
| **Steps** | 1. Try to book own package<br>2. Check validation |
| **Expected Result** | Status: 422<br>Error: "cannot book own package" |

---

### 4.6 Payment APIs

#### TC-PAY-001: Initiate Payment

| Field | Value |
|-------|-------|
| Test ID | TC-PAY-001 |
| Module | Payment |
| Priority | Critical |
| Endpoint | POST /payments/initiate |
| **Preconditions** | Booking exists with pending_payment status |
| **Steps** | 1. Send payment initiate request<br>2. Verify payment record created<br>3. Check payment_url returned |
| **Expected Result** | Status: 200<br>payment_url returned<br>payment.status = initiated |

#### TC-PAY-002: Payment Success Confirms Booking

| Field | Value |
|-------|-------|
| Test ID | TC-PAY-002 |
| Module | Payment |
| Priority | Critical |
| Endpoint | POST /payments/sslcommerz/callback |
| **Preconditions** | Payment initiated<br>SSLCommerz callback received |
| **Steps** | 1. Send success callback<br>2. Verify booking status changed<br>3. Check slot marked booked |
| **Expected Result** | payment.status = completed<br>booking.status = confirmed<br>interview.status = scheduled |

#### TC-PAY-003: Payment Failure Doesn't Confirm Booking

| Field | Value |
|-------|-------|
| Test ID | TC-PAY-003 |
| Module | Payment |
| Priority | Critical |
| Endpoint | POST /payments/sslcommerz/callback |
| **Preconditions** | Payment initiated |
| **Steps** | 1. Send failure callback<br>2. Check booking status |
| **Expected Result** | payment.status = failed<br>booking.status = pending_payment<br>Slot released |

#### TC-PAY-004: Duplicate Callback Prevention

| Field | Value |
|-------|-------|
| Test ID | TC-PAY-004 |
| Module | Payment |
| Priority | High |
| Endpoint | POST /payments/sslcommerz/callback |
| **Preconditions** | Payment already succeeded |
| **Steps** | 1. Send same callback twice<br>2. Check idempotency |
| **Expected Result** | First: 200<br>Second: 200 (idempotent)<br>No duplicate ledger entries |

---

### 4.7 Session Completion & Commission

#### TC-COM-001: Complete Session and Create Earning

| Field | Value |
|-------|-------|
| Test ID | TC-COM-001 |
| Module | Session & Commission |
| Priority | Critical |
| Endpoint | POST /interviews/{id}/complete |
| **Preconditions** | Interview scheduled<br>Session time passed |
| **Steps** | 1. Call complete endpoint as trainer<br>2. Verify earning ledger created<br>3. Check commission calculated |
| **Expected Result** | interview.status = completed<br>trainer_earning created<br>Commission 20% deducted |

#### TC-COM-002: Commission Calculation Correct

| Field | Value |
|-------|-------|
| Test ID | TC-COM-002 |
| Module | Commission |
| Priority | Critical |
| Formula | trainer_net = price - (price * 0.20) |
| **Preconditions** | Session completed |
| **Steps** | 1. Get session details<br>2. Calculate commission<br>3. Verify in ledger |
| **Expected Result** | For price=1000:<br>Commission=200<br>Trainer_net=800 |

#### TC-COM-003: Student Cannot Complete as Trainer

| Field | Value |
|-------|-------|
| Test ID | TC-COM-003 |
| Module | Authorization |
| Priority | Critical |
| Endpoint | POST /interviews/{id}/complete |
| **Preconditions** | Student auth token |
| **Steps** | 1. Try to complete interview<br>2. Check auth |
| **Expected Result** | Status: 403<br>Error: "Unauthorized" |

---

### 4.8 Trainer Wallet & Withdrawal APIs

#### TC-WLT-001: View Wallet with All Balances

| Field | Value |
|-------|-------|
| Test ID | TC-WLT-001 |
| Module | Wallet |
| Priority | High |
| Endpoint | GET /trainers/me/wallet |
| **Preconditions** | Trainer has sessions completed |
| **Steps** | 1. Call wallet endpoint<br>2. Verify all fields present |
| **Expected Result** | Status: 200<br>total_earned, available_balance, pending_balance, withdrawn, commission_total |

#### TC-WLT-002: Pending Earning Not Withdrawable

| Field | Value |
|-------|-------|
| Test ID | TC-WLT-002 |
| Module | Wallet |
| Priority | High |
| Endpoint | POST /trainers/me/withdrawals |
| **Preconditions** | Only pending balance exists |
| **Steps** | 1. Try to withdraw pending amount<br>2. Check validation |
| **Expected Result** | Status: 422<br>Error: "insufficient available balance" |

#### TC-WLT-003: Cannot Withdraw Without Payout Method

| Field | Value |
|-------|-------|
| Test ID | TC-WLT-003 |
| Module | Wallet |
| Priority | High |
| Endpoint | POST /trainers/me/withdrawals |
| **Preconditions** | Available balance exists<br>No payout method |
| **Steps** | 1. Try to withdraw<br>2. Check validation |
| **Expected Result** | Status: 422<br>Error: "no payout method" |

#### TC-WLT-004: Request Withdrawal

| Field | Value |
|-------|-------|
| Test ID | TC-WLT-004 |
| Module | Withdrawal |
| Priority | Critical |
| Endpoint | POST /trainers/me/withdrawals |
| **Preconditions** | Available balance >= minimum<br>Payout method exists |
| **Steps** | 1. Send withdrawal request<br>2. Verify withdrawal created<br>3. Check status = pending |
| **Expected Result** | Status: 201<br>withdrawal_id returned<br>status = pending<br>Amount deducted from available |

#### TC-WLT-005: Add Payout Method

| Field | Value |
|-------|-------|
| Test ID | TC-WLT-005 |
| Module | Payout Methods |
| Priority | High |
| Endpoint | POST /trainers/me/payout-methods |
| **Preconditions** | Authenticated as trainer |
| **Steps** | 1. Send payout method (bank/bkash/nagad)<br>2. Verify created |
| **Expected Result** | Status: 201<br>method_id returned<br>Can be used for withdrawal |

---

### 4.9 Admin APIs

#### TC-ADM-001: Approve Trainer

| Field | Value |
|-------|-------|
| Test ID | TC-ADM-001 |
| Module | Admin |
| Priority | Critical |
| Endpoint | POST /admin/trainers/{id}/approve |
| **Preconditions** | Trainer pending approval |
| **Steps** | 1. Call approve as admin<br>2. Check trainer status<br>3. Verify can now publish packages |
| **Expected Result** | Status: 200<br>trainer.status = approved<br>Packages can be published |

#### TC-ADM-002: Approve Package for Feed

| Field | Value |
|-------|-------|
| Test ID | TC-ADM-002 |
| Module | Admin Feed |
| Priority | High |
| Endpoint | PATCH /admin/feed/packages/{id}/approve |
| **Preconditions** | Package pending_review |
| **Steps** | 1. Call approve as admin<br>2. Check feed visibility |
| **Expected Result** | Status: 200<br>Package appears in feed<br>status = active |

#### TC-ADM-003: Reject Package with Reason

| Field | Value |
|-------|-------|
| Test ID | TC-ADM-003 |
| Module | Admin Feed |
| Priority | High |
| Endpoint | PATCH /admin/feed/packages/{id}/reject |
| **Preconditions** | Package pending_review |
| **Steps** | 1. Send reject with reason<br>2. Notify trainer |
| **Expected Result** | Status: 200<br>status = rejected<br>Reason stored<br>Email sent to trainer |

#### TC-ADM-004: Approve Withdrawal

| Field | Value |
|-------|-------|
| Test ID | TC-ADM-004 |
| Module | Admin Withdrawals |
| Priority | Critical |
| Endpoint | PATCH /admin/withdrawals/{id}/approve |
| **Preconditions** | Withdrawal pending |
| **Steps** | 1. Approve withdrawal<br>2. Status changes to approved |
| **Expected Result** | Status: 200<br>withdrawal.status = approved<br>Next step: mark-paid |

#### TC-ADM-005: Mark Withdrawal as Paid

| Field | Value |
|-------|-------|
| Test ID | TC-ADM-005 |
| Module | Admin Withdrawals |
| Priority | Critical |
| Endpoint | PATCH /admin/withdrawals/{id}/mark-paid |
| **Preconditions** | Withdrawal approved<br>Transaction reference required |
| **Steps** | 1. Send mark-paid with txn ref<br>2. Verify status change |
| **Expected Result** | Status: 200<br>withdrawal.status = paid<br>txn_reference stored |

---

## 5. Frontend UI Test Cases

### 5.1 Home Page (`/`)

| TC ID | Feature | Test | Expected |
|-------|---------|------|----------|
| TC-UI-HOME-001 | Navbar | Load page | Navbar visible with logo, menu items, Login/Register buttons |
| TC-UI-HOME-002 | Hero Section | Load page | Hero with title "Master Interview Skills with Experts", 2 CTAs visible |
| TC-UI-HOME-003 | Find Trainer CTA | Click button | Navigate to /feed |
| TC-UI-HOME-004 | Start Free CTA | Click button | Navigate to /auth/register |
| TC-UI-HOME-005 | Stats Animation | Page load | Counters animate from 0 to target (50000+, 850+, etc.) |
| TC-UI-HOME-006 | Interview Packages | Scroll | Section visible with 3 package cards |
| TC-UI-HOME-007 | Featured Trainers | Scroll | Section visible with 6 trainer cards, comes after packages |
| TC-UI-HOME-008 | Mobile Layout | Mobile view | Responsive, single column, buttons full width |

### 5.2 Feed Page (`/feed`)

| TC ID | Feature | Test | Expected |
|-------|---------|------|----------|
| TC-UI-FEED-001 | Page Load | Load /feed | Latest packages displayed in grid (3 columns desktop) |
| TC-UI-FEED-002 | Search | Type "HR" in search | Results filtered in real-time |
| TC-UI-FEED-003 | Category Filter | Select "Technical Interview" | Shows only technical packages |
| TC-UI-FEED-004 | Country Filter | Select "Bangladesh" | Shows only BD trainers with flag |
| TC-UI-FEED-005 | Package Card | View card | Shows trainer avatar, name, rating, price, duration, language, Book button |
| TC-UI-FEED-006 | Book Button - Guest | Click as guest | Redirect to /auth/login?redirect=/packages/{id} |
| TC-UI-FEED-007 | Book Button - Student | Click as student | Navigate to /booking/[packageId] |
| TC-UI-FEED-008 | Details Button | Click | Navigate to /packages/{id}/details |
| TC-UI-FEED-009 | Infinite Scroll | Scroll to bottom | Load more packages auto-loaded |
| TC-UI-FEED-010 | Disabled Book | No slots | Book button disabled with tooltip "No available slots" |

### 5.3 Trainer Packages Page (`/trainer/packages`)

| TC ID | Feature | Test | Expected |
|-------|---------|------|----------|
| TC-UI-PKG-001 | Page Load | Load as trainer | Shows sidebar, package list, summary stats |
| TC-UI-PKG-002 | Summary Cards | View stats | Shows: Active (X), Draft (Y), Total Bookings, Revenue |
| TC-UI-PKG-003 | Create Button | Click | Navigate to /trainer/packages/create |
| TC-UI-PKG-004 | Edit Button | Click | Navigate to /trainer/packages/{id}/edit |
| TC-UI-PKG-005 | Duplicate Action | Click | Opens confirmation, duplicates package |
| TC-UI-PKG-006 | Hide Action | Click | Hides package, removes from feed, shows status change |
| TC-UI-PKG-007 | Deactivate Action | Click | Deactivates, shows confirmation, status updates |
| TC-UI-PKG-008 | Empty State | No packages | Shows "Create your first package" CTA |

### 5.4 Create Package Page (`/trainer/packages/create`)

| TC ID | Feature | Test | Expected |
|-------|---------|------|----------|
| TC-UI-CP-001 | Step 1 | Load page | Shows "Basic Info" form with title, category, target level |
| TC-UI-CP-002 | Step 1 Validation | Leave title blank, click Next | Error: "Title is required" |
| TC-UI-CP-003 | Step 2 Duration | Click 45 min button | Button highlights, state updates |
| TC-UI-CP-004 | Step 3 Commission | Enter price 1000 | Shows "Commission 20% = ৳200, You receive ৳800" |
| TC-UI-CP-005 | Step 4 Documents | Check "Resume" | Form state updates, shows checkmark |
| TC-UI-CP-006 | Step 5 Availability | Select "Use All Available Slots" | Shows preview of trainer's slots |
| TC-UI-CP-007 | Step 6 Review | View summary | Shows all data collected across 6 steps |
| TC-UI-CP-008 | Save Draft | Click button | Shows "Saving..." then success message, redirect to /trainer/packages |
| TC-UI-CP-009 | Submit for Review | Click button | Shows "Submitting..." then success, redirect, status shows pending_review |

### 5.5 Package Detail Page (`/packages/{id}`)

| TC ID | Feature | Test | Expected |
|-------|---------|------|----------|
| TC-UI-DET-001 | Page Load | Load /packages/1 | Shows title, description, duration, price in sidebar |
| TC-UI-DET-002 | Trainer Info | Scroll down | Shows trainer avatar, name, bio, experience, rating, student count |
| TC-UI-DET-003 | Book Now Button | Click as student | Navigate to /booking/[packageId] |
| TC-UI-DET-004 | Book Now Button | Click as guest | Redirect to login |
| TC-UI-DET-005 | Sticky Sidebar | Scroll | Price card remains visible at top-right |
| TC-UI-DET-006 | Back Button | Click | Navigate back to /packages or /feed |

### 5.6 Mobile Responsiveness

| TC ID | Device | Test | Expected |
|-------|--------|------|----------|
| TC-UI-MOB-001 | iPhone 12 (390x844) | Load home | No horizontal scroll, readable text (>14px) |
| TC-UI-MOB-002 | iPhone 12 | Navigate feed | 1 column layout, buttons full width |
| TC-UI-MOB-003 | iPad (768x1024) | Load packages | 2 column layout for cards |
| TC-UI-MOB-004 | All | Touch targets | Buttons >=48x48px, spacing >=8px |

---

## 6. End-to-End User Journeys

### Journey 1: Complete Booking Flow

**Duration**: ~10 minutes | **Priority**: Critical

```
Step 1: Student browses feed
  ✓ Load /feed
  ✓ Filter by "HR Interview" category
  ✓ See trainer "Arjun Kumar" with package "HR Mock Interview"
  ✓ Price visible: ৳800
  ✓ Rating: 4.9 ⭐

Step 2: Student views package details
  ✓ Click "View Details"
  ✓ Load /packages/101
  ✓ See full description, duration (45 mins), language (Bangla+English)
  ✓ Available slots visible

Step 3: Student initiates booking
  ✓ Click "Book Now"
  ✓ Redirects to /booking/101 (if logged in)
  ✓ Select available slot from calendar
  ✓ Confirm booking details

Step 4: Payment
  ✓ Redirect to payment gateway
  ✓ Complete payment (SSLCommerz sandbox)
  ✓ Return to success page
  ✓ Booking status = confirmed

Step 5: Verification
  ✓ Check student dashboard shows confirmed booking
  ✓ Check trainer's bookings list updated
  ✓ Verify email notifications sent to both
```

**Expected Outcomes**:
- Payment processed: ৳800
- Trainer receives: ৳640 (after 20% commission)
- Booking status: confirmed
- Interview scheduled
- Both users receive confirmation emails

---

### Journey 2: Trainer Creates and Publishes Package

**Duration**: ~15 minutes | **Priority**: Critical

```
Step 1: Trainer login and navigate
  ✓ Login to /trainer/dashboard
  ✓ Click "Create Package" or navigate to /trainer/packages/create

Step 2: Fill package details (Step 1-3)
  ✓ Title: "Backend Technical Interview - Microservices"
  ✓ Category: "Technical Interview"
  ✓ Target Level: "Senior"
  ✓ Duration: 60 minutes
  ✓ Price: BDT 2000
  ✓ Discount: BDT 1800

Step 3: Configure session (Step 4-5)
  ✓ Language: English
  ✓ Difficulty: Advanced
  ✓ Includes: CV Review, Written Feedback
  ✓ Required Documents: Resume, GitHub, LinkedIn

Step 4: Set availability (Step 5)
  ✓ Select "Use All Available Slots"
  ✓ Trainer already has weekly schedule: Mon-Fri 14:00-18:00

Step 5: Review (Step 6)
  ✓ Commission preview shows: 20% = ৳400, Trainer receives ৳1600
  ✓ All fields reviewed

Step 6: Submit for Review
  ✓ Click "Submit for Review"
  ✓ Success message: "Package submitted for review"
  ✓ Redirect to /trainer/packages
  ✓ Package status: pending_review

Step 7: Admin approves (separate admin flow)
  ✓ Admin visits /admin/feed/packages
  ✓ Sees pending package
  ✓ Clicks "Approve"
  ✓ Status changes to "active"

Step 8: Package appears on feed
  ✓ Student visits /feed
  ✓ Filters or searches for "Microservices"
  ✓ Package visible with trainer info
  ✓ "Book Now" button available
```

**Expected Outcomes**:
- Package published and visible on feed
- Available for 60 days from creation
- Students can book available slots
- Trainer sees in /trainer/packages with status "active"

---

### Journey 3: Trainer Requests Withdrawal

**Duration**: ~5 minutes | **Priority**: High

```
Step 1: Sessions completed
  ✓ Multiple students booked and completed sessions
  ✓ Commission deducted, trainer earning calculated
  ✓ Earnings: 5 sessions × ৳1600 = ৳8000

Step 2: View wallet
  ✓ Navigate to /trainer/earnings
  ✓ See:
    - Total Earned: ৳8000
    - Pending Balance: ৳5000 (refund window)
    - Available Balance: ৳3000
    - Platform Commission Paid: ৳2000

Step 3: Add payout method
  ✓ Click "Add Payout Method"
  ✓ Select "Bkash"
  ✓ Enter number: 01700000000
  ✓ Save method

Step 4: Request withdrawal
  ✓ Click "Withdraw"
  ✓ Enter amount: ৳3000 (available balance)
  ✓ Confirm withdrawal
  ✓ Status: pending approval

Step 5: Admin approves (admin flow)
  ✓ Admin visits /admin/withdrawals/pending
  ✓ Sees trainer withdrawal request
  ✓ Click "Approve"
  ✓ Status: approved

Step 6: Admin marks as paid
  ✓ Admin enters transaction reference: TXN-2026-06-15-001
  ✓ Click "Mark as Paid"
  ✓ Withdrawal complete

Step 7: Trainer verifies
  ✓ Check wallet: Available Balance reset to ৳0
  ✓ Withdrawn total: ৳3000
  ✓ Confirmation email received
```

**Expected Outcomes**:
- Withdrawal processed successfully
- Amount transferred to payout method
- Wallet balances updated
- Transaction recorded for audit

---

## 7. Security & Permission Tests

### Authentication & Authorization

| TC ID | Test | Precondition | Steps | Expected |
|-------|------|--------------|-------|----------|
| TC-SEC-001 | Student cannot access trainer APIs | Logged in as student | Call GET /trainers/me/packages | 403 Forbidden |
| TC-SEC-002 | Trainer cannot access admin APIs | Logged in as trainer | Call GET /admin/users | 403 Forbidden |
| TC-SEC-003 | Unauthenticated access blocked | No token | Call GET /trainers/me/packages | 401 Unauthorized |
| TC-SEC-004 | Cannot use another user's token | Student 1 token | Call on Student 2's data | 403 Forbidden |
| TC-SEC-005 | Student cannot edit trainer's package | Student token, trainer package ID | PATCH /trainers/me/packages/5 | 403 Forbidden |
| TC-SEC-006 | Trainer cannot complete own interview | Trainer token | POST /interviews/123/complete | 422 (trainer is not student) |
| TC-SEC-007 | Trainer cannot book own package | Trainer's own package | POST /bookings | 422 Error |

### Data Access Control

| TC ID | Test | Precondition | Steps | Expected |
|-------|------|--------------|-------|----------|
| TC-SEC-008 | Student A cannot see Student B's bookings | Both students logged in | Student A calls GET /bookings | Only Student A's bookings |
| TC-SEC-009 | Trainer A cannot see Trainer B's earnings | Two trainers | Trainer A calls GET /trainers/me/earnings | Only Trainer A's data |
| TC-SEC-010 | Cannot access withdrawal of another trainer | Trainer token | PATCH /trainers/me/withdrawals/99/approve | 403 Forbidden |

### Admin-Only Operations

| TC ID | Test | Precondition | Steps | Expected |
|-------|------|--------------|-------|----------|
| TC-SEC-011 | Non-admin cannot approve trainer | Trainer token | POST /admin/trainers/2/approve | 403 Forbidden |
| TC-SEC-012 | Non-admin cannot approve withdrawal | Student token | PATCH /admin/withdrawals/1/approve | 403 Forbidden |
| TC-SEC-013 | Non-admin cannot change commission rate | Trainer token | POST /admin/commission-settings | 403 Forbidden |

### Input Validation & Injection

| TC ID | Test | Input | Expected |
|-------|------|-------|----------|
| TC-SEC-014 | SQL injection in search | '; DROP TABLE users; -- | No error, safe query |
| TC-SEC-015 | XSS in package title | <script>alert('xss')</script> | Escaped, not executed |
| TC-SEC-016 | Email validation | invalid@email | 422 Invalid email format |
| TC-SEC-017 | Price validation | price: "abc" | 422 Must be number |

---

## 8. Payment & Commission Tests

### Payment Gateway Integration

| TC ID | Test | Scenario | Expected |
|-------|------|----------|----------|
| TC-PAY-101 | SSLCommerz redirect | Create booking and initiate payment | Redirects to SSLCommerz checkout |
| TC-PAY-102 | Bkash simulation | Select Bkash payment | Works in sandbox |
| TC-PAY-103 | Nagad simulation | Select Nagad payment | Works in sandbox |
| TC-PAY-104 | Callback signature validation | Invalid signature in callback | Rejected, payment marked failed |
| TC-PAY-105 | Amount verification | Callback amount ≠ booking amount | Rejected |
| TC-PAY-106 | Timeout handling | Payment initiated, 30 mins no response | Booking slot released for rebooking |

### Commission Calculation Tests

| TC ID | Test Data | Calculation | Expected |
|-------|-----------|-------------|----------|
| TC-COM-101 | Price: 1000 | 1000 * 20% = 200 | Commission: 200, Trainer: 800 ✓ |
| TC-COM-102 | Price: 500 | 500 * 20% = 100 | Commission: 100, Trainer: 400 ✓ |
| TC-COM-103 | Price: 2500 | 2500 * 20% = 500 | Commission: 500, Trainer: 2000 ✓ |
| TC-COM-104 | Decimal price: 1234.56 | Proper rounding | Commission calculated correctly |
| TC-COM-105 | Commission rule change | Update rate 20% → 25% | Only new sessions use 25%, old sessions locked at 20% |

### Wallet & Balance Tests

| TC ID | Test | Precondition | Expected |
|-------|------|--------------|----------|
| TC-WAL-101 | Pending balance calculation | Session completed, refund window 7 days | Amount locked in pending, not withdrawable |
| TC-WAL-102 | Available balance after refund window | 7+ days passed | Amount moves from pending to available |
| TC-WAL-103 | Multiple sessions | 10 sessions ×  ৳800 | Total earned = ৳8000 correctly summed |
| TC-WAL-104 | Commission total shown | 10 sessions, 20% commission | Commission total = ৳1600 |
| TC-WAL-105 | Withdrawn amount deducted | Withdraw ৳3000 | Available balance -= ৳3000 |

---

## 9. Withdrawal & Payout Tests

### Payout Method Management

| TC ID | Test | Steps | Expected |
|-------|------|-------|----------|
| TC-PAYOUT-001 | Add Bkash method | POST /trainers/me/payout-methods<br>type: bkash<br>number: 01700000000 | Method created, can be used |
| TC-PAYOUT-002 | Add Bank method | type: bank<br>account_holder: Name<br>account_number: 1234567890<br>bank_name: Dhaka Bank | Method created |
| TC-PAYOUT-003 | Edit payout method | Update number for existing method | Changed successfully |
| TC-PAYOUT-004 | Delete payout method | DELETE /trainers/me/payout-methods/1 | Deleted, cannot use for withdrawal |
| TC-PAYOUT-005 | Cannot delete if pending withdrawal | Method has pending withdrawal | 422 Error |

### Withdrawal Request Flow

| TC ID | Test | Precondition | Steps | Expected |
|-------|------|--------------|-------|----------|
| TC-WITHDRAWAL-001 | Request withdrawal | Available balance ৳5000, min withdrawal ৳500 | Withdrawal created, status = pending | ✓ |
| TC-WITHDRAWAL-002 | Below minimum | Available balance ৳300 | POST /trainers/me/withdrawals<br>amount: 300 | 422 Error: "Below minimum" |
| TC-WITHDRAWAL-003 | Above available | Available balance ৳3000 | Try to withdraw ৳5000 | 422 Error: "Insufficient balance" |
| TC-WITHDRAWAL-004 | Without payout method | No payout method set | Try to withdraw | 422 Error: "No payout method" |
| TC-WITHDRAWAL-005 | Suspended trainer | Account suspended | Try to withdraw | 403 Error: "Account suspended" |

### Admin Withdrawal Approval

| TC ID | Test | Precondition | Steps | Expected |
|-------|------|--------------|-------|----------|
| TC-ADM-W-001 | Approve withdrawal | Status = pending | Admin clicks "Approve" | Status = approved ✓ |
| TC-ADM-W-002 | Reject withdrawal | Status = pending | Admin clicks "Reject"<br>Enter reason | Status = rejected, amount returned to available ✓ |
| TC-ADM-W-003 | Mark as paid | Status = approved | Admin clicks "Mark Paid"<br>Enter TXN ref | Status = paid, TXN stored ✓ |
| TC-ADM-W-004 | Paid without TXN ref | Status = approved | Mark paid without transaction ref | 422 Error |
| TC-ADM-W-005 | Withdrawal history | View /trainer/earnings | Shows all past withdrawals with dates, amounts, status | ✓ |

---

## 10. Automation Test Plan

### Cypress Test Suite Structure

```
cypress/
├── e2e/
│   ├── auth.spec.cy.ts
│   ├── feed.spec.cy.ts
│   ├── package-creation.spec.cy.ts
│   ├── booking-payment.spec.cy.ts
│   ├── withdrawal.spec.cy.ts
│   └── admin.spec.cy.ts
├── support/
│   ├── commands.ts (login, create package, etc.)
│   ├── fixtures/ (test data)
│   └── e2e.ts
└── cypress.config.ts
```

### Sample Test: Complete Booking

```typescript
describe('Complete Booking Flow', () => {
  beforeEach(() => {
    cy.login('student1@test.com', 'Test@1234');
  });

  it('should book package and complete payment', () => {
    // Browse feed
    cy.visit('/feed');
    cy.contains('HR Mock Interview').click();
    
    // View details
    cy.url().should('include', '/packages');
    cy.get('[data-testid="book-button"]').click();
    
    // Booking page
    cy.url().should('include', '/booking');
    cy.get('[data-testid="select-slot"]').first().click();
    cy.get('[data-testid="confirm-booking"]').click();
    
    // Payment
    cy.get('iframe').then(($iframe) => {
      cy.wrap($iframe.contents().find('button:contains("Pay")'))
        .click();
    });
    
    // Success
    cy.url().should('include', '/payment/success');
    cy.contains('Booking Confirmed').should('be.visible');
  });
});
```

### Playwright Test Plan

```
tests/
├── auth.spec.ts
├── trainer-packages.spec.ts
├── student-booking.spec.ts
├── withdrawal.spec.ts
└── admin-approval.spec.ts
```

### Laravel Feature Tests

```php
// tests/Feature/TrainerPackageTest.php
class TrainerPackageTest extends TestCase {
  
  public function test_trainer_can_create_package()
  {
    $trainer = User::factory()->trainer()->create();
    $response = $this->actingAs($trainer)
      ->postJson('/api/trainers/me/packages', [
        'title' => 'Test Package',
        'price' => 1000,
        // ... other fields
      ]);
    
    $response->assertStatus(201);
    $this->assertDatabaseHas('packages', [
      'title' => 'Test Package'
    ]);
  }

  public function test_student_cannot_create_package()
  {
    $student = User::factory()->student()->create();
    $response = $this->actingAs($student)
      ->postJson('/api/trainers/me/packages', []);
    
    $response->assertStatus(403);
  }
}
```

---

## 11. Manual QA Checklist

### Pre-Release Checklist (1 week before release)

**Backend (API & Database)**

```
□ All Laravel tests pass (100% pass rate)
□ Database migrations clean (no hanging transactions)
□ API response times < 500ms (except payment init)
□ No console errors in logs
□ Email notifications working
□ Redis cache functioning
□ File uploads working (CV, avatar)
□ Payment gateway sandbox accessible
□ Database backups scheduled
□ Security headers set (CORS, CSP, etc.)
```

**Frontend (Next.js)**

```
□ npm run build succeeds with no warnings
□ npm run test passes all tests
□ No TypeScript errors (strict mode)
□ Lighthouse score > 90 (desktop)
□ Mobile score > 85
□ Images optimized and lazy-loaded
□ Error boundaries work (show error pages)
□ Loading states visible for async operations
□ Toast notifications working
□ Form validation visible to user
```

**Security**

```
□ SQL injection tests pass
□ XSS protection verified
□ CSRF tokens on all forms
□ Rate limiting configured
□ JWT expiration set
□ Passwords hashed with bcrypt
□ Sensitive data not in logs
□ SSL/TLS enabled
□ Secrets not in repo (.env.example present)
```

**Critical User Flows**

```
□ Student registration → login → feed → book → payment → confirmation
□ Trainer registration → create package → availability → list on feed
□ Student books → payment gateway → webhook callback → booking confirmed
□ Session completed → commission calculated → wallet updated
□ Trainer adds payout method → requests withdrawal → admin approves → marked paid
□ Admin approves trainer → admin approves package → appears on feed
```

**Data Integrity**

```
□ No orphaned records (booking without package, etc.)
□ Commission always 20% (verify with SQL query)
□ Balances reconcile (available + pending + withdrawn = total earned)
□ No duplicate commission entries
□ Slot availability reduces on booking
□ Blocked dates prevent booking
```

**Performance**

```
□ Feed page loads < 2s with 100 packages
□ Package detail page < 1s
□ Trainer packages list < 1s
□ Wallet calculation < 500ms
□ Payment initiation < 1s
□ Database queries optimized (no N+1)
```

**Monitoring & Alerts**

```
□ Error tracking (Sentry) configured
□ Application monitoring (New Relic) active
□ Payment failure alerts set
□ Database size alerts set
□ API latency alerts set
□ Disk space alerts configured
```

---

## 12. Bug Report Template

### Standard Bug Report Format

```markdown
## Bug Report

**Title**: [Brief, descriptive title]

### Severity
- [ ] Critical (blocks core flow, data loss)
- [ ] High (feature broken, workaround exists)
- [ ] Medium (minor feature issue)
- [ ] Low (cosmetic, typo)

### Affected Version
- App Version: [e.g., v1.2.0]
- Browser: [e.g., Chrome 120]
- Device: [Desktop/Mobile]

### Prerequisites
- User Role: [Student/Trainer/Admin]
- State: [e.g., "Has pending booking", "Package in draft"]

### Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

### Actual Result
[What happens]

### Expected Result
[What should happen]

### Screenshots/Video
[Attach visual evidence]

### Console Errors
```
[Paste any JavaScript errors from console]
```

### API Errors
```
[Paste HTTP responses if API related]
```

### Environment
- Backend URL: [Development/Staging]
- Test User: [student1@test.com]
- Reproducibility: [Always/Sometimes/Rarely]

### Additional Notes
[Any other relevant info]
```

### Example Bug Report

```markdown
## Bug: Book Button Disabled on All Slots Available

**Severity**: High

**Steps to Reproduce**:
1. Login as student1@test.com
2. Navigate to /packages/101 (HR Interview - Arjun Kumar)
3. Trainer has 5 available slots for today
4. View "Book Now" button

**Actual Result**:
Button is disabled with tooltip "No available slots"

**Expected Result**:
Button should be enabled, allow booking

**Console Error**:
None

**Impact**:
Students cannot book available packages, affecting revenue
```

---

## 13. Release Readiness Checklist

### 48 Hours Before Release

```
[Day -2]

Code Quality:
  □ Code review complete
  □ All PR comments resolved
  □ No commented-out code
  □ No TODO comments without ticket
  □ Linter passing (ESLint, phpstan)

Testing:
  □ All automated tests passing
  □ Critical flows manually tested
  □ Regression test suite run
  □ No known bugs in "Done" column
  □ Performance baselines met

Documentation:
  □ API documentation updated
  □ Deployment guide prepared
  □ Release notes drafted
  □ Known issues listed
  □ Rollback plan written
```

### 24 Hours Before Release

```
[Day -1]

Final Checks:
  □ Database backup created
  □ Staging environment fresh deploy
  □ All E2E tests pass on staging
  □ Payment gateway sandbox tested
  □ Email delivery tested
  □ Admin approvals tested

Team Coordination:
  □ Deployment window scheduled
  □ On-call rotation assigned
  □ Slack channel notification posted
  □ Status page created
  □ Customer support briefed

Preparation:
  □ Deployment scripts reviewed
  □ Database migration verified
  □ Cache flush strategy defined
  □ CDN cache purge prepared
  □ Monitoring dashboards open
```

### Release Day (0 Hour)

```
[Deployment Day]

Pre-Deployment:
  □ Final production backup
  □ Health check baseline recorded
  □ Team in war room (Slack/Zoom)
  □ Monitoring dashboards live
  □ Runbook accessible

Deployment:
  □ Deploy backend API
  □ Run database migrations
  □ Verify API health checks pass
  □ Deploy frontend
  □ Clear CDN cache
  □ Verify CSS/JS assets load

Post-Deployment:
  □ Smoke test all critical flows (1st 10 mins)
  □ Check error rates (no spike)
  □ Monitor API latency (< 500ms)
  □ Check database performance
  □ Monitor user activity
  □ Check payment processing
  □ Verify email delivery

First Hour:
  □ Stand-by team monitoring
  □ No issues = announce on status page
  □ Issues = execute rollback or hotfix
  □ Continue monitoring for 2 hours
```

### Post-Release (Day +1)

```
[After 24 Hours Stable]

Analysis:
  □ Review error logs
  □ Check performance metrics
  □ Analyze user feedback
  □ Document any issues
  □ Gather team feedback

Communication:
  □ Release blog post published
  □ Changelog updated
  □ Customer email sent (if major feature)
  □ Team standup debrief
```

---

## Priority Testing Order

### Week 1 (Critical Path)

1. **Auth APIs** (4 hours)
   - Register, Login, Token validation
   - Role-based access control

2. **Trainer Package CRUD** (6 hours)
   - Create, Read, Update, Delete
   - Validation and error handling

3. **Package List & Feed** (4 hours)
   - Frontend display
   - Filters and search

### Week 2

4. **Trainer Availability** (6 hours)
   - Create slots
   - Block dates
   - Student-visible slots

5. **Student Booking** (6 hours)
   - Create booking
   - Slot selection
   - Availability validation

### Week 3

6. **Payment Integration** (8 hours)
   - Payment initiation
   - Callback handling
   - Booking confirmation

7. **Commission & Wallet** (6 hours)
   - Calculation accuracy
   - Balance updates
   - Ledger entries

### Week 4

8. **Withdrawal & Payout** (6 hours)
   - Request submission
   - Admin approval
   - Payment processing

9. **Admin Operations** (6 hours)
   - Trainer approval
   - Package approval
   - Withdrawal management

---

## Appendix: Test Environment Credentials

### API Test Base URL
```
Development: http://localhost:8000/api
Staging: https://api-staging.nexthire.local/api
```

### Test User Credentials
```
Student: student1@test.com / Test@1234
Trainer: trainer1@test.com / Test@1234
Admin: admin@test.com / Test@1234
```

### Test Payment Accounts (Sandbox)
```
SSLCommerz:
  Store ID: test
  API Key: test

Bkash:
  App Key: test
  App Secret: test

Nagad:
  Merchant ID: test
  API Key: test
```

### Test Package IDs
```
ID 101: HR Interview (Arjun Kumar)
ID 102: Backend Interview (Arjun Kumar)
ID 103: Frontend Interview (Priya Sharma)
```

---

**Document Version**: 1.0
**Last Updated**: 2026-06-15
**Prepared by**: QA Lead
**Next Review**: Before each release
