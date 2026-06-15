# NextHire Frontend Implementation Plan

## 📊 Current State
- ✅ Basic auth pages (login, register)
- ✅ Student dashboard structure
- ✅ Trainer browse & detail pages
- ✅ Payment flow pages
- ✅ Video session UI skeleton
- ✅ Evaluation form
- ⚠️ Missing: Core components, layouts, advanced features

---

## 🎯 Phase-Based Implementation Roadmap

### **PHASE 0-1: Foundation (Hours 1-3)**
**Status:** 70% complete — Need to enhance

#### Critical Tasks:
- [ ] **T-021: UI Component Library** ⭐ HIGHEST PRIORITY
  - Button, Input, Card, Badge, Avatar, Modal, Toast, Spinner, etc.
  - **Why:** All other pages depend on these
  - **Time:** 2 hours
  - **Files:** Create `src/components/ui/*.tsx` for each component

- [ ] **T-020: Root Layout & Navigation**
  - Navbar, Sidebar, DashboardLayout
  - Role-based navigation
  - **Time:** 1 hour

---

### **PHASE 2: Student Module (Hours 4-8)**
**Status:** 30% complete

#### Critical Tasks:
- [ ] **T-031: Trainer Search & Listing** (enhance existing)
  - Add filter sidebar with all fields
  - Implement debounced search
  - Cursor-based pagination
  - **Time:** 1.5 hours

- [ ] **T-032: Trainer Profile Page** (enhance existing)
  - Add certifications section
  - Availability calendar widget
  - Reviews section with pagination
  - **Time:** 1.5 hours

- [ ] **T-035: My Sessions Page** (new)
  - Upcoming/Completed/Cancelled tabs
  - Countdown timer
  - Join button logic
  - **Time:** 1 hour

- [ ] **T-036: Student Profile Page** (new)
  - Profile completion bar
  - Form sections with validation
  - Avatar upload
  - Resume upload with D&D
  - **Time:** 1 hour

---

### **PHASE 3: Gamification (Hours 9-11)**
**Status:** 0% complete

#### Critical Tasks:
- [ ] **T-040: Leaderboard Page** ⭐ IMPORTANT
  - Global/Country tabs
  - Podium display (top 3)
  - Rank table with sorting
  - Current user highlight
  - **Time:** 1.5 hours

- [ ] **T-041: Badges Page** (new)
  - Badge grid with earned/locked states
  - Category filtering
  - Progress indicators
  - **Time:** 1 hour

---

### **PHASE 4: Trainer Module (Hours 12-18)**
**Status:** 0% complete

#### Critical Tasks:
- [ ] **T-050: Trainer Dashboard** (new)
  - Stats cards, upcoming sessions
  - Pending evaluations section
  - Earnings chart (recharts)
  - **Time:** 1.5 hours

- [ ] **T-051: Package Management** (new)
  - Package list with CRUD
  - Modal form for create/edit
  - Delete confirmation
  - **Time:** 1.5 hours

- [ ] **T-052: Availability Calendar** (new)
  - Month calendar view
  - Slot management
  - Booked vs available distinction
  - **Time:** 1.5 hours

- [ ] **T-053: Evaluation Modal** (already exists, enhance)
  - Add score sliders
  - Category icons
  - Form validation
  - **Time:** 0.5 hours

- [ ] **T-054: Earnings Page** (new)
  - Summary cards
  - 12-month bar chart
  - Payout history table
  - **Time:** 1 hour

---

### **PHASE 5: Company Module (Hours 19-21)**
**Status:** 0% complete

#### High Priority:
- [ ] **T-060: Company Dashboard** (new)
  - KYC status banner
  - Stats row
  - Active campaigns list
  - **Time:** 1 hour

- [ ] **T-061-062: Campaigns & Pipeline** (new)
  - Campaign tabs (Active/Draft/Archived)
  - Kanban board for candidate pipeline
  - **Time:** 1.5 hours

---

### **PHASE 6: Video & Notifications (Hours 22-24)**
**Status:** 30% complete

#### High Priority:
- [ ] **T-080: Video Session Enhancement** (enhance existing)
  - Integrate Agora SDK properly
  - Video stream rendering
  - Controls (mute, camera, end call)
  - Timer and session info
  - **Time:** 1 hour

- [ ] **T-090: Notification Bell** (new)
  - Bell icon in navbar
  - Dropdown list
  - Polling/refresh logic
  - **Time:** 1 hour

---

### **PHASE 7: Pages & Polish (Hours 25-30)**
**Status:** 0% complete

#### Medium Priority:
- [ ] **T-010: Landing Page** (new public page)
  - Hero section with CTA
  - How it works (3 steps)
  - Featured trainers carousel
  - Leaderboard preview
  - Testimonials
  - Pricing section
  - **Time:** 2 hours

- [ ] **T-100-103: Additional Pages** (404, unauthorized, profile, settings)
  - **Time:** 1 hour

---

## 📋 Implementation Order (By Dependency)

```
1. T-021: UI Components          [2 hours]  ← BLOCKS everything else
   ↓
2. T-020: Layout & Navigation    [1 hour]   ← BLOCKS dashboard pages
   ↓
3. T-031-032: Trainer Pages      [1.5 hours]
4. T-040: Leaderboard            [1.5 hours]
5. T-050-054: Trainer Dashboard  [1 hour] + [1.5h] + [1.5h] + [1h]
6. T-080: Video Session          [1 hour]
7. T-010: Landing Page           [2 hours]
8. T-060-062: Company Module     [1h] + [1.5h]
```

---

## 🛠️ Quick Start Commands

### Install Additional Dependencies
```bash
cd /home/boni/Desktop/nexthire/web

# Charts
npm install recharts

# Form handling (already installed: react-hook-form zod)

# Date utilities (already installed: date-fns)

# Icons
npm install lucide-react

# Drag & drop (for Kanban later)
npm install @dnd-kit/core @dnd-kit/utilities

# Advanced table
npm install @tanstack/react-table
```

### Check Running Servers
```bash
# Verify both are still running
curl http://localhost:3000 > /dev/null && echo "✅ Frontend OK"
curl http://localhost:8000/api/v1 > /dev/null && echo "✅ Backend OK"
```

---

## 📝 Development Checklist

For each task, ensure:
- [ ] TypeScript strict mode (no `any`)
- [ ] Responsive design (mobile-first)
- [ ] Loading states with skeleton
- [ ] Empty states
- [ ] Error handling with user-friendly messages
- [ ] API calls with proper error handling
- [ ] Form validation with Zod schemas
- [ ] Proper file structure and naming

---

## ⚡ Quick Wins (Highest ROI Tasks)

**Do these FIRST to unblock everything:**

1. **T-021: UI Component Library** (2h)
   - Creates reusable buttons, inputs, cards, modals, toasts
   - Enables 80% of other page development

2. **T-020: Layout & Navigation** (1h)
   - Navbar, sidebar, role-based nav
   - Provides consistent layout for all pages

3. **T-031-032: Enhanced Trainer Pages** (1.5h)
   - Better search/filtering
   - Complete trainer profile

4. **T-040: Leaderboard** (1.5h)
   - Visual impact
   - Demonstrates gamification

---

## 🔗 File Structure to Create

```
src/
├── components/
│   ├── ui/                    ← T-021 (15 components)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Toast.tsx
│   │   ├── Avatar.tsx
│   │   ├── Spinner.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Skeleton.tsx
│   │   └── ... (10 more)
│   ├── layout/                ← T-020
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── MobileNav.tsx
│   ├── auth/                  ← T-022
│   │   └── RoleGuard.tsx
│   └── gamification/          ← T-040-042
│       ├── LeaderboardTable.tsx
│       ├── BadgeGrid.tsx
│       └── XPProgress.tsx
├── app/
│   ├── (public)/              ← T-010, T-100-103
│   │   ├── page.tsx           (Landing)
│   │   ├── leaderboard/       (T-040)
│   │   └── ...
│   ├── (student)/
│   │   ├── trainers/          (T-031-032)
│   │   ├── sessions/          (T-035)
│   │   ├── profile/           (T-036)
│   │   ├── badges/            (T-041)
│   │   └── ...
│   ├── (trainer)/             ← T-050-055
│   │   ├── dashboard/
│   │   ├── packages/
│   │   ├── availability/
│   │   └── ...
│   ├── (company)/             ← T-060-062
│   └── (admin)/               ← T-070-074
└── lib/
    └── hooks/
        └── useLeaderboard.ts  (custom hooks for API)
```

---

## ✅ Success Metrics

By end of frontend implementation:

- [ ] **62 tasks** marked as complete
- [ ] **All critical pages** (🔴 priority) working
- [ ] **Zero TypeScript errors** (strict mode)
- [ ] **Mobile responsive** (tested on 375px, 768px, 1024px)
- [ ] **All forms validated** with Zod
- [ ] **Loading states** on all API calls
- [ ] **Error boundaries** implemented
- [ ] **Lighthouse score** > 80

---

## 🎬 Next Action

**START HERE:** Implement T-021 (UI Component Library)

This single task unblocks 80% of the other work. Once done, you can build pages 3x faster because all components are reusable.

---

*Last updated: 2026-06-05*
