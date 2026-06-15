# NextHire Admin Feed Management Module

## Module Name

Admin Feed Management

## Purpose

The Admin Feed Management module allows admins to control which interview packages appear on the public Feed page. Admin can monitor latest posted trainer packages, feature packages, hide packages, review reported packages, manage country/category visibility, and control feed ranking.

---

# Admin Menu Structure

```

---

# Feed Management Overview Page

```text
------------------------------------------------------------
Feed Management
------------------------------------------------------------

Control packages shown on the public Feed page.

[ Total Feed Packages ]     [ Featured Packages ]     [ Hidden Packages ]
1,240                       18                        32

[ Pending Review ]          [ Reported Packages ]     [ Active Countries ]
14                          6                         5

------------------------------------------------------------
Quick Actions
------------------------------------------------------------

[ Review Pending Packages ]
[ Manage Featured Packages ]
[ View Reported Packages ]
[ Feed Ranking Settings ]

------------------------------------------------------------
Latest Feed Activity
------------------------------------------------------------

Trainer              Package                     Action        Time
Rahim Uddin          HR Mock Interview           Published     1h ago
Nusrat Jahan         CV Review Package           Featured      2h ago
Karim Ahmed          Technical Interview         Reported      3h ago
------------------------------------------------------------
```

---

# Latest Packages Page

Admin can see all latest interview packages posted by trainers.

```text
------------------------------------------------------------
Latest Feed Packages
------------------------------------------------------------

Search:
[ Search by package, trainer, category, country... ]

Filters:
[ Status v ] [ Category v ] [ Country v ] [ Trainer Status v ] [ Date v ]

------------------------------------------------------------
Package List
------------------------------------------------------------

Package                         Trainer        Country      Status      Action
HR Mock Interview                Rahim Uddin    🇧🇩 BD       Active      [ View ]
Frontend Interview Prep          Hasan Ali      🇧🇩 BD       Active      [ View ]
CV Review for Freshers           Nusrat Jahan   🇧🇩 BD       Pending     [ Review ]

Actions:
[ View ] [ Feature ] [ Hide ] [ Reject ] [ Edit Visibility ]
------------------------------------------------------------
```

---

# Package Review Drawer

```text
------------------------------------------------------------
Package Review
------------------------------------------------------------

Package Title:
HR Mock Interview for Fresh Graduates

Trainer:
Rahim Uddin
Senior HR Manager
🇧🇩 Bangladesh
Rating: 4.8
Sessions: 126

Category:
HR Interview

Target Level:
Fresher

Description:
45-minute structured HR interview with feedback.

Duration:
45 minutes

Language:
Bangla + English

Price:
৳800

Availability:
In 2 days

Status:
Active

------------------------------------------------------------
Admin Actions
------------------------------------------------------------

[ Approve ]
[ Feature Package ]
[ Hide from Feed ]
[ Reject Package ]
[ Suspend Trainer Package ]
------------------------------------------------------------
```

---

# Featured Packages Management

Admin can manually feature selected packages on Feed.

```text
------------------------------------------------------------
Featured Packages
------------------------------------------------------------

Featured packages appear higher in the Feed.

Package                         Trainer        Priority      Status
HR Mock Interview                Rahim Uddin    1             Active
Technical Interview Prep         Hasan Ali      2             Active
CV Review Package                Nusrat Jahan   3             Active

[ + Add Featured Package ]

------------------------------------------------------------
Add Featured Package
------------------------------------------------------------

Select Package *
[ Search package... ]

Feature Position
[ Top Feed | Category Feed | Country Feed ]

Priority
[ 1 ]

Start Date
[ 01 Jul 2026 ]

End Date
[ 15 Jul 2026 ]

Status
[ Active ]

[ Save Featured Package ]
------------------------------------------------------------
```

---

# Pending Review Page

This page shows packages that need admin approval before appearing on Feed.

```text
------------------------------------------------------------
Pending Feed Review
------------------------------------------------------------

Package                         Trainer        Category       Submitted
HR Interview Basic               Rahim Uddin    HR Interview  1h ago
Backend Developer Interview      Karim Ahmed    Technical     3h ago

Actions:
[ Approve ] [ Reject ] [ Request Changes ] [ View Details ]
------------------------------------------------------------
```

Admin rejection reason:

```text
Reason *
[ Package description is incomplete ]

Message to Trainer
[ Please add more details about what students will receive in this package. ]

[ Send Rejection ]
```

---

# Hidden Packages Page

Admin can view packages hidden from Feed.

```text
------------------------------------------------------------
Hidden Packages
------------------------------------------------------------

Package                         Trainer        Hidden Reason        Action
CV Review Basic                  Trainer A      Low quality content  [ Restore ]
Fake Interview Package           Trainer B      Policy violation    [ View ]

Actions:
[ Restore to Feed ] [ Permanently Deactivate ]
------------------------------------------------------------
```

---

# Reported Packages Page

Students can report suspicious, misleading, or inappropriate packages. Admin reviews them here.

```text
------------------------------------------------------------
Reported Packages
------------------------------------------------------------

Package                         Reports     Main Reason              Status
Technical Interview Pro          4           Misleading description   Pending
HR Mock Interview                 2           Overpriced              Pending

Actions:
[ Review ] [ Hide ] [ Dismiss Report ] [ Suspend Package ]
------------------------------------------------------------
```

Report review details:

```text
------------------------------------------------------------
Report Details
------------------------------------------------------------

Package:
Technical Interview Pro

Trainer:
Karim Ahmed

Reports:
4

Reasons:
- Misleading package description
- Trainer did not deliver promised service
- Wrong category

Admin Decision:
[ Dismiss Report ] [ Hide Package ] [ Suspend Trainer ] [ Request Explanation ]
------------------------------------------------------------
```

---

# Feed Categories Management

Admin can control categories shown in Feed filters.

```text
------------------------------------------------------------
Feed Categories
------------------------------------------------------------

Category Name              Status      Sort Order
HR Interview               Active      1
Technical Interview        Active      2
CV Review                  Active      3
Career Counseling          Active      4
LinkedIn Review            Active      5

[ + Add Category ]

------------------------------------------------------------
Add Category
------------------------------------------------------------

Category Name *
[ HR Interview ]

Slug *
[ hr-interview ]

Description
[ Mock HR interview and behavioral interview preparation ]

Icon
[ Upload / Select Icon ]

Status
[ Active ]

Sort Order
[ 1 ]

[ Save Category ]
------------------------------------------------------------
```

---

# Country Feed Settings

Admin can enable or disable Feed visibility by country.

```text
------------------------------------------------------------
Country Feed Settings
------------------------------------------------------------

Country              Flag      Status      Packages      Action
Bangladesh           🇧🇩       Active      850           [ Manage ]
India                🇮🇳       Active      210           [ Manage ]
Pakistan             🇵🇰       Inactive    0             [ Enable ]
Nepal                🇳🇵       Active      18            [ Manage ]

------------------------------------------------------------
Country Rule
------------------------------------------------------------

Country *
[ Bangladesh ]

Default Currency
[ BDT ]

Show Country Flag on Feed?
[ Yes ]

Allow Trainers From This Country?
[ Yes ]

Allow Students To Book From This Country?
[ Yes ]

Status
[ Active ]

[ Save Country Settings ]
------------------------------------------------------------
```

---

# Feed Ranking Rules

Admin can control how packages appear in the Feed.

```text
------------------------------------------------------------
Feed Ranking Rules
------------------------------------------------------------

Default Sort:
[ Latest v ]

Ranking Weight:
Latest Published Package        [ 30% ]
Trainer Rating                  [ 25% ]
Session Completed Count         [ 20% ]
Package Availability            [ 15% ]
Featured Boost                  [ 10% ]

------------------------------------------------------------
Other Rules
------------------------------------------------------------

[ ✓ ] Boost featured packages
[ ✓ ] Boost packages with available slots
[ ✓ ] Hide packages with no availability
[ ✓ ] Hide packages from suspended trainers
[ ✓ ] Hide rejected packages
[ ✓ ] Show country flag on package card

[ Save Ranking Rules ]
------------------------------------------------------------
```

---

# Admin Feed Package Status

```text
draft
pending_review
active
featured
hidden
rejected
suspended
deactivated
expired
```

Status meaning:

```text
draft           = trainer is still editing
pending_review  = waiting for admin approval
active          = visible on Feed
featured        = boosted on Feed
hidden          = not visible on Feed but still exists
rejected        = rejected by admin
suspended       = temporarily blocked due to issue
deactivated     = trainer/admin removed it
expired         = package has no active availability or end date passed
```

---

# Feed Management APIs

## Admin Feed Overview

```http
GET /admin/feed/overview
```

## Admin Feed Packages

```http
GET /admin/feed/packages
GET /admin/feed/packages/{id}
PATCH /admin/feed/packages/{id}/approve
PATCH /admin/feed/packages/{id}/reject
PATCH /admin/feed/packages/{id}/hide
PATCH /admin/feed/packages/{id}/restore
PATCH /admin/feed/packages/{id}/feature
PATCH /admin/feed/packages/{id}/unfeature
PATCH /admin/feed/packages/{id}/suspend
```

## Featured Feed APIs

```http
GET    /admin/feed/featured
POST   /admin/feed/featured
PUT    /admin/feed/featured/{id}
DELETE /admin/feed/featured/{id}
```

## Reported Package APIs

```http
GET   /admin/feed/reports
GET   /admin/feed/reports/{id}
PATCH /admin/feed/reports/{id}/dismiss
PATCH /admin/feed/reports/{id}/hide-package
PATCH /admin/feed/reports/{id}/resolve
```

## Feed Category APIs

```http
GET    /admin/feed/categories
POST   /admin/feed/categories
PUT    /admin/feed/categories/{id}
DELETE /admin/feed/categories/{id}
PATCH  /admin/feed/categories/{id}/activate
PATCH  /admin/feed/categories/{id}/deactivate
```

## Country Feed APIs

```http
GET   /admin/feed/countries
PUT   /admin/feed/countries/{country_code}
PATCH /admin/feed/countries/{country_code}/activate
PATCH /admin/feed/countries/{country_code}/deactivate
```

## Feed Ranking APIs

```http
GET /admin/feed/ranking-rules
PUT /admin/feed/ranking-rules
```

---

# Admin Feed Package List API Example

```http
GET /admin/feed/packages?status=active&country_code=BD&category=HR Interview
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "package_id": 22,
      "title": "HR Mock Interview for Fresh Graduates",
      "category": "HR Interview",
      "target_level": "Fresher",
      "price": 800,
      "currency": "BDT",
      "status": "active",
      "is_featured": false,
      "published_at": "2026-06-25T10:00:00Z",
      "trainer": {
        "id": 15,
        "name": "Rahim Uddin",
        "professional_title": "Senior HR Manager",
        "country_code": "BD",
        "country_flag": "🇧🇩",
        "country_name": "Bangladesh",
        "rating": 4.8,
        "total_sessions": 126,
        "is_approved": true
      }
    }
  ],
  "meta": {
    "per_page": 20,
    "next_cursor": "abc123"
  }
}
```

---

# Database Tables

## feed_package_settings

```text
id
package_id
trainer_id
feed_status
is_featured
featured_priority
featured_starts_at
featured_ends_at
country_code
category_id
admin_note
rejection_reason
hidden_reason
approved_by
approved_at
created_at
updated_at
```

## feed_categories

```text
id
name
slug
description
icon_path
status
sort_order
created_at
updated_at
```

## feed_country_settings

```text
id
country_code
country_name
country_flag
default_currency
show_country_flag
allow_trainers
allow_students_booking
status
created_at
updated_at
```

## feed_ranking_rules

```text
id
rule_name
latest_weight
rating_weight
session_count_weight
availability_weight
featured_weight
hide_no_availability
hide_suspended_trainers
hide_rejected_packages
status
created_by
updated_by
created_at
updated_at
```

## package_reports

```text
id
package_id
reported_by_user_id
reason
description
status
admin_decision
admin_note
resolved_by
resolved_at
created_at
updated_at
```

## feed_audit_logs

```text
id
admin_id
action
package_id
old_status
new_status
reason
metadata_json
created_at
```

---

# Validation Rules

```text
- Only approved trainer packages can appear on Feed.
- Draft packages cannot appear on Feed.
- Rejected packages cannot appear on Feed.
- Suspended trainer packages cannot appear on Feed.
- Hidden packages should not appear on public Feed.
- Featured packages must have start and end dates.
- Featured priority must be unique for the same feed section.
- Admin must provide reason when rejecting or hiding a package.
- Reported packages remain visible unless admin hides or suspends them.
- Package with no future availability can be shown but Book button should be disabled, or hidden depending on ranking settings.
- Country flag should be generated from country_code.
- Feed changes must be stored in audit logs.
- Admin actions should notify trainer when package is approved, rejected, hidden, or featured.
```

---

# Notification Events

```text
Package approved for Feed
Package rejected from Feed
Package hidden by admin
Package restored to Feed
Package featured on Feed
Package report received
Package report resolved
Trainer package requires changes
```

---

# Admin Feed Management Flow

```text
Trainer publishes package
        ↓
Package goes to pending_review
        ↓
Admin reviews package
        ↓
Admin approves package
        ↓
Package becomes active on Feed
        ↓
Admin can feature, hide, suspend, or reject later
        ↓
Students browse Feed
        ↓
Students book package
```

---

# MVP Version

For MVP, build these first:

```text
1. Feed Overview
2. Latest Packages
3. Approve / Reject / Hide Package
4. Featured Packages
5. Feed Categories
6. Country Flag Settings
7. Basic Feed Ranking: Latest + Featured
```

Advanced modules like reported packages, weighted ranking, and country-specific feed rules can come in Phase 2.
