Here is a complete **Trainer Availability Calendar Module** idea for the NextHire trainer panel.

## Availability Calendar Menu

```text
Trainer Panel
  - Dashboard
  - My Profile
  - Packages
  - Availability
      - Calendar View
      - Weekly Schedule
      - Add Time Slots
      - Recurring Availability
      - Blocked Dates / Holidays
      - Booking Rules
      - Availability Settings
  - Sessions
  - Bookings
  - Evaluations
  - Earnings
  - Withdrawals
```

## Availability Module Purpose

The trainer uses this module to control when students can book sessions. Students can only book slots that are active, available, not expired, not blocked, and not already booked.

```text
Trainer sets weekly availability
        ↓
System generates bookable time slots
        ↓
Student selects a package
        ↓
Student sees only matching open slots
        ↓
Student books and pays
        ↓
Slot becomes booked/unavailable
```

## Main Availability Calendar UI

```text
------------------------------------------------------------
Availability Calendar
------------------------------------------------------------

[ Calendar View ] [ Weekly Schedule ] [ Add Slot ] [ Block Dates ]

Month: June 2026                         [ < ] [ Today ] [ > ]

Sun        Mon        Tue        Wed        Thu        Fri        Sat
-----------------------------------------------------------------------
           1          2          3          4          5          6
           7-10 PM    Blocked              8-10 PM

7          8          9          10         11         12         13
           7-10 PM               Booked     8-10 PM

14         15         16         17         18         19         20
           Holiday    7-10 PM              8-10 PM

Legend:
[ Available ] [ Booked ] [ Blocked ] [ Holiday ] [ Expired ]

------------------------------------------------------------
Quick Actions
------------------------------------------------------------
[ + Add Time Slot ] [ Set Weekly Schedule ] [ Block Date ]
------------------------------------------------------------
```

## Weekly Schedule UI

```text
------------------------------------------------------------
Weekly Schedule
------------------------------------------------------------

Set your regular weekly available hours.

Monday
[ ✓ Available ]  From [ 7:00 PM ] To [ 10:00 PM ]
[ + Add Another Time Range ]

Tuesday
[ ✓ Available ]  From [ 8:00 PM ] To [ 11:00 PM ]

Wednesday
[ ] Not Available

Thursday
[ ✓ Available ]  From [ 7:00 PM ] To [ 9:00 PM ]

Friday
[ ✓ Available ]  From [ 4:00 PM ] To [ 8:00 PM ]

Saturday
[ ] Not Available

Sunday
[ ] Not Available

Slot Duration
[ 30 min | 45 min | 60 min ]

Buffer Time Between Sessions
[ 0 min | 10 min | 15 min | 30 min ]

Advance Booking Notice
[ 2 hours | 6 hours | 12 hours | 24 hours ]

Booking Window
Students can book up to [ 30 ] days in advance.

[ Save Weekly Schedule ]
------------------------------------------------------------
```

## Add Custom Time Slot UI

```text
------------------------------------------------------------
Add Time Slot
------------------------------------------------------------

Date *
[ 30 Jun 2026 ]

Start Time *
[ 7:00 PM ]

End Time *
[ 10:00 PM ]

Slot Duration *
[ 45 minutes ]

Buffer Time
[ 15 minutes ]

Repeat
[ Does Not Repeat v ]

Repeat Options:
- Does Not Repeat
- Daily
- Weekly
- Custom

Apply To Package Type
[ All Packages v ]

Status
[ Active ]

[ Cancel ]                         [ Save Slot ]
------------------------------------------------------------
```

## Recurring Availability UI

```text
------------------------------------------------------------
Recurring Availability
------------------------------------------------------------

Rule Name *
[ Evening Interview Slots ]

Repeat *
[ Weekly ]

Repeat On *
[ Monday ] [ Tuesday ] [ Thursday ]

Start Date *
[ 01 Jun 2026 ]

End Date
[ 30 Sep 2026 ]

Time Range
From [ 7:00 PM ] To [ 10:00 PM ]

Slot Duration
[ 45 min ]

Buffer Time
[ 15 min ]

[ Save Recurring Rule ]
------------------------------------------------------------
```

## Blocked Dates / Holidays UI

```text
------------------------------------------------------------
Blocked Dates / Holidays
------------------------------------------------------------

Block Type *
[ Personal Leave | Public Holiday | Emergency | Vacation ]

Date *
[ 16 Jun 2026 ]

Start Time
[ Full Day v ]

Reason
[ Eid holiday ]

Cancel Existing Bookings?
[ No v ]

[ Block Date ]

------------------------------------------------------------
Blocked List
------------------------------------------------------------

Date          Type              Time        Reason        Action
16 Jun 2026   Public Holiday    Full Day    Eid holiday   [ Remove ]
22 Jun 2026   Personal Leave    7-10 PM     Family work   [ Remove ]
------------------------------------------------------------
```

## Booking Rules UI

```text
------------------------------------------------------------
Booking Rules
------------------------------------------------------------

Minimum Notice Before Booking
[ 6 hours ]

Maximum Days Ahead Student Can Book
[ 30 days ]

Allow Same-Day Booking?
[ Yes / No ]

Allow Student Reschedule?
[ Yes / No ]

Maximum Reschedule Count
[ 1 ]

Reschedule Deadline
[ 12 hours before session ]

Allow Cancellation?
[ Yes / No ]

Cancellation Deadline
[ 24 hours before session ]

Auto-confirm Paid Bookings?
[ Yes / No ]

[ Save Booking Rules ]
------------------------------------------------------------
```

## Student Slot Selection UI

```text
------------------------------------------------------------
Select Session Time
------------------------------------------------------------

Package: HR Mock Interview
Duration: 45 minutes
Trainer: Rahim Uddin

Available Dates:
[ Today ] [ Tomorrow ] [ Fri 30 Jun ] [ Sat 01 Jul ]

Available Slots:
[ 7:00 PM - 7:45 PM ]
[ 8:00 PM - 8:45 PM ]
[ 9:00 PM - 9:45 PM ]

[ Back ]                         [ Continue to Payment ]
------------------------------------------------------------
```

## Slot Statuses

```text
available
reserved
booked
blocked
expired
cancelled
unavailable
```

Status meaning:

```text
available    = student can book
reserved     = temporarily held during payment
booked       = payment completed and booking confirmed
blocked      = trainer/admin blocked this time
expired      = slot time passed
cancelled    = booking cancelled
unavailable  = trainer disabled this slot
```

## Availability APIs

```text
Trainer Availability APIs

GET     /trainers/me/availability
POST    /trainers/me/availability
PUT     /trainers/me/availability/{id}
DELETE  /trainers/me/availability/{id}

GET     /trainers/me/availability/calendar
GET     /trainers/me/availability/weekly-schedule
POST    /trainers/me/availability/weekly-schedule
PUT     /trainers/me/availability/weekly-schedule/{id}

POST    /trainers/me/availability/recurring-rules
GET     /trainers/me/availability/recurring-rules
PUT     /trainers/me/availability/recurring-rules/{id}
DELETE  /trainers/me/availability/recurring-rules/{id}

POST    /trainers/me/availability/block-dates
GET     /trainers/me/availability/block-dates
DELETE  /trainers/me/availability/block-dates/{id}

GET     /trainers/me/availability/booking-rules
PUT     /trainers/me/availability/booking-rules
```

## Student Availability APIs

```text
GET     /trainers/{trainer_id}/availability
GET     /trainers/{trainer_id}/available-slots?package_id=22&date=2026-06-30
POST    /bookings
```

## Admin Availability APIs

```text
GET     /admin/trainers/{trainer_id}/availability
POST    /admin/trainers/{trainer_id}/availability/block
DELETE  /admin/trainers/{trainer_id}/availability/block/{id}
```

## Create Availability Request

```json
{
  "date": "2026-06-30",
  "start_time": "19:00",
  "end_time": "22:00",
  "slot_duration_minutes": 45,
  "buffer_minutes": 15,
  "repeat": "none",
  "package_scope": "all",
  "status": "active"
}
```

## Create Availability Response

```json
{
  "success": true,
  "message": "Availability slots created successfully.",
  "data": {
    "availability_id": 501,
    "trainer_id": 15,
    "date": "2026-06-30",
    "slots_created": 3,
    "slots": [
      {
        "slot_id": 901,
        "start_time": "19:00",
        "end_time": "19:45",
        "status": "available"
      },
      {
        "slot_id": 902,
        "start_time": "20:00",
        "end_time": "20:45",
        "status": "available"
      },
      {
        "slot_id": 903,
        "start_time": "21:00",
        "end_time": "21:45",
        "status": "available"
      }
    ]
  }
}
```

## Database Tables

```text
trainer_availability
- id
- trainer_id
- date
- start_time
- end_time
- slot_duration_minutes
- buffer_minutes
- package_scope
- status
- created_at
- updated_at
```

```text
trainer_availability_slots
- id
- trainer_id
- availability_id
- package_id
- start_datetime
- end_datetime
- status
- reserved_until
- booking_id
- created_at
- updated_at
```

```text
trainer_weekly_schedules
- id
- trainer_id
- day_of_week
- is_available
- start_time
- end_time
- slot_duration_minutes
- buffer_minutes
- timezone
- status
- created_at
- updated_at
```

```text
trainer_recurring_availability_rules
- id
- trainer_id
- rule_name
- repeat_type
- repeat_days_json
- start_date
- end_date
- start_time
- end_time
- slot_duration_minutes
- buffer_minutes
- package_scope
- status
- created_at
- updated_at
```

```text
trainer_blocked_dates
- id
- trainer_id
- block_type
- date
- start_time
- end_time
- is_full_day
- reason
- created_by
- created_at
- updated_at
```

```text
trainer_booking_rules
- id
- trainer_id
- minimum_notice_hours
- max_booking_days_ahead
- allow_same_day_booking
- allow_reschedule
- max_reschedule_count
- reschedule_deadline_hours
- allow_cancellation
- cancellation_deadline_hours
- auto_confirm_paid_bookings
- timezone
- created_at
- updated_at
```

## Validation Rules

```text
- Trainer must be approved before publishing availability.
- Start time must be before end time.
- Slot duration must match package duration or be greater than package duration.
- Buffer time should be added between generated slots.
- Trainer cannot create overlapping availability slots.
- Trainer cannot delete a booked slot.
- Trainer can block a date only if no active booking exists, unless admin allows cancellation.
- Student cannot book expired slot.
- Student cannot book reserved slot.
- Reserved slot should expire if payment is not completed within 10-15 minutes.
- Booked slot cannot be selected by another student.
- Same-day booking follows trainer booking rules.
- Availability should respect trainer timezone.
- Public holiday or blocked dates override weekly availability.
- Cancelled booking can release the slot depending on cancellation policy.
```

## Best MVP Version

For MVP, build these first:

```text
1. Weekly Schedule
2. Add One-Time Slot
3. Calendar View
4. Block Date
5. Student Available Slot API
6. Booking slot lock/reserve system
```

The advanced recurring rules, package-specific slots, and detailed booking policies can come in Phase 2.
