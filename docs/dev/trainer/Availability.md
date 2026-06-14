# Trainer Availability Calendar Module

Complete API documentation for managing trainer availability and booking rules.

## Implementation Status

✅ **MVP - COMPLETE (Backend)**

### What's Built

**Database Migrations**
- `2026_06_14_create_trainer_availability_tables.php` - 5 tables with proper indexing

**Models (Eloquent)**
- `TrainerAvailabilitySlot` - Individual bookable time slots
- `TrainerWeeklySchedule` - Recurring weekly availability
- `TrainerRecurringAvailabilityRule` - Advanced recurring patterns (phase 2)
- `TrainerBlockedDate` - Vacations, holidays, emergencies
- `TrainerBookingRule` - Trainer booking policies

**API Controllers**
- `TrainerAvailabilityController` - Calendar, slots, public search
- `TrainerWeeklyScheduleController` - Weekly schedule CRUD
- `TrainerBlockedDateController` - Blocked dates CRUD
- `TrainerBookingRuleController` - Booking policies

**Routes (10 endpoints)**
- GET/POST/DELETE slots
- GET/PUT weekly schedule
- GET/POST/DELETE blocked dates
- GET/PUT booking rules
- Public: GET available slots for students

### Validation Rules Implemented

✅ Start time < end time
✅ Slot duration: 15-480 minutes
✅ No overlapping slots
✅ Cannot delete booked slots
✅ Date must be today or future
✅ Blocked dates override weekly schedule

### Phase 2 (Future)

- [ ] Recurring rule UI
- [ ] Package-specific slots
- [ ] Automatic slot generation
- [ ] Time zone support
- [ ] Batch operations
- [ ] Availability analytics

### Files Modified

- `api/database/migrations/2026_06_14_create_trainer_availability_tables.php` - NEW
- `api/app/Models/TrainerAvailabilitySlot.php` - NEW
- `api/app/Models/TrainerWeeklySchedule.php` - NEW
- `api/app/Models/TrainerRecurringAvailabilityRule.php` - NEW
- `api/app/Models/TrainerBlockedDate.php` - NEW
- `api/app/Models/TrainerBookingRule.php` - NEW
- `api/app/Http/Controllers/V1/Trainer/TrainerAvailabilityController.php` - NEW
- `api/app/Http/Controllers/V1/Trainer/TrainerWeeklyScheduleController.php` - NEW
- `api/app/Http/Controllers/V1/Trainer/TrainerBlockedDateController.php` - NEW
- `api/app/Http/Controllers/V1/Trainer/TrainerBookingRuleController.php` - NEW
- `api/app/Models/Trainer.php` - UPDATED (added relationships)
- `api/routes/api.php` - UPDATED (added routes & imports)

## Endpoints

### Availability Slots

#### Get Calendar Data
```
GET /trainers/me/availability/calendar
Query Parameters:
- start_date: YYYY-MM-DD (required)
- end_date: YYYY-MM-DD (required)

Response:
{
  "success": true,
  "data": {
    "2026-06-30": [
      {
        "id": 1,
        "trainer_id": 15,
        "date": "2026-06-30",
        "start_time": "19:00:00",
        "end_time": "22:00:00",
        "slot_duration_minutes": 45,
        "status": "available",
        "booking_id": null
      }
    ]
  }
}
```

#### Add Availability Slot
```
POST /trainers/me/availability/slots

Body:
{
  "date": "2026-06-30",
  "start_time": "19:00",
  "end_time": "22:00",
  "slot_duration_minutes": 45
}

Response: 201
{
  "success": true,
  "message": "Availability slot created",
  "data": { ... }
}
```

#### Delete Availability Slot
```
DELETE /trainers/me/availability/slots/{slotId}

Response: 200
{
  "success": true,
  "message": "Slot deleted"
}
```

#### Get Available Slots (Public)
```
GET /trainers/{trainerId}/availability/slots?date=2026-06-30

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "trainer_id": 15,
      "date": "2026-06-30",
      "start_time": "19:00",
      "end_time": "19:45",
      "status": "available"
    }
  ]
}
```

### Weekly Schedule

#### Get Schedule
```
GET /trainers/me/availability/weekly-schedule

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "trainer_id": 15,
      "day_of_week": 1,
      "is_available": true,
      "start_time": "19:00",
      "end_time": "22:00",
      "slot_duration_minutes": 45,
      "buffer_minutes": 15,
      "status": "active"
    }
  ]
}
```

#### Update Schedule
```
PUT /trainers/me/availability/weekly-schedule

Body:
{
  "schedule": [
    {
      "day_of_week": 1,
      "is_available": true,
      "start_time": "19:00",
      "end_time": "22:00",
      "slot_duration_minutes": 45,
      "buffer_minutes": 15
    }
  ]
}

Response:
{
  "success": true,
  "message": "Weekly schedule updated"
}
```

### Blocked Dates

#### Get Blocked Dates
```
GET /trainers/me/availability/blocked-dates

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "trainer_id": 15,
      "block_type": "public_holiday",
      "date": "2026-06-16",
      "is_full_day": true,
      "reason": "Eid holiday"
    }
  ]
}
```

#### Block Date
```
POST /trainers/me/availability/blocked-dates

Body:
{
  "block_type": "public_holiday",
  "date": "2026-06-16",
  "is_full_day": true,
  "reason": "Eid holiday",
  "cancel_existing_bookings": false
}

Response: 201
{
  "success": true,
  "message": "Date blocked successfully",
  "data": { ... }
}
```

#### Remove Blocked Date
```
DELETE /trainers/me/availability/blocked-dates/{blockedDateId}

Response:
{
  "success": true,
  "message": "Blocked date removed"
}
```

### Booking Rules

#### Get Rules
```
GET /trainers/me/availability/booking-rules

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "trainer_id": 15,
    "minimum_notice_hours": 6,
    "max_booking_days_ahead": 30,
    "allow_same_day_booking": false,
    "allow_reschedule": true,
    "max_reschedule_count": 1,
    "reschedule_deadline_hours": 12,
    "allow_cancellation": true,
    "cancellation_deadline_hours": 24,
    "auto_confirm_paid_bookings": true,
    "timezone": "UTC"
  }
}
```

#### Update Rules
```
PUT /trainers/me/availability/booking-rules

Body:
{
  "minimum_notice_hours": 6,
  "max_booking_days_ahead": 30,
  "allow_same_day_booking": false,
  "allow_reschedule": true,
  "max_reschedule_count": 1,
  "reschedule_deadline_hours": 12,
  "allow_cancellation": true,
  "cancellation_deadline_hours": 24,
  "auto_confirm_paid_bookings": true,
  "timezone": "UTC"
}

Response:
{
  "success": true,
  "message": "Booking rules updated",
  "data": { ... }
}
```

## Slot Statuses

- available: Student can book
- reserved: Temporarily held during payment
- booked: Payment completed
- blocked: Trainer blocked
- expired: Time passed
- cancelled: Booking cancelled
- unavailable: Disabled

## Validation Rules

1. Start time < end time
2. Slot duration: 15-480 minutes
3. No overlapping slots
4. Cannot delete booked slots
5. Date must be today or future
6. Reserved slots auto-expire
7. Blocked dates override weekly schedule
8. Minimum notice enforced
9. Maximum booking window enforced

---

## Usage Guide

### 1. Set Weekly Schedule (Trainer)

```bash
PUT /trainers/me/availability/weekly-schedule

Body:
{
  "schedule": [
    {
      "day_of_week": 1,      # Monday
      "is_available": true,
      "start_time": "19:00",
      "end_time": "22:00",
      "slot_duration_minutes": 45,
      "buffer_minutes": 15
    },
    {
      "day_of_week": 2,      # Tuesday
      "is_available": true,
      "start_time": "20:00",
      "end_time": "23:00",
      "slot_duration_minutes": 45,
      "buffer_minutes": 15
    },
    {
      "day_of_week": 3,      # Wednesday
      "is_available": false
    }
  ]
}
```

### 2. Add One-Time Slot (Trainer)

```bash
POST /trainers/me/availability/slots

Body:
{
  "date": "2026-06-30",
  "start_time": "19:00",
  "end_time": "22:00",
  "slot_duration_minutes": 45
}
```

### 3. Block Date (Trainer)

```bash
POST /trainers/me/availability/blocked-dates

Body:
{
  "block_type": "public_holiday",
  "date": "2026-06-16",
  "is_full_day": true,
  "reason": "Eid holiday"
}
```

### 4. Set Booking Rules (Trainer)

```bash
PUT /trainers/me/availability/booking-rules

Body:
{
  "minimum_notice_hours": 6,
  "max_booking_days_ahead": 30,
  "allow_same_day_booking": false,
  "allow_reschedule": true,
  "max_reschedule_count": 1,
  "reschedule_deadline_hours": 12,
  "allow_cancellation": true,
  "cancellation_deadline_hours": 24,
  "auto_confirm_paid_bookings": true,
  "timezone": "UTC"
}
```

### 5. View Available Slots (Student - Public)

```bash
GET /trainers/{trainerId}/availability/slots?date=2026-06-30&days_ahead=30

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "trainer_id": 15,
      "date": "2026-06-30",
      "start_time": "19:00",
      "end_time": "19:45",
      "slot_duration_minutes": 45,
      "status": "available"
    },
    {
      "id": 2,
      "trainer_id": 15,
      "date": "2026-06-30",
      "start_time": "20:00",
      "end_time": "20:45",
      "slot_duration_minutes": 45,
      "status": "available"
    }
  ]
}
```

### 6. Book Slot (Student)

```bash
POST /bookings

Body:
{
  "slot_id": 1,
  "package_id": 22,
  "notes": "HR interview prep"
}

Response:
{
  "success": true,
  "data": {
    "booking_id": 101,
    "slot_id": 1,
    "status": "reserved",
    "reserved_until": "2026-06-14T11:30:00Z"  # 15 min window to complete payment
  }
}
```

---

## Integration Checklist

**Backend (MVP Complete)**
- [x] Database migrations created
- [x] Eloquent models created
- [x] API controllers created
- [x] Routes defined (10 endpoints)
- [x] Validation rules implemented

**Frontend (MVP Complete)**
- [x] Availability calendar UI page
- [x] Weekly schedule form
- [x] Add slot form
- [x] Block date form
- [x] Booking rules form
- [x] Tab navigation interface

**Future (Phase 2)**
- [ ] Recurring rule UI
- [ ] Package-specific slots
- [ ] Automatic slot generation
- [ ] Student slot selection UI
- [ ] API client methods integration
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Calendar visualization
- [ ] Availability analytics
