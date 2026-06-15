# NextHire Trainer Packages Module

## Route

```text
/trainer/packages
```

## Sidebar Menu

```text
NH
NextHire

Dashboard
My Profile
Packages
Availability
Sessions
Bookings
Evaluations
Messages
Reviews
Earnings
Resources
Notifications
Support
Settings
```

Active menu:

```text
Packages
```

---

# 1. Trainer Packages Page UI

## Page Header

```text
------------------------------------------------------------
Trainer Packages
------------------------------------------------------------
Create, manage, publish, hide, or deactivate your interview packages.

[ + Create Package ]
------------------------------------------------------------
```

## Summary Cards

```text
------------------------------------------------------------
[ Active Packages ]   [ Draft Packages ]   [ Total Bookings ]   [ Package Revenue ]
5                     2                    126                  ৳84,500
------------------------------------------------------------
```

## Package Filters

```text
------------------------------------------------------------
Search:
[ Search package title, category, skill... ]

Filters:
[ Status v ] [ Category v ] [ Price Range v ] [ Sort By v ]

Status:
All, Active, Draft, Hidden, Deactivated, Pending Review, Rejected

Category:
HR Interview, Technical Interview, CV Review, Career Counseling,
LinkedIn Review, Company Interview Prep

Sort:
Latest, Oldest, Price Low to High, Price High to Low, Most Booked
------------------------------------------------------------
```

## Package List UI

```text
------------------------------------------------------------
My Packages
------------------------------------------------------------

Package                         Category        Price     Status    Bookings   Action
HR Mock Interview                HR Interview   ৳800      Active    45         [ Manage ]
Frontend Technical Interview     Technical      ৳1200     Active    31         [ Manage ]
CV Review for Freshers           CV Review      ৳500      Draft     0          [ Edit ]

------------------------------------------------------------
```

## Package Card UI

```text
------------------------------------------------------------
HR Mock Interview for Fresh Graduates

Category: HR Interview
Target Level: Fresher
Duration: 45 minutes
Language: Bangla + English

Price: ৳800
Discount Price: ৳650
Bookings: 45
Status: Active

Short Description:
45-minute structured HR interview with feedback.

[ View ] [ Edit ] [ Duplicate ] [ Hide ] [ Deactivate ]
------------------------------------------------------------
```

---

# 2. Create Package Page / Modal

Route option:

```text
/trainer/packages/create
```

or modal inside:

```text
/trainer/packages
```

Recommended MVP: use a full page for better form handling.

---

# 3. Create Package Step UI

```text
------------------------------------------------------------
Create Package
------------------------------------------------------------

Step 1: Basic Info > Step 2: Session Details > Step 3: Pricing
> Step 4: Requirements > Step 5: Availability > Step 6: Review

[ Save Draft ]
------------------------------------------------------------
```

---

# Step 1: Basic Info

```text
------------------------------------------------------------
Basic Information
------------------------------------------------------------

Package Title *
[ HR Mock Interview for Fresh Graduates ]

Category *
[ HR Interview v ]

Target Level *
[ Fresher v ]

Package Type *
[ 1:1 Live Session v ]

Short Description *
[ 45-minute structured HR interview with feedback ]

Detailed Description *
[ Explain what the student will receive from this session... ]

Tags
[ HR ] [ Fresher ] [ Communication ] [ Confidence ]

[ Cancel ]                         [ Save & Continue ]
------------------------------------------------------------
```

Field options:

```text
Category:
- HR Interview
- Technical Interview
- CV Review
- Career Counseling
- LinkedIn Review
- Company Interview Prep
- Communication Practice
- Leadership Interview

Target Level:
- Fresher
- Junior
- Mid-Level
- Senior
- Executive

Package Type:
- 1:1 Live Session
- CV Review
- Document Review
- Career Counseling
- Mock Interview
- Bundle Package
```

---

# Step 2: Session Details

```text
------------------------------------------------------------
Session Details
------------------------------------------------------------

Duration *
[ 30 min | 45 min | 60 min ]

Session Mode *
[ Video Interview v ]

Language *
[ Bangla + English v ]

Difficulty *
[ Beginner v ]

Session Count *
[ 1 ]

Includes CV Review?
[ Yes / No ]

Includes Written Feedback?
[ Yes / No ]

Preparation Instructions
[ Tell students what they need to prepare before the session... ]

[ Back ]                          [ Save & Continue ]
------------------------------------------------------------
```

Field options:

```text
Session Mode:
- Video Interview
- Audio Only
- Chat Session
- Document Review
- Video + Written Feedback

Language:
- Bangla
- English
- Bangla + English

Difficulty:
- Beginner
- Intermediate
- Advanced
```

---

# Step 3: Pricing

```text
------------------------------------------------------------
Pricing
------------------------------------------------------------

Regular Price *
[ ৳ 800 ]

Discount Price
[ ৳ 650 ]

Currency *
[ BDT v ]

Admin Platform Commission
20%

Trainer Receivable
৳640

Refund Policy
[ Default Platform Policy v ]

------------------------------------------------------------
Price Preview
------------------------------------------------------------

Student Pays: ৳800
Platform Commission: ৳160
Trainer Receives: ৳640

[ Back ]                          [ Save & Continue ]
------------------------------------------------------------
```

Important logic:

```text
- Platform commission comes from admin commission setup.
- Trainer should see estimated receivable amount.
- Final commission is locked during payment/session completion.
```

---

# Step 4: Student Requirements

```text
------------------------------------------------------------
Student Requirements
------------------------------------------------------------

Required Before Booking:
[ ✓ ] Resume / CV
[ ] LinkedIn URL
[ ] GitHub URL
[ ] Portfolio URL
[ ] Job Description
[ ] Cover Letter

Custom Questions
[ What job role are you preparing for? ]
[ What company are you targeting? ]

Special Instructions
[ Please upload your latest CV before the session. ]

[ Back ]                          [ Save & Continue ]
------------------------------------------------------------
```

---

# Step 5: Availability Connection

```text
------------------------------------------------------------
Availability
------------------------------------------------------------

Connect this package with your availability calendar.

Availability Scope *
[ Use All Available Slots v ]

Options:
- Use All Available Slots
- Use Specific Weekly Schedule
- Use Package-Specific Slots
- No Availability Yet

Available Slot Preview:
Monday       7:00 PM - 10:00 PM
Tuesday      8:00 PM - 11:00 PM
Friday       4:00 PM - 8:00 PM

[ Manage Availability ]

[ Back ]                          [ Save & Continue ]
------------------------------------------------------------
```

If no availability:

```text
You have no available time slots.
Students cannot book this package until you add availability.

[ Add Availability ]
```

---

# Step 6: Review & Publish

```text
------------------------------------------------------------
Review Package
------------------------------------------------------------

Package Title:
HR Mock Interview for Fresh Graduates

Category:
HR Interview

Target Level:
Fresher

Duration:
45 minutes

Language:
Bangla + English

Price:
৳800

Trainer Receivable:
৳640

Requirements:
Resume required

Availability:
All active slots

Status:
Draft

------------------------------------------------------------
Publishing Options
------------------------------------------------------------

Package Visibility *
[ Draft | Submit for Review | Publish ]

Note:
If admin approval is required, package will appear on Feed after approval.

[ Back ] [ Save as Draft ] [ Submit / Publish ]
------------------------------------------------------------
```

---

# 4. Create Package Backend API

## Create Package

```http
POST /trainers/me/packages
Auth: Trainer
Content-Type: application/json
```

Request:

```json
{
  "title": "HR Mock Interview for Fresh Graduates",
  "category": "HR Interview",
  "target_level": "Fresher",
  "package_type": "1:1 Live Session",
  "short_description": "45-minute structured HR interview with feedback",
  "description": "Student will receive realistic HR interview practice, communication feedback, confidence score, and improvement tips.",
  "tags": ["HR", "Fresher", "Communication", "Confidence"],
  "duration_minutes": 45,
  "session_mode": "Video Interview",
  "language": "Bangla + English",
  "difficulty": "beginner",
  "session_count": 1,
  "includes_cv_review": false,
  "includes_written_feedback": true,
  "preparation_instructions": "Please upload your latest CV before the session.",
  "price": 800,
  "discount_price": 650,
  "currency": "BDT",
  "required_documents": {
    "resume": true,
    "linkedin_url": false,
    "github_url": false,
    "portfolio_url": false,
    "job_description": false,
    "cover_letter": false
  },
  "custom_questions": [
    "What job role are you preparing for?",
    "What company are you targeting?"
  ],
  "availability_scope": "all_slots",
  "status": "draft"
}
```

Response:

```json
{
  "success": true,
  "message": "Package created successfully.",
  "data": {
    "package_id": 22,
    "title": "HR Mock Interview for Fresh Graduates",
    "status": "draft",
    "price": 800,
    "currency": "BDT",
    "commission_preview": {
      "commission_type": "percentage",
      "commission_value": 20,
      "commission_amount": 160,
      "trainer_receivable": 640
    },
    "created_at": "2026-07-01T10:00:00Z"
  }
}
```

---

# 5. Package API List

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

## Get Packages

```http
GET /trainers/me/packages?status=active&search=hr&sort=latest
Auth: Trainer
```

## Update Package

```http
PUT /trainers/me/packages/{id}
Auth: Trainer
```

## Publish Package

```http
PATCH /trainers/me/packages/{id}/publish
Auth: Trainer
```

Response:

```json
{
  "success": true,
  "message": "Package submitted for review.",
  "data": {
    "package_id": 22,
    "status": "pending_review"
  }
}
```

## Duplicate Package

```http
PATCH /trainers/me/packages/{id}/duplicate
Auth: Trainer
```

Response:

```json
{
  "success": true,
  "message": "Package duplicated successfully.",
  "data": {
    "new_package_id": 29,
    "status": "draft"
  }
}
```

---

# 6. Frontend File Structure

```text
app/trainer/packages/page.tsx
app/trainer/packages/create/page.tsx
app/trainer/packages/[id]/edit/page.tsx
app/trainer/packages/[id]/page.tsx

components/trainer/TrainerSidebar.tsx
components/trainer/packages/PackageStatsCards.tsx
components/trainer/packages/PackageFilters.tsx
components/trainer/packages/PackageCard.tsx
components/trainer/packages/PackageTable.tsx
components/trainer/packages/CreatePackageForm.tsx
components/trainer/packages/PackageBasicInfoStep.tsx
components/trainer/packages/PackageSessionStep.tsx
components/trainer/packages/PackagePricingStep.tsx
components/trainer/packages/PackageRequirementsStep.tsx
components/trainer/packages/PackageAvailabilityStep.tsx
components/trainer/packages/PackageReviewStep.tsx

lib/api/trainerPackages.ts
types/trainerPackage.ts
```

---

# 7. Frontend State Structure

```ts
type PackageFormState = {
  title: string;
  category: string;
  target_level: string;
  package_type: string;
  short_description: string;
  description: string;
  tags: string[];

  duration_minutes: number;
  session_mode: string;
  language: string;
  difficulty: string;
  session_count: number;
  includes_cv_review: boolean;
  includes_written_feedback: boolean;
  preparation_instructions: string;

  price: number;
  discount_price?: number;
  currency: "BDT" | "USD";

  required_documents: {
    resume: boolean;
    linkedin_url: boolean;
    github_url: boolean;
    portfolio_url: boolean;
    job_description: boolean;
    cover_letter: boolean;
  };

  custom_questions: string[];
  availability_scope: "all_slots" | "specific_schedule" | "package_specific" | "none";
  status: "draft" | "pending_review" | "active" | "hidden" | "deactivated";
};
```

---

# 8. Example API Client

```ts
// lib/api/trainerPackages.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTrainerPackages(token: string) {
  const res = await fetch(`${API_BASE_URL}/trainers/me/packages`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch trainer packages");
  }

  return res.json();
}

export async function createTrainerPackage(token: string, payload: any) {
  const res = await fetch(`${API_BASE_URL}/trainers/me/packages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create package");
  }

  return res.json();
}

export async function updateTrainerPackage(token: string, packageId: number, payload: any) {
  const res = await fetch(`${API_BASE_URL}/trainers/me/packages/${packageId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update package");
  }

  return res.json();
}

export async function deleteTrainerPackage(token: string, packageId: number) {
  const res = await fetch(`${API_BASE_URL}/trainers/me/packages/${packageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to deactivate package");
  }

  return res.json();
}
```

---

# 9. Backend Database Table

## packages

```text
id
trainer_id
title
slug
category
target_level
package_type
short_description
description
tags_json
duration_minutes
session_mode
language
difficulty
session_count
includes_cv_review
includes_written_feedback
preparation_instructions
price
discount_price
currency
required_documents_json
custom_questions_json
availability_scope
status
is_featured
total_bookings
total_revenue
published_at
approved_at
rejected_reason
created_at
updated_at
```

---

# 10. Laravel Migration Example

```php
Schema::create('packages', function (Blueprint $table) {
    $table->id();
    $table->foreignId('trainer_id')->constrained('trainers')->cascadeOnDelete();

    $table->string('title', 300);
    $table->string('slug')->unique();
    $table->string('category', 100);
    $table->string('target_level', 50);
    $table->string('package_type', 100)->nullable();

    $table->string('short_description', 500)->nullable();
    $table->text('description')->nullable();
    $table->jsonb('tags_json')->default('[]');

    $table->smallInteger('duration_minutes')->default(60);
    $table->string('session_mode', 100)->default('Video Interview');
    $table->string('language', 50)->default('English');
    $table->string('difficulty', 50)->default('beginner');
    $table->smallInteger('session_count')->default(1);

    $table->boolean('includes_cv_review')->default(false);
    $table->boolean('includes_written_feedback')->default(true);
    $table->text('preparation_instructions')->nullable();

    $table->decimal('price', 10, 2);
    $table->decimal('discount_price', 10, 2)->nullable();
    $table->char('currency', 3)->default('BDT');

    $table->jsonb('required_documents_json')->default('{}');
    $table->jsonb('custom_questions_json')->default('[]');

    $table->string('availability_scope', 50)->default('all_slots');
    $table->string('status', 50)->default('draft');

    $table->boolean('is_featured')->default(false);
    $table->integer('total_bookings')->default(0);
    $table->decimal('total_revenue', 12, 2)->default(0);

    $table->timestamp('published_at')->nullable();
    $table->timestamp('approved_at')->nullable();
    $table->text('rejected_reason')->nullable();

    $table->timestamps();

    $table->index(['trainer_id', 'status']);
    $table->index(['category', 'status']);
});
```

---

# 11. Laravel Controller Methods

```php
class TrainerPackageController extends Controller
{
    public function index(Request $request)
    {
        // List trainer packages with filters
    }

    public function store(StoreTrainerPackageRequest $request)
    {
        // Create package
    }

    public function show($id)
    {
        // Show package details
    }

    public function update(UpdateTrainerPackageRequest $request, $id)
    {
        // Update package
    }

    public function destroy($id)
    {
        // Deactivate package
    }

    public function publish($id)
    {
        // Submit package for review or publish directly
    }

    public function hide($id)
    {
        // Hide package from feed
    }

    public function duplicate($id)
    {
        // Duplicate package as draft
    }

    public function deactivate($id)
    {
        // Deactivate package
    }
}
```

---

# 12. Laravel Routes

```php
Route::middleware(['auth:sanctum', 'role:trainer'])->prefix('v1/trainers/me')->group(function () {
    Route::get('/packages', [TrainerPackageController::class, 'index']);
    Route::post('/packages', [TrainerPackageController::class, 'store']);
    Route::get('/packages/{id}', [TrainerPackageController::class, 'show']);
    Route::put('/packages/{id}', [TrainerPackageController::class, 'update']);
    Route::delete('/packages/{id}', [TrainerPackageController::class, 'destroy']);

    Route::patch('/packages/{id}/publish', [TrainerPackageController::class, 'publish']);
    Route::patch('/packages/{id}/hide', [TrainerPackageController::class, 'hide']);
    Route::patch('/packages/{id}/duplicate', [TrainerPackageController::class, 'duplicate']);
    Route::patch('/packages/{id}/deactivate', [TrainerPackageController::class, 'deactivate']);
});
```

---

# 13. Validation Rules

```text
- Trainer must be logged in.
- Trainer must be approved before publishing package.
- Package title is required.
- Category is required.
- Target level is required.
- Duration must be 30, 45, or 60 minutes.
- Price must be greater than 0.
- Discount price cannot be greater than regular price.
- Language is required.
- Description should be required before publishing.
- Draft can be saved with minimum required fields.
- Active package must have price, duration, description, and category.
- Trainer cannot delete package with upcoming confirmed bookings.
- Deactivate should hide package from Feed and prevent new bookings.
- Package should not appear on public Feed until active/approved.
```

---

# 14. Empty State

```text
------------------------------------------------------------
No Packages Yet
------------------------------------------------------------

You have not created any interview package yet.
Create your first package so students can book sessions with you.

[ + Create First Package ]
------------------------------------------------------------
```

---

# 15. Success / Error Messages

```text
Package created successfully.
Package saved as draft.
Package submitted for admin review.
Package updated successfully.
Package duplicated successfully.
Package hidden from Feed.
Package deactivated successfully.
You cannot publish a package before completing your trainer profile.
You cannot deactivate a package with upcoming confirmed bookings.
```

---

# 16. Final User Flow

```text
Trainer opens /trainer/packages
        ↓
Trainer clicks + Create Package
        ↓
Trainer fills Basic Info
        ↓
Trainer fills Session Details
        ↓
Trainer sets Pricing
        ↓
Trainer selects Student Requirements
        ↓
Trainer connects Availability
        ↓
Trainer reviews package
        ↓
Trainer saves draft or publishes
        ↓
Package goes to admin review or becomes active
        ↓
Package appears on Feed / Packages page
        ↓
Student books package
```
