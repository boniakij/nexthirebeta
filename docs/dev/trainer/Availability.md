# Trainer Availability Calendar Module

Complete API documentation for managing trainer availability and booking rules.

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
