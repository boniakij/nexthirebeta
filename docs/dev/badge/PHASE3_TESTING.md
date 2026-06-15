# Phase 3: API Testing & Validation

**Status**: READY FOR TESTING
**Date**: 2026-06-15

---

## Test Endpoints (15 public + admin)

### Public Endpoints (No Auth)

```bash
# 1. Get all badges by category
curl http://localhost:8000/api/v1/badges

# Expected: 
{
  "success": true,
  "data": {
    "interview": [...],
    "skill": [...],
    "milestone": [...],
    ...
  }
}

# 2. Get badges by category
curl http://localhost:8000/api/v1/badges/interview

# Expected: Array of interview badges

# 3. Get single badge
curl http://localhost:8000/api/v1/badges/1

# Expected: Single badge object with unlock_condition_json

# 4. Get global leaderboard
curl http://localhost:8000/api/v1/leaderboard/global

# Expected: Top 100 users by XP with ranks

# 5. Get country leaderboard
curl http://localhost:8000/api/v1/leaderboard/country/BD

# Expected: Bangladesh top 100 users
```

### Student Endpoints (Requires Auth)

```bash
TOKEN="your-auth-token-here"

# 1. Get XP summary
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/students/me/xp-summary

# Expected:
{
  "success": true,
  "data": {
    "user_id": 1,
    "total_xp": 0,
    "current_level": 1,
    "current_level_name": "Newcomer",
    "next_level": 2,
    "badges_earned": 0,
    "progress_percent": 0
  }
}

# 2. Get XP history
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/students/me/xp-history

# Expected: Array of ledger entries

# 3. Get student badges
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/students/me/badges

# Expected: Array of badge objects with unlock status

# 4. Get single badge details
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/students/me/badges/1

# Expected: Single badge with progress if applicable
```

### Trainer Endpoints (Requires Auth)

```bash
TOKEN="trainer-auth-token"

# 1. Get trainer XP summary
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/trainers/me/xp-summary

# 2. Get trainer XP history
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/trainers/me/xp-history

# 3. Get trainer badges
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/trainers/me/badges

# 4. Get public trainer badges
curl http://localhost:8000/api/v1/trainers/2/badges

# Expected: Public trainer's earned badges
```

### Admin Endpoints (Requires Admin Auth)

```bash
ADMIN_TOKEN="admin-auth-token"

# 1. List XP rules
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:8000/api/v1/admin/xp-rules

# Expected: All 14 XP rules

# 2. Create new XP rule
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rule_name": "Test Event",
    "applies_to": "student",
    "event_type": "test_event",
    "xp_amount": 50,
    "frequency_limit": "once_per_day"
  }' \
  http://localhost:8000/api/v1/admin/xp-rules

# 3. List badges
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:8000/api/v1/admin/badges

# Expected: All 20+ badges

# 4. Create new badge
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test_badge",
    "name": "Test Badge",
    "description": "Test badge",
    "category": "special",
    "applies_to": "student",
    "xp_reward": 100,
    "unlock_condition_json": {"type": "session_count", "value": 1}
  }' \
  http://localhost:8000/api/v1/admin/badges

# 5. Adjust user XP
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "xp_amount": 500,
    "reason": "Testing XP adjustment system"
  }' \
  http://localhost:8000/api/v1/admin/xp-adjustments

# 6. Get adjustment history
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:8000/api/v1/admin/xp-adjustments/user/1

# 7. Reverse adjustment
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:8000/api/v1/admin/xp-adjustments/1/reverse
```

---

## Test Validation Checklist

### Database
- [ ] XP Levels table exists (10 rows)
- [ ] XP Rules table exists (14 rows)
- [ ] Badges table exists (20+ rows)
- [ ] User Badges table empty (will populate on unlock)
- [ ] Badge Progress table empty
- [ ] User Gamification Stats table empty
- [ ] Points Ledger table empty (will populate on XP award)

### Public APIs
- [ ] GET /badges returns all badges grouped by category
- [ ] GET /badges/{category} returns badges in that category
- [ ] GET /badges/{id} returns single badge with conditions
- [ ] GET /leaderboard/global returns top 100 users
- [ ] GET /leaderboard/country/{code} returns country top 100

### Student APIs
- [ ] GET /students/me/xp-summary returns XP data
- [ ] GET /students/me/xp-history returns ledger entries
- [ ] GET /students/me/badges returns badge collection
- [ ] GET /students/me/badges/{id} returns badge detail

### Trainer APIs
- [ ] GET /trainers/me/xp-summary returns trainer XP
- [ ] GET /trainers/me/xp-history returns ledger
- [ ] GET /trainers/me/badges returns trainer badges
- [ ] GET /trainers/{id}/badges returns public badges

### Admin APIs
- [ ] GET /admin/xp-rules returns all rules
- [ ] POST /admin/xp-rules creates new rule
- [ ] PUT /admin/xp-rules/{id} updates rule
- [ ] DELETE /admin/xp-rules/{id} deletes rule
- [ ] GET /admin/badges returns all badges
- [ ] POST /admin/badges creates new badge
- [ ] PUT /admin/badges/{id} updates badge
- [ ] DELETE /admin/badges/{id} deletes badge
- [ ] POST /admin/xp-adjustments adjusts user XP
- [ ] GET /admin/xp-adjustments/user/{id} returns history
- [ ] POST /admin/xp-adjustments/{id}/reverse reverses adjustment

---

## Integration Tests

### Event Listener Tests
- [ ] SessionCompleted event triggers AwardSessionCompletionXP
- [ ] Login event triggers AwardDailyLoginXP
- [ ] XP awarded appears in points_ledger
- [ ] User stats updated in user_gamification_stats

### Badge Unlock Tests
- [ ] Completing 1 session unlocks "First Interview" badge
- [ ] Completing 10 sessions unlocks "10 Interviews" badge
- [ ] Badge unlock awards bonus XP
- [ ] Badge progress tracked in badge_progress table

### Streak Tests
- [ ] Daily login increments streak_days
- [ ] 7-day streak triggers bonus XP award
- [ ] 30-day streak triggers bonus XP award
- [ ] Missed day resets streak to 0

### Leaderboard Tests
- [ ] XP changes update rankings
- [ ] Global rank calculated correctly
- [ ] Country rank calculated correctly
- [ ] Percentile calculations accurate

---

## Error Handling Tests

### 401 Unauthorized
- [ ] Protected endpoints reject requests without token
- [ ] Admin endpoints reject student tokens
- [ ] Student endpoints reject trainer tokens

### 404 Not Found
- [ ] Non-existent badge returns 404
- [ ] Non-existent user returns 404
- [ ] Non-existent country code returns empty results

### 422 Unprocessable Entity
- [ ] Creating rule without required fields fails
- [ ] Creating badge with invalid unlock_condition_json fails
- [ ] Adjusting XP without reason fails

### 403 Forbidden
- [ ] Non-admin user cannot access admin endpoints
- [ ] User cannot access another user's data

---

## Performance Tests

### Response Times (Target: <500ms)
- [ ] GET /badges: < 200ms
- [ ] GET /leaderboard/global: < 300ms
- [ ] GET /students/me/xp-summary: < 100ms
- [ ] POST /admin/xp-adjustments: < 200ms

### Database Queries
- [ ] No N+1 queries in badge list
- [ ] Leaderboard uses indexed queries
- [ ] XP award transaction is atomic

---

## Data Consistency Tests

### XP Calculation
- [ ] XP awarded = rule amount
- [ ] Commission = 20% hardcoded
- [ ] Trainer receivable = price - commission
- [ ] Total XP = sum of all ledger entries

### Level Progression
- [ ] Level 1: 0 XP
- [ ] Level 2: 200 XP
- [ ] Level 3: 500 XP
- [ ] ...
- [ ] Level 10: 15000+ XP

### Badge Unlock Conditions
- [ ] session_count checks interview count
- [ ] domain_session_count checks by category
- [ ] evaluation_score_count checks scores
- [ ] trainer_rating checks average + sessions

---

## Ready to Test
- [x] All endpoints defined in routes/api.php
- [x] All controllers created
- [x] All services implemented
- [x] Event listeners configured
- [x] Database migrations ready
- [x] Seeders prepared
- [ ] Next: Run migrations → seed data → test

---

**Status**: ✅ READY FOR PHASE 3 TESTING
**Expected Duration**: 15-30 minutes (manual testing)
**Blockers**: None identified
