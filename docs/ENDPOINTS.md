# NextHire — API Endpoint Reference

> **Base URL:** `http://localhost:8000/v1`  
> **Auth:** `Authorization: Bearer {access_token}` on all protected routes  
> **Content-Type:** `application/json`  
> **Rate Limit:** 60 req/min (authenticated) · 10 req/min (unauthenticated) · 5 req/min (login/register)  
> **Version:** 1.0.0

---

## Response Envelope

All responses use a consistent wrapper:

```json
// Success
{
  "success": true,
  "data": { },
  "meta": {
    "per_page": 20,
    "next_cursor": "eyJpZCI6MTAwfQ==",
    "total": 430
  }
}

// Error
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK — request succeeded |
| 201 | Created — resource created |
| 204 | No Content — deleted successfully |
| 400 | Bad Request — malformed request |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — valid token but wrong role |
| 404 | Not Found — resource does not exist |
| 409 | Conflict — e.g. slot already booked |
| 422 | Unprocessable — validation failed |
| 429 | Too Many Requests — rate limit exceeded |
| 500 | Server Error — unexpected failure |

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Student](#2-student)
3. [Trainer (Public)](#3-trainer-public)
4. [Trainer (Authenticated)](#4-trainer-authenticated)
5. [Booking](#5-booking)
6. [Interview & Session](#6-interview--session)
7. [Payment](#7-payment)
8. [Gamification](#8-gamification)
9. [Company](#9-company)
10. [Admin](#10-admin)
11. [Notifications](#11-notifications)

---

## 1. Authentication

### POST `/auth/register`
**Auth:** None  
**Rate limit:** 5/min

**Request:**
```json
{
  "full_name": "Rahim Ahmed",
  "email": "rahim@example.com",
  "password": "SecurePass123",
  "password_confirmation": "SecurePass123",
  "role": "student"
}
```

**Validation rules:**
- `full_name` — required, string, min 2 chars
- `email` — required, valid email, unique in users table
- `password` — required, min 8 chars
- `password_confirmation` — required, must match password
- `role` — required, one of: `student`, `trainer`, `company`

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 42,
      "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "email": "rahim@example.com",
      "role": "student",
      "status": "pending"
    },
    "message": "Registration successful. Please check your email to verify your account."
  }
}
```

**Error `422` (duplicate email):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

---

### POST `/auth/login`
**Auth:** None  
**Rate limit:** 5/min

**Request:**
```json
{
  "email": "rahim@example.com",
  "password": "SecurePass123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 42,
      "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "email": "rahim@example.com",
      "role": "student",
      "status": "active",
      "profile_photo": "https://cdn.mnexthire.com/avatars/42.jpg"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "dXJ0b2tlbi1yZWZyZXNo...",
      "expires_in": 900
    }
  }
}
```

**Error `401` (wrong credentials):**
```json
{
  "success": false,
  "message": "Invalid email or password."
}
```

**Error `403` (email not verified):**
```json
{
  "success": false,
  "message": "Please verify your email address before logging in."
}
```

**Error `403` (account suspended):**
```json
{
  "success": false,
  "message": "Your account has been suspended. Please contact support."
}
```

---

### POST `/auth/logout`
**Auth:** Bearer (any role)

**Request:** _(empty body)_

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully."
  }
}
```

---

### POST `/auth/refresh`
**Auth:** Refresh Token in body

**Request:**
```json
{
  "refresh_token": "dXJ0b2tlbi1yZWZyZXNo..."
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 900
  }
}
```

**Error `401` (expired/invalid refresh token):**
```json
{
  "success": false,
  "message": "Refresh token is expired or invalid. Please login again."
}
```

---

### POST `/auth/verify-email`
**Auth:** None

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "message": "Email verified successfully.",
    "user": {
      "id": 42,
      "email": "rahim@example.com",
      "status": "active"
    }
  }
}
```

**Error `422` (expired token):**
```json
{
  "success": false,
  "message": "Verification link has expired. Please request a new one."
}
```

---

### POST `/auth/forgot-password`
**Auth:** None

**Request:**
```json
{
  "email": "rahim@example.com"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "message": "Password reset link sent to your email."
  }
}
```

> Always returns 200 even if email not found (security: no user enumeration)

---

### POST `/auth/reset-password`
**Auth:** None

**Request:**
```json
{
  "token": "reset-token-from-email",
  "email": "rahim@example.com",
  "password": "NewSecurePass456",
  "password_confirmation": "NewSecurePass456"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully. Please login with your new password."
  }
}
```

**Error `422` (expired token):**
```json
{
  "success": false,
  "message": "Reset token is invalid or has expired."
}
```

---

### POST `/auth/google`
**Auth:** None

**Request:**
```json
{
  "code": "4/0AY0e-g7abcdef..."
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 43,
      "uuid": "b2c3d4e5-...",
      "email": "rahim@gmail.com",
      "role": "student",
      "status": "active"
    },
    "tokens": {
      "access_token": "eyJ...",
      "refresh_token": "dXJ...",
      "expires_in": 900
    },
    "is_new_user": true
  }
}
```

---

### POST `/auth/phone-otp`
**Auth:** Bearer (any role)

**Request:**
```json
{
  "phone": "+8801712345678"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "message": "OTP sent to +8801712345678",
    "expires_in": 300
  }
}
```

---

### POST `/auth/verify-otp`
**Auth:** Bearer (any role)

**Request:**
```json
{
  "phone": "+8801712345678",
  "otp": "482910"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "message": "Phone number verified successfully."
  }
}
```

**Error `422`:**
```json
{
  "success": false,
  "message": "Invalid or expired OTP."
}
```

---

## 2. Student

### GET `/students/me`
**Auth:** Student

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 42,
    "full_name": "Rahim Ahmed",
    "university": "BUET",
    "department": "Computer Science",
    "graduation_year": 2025,
    "skills": ["Python", "Django", "React", "PostgreSQL"],
    "preferred_job_role": "Backend Developer",
    "linkedin_url": "https://linkedin.com/in/rahimahmed",
    "github_url": "https://github.com/rahimahmed",
    "resume_path": "https://cdn.mnexthire.com/resumes/1/resume.pdf",
    "profile_completion": 85,
    "total_xp": 1450,
    "current_level": 4,
    "streak_days": 7,
    "country_code": "BD",
    "last_active_at": "2026-06-04T18:30:00Z",
    "user": {
      "id": 42,
      "email": "rahim@example.com",
      "profile_photo": "https://cdn.mnexthire.com/avatars/42.jpg"
    }
  }
}
```

---

### PUT `/students/me`
**Auth:** Student

**Request:**
```json
{
  "full_name": "Rahim Ahmed",
  "university": "BUET",
  "department": "Computer Science",
  "graduation_year": 2025,
  "skills": ["Python", "Django", "React"],
  "preferred_job_role": "Backend Developer",
  "linkedin_url": "https://linkedin.com/in/rahimahmed",
  "github_url": "https://github.com/rahimahmed",
  "country_code": "BD"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "message": "Profile updated successfully.",
    "profile_completion": 90,
    "xp_awarded": 150,
    "xp_event": "profile_complete"
  }
}
```

> `xp_awarded` and `xp_event` are included only if profile just hit 100% for the first time.

---

### POST `/students/me/resume`
**Auth:** Student  
**Content-Type:** `multipart/form-data`

**Request:**
```
file: resume.pdf   (PDF only, max 5MB)
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "resume_path": "https://cdn.mnexthire.com/resumes/1/resume_2026.pdf",
    "message": "Resume uploaded successfully."
  }
}
```

**Error `422` (wrong type):**
```json
{
  "success": false,
  "message": "Only PDF files are allowed.",
  "errors": {
    "file": ["The file must be a PDF."]
  }
}
```

**Error `422` (too large):**
```json
{
  "success": false,
  "message": "File too large.",
  "errors": {
    "file": ["The file may not be greater than 5120 kilobytes."]
  }
}
```

---

### GET `/students/me/dashboard`
**Auth:** Student

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_xp": 1450,
      "current_level": 4,
      "level_name": "Challenger",
      "next_level_xp": 2000,
      "xp_to_next_level": 550,
      "streak_days": 7,
      "profile_completion": 85,
      "upcoming_sessions": 2,
      "completed_sessions": 8,
      "global_rank": 342,
      "country_rank": 28
    },
    "upcoming_sessions": [
      {
        "id": 201,
        "scheduled_at": "2026-06-10T10:00:00Z",
        "duration_minutes": 60,
        "status": "scheduled",
        "trainer": {
          "full_name": "Karim Hossain",
          "profile_photo": "https://cdn.mnexthire.com/avatars/5.jpg"
        },
        "package": {
          "title": "Software Engineering Mock",
          "domain": "Software Engineering",
          "interview_type": "Technical"
        }
      }
    ],
    "recent_evaluations": [
      {
        "id": 15,
        "created_at": "2026-06-01T12:00:00Z",
        "overall_level": "intermediate",
        "communication_score": 7,
        "technical_score": 8,
        "confidence_score": 6,
        "problem_solving_score": 8,
        "english_score": 7,
        "hr_readiness_score": 6,
        "trainer": {
          "full_name": "Karim Hossain"
        }
      }
    ],
    "recent_badges": [
      {
        "id": 1,
        "slug": "first_interview",
        "name": "First Interview",
        "icon_path": "https://cdn.mnexthire.com/badges/first_interview.png",
        "unlocked_at": "2026-05-28T09:00:00Z"
      }
    ],
    "recommended_trainers": [
      {
        "id": 5,
        "full_name": "Karim Hossain",
        "average_rating": 4.9,
        "expertise_domains": ["Software Engineering", "DevOps"],
        "profile_photo": "https://cdn.mnexthire.com/avatars/5.jpg",
        "min_package_price": 500
      }
    ]
  }
}
```

---

### GET `/students/me/sessions`
**Auth:** Student  
**Query params:** `?status=upcoming|completed|cancelled&cursor=&per_page=10`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 201,
      "scheduled_at": "2026-06-10T10:00:00Z",
      "duration_minutes": 60,
      "status": "scheduled",
      "xp_awarded": 0,
      "meeting_link": null,
      "trainer": {
        "id": 5,
        "full_name": "Karim Hossain",
        "profile_photo": "https://cdn.mnexthire.com/avatars/5.jpg",
        "average_rating": 4.9
      },
      "package": {
        "title": "Software Engineering Mock",
        "domain": "Software Engineering",
        "interview_type": "Technical",
        "duration_minutes": 60
      },
      "payment": {
        "amount": 500,
        "currency": "BDT",
        "status": "completed"
      },
      "evaluation": null
    }
  ],
  "meta": {
    "per_page": 10,
    "next_cursor": "eyJpZCI6MjAwfQ==",
    "total": 8
  }
}
```

---

### GET `/students/me/evaluations`
**Auth:** Student  
**Query params:** `?cursor=&per_page=10`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "interview_id": 185,
      "communication_score": 7,
      "technical_score": 8,
      "confidence_score": 6,
      "problem_solving_score": 8,
      "english_score": 7,
      "hr_readiness_score": 6,
      "overall_level": "intermediate",
      "feedback_text": "Strong technical skills. Work on confidence during behavioral questions.",
      "created_at": "2026-06-01T12:00:00Z",
      "trainer": {
        "full_name": "Karim Hossain",
        "profile_photo": "https://cdn.mnexthire.com/avatars/5.jpg"
      },
      "package": {
        "title": "Software Engineering Mock",
        "domain": "Software Engineering"
      }
    }
  ],
  "meta": {
    "per_page": 10,
    "next_cursor": null,
    "total": 5
  }
}
```

---

### GET `/students/me/badges`
**Auth:** Student

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "earned": [
      {
        "id": 1,
        "slug": "first_interview",
        "name": "First Interview",
        "description": "Complete your first mock interview session",
        "icon_path": "https://cdn.mnexthire.com/badges/first_interview.png",
        "xp_reward": 25,
        "category": "milestone",
        "unlocked_at": "2026-05-28T09:00:00Z"
      }
    ],
    "locked": [
      {
        "id": 2,
        "slug": "hr_master",
        "name": "HR Master",
        "description": "Complete 5 HR interview sessions",
        "icon_path": "https://cdn.mnexthire.com/badges/hr_master.png",
        "xp_reward": 25,
        "category": "skill",
        "progress": {
          "current": 2,
          "required": 5,
          "label": "2/5 HR sessions completed"
        }
      }
    ],
    "total_earned": 1,
    "total_badges": 15
  }
}
```

---

### GET `/students/me/xp-history`
**Auth:** Student  
**Query params:** `?cursor=&per_page=20`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 88,
      "xp_amount": 100,
      "event_type": "complete_interview",
      "description": "Completed mock interview with Karim Hossain",
      "reference_id": 185,
      "created_at": "2026-06-01T12:00:00Z"
    },
    {
      "id": 87,
      "xp_amount": 25,
      "event_type": "badge_earned",
      "description": "Earned badge: First Interview",
      "reference_id": 1,
      "created_at": "2026-05-28T09:00:00Z"
    },
    {
      "id": 86,
      "xp_amount": 10,
      "event_type": "daily_login",
      "description": "Daily login bonus",
      "reference_id": null,
      "created_at": "2026-05-28T08:00:00Z"
    }
  ],
  "meta": {
    "per_page": 20,
    "next_cursor": "eyJpZCI6ODV9",
    "total_xp": 1450
  }
}
```

---

### GET `/students/{id}/public`
**Auth:** None

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "student_id": 1,
    "full_name": "Rahim Ahmed",
    "profile_photo": "https://cdn.mnexthire.com/avatars/42.jpg",
    "country_code": "BD",
    "total_xp": 1450,
    "current_level": 4,
    "level_name": "Challenger",
    "global_rank": 342,
    "country_rank": 28,
    "completed_sessions": 8,
    "skills": ["Python", "Django", "React"],
    "preferred_job_role": "Backend Developer",
    "badges": [
      {
        "slug": "first_interview",
        "name": "First Interview",
        "icon_path": "https://cdn.mnexthire.com/badges/first_interview.png",
        "unlocked_at": "2026-05-28T09:00:00Z"
      }
    ]
  }
}
```

---

## 3. Trainer (Public)

### GET `/trainers`
**Auth:** None  
**Query params:**

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Full-text search on name, bio, domains |
| `domain` | string | e.g. `Software Engineering` |
| `min_rating` | number | e.g. `4.0` |
| `max_price` | number | Max package price in BDT |
| `min_price` | number | Min package price in BDT |
| `language` | string | `English`, `Bangla`, `Both` |
| `difficulty` | string | `beginner`, `intermediate`, `advanced` |
| `sort` | string | `rating`, `price_asc`, `price_desc`, `sessions` |
| `per_page` | number | Max 50, default 20 |
| `cursor` | string | For cursor-based pagination |

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "full_name": "Karim Hossain",
      "bio": "Senior Software Engineer at Pathao with 7 years experience...",
      "expertise_domains": ["Software Engineering", "DevOps / Cloud"],
      "years_experience": 7,
      "average_rating": 4.9,
      "total_reviews": 142,
      "total_sessions": 320,
      "country_code": "BD",
      "profile_photo": "https://cdn.mnexthire.com/avatars/5.jpg",
      "min_package_price": 500,
      "packages_count": 3,
      "certifications": [
        { "name": "AWS Solutions Architect", "issuer": "Amazon" }
      ]
    }
  ],
  "meta": {
    "per_page": 20,
    "next_cursor": "eyJpZCI6NX0=",
    "total": 187
  }
}
```

---

### GET `/trainers/{id}`
**Auth:** None

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "full_name": "Karim Hossain",
    "bio": "Senior Software Engineer at Pathao with 7 years experience in backend systems and DevOps.",
    "expertise_domains": ["Software Engineering", "DevOps / Cloud"],
    "years_experience": 7,
    "certifications": [
      { "name": "AWS Solutions Architect", "issuer": "Amazon", "year": 2023 },
      { "name": "CKA", "issuer": "CNCF", "year": 2024 }
    ],
    "company_experience": [
      { "company": "Pathao", "role": "Senior Engineer", "years": 3 },
      { "company": "bKash", "role": "Software Engineer", "years": 4 }
    ],
    "average_rating": 4.9,
    "total_reviews": 142,
    "total_sessions": 320,
    "country_code": "BD",
    "profile_photo": "https://cdn.mnexthire.com/avatars/5.jpg",
    "packages": [
      {
        "id": 11,
        "title": "Backend Engineering Mock",
        "description": "Full system design + coding + behavioral in one session.",
        "price": 500,
        "session_count": 1,
        "duration_minutes": 60,
        "interview_type": "Technical",
        "domain": "Software Engineering",
        "difficulty": "intermediate",
        "language": "English",
        "is_live": true,
        "includes_cv_review": false,
        "is_active": true,
        "total_bookings": 89
      }
    ],
    "recent_reviews": [
      {
        "id": 55,
        "rating": 5,
        "comment": "Excellent session! Very detailed feedback.",
        "created_at": "2026-06-02T10:00:00Z",
        "student": {
          "full_name": "Sadia Islam",
          "profile_photo": null
        }
      }
    ],
    "rating_breakdown": {
      "5": 98,
      "4": 32,
      "3": 8,
      "2": 3,
      "1": 1
    }
  }
}
```

---

### GET `/trainers/{id}/availability`
**Auth:** None (publicly viewable)  
**Query params:** `?from=2026-06-10&to=2026-06-17`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 301,
      "date": "2026-06-10",
      "start_time": "10:00",
      "end_time": "11:00",
      "is_booked": false
    },
    {
      "id": 302,
      "date": "2026-06-10",
      "start_time": "14:00",
      "end_time": "15:00",
      "is_booked": true
    },
    {
      "id": 303,
      "date": "2026-06-11",
      "start_time": "09:00",
      "end_time": "10:00",
      "is_booked": false
    }
  ]
}
```

---

## 4. Trainer (Authenticated)

### GET `/trainers/me`
**Auth:** Trainer

**Response `200`:** _(same as GET /trainers/{id} but includes payout_info)_
```json
{
  "success": true,
  "data": {
    "id": 5,
    "full_name": "Karim Hossain",
    "is_approved": true,
    "approved_at": "2026-05-01T10:00:00Z",
    "payout_info": {
      "method": "bkash",
      "number": "01712345678"
    },
    "...all other trainer fields..."
  }
}
```

---

### PUT `/trainers/me`
**Auth:** Trainer

**Request:**
```json
{
  "full_name": "Karim Hossain",
  "bio": "Senior Software Engineer with 7 years experience...",
  "expertise_domains": ["Software Engineering", "DevOps / Cloud"],
  "years_experience": 7,
  "certifications": [
    { "name": "AWS Solutions Architect", "issuer": "Amazon", "year": 2023 }
  ],
  "company_experience": [
    { "company": "Pathao", "role": "Senior Engineer", "years": 3 }
  ],
  "hourly_rate": 800,
  "payout_info": {
    "method": "bkash",
    "number": "01712345678"
  }
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "message": "Profile updated successfully."
  }
}
```

---

### GET `/trainers/me/dashboard`
**Auth:** Trainer

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "this_month_earnings": 12500,
      "last_month_earnings": 18000,
      "total_earnings": 85000,
      "pending_payout": 6000,
      "total_sessions": 320,
      "average_rating": 4.9,
      "pending_evaluations": 3
    },
    "upcoming_sessions": [
      {
        "id": 210,
        "scheduled_at": "2026-06-10T10:00:00Z",
        "duration_minutes": 60,
        "status": "scheduled",
        "student": {
          "full_name": "Rahim Ahmed",
          "profile_photo": null
        },
        "package": {
          "title": "Backend Engineering Mock"
        }
      }
    ],
    "pending_evaluations": [
      {
        "id": 205,
        "completed_at": "2026-06-05T11:00:00Z",
        "student": {
          "full_name": "Sadia Islam"
        },
        "package": {
          "title": "Backend Engineering Mock"
        }
      }
    ],
    "monthly_earnings": [
      { "month": "2026-01", "amount": 15000 },
      { "month": "2026-02", "amount": 18500 },
      { "month": "2026-03", "amount": 12000 },
      { "month": "2026-04", "amount": 21000 },
      { "month": "2026-05", "amount": 18000 },
      { "month": "2026-06", "amount": 12500 }
    ],
    "recent_reviews": [
      {
        "rating": 5,
        "comment": "Excellent session!",
        "created_at": "2026-06-02T10:00:00Z",
        "student": { "full_name": "Sadia Islam" }
      }
    ]
  }
}
```

---

### GET `/trainers/me/earnings`
**Auth:** Trainer  
**Query params:** `?from=2026-01-01&to=2026-06-30`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_gross": 85000,
      "total_commission": 17000,
      "total_net": 68000,
      "pending_payout": 6000
    },
    "payouts": [
      {
        "id": 88,
        "amount": 8000,
        "commission_deducted": 2000,
        "net_amount": 8000,
        "method": "bkash",
        "status": "paid",
        "processed_at": "2026-06-03T02:00:00Z"
      }
    ]
  }
}
```

---

### GET `/trainers/me/packages`
**Auth:** Trainer

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 11,
      "title": "Backend Engineering Mock",
      "price": 500,
      "session_count": 1,
      "duration_minutes": 60,
      "interview_type": "Technical",
      "domain": "Software Engineering",
      "difficulty": "intermediate",
      "language": "English",
      "is_live": true,
      "includes_cv_review": false,
      "is_active": true,
      "total_bookings": 89
    }
  ]
}
```

---

### POST `/trainers/me/packages`
**Auth:** Trainer

**Request:**
```json
{
  "title": "System Design Deep Dive",
  "description": "60-minute session focused on system design interview preparation.",
  "price": 800,
  "session_count": 1,
  "duration_minutes": 60,
  "interview_type": "Technical",
  "domain": "Software Engineering",
  "difficulty": "advanced",
  "language": "English",
  "is_live": true,
  "includes_cv_review": false
}
```

**Validation rules:**
- `title` — required, min 5 chars, max 300 chars
- `price` — required, number, min 100 (BDT)
- `duration_minutes` — required, one of: 30, 45, 60
- `domain` — required, must be a valid domain from the domain list
- `difficulty` — required, one of: beginner, intermediate, advanced
- `interview_type` — required, min 2 chars

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": 15,
    "title": "System Design Deep Dive",
    "price": 800,
    "is_active": true,
    "total_bookings": 0
  }
}
```

---

### PUT `/trainers/me/packages/{id}`
**Auth:** Trainer (must own the package)

**Request:** _(same fields as POST, all optional)_
```json
{
  "price": 900,
  "is_active": false
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "message": "Package updated successfully."
  }
}
```

**Error `403`:**
```json
{
  "success": false,
  "message": "You do not own this package."
}
```

---

### DELETE `/trainers/me/packages/{id}`
**Auth:** Trainer (must own the package)

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "message": "Package deactivated successfully."
  }
}
```

> Packages are soft-deleted (set `is_active = false`), never hard-deleted

---

### GET `/trainers/me/sessions`
**Auth:** Trainer  
**Query params:** `?status=upcoming|completed|cancelled&cursor=&per_page=10`

**Response `200`:** _(same structure as `/students/me/sessions` but from trainer perspective)_

---

### POST `/trainers/me/availability`
**Auth:** Trainer

**Request:**
```json
{
  "slots": [
    {
      "date": "2026-06-15",
      "start_time": "10:00",
      "end_time": "11:00"
    },
    {
      "date": "2026-06-15",
      "start_time": "14:00",
      "end_time": "15:00"
    },
    {
      "date": "2026-06-16",
      "start_time": "09:00",
      "end_time": "10:00"
    }
  ]
}
```

**Validation:**
- `date` must be today or future
- `start_time` must be before `end_time`
- No overlapping slots for the same trainer on the same date

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "created": 3,
    "skipped": 0,
    "message": "Availability updated successfully."
  }
}
```

**Error `422` (overlap):**
```json
{
  "success": false,
  "message": "Slot conflict detected.",
  "errors": {
    "slots.0": ["Slot overlaps with an existing availability on 2026-06-15."]
  }
}
```

---

### POST `/trainers/me/evaluations/{interview_id}`
**Auth:** Trainer (must be the trainer of the interview)

**Request:**
```json
{
  "communication_score": 7,
  "technical_score": 9,
  "confidence_score": 6,
  "problem_solving_score": 8,
  "english_score": 7,
  "hr_readiness_score": 7,
  "overall_level": "intermediate",
  "feedback_text": "Rahim has strong technical knowledge. System design answers were solid. Needs to work on communicating thought process clearly during problem solving."
}
```

**Validation:**
- All 6 scores: required, integer 1–10
- `overall_level`: required, one of: not_ready, beginner, intermediate, advanced, industry_ready
- `feedback_text`: required, min 50 characters

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "evaluation_id": 55,
    "xp_awarded_to_student": 100,
    "bonus_xp": 300,
    "bonus_reason": "industry_ready_evaluation",
    "interview_status": "completed",
    "message": "Evaluation submitted. Student has been notified."
  }
}
```

> `bonus_xp` and `bonus_reason` only present if `overall_level = industry_ready`

**Error `409` (already evaluated):**
```json
{
  "success": false,
  "message": "This session has already been evaluated."
}
```

---

## 5. Booking

### POST `/bookings`
**Auth:** Student

**Request:**
```json
{
  "package_id": 11,
  "availability_id": 301
}
```

**Validation:**
- `package_id`: must exist and be active
- `availability_id`: must belong to the package's trainer and not be booked

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "interview_id": 220,
    "status": "pending_payment",
    "package": {
      "id": 11,
      "title": "Backend Engineering Mock",
      "price": 500,
      "currency": "BDT"
    },
    "trainer": {
      "full_name": "Karim Hossain"
    },
    "scheduled_at": "2026-06-15T10:00:00Z",
    "duration_minutes": 60
  }
}
```

**Error `409` (slot taken):**
```json
{
  "success": false,
  "message": "This time slot has already been booked. Please choose another slot."
}
```

---

### GET `/bookings/{id}`
**Auth:** Student or Trainer (must be participant)

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 220,
    "status": "scheduled",
    "scheduled_at": "2026-06-15T10:00:00Z",
    "duration_minutes": 60,
    "student": {
      "full_name": "Rahim Ahmed",
      "profile_photo": null
    },
    "trainer": {
      "full_name": "Karim Hossain",
      "profile_photo": "https://cdn.mnexthire.com/avatars/5.jpg"
    },
    "package": {
      "title": "Backend Engineering Mock",
      "domain": "Software Engineering",
      "interview_type": "Technical"
    },
    "payment": {
      "amount": 500,
      "currency": "BDT",
      "gateway": "sslcommerz",
      "status": "completed"
    }
  }
}
```

---

### POST `/bookings/{id}/cancel`
**Auth:** Student (must be the booking's student)

**Request:**
```json
{
  "reason": "Schedule conflict"
}
```

**Response `200` (within 24h — refund initiated):**
```json
{
  "success": true,
  "data": {
    "message": "Booking cancelled. Refund will be processed within 3–5 business days.",
    "refund_amount": 500,
    "currency": "BDT"
  }
}
```

**Error `422` (past 24h window):**
```json
{
  "success": false,
  "message": "Cancellation is only allowed within 24 hours of booking. This booking is not eligible for a refund."
}
```

**Error `422` (session already completed):**
```json
{
  "success": false,
  "message": "Cannot cancel a completed session."
}
```

---

## 6. Interview & Session

### GET `/interviews/{id}`
**Auth:** Student or Trainer (must be participant)

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 220,
    "status": "scheduled",
    "scheduled_at": "2026-06-15T10:00:00Z",
    "duration_minutes": 60,
    "meeting_link": "https://meet.mnexthire.com/interview_220_abc123",
    "agora_channel": "interview_220_abc123",
    "student": {
      "id": 1,
      "full_name": "Rahim Ahmed",
      "profile_photo": null,
      "resume_path": "https://cdn.mnexthire.com/resumes/1/resume.pdf",
      "skills": ["Python", "Django"],
      "preferred_job_role": "Backend Developer"
    },
    "trainer": {
      "id": 5,
      "full_name": "Karim Hossain",
      "profile_photo": "https://cdn.mnexthire.com/avatars/5.jpg"
    },
    "package": {
      "title": "Backend Engineering Mock",
      "interview_type": "Technical",
      "domain": "Software Engineering",
      "duration_minutes": 60
    }
  }
}
```

---

### POST `/interviews/{id}/join`
**Auth:** Student or Trainer (must be participant)

**Request:** _(empty body)_

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "agora_token": "006daf...AgB...",
    "agora_channel": "interview_220_abc123",
    "agora_uid": 42,
    "agora_app_id": "your-agora-app-id",
    "expires_at": "2026-06-15T12:00:00Z"
  }
}
```

**Error `403` (too early — more than 30min before):**
```json
{
  "success": false,
  "message": "You can only join within 30 minutes of the scheduled session time."
}
```

---

### POST `/interviews/{id}/complete`
**Auth:** Trainer (must be the session's trainer)

**Request:** _(empty body)_

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "interview_id": 220,
    "status": "completed",
    "completed_at": "2026-06-15T11:05:00Z",
    "xp_awarded": 100,
    "message": "Session marked as completed. Please submit your evaluation."
  }
}
```

**Error `409` (already completed):**
```json
{
  "success": false,
  "message": "This session has already been marked as completed."
}
```

---

## 7. Payment

### POST `/payments/initiate`
**Auth:** Student

**Request:**
```json
{
  "interview_id": 220,
  "gateway": "sslcommerz"
}
```

**Supported gateways:** `sslcommerz`, `bkash`, `nagad`, `stripe`, `paypal`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "payment_id": 99,
    "payment_url": "https://sandbox.sslcommerz.com/gwprocess/v4/image.php?Q=pay&SESSIONKEY=...",
    "amount": 500,
    "currency": "BDT",
    "gateway": "sslcommerz",
    "expires_in": 1800
  }
}
```

**Error `409` (already paid):**
```json
{
  "success": false,
  "message": "This booking has already been paid."
}
```

---

### POST `/payments/sslcommerz/callback`
**Auth:** None (signed via hash validation)

**Request:** _(SSLCommerz IPN payload — form-encoded)_
```
tran_id=NEXTHIRE_99_1749100000
val_id=2606051234567890
amount=500.00
card_type=VISA-Dutch Bangla
store_amount=500.00
currency=BDT
bank_tran_id=SSLCZ...
status=VALID
verify_sign=abc123hash...
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "message": "Payment confirmed."
  }
}
```

---

### POST `/payments/bkash/callback`
**Auth:** None (signed via bKash token)

**Request:** _(bKash callback payload)_
```json
{
  "paymentID": "TR00117291...",
  "trxID": "8RL30FD3VS",
  "transactionStatus": "Completed",
  "amount": "500",
  "currency": "BDT",
  "intent": "sale",
  "payerReference": "nexthire_interview_220"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": { "message": "Payment confirmed." }
}
```

---

### POST `/payments/stripe/webhook`
**Auth:** None (signed via `Stripe-Signature` header)

**Request:** _(Stripe webhook event body)_
```json
{
  "id": "evt_1234",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_1234",
      "amount": 500,
      "currency": "usd",
      "metadata": {
        "interview_id": "220",
        "payment_id": "99"
      }
    }
  }
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": { "message": "Webhook received." }
}
```

---

### GET `/payments/history`
**Auth:** Student or Trainer  
**Query params:** `?cursor=&per_page=20`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 99,
      "amount": 500,
      "commission": 0,
      "currency": "BDT",
      "gateway": "sslcommerz",
      "status": "completed",
      "invoice_path": "https://cdn.mnexthire.com/invoices/99.pdf",
      "created_at": "2026-06-05T09:30:00Z",
      "interview": {
        "id": 220,
        "scheduled_at": "2026-06-15T10:00:00Z",
        "trainer": { "full_name": "Karim Hossain" },
        "package": { "title": "Backend Engineering Mock" }
      }
    }
  ],
  "meta": {
    "per_page": 20,
    "next_cursor": null,
    "total": 8
  }
}
```

---

### GET `/payments/{id}/invoice`
**Auth:** Student (must be payer)

**Response:** PDF file download  
`Content-Type: application/pdf`  
`Content-Disposition: attachment; filename="invoice_99.pdf"`

---

### GET `/admin/payouts/pending`
**Auth:** Admin

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "payment_id": 99,
      "trainer": {
        "id": 5,
        "full_name": "Karim Hossain"
      },
      "net_amount": 400,
      "commission": 100,
      "payout_info": {
        "method": "bkash",
        "number": "01712345678"
      },
      "session_completed_at": "2026-06-05T11:00:00Z"
    }
  ],
  "meta": { "total_pending": 15, "total_amount": 28500 }
}
```

---

### POST `/admin/payouts/{id}/process`
**Auth:** Admin

**Request:** _(empty body — system uses trainer's saved payout_info)_

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "payment_id": 99,
    "amount_sent": 400,
    "method": "bkash",
    "message": "Payout processed successfully."
  }
}
```

---

## 8. Gamification

### GET `/leaderboard/global`
**Auth:** None  
**Query params:** `?per_page=50&cursor=`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "student_id": 101,
      "name": "Farhan Hasan",
      "avatar": "https://cdn.mnexthire.com/avatars/101.jpg",
      "xp": 14820,
      "level": 9,
      "level_name": "Master",
      "badges_count": 12,
      "completed_sessions": 68,
      "country": "BD",
      "is_me": false
    },
    {
      "rank": 2,
      "student_id": 88,
      "name": "Priya Sharma",
      "avatar": null,
      "xp": 13450,
      "level": 9,
      "level_name": "Master",
      "badges_count": 10,
      "completed_sessions": 61,
      "country": "IN",
      "is_me": false
    }
  ],
  "meta": {
    "per_page": 50,
    "next_cursor": "eyJyYW5rIjo1MX0=",
    "total": 9420
  }
}
```

---

### GET `/leaderboard/country/{code}`
**Auth:** None  
**Path params:** `code` = `BD`, `IN`, `PK`  
**Query params:** `?per_page=50&cursor=`

**Response `200`:** _(same structure as global, filtered by country)_

---

### GET `/leaderboard/me/rank`
**Auth:** Student

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "global_rank": 342,
    "country_rank": 28,
    "country_code": "BD",
    "total_xp": 1450,
    "current_level": 4,
    "level_name": "Challenger",
    "xp_to_next_level": 550,
    "next_level_name": "Achiever",
    "global_total_students": 9420,
    "country_total_students": 2810
  }
}
```

---

### GET `/badges`
**Auth:** None

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "slug": "first_interview",
      "name": "First Interview",
      "description": "Complete your first mock interview session.",
      "icon_path": "https://cdn.mnexthire.com/badges/first_interview.png",
      "xp_reward": 25,
      "category": "milestone",
      "unlock_condition": {
        "type": "sessions",
        "count": 1
      }
    },
    {
      "id": 2,
      "slug": "hr_master",
      "name": "HR Master",
      "description": "Complete 5 HR interview sessions.",
      "icon_path": "https://cdn.mnexthire.com/badges/hr_master.png",
      "xp_reward": 25,
      "category": "skill",
      "unlock_condition": {
        "type": "domain_sessions",
        "domain": "HR / Behavioral",
        "count": 5
      }
    }
  ]
}
```

---

### GET `/badges/me`
**Auth:** Student

**Response `200`:** _(same as `GET /students/me/badges`)_

---

### GET `/xp/levels`
**Auth:** None

**Response `200`:**
```json
{
  "success": true,
  "data": [
    { "level": 1,  "name": "Newcomer",       "xp_required": 0 },
    { "level": 2,  "name": "Explorer",        "xp_required": 200 },
    { "level": 3,  "name": "Learner",         "xp_required": 500 },
    { "level": 4,  "name": "Challenger",      "xp_required": 1000 },
    { "level": 5,  "name": "Achiever",        "xp_required": 2000 },
    { "level": 6,  "name": "Professional",    "xp_required": 3500 },
    { "level": 7,  "name": "Expert",          "xp_required": 5500 },
    { "level": 8,  "name": "Elite",           "xp_required": 8000 },
    { "level": 9,  "name": "Master",          "xp_required": 11500 },
    { "level": 10, "name": "Industry Ready",  "xp_required": 15000 }
  ]
}
```

---

## 9. Company

### POST `/companies/register`
**Auth:** None (also handles user creation)

**Request:**
```json
{
  "company_name": "Pathao Ltd.",
  "company_website": "https://pathao.com",
  "industry": "Technology",
  "company_size": "201-500",
  "hr_contact_name": "Nusrat Jahan",
  "hr_contact_email": "hr@pathao.com",
  "email": "hr@pathao.com",
  "password": "SecurePass123",
  "password_confirmation": "SecurePass123",
  "country_code": "BD"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "message": "Company registered. Please check your email to verify your account. Our team will review your KYC documents.",
    "company_id": 10,
    "user_id": 88
  }
}
```

---

### GET `/companies/me/dashboard`
**Auth:** Company

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "kyc_status": "verified",
    "is_verified": true,
    "stats": {
      "active_campaigns": 3,
      "total_candidates": 42,
      "interviews_conducted": 28,
      "hire_rate": 14.3
    },
    "active_campaigns": [
      {
        "id": 5,
        "title": "Backend Engineer Hiring 2026",
        "job_role": "Backend Engineer",
        "candidates_count": 12,
        "status": "active"
      }
    ],
    "recent_candidates": [
      {
        "student_id": 1,
        "full_name": "Rahim Ahmed",
        "stage": "shortlisted",
        "xp": 1450,
        "level": 4,
        "skills": ["Python", "Django"]
      }
    ]
  }
}
```

---

### GET `/companies/me/campaigns`
**Auth:** Company  
**Query params:** `?status=active|draft|archived&cursor=&per_page=10`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "title": "Backend Engineer Hiring 2026",
      "job_role": "Backend Engineer",
      "description": "Looking for experienced backend engineers...",
      "domain": "Software Engineering",
      "status": "active",
      "candidates_count": 12,
      "created_at": "2026-05-01T10:00:00Z"
    }
  ],
  "meta": { "per_page": 10, "next_cursor": null, "total": 3 }
}
```

---

### POST `/companies/me/campaigns`
**Auth:** Company

**Request:**
```json
{
  "title": "Frontend Engineer Hiring 2026",
  "job_role": "Frontend Engineer",
  "description": "We are looking for skilled frontend engineers to join our team.",
  "domain": "Software Engineering",
  "requirements": ["React", "TypeScript", "2+ years experience"]
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "title": "Frontend Engineer Hiring 2026",
    "status": "draft",
    "created_at": "2026-06-05T10:00:00Z"
  }
}
```

---

### POST `/companies/me/campaigns/{id}/invite`
**Auth:** Company

**Request:**
```json
{
  "student_id": 1,
  "message": "We'd love to invite you to interview for our Frontend Engineer role."
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "message": "Candidate invited successfully.",
    "candidate": {
      "student_id": 1,
      "full_name": "Rahim Ahmed",
      "stage": "invited"
    }
  }
}
```

**Error `409` (already invited):**
```json
{
  "success": false,
  "message": "This candidate has already been invited to this campaign."
}
```

---

### GET `/companies/me/candidates`
**Auth:** Company  
**Query params:** `?skill=&domain=&min_xp=&country_code=&cursor=&per_page=20`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "student_id": 1,
      "full_name": "Rahim Ahmed",
      "profile_photo": null,
      "skills": ["Python", "Django", "React"],
      "preferred_job_role": "Backend Developer",
      "total_xp": 1450,
      "current_level": 4,
      "level_name": "Challenger",
      "completed_sessions": 8,
      "average_score": 7.5,
      "country_code": "BD",
      "badges_count": 3
    }
  ],
  "meta": { "per_page": 20, "next_cursor": "eyJpZCI6MX0=", "total": 156 }
}
```

---

### PUT `/companies/me/candidates/{id}/status`
**Auth:** Company

**Request:**
```json
{
  "campaign_id": 5,
  "stage": "shortlisted",
  "notes": "Strong technical skills. Moving to final round."
}
```

**Allowed stages:** `invited` → `interviewed` → `shortlisted` → `hired` / `rejected`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "student_id": 1,
    "stage": "shortlisted",
    "message": "Candidate status updated."
  }
}
```

---

### GET `/companies/me/inbox`
**Auth:** Company  
**Query params:** `?cursor=&per_page=20`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 301,
      "student": {
        "id": 1,
        "full_name": "Rahim Ahmed",
        "profile_photo": null
      },
      "last_message": {
        "body": "Thank you for the invitation. I am very interested.",
        "sent_at": "2026-06-04T15:30:00Z",
        "is_from_company": false
      },
      "unread_count": 1
    }
  ]
}
```

---

### POST `/companies/me/inbox`
**Auth:** Company

**Request:**
```json
{
  "student_id": 1,
  "message": "We would like to schedule your interview for next Monday at 3 PM. Are you available?"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "message_id": 302,
    "sent_at": "2026-06-05T10:00:00Z"
  }
}
```

---

## 10. Admin

### GET `/admin/dashboard`
**Auth:** Admin

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "platform_stats": {
      "total_users": 4820,
      "active_students": 3910,
      "active_trainers": 312,
      "company_accounts": 48,
      "sessions_today": 28,
      "sessions_this_month": 842,
      "revenue_today_bdt": 14000,
      "revenue_this_month_bdt": 421000,
      "pending_trainer_approvals": 7,
      "pending_company_kyc": 3
    },
    "revenue_last_30_days": [
      { "date": "2026-05-07", "amount": 12000 },
      { "date": "2026-05-08", "amount": 18500 }
    ],
    "recent_activity": [
      {
        "type": "user_registered",
        "description": "New student registered: Farida Begum",
        "created_at": "2026-06-05T09:15:00Z"
      },
      {
        "type": "session_completed",
        "description": "Session completed: Rahim Ahmed with Karim Hossain",
        "created_at": "2026-06-05T09:00:00Z"
      }
    ],
    "pending_trainer_approvals": [
      {
        "id": 28,
        "full_name": "Tanvir Hossain",
        "expertise_domains": ["Cybersecurity"],
        "submitted_at": "2026-06-04T14:00:00Z"
      }
    ]
  }
}
```

---

### GET `/admin/users`
**Auth:** Admin  
**Query params:** `?role=student|trainer|company|admin&status=active|suspended|pending&search=&cursor=&per_page=20`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 42,
      "uuid": "a1b2c3d4-...",
      "email": "rahim@example.com",
      "role": "student",
      "status": "active",
      "profile_photo": null,
      "created_at": "2026-05-01T10:00:00Z",
      "profile": {
        "full_name": "Rahim Ahmed",
        "country_code": "BD"
      }
    }
  ],
  "meta": { "per_page": 20, "next_cursor": "eyJpZCI6NDJ9", "total": 4820 }
}
```

---

### PUT `/admin/users/{id}/status`
**Auth:** Admin

**Request:**
```json
{
  "status": "suspended",
  "reason": "Violation of terms of service."
}
```

**Allowed values:** `active`, `suspended`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "user_id": 42,
    "status": "suspended",
    "message": "User status updated. User has been notified."
  }
}
```

---

### GET `/admin/trainers/pending`
**Auth:** Admin  
**Query params:** `?cursor=&per_page=20`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 28,
      "user_id": 75,
      "full_name": "Tanvir Hossain",
      "email": "tanvir@example.com",
      "bio": "10 years in cybersecurity...",
      "expertise_domains": ["Cybersecurity"],
      "years_experience": 10,
      "certifications": [
        { "name": "CEH", "issuer": "EC-Council", "year": 2022 }
      ],
      "company_experience": [
        { "company": "BRAC Bank", "role": "Security Analyst", "years": 5 }
      ],
      "submitted_at": "2026-06-04T14:00:00Z"
    }
  ],
  "meta": { "per_page": 20, "next_cursor": null, "total": 7 }
}
```

---

### POST `/admin/trainers/{id}/approve`
**Auth:** Admin

**Request:** _(empty body)_

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "trainer_id": 28,
    "message": "Trainer approved. They have been notified and can now go live."
  }
}
```

---

### GET `/admin/companies/pending`
**Auth:** Admin

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "company_name": "Pathao Ltd.",
      "industry": "Technology",
      "registration_number": "BD-123456",
      "kyc_document_path": "https://cdn.mnexthire.com/kyc/10/doc.pdf",
      "hr_contact_name": "Nusrat Jahan",
      "hr_contact_email": "hr@pathao.com",
      "submitted_at": "2026-06-03T10:00:00Z"
    }
  ],
  "meta": { "total": 3 }
}
```

---

### POST `/admin/companies/{id}/verify`
**Auth:** Admin

**Request:** _(empty body)_

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "company_id": 10,
    "message": "Company verified. Verified badge awarded. Company notified."
  }
}
```

---

### GET `/admin/reports/revenue`
**Auth:** Admin  
**Query params:** `?from=2026-01-01&to=2026-06-30&group_by=day|week|month`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_revenue": 2450000,
      "total_commission": 490000,
      "total_payouts": 1960000,
      "total_sessions": 4820,
      "avg_session_value": 508
    },
    "by_period": [
      { "period": "2026-01", "revenue": 380000, "commission": 76000, "sessions": 750 },
      { "period": "2026-02", "revenue": 420000, "commission": 84000, "sessions": 820 }
    ],
    "by_gateway": [
      { "gateway": "sslcommerz", "amount": 1800000, "count": 3600 },
      { "gateway": "bkash",      "amount": 450000,  "count": 900 },
      { "gateway": "stripe",     "amount": 200000,  "count": 320 }
    ]
  }
}
```

---

### POST `/admin/badges`
**Auth:** Admin

**Request:**
```json
{
  "slug": "india_top_100",
  "name": "Top 100 India",
  "description": "Rank in the top 100 students in India.",
  "xp_reward": 25,
  "category": "milestone",
  "unlock_condition": {
    "type": "leaderboard_rank",
    "country": "IN",
    "rank": 100
  }
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": 16,
    "slug": "india_top_100",
    "name": "Top 100 India"
  }
}
```

---

### POST `/admin/notifications/broadcast`
**Auth:** Admin

**Request:**
```json
{
  "title": "Platform Maintenance Notice",
  "body": "NextHire will be under maintenance on June 8, 2026 from 2–4 AM UTC.",
  "target": "all",
  "roles": ["student", "trainer"],
  "channels": ["in_app", "email"]
}
```

**`target` options:** `all`, `students`, `trainers`, `companies`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "recipients": 4820,
    "channels": ["in_app", "email"],
    "message": "Broadcast queued for delivery."
  }
}
```

---

## 11. Notifications

### GET `/notifications`
**Auth:** Any authenticated user  
**Query params:** `?cursor=&per_page=20&unread_only=false`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1234",
      "type": "booking_confirmed",
      "title": "Booking Confirmed!",
      "body": "Your session with Karim Hossain is confirmed for June 15 at 10:00 AM.",
      "data": {
        "interview_id": 220,
        "url": "/student/sessions"
      },
      "read_at": null,
      "created_at": "2026-06-05T09:30:00Z"
    },
    {
      "id": "uuid-1235",
      "type": "badge_unlocked",
      "title": "Badge Unlocked: First Interview 🎉",
      "body": "You earned the First Interview badge and +25 XP!",
      "data": {
        "badge_slug": "first_interview",
        "xp_awarded": 25,
        "url": "/student/badges"
      },
      "read_at": "2026-06-01T10:00:00Z",
      "created_at": "2026-05-28T09:00:00Z"
    }
  ],
  "meta": {
    "per_page": 20,
    "next_cursor": null,
    "total": 14,
    "unread_count": 3
  }
}
```

---

### POST `/notifications/read-all`
**Auth:** Any authenticated user

**Request:** _(empty body)_

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "marked_read": 3,
    "message": "All notifications marked as read."
  }
}
```

---

### POST `/notifications/{id}/read`
**Auth:** Any authenticated user (must own notification)

**Request:** _(empty body)_

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "notification_id": "uuid-1234",
    "read_at": "2026-06-05T10:15:00Z"
  }
}
```

---

## Appendix A — Notification Types

| Type | Trigger |
|------|---------|
| `booking_confirmed` | Payment completed, session scheduled |
| `session_reminder` | 24h and 1h before session |
| `session_completed` | Trainer marks session done |
| `evaluation_submitted` | Trainer submits evaluation |
| `badge_unlocked` | Student earns a badge |
| `level_up` | Student reaches new XP level |
| `payout_processed` | Weekly payout sent to trainer |
| `trainer_approved` | Admin approves trainer account |
| `company_verified` | Admin verifies company KYC |
| `booking_cancelled` | Student cancels booking |
| `refund_processed` | Refund confirmed |
| `broadcast` | Admin sends platform-wide message |

---

## Appendix B — XP Events Reference

| Event Type | XP | Notes |
|------------|----|-------|
| `complete_interview` | +100 | Every completed session |
| `first_interview` | +200 | One-time bonus (added to the +100) |
| `industry_ready_eval` | +300 | Evaluation overall_level = industry_ready |
| `daily_login` | +10 | Once per calendar day |
| `streak_7_days` | +50 | 7 consecutive daily logins |
| `streak_30_days` | +200 | 30 consecutive daily logins |
| `badge_unlocked` | +25 | Per badge earned |
| `profile_complete` | +150 | One-time when profile hits 100% |
| `five_star_review` | +75 | Trainer receives a 5-star review |

---

## Appendix C — Error Codes Quick Reference

| HTTP | Scenario | Message |
|------|----------|---------|
| 401 | No token | `Unauthenticated. Please login.` |
| 401 | Expired access token | `Token has expired.` |
| 401 | Invalid refresh token | `Refresh token is expired or invalid.` |
| 403 | Wrong role | `Forbidden: insufficient permissions.` |
| 403 | Email not verified | `Please verify your email before logging in.` |
| 403 | Account suspended | `Your account has been suspended.` |
| 404 | Resource missing | `The requested resource was not found.` |
| 409 | Slot already booked | `This time slot has already been booked.` |
| 409 | Already evaluated | `This session has already been evaluated.` |
| 409 | Already paid | `This booking has already been paid.` |
| 422 | Validation failed | `Validation failed.` + `errors` object |
| 422 | Expired token | `Verification link has expired.` |
| 422 | Past refund window | `Cancellation not eligible for refund.` |
| 429 | Rate limit | `Too many requests. Please slow down.` |
| 500 | Server error | `An unexpected error occurred.` |

---

*NextHire API Endpoint Reference v1.0.0 — 2026-06-05*
