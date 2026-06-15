# AI Testing Prompt for NextHire Backend + Frontend

You are a senior QA engineer, full-stack tester, Laravel API tester, and Next.js frontend tester.

I am building the **NextHire** project.

NextHire is a mock interview and career development platform with these main roles:

* Student
* Trainer
* Company
* Admin

The current focus is testing the **Student + Trainer + Admin flow**, especially:

* Trainer profile
* Trainer packages
* Availability calendar
* Feed page
* Student booking
* Payment flow
* Platform commission
* Trainer wallet
* Trainer withdrawal
* Admin approval and management

Your job is to help me test both backend and frontend.

---

# Project Stack

Backend:

```text
Laravel REST API
PostgreSQL
Redis
JWT / Bearer Token Authentication
Role-based access control
```

Frontend:

```text
Next.js
React
Tailwind CSS
Role-based pages
```

Frontend routes include:

```text
/
 /feed
 /trainers
 /packages
 /leaderboard
 /student
 /trainer
 /trainer/packages
 /trainer/availability
 /trainer/sessions
 /trainer/earnings
 /admin
```

---

# Testing Goal

Please test the project like a real QA engineer.

I want you to check:

```text
1. Backend API correctness
2. Frontend UI behavior
3. Student booking flow
4. Trainer package flow
5. Trainer availability flow
6. Payment and commission flow
7. Trainer wallet and withdrawal flow
8. Admin approval and management flow
9. Error handling
10. Role permission security
11. Empty states
12. Mobile responsiveness
```

---

# Important Business Flow

The most important system flow is:

```text
1. Trainer creates package.
2. Trainer adds availability.
3. Admin approves trainer/package if required.
4. Package appears on Feed.
5. Student chooses package.
6. Student selects available slot.
7. Student completes payment.
8. Platform holds the full money.
9. Trainer completes session.
10. Platform cuts commission.
11. Trainer net earning goes to pending balance.
12. After refund window, trainer earning becomes available.
13. Trainer requests withdrawal.
14. Admin approves withdrawal.
15. Admin marks payout as paid.
```

Example:

```text
Package Price: BDT 1000
Platform Commission: 20%
Platform Commission Amount: BDT 200
Trainer Net Earning: BDT 800
```

---

# Backend API Testing Scope

Test these API groups.

## Auth APIs

```http
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
POST /auth/verify-email
POST /auth/forgot-password
POST /auth/reset-password
```

Check:

```text
- Register student
- Register trainer
- Register admin if available
- Login with valid credentials
- Login with wrong password
- Access protected route without token
- Access trainer route with student token
- Access admin route with trainer token
```

---

## Trainer Package APIs

```http
GET     /trainers/me/packages
POST    /trainers/me/packages
GET     /trainers/me/packages/{id}
PUT     /trainers/me/packages/{id}
DELETE  /trainers/me/packages/{id}
PATCH   /trainers/me/packages/{id}/publish
PATCH   /trainers/me/packages/{id}/hide
PATCH   /trainers/me/packages/{id}/duplicate
PATCH   /trainers/me/packages/{id}/deactivate
```

Test cases:

```text
- Trainer can create package as draft.
- Trainer can update package.
- Trainer can publish package.
- Trainer can duplicate package.
- Trainer can hide package.
- Trainer can deactivate package.
- Trainer cannot create package without required fields.
- Trainer cannot set negative price.
- Discount price cannot be greater than regular price.
- Duration must be valid: 30, 45, or 60 minutes.
- Student cannot access trainer package management APIs.
- Unauthenticated user cannot access package management APIs.
```

Sample create package request:

```json
{
  "title": "HR Mock Interview for Fresh Graduates",
  "category": "HR Interview",
  "target_level": "Fresher",
  "package_type": "1:1 Live Session",
  "short_description": "45-minute structured HR interview with feedback",
  "description": "Student will receive realistic HR interview practice, communication feedback, confidence score, and improvement tips.",
  "tags": ["HR", "Fresher", "Communication"],
  "duration_minutes": 45,
  "session_mode": "Video Interview",
  "language": "Bangla + English",
  "difficulty": "beginner",
  "session_count": 1,
  "includes_cv_review": false,
  "includes_written_feedback": true,
  "price": 800,
  "discount_price": 650,
  "currency": "BDT",
  "availability_scope": "all_slots",
  "status": "draft"
}
```

---

## Trainer Availability APIs

```http
GET     /trainers/me/availability
POST    /trainers/me/availability
PUT     /trainers/me/availability/{id}
DELETE  /trainers/me/availability/{id}

GET     /trainers/me/availability/calendar
GET     /trainers/me/availability/weekly-schedule
POST    /trainers/me/availability/weekly-schedule
PUT     /trainers/me/availability/weekly-schedule/{id}

POST    /trainers/me/availability/block-dates
GET     /trainers/me/availability/block-dates
DELETE  /trainers/me/availability/block-dates/{id}

GET     /trainers/{trainer_id}/availability
GET     /trainers/{trainer_id}/available-slots?package_id={package_id}
```

Test cases:

```text
- Trainer can create availability.
- Trainer can create weekly schedule.
- Trainer can block date.
- Student can see only available slots.
- Student cannot see blocked slots.
- Student cannot book expired slot.
- Student cannot book already booked slot.
- System prevents overlapping slots.
- Reserved slot expires if payment is not completed.
```

---

## Feed APIs

```http
GET /feed/packages
GET /feed/packages/{id}
GET /feed/packages?country_code=BD
GET /feed/packages?category=HR Interview
GET /feed/packages?sort=latest
```

Test cases:

```text
- Feed shows only active published packages.
- Feed hides draft packages.
- Feed hides rejected packages.
- Feed hides suspended trainer packages.
- Feed shows trainer country flag and country name.
- Feed supports search.
- Feed supports category filter.
- Feed supports country filter.
- Feed supports pagination or infinite scroll.
- Book button disabled if no available slots.
```

Expected package card fields:

```text
- Trainer avatar or initial
- Trainer name
- Trainer professional title
- Country flag
- Country name
- Rating
- Sessions completed
- Package category
- Target level
- Posted time
- Package title
- Description
- Duration
- Language
- Available time
- Price
- Details button
- Book button
```

---

## Student Booking APIs

```http
POST /bookings
GET  /bookings/{id}
POST /bookings/{id}/cancel
GET  /interviews/{id}
POST /interviews/{id}/join
```

Test cases:

```text
- Student can create booking with valid package and slot.
- Booking status starts as pending_payment.
- Student cannot book unavailable slot.
- Student cannot book same slot twice.
- Guest user cannot create booking.
- Trainer cannot book own package.
- Booking returns correct amount and currency.
```

Sample request:

```json
{
  "trainer_id": 15,
  "package_id": 22,
  "slot_id": 501
}
```

---

## Payment APIs

```http
POST /payments/initiate
POST /payments/sslcommerz/callback
POST /payments/bkash/callback
POST /payments/nagad/callback
GET  /payments/history
GET  /payments/{id}/invoice
```

Test cases:

```text
- Student can initiate payment.
- Payment success confirms booking.
- Payment failure does not confirm booking.
- Payment callback verifies amount.
- Payment callback verifies gateway signature.
- Duplicate callback does not duplicate earnings.
- Payment history shows correct status.
- Invoice can be downloaded.
```

Expected after payment success:

```text
payment.status = completed
booking.status = confirmed
interview.status = scheduled
slot.status = booked
platform_holding_ledger.status = platform_held
```

---

## Session Completion + Commission APIs

```http
POST /interviews/{id}/complete
POST /trainers/me/evaluations/{session_id}
```

Test cases:

```text
- Trainer can complete session.
- Student cannot complete session as trainer.
- Session completion creates trainer earning ledger.
- Platform commission is calculated correctly.
- Trainer net amount is correct.
- Commission is locked for that transaction.
- Old transactions do not change if admin updates commission later.
```

Expected calculation:

```text
gross_amount = package price
commission_amount = gross_amount * commission percentage
trainer_net_amount = gross_amount - commission_amount
```

---

## Trainer Wallet + Withdrawal APIs

```http
GET    /trainers/me/wallet
GET    /trainers/me/earnings
GET    /trainers/me/withdrawals
POST   /trainers/me/withdrawals
GET    /trainers/me/payout-methods
POST   /trainers/me/payout-methods
PUT    /trainers/me/payout-methods/{id}
DELETE /trainers/me/payout-methods/{id}
```

Test cases:

```text
- Trainer can view wallet.
- Pending earning is not withdrawable.
- Available earning is withdrawable.
- Trainer cannot withdraw below minimum amount.
- Trainer cannot withdraw more than available balance.
- Trainer cannot withdraw without payout method.
- Trainer cannot create multiple pending withdrawals for same payout cycle.
- Suspended trainer cannot withdraw.
```

Expected wallet fields:

```text
total_earned
available_balance
pending_balance
withdrawn_amount
platform_commission_total
minimum_withdraw_amount
withdrawal_allowed
```

---

## Admin APIs

```http
GET    /admin/dashboard
GET    /admin/users
PUT    /admin/users/{id}/status

GET    /admin/trainers/pending
POST   /admin/trainers/{id}/approve

GET    /admin/feed/packages
PATCH  /admin/feed/packages/{id}/approve
PATCH  /admin/feed/packages/{id}/reject
PATCH  /admin/feed/packages/{id}/hide
PATCH  /admin/feed/packages/{id}/feature

GET    /admin/commission-settings
POST   /admin/commission-settings
PUT    /admin/commission-settings/{id}
PATCH  /admin/commission-settings/{id}/activate
PATCH  /admin/commission-settings/{id}/deactivate

GET    /admin/withdrawals/pending
PATCH  /admin/withdrawals/{id}/approve
PATCH  /admin/withdrawals/{id}/reject
PATCH  /admin/withdrawals/{id}/mark-paid
```

Test cases:

```text
- Admin can approve trainer.
- Admin can approve package for feed.
- Admin can reject package with reason.
- Admin can hide package.
- Admin can feature package.
- Admin can create commission rule.
- Only one active global commission rule exists.
- Admin can approve withdrawal.
- Admin can reject withdrawal with reason.
- Admin cannot mark withdrawal paid without transaction reference.
- Non-admin users cannot access admin APIs.
```

---

# Frontend UI Testing Scope

Test these pages.

## Home Page

```text
/
```

Check:

```text
- Navbar appears.
- Hero section appears.
- Find Trainers button works.
- Browse Feed button works.
- Latest interview packages section appears.
- Featured trainers appear.
- Leaderboard preview appears.
- Footer appears.
- Mobile layout works.
```

---

## Feed Page

```text
/feed
```

Check:

```text
- Navbar appears for guest users.
- Latest packages load.
- Package card shows trainer country flag.
- Package card shows price, duration, language, availability.
- Search works.
- Filters work.
- Infinite scroll or load more works.
- Details button works.
- Book button works.
- Guest clicking Book redirects to login.
- Student clicking Book opens booking flow.
```

---

## Trainer Packages Page

```text
/trainer/packages
```

Check:

```text
- TrainerSidebar appears.
- Packages menu is active.
- Package summary cards show correct count.
- Package list loads.
- Create Package button works.
- Edit button works.
- Duplicate button works.
- Hide button works.
- Deactivate button works.
- Empty state appears when no package exists.
```

---

## Create Package Page

```text
/trainer/packages/create
```

Check:

```text
- Step form works.
- Basic Info step validates fields.
- Session Details step validates duration.
- Pricing step calculates trainer receivable.
- Requirements step saves selected documents.
- Availability step connects availability.
- Review step shows correct summary.
- Save Draft works.
- Publish works.
```

---

## Trainer Availability Page

```text
/trainer/availability
```

Check:

```text
- Calendar view appears.
- Weekly schedule works.
- Add slot works.
- Block date works.
- Booked slot cannot be deleted.
- Availability appears on student booking page.
```

---

## Trainer Earnings / Withdrawal Page

```text
/trainer/earnings
```

Check:

```text
- Wallet summary appears.
- Available balance appears.
- Pending balance appears.
- Platform commission total appears.
- Withdraw button appears only when allowed.
- Payout method can be added.
- Withdrawal request works.
- Withdrawal history appears.
```

---

## Admin Feed Management

```text
/admin/feed
```

Check:

```text
- Admin can view latest packages.
- Admin can approve package.
- Admin can reject package.
- Admin can hide package.
- Admin can feature package.
- Admin can filter by country/category/status.
```

---

# Security Testing

Please test these security cases:

```text
- Student cannot access trainer routes.
- Trainer cannot access student private data.
- Trainer cannot access admin APIs.
- Student cannot complete interview as trainer.
- Trainer cannot book own package.
- User cannot update another user's package by changing ID.
- User cannot access another user's withdrawal.
- Admin-only APIs are protected.
- Unauthenticated API requests return 401.
- Unauthorized role returns 403.
- Invalid IDs return 404.
- Invalid input returns 422.
```

---

# Negative Test Cases

Test these invalid cases:

```text
- Create package with empty title.
- Create package with negative price.
- Create package with discount price greater than regular price.
- Create availability with start time after end time.
- Book unavailable slot.
- Book expired slot.
- Pay with mismatched amount.
- Send duplicate payment callback.
- Complete cancelled session.
- Withdraw more than available balance.
- Mark withdrawal paid without transaction reference.
```

---

# Expected Deliverables From You

Please generate:

```text
1. Backend API test checklist
2. Frontend UI test checklist
3. Full end-to-end test scenarios
4. Postman collection structure
5. Cypress or Playwright test plan
6. Laravel feature test plan
7. Bug report template
8. Test data seed plan
9. QA release checklist
10. Priority list of what to test first
```

---

# Output Format

Please structure your answer like this:

```text
1. Testing Strategy
2. Test Environment Setup
3. Test Data
4. Backend API Test Cases
5. Frontend UI Test Cases
6. End-to-End User Journeys
7. Security and Permission Tests
8. Payment and Commission Tests
9. Withdrawal Tests
10. Automation Test Plan
11. Manual QA Checklist
12. Bug Report Template
13. Release Readiness Checklist
```

Use clear tables where useful.

Give practical test cases with:

```text
- Test ID
- Module
- Preconditions
- Steps
- Expected Result
- Priority
```

Focus first on critical flows:

```text
1. Auth
2. Trainer creates package
3. Trainer adds availability
4. Student books package
5. Student completes payment
6. Trainer completes session
7. Commission calculation
8. Trainer wallet update
9. Trainer withdrawal
10. Admin approval
```
