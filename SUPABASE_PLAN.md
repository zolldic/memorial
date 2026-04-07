# Supabase Backend Implementation Plan

**Last Updated:** January 2025 (Post-Refactoring)  
**Codebase Status:** Refactored and modernized with improved type safety and modular architecture

This plan is based on the **current refactored React codebase** using local mock data and client-side state.

## 0) Frontend Data Discovery (Current State - Post-Refactoring)

### Primary entities currently in frontend

1. **`Martyr`** ✅ Fully unified model
- Source: `src/shared/types/index.ts`, `src/shared/data/martyrs.ts`
- Fields in use (100% unified, no duplicates):
  - `id: string`
  - `name: Record<Language, string>` ✅ (was: nameEn/nameAr - **REFACTORED**)
  - `age: number`
  - `dateOfMartyrdom: string` (YYYY-MM-DD format)
  - `location: Record<Language, string>` ✅ (was: locationEn/locationAr - **REFACTORED**)
  - `image: string` (path to image file)
  - `story: Record<Language, string>` ✅ (was: storyEn/storyAr - **REFACTORED**)
  - `profession: Record<Language, string>` ✅ (was: professionEn/professionAr - **REFACTORED**)
  - `candles: number`

**Migration Notes:**
- ✅ All backward-compatibility fields removed
- ✅ Standardized on `Record<Language, string>` pattern
- ✅ All components updated to use `martyr.name[lang]` instead of ternary
- ✅ Type safety: `Language = "en" | "ar"` enforced throughout

2. **`Memory`**
- Source: `src/shared/types/index.ts`, `src/shared/data/memories.ts`
- Fields in use:
  - `id: string`
  - `martyrId: string`
  - `authorName: string`
  - `relationship: "family" | "friend" | "stranger"`
  - `type: "story" | "photo" | "voice"`
  - `contentEn: string`
  - `contentAr: string`
  - `date: string`
  - `approved: boolean`

**Future Migration:** Consider unifying Memory to use `content: Record<Language, string>` pattern like Martyr

### Current read/write behavior in UI (Post-Refactoring)

1. **Reads**
- Home page reads `martyrsData` directly (`WallOfFaces`, `StoryOfTheWeek`, `AnimatedBackground`)
- Martyrs list uses `useMartyrs` hook → `martyrService` (React Query cached) ✅ **READY FOR MIGRATION**
- Martyrs detail uses `useMartyrDetail` hook → `martyrService` (React Query cached) ✅ **READY FOR MIGRATION**
- Filter logic isolated in `useMartyrFilters` hook ✅ **MODULAR**
- Search logic unified in `useMartyrSearch` hook ✅ **REUSABLE**
- Tribute wall shows only approved memories
- **URL State:** Filters synced to URL params (q, year, month, state) ✅ **NEW**

2. **Writes (currently local-only)**
- Share memory form:
  - Uses modular step components (SelectMartyrStep, MemoryTypeStep, WriteMemoryStep) ✅ **REFACTORED**
  - Form logic in `useShareMemoryForm` hook ✅ **READY FOR MUTATION**
  - Currently shows success toast only
- Candle action:
  - Uses `useCandleState` hook with localStorage persistence ✅ **NEW**
  - Currently persists to localStorage only
  - **Migration path:** Replace localStorage with Supabase insert

3. **Auth**
- No real auth flow currently exists
- Product language suggests moderation workflow and anonymous submissions
- **Prepared:** ErrorBoundary wraps app for graceful error handling ✅ **NEW**

### Architecture Improvements (Post-Refactoring)

✅ **Component Extraction:**
- ShareMemory: 358 → 99 lines (72% reduction)
- Header: 150 → 78 lines (48% reduction)
- Created 4 new step components + MobileMenu component

✅ **Hook Consolidation:**
- `useMartyrSearch`: Unified search logic across features
- `useMartyrFilters`: Combines search + year/month/state filtering
- `useCandleState`: localStorage persistence with ready migration path
- `useDirectionalArrow`: Consolidated RTL/LTR arrow logic

✅ **Type Safety:**
- Zero `any` types in codebase
- Strict `Language` type enforced
- All data model duplicates removed

✅ **Performance:**
- React Query config: staleTime 5min, gcTime 10min
- Route-level lazy loading (6 routes)
- AnimatedBackground optimized (CSS extracted, 2x vs 3x duplication)

✅ **Testing Foundation:**
- Vitest configured
- Example test for `useMartyrSearch`
- Ready for API layer testing

---

## 1) Proposed PostgreSQL Data Model (Normalized)

### Entity relationship overview

1. `auth.users` (Supabase-managed)
2. `profiles` (app profile for users)
3. `user_roles` (RBAC: admin/editor/moderator/contributor)
4. `martyrs` (language-neutral canonical record)
5. `martyr_translations` (localized text per language)
6. `memories` (submission metadata and moderation status)
7. `memory_translations` (localized memory content)
8. `memory_assets` (optional media for photo/voice memories)
9. `martyr_candle_events` (append-only candle interactions)

### Why this normalization

1. Keeps canonical facts and localized text separate
2. Supports future language expansion beyond `en`/`ar` without schema changes
3. **ALIGNS** with current `Record<Language, string>` pattern in refactored frontend ✅
4. Supports moderation and audit-friendly workflows
5. Avoids storing derived counters as primary truth (candles are event-based)

### Frontend-to-DB Mapping

**Current Frontend Type:**
```typescript
interface Martyr {
  id: string;
  name: Record<Language, string>;
  location: Record<Language, string>;
  // ...
}
```

**Database Structure:**
```sql
-- martyrs table (canonical)
id, age, date_of_martyrdom, state_code, image_path

-- martyr_translations table (localized)
martyr_id, language, full_name, location_label, profession_label, story
```

**Adapter Pattern (migration helper):**
```typescript
function dbToFrontendMartyr(
  martyr: DbMartyr,
  translations: DbMartyrTranslation[]
): Martyr {
  return {
    id: martyr.id,
    name: {
      en: translations.find(t => t.language === 'en')?.full_name || '',
      ar: translations.find(t => t.language === 'ar')?.full_name || ''
    },
    // ... same pattern for location, profession, story
  };
}
```

✅ **Clean migration path:** Current frontend pattern directly maps to normalized DB structure

---

## 1) Proposed PostgreSQL Data Model (Normalized)

### Entity relationship overview

1. `auth.users` (Supabase-managed)
2. `profiles` (app profile for users)
3. `user_roles` (RBAC: admin/editor/moderator/contributor)
4. `martyrs` (language-neutral canonical record)
5. `martyr_translations` (localized text per language)
6. `memories` (submission metadata and moderation status)
7. `memory_translations` (localized memory content)
8. `memory_assets` (optional media for photo/voice memories)
9. `martyr_candle_events` (append-only candle interactions)

### Why this normalization

1. Keeps canonical facts and localized text separate.
2. Supports future language expansion beyond `en`/`ar` without schema changes.
3. Supports moderation and audit-friendly workflows.
4. Avoids storing derived counters as primary truth (candles are event-based; count can be materialized).

### Table design summary

1. `profiles`
- `id uuid` PK, FK -> `auth.users.id`
- `display_name text`
- `is_public boolean`
- timestamps

2. `user_roles`
- one row per user role
- supports multi-role users and future granular policy checks

3. `martyrs`
- canonical record: age, date, state code, primary image path, published flag, searchable metadata

4. `martyr_translations`
- one row per martyr per language (`en`, `ar`)
- localized `full_name`, `location_label`, `profession_label`, `story`

5. `memories`
- metadata: `martyr_id`, `submitted_by`, `author_name`, `relationship`, `memory_type`, moderation status

6. `memory_translations`
- one row per memory per language
- localized `content`

7. `memory_assets`
- references storage object path and media metadata
- used for photo/video/voice submissions

8. `martyr_candle_events`
- append-only table for per-user or anonymous candle interactions
- unique constraints prevent duplicate lighting abuse patterns

---

## 2) SQL Migration (CREATE TABLE Statements)

```sql
-- Required extensions
create extension if not exists pgcrypto;

-- Enums
do $$ begin
  create type public.app_role as enum ('admin', 'editor', 'moderator', 'contributor');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.language_code as enum ('en', 'ar');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.relationship_type as enum ('family', 'friend', 'stranger');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.memory_type as enum ('story', 'photo', 'voice');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.moderation_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

-- Profiles (maps auth.users to app-level profile data)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- User roles (RBAC)
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

-- Martyrs (language-neutral)
create table if not exists public.martyrs (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  age smallint check (age > 0 and age < 120),
  date_of_martyrdom date,
  state_code text,
  primary_image_path text,
  candles_count integer not null default 0,
  is_published boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Martyr translations
create table if not exists public.martyr_translations (
  id uuid primary key default gen_random_uuid(),
  martyr_id uuid not null references public.martyrs(id) on delete cascade,
  language public.language_code not null,
  full_name text not null,
  location_label text,
  profession_label text,
  story text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (martyr_id, language)
);

-- Memories (submission metadata + moderation)
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  martyr_id uuid not null references public.martyrs(id) on delete cascade,
  submitted_by uuid references auth.users(id) on delete set null,
  author_name text,
  relationship public.relationship_type not null,
  memory_type public.memory_type not null,
  status public.moderation_status not null default 'pending',
  submitted_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  rejection_reason text,
  is_anonymous boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Memory translations (content by language)
create table if not exists public.memory_translations (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid not null references public.memories(id) on delete cascade,
  language public.language_code not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (memory_id, language)
);

-- Memory media assets (photo/video/voice)
create table if not exists public.memory_assets (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid not null references public.memories(id) on delete cascade,
  storage_bucket text not null,
  storage_path text not null,
  mime_type text,
  byte_size integer,
  duration_seconds numeric,
  created_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

-- Candle events (append-only interaction log)
create table if not exists public.martyr_candle_events (
  id uuid primary key default gen_random_uuid(),
  martyr_id uuid not null references public.martyrs(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  anon_fingerprint_hash text,
  created_at timestamptz not null default now(),
  check (user_id is not null or anon_fingerprint_hash is not null)
);

-- Suggested indexes
create index if not exists idx_martyrs_date on public.martyrs(date_of_martyrdom desc);
create index if not exists idx_martyrs_state on public.martyrs(state_code);
create index if not exists idx_martyr_translations_name on public.martyr_translations(full_name);
create index if not exists idx_memories_martyr_status on public.memories(martyr_id, status, submitted_at desc);
create index if not exists idx_memory_translations_memory_lang on public.memory_translations(memory_id, language);
create index if not exists idx_candles_martyr_created on public.martyr_candle_events(martyr_id, created_at desc);

-- De-duplication constraints for candle actions
create unique index if not exists uq_candle_user_per_martyr
  on public.martyr_candle_events(martyr_id, user_id)
  where user_id is not null;

create unique index if not exists uq_candle_anon_per_martyr
  on public.martyr_candle_events(martyr_id, anon_fingerprint_hash)
  where anon_fingerprint_hash is not null;
```

---

## 3) Authentication Strategy

## Recommended provider rollout

1. Phase 1 (minimum)
- Anonymous/public read access for published martyrs and approved memories.
- No forced login for read-only browsing.

2. Phase 2
- Email OTP (magic link) or Email/Password for staff moderation accounts.
- Optional OAuth (Google) for easier moderator onboarding.

3. Optional contributor accounts
- Keep memory submission available anonymously.
- Allow signed-in contributors to track/edit their own pending submissions (later phase).

## Why this aligns to current UI

1. UI already supports anonymous submissions (`authorName` optional).
2. There is no current user account UI requiring immediate social login complexity.
3. Moderation language exists in copy; moderation staff auth is required.

---

## 4) Row Level Security (RLS) Plan

Enable RLS on all proposed public tables.

## Role helper function

Use a SQL helper like:

```sql
create or replace function public.has_role(check_role public.app_role)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid() and ur.role = check_role
  );
$$;
```

## Policy matrix by table

1. `profiles`
- SELECT:
  - User can read own profile.
  - Admin/moderator can read all.
- INSERT:
  - Authenticated user can insert own row (`id = auth.uid()`).
- UPDATE:
  - User can update own profile.
  - Admin can update all.
- DELETE:
  - Admin only.

2. `user_roles`
- SELECT:
  - User can read own role rows.
  - Admin can read all.
- INSERT/UPDATE/DELETE:
  - Admin only.

3. `martyrs`
- SELECT:
  - Public can read only `is_published = true`.
  - Staff can read all.
- INSERT/UPDATE/DELETE:
  - `editor` or `admin` only.

4. `martyr_translations`
- SELECT:
  - Public can read translations for published martyrs only.
  - Staff can read all.
- INSERT/UPDATE/DELETE:
  - `editor` or `admin` only.

5. `memories`
- SELECT:
  - Public can read only `status = 'approved'`.
  - Memory owner can read own submissions (`submitted_by = auth.uid()`).
  - Moderators/admin can read all.
- INSERT:
  - Authenticated users can insert with `submitted_by = auth.uid()`.
  - For anonymous submissions, use Edge Function with service role (recommended).
- UPDATE:
  - Owner can update own `pending` submissions (content edits before review).
  - Moderators/admin can update status/review fields.
- DELETE:
  - Owner can delete own `pending` submission.
  - Admin can delete any.

6. `memory_translations`
- SELECT:
  - Public can read only when parent memory is approved.
  - Owner can read own memory translations.
  - Moderator/admin can read all.
- INSERT/UPDATE/DELETE:
  - Same as parent memory ownership/status constraints.

7. `memory_assets`
- SELECT:
  - Public can read only if parent memory is approved and asset in public bucket.
  - Owner/moderator/admin for non-public states.
- INSERT:
  - Owner for own pending memory only.
  - Prefer signed upload URLs from Edge Function.
- UPDATE/DELETE:
  - Owner for own pending memory.
  - Moderator/admin always.

8. `martyr_candle_events`
- SELECT:
  - Public read allowed (or aggregated view only).
- INSERT:
  - Authenticated user: `user_id = auth.uid()`.
  - Anonymous: via Edge Function with hashed fingerprint and throttling.
- UPDATE/DELETE:
  - No public update/delete.
  - Admin only for abuse cleanup.

## RLS hardening notes

1. Prefer views for public consumption (`public_martyr_cards`, `public_martyr_detail`, `public_tribute_wall`) so client never touches moderation columns directly.
2. Keep moderation transitions (`pending -> approved/rejected`) in RPC/Edge Function to enforce state machine.

---

## 5) Type Generation Plan (End-to-End Type Safety)

## Source of truth

1. Database schema in Supabase migrations.
2. Generate TypeScript types from DB schema after each migration.

## Suggested commands

```bash
supabase gen types typescript --project-id <PROJECT_ID> --schema public > src/lib/supabase/database.types.ts
```

Optional script in `package.json`:

```json
{
  "scripts": {
    "supabase:types": "supabase gen types typescript --project-id <PROJECT_ID> --schema public > src/lib/supabase/database.types.ts"
  }
}
```

## Usage pattern

1. `Database` type imported from generated file.
2. `SupabaseClient<Database>` used in client singleton.
3. Derive row/insert/update helpers:
- `type MartyrRow = Database['public']['Tables']['martyrs']['Row']`
- `type MemoryInsert = Database['public']['Tables']['memories']['Insert']`

---

## 6) Integration Strategy (Updated for Refactored Codebase)

### Supabase client singleton

**Recommended location:**
- `src/lib/supabase/client.ts`

**Pattern:**
1. Create one browser client instance from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Export typed client
3. Keep schema-specific query modules in:
   - `src/features/martyrs/api/*.ts` (NEW - create this structure)
   - `src/features/memories/api/*.ts` (NEW - create this structure)

### Data fetching migration map (current -> target)

#### 1. Martyrs Service Layer ✅ **READY**
**Current:** `src/features/martyrs/services/martyrService.ts`
- Uses mock `martyrsData` array
- Already has service boundary abstraction
- Functions: `getMartyrs()`, `getMartyrById(id)`, `searchMartyrs(query, lang)`

**Target:** Replace with Supabase selects
```typescript
// src/features/martyrs/api/queries.ts
export async function getMartyrs(lang: Language) {
  const { data, error } = await supabase
    .from('martyrs')
    .select(`
      *,
      translations:martyr_translations!inner(
        full_name,
        location_label,
        profession_label,
        story
      )
    `)
    .eq('translations.language', lang)
    .eq('is_published', true);
  
  return data?.map(dbToFrontendMartyr) || [];
}
```

**Migration Benefit:** Keep same service interface → minimal component changes

#### 2. useMartyrs Hook ✅ **READY**
**Current:** `src/features/martyrs/hooks/useMartyrs.ts`
- Uses React Query
- Calls `martyrService.getMartyrs()`
- Cache key: `['martyrs']`

**Target:** Update service call only
```typescript
// Before (mock)
const { data } = useQuery({
  queryKey: ['martyrs'],
  queryFn: () => martyrService.getMartyrs()
});

// After (Supabase)
const { data } = useQuery({
  queryKey: ['martyrs', lang],  // Add lang for proper cache separation
  queryFn: () => martyrApi.getMartyrs(lang)
});
```

**Migration Benefit:** React Query layer unchanged, components unaffected

#### 3. useMartyrDetail Hook ✅ **READY**
**Current:** `src/features/martyrs/hooks/useMartyrDetail.ts`
- Fetches single martyr + memories
- Uses React Query

**Target:** Query martyr + approved memories + candles count
```typescript
export function useMartyrDetail(id: string, lang: Language) {
  const martyrQuery = useQuery({
    queryKey: ['martyr', id, lang],
    queryFn: () => martyrApi.getMartyrById(id, lang)
  });
  
  const memoriesQuery = useQuery({
    queryKey: ['memories', id, lang],
    queryFn: () => memoryApi.getApprovedMemories(id, lang),
    enabled: !!martyrQuery.data
  });
  
  const candlesQuery = useQuery({
    queryKey: ['candles', id],
    queryFn: () => martyrApi.getCandleCount(id)
  });
  
  // Return combined data (same interface as before)
}
```

#### 4. useMartyrFilters Hook ✅ **REFACTORED - READY**
**Current:** `src/features/martyrs/hooks/useMartyrFilters.ts`
- Uses `useMartyrSearch` for text search ✅ **MODULAR**
- Filters by year, month, state
- **NEW:** Syncs to URL params

**Migration:** Minimal changes needed
- Search logic already isolated in `useMartyrSearch`
- Filtering can stay client-side (good UX for small datasets)
- OR migrate to DB-side filtering for large datasets:
```typescript
// Option A: Keep client-side filtering (current approach, works well)
const { searchQuery, filteredMartyrs } = useMartyrSearch({ martyrs, ... });

// Option B: Server-side filtering (if dataset grows large)
const { data } = useQuery({
  queryKey: ['martyrs', lang, { year, month, state, searchQuery }],
  queryFn: () => martyrApi.getMartyrs(lang, { year, month, state, searchQuery })
});
```

**Recommendation:** Start with Option A (client-side), migrate to Option B if performance degrades

#### 5. useMartyrSearch Hook ✅ **NEW - READY**
**Current:** `src/shared/hooks/useMartyrSearch.ts`
- Created during refactoring
- Reusable across features
- Already has test coverage ✅

**Migration:** No changes needed initially
- Works perfectly for client-side search of fetched data
- Can be enhanced later with full-text search from DB

#### 6. useShareMemoryForm Hook ✅ **REFACTORED - READY**
**Current:** `src/features/memories/hooks/useShareMemoryForm.ts`
- Uses `useMartyrSearch` for martyr selection ✅
- Form state management in hook
- Currently: local submit only

**Target:** Replace local submit with mutation
```typescript
const submitMutation = useMutation({
  mutationFn: async (data: MemorySubmission) => {
    // Insert memory
    const { data: memory } = await supabase
      .from('memories')
      .insert({
        martyr_id: data.martyrId,
        author_name: data.authorName,
        relationship: data.relationship,
        memory_type: data.type,
        status: 'pending'
      })
      .select()
      .single();
    
    // Insert translations
    await supabase
      .from('memory_translations')
      .insert([
        { memory_id: memory.id, language: 'en', content: data.contentEn },
        { memory_id: memory.id, language: 'ar', content: data.contentAr }
      ]);
    
    // Upload media if photo/voice type
    if (data.file && data.type !== 'story') {
      await uploadMemoryAsset(memory.id, data.file);
    }
    
    return memory;
  },
  onSuccess: () => {
    toast.success(t("shareMemory.submissionSuccess"));
    setSubmitted(true);
  }
});
```

**Migration Benefit:** Form components unchanged (SelectMartyrStep, MemoryTypeStep, WriteMemoryStep)

#### 7. useCandleState Hook ✅ **NEW - READY FOR MIGRATION**
**Current:** `src/features/martyrs/hooks/useCandleState.ts`
- Created during refactoring
- Uses localStorage for persistence
- Ready pattern for backend migration

**Target:** Replace localStorage with Supabase insert
```typescript
const lightCandle = useMutation({
  mutationFn: async (martyrId: string) => {
    const userId = session?.user?.id;
    const fingerprint = userId ? null : await generateFingerprint();
    
    // Call Edge Function for rate limiting + dedup
    const { data } = await supabase.functions.invoke('light-candle', {
      body: { martyrId, userId, fingerprint }
    });
    
    return data;
  },
  onSuccess: (data) => {
    // Update localStorage for immediate persistence
    updateLocalCandleState(martyrId);
    // Invalidate candle count query
    queryClient.invalidateQueries(['candles', martyrId]);
  }
});
```

**Migration Strategy:**
1. Keep localStorage as cache/fallback
2. Add Supabase insert for persistence
3. Sync on load: check DB vs localStorage, use DB as source of truth

#### 8. Home Page Components ✅ **READY**
**Current:** `src/features/home/pages/Home.tsx`
- Imports `martyrsData` directly
- Passes to WallOfFaces, StoryOfTheWeek

**Target:** Use `useMartyrs` hook
```typescript
// Before
import { martyrsData } from '@/shared/data/martyrs';

// After
const { martyrs, isLoading } = useMartyrs();
```

**Migration:** Minimal - just replace import with hook call

#### 9. AnimatedBackground Component ✅ **REFACTORED - READY**
**Current:** `src/shared/components/AnimatedBackground.tsx`
- Uses `martyrsData.map(m => m.image)`
- **Optimized:** CSS extracted, 2x duplication (was 3x)

**Target:** Lightweight query for images only
```typescript
const { data: images } = useQuery({
  queryKey: ['martyr-images'],
  queryFn: async () => {
    const { data } = await supabase
      .from('martyrs')
      .select('primary_image_path')
      .eq('is_published', true);
    return data?.map(m => m.primary_image_path) || [];
  },
  staleTime: 30 * 60 * 1000 // 30 min cache (images don't change often)
});
```

### TanStack Query + Supabase Architecture ✅ **ALREADY CONFIGURED**

**Current Configuration:**
```typescript
// src/App.tsx ✅
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 minutes
      gcTime: 10 * 60 * 1000,      // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});
```

**Recommended Query Keys:**
```typescript
// Martyrs
['martyrs', lang]                           // List all
['martyrs', lang, filters]                  // Filtered list
['martyr', martyrId, lang]                  // Single detail
['martyr-images']                           // For AnimatedBackground

// Memories
['memories', martyrId, lang]                // Approved memories for martyr
['memory', memoryId, lang]                  // Single memory

// Candles
['candles', martyrId]                       // Candle count
['candle-lit', martyrId, userId]            // User's lit status

// User
['profile', userId]                         // User profile
['user-roles', userId]                      // User roles
```

**Migration Benefit:** Existing React Query setup ready, just swap data sources

---

## 7) Edge Functions vs Client Responsibilities

## Move to Edge Functions (sensitive/heavy)

1. Anonymous memory submission endpoint
- Validate payload, sanitize text, apply abuse controls/rate limiting.
- Write with service role while enforcing business rules server-side.

2. Moderation actions
- Approve/reject memory with audit logging.
- Optional notifications.

3. Signed upload URL generation
- Prevent arbitrary bucket/path writes.

4. Candle lighting for anonymous users
- Hash fingerprint/IP heuristics + throttling.
- Insert event and update aggregate count safely.

5. Search endpoint (optional later)
- Multi-language full-text ranking with custom scoring.

## Safe on client

1. Public reads for published martyrs and approved memories.
2. Authenticated contributor updates limited by RLS.

---

## 8) Implementation Roadmap (Updated for Refactored Codebase)

### Pre-Migration Status ✅

**Codebase Readiness:**
- ✅ Type safety: 0 `any` types
- ✅ Data model: 100% unified, 0 duplicates
- ✅ Components: All < 300 lines, modular and focused
- ✅ Hooks: Extracted and reusable (useMartyrSearch, useCandleState, etc.)
- ✅ React Query: Configured with proper caching (5min stale, 10min gc)
- ✅ Testing: Foundation ready (Vitest + example tests)
- ✅ Error handling: ErrorBoundary wrapping app
- ✅ Build: Production build verified successful

**Migration Advantages:**
1. **Service Layer Abstraction:** `martyrService.ts` provides clean cut point
2. **Hook Isolation:** Each hook can be migrated independently
3. **Component Stability:** Modular components won't need changes
4. **Type Safety:** Zero `any` types means migration errors caught at compile time
5. **Test Coverage:** Can add integration tests alongside migration

---

## Phase 1: Database Setup

**Tasks:**
1. Create Supabase project and configure environments
2. Apply base migration (tables/enums/indexes)
3. Enable RLS on all tables
4. Add initial policies for public read + staff write
5. Build seed scripts to import existing `martyrsData` (6 martyrs) and `mockMemories`
6. Generate TypeScript DB types

**Deliverables:**
1. ✅ Migrations committed to version control
2. ✅ Seed data available in development (6 martyrs + memories)
3. ✅ Typed DB contract generated (`src/lib/supabase/database.types.ts`)

**Seed Data Notes:**
- Current dataset: 6 martyrs in `src/shared/data/martyrs.ts`
- Current memories: Mock data in `src/shared/data/memories.ts`
- **Format:** Already uses unified `Record<Language, string>` pattern
- **Migration:** Direct 1:1 mapping to normalized tables

**Script Example:**
```typescript
// scripts/seed-martyrs.ts
import { martyrsData } from '../src/shared/data/martyrs';

for (const martyr of martyrsData) {
  // Insert canonical record
  const { data: dbMartyr } = await supabase
    .from('martyrs')
    .insert({
      legacy_id: martyr.id,
      age: martyr.age,
      date_of_martyrdom: martyr.dateOfMartyrdom,
      primary_image_path: martyr.image,
      candles_count: martyr.candles,
      is_published: true
    })
    .select()
    .single();
  
  // Insert translations
  await supabase.from('martyr_translations').insert([
    {
      martyr_id: dbMartyr.id,
      language: 'en',
      full_name: martyr.name.en,
      location_label: martyr.location.en,
      profession_label: martyr.profession.en,
      story: martyr.story.en
    },
    {
      martyr_id: dbMartyr.id,
      language: 'ar',
      full_name: martyr.name.ar,
      location_label: martyr.location.ar,
      profession_label: martyr.profession.ar,
      story: martyr.story.ar
    }
  ]);
}
```

---

## Phase 2: Auth Integration

**Tasks:**
1. Enable Email OTP (and optional Google OAuth)
2. Add auth session provider in app root
3. Introduce minimal staff-only moderation route guard
4. Add profile bootstrap on first login
5. Add `user_roles` seeds for staff users

**Deliverables:**
1. ✅ Working login for moderators/admin
2. ✅ Role-based route protection
3. ✅ Auth session available in hooks

**Integration Points:**
```typescript
// src/app/providers/AuthProvider.tsx (NEW)
export function AuthProvider({ children }) {
  const [session, setSession] = useState<Session | null>(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Update App.tsx:**
```typescript
// src/App.tsx
<ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider> {/* NEW */}
        <RouterProvider router={router} />
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
</ErrorBoundary>
```

---

## Phase 3: Critical Path Migration (Service Layer → Hooks → Components)

**Migration Order (Recommended):**

### 3.1 Read-Only Paths (Lowest Risk)
1. ✅ `AnimatedBackground` (simplest - just images)
2. ✅ `martyrService.getMartyrs()` → Supabase
3. ✅ `useMartyrs` hook (list view)
4. ✅ `useMartyrDetail` hook (detail view)
5. ✅ Verify MartyrsList and MartyrDetail pages still work

**Risk:** Low - pure read operations  
**Testing:** Manual verification + smoke tests  
**Rollback:** Easy - revert service layer changes

### 3.2 Write Paths (Medium Risk)
6. ✅ Share memory mutation in `useShareMemoryForm`
7. ✅ Memory asset uploads (photo/voice)
8. ✅ Verify ShareMemory wizard flow works end-to-end

**Risk:** Medium - involves writes and file uploads  
**Testing:** Full E2E test of submission flow  
**Rollback:** Medium - may need to clean up test data

### 3.3 Interaction Paths (Higher Risk)
9. ✅ Candle lighting in `useCandleState`
10. ✅ Candle count display and real-time updates
11. ✅ Verify candle deduplication works

**Risk:** Higher - involves user tracking and deduplication  
**Testing:** Test logged-in vs anonymous, duplicate prevention  
**Rollback:** Complex - may need localStorage fallback

### 3.4 Filter/Search Optimization (Optional)
12. ✅ Move filtering to server-side if needed
13. ✅ Add full-text search (Arabic + English)
14. ✅ Performance testing with larger dataset

**Risk:** Low - enhancement only  
**Testing:** Performance benchmarks  
**Rollback:** Easy - keep client-side filtering

**Deliverables:**
1. ✅ No dependency on `src/shared/data/*.ts` for runtime data
2. ✅ All reads from Supabase
3. ✅ All writes to Supabase
4. ✅ Tribute wall and share flow fully backed by DB
5. ✅ Candle persistence in DB

**Migration Verification Checklist:**
- [ ] MartyrsList shows correct data
- [ ] MartyrDetail shows correct martyr + memories
- [ ] Filters work (search, year, month, state)
- [ ] ShareMemory submission succeeds
- [ ] Candle lighting persists across sessions
- [ ] AnimatedBackground loads images
- [ ] URL filter state works
- [ ] No console errors
- [ ] Build succeeds
- [ ] All TypeScript types valid

---

## Phase 4: Real-time and Optimization

**Tasks:**
1. Add Supabase Realtime channel for:
   - Candle count updates (live counter)
   - Newly approved memories on detail pages
2. Add full-text search (English + Arabic) indexes and ranked query path
3. Add caching and pagination for martyrs and memories
4. Add operational observability (error logging, slow query monitoring)
5. Add Lighthouse CI for performance tracking

**Deliverables:**
1. ✅ Live-updating memorial interactions
2. ✅ Faster search/filter performance at scale
3. ✅ Pagination for large lists
4. ✅ Monitoring and alerting

**Realtime Example:**
```typescript
// src/features/martyrs/hooks/useMartyrDetail.ts
useEffect(() => {
  if (!martyrId) return;
  
  const channel = supabase
    .channel(`martyr:${martyrId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'martyr_candle_events',
        filter: `martyr_id=eq.${martyrId}`
      },
      () => {
        // Invalidate candle count query
        queryClient.invalidateQueries(['candles', martyrId]);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'memories',
        filter: `martyr_id=eq.${martyrId}`
      },
      () => {
        // Invalidate memories query
        queryClient.invalidateQueries(['memories', martyrId]);
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}, [martyrId]);
```

---

## Phase 5: Admin Dashboard (Future Enhancement)

**Tasks:**
1. Build moderation UI for pending memories
2. Add martyr CRUD interface for editors
3. Add user role management for admins
4. Add analytics dashboard (submissions, candles, traffic)

**Deliverables:**
1. ✅ Moderator workflow for memory approval/rejection
2. ✅ Editor workflow for martyr management
3. ✅ Admin user management
4. ✅ Analytics and insights

**Note:** This phase is not blocking for public launch

---

## 9) Additional Architecture Notes

1. Keep `candles_count` as derived data:
- Source of truth is `martyr_candle_events`.
- Maintain `candles_count` via trigger or scheduled aggregation for fast reads.

2. Media storage structure
- Bucket examples:
  - `martyr-images`
  - `memory-media`
- Keep object paths deterministic and role-safe.

3. Backward-compatible migration strategy
- Preserve frontend interfaces initially via adapter functions.
- Refactor UI types gradually to generated DB types.

4. Testing focus
- RLS policy tests (critical).
- Submit/approve/reject memory workflow tests.
- Candle dedup and abuse-rate tests.

---

## 10) Immediate Next Steps After Plan Approval

### Step 1: Environment Setup
```bash
# Install Supabase CLI
npm install -D supabase

# Initialize Supabase project
npx supabase init

# Link to remote project (after creating on supabase.com)
npx supabase link --project-ref <PROJECT_REF>
```

### Step 2: Create Initial Migration
```bash
# Create migration file
npx supabase migration new init_schema

# Copy SQL from section 2 into migration file
# migrations/XXXXXX_init_schema.sql
```

### Step 3: Add Supabase Client
```bash
# Install Supabase JS client
npm install @supabase/supabase-js
```

**Create client singleton:**
```typescript
// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

**Environment variables:**
```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: Generate Types
```bash
# Generate TypeScript types from database schema
npx supabase gen types typescript --linked > src/lib/supabase/database.types.ts

# Add to package.json scripts
"supabase:types": "supabase gen types typescript --linked > src/lib/supabase/database.types.ts"
```

### Step 5: Create Seed Script
```typescript
// scripts/seed.ts
import { createClient } from '@supabase/supabase-js';
import { martyrsData } from '../src/shared/data/martyrs';
import { mockMemories } from '../src/shared/data/memories';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for seeding
);

async function seed() {
  console.log('🌱 Seeding database...');
  
  // Seed martyrs (see Phase 1 example)
  for (const martyr of martyrsData) {
    // ... insert logic
  }
  
  // Seed memories
  for (const memory of mockMemories) {
    // ... insert logic
  }
  
  console.log('✅ Seeding complete!');
}

seed().catch(console.error);
```

### Step 6: Start Migration with Simplest Path
**Recommended First Migration:** AnimatedBackground (lowest risk)

1. Create API module:
```typescript
// src/features/martyrs/api/queries.ts
import { supabase } from '@/lib/supabase/client';

export async function getMartyrImages() {
  const { data, error } = await supabase
    .from('martyrs')
    .select('primary_image_path')
    .eq('is_published', true);
  
  if (error) throw error;
  return data.map(m => m.primary_image_path);
}
```

2. Update component:
```typescript
// src/shared/components/AnimatedBackground.tsx
import { useQuery } from '@tanstack/react-query';
import { getMartyrImages } from '@/features/martyrs/api/queries';

export function AnimatedBackground({ absolute = false }: Props) {
  const { data: images = [] } = useQuery({
    queryKey: ['martyr-images'],
    queryFn: getMartyrImages,
    staleTime: 30 * 60 * 1000,
    // Fallback to mock data during migration
    placeholderData: martyrsData.map(m => m.image)
  });
  
  // ... rest unchanged
}
```

3. Test thoroughly
4. Remove fallback
5. Move to next migration target

### Priority Order for Migration:
1. ✅ AnimatedBackground (images only - simplest)
2. ✅ martyrService.getMartyrs() (read-only list)
3. ✅ MartyrsList page (uses hook, already abstracted)
4. ✅ martyrService.getMartyrById() (read-only detail)
5. ✅ MartyrDetail page (read + memories)
6. ✅ Share memory mutation (first write operation)
7. ✅ Candle state persistence (localStorage → DB)

### Testing Strategy:
```typescript
// src/features/martyrs/api/queries.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { getMartyrImages, getMartyrs } from './queries';

describe('Martyr API', () => {
  it('fetches martyr images', async () => {
    const images = await getMartyrImages();
    expect(Array.isArray(images)).toBe(true);
    expect(images.length).toBeGreaterThan(0);
  });
  
  it('fetches martyrs with translations', async () => {
    const martyrs = await getMartyrs('en');
    expect(Array.isArray(martyrs)).toBe(true);
    expect(martyrs[0]).toHaveProperty('name');
    expect(martyrs[0]).toHaveProperty('location');
  });
});
```

### Rollback Plan:
1. Keep `src/shared/data/*.ts` files until migration 100% verified
2. Use feature flags for gradual rollout:
```typescript
const USE_SUPABASE = import.meta.env.VITE_USE_SUPABASE === 'true';

export function useMartyrs() {
  return USE_SUPABASE 
    ? useMartyrsFromSupabase()
    : useMartyrsFromMock();
}
```
3. Monitor error rates in production
4. Quick rollback via environment variable toggle

---

## Success Criteria

**Phase 1 Success:**
- [ ] Database schema deployed
- [ ] 6 martyrs seeded with translations
- [ ] Memories seeded
- [ ] Types generated
- [ ] Can query data via Supabase dashboard

**Phase 2 Success:**
- [ ] Staff user can log in
- [ ] Auth session persists
- [ ] Protected routes work
- [ ] Role-based access enforced

**Phase 3 Success:**
- [ ] All reads from Supabase
- [ ] All writes to Supabase
- [ ] Mock data files can be deleted
- [ ] No TypeScript errors
- [ ] Production build succeeds
- [ ] Performance metrics maintained or improved

**Phase 4 Success:**
- [ ] Real-time updates working
- [ ] Search performance < 200ms
- [ ] Pagination working
- [ ] Monitoring dashboard shows healthy metrics

---

## Additional Notes

### Migration Benefits (Post-Refactoring)

1. **Type Safety:** Zero `any` types means compile-time validation of DB queries
2. **Modular Components:** Component changes isolated from data layer changes
3. **Hook Abstraction:** Each hook migrates independently without affecting others
4. **Test Coverage:** Can add integration tests alongside migration
5. **Error Handling:** ErrorBoundary catches migration issues gracefully
6. **Performance:** React Query cache already optimized (5min stale, 10min gc)

### Risk Mitigation

1. **Gradual Migration:** Each phase independently deployable
2. **Feature Flags:** Toggle between mock and real data
3. **Fallback Data:** Keep mock data as backup during migration
4. **Type Safety:** Generated types catch schema mismatches at build time
5. **Testing:** Integration tests for each API endpoint
6. **Monitoring:** Track error rates and performance metrics

### Post-Migration Optimizations

1. **Database Indexes:** Monitor slow queries, add indexes as needed
2. **Caching Strategy:** Tune React Query staleTime based on data freshness needs
3. **Image Optimization:** Add image CDN/transformation service
4. **Search Enhancement:** Implement full-text search with ranking
5. **Analytics:** Add usage tracking for insights

### Technical Debt Prevention

1. Keep generated DB types in version control
2. Document schema changes in migration files
3. Write migration scripts, not manual SQL
4. Test RLS policies thoroughly
5. Monitor query performance regularly

---

**Last Updated:** January 2025  
**Codebase Version:** Post-Refactoring (v2.0)  
**Status:** Ready for Phase 1 implementation ✅
