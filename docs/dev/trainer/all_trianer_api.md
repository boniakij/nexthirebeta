# NextHire Trainer API Documentation

Complete list of all trainer endpoints available on the platform.

## Base URL
```
http://localhost:8001/api/v1
```

## Authentication
All endpoints (except public routes) require JWT Bearer token:
```
Authorization: Bearer {access_token}
```

---

## Profile Management

### Get My Profile
```
GET /trainers/me
```
Returns authenticated trainer's profile data.

### Update My Profile
```
PUT /trainers/me
```
Update trainer profile information.

### Get My Profile Details
```
GET /trainers/me/profile
```
Get detailed profile with relationships.

### Update Profile
```
POST /trainers/me/profile
```
Update trainer profile (display_name, bio, professional_title, etc.).

### Upload Profile Photo
```
POST /trainers/me/profile/photo
Content-Type: multipart/form-data

Body:
- photo: File (image)
```
Upload profile photo. Returns photo_url.

### Submit Profile for Review
```
POST /trainers/me/profile/submit-review
```
Submit profile to admin for approval.

---

## Skills Management

### Get All Skills
```
GET /trainers/me/skills
```
Fetch all trainer skills.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "trainer_id": 1,
      "skill_name": "IELTS",
      "skill_category": "Language",
      "skill_level": "Expert",
      "years_experience": 10,
      "is_featured": true,
      "sort_order": 0,
      "created_at": "2026-06-14T10:00:00Z",
      "updated_at": "2026-06-14T10:00:00Z"
    }
  ]
}
```

### Add Skill
```
POST /trainers/me/skills
Content-Type: application/json

Body:
{
  "skill_name": "IELTS",
  "skill_category": "Language",
  "skill_level": "Expert",
  "years_experience": 10,
  "is_featured": true
}
```

**Valid skill_level values:**
- Beginner
- Intermediate
- Advanced
- Expert

### Update Skill
```
PUT /trainers/me/skills/{id}
Content-Type: application/json

Body: (same as POST)
```

### Delete Skill
```
DELETE /trainers/me/skills/{id}
```

---

## Work Experience Management

### Get All Work Experience
```
GET /trainers/me/experiences
```
Fetch work experience records.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "trainer_id": 1,
      "company_name": "Language Academy",
      "job_title": "Senior IELTS Trainer",
      "employment_type": "full_time",
      "location": "Dhaka, Bangladesh",
      "start_date": "2020-01-15",
      "end_date": "2026-06-30",
      "is_current": true,
      "description": "Train IELTS students...",
      "key_responsibilities": "",
      "sort_order": 0,
      "created_at": "2026-06-14T10:00:00Z",
      "updated_at": "2026-06-14T10:00:00Z"
    }
  ]
}
```

### Add Work Experience
```
POST /trainers/me/experiences
Content-Type: application/json

Body:
{
  "company_name": "Language Academy",
  "job_title": "Senior IELTS Trainer",
  "employment_type": "full_time",
  "location": "Dhaka, Bangladesh",
  "start_date": "2020-01-15",
  "end_date": "2026-06-30",
  "is_current": true,
  "description": "Train IELTS students for speaking and writing",
  "key_responsibilities": ""
}
```

**Valid employment_type values:**
- full_time
- part_time
- contract
- freelance
- internship

### Update Work Experience
```
PUT /trainers/me/experiences/{id}
Content-Type: application/json

Body: (same as POST)
```

### Delete Work Experience
```
DELETE /trainers/me/experiences/{id}
```

---

## Education Management

### Get All Education
```
GET /trainers/me/educations
```
Fetch education records.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "trainer_id": 1,
      "degree": "Bachelor of Arts",
      "institution_name": "University of London",
      "field_of_study": "English Literature",
      "start_year": 2015,
      "graduation_year": 2018,
      "grade": "3.70",
      "description": "Specialized in literature and communication",
      "sort_order": 0,
      "created_at": "2026-06-14T10:00:00Z",
      "updated_at": "2026-06-14T10:00:00Z"
    }
  ]
}
```

### Add Education
```
POST /trainers/me/educations
Content-Type: application/json

Body:
{
  "degree": "Bachelor of Arts",
  "institution_name": "University of London",
  "field_of_study": "English Literature",
  "start_year": 2015,
  "graduation_year": 2018,
  "grade": "3.70",
  "description": "Specialized in literature and communication"
}
```

**Required fields:**
- degree
- institution_name
- graduation_year

### Update Education
```
PUT /trainers/me/educations/{id}
Content-Type: application/json

Body: (same as POST)
```

### Delete Education
```
DELETE /trainers/me/educations/{id}
```

---

## Certifications Management

### Get All Certifications
```
GET /trainers/me/certifications
```
Fetch certifications.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "trainer_id": 1,
      "certification_name": "IELTS Certified",
      "issuing_organization": "British Council",
      "certificate_id": "IELTS-2024-001",
      "certificate_url": "https://example.com/cert",
      "issue_date": "2024-01-15",
      "expiry_date": "2027-01-15",
      "does_not_expire": false,
      "verification_status": "verified",
      "sort_order": 0,
      "created_at": "2026-06-14T10:00:00Z",
      "updated_at": "2026-06-14T10:00:00Z"
    }
  ]
}
```

### Add Certification
```
POST /trainers/me/certifications
Content-Type: application/json

Body:
{
  "certification_name": "IELTS Certified",
  "issuing_organization": "British Council",
  "certificate_id": "IELTS-2024-001",
  "certificate_url": "https://example.com/cert",
  "issue_date": "2024-01-15",
  "expiry_date": "2027-01-15",
  "does_not_expire": false
}
```

**Required fields:**
- certification_name
- issuing_organization
- issue_date

**verification_status values:**
- verified
- pending_verification

### Update Certification
```
PUT /trainers/me/certifications/{id}
Content-Type: application/json

Body: (same as POST)
```

### Delete Certification
```
DELETE /trainers/me/certifications/{id}
```

---

## Projects & Achievements Management

### Get All Achievements
```
GET /trainers/me/achievements
```
Fetch projects and achievements.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "trainer_id": 1,
      "title": "Campus Recruitment Program 2025",
      "type": "Project",
      "organization": "Language Academy",
      "role": "Lead Trainer",
      "achievement_date": "2025-03-15",
      "description": "Led IELTS training for 200+ students",
      "result_impact": "150 students got 7+ band score",
      "project_url": "https://example.com/project",
      "attachment_file": null,
      "is_public": true,
      "sort_order": 0,
      "created_at": "2026-06-14T10:00:00Z",
      "updated_at": "2026-06-14T10:00:00Z"
    }
  ]
}
```

### Add Achievement
```
POST /trainers/me/achievements
Content-Type: application/json

Body:
{
  "title": "Campus Recruitment Program 2025",
  "type": "Project",
  "organization": "Language Academy",
  "role": "Lead Trainer",
  "achievement_date": "2025-03-15",
  "description": "Led IELTS training for 200+ students",
  "result_impact": "150 students got 7+ band score",
  "project_url": "https://example.com/project",
  "is_public": true
}
```

**Required fields:**
- title
- type
- description

**Valid type values:**
- Project
- Achievement
- Award
- Publication
- Training Program

### Update Achievement
```
PUT /trainers/me/achievements/{id}
Content-Type: application/json

Body: (same as POST)
```

### Delete Achievement
```
DELETE /trainers/me/achievements/{id}
```

---

## Dashboard & Analytics

### Get Dashboard
```
GET /trainers/me/dashboard
```
Get trainer dashboard data (stats, metrics).

### Get Earnings
```
GET /trainers/me/earnings?period=month
```
Fetch earnings data for specified period.

**Query parameters:**
- period: month | quarter | year (optional)

### Get Sessions
```
GET /trainers/me/sessions
```
List trainer sessions.

---

## Availability Management

### Set Availability
```
POST /trainers/me/availability
Content-Type: application/json

Body:
{
  "day": "Monday",
  "start_time": "09:00",
  "end_time": "17:00",
  "is_available": true
}
```

---

## Evaluations

### Submit Evaluation
```
POST /trainers/me/evaluations/{interview_id}
Content-Type: application/json

Body:
{
  "rating": 4.5,
  "feedback": "Good performance...",
  "strengths": "...",
  "areas_for_improvement": "...",
  "score": 85
}
```

---

## Wallet & Payment

### Get Wallet
```
GET /trainers/me/wallet
```
Get wallet balance information.

**Response:**
```json
{
  "success": true,
  "data": {
    "currency": "BDT",
    "available_balance": 18500,
    "pending_balance": 6200,
    "total_earned": 125000,
    "withdrawn_amount": 54300,
    "minimum_withdraw_amount": 1000,
    "withdrawal_allowed": true
  }
}
```

---

## Withdrawals

### Get Withdrawals
```
GET /trainers/me/withdrawals
```
List withdrawal requests.

### Request Withdrawal
```
POST /trainers/me/withdrawals
Content-Type: application/json

Body:
{
  "amount": 5000,
  "payout_method_id": 1,
  "notes": ""
}
```

---

## Payout Methods

### Get Payout Methods
```
GET /trainers/me/payout-methods
```
List all payout methods.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "trainer_id": 1,
      "payment_method": "bank_transfer",
      "bank_name": "Dhaka Bank",
      "account_number": "****5678",
      "account_holder_name": "John Doe",
      "swift_code": "DHKABE",
      "iban": "",
      "is_default": true,
      "verification_status": "verified",
      "created_at": "2026-06-14T10:00:00Z",
      "updated_at": "2026-06-14T10:00:00Z"
    }
  ]
}
```

### Add Payout Method
```
POST /trainers/me/payout-methods
Content-Type: application/json

Body:
{
  "payment_method": "bank_transfer",
  "bank_name": "Dhaka Bank",
  "account_number": "1234567890",
  "account_holder_name": "John Doe",
  "swift_code": "DHKABE",
  "is_default": true
}
```

**Valid payment_method values:**
- bank_transfer
- bkash
- nagad

### Update Payout Method
```
PUT /trainers/me/payout-methods/{id}
Content-Type: application/json

Body: (same as POST)
```

### Delete Payout Method
```
DELETE /trainers/me/payout-methods/{id}
```

---

## Public Trainer Routes (No Auth Required)

### List All Trainers
```
GET /trainers
```
Query parameters:
- page: int
- limit: int
- search: string
- category: string
- rating: float

### Get Trainer Profile
```
GET /trainers/{id}
```
Get public trainer profile.

### Get Trainer Availability
```
GET /trainers/{id}/availability
```
Get trainer availability slots.

Query parameters:
- date: YYYY-MM-DD

### Get Public Profile
```
GET /trainers/{trainerId}/profile
```
Get complete public profile with experience, certifications, achievements.

---

## Error Responses

All endpoints return error responses in this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Error detail"]
  }
}
```

**HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 422: Validation Error
- 500: Server Error

---

## Rate Limiting
- No specific rate limits defined (configurable in production)

## Pagination
Default: 15 items per page (configurable)

## Timestamps
All timestamps in UTC ISO 8601 format.
