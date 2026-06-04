# CourseApp

A React Native course browsing application with offline-first architecture, Supabase backend, WatermelonDB local persistence, and Zustand state management.

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React Native 0.79 + TypeScript | Cross-platform, type safety |
| Backend | Supabase (PostgreSQL) | Hosted Postgres, REST SDK, RLS |
| Local DB | WatermelonDB (SQLite) | Reactive, performant offline DB |
| State | Zustand | Minimal boilerplate, scalable |
| Navigation | React Navigation 7 (Native Stack) | Standard RN navigation |
| List | FlashList (@shopify/flash-list) | High-perf virtualized list |
| Network | @react-native-community/netinfo | Connection status detection |

## Architecture

Feature-based architecture with clear separation of concerns:

```
src/
├── features/
│   ├── courses/
│   │   ├── screens/        # CourseListScreen, CourseDetailScreen
│   │   ├── components/     # CourseCard, FilterBar
│   │   ├── hooks/          # useDebounce
│   │   ├── repository/     # CourseRepository (DB ops), CourseMapper
│   │   ├── store/          # Zustand courseStore
│   │   └── types/          # TS interfaces
│   └── shared/
│       └── components/     # Badge, StarRating, OfflineBanner, SkeletonCard
├── database/
│   ├── models/             # WatermelonDB Course model
│   └── schema/             # DB schema definition
├── services/
│   ├── supabase.ts         # Supabase client
│   └── NetworkService.ts   # Connection monitoring
├── navigation/             # React Navigation stack
├── config/                 # env.ts (reads env vars)
└── theme/                  # Colors, spacing, typography
```

Data flow: UI to Zustand store to Repository to WatermelonDB (source of truth). Supabase syncs in background; local data never blocked by network.

## Offline-First Strategy

1. App launches and loads courses from WatermelonDB immediately (zero network wait)
2. Background sync fires against Supabase
3. On success: upserts remote records into local DB, preserving `is_enrolled`
4. On failure: cached data remains displayed, error surfaced non-intrusively
5. Search, filter, sort, and enrollment work 100% offline
6. `is_enrolled` is a local-only field that sync never overwrites
7. Offline banner shown when `NetInfo` reports no connection
8. Last synced timestamp persisted in AsyncStorage and displayed in list header

## State Management

Zustand `courseStore` owns:
- `courses[]`: current filtered/sorted list (from local DB)
- `filters`: search, isPremium, isEnrolled, sortField, sortOrder
- `isLoading / isSyncing / isOnline / error / lastSynced`
- Actions: `loadCourses`, `syncCourses`, filter setters, `enrollCourse`, `unenrollCourse`

Search is debounced 350ms in UI; filter/sort executes at repository layer (WatermelonDB queries + JS sort), not in render.

## Supabase Setup

### 1. Create project

Go to [supabase.com](https://supabase.com), create a new project, note the Project URL and anon public key.

### 2. Run schema

In Supabase dashboard, open SQL Editor, paste and run `supabase/schema.sql`. This creates the `courses` table, enables RLS, adds a public read policy, and seeds 10 course records.

### 3. Row Level Security

The schema enables RLS with a single policy:
```sql
create policy "Allow public read access" on courses for select using (true);
```
No auth is required to read courses. Write operations happen only from local DB.

### 4. Environment configuration

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

Then update `src/config/env.ts` to read from your chosen env solution (e.g. `react-native-config`) or temporarily replace the fallback strings with your values for local dev. Never commit real keys to source control.

## Table Schema

```sql
create table courses (
  course_id                  text primary key,
  title                      text not null,
  description_short          text not null,
  instructor_id              text,
  instructor_name            text not null,
  instructor_expertise_level text,
  duration_weeks             int not null,
  price_usd                  numeric not null,
  is_premium                 boolean not null,
  tags                       text[] not null,
  rating                     numeric not null,
  last_updated               timestamptz not null
);
```

`is_enrolled` is a local-only field stored in WatermelonDB; it does not exist in Supabase, so user enrollment state is never overwritten by remote syncs.

## Setup Instructions

### Prerequisites
- Node.js 18+
- Xcode (iOS) or Android Studio (Android)
- CocoaPods (iOS): `gem install cocoapods`

### Install

```bash
cd CourseApp
npm install --legacy-peer-deps

# iOS
cd ios && bundle install && bundle exec pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

### Configure Supabase

Edit `src/config/env.ts` with your project URL and anon key (or use `react-native-config` with `.env`).

## Testing

```bash
# Run all tests
npx jest --no-coverage

# Run specific test suites
npx jest src/__tests__/CourseMapper.test.ts
npx jest src/__tests__/filterAndSort.test.ts
npx jest src/__tests__/enrollment.test.ts
```

### Test Coverage

| File | Tests | What |
|---|---|---|
| `CourseMapper.test.ts` | 3 | Supabase to local DTO mapping, null handling |
| `filterAndSort.test.ts` | 11 | Search, premium/enrolled filters, sort by rating/price/duration |
| `enrollment.test.ts` | 5 | Enroll/unenroll toggle, sync-preserves-enrollment, new course default |

## Features

### Course List Screen
- Instant load from local SQLite cache
- Background Supabase sync with pull-to-refresh
- Search by title, instructor name, or tag (debounced 350ms)
- Filter by Premium/Free and Enrolled/Not Enrolled (bottom sheet modal)
- Sort by Rating, Price, Duration (toggle asc/desc)
- Light/dark theme toggle in the header (persisted)
- Offline indicator banner
- Last synced timestamp
- Skeleton loading state
- Empty/error states

### Course Detail Screen
- Full course info: title, description, instructor, tags, rating, price, duration
- Instructor avatar with expertise level
- Mark as Enrolled / Remove Enrollment
- Enrollment persisted locally, immediately reflected in Course List
- Optimistic local update before DB write completes

## Assumptions & Known Limitations

- `react-native-config` is not wired by default; env vars are read from `src/config/env.ts` fallback strings. Replace with your keys for dev, or integrate `react-native-config` for production builds
- WatermelonDB JSI mode is disabled (`jsi: false`) for broader emulator compatibility; enable for production perf
- No Supabase Auth integration (bonus item, not implemented)
- Tags stored as JSON string in SQLite (WatermelonDB doesn't support array columns); deserialized via `tagsArray` getter
- No deep linking (bonus item, not implemented)
