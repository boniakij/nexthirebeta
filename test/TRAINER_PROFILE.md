# Trainer Profile System Documentation

## Overview
Complete trainer profile management system for NextHire. Allows trainers to create professional profiles, manage credentials, and appear in student searches. Includes admin review workflow for profile verification.

## Database Schema

### trainers table (existing + expanded)
```
Core Fields:
- id: bigint (PK)
- user_id: bigint (FK to users)
- full_name: string(200)
- display_name: string(150)
- profile_photo_url: string
- gender: char(1) [M/F/O]
- date_of_birth: date
- phone_number: string(20)
- email: string (from users table)
- location: string(150)
- time_zone: string(50) [UTC, EST, etc]
- preferred_language: string(50)

Professional Information:
- professional_title: string(150)
- current_company: string(150)
- current_designation: string(150)
- years_experience: smallint
- industry: string(100)
- trainer_type: string(100)

About & Content:
- headline: string(255)
- bio: text (min 100 chars)
- booking_value_statement: text

Expertise:
- expertise_domains: json (array of domains)
- target_student_levels: json (array)
- preferred_session_modes: json (array)

Education:
- highest_degree: string(100)
- institution_name: string(200)
- graduation_year: year
- field_of_study: string(100)

Additional:
- languages: json (array with proficiency)
- social_links: json (LinkedIn, portfolio, GitHub, etc)

Profile Status:
- profile_status: enum [draft, submitted, active, hidden, rejected, suspended]
- admin_review_status: enum [pending, approved, rejected, suspended]
- profile_submitted_at: timestamp
- verified_at: timestamp
- admin_rejection_reason: text

Booking & Availability:
- is_available_for_booking: boolean
- is_featured: boolean
- accepting_new_students: boolean
- response_time: string(50)
- cancellation_policy: text
- refund_policy: text

Ratings & Stats:
- average_rating: decimal(3,2)
- total_reviews: integer
- total_sessions: integer

Timestamps:
- created_at: timestamp
- updated_at: timestamp
```

### trainer_experiences table
```
- id: bigint (PK)
- trainer_id: bigint (FK)
- company_name: string(200)
- job_title: string(150)
- employment_type: enum [full_time, part_time, contract, freelance, internship]
- start_date: date
- end_date: date (nullable)
- is_current: boolean
- description: text
- created_at: timestamp
- updated_at: timestamp
```

### trainer_certifications table
```
- id: bigint (PK)
- trainer_id: bigint (FK)
- certification_name: string(200)
- issuing_organization: string(200)
- certificate_url: string
- issue_date: date
- expiry_date: date (nullable)
- created_at: timestamp
- updated_at: timestamp
```

## API Endpoints

### Trainer Profile Management (Protected - Trainer)

#### GET /api/v1/trainers/me/profile
Get trainer's own profile
- Response: `{success: true, data: Trainer}`
- Status: 200 OK | 404 Not Found

#### POST /api/v1/trainers/me/profile
Update trainer profile
- Body: ProfileData (partial update allowed)
- Response: `{success: true, message: string, data: Trainer}`
- Validation:
  - bio must be ≥100 characters
  - years_experience must be ≥0
  - profile_photo_url required before activation

#### POST /api/v1/trainers/me/profile/photo
Upload profile photo
- Body: FormData with `photo` file (image/* max 2MB)
- Response: `{success: true, message: string, photo_url: string}`

#### POST /api/v1/trainers/me/profile/submit-review
Submit profile for admin verification
- Validates required fields before submission
- Sets profile_status = "submitted"
- Sets admin_review_status = "pending"
- Sets profile_submitted_at = now()
- Response: `{success: true, message: string, data: Trainer}`

### Trainer Experiences (Protected - Trainer)

#### POST /api/v1/trainers/me/profile/experiences
Add work experience
- Body: `{company_name, job_title, employment_type, start_date, end_date?, is_current, description?}`
- Response: 201 Created | 422 Validation Error | 500 Error

#### PUT /api/v1/trainers/me/profile/experiences/{id}
Update work experience
- Validate ownership
- Response: 200 OK | 404 Not Found | 422 Validation Error

#### DELETE /api/v1/trainers/me/profile/experiences/{id}
Delete work experience
- Validate ownership
- Response: 200 OK | 404 Not Found

### Trainer Certifications (Protected - Trainer)

#### POST /api/v1/trainers/me/profile/certifications
Add certification
- Body: `{certification_name, issuing_organization, certificate_url?, issue_date, expiry_date?}`
- Response: 201 Created

#### PUT /api/v1/trainers/me/profile/certifications/{id}
Update certification
- Response: 200 OK

#### DELETE /api/v1/trainers/me/profile/certifications/{id}
Delete certification
- Response: 200 OK

### Public Trainer Profile (Public - No Auth)

#### GET /api/v1/trainers/{trainerId}/profile
Get trainer's public profile
- Only returns profiles with `profile_status = "active"`
- Includes: experiences, certifications, packages, reviews
- Response: `{success: true, data: Trainer}`
- Status: 200 OK | 404 Not Found

### Admin Management (Protected - Admin)

#### GET /api/v1/admin/trainers/pending-review
List trainers pending admin review
- Query params: `per_page=15, page=1`
- Filters: `profile_status = "submitted" AND admin_review_status = "pending"`
- Sorted by: profile_submitted_at ASC
- Response: `{success: true, data: [], pagination: {}}`

#### PATCH /api/v1/admin/trainers/{trainerId}/approve
Approve trainer profile
- Sets: profile_status = "active", admin_review_status = "approved", verified_at = now()
- Sets: is_approved = true, approved_at = now()
- Response: `{success: true, message: string, data: Trainer}`

#### PATCH /api/v1/admin/trainers/{trainerId}/reject
Reject trainer profile
- Body: `{reason: string(required)}`
- Sets: profile_status = "rejected", admin_review_status = "rejected"
- Sets: admin_rejection_reason = reason
- Profile can be resubmitted
- Response: `{success: true, message: string, data: Trainer}`

#### PATCH /api/v1/admin/trainers/{trainerId}/suspend
Suspend trainer profile
- Body: `{reason: string(required)}`
- Sets: profile_status = "suspended", admin_review_status = "suspended"
- Sets: is_available_for_booking = false
- Reason: policy violation, fraud, quality issues
- Response: `{success: true, message: string, data: Trainer}`

#### GET /api/v1/admin/trainers
List all trainer profiles
- Query params: `per_page=15, page=1, status=active, search=name`
- Response: `{success: true, data: [], pagination: {}}`

## Workflows

### 1. Trainer Profile Creation Workflow
```
1. Trainer opens /trainer/profile/setup
2. Step 1: Basic Info
   - Upload profile photo (required)
   - Enter full name, display name
   - Phone number, location
   - Preferred language
   Validation: All fields required
   
3. Step 2: Professional Info
   - Professional title (required)
   - Current company, designation
   - Years of experience (required)
   - Industry (required)
   - Trainer type (required)
   Validation: All marked fields required
   
4. Step 3: About
   - Headline (required)
   - Bio (required, min 100 chars)
   - Value proposition (required)
   Validation: Bio must be 100+ characters
   
5. Step 4: Expertise
   - Select target student levels (min 1 required)
   - Select preferred session modes (min 1 required)
   Validation: At least one of each selected
   
6. Step 5: Review & Save
   - Display summary of all info
   - Save to database
   - Profile status = "draft"
   - Can be edited later
   - Option to submit for review
   
7. Trainer clicks "Save Profile"
   - POST /api/v1/trainers/me/profile
   - Saves all data
   - Redirects to dashboard
```

### 2. Submit Profile for Review
```
1. Trainer views their profile
2. Clicks "Submit for Review"
3. Validation checks:
   - full_name populated
   - professional_title populated
   - bio ≥100 characters
   - At least one expertise category
   - At least one language
   - At least one trainer type
   
4. If valid:
   - POST /api/v1/trainers/me/profile/submit-review
   - profile_status = "submitted"
   - admin_review_status = "pending"
   - profile_submitted_at = now()
   - Profile removed from draft/edit mode
   
5. If invalid:
   - Show validation errors
   - Direct trainer to complete fields
```

### 3. Admin Review Workflow
```
1. Admin opens /admin/trainers/pending-review
2. Lists trainers with profile_status = "submitted"
3. Admin clicks trainer card to review
4. Admin can:
   
   a) Approve:
      - PATCH /admin/trainers/{id}/approve
      - profile_status = "active"
      - verified_at = now()
      - is_approved = true
      - Trainer profile now visible to students
      - Trainer receives notification
      
   b) Reject:
      - PATCH /admin/trainers/{id}/reject
      - Body: {reason: "..."}
      - profile_status = "rejected"
      - admin_rejection_reason populated
      - Trainer notified with reason
      - Trainer can edit and resubmit
      
   c) Suspend:
      - PATCH /admin/trainers/{id}/suspend
      - Body: {reason: "..."}
      - profile_status = "suspended"
      - is_available_for_booking = false
      - Trainer cannot accept bookings
      - Trainer contacted about issue
```

### 4. Profile Edit After Approval
```
Scenario: Major changes vs Minor changes

Minor Changes (headline, bio, skills):
- Trainer can edit immediately
- Changes apply to active profile
- No re-review needed
- Examples: Bio update, adding skill

Major Changes (name, title, certification):
- System flags for re-review
- profile_status changes to "submitted"
- admin_review_status = "pending"
- Profile temporarily hidden from students
- Admin re-verifies
- Examples: Name change, certification update
```

## Frontend Pages

### /trainer/profile/setup
**5-step trainer profile creation form**

Step 1: Basic Information
- Profile photo upload (drag & drop, required)
- Full name, Display name
- Phone number, Location, Language
- Progress indicator

Step 2: Professional Information
- Professional title, Company, Designation
- Years of experience, Industry, Trainer type
- Pre-filled education fields

Step 3: About You
- Headline for profile
- Bio/introduction (100+ chars required)
- Why book a session with me
- Character counter for bio

Step 4: Expertise & Skills
- Multi-select: Target student levels (Fresher, Junior, Mid-Level, Senior, Executive)
- Multi-select: Preferred session modes (Video, Audio, Chat, Document Review)

Step 5: Review & Confirmation
- Summary of all information
- Photo preview
- Confirm and save

Navigation: Back, Next, Save (only on last step)

### /trainers/[id]/profile
**Public trainer profile view**

Sections:
1. Header
   - Profile photo
   - Name, Title, Rating, Location
   - Languages, Starting price
   - "Book Session" button

2. About Section
   - Bio
   - Why book this trainer

3. Expertise
   - Specializations (chips)
   - Target student levels
   - Experience summary

4. Work Experience
   - List of past positions
   - Company, Title, Dates

5. Certifications
   - List with issuer and date

6. Available Packages
   - Package title, duration, price
   - View & Book button for each

7. Availability Preview
   - Next 3 available slots

8. Reviews Section
   - Ratings and feedback

### /admin/trainers/pending-review
**Admin trainer profile review interface**

Layout: Two-column
- Left: List of pending trainers
- Right: Review detail panel

Left Column:
- Cards for each pending trainer
- Photo, name, title, submission date
- Click to select for review
- Count of pending

Right Column (when trainer selected):
- Full profile preview
- Photo, name, title, bio
- Professional details
- Rejection reason textarea
- Approve button (green)
- Reject button (red)
- Loading states

## Validation Rules

### Profile Creation
- `full_name`: Required, max 200 chars
- `display_name`: Required, max 150 chars
- `profile_photo_url`: Required for public profile
- `phone_number`: Required, valid format
- `location`: Required, max 150 chars
- `professional_title`: Required, max 150 chars
- `years_experience`: Required, ≥0, integer
- `bio`: Required, min 100 chars, max 5000 chars
- `headline`: Required, max 255 chars
- `target_student_levels`: At least 1 required
- `preferred_session_modes`: At least 1 required
- `languages`: At least 1 language required

### Photo Upload
- File type: image/* (jpg, png, gif, webp)
- Max size: 2MB
- Dimensions: Recommended 300x300px minimum
- Replace existing photo if present

### Profile Submission
- All required fields completed
- Bio ≥100 characters
- At least one expertise category
- At least one language selected
- Phone and email verified

### Experience
- `company_name`: Required, max 200 chars
- `job_title`: Required, max 150 chars
- `employment_type`: Required, one of predefined
- `start_date`: Required, valid date
- `end_date`: Optional, must be after start_date if provided
- `is_current`: Boolean

### Certification
- `certification_name`: Required, max 200 chars
- `issuing_organization`: Required, max 200 chars
- `issue_date`: Required, valid date
- `expiry_date`: Optional, must be after issue_date if provided
- `certificate_url`: Optional, valid URL

## Edge Cases & Error Handling

### 1. Trainer with No Active Packages
- Profile shows "No packages available yet"
- Trainer directed to create package
- Cannot accept bookings

### 2. Trainer with Packages but No Availability
- Profile shows "No availability set"
- Trainer directed to set availability
- Cannot accept bookings

### 3. Profile Rejected During Active Status
- System temporarily hides profile from students
- Notifies trainer of rejection
- Provides rejection reason
- Trainer can resubmit after fixes

### 4. Trainer Deletes Profile Photo
- Profile_photo_url set to null
- Profile status changes to "submitted" (re-review required)
- Trainer must upload new photo

### 5. Email/Phone Change
- System flags for re-verification
- Requires OTP verification
- Profile status may change to "submitted"

### 6. Trainer Account Suspended
- profile_status = "suspended"
- All packages hidden from students
- Cannot accept new bookings
- Existing bookings unaffected (can continue)

### 7. Concurrent Profile Edits
- Last update wins
- Use updated_at timestamp for conflict detection
- Show toast if profile updated elsewhere

### 8. Admin Rejects Then Trainer Edits
- Can resubmit immediately
- Previous rejection reason cleared
- New review_status = "pending"

## Status Flow Diagram

```
[Draft]
   ↓ (Submit for review)
[Submitted] → [Admin Review]
   ↓
[Approved] → [Active] ← [Hidden]
   ↓
[Rejected] → (Edit & Resubmit)
   ↓
[Suspended] ← (Policy violation)
```

## Database Indexes
- trainers.user_id (unique)
- trainers.profile_status
- trainers.admin_review_status
- trainers.profile_submitted_at
- trainers.average_rating
- trainer_experiences.trainer_id
- trainer_certifications.trainer_id

## Performance Considerations
- Cache trainer public profiles (5 min TTL)
- Index profile_status for admin queries
- Paginate trainer lists (default 15 per page)
- Lazy load certifications/experiences on public profile
- Store skills/languages as JSON (indexed)

## Security Considerations
- Phone number verified before profile submission
- Email verified during registration
- Admin actions logged and auditable
- Soft delete for profile data
- File upload validation (type, size, dimensions)
- XSS prevention on bio/description fields
- Rate limiting on profile updates

## Future Enhancements
- Video introduction for trainers
- Verification badges (ID, credentials)
- Response time SLA tracking
- Cancellation statistics
- Student feedback on trainer communication
- Trainer earnings statistics on profile
- Integration with LinkedIn for validation
