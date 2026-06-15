# NextHire XP & Badges Module

## Module Purpose

The XP & Badges module motivates students and trainers by rewarding activity, progress, and achievement.

Students earn XP by completing mock interviews, receiving strong evaluations, daily login, profile completion, badges, and reviews.

Trainers can also earn XP or achievement badges based on sessions completed, ratings, profile quality, and student reviews.

---

# 1. User Roles

## Student

Student can:

```text
- Earn XP
- Level up
- Unlock badges
- View badge collection
- View XP history
- View leaderboard rank
- View progress on dashboard
```

## Trainer

Trainer can:

```text
- Earn trainer achievement badges
- Earn XP from completed sessions and 5-star reviews
- View trainer badge collection
- Show badges on public trainer profile
```

## Admin

Admin can:

```text
- Create badges
- Edit badges
- Set XP rules
- Set badge unlock conditions
- Enable or disable badges
- View XP logs
- Manually adjust XP if needed
```

---

# 2. Student XP Events

```text
Complete first interview                  +200 XP
Complete any interview                    +100 XP
Receive Industry Ready evaluation          +300 XP
Daily login                                +10 XP
7-day login streak                         +50 XP
30-day login streak                        +200 XP
Unlock any badge                           +25 XP
Complete profile 100%                      +150 XP
Submit trainer review                      +20 XP
Book first session                         +50 XP
Upload resume                              +30 XP
Complete CV review session                 +80 XP
```

---

# 3. Trainer XP Events

```text
Complete first trainer session             +200 XP
Complete any trainer session               +100 XP
Receive 5-star review                      +75 XP
Create first package                       +50 XP
Complete trainer profile 100%              +150 XP
Reach 10 completed sessions                +300 XP
Reach 50 completed sessions                +1000 XP
Maintain 4.8+ rating with 25 sessions       +500 XP
```

---

# 4. Level System

```text
Level 1   Newcomer             0 XP
Level 2   Explorer             200 XP
Level 3   Learner              500 XP
Level 4   Challenger           1,000 XP
Level 5   Achiever             2,000 XP
Level 6   Professional         3,500 XP
Level 7   Expert               5,500 XP
Level 8   Elite                8,000 XP
Level 9   Master               11,500 XP
Level 10  Industry Ready       15,000+ XP
```

## Level Progress UI

```text
------------------------------------------------------------
Career Progress
------------------------------------------------------------

Level 5: Achiever

XP: 2,450 / 3,500

[ ███████████░░░░░░ ] 70%

1,050 XP needed to reach Level 6: Professional

------------------------------------------------------------
```

---

# 5. Badge Categories

```text
Achievement Badges
Skill Badges
Milestone Badges
Streak Badges
Profile Badges
Interview Badges
Trainer Badges
Special Badges
```

---

# 6. Student Badge Library

## Interview Badges

```text
First Interview
Condition: Complete first mock interview
Reward: +200 XP

10 Interviews
Condition: Complete 10 sessions
Reward: +300 XP

50 Interviews
Condition: Complete 50 sessions
Reward: +1000 XP
```

## Skill Badges

```text
HR Master
Condition: Complete 5 HR interview sessions
Reward: +250 XP

Coding Expert
Condition: Score 9+ in technical score on 3 sessions
Reward: +300 XP

Communication Ace
Condition: Score 9+ in communication on 5 sessions
Reward: +300 XP

Company Ready
Condition: Receive Industry Ready evaluation
Reward: +300 XP
```

## Streak Badges

```text
7-Day Streak
Condition: Login 7 consecutive days
Reward: +50 XP

30-Day Streak
Condition: Login 30 consecutive days
Reward: +200 XP
```

## Profile Badges

```text
Profile Champion
Condition: Complete profile 100%
Reward: +150 XP

Resume Ready
Condition: Upload resume
Reward: +30 XP

LinkedIn Ready
Condition: Add LinkedIn URL
Reward: +30 XP
```

## Leaderboard Badges

```text
Top 100 Bangladesh
Condition: Rank in Bangladesh top 100
Reward: +500 XP

Global Top Performer
Condition: Rank in global top 500
Reward: +500 XP
```

---

# 7. Trainer Badge Library

```text
Verified Trainer
Condition: Admin approves trainer profile
Reward: +100 XP

First Session Completed
Condition: Complete first paid session
Reward: +200 XP

Top Rated Trainer
Condition: Maintain 4.8+ rating after 25 sessions
Reward: +500 XP

Popular Trainer
Condition: Complete 100 sessions
Reward: +1500 XP

Package Creator
Condition: Create first active package
Reward: +50 XP

Student Favorite
Condition: Receive 20 five-star reviews
Reward: +700 XP

Fast Responder
Condition: Respond to 90% booking messages within 2 hours
Reward: +300 XP

Earning Milestone
Condition: Earn ৳100,000 total trainer revenue
Reward: +1000 XP
```

---

# 8. Student Dashboard XP Widget

```text
------------------------------------------------------------
Your Career Progress
------------------------------------------------------------

Level 6: Professional
XP: 4,250 / 5,500

[ █████████████░░░░ ] 77%

Badges Earned: 8
Current Rank: #124 Bangladesh

Latest Badge:
Communication Ace

[ View XP History ] [ View Badges ]
------------------------------------------------------------
```

---

# 9. Badge Collection UI

```text
------------------------------------------------------------
My Badges
------------------------------------------------------------

Filters:
[ All ] [ Earned ] [ Locked ] [ Interview ] [ Skill ] [ Streak ]

------------------------------------------------------------

[ Earned Badge ]
🏆 First Interview
Completed first mock interview
Reward: +200 XP
Unlocked: 25 Jun 2026

[ Earned Badge ]
🎯 HR Master
Completed 5 HR sessions
Reward: +250 XP
Unlocked: 30 Jun 2026

[ Locked Badge ]
🔒 Coding Expert
Score 9+ in technical on 3 sessions
Progress: 1 / 3

[ Locked Badge ]
🔒 10 Interviews
Complete 10 sessions
Progress: 6 / 10

------------------------------------------------------------
```

---

# 10. XP History UI

```text
------------------------------------------------------------
XP History
------------------------------------------------------------

Date          Event                       XP
01 Jul 2026   Completed HR Interview      +100
01 Jul 2026   Unlocked HR Master Badge    +250
30 Jun 2026   Daily Login                 +10
29 Jun 2026   Uploaded Resume             +30

Total XP: 4,250
------------------------------------------------------------
```

---

# 11. Admin XP Rule Management UI

```text
------------------------------------------------------------
XP Rules
------------------------------------------------------------

Rule Name                         Event Type              XP      Status
Complete Interview                session_complete        100     Active
First Interview Bonus             first_interview         200     Active
Daily Login                       daily_login             10      Active
Profile Complete                  profile_100             150     Active
Trainer 5-Star Review             trainer_5_star_review   75      Active

[ + Add XP Rule ]
------------------------------------------------------------
```

## Add XP Rule Form

```text
------------------------------------------------------------
Add XP Rule
------------------------------------------------------------

Rule Name *
[ Complete Interview ]

Applies To *
[ Student v ]

Event Type *
[ session_complete v ]

XP Amount *
[ 100 ]

Frequency Limit
[ Once per event v ]

Max Award Per Day
[ Optional ]

Status
[ Active ]

[ Save Rule ]
------------------------------------------------------------
```

---

# 12. Admin Badge Management UI

```text
------------------------------------------------------------
Badge Management
------------------------------------------------------------

Badge Name              Category       XP Reward     Status
First Interview         Interview      200           Active
HR Master               Skill          250           Active
Profile Champion        Profile        150           Active
Top Rated Trainer       Trainer        500           Active

[ + Create Badge ]
------------------------------------------------------------
```

## Create Badge Form

```text
------------------------------------------------------------
Create Badge
------------------------------------------------------------

Badge Name *
[ HR Master ]

Badge Slug *
[ hr_master ]

Category *
[ Skill v ]

Description *
[ Complete 5 HR interview sessions ]

Icon
[ Upload Icon ]

XP Reward
[ 250 ]

Applies To *
[ Student v ]

Unlock Condition Type *
[ Session Count v ]

Condition JSON
{
  "type": "domain_sessions",
  "domain": "HR Interview",
  "count": 5
}

Status
[ Active ]

[ Save Badge ]
------------------------------------------------------------
```

---

# 13. API Endpoints

## Student XP APIs

```http
GET /students/me/xp-summary
GET /students/me/xp-history
GET /students/me/badges
GET /students/me/badges/{badge_id}
GET /leaderboard/me/rank
```

## Trainer XP APIs

```http
GET /trainers/me/xp-summary
GET /trainers/me/xp-history
GET /trainers/me/badges
GET /trainers/{id}/badges
```

## Public APIs

```http
GET /badges
GET /xp/levels
GET /leaderboard/global
GET /leaderboard/country/{code}
```

## Admin XP APIs

```http
GET    /admin/xp-rules
POST   /admin/xp-rules
GET    /admin/xp-rules/{id}
PUT    /admin/xp-rules/{id}
PATCH  /admin/xp-rules/{id}/activate
PATCH  /admin/xp-rules/{id}/deactivate
DELETE /admin/xp-rules/{id}
```

## Admin Badge APIs

```http
GET    /admin/badges
POST   /admin/badges
GET    /admin/badges/{id}
PUT    /admin/badges/{id}
PATCH  /admin/badges/{id}/activate
PATCH  /admin/badges/{id}/deactivate
DELETE /admin/badges/{id}
```

## Internal System APIs / Jobs

```http
POST /system/xp/award
POST /system/badges/check-unlocks
POST /system/leaderboard/recalculate
```

---

# 14. API Response Examples

## XP Summary

```json
{
  "success": true,
  "data": {
    "user_id": 44,
    "role": "student",
    "total_xp": 4250,
    "current_level": 6,
    "current_level_name": "Professional",
    "next_level": 7,
    "next_level_name": "Expert",
    "next_level_xp": 5500,
    "xp_needed": 1250,
    "progress_percent": 77,
    "badges_earned": 8,
    "country_rank": 124,
    "global_rank": 840
  }
}
```

## Badge List

```json
{
  "success": true,
  "data": [
    {
      "badge_id": 1,
      "slug": "first_interview",
      "name": "First Interview",
      "description": "Complete your first mock interview",
      "category": "interview",
      "icon_url": "/badges/first-interview.png",
      "xp_reward": 200,
      "is_unlocked": true,
      "unlocked_at": "2026-06-25T10:00:00Z",
      "progress": {
        "current": 1,
        "target": 1
      }
    },
    {
      "badge_id": 2,
      "slug": "ten_interviews",
      "name": "10 Interviews",
      "description": "Complete 10 mock interviews",
      "category": "milestone",
      "icon_url": "/badges/ten-interviews.png",
      "xp_reward": 300,
      "is_unlocked": false,
      "unlocked_at": null,
      "progress": {
        "current": 6,
        "target": 10
      }
    }
  ]
}
```

## XP History

```json
{
  "success": true,
  "data": [
    {
      "id": 991,
      "event_type": "session_complete",
      "event_label": "Completed HR Mock Interview",
      "xp_amount": 100,
      "reference_type": "interview",
      "reference_id": 9001,
      "created_at": "2026-07-01T12:00:00Z"
    }
  ]
}
```

---

# 15. Database Tables

## xp_levels

```text
id
level_number
level_name
xp_required
badge_icon
description
created_at
updated_at
```

## xp_rules

```text
id
rule_name
applies_to
event_type
xp_amount
frequency_limit
max_award_per_day
status
created_by
updated_by
created_at
updated_at
```

## points_ledger

```text
id
user_id
role
student_id
trainer_id
xp_amount
event_type
event_label
reference_type
reference_id
metadata_json
created_at
```

## badges

```text
id
slug
name
description
category
applies_to
icon_path
xp_reward
unlock_condition_json
status
sort_order
created_at
updated_at
```

## user_badges

```text
id
user_id
badge_id
role
student_id
trainer_id
unlocked_at
xp_awarded
created_at
```

## badge_progress

```text
id
user_id
badge_id
current_value
target_value
is_completed
last_checked_at
created_at
updated_at
```

## user_gamification_stats

```text
id
user_id
role
total_xp
current_level
badges_count
country_rank
global_rank
streak_days
last_login_date
created_at
updated_at
```

---

# 16. System Events

Trigger XP and badge checks after these events:

```text
UserRegistered
StudentProfileCompleted
ResumeUploaded
DailyLoginRecorded
BookingCreated
PaymentCompleted
SessionCompleted
EvaluationSubmitted
ReviewSubmitted
TrainerProfileApproved
TrainerPackageCreated
TrainerReceivedFiveStarReview
WithdrawalPaid
```

---

# 17. Backend Service Logic

## Award XP Service

```text
Input:
- user_id
- role
- event_type
- reference_type
- reference_id
- metadata

Process:
1. Find active XP rule by event_type.
2. Check frequency limit.
3. Add XP record to points_ledger.
4. Update user_gamification_stats.total_xp.
5. Recalculate user level.
6. Update leaderboard.
7. Dispatch CheckBadgeUnlocks job.
8. Send notification if level increased.
```

## Badge Unlock Service

```text
Input:
- user_id
- role
- event_type

Process:
1. Load active badges for user role.
2. Check unlock_condition_json.
3. If condition met and badge not already unlocked:
   - Create user_badges record.
   - Award badge XP reward.
   - Update badges_count.
   - Send notification.
```

---

# 18. Unlock Condition JSON Examples

## Complete First Interview

```json
{
  "type": "session_count",
  "operator": ">=",
  "value": 1
}
```

## Complete 5 HR Sessions

```json
{
  "type": "domain_session_count",
  "domain": "HR Interview",
  "operator": ">=",
  "value": 5
}
```

## Score 9+ Communication in 5 Sessions

```json
{
  "type": "evaluation_score_count",
  "score_field": "communication_score",
  "operator": ">=",
  "score_value": 9,
  "count": 5
}
```

## Trainer Rating Badge

```json
{
  "type": "trainer_rating",
  "average_rating": 4.8,
  "min_sessions": 25
}
```

---

# 19. Validation Rules

```text
- XP amount must be positive unless admin manually adjusts XP.
- XP rule event type must be unique if frequency is global.
- Badge slug must be unique.
- Badge cannot be awarded twice to same user.
- Badge XP reward should be awarded only once.
- Inactive badges should not be unlocked.
- Inactive XP rules should not award XP.
- Level should be recalculated after every XP change.
- Leaderboard should update after every XP event.
- Daily login XP can be awarded once per calendar day.
- Streak bonus should be awarded only once per streak milestone.
- Manual admin XP adjustment must store reason.
- Deleted badges should not remove historical earned badges unless admin chooses so.
```

---

# 20. Notifications

```text
You earned +100 XP for completing a session.
You unlocked the First Interview badge.
You reached Level 5: Achiever.
You entered the Bangladesh Top 100 leaderboard.
Your 7-day streak is complete.
You earned the Top Rated Trainer badge.
```

---

# 21. Frontend Components

```text
components/gamification/XPSummaryCard.tsx
components/gamification/XPProgressBar.tsx
components/gamification/BadgeCard.tsx
components/gamification/BadgeGrid.tsx
components/gamification/XPHistoryTable.tsx
components/gamification/LevelProgressCard.tsx
components/gamification/LeaderboardRankCard.tsx
components/gamification/StreakCard.tsx
components/admin/gamification/XPManager.tsx
components/admin/gamification/BadgeManager.tsx
```

---

# 22. Frontend Pages

## Student

```text
/student/gamification
/student/badges
/student/xp-history
/student/leaderboard
```

## Trainer

```text
/trainer/badges
/trainer/xp-history
```

## Admin

```text
/admin/gamification
/admin/gamification/xp-rules
/admin/gamification/badges
/admin/gamification/leaderboard
```

---

# 23. Admin Menu Update

```text
Admin Panel
  - Dashboard
  - Users
  - Trainers
  - Packages
  - Bookings
  - Payments
  - Withdrawals
  - Feed Management
  - Commission Setup
  - Gamification
      - XP Rules
      - Badge Management
      - Levels
      - Leaderboard
      - XP Logs
  - Reports
  - Settings
```

---

# 24. Student Menu Update

```text
Student Panel
  - Dashboard
  - Feed
  - My Sessions
  - Evaluations
  - Badges
  - XP History
  - Leaderboard
  - Profile
  - Settings
```

---

# 25. Trainer Menu Update

```text
Trainer Panel
  - Dashboard
  - My Profile
  - Packages
  - Availability
  - Sessions
  - Evaluations
  - Reviews
  - Earnings
  - Badges
  - XP History
  - Settings
```

---

# 26. MVP Scope

Build first:

```text
1. XP levels
2. XP ledger
3. Student XP summary
4. Student badge collection
5. Badge unlock after session completion
6. XP award after completed session
7. Daily login XP
8. Leaderboard update
9. Admin badge management
10. Admin XP rule management
```

Phase 2:

```text
1. Trainer XP and badges
2. Streak bonus
3. Advanced badge conditions
4. Country and global badge rewards
5. Public badge showcase
6. Manual admin XP adjustment
```
