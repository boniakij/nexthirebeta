# NextHire — Frontend Development Task List

> **Stack:** React 18 · TypeScript · Next.js 14 (App Router) · Tailwind CSS · Zustand · Axios  
> **Design System:** Inter font · Primary `#1A56DB` · Purple `#7E3AF2` · Success `#0E9F6E`  
> **Base URL:** 
> **Version:** 1.0.0

---

## How to Use This File

- Each task has an **ID**, **page/component**, **role**, **priority**, and **acceptance criteria**
- Work task by task in order of priority: 🔴 Critical → 🟠 High → 🟡 Medium → 🟢 Low
- Mark tasks `[x]` when done
- Every page must be **mobile-first**, **TypeScript strict**, and **fully responsive**

---

## Task Summary

| Priority | Count |
|----------|-------|
| 🔴 Critical | 18 |
| 🟠 High | 22 |
| 🟡 Medium | 14 |
| 🟢 Low | 8 |
| **Total** | **62** |

---

## PHASE 0 — Project Setup

### [ ] T-000 · Project Initialization
**Priority:** 🔴 Critical  
**Estimated time:** 2–3 hours

**Steps:**
```bash
npx create-next-app@14 nexthire-web \
  --typescript --tailwind --eslint \
  --app --src-dir --import-alias "@/*"

cd nexthire-web

npm install \
  zustand \
  axios \
  @tanstack/react-query \
  react-hook-form \
  @hookform/resolvers \
  zod \
  date-fns \
  clsx \
  tailwind-merge \
  lucide-react \
  agora-rtc-sdk-ng \
  next-auth

npm install -D \
  @types/node \
  prettier \
  eslint-config-prettier
```

**Files to create:**
- `src/lib/api/client.ts` — Axios instance + interceptors
- `src/lib/api/auth.ts` — Auth API calls
- `src/lib/api/student.ts` — Student API calls
- `src/lib/api/trainer.ts` — Trainer API calls
- `src/lib/api/booking.ts` — Booking API calls
- `src/lib/api/payment.ts` — Payment API calls
- `src/lib/api/gamification.ts` — XP/badge/leaderboard calls
- `src/lib/api/company.ts` — Company API calls
- `src/stores/authStore.ts` — Zustand auth store
- `src/stores/notificationStore.ts` — Zustand notification store
- `src/types/index.ts` — All TypeScript types
- `src/lib/utils.ts` — Helper functions (cn, formatCurrency, formatDate)
- `tailwind.config.ts` — Custom tokens
- `.env.local` — Environment variables

**Acceptance Criteria:**
- [ ] `npm run dev` starts without errors
- [ ] TypeScript strict mode enabled (`tsconfig.json` → `"strict": true`)
- [ ] Tailwind custom colors configured
- [ ] Axios client auto-attaches JWT + handles 401 refresh
- [ ] ESLint + Prettier configured and passing

---

### [ ] T-001 · Design Tokens & Tailwind Config
**Priority:** 🔴 Critical  
**File:** `tailwind.config.ts`

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          600: '#1A56DB',
          700: '#1E40AF',
        },
        purple: {
          50:  '#F5F3FF',
          600: '#7E3AF2',
          700: '#6D28D9',
        },
        success: {
          50:  '#ECFDF5',
          500: '#0E9F6E',
        },
        warning: {
          400: '#E3A008',
        },
        danger: {
          600: '#E02424',
        },
        gray: {
          50:  '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          700: '#374151',
          900: '#111928',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        bengali: ['"Noto Sans Bengali"', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        btn:  '8px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}

export default config
```

**Acceptance Criteria:**
- [ ] All brand colors available as Tailwind classes
- [ ] `bg-primary-600`, `text-purple-600`, `bg-success-500` all work
- [ ] Custom border radius and shadow available

---

### [ ] T-002 · Axios API Client
**Priority:** 🔴 Critical  
**File:** `src/lib/api/client.ts`

**What to implement:**
```ts
// Axios instance with:
// - baseURL = process.env.NEXT_PUBLIC_API_URL
// - Content-Type: application/json
// - Request interceptor: attach Bearer token from localStorage/cookie
// - Response interceptor:
//     - On 401: try POST /auth/refresh with refresh_token
//     - On success: update access_token, retry original request
//     - On refresh fail: clear tokens, redirect to /login
// - On any error: parse { success, message, errors } and throw typed ApiError
```

**Acceptance Criteria:**
- [ ] All requests have Authorization header when token exists
- [ ] 401 triggers silent token refresh, not redirect
- [ ] Failed refresh clears auth state and redirects
- [ ] Error responses are typed `ApiError`

---

### [ ] T-003 · Zustand Auth Store
**Priority:** 🔴 Critical  
**File:** `src/stores/authStore.ts`

**State shape:**
```ts
interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login(email: string, password: string): Promise<void>
  logout(): Promise<void>
  setUser(user: User): void
  setTokens(access: string, refresh: string): void
  clearAuth(): void
}
```

**Requirements:**
- Use `persist` middleware → save to `localStorage` key `nexthire-auth`
- Only persist `accessToken`, `refreshToken`, `user` (not loading state)
- `login()` calls `POST /auth/login`, saves tokens, sets user
- `logout()` calls `POST /auth/logout`, then clears all state

**Acceptance Criteria:**
- [ ] Auth state survives page refresh
- [ ] Tokens stored in localStorage under `nexthire-auth`
- [ ] `isAuthenticated` is `true` only when user + token both exist

---

### [ ] T-004 · TypeScript Types
**Priority:** 🔴 Critical  
**File:** `src/types/index.ts`

**All types required:**

```ts
type UserRole = 'student' | 'trainer' | 'company' | 'admin'
type InterviewStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'payout_pending' | 'paid'
type Difficulty = 'beginner' | 'intermediate' | 'advanced'
type OverallLevel = 'not_ready' | 'beginner' | 'intermediate' | 'advanced' | 'industry_ready'
type BadgeCategory = 'achievement' | 'skill' | 'milestone' | 'special'

interface User { id, uuid, email, role, status, profile_photo, email_verified_at }
interface Student { id, user, full_name, university, department, skills[], preferred_job_role,
                    resume_path, profile_completion, total_xp, current_level, streak_days, country_code }
interface Trainer { id, user, full_name, bio, expertise_domains[], years_experience,
                    certifications[], average_rating, total_reviews, total_sessions,
                    is_approved, packages? }
interface Package { id, trainer_id, trainer?, title, description, price, session_count,
                    duration_minutes, interview_type, domain, difficulty, language,
                    is_live, includes_cv_review, is_active, total_bookings }
interface Interview { id, student, trainer, package, scheduled_at, duration_minutes,
                      status, meeting_link, agora_channel, completed_at, xp_awarded }
interface Evaluation { id, interview_id, communication_score, technical_score,
                       confidence_score, problem_solving_score, english_score,
                       hr_readiness_score, overall_level, feedback_text }
interface Badge { id, slug, name, description, icon_path, xp_reward, category,
                  unlocked_at?, is_locked? }
interface LeaderboardEntry { rank, student_id, name, avatar, xp, level, badges_count, country, is_me? }
interface Payment { id, amount, commission, currency, gateway, status, invoice_path, created_at }
interface ApiResponse<T> { success, data: T, meta? }
interface ApiError { success: false, message, errors? }
interface AuthTokens { access_token, refresh_token, expires_in }
interface DashboardStats { total_xp, current_level, streak_days, profile_completion,
                           upcoming_sessions, completed_sessions, global_rank, country_rank }
```

**Acceptance Criteria:**
- [ ] No `any` types anywhere — all strict
- [ ] All API responses wrapped in `ApiResponse<T>`

---

## PHASE 1 — Auth Pages

### [x] T-010 · Landing Page (Public)
**Priority:** 🔴 Critical  
**Route:** `/` (public)  
**File:** `src/app/page.tsx`

**Sections to build (top to bottom):**

1. **Navbar**
   - Logo left · Nav links center · Login + Sign Up buttons right
   - Mobile: hamburger menu
   - Sticky on scroll with backdrop blur

2. **Hero Section**
   - Headline: *"Land Your Dream Job"*
   - Subheadline: *"Practice with expert trainers, earn XP, get hired"*
   - Two CTAs: `Sign Up Free` (primary blue) · `Watch Demo` (outlined)
   - Animated stats bar below: Sessions · Trainers · Companies · Students (count-up animation)

3. **How It Works** (3 steps)
   - Step 1: Register & complete profile
   - Step 2: Book an expert trainer
   - Step 3: Ace interviews & get hired
   - Visual: numbered cards with icons and connecting line

4. **Featured Trainers** (6 cards)
   - Trainer photo · Name · Domains (pill badges) · Star rating · Price/session
   - "View Profile" button
   - Data: fetch `GET /trainers?per_page=6&sort=rating`

5. **Leaderboard Preview** (Top 5 students)
   - Rank · Avatar · Name · XP · Level badge
   - "View Full Leaderboard" link

6. **Testimonials** (3 cards)
   - Photo · Name · Role · Quote · Star rating

7. **Company Logos Marquee**
   - Scrolling row of company partner logos

8. **Pricing Section** (3 tiers)
   - Free · Pro · Company
   - Feature comparison list

9. **Footer**
   - Logo · Links · Social media · Newsletter signup

**Acceptance Criteria:**
- [ ] Fully responsive (mobile/tablet/desktop)
- [ ] Hero stats animate on first load (count-up)
- [ ] Trainer cards link to `/trainers/{id}`
- [ ] All CTAs route correctly (Sign Up → `/register`, Login → `/login`)

---

### [ ] T-011 · Register Page
**Priority:** 🔴 Critical  
**Route:** `/register`  
**File:** `src/app/(auth)/register/page.tsx`

**Form fields:**
- Full name (text)
- Email (email)
- Password (password, min 8 chars, show/hide toggle)
- Confirm Password (password, must match)
- Role selection (3 cards: Student / Trainer / Company) — **required**
- Terms & Privacy checkbox — required

**Validation (Zod schema):**
```ts
z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  password_confirmation: z.string(),
  role: z.enum(['student', 'trainer', 'company']),
  terms: z.literal(true),
}).refine(d => d.password === d.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
})
```

**API call:** `POST /auth/register`

**After success:**
- Show "Check your email" success screen (do NOT redirect to dashboard yet)
- Display email address they used

**Also include:**
- "Already have an account? Login" link
- Google OAuth button → `POST /auth/google`
- Social divider line

**Acceptance Criteria:**
- [ ] All validation shows inline errors
- [ ] Role card selection is visually clear (selected state)
- [ ] Submit button shows spinner during request
- [ ] API errors (e.g. duplicate email) displayed at top of form
- [ ] Google button works

---

### [ ] T-012 · Login Page
**Priority:** 🔴 Critical  
**Route:** `/login`  
**File:** `src/app/(auth)/login/page.tsx`

**Form fields:**
- Email
- Password (show/hide toggle)
- Remember me checkbox

**API call:** `POST /auth/login`

**After success:**
- Save tokens to Zustand store
- Redirect based on role:
  - `student` → `/student/dashboard`
  - `trainer` → `/trainer/dashboard`
  - `company` → `/company/dashboard`
  - `admin` → `/admin/dashboard`

**Also include:**
- "Forgot password?" link → `/forgot-password`
- "Don't have an account? Sign Up" link
- Google OAuth button

**Acceptance Criteria:**
- [ ] Role-based redirect after login
- [ ] Error message shown for wrong credentials
- [ ] Form submits on Enter key
- [ ] Google login works

---

### [ ] T-013 · Email Verification Page
**Priority:** 🔴 Critical  
**Route:** `/verify-email?token=...`  
**File:** `src/app/(auth)/verify-email/page.tsx`

**Behavior:**
- On mount: extract `token` from URL params
- Auto-call `POST /auth/verify-email` with token
- Show loading spinner while verifying
- On success: show success message + "Go to Dashboard" button
- On failure: show error + "Resend verification email" button

**Acceptance Criteria:**
- [ ] Token extracted from URL automatically
- [ ] No manual action needed — auto-verifies on page load
- [ ] Clear success/error states
- [ ] Resend button calls `POST /auth/forgot-verification` (or equivalent)

---

### [ ] T-014 · Forgot Password Page
**Priority:** 🟠 High  
**Route:** `/forgot-password`  
**File:** `src/app/(auth)/forgot-password/page.tsx`

**Form:** Email field + Submit button  
**API:** `POST /auth/forgot-password`  
**After success:** Show "Check your inbox" message

---

### [ ] T-015 · Reset Password Page
**Priority:** 🟠 High  
**Route:** `/reset-password?token=...`  
**File:** `src/app/(auth)/reset-password/page.tsx`

**Form:** New password + Confirm password  
**API:** `POST /auth/reset-password` `{ token, password, password_confirmation }`  
**After success:** Redirect to `/login` with success toast

---

## PHASE 2 — Shared Components & Layout

### [ ] T-020 · Root Layout & Navigation
**Priority:** 🔴 Critical  
**Files:**
- `src/app/layout.tsx` — root layout (font, query provider, metadata)
- `src/components/layout/Navbar.tsx` — public navbar
- `src/components/layout/DashboardLayout.tsx` — auth sidebar layout
- `src/components/layout/Sidebar.tsx` — role-specific sidebar
- `src/components/layout/MobileNav.tsx` — bottom nav for mobile

**Sidebar nav items by role:**

Student sidebar:
- Dashboard · Book Interview · My Sessions · Leaderboard · Badges · Profile

Trainer sidebar:
- Dashboard · My Packages · Sessions · Availability · Earnings · Profile

Company sidebar:
- Dashboard · Campaigns · Candidates · Inbox · Profile

Admin sidebar:
- Dashboard · Users · Trainers · Companies · Payments · Badges · Reports

**Acceptance Criteria:**
- [ ] Sidebar collapses to icon-only on small screens
- [ ] Active route highlighted
- [ ] User avatar + name + role shown at bottom of sidebar
- [ ] Mobile bottom nav shows for screens < 768px

---

### [ ] T-021 · UI Component Library
**Priority:** 🔴 Critical  
**File:** `src/components/ui/`

Build these reusable components (each as its own file):

| Component | Props | Notes |
|-----------|-------|-------|
| `Button.tsx` | `variant`, `size`, `loading`, `disabled` | Variants: primary, secondary, outline, ghost, danger |
| `Input.tsx` | `label`, `error`, `hint`, `icon` | Floating label or stacked label |
| `Badge.tsx` | `variant`, `size` | Variants: primary, success, warning, danger, purple |
| `Card.tsx` | `className`, `hover` | Rounded-card, shadow-card |
| `Avatar.tsx` | `src`, `name`, `size` | Fallback to initials |
| `StarRating.tsx` | `rating`, `count`, `editable` | Display or input mode |
| `ProgressBar.tsx` | `value`, `max`, `color`, `label` | XP progress, profile completion |
| `Spinner.tsx` | `size`, `color` | Loading states |
| `Modal.tsx` | `isOpen`, `onClose`, `title` | Accessible dialog |
| `Toast.tsx` | `type`, `message`, `duration` | success/error/info |
| `Tabs.tsx` | `tabs[]`, `activeTab`, `onChange` | Tab navigation |
| `Select.tsx` | `options[]`, `value`, `onChange` | Styled dropdown |
| `Skeleton.tsx` | `width`, `height`, `className` | Loading skeleton |
| `EmptyState.tsx` | `icon`, `title`, `description`, `action` | No data states |
| `Pagination.tsx` | `cursor`, `hasMore`, `onNext` | Cursor-based |

**Acceptance Criteria:**
- [ ] All components typed with TypeScript props interface
- [ ] Button shows Spinner when `loading={true}` and is disabled
- [ ] Toast has auto-dismiss (default 4s)
- [ ] Modal traps focus and closes on Escape key
- [ ] All components work in mobile layout

---

### [ ] T-022 · Role Guard (Auth Wrapper)
**Priority:** 🔴 Critical  
**File:** `src/components/auth/RoleGuard.tsx`

```ts
// Usage:
// <RoleGuard allowedRoles={['student']}>
//   <StudentDashboard />
// </RoleGuard>
```

**Behavior:**
- If not authenticated → redirect to `/login`
- If wrong role → redirect to `/unauthorized`
- If email not verified → redirect to `/verify-email`
- Show loading spinner while checking auth state

**Acceptance Criteria:**
- [ ] Works client-side with Zustand store
- [ ] No flicker on protected pages (handle hydration correctly)
- [ ] Redirect preserves intended URL in query param for post-login redirect

---

## PHASE 3 — Student Module

### [ ] T-030 · Student Dashboard
**Priority:** 🔴 Critical  
**Route:** `/student/dashboard`  
**File:** `src/app/(student)/dashboard/page.tsx`  
**API:** `GET /students/me/dashboard`

**Layout (top to bottom):**

1. **Welcome Bar**
   - "Good morning, {name}! 👋" with date
   - Streak badge: 🔥 {n} day streak

2. **Stats Row** (4 cards)
   - Total XP (purple, with lightning icon)
   - Current Level (with level name)
   - Global Rank (with trophy icon)
   - Profile Completion % (with progress ring)

3. **XP Progress Bar**
   - Shows current XP vs XP needed for next level
   - Level name on left, next level name on right
   - Animated fill bar

4. **Upcoming Sessions** (next 3)
   - Session card: Trainer name · Domain · Date/time countdown · "Join" button (disabled if >15min before)
   - Empty state: "No upcoming sessions. Book your first interview!"

5. **Recent Evaluations** (last 2)
   - Score breakdown bars for each category
   - Overall level badge
   - Trainer name + date

6. **Recent Badges** (last 5)
   - Badge icon + name + "New" label if unlocked < 3 days ago

7. **Recommended Trainers** (3 cards)
   - Top-rated trainers in student's preferred domain

8. **Quick Actions**
   - Book Interview · Update Profile · View Leaderboard

**Acceptance Criteria:**
- [ ] All data loaded from API with loading skeletons
- [ ] XP bar animates on load
- [ ] Join button only active within 15 minutes of session time
- [ ] Empty states shown when no data

---

### [ ] T-031 · Trainer Search & Listing
**Priority:** 🔴 Critical  
**Route:** `/trainers`  
**File:** `src/app/(student)/trainers/page.tsx`  
**API:** `GET /trainers?domain=&min_price=&max_price=&min_rating=&language=&search=`

**Layout:**
- Left sidebar filters (desktop) / Filter drawer (mobile)
- Trainer card grid (right side, 2 col desktop / 1 col mobile)

**Filter sidebar fields:**
- Search bar (text, debounced 300ms)
- Domain (multi-select checkboxes): Software Engineering, Cybersecurity, DevOps, Data & AI, HR/Behavioral, Business/Finance, Design, Government/Viva
- Price Range (dual-handle slider: 0–5000 BDT)
- Minimum Rating (1–5 stars, click to select)
- Language (English / Bangla / Both)
- Difficulty (Beginner / Intermediate / Advanced)

**Trainer Card:**
```
[Photo]  [Name]            [Rating ⭐ 4.8 (142)]
         [Domain pills]    [Price from ৳500/session]
         [X years exp]     [Total sessions: 245]
         [Bio snippet]
         [Book Now button]
```

**Pagination:** Load more button (cursor-based)

**Acceptance Criteria:**
- [ ] Filters update URL query params (bookmarkable)
- [ ] Debounced search (300ms)
- [ ] Loading skeleton shown while fetching
- [ ] Empty state if no trainers match filters
- [ ] Mobile: filters in a slide-up drawer

---

### [ ] T-032 · Trainer Profile Page
**Priority:** 🔴 Critical  
**Route:** `/trainers/[id]`  
**File:** `src/app/(student)/trainers/[id]/page.tsx`  
**API:** `GET /trainers/{id}`, `GET /trainers/{id}/availability`

**Sections:**

1. **Profile Header**
   - Large photo · Name · Verified badge (if approved) · Rating · Total sessions
   - Domains (pills) · Languages · Years experience
   - Share button

2. **About** (bio text)

3. **Certifications & Experience** (list)

4. **Packages** (cards)
   - Title · Interview type · Duration · Sessions included · CV review included?
   - Price (large) · Difficulty badge
   - "Book This Package" button

5. **Availability Calendar**
   - Week view: Mon–Sun
   - Available slots shown as clickable time chips
   - Grey out past dates and booked slots

6. **Reviews** (paginated list)
   - Star rating · Student name (avatar) · Comment · Date
   - Rating summary at top (5 bars showing distribution)

**Acceptance Criteria:**
- [ ] Packages render correctly with all details
- [ ] Selecting a package + slot triggers booking flow (T-033)
- [ ] Calendar shows correct month/week navigation
- [ ] Reviews paginated with load more

---

### [ ] T-033 · Booking Flow (Multi-Step)
**Priority:** 🔴 Critical  
**Route:** `/book/[trainer_id]`  
**File:** `src/app/(student)/book/[trainer_id]/page.tsx`

**Step 1: Select Package**
- Show all trainer packages as selectable cards
- Selected card gets highlight border + checkmark

**Step 2: Choose Time Slot**
- Calendar week view
- Click date → shows available time slots for that date
- Selected slot highlighted

**Step 3: Payment**
- Order summary: Trainer name · Package · Date/time · Duration · Price
- Payment method selection (radio cards):
  - 🇧🇩 SSLCommerz (BDT)
  - 📱 bKash (BDT)
  - 📱 Nagad (BDT)
  - 💳 Stripe (USD)
  - 🅿️ PayPal (USD)
- "Pay Now" button

**API calls:**
- Step 2: `GET /trainers/{id}/availability`
- Step 3: `POST /bookings` → `POST /payments/initiate`

**After payment:**
- Redirect to gateway URL
- On return: show `/booking/confirmed?id={interview_id}`

**Step indicator bar** at top showing current step

**Acceptance Criteria:**
- [ ] Cannot proceed to next step without completing current
- [ ] Back button works between steps
- [ ] Order summary visible on all steps (sidebar desktop / bottom sheet mobile)
- [ ] Payment redirects to gateway URL
- [ ] Loading states during API calls

---

### [ ] T-034 · Booking Confirmation Page
**Priority:** 🔴 Critical  
**Route:** `/booking/confirmed`  
**File:** `src/app/(student)/booking/confirmed/page.tsx`

**Shows:**
- ✅ Large success icon (animated checkmark)
- "Booking Confirmed!" heading
- Interview details: Trainer · Date/time · Package · Duration
- Meeting link (shown closer to session time)
- "Add to Calendar" button (Google Calendar link)
- "Go to Dashboard" button

**Acceptance Criteria:**
- [ ] Animated checkmark on load
- [ ] All booking details displayed
- [ ] Calendar button opens Google Calendar with pre-filled event

---

### [ ] T-035 · My Sessions Page
**Priority:** 🟠 High  
**Route:** `/student/sessions`  
**File:** `src/app/(student)/sessions/page.tsx`  
**API:** `GET /students/me/sessions`

**Tabs:** Upcoming · Completed · Cancelled

**Upcoming session card:**
- Trainer photo · Name · Package · Date/time
- Countdown timer (e.g. "In 2 days 4 hours")
- "Join" button (active 15 min before, using Agora)
- "Cancel" button (if > 24h before)

**Completed session card:**
- Trainer · Package · Date
- Evaluation score summary (if received)
- XP earned badge
- "Rate Trainer" button (if not rated yet)

**Acceptance Criteria:**
- [ ] Tabs filter by status
- [ ] Countdown timer updates in real-time
- [ ] Join button only enabled near session time
- [ ] Rate trainer opens rating modal

---

### [ ] T-036 · Student Profile Page
**Priority:** 🟠 High  
**Route:** `/student/profile`  
**File:** `src/app/(student)/profile/page.tsx`  
**API:** `GET /students/me`, `PUT /students/me`

**Sections:**

1. **Profile Completion Bar**
   - % complete with what's missing listed below

2. **Basic Info Form**
   - Avatar upload (click to change)
   - Full name · Phone
   - University · Department · Graduation year

3. **Career Info**
   - Preferred job role · Country
   - LinkedIn URL · GitHub URL

4. **Skills**
   - Tag input (type + Enter to add, click × to remove)

5. **Resume**
   - Upload area (drag & drop or click, PDF only, max 5MB)
   - Shows current resume filename with download link

**Acceptance Criteria:**
- [ ] Profile completion % recalculates live as fields are filled
- [ ] Avatar upload with preview before save
- [ ] Resume drag-and-drop with file type/size validation
- [ ] Form saves on submit with success toast
- [ ] API errors shown inline

---

### [ ] T-037 · Evaluations Page
**Priority:** 🟡 Medium  
**Route:** `/student/evaluations`  
**File:** `src/app/(student)/evaluations/page.tsx`  
**API:** `GET /students/me/evaluations`

**Each evaluation card shows:**
- Trainer name + date
- 6-category radar chart (communication, technical, confidence, problem solving, english, HR readiness)
- Overall level badge (color-coded: not_ready=red, industry_ready=green)
- Written feedback text
- XP earned

**Chart:** Use `recharts` RadarChart component

**Acceptance Criteria:**
- [ ] Radar chart renders correctly for each evaluation
- [ ] Overall level shown with appropriate color badge
- [ ] Paginated list (load more)

---

## PHASE 4 — Gamification Module

### [ ] T-040 · Leaderboard Page
**Priority:** 🔴 Critical  
**Route:** `/leaderboard`  
**File:** `src/app/(public)/leaderboard/page.tsx`  
**API:** `GET /leaderboard/global`, `GET /leaderboard/country/{code}`

**Layout:**

1. **Tab Bar:** Global · Bangladesh · India · Pakistan

2. **Top 3 Podium**
   - Visual podium: 2nd left (silver) · 1st center (gold) · 3rd right (bronze)
   - Each shows: Avatar (large) · Name · XP · Level badge

3. **Rank Table** (rank 4–100)
   - Rank # · Avatar · Name · Country flag · XP · Level · Badges count
   - Current logged-in student row: highlighted in blue
   - If current user is off-screen: sticky row at bottom

4. **My Rank Card** (logged-in only)
   - Your rank · Your XP · XP needed for next rank · Progress bar

**Acceptance Criteria:**
- [ ] Tabs switch between leaderboard scopes without re-fetching if cached
- [ ] Current user row highlighted and sticky at bottom when off-screen
- [ ] Country flags shown using emoji or SVG
- [ ] Podium has animation on load

---

### [ ] T-041 · Badges Page
**Priority:** 🟠 High  
**Route:** `/student/badges`  
**File:** `src/app/(student)/badges/page.tsx`  
**API:** `GET /badges`, `GET /badges/me`

**Layout:**

1. **Stats Bar:** {X} badges earned · {Y} locked

2. **Badge Grid** (all 15 badges)
   - Earned: full color, checkmark, unlock date
   - Locked: grayscale overlay with lock icon
   - Each badge card:
     - Icon (emoji or image) · Name · Category pill
     - Unlock condition description
     - XP reward

3. **Filter by Category:** All · Achievement · Skill · Milestone · Special

**Acceptance Criteria:**
- [ ] Locked badges show progress toward unlock (e.g. "3/5 sessions")
- [ ] Category filter works
- [ ] Earned badges sorted first

---

### [ ] T-042 · XP History Page
**Priority:** 🟡 Medium  
**Route:** `/student/xp-history`  
**File:** `src/app/(student)/xp-history/page.tsx`  
**API:** `GET /students/me/xp-history`

**Layout:**
- XP events timeline (newest first)
- Each row: event icon · event description · +XP amount · date
- Color code by event type:
  - 🟢 session_complete: green
  - 🟣 badge_earned: purple
  - 🔵 daily_login: blue
  - 🟡 streak_bonus: yellow

**Total XP summary at top**

**Acceptance Criteria:**
- [ ] Color-coded event types
- [ ] Paginated with cursor
- [ ] Dates formatted relative (e.g. "2 days ago")

---

## PHASE 5 — Trainer Module

### [ ] T-050 · Trainer Dashboard
**Priority:** 🔴 Critical  
**Route:** `/trainer/dashboard`  
**File:** `src/app/(trainer)/dashboard/page.tsx`  
**API:** `GET /trainers/me/dashboard`

**Layout:**

1. **Approval Status Banner**
   - If `is_approved = false`: yellow warning banner "Your account is pending admin approval"
   - If approved: don't show

2. **Stats Row** (4 cards)
   - This month earnings (BDT)
   - Total sessions
   - Average rating (stars)
   - Pending evaluations (sessions not yet evaluated)

3. **Upcoming Sessions** (next 5)
   - Student name + photo · Package · Date/time · "Join" button

4. **Pending Evaluations**
   - Sessions completed but evaluation not submitted
   - "Submit Evaluation" button → opens evaluation modal

5. **Earnings Chart**
   - Bar chart: last 6 months earnings
   - Using recharts `BarChart`

6. **Recent Reviews** (last 3)
   - Student name · Stars · Comment · Date

**Acceptance Criteria:**
- [ ] Approval banner shows/hides correctly
- [ ] Earnings chart uses real API data
- [ ] "Submit Evaluation" opens evaluation modal (T-053)

---

### [ ] T-051 · Package Management
**Priority:** 🔴 Critical  
**Route:** `/trainer/packages`  
**File:** `src/app/(trainer)/packages/page.tsx`  
**API:** `GET /trainers/me/packages`, `POST /trainers/me/packages`, `PUT`, `DELETE`

**Layout:**
- "Create Package" button top-right
- Package cards (list view):
  - Title · Type · Domain · Price · Difficulty
  - Total bookings · Active/Paused toggle
  - Edit button · Delete button (with confirm modal)

**Create/Edit Package Modal (form):**
- Title (text)
- Description (textarea)
- Price in BDT (number)
- Number of sessions (1–10)
- Duration (30 / 45 / 60 minutes — select)
- Interview type (HR / Technical / Coding / System Design / Behavioral)
- Domain (dropdown — all domains from Appendix)
- Difficulty (Beginner / Intermediate / Advanced)
- Language (English / Bangla / Both)
- Is Live session? (toggle)
- Includes CV Review? (toggle)

**Acceptance Criteria:**
- [ ] Create opens modal form
- [ ] Edit pre-fills form with existing data
- [ ] Delete shows confirm dialog before API call
- [ ] Active toggle calls PUT with `{ is_active: true/false }`
- [ ] Form validates all required fields before submit

---

### [ ] T-052 · Availability Calendar
**Priority:** 🔴 Critical  
**Route:** `/trainer/availability`  
**File:** `src/app/(trainer)/availability/page.tsx`  
**API:** `POST /trainers/me/availability`, `GET /trainers/{id}/availability`

**Layout:**
- Month calendar view
- Click a day → shows time slot editor for that day
- Time slot editor: add slots (start time + end time, 30 min increments)
- Booked slots shown in blue (cannot delete)
- Available unbooked slots shown in green (can delete)
- "Save Availability" button

**Slot management:**
- Trainer can add multiple slots per day
- Cannot add slot in the past
- Cannot overlap existing slots

**Acceptance Criteria:**
- [ ] Month navigation (prev/next)
- [ ] Click day to manage slots
- [ ] Can add/delete only unbooked slots
- [ ] Visual distinction between booked and available slots

---

### [ ] T-053 · Student Evaluation Modal
**Priority:** 🔴 Critical  
**Triggered from:** Trainer Dashboard pending evaluations  
**API:** `POST /trainers/me/evaluations/{interview_id}`

**Form:**
- 6 score sliders (1–10 each):
  - Communication
  - Technical Knowledge
  - Confidence
  - Problem Solving
  - English Speaking
  - HR Readiness
- Each slider shows current value as number
- Overall Level dropdown: not_ready / beginner / intermediate / advanced / industry_ready
- Written Feedback (textarea, min 50 chars)
- Submit button

**Shows above form:**
- Student name + photo
- Package name
- Session date

**Acceptance Criteria:**
- [ ] All 6 scores required (range 1–10)
- [ ] Overall level required
- [ ] Feedback minimum 50 characters (show count)
- [ ] Success: closes modal + removes from pending list

---

### [ ] T-054 · Earnings Page
**Priority:** 🟠 High  
**Route:** `/trainer/earnings`  
**File:** `src/app/(trainer)/earnings/page.tsx`  
**API:** `GET /trainers/me/earnings`

**Layout:**
1. **Summary Cards**: Total earnings · This month · Pending payout · Commission paid
2. **Monthly Earnings Bar Chart** (last 12 months, recharts)
3. **Payout History Table**:
   - Date · Amount · Status (badge) · Method
4. **Payout Settings**: Bank / bKash number (editable form)

**Acceptance Criteria:**
- [ ] Currency formatted as BDT (e.g. ৳1,500)
- [ ] Pending payout row highlighted
- [ ] Payout settings save on submit

---

### [ ] T-055 · Trainer Profile Edit
**Priority:** 🟠 High  
**Route:** `/trainer/profile`  
**File:** `src/app/(trainer)/profile/page.tsx`  
**API:** `GET /trainers/me`, `PUT /trainers/me`

**Form sections:**
- Avatar upload
- Full name · Bio (textarea)
- Expertise Domains (multi-select)
- Years of experience
- Certifications (add/remove list: name + issuer + year)
- Company experience (add/remove list: company name + role + years)
- Hourly rate (BDT)
- Language
- Payout info (bank/bKash details)

**Acceptance Criteria:**
- [ ] Certifications and experience are dynamic lists (add/remove)
- [ ] Domains use multi-select component
- [ ] Form saves all sections in one PUT request

---

## PHASE 6 — Company Module

### [ ] T-060 · Company Dashboard
**Priority:** 🟠 High  
**Route:** `/company/dashboard`  
**File:** `src/app/(company)/dashboard/page.tsx`  
**API:** `GET /companies/me/dashboard`

**Layout:**
1. **KYC Status Banner**: Pending / Verified / Rejected
2. **Stats Row**: Active campaigns · Total candidates · Interviews conducted · Hire rate
3. **Active Campaigns** (list)
4. **Recent Candidates** (last 5 with pipeline stage)
5. **Quick Actions**: Create Campaign · Search Talent · View Inbox

---

### [ ] T-061 · Hiring Campaigns
**Priority:** 🟠 High  
**Route:** `/company/campaigns`  
**File:** `src/app/(company)/campaigns/page.tsx`  
**API:** `GET /companies/me/campaigns`, `POST /companies/me/campaigns`

**Layout:**
- Tabs: Active · Draft · Archived
- Campaign cards with candidate count
- "Create Campaign" button opens modal form:
  - Title · Job role · Description · Domain · Requirements (tag input)

---

### [ ] T-062 · Candidate Pipeline (Kanban)
**Priority:** 🟠 High  
**Route:** `/company/campaigns/[id]/pipeline`  
**File:** `src/app/(company)/campaigns/[id]/pipeline/page.tsx`

**4 Kanban columns:**
- Invited → Interviewed → Shortlisted → Hired

**Candidate cards:** Avatar · Name · Domain · Score · Move to next stage button

**Acceptance Criteria:**
- [ ] Drag-and-drop between columns (use `@dnd-kit/core`)
- [ ] Stage change calls `PUT /companies/me/candidates/{id}/status`
- [ ] Cards show candidate XP, level, badges count

---

### [ ] T-063 · Talent Pool Search
**Priority:** 🟡 Medium  
**Route:** `/company/candidates`  
**File:** `src/app/(company)/candidates/page.tsx`  
**API:** `GET /companies/me/candidates`

**Filters:** Skill · Domain · Min score · Country  
**Student cards:** Name · Skills · XP · Level · Invite button

---

## PHASE 7 — Admin Module

### [ ] T-070 · Admin Dashboard
**Priority:** 🟠 High  
**Route:** `/admin/dashboard`  
**File:** `src/app/(admin)/dashboard/page.tsx`  
**API:** `GET /admin/dashboard`

**Layout:**
1. **Platform Stats Grid** (6 cards): Total users · Active trainers · Sessions today · Revenue today · Pending trainers · Pending KYC
2. **Revenue Chart**: Line chart last 30 days (recharts)
3. **Recent Activity Feed**: User registrations, trainer approvals, sessions completed
4. **Pending Actions**: Trainer approvals queue + Company KYC queue (with quick approve buttons)

---

### [ ] T-071 · User Management
**Priority:** 🟠 High  
**Route:** `/admin/users`  
**File:** `src/app/(admin)/users/page.tsx`  
**API:** `GET /admin/users`

**Table columns:** ID · Name · Email · Role · Status · Created at · Actions  
**Actions:** Activate / Suspend (toggle) · View profile  
**Filters:** Role · Status · Search by email/name  
**Pagination:** Cursor-based

---

### [ ] T-072 · Trainer Approval Queue
**Priority:** 🟠 High  
**Route:** `/admin/trainers`  
**File:** `src/app/(admin)/trainers/page.tsx`  
**API:** `GET /admin/trainers/pending`, `POST /admin/trainers/{id}/approve`

**Pending trainer cards:**
- Name · Email · Domains · Experience · Certifications
- Approve button (green) · Reject button (red)
- View full profile link

**Acceptance Criteria:**
- [ ] Approve calls `POST /admin/trainers/{id}/approve`
- [ ] Card removed from list after action
- [ ] Confirmation dialog before reject

---

### [ ] T-073 · Company KYC Verification
**Priority:** 🟡 Medium  
**Route:** `/admin/companies`  
**File:** `src/app/(admin)/companies/page.tsx`  
**API:** `GET /admin/companies/pending`, `POST /admin/companies/{id}/verify`

**Similar to T-072 but for companies:**
- Company name · Industry · Registration number
- KYC document link (PDF viewer or download)
- Verify / Reject buttons

---

### [ ] T-074 · Revenue Reports
**Priority:** 🟡 Medium  
**Route:** `/admin/reports`  
**File:** `src/app/(admin)/reports/page.tsx`  
**API:** `GET /admin/reports/revenue`

**Charts (recharts):**
- Total revenue by month (bar chart)
- Commission earned (area chart)
- Revenue by payment gateway (pie chart)

**Summary table:** Period · Revenue · Commission · Sessions · Avg session value

---

## PHASE 8 — Video Session

### [ ] T-080 · Video Session Page
**Priority:** 🔴 Critical  
**Route:** `/session/[interview_id]`  
**File:** `src/app/(session)/[interview_id]/page.tsx`  
**API:** `GET /interviews/{id}`, `POST /interviews/{id}/join`

**Layout (full screen):**
- Remote video (large, center)
- Local video (small, picture-in-picture, bottom right)
- Control bar (bottom center):
  - 🎤 Mute / Unmute
  - 📹 Camera On / Off
  - 📞 End Call (red)
  - ⏱ Session timer (counting up)
- Session info overlay (top left): Trainer/Student name · Package name
- Trainer only: "Complete Session" button (top right, shown after 30 min)

**Agora integration:**
```ts
// src/lib/agora/useVideoSession.ts
// Uses agora-rtc-sdk-ng
// join(channelName, token, uid)
// publish local tracks (mic + camera)
// subscribe to remote user tracks
// leave on unmount
```

**API flow:**
1. Load page → `GET /interviews/{id}` → get channel name
2. On mount → `POST /interviews/{id}/join` → get Agora token
3. Join Agora channel with token
4. Trainer clicks "Complete Session" → `POST /interviews/{id}/complete`

**Acceptance Criteria:**
- [ ] Local camera preview shown before joining
- [ ] Remote video renders in main area
- [ ] Mute/camera toggle works
- [ ] Timer counts from session start
- [ ] "Complete Session" button only shown to trainer, after 30 min
- [ ] On complete: redirect trainer to evaluation modal

---

## PHASE 9 — Notifications

### [ ] T-090 · Notification Bell & Dropdown
**Priority:** 🟠 High  
**File:** `src/components/layout/NotificationBell.tsx`

**Behavior:**
- Bell icon in navbar with unread count badge
- Click → dropdown list of recent 5 notifications
- Each notification: icon · title · body · time ago
- "Mark all read" button
- "View all" link → `/notifications`

**Store:** `src/stores/notificationStore.ts`
- Poll `GET /notifications` every 30 seconds when page visible
- Or use WebSocket/SSE if backend supports

**Acceptance Criteria:**
- [ ] Unread count badge shows correctly
- [ ] Mark all read updates UI immediately
- [ ] Clicking notification navigates to relevant page

---

### [ ] T-091 · Notifications Page
**Priority:** 🟡 Medium  
**Route:** `/notifications`  
**File:** `src/app/notifications/page.tsx`

**Full list of all notifications, paginated**  
**Grouped by: Today · This week · Earlier**  
**Read/unread visual distinction**

---

## PHASE 10 — Additional Pages

### [ ] T-100 · Public Student Profile
**Priority:** 🟡 Medium  
**Route:** `/students/[id]`  
**File:** `src/app/(public)/students/[id]/page.tsx`  
**API:** `GET /students/{id}/public`

**Shows:** Name · Level · Rank · XP bar · Badges earned · Sessions completed · Skills  
**Does NOT show:** Email, phone, resume

---

### [ ] T-101 · Settings Page
**Priority:** 🟡 Medium  
**Route:** `/settings`  
**File:** `src/app/settings/page.tsx`

**Sections:**
- Change password form
- Language preference (English / Bangla)
- Notification preferences (email / SMS / in-app toggles)
- Delete account (danger zone, requires password confirm)

---

### [ ] T-102 · 404 Page
**Priority:** 🟡 Medium  
**File:** `src/app/not-found.tsx`

**Shows:** Friendly 404 illustration · "Page not found" · "Go Home" button

---

### [ ] T-103 · Unauthorized Page
**Priority:** 🟡 Medium  
**File:** `src/app/unauthorized/page.tsx`

**Shows:** Lock icon · "You don't have permission" · "Go to Dashboard" button

---

## PHASE 11 — i18n & Accessibility

### [ ] T-110 · i18n Setup (English + Bangla)
**Priority:** 🟡 Medium

**Library:** `next-intl`

**Files:**
- `messages/en.json` — all English strings
- `messages/bn.json` — all Bangla strings
- Language switcher component in navbar

**Key strings to translate:**
- Navigation labels
- Form labels and errors
- Button text
- Dashboard stat labels

---

### [ ] T-111 · Accessibility Audit
**Priority:** 🟡 Medium

**Checklist:**
- [ ] All images have alt text
- [ ] All form inputs have associated labels
- [ ] Focus visible on all interactive elements
- [ ] Color contrast ratio ≥ 4.5:1 (WCAG AA)
- [ ] Keyboard navigation works on all pages
- [ ] Screen reader tested on: dashboard, booking flow, leaderboard

---

## PHASE 12 — Performance

### [ ] T-120 · Performance Optimization
**Priority:** 🟢 Low

**Tasks:**
- [ ] All images use `next/image` with correct width/height
- [ ] API calls use React Query with 5 min stale time
- [ ] Heavy components (charts, video) are lazy-loaded with `dynamic()`
- [ ] Bundle size analyzed with `@next/bundle-analyzer`
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms

---

## PHASE 13 — Testing

### [ ] T-130 · Frontend Testing Setup
**Priority:** 🟢 Low

**Tools:** Vitest · React Testing Library · Cypress

**Unit tests to write:**
- `authStore` — login, logout, token persistence
- `Button` component — renders, loading state, disabled state
- `XPService` calculations — level from XP
- `formatCurrency` utility — BDT formatting
- `RoleGuard` — redirects correctly per role

**E2E tests (Cypress):**
- Register as student → verify email → complete profile
- Search trainer → book session → complete payment
- Trainer creates package → sets availability
- Student joins session → rates trainer
- View leaderboard

---

## Appendix — XP Levels Reference

| Level | Name | XP Required |
|-------|------|------------|
| 1 | Newcomer | 0 |
| 2 | Explorer | 200 |
| 3 | Learner | 500 |
| 4 | Challenger | 1,000 |
| 5 | Achiever | 2,000 |
| 6 | Professional | 3,500 |
| 7 | Expert | 5,500 |
| 8 | Elite | 8,000 |
| 9 | Master | 11,500 |
| 10 | Industry Ready | 15,000+ |

---

## Appendix — Domain Categories

```
Software Engineering  → Frontend, Backend, Full-Stack, Mobile, System Design
Cybersecurity         → Ethical Hacking, SOC Analyst, Network Security, Cloud Security
DevOps / Cloud        → AWS, GCP, Azure, Kubernetes, CI/CD, Infrastructure
Data & AI             → Data Science, ML, Data Engineering, Analytics
HR / Behavioral       → General HR, Competency-Based, Leadership, Communication
Business / Finance    → Product Management, Business Analyst, Banking, Accounting
Design                → UI/UX, Graphic Design, Product Design
Government / Viva     → BCS, Bank Viva, University Viva, Job Exam Prep
```

---

## Appendix — Color Reference

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-600` | `#1A56DB` | Primary buttons, links, active states |
| `purple-600` | `#7E3AF2` | XP, gamification, levels |
| `success-500` | `#0E9F6E` | Badges, approved, completed |
| `warning-400` | `#E3A008` | Streak, pending, warning |
| `danger-600` | `#E02424` | Errors, cancel, danger |
| `gray-900` | `#111928` | Primary text |
| `gray-500` | `#6B7280` | Secondary text |
| `blue-50` | `#EFF6FF` | Card backgrounds |

---

## Appendix — Key API Calls Quick Reference

```
Auth:
  POST /auth/register          → { full_name, email, password, role }
  POST /auth/login             → { email, password }
  POST /auth/logout
  POST /auth/refresh           → { refresh_token }
  POST /auth/google            → { code }

Student:
  GET  /students/me
  PUT  /students/me
  POST /students/me/resume
  GET  /students/me/dashboard
  GET  /students/me/sessions
  GET  /students/me/evaluations
  GET  /students/me/badges
  GET  /students/me/xp-history

Trainers (public):
  GET  /trainers               → ?domain=&min_rating=&max_price=&search=
  GET  /trainers/{id}
  GET  /trainers/{id}/availability

Trainer (auth):
  PUT  /trainers/me
  GET  /trainers/me/dashboard
  GET  /trainers/me/earnings
  GET  /trainers/me/packages
  POST /trainers/me/packages
  PUT  /trainers/me/packages/{id}
  DELETE /trainers/me/packages/{id}
  POST /trainers/me/availability
  POST /trainers/me/evaluations/{interview_id}

Booking:
  POST /bookings               → { package_id, availability_id }
  GET  /bookings/{id}
  POST /bookings/{id}/cancel

Interviews:
  GET  /interviews/{id}
  POST /interviews/{id}/join
  POST /interviews/{id}/complete

Payments:
  POST /payments/initiate      → { interview_id, gateway }
  GET  /payments/history
  GET  /payments/{id}/invoice

Gamification:
  GET  /leaderboard/global
  GET  /leaderboard/country/{code}
  GET  /leaderboard/me/rank
  GET  /badges
  GET  /badges/me
  GET  /xp/levels

Company:
  GET  /companies/me/dashboard
  GET  /companies/me/campaigns
  POST /companies/me/campaigns
  POST /companies/me/campaigns/{id}/invite
  GET  /companies/me/candidates
  PUT  /companies/me/candidates/{id}/status

Admin:
  GET  /admin/dashboard
  GET  /admin/users
  PUT  /admin/users/{id}/status
  GET  /admin/trainers/pending
  POST /admin/trainers/{id}/approve
  GET  /admin/companies/pending
  POST /admin/companies/{id}/verify
  GET  /admin/reports/revenue
```

---

*NextHire Frontend Tasks v1.0.0 — Last updated: 2026-06-05*
