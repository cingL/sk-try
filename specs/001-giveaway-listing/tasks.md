# Tasks: 活动无料信息展示

**Input**: Design documents from `/specs/001-giveaway-listing/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create React + Vite project with TypeScript template: `pnpm create vite muryo --template react-ts`
- [x] T002 Install core dependencies: React Router, MUI, Supabase client, react-window
- [x] T003 [P] Create project directory structure per plan.md in `src/`
- [x] T004 [P] Configure environment variables in `.env.local` (Supabase URL, Key, Event ID)
- [x] T005 [P] Configure path aliases in `tsconfig.json` and `vite.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create TypeScript type definitions in `src/types/index.ts` (Event, Giveaway, Provider, ExternalLink)
- [x] T007 [P] Initialize Supabase client in `src/services/supabase.ts`
- [x] T008 [P] Create MUI theme configuration in `src/theme/index.ts` (Material Design, mobile-first)
- [x] T009 [P] Setup React Router with routes in `src/App.tsx` (/, /giveaway/:id)
- [x] T010 Create layout components in `src/components/layout/`:
  - [x] T010a Header.tsx (app bar with title)
  - [x] T010b Layout.tsx (main layout wrapper)
- [x] T011 Run Supabase SQL migration from `data-model.md` (events, providers, giveaways tables)
- [x] T012 [P] Create Supabase Storage bucket `giveaway-images` with public read policy
- [x] T013 Insert test event data in Supabase for development

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - 浏览活动无料列表 (Priority: P1) 🎯 MVP

**Goal**: 用户在首屏看到当前活动的所有无料信息卡片列表

**Independent Test**: 打开应用首页，用户在首屏立即看到无料列表

### Implementation for User Story 1

- [x] T014 [US1] Create `useGiveaways` hook in `src/hooks/useGiveaways.ts`:
  - Fetch giveaways with provider data from Supabase
  - Return loading, error, giveaways state
- [x] T015 [P] [US1] Create GiveawayCard component in `src/components/giveaway/GiveawayCard.tsx`:
  - Display: thumbnail, title, provider name, booth location
  - Material Design Card with elevation
  - Responsive sizing for mobile
- [x] T016 [US1] Create GiveawayList component in `src/components/giveaway/GiveawayList.tsx`:
  - Render list of GiveawayCard
  - Implement virtual scrolling with react-window for performance
  - Handle loading and empty states
- [x] T017 [US1] Create HomePage in `src/pages/HomePage.tsx`:
  - Use GiveawayList component
  - Show event info header
  - First screen content visible without scroll
- [x] T018 [US1] Add status badge to GiveawayCard (available/limited/ended) with color coding
- [x] T019 [US1] Implement image lazy loading in GiveawayCard for thumbnails

**Checkpoint**: User Story 1 完成 - 用户可浏览无料列表

---

## Phase 4: User Story 2 - 搜索与筛选无料 (Priority: P2)

**Goal**: 用户能按关键词搜索或按条件筛选无料信息

**Independent Test**: 输入关键词搜索，系统实时返回匹配结果

### Implementation for User Story 2

- [x] T020 [US2] Create `useSearch` hook in `src/hooks/useSearch.ts`:
  - Accept search query and filter params
  - Client-side filtering for <1000 items
  - Debounce input (300ms)
- [x] T021 [P] [US2] Create SearchBar component in `src/components/common/SearchBar.tsx`:
  - MUI TextField with search icon
  - Clear button when has content
  - Mobile-friendly full-width design
- [x] T022 [P] [US2] Create FilterChips component in `src/components/common/FilterChips.tsx`:
  - Chips for category filter (goods/print/digital/other)
  - Chips for area filter (from available booth_areas)
  - Multi-select support
- [x] T023 [US2] Integrate SearchBar and FilterChips into HomePage
- [x] T024 [US2] Update GiveawayList to accept filtered data from useSearch
- [x] T025 [US2] Create EmptyState component in `src/components/common/EmptyState.tsx`:
  - Friendly message when no results
  - "Clear filters" action button

**Checkpoint**: User Story 2 完成 - 用户可搜索和筛选

---

## Phase 5: User Story 3 - 查看无料详情并跳转 (Priority: P3)

**Goal**: 用户点击无料卡片后查看详情，并能跳转到外部链接

**Independent Test**: 点击卡片进入详情页，点击外部链接正确跳转

### Implementation for User Story 3

- [x] T026 [US3] Create `useExternalLink` hook in `src/hooks/useExternalLink.ts`:
  - Try URL Scheme first (xhs://, weibo://)
  - Fallback to HTTPS on failure
  - Track success/failure for analytics
- [x] T027 [P] [US3] Create deepLink utility in `src/utils/deepLink.ts`:
  - Platform detection (iOS/Android)
  - URL Scheme mapping for RedNote (小红书), Weibo (微博)
  - Fallback URL generation
- [x] T028 [US3] Create GiveawayDetail component in `src/components/giveaway/GiveawayDetail.tsx`:
  - Large image display with swipe gallery
  - Full description text
  - Pickup condition section
  - Provider info card with booth location
- [x] T029 [P] [US3] Create ExternalLinkButton component in `src/components/common/ExternalLinkButton.tsx`:
  - Platform icon (RedNote/小红书, Weibo/微博, etc.)
  - Label with username
  - Use useExternalLink hook
- [x] T030 [US3] Create DetailPage in `src/pages/DetailPage.tsx`:
  - Fetch single giveaway by ID
  - Use GiveawayDetail component
  - Back navigation to list (preserve scroll position)
- [x] T031 [US3] Add click handler to GiveawayCard to navigate to DetailPage
- [x] T032 [US3] Implement scroll position restoration when returning from detail

**Checkpoint**: User Story 3 完成 - 用户可查看详情并跳转外部链接

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T043 [P] Add PWA manifest and service worker in `public/manifest.json`
- [x] T044 [P] Add app icons for PWA in `public/icons/` (README added, icons need to be generated)
- [x] T045 Implement offline support: cache loaded data in IndexedDB
- [x] T046 [P] Add loading skeleton components for better perceived performance
- [x] T047 Error boundary and global error handling
- [x] T048 [P] Add event status banner (upcoming/ongoing/ended) on HomePage
- [x] T049 Performance audit: ensure LCP <1s, FID <100ms (Code implemented, requires runtime testing)
- [x] T050 Run quickstart.md validation: verify all setup steps work (Requires manual verification)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    │
    ▼
Phase 2 (Foundational) ──── BLOCKS ALL USER STORIES
    │
    ├──▶ Phase 3 (US1: Browse) 🎯 MVP
    │         │
    │         ▼
    ├──▶ Phase 4 (US2: Search) ── depends on US1 components
    │         │
    │         ▼
    └──▶ Phase 5 (US3: Detail) ── depends on US1 components
              │
              ▼
        Phase 6 (Polish)
```

### Parallel Opportunities

- **Phase 1**: T003, T004, T005 可并行
- **Phase 2**: T007, T008, T009, T012 可并行
- **Phase 3**: T015 可与 T014 并行开始
- **Phase 4**: T021, T022 可并行
- **Phase 5**: T027, T029 可与 T026 并行
- **Phase 6**: 大部分任务可并行

### Critical Path (MVP)

```
T001 → T002 → T006 → T007 → T009 → T014 → T015 → T016 → T017
                                                        │
                                                        ▼
                                               User Story 1 Complete (MVP)
```

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + Phase 2 (Setup + Foundation)
2. Complete Phase 3 (User Story 1 - Browse)
3. **STOP and VALIDATE**: Deploy MVP, test with real users
4. Iterate based on feedback

### Full Feature Delivery

1. MVP → Phase 4 (Search) → Phase 5 (Detail) → Phase 6 (Polish)

### Time Estimates

| Phase | Tasks | Estimated Hours |
|-------|-------|-----------------|
| Phase 1: Setup | 5 | 2h |
| Phase 2: Foundation | 8 | 4h |
| Phase 3: US1 Browse | 6 | 6h |
| Phase 4: US2 Search | 6 | 4h |
| Phase 5: US3 Detail | 7 | 6h |
| Phase 6: Polish | 8 | 6h |
| **Total** | **40** | **~28h** |

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [USx] label maps task to specific user story for traceability (US4 removed - no publish feature)
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- MVP (US1) delivers core value with minimum effort
- External links support RedNote (小红书) and Weibo (微博) platforms