# Phase 1: Core Pages & Layout - Task DAG

## Overview

**Spec:** Phase 1 - Core Pages & Layout Infrastructure  
**Duration:** 2-3 hours  
**Status:** Ready for orchestration  
**Total Tasks:** 11

## Tasks

---

## Task Dependency Graph

```
[PHASE_1_COMPLETE] (auto-completes when all children done)
├── [LAYOUT_TASKS] (parent)
│   ├── T1: Fix App Sidebar
│   ├── T2: Create Mobile Bottom Nav
│   └── T3: Update Authenticated Layout
├── [PAGE_TASKS] (parent)
│   ├── T4: Update Feed Page
│   ├── T5: Create Marketplace Page
│   ├── T6: Create Library Page
│   └── T7: Complete Wallet Page
└── [API_TASKS] (parent)
    ├── T8: Create Feed API Endpoints (GET /api/posts, POST like/comment)
    ├── T9: Create Marketplace API Endpoints (GET /api/items, item details)
    ├── T10: Create Library API Endpoints (GET /api/library)
    └── T11: Create Wallet API Endpoints (GET balance/transactions, Stripe checkout)
```

---

## Layout Tasks

### T1: Fix App Sidebar
- **Dependencies:** None
- **Optional:** false
- **Est. Time:** 20 min
- **Status:** not_started

**Subtasks:**
1. Read current `components/app-sidebar.tsx`
2. Add active state detection based on current route
3. Update styling: active state has left border #99FF33 + elevated background
4. Implement hover states with smooth transitions
5. Fix responsive collapse on mobile (<768px)
6. Add "CREATE NEW ART" CTA button at bottom
7. Ensure NO blue/purple/orange colors used
8. Test sidebar on desktop and mobile views

**Files:**
- `components/app-sidebar.tsx` (update)

**Design References:**
- DESIGN.md color system
- PHASE_1_PLAN.md requirements

---

### T2: Create Mobile Bottom Navigation
- **Dependencies:** None
- **Optional:** false
- **Est. Time:** 25 min
- **Status:** not_started

**Subtasks:**
1. Create new component `components/mobile-nav.tsx`
2. Implement bottom nav structure with 5 items (Home, Discover, Create, Messages, Account)
3. Add icon + label for each item
4. Implement active state indicator
5. Add smooth route transitions
6. Style with design system (Faded Lime #99FF33 for active)
7. Only show on mobile (<768px) using Tailwind responsive
8. Add proper z-index (above other content)

**Files:**
- `components/mobile-nav.tsx` (new)

**Design References:**
- DESIGN.md color system
- Mobile-first responsive design

---

### T3: Update Authenticated Layout
- **Dependencies:** [T1, T2]
- **Optional:** false
- **Est. Time:** 20 min
- **Status:** not_started

**Subtasks:**
1. Read current `components/authenticated-layout.tsx`
2. Integrate sidebar for desktop views (>768px)
3. Integrate mobile bottom nav for mobile views (<768px)
4. Add top notification bar with icons (notifications, search)
5. Ensure proper z-index layering
6. Test seamless desktop/mobile transitions
7. Verify all pages render correctly within layout
8. Check responsive breakpoints (375px, 768px, 1024px)

**Files:**
- `components/authenticated-layout.tsx` (update)

**Dependencies:**
- T1 must be complete
- T2 must be complete

---

## Page Tasks

### T4: Update Feed Page
- **Dependencies:** None (can start parallel with layout tasks)
- **Optional:** false
- **Est. Time:** 40 min
- **Status:** not_started

**Subtasks:**
1. Read current `apps/web/src/app/feed/page.tsx`
2. Remove fake/hardcoded data
3. Implement server action to fetch from `/api/posts`
4. Add infinite scroll hook (load more on scroll)
5. Implement like button with API call to `POST /api/posts/[id]/like`
6. Implement comment button with modal
7. Add engagement counters (auto-refresh)
8. Add filters: Following, For You, Trending
9. Add search functionality
10. Verify responsive on mobile (375px), tablet (768px), desktop (1024px)

**Files:**
- `apps/web/src/app/feed/page.tsx` (update)

**API Dependencies:**
- Requires: `GET /api/posts` (T8)
- Requires: `POST /api/posts/[id]/like` (T8)
- Requires: `POST /api/posts/[id]/comment` (T8)

---

### T5: Create Marketplace Page
- **Dependencies:** None (can start parallel with layout tasks)
- **Optional:** false
- **Est. Time:** 50 min
- **Status:** not_started

**Subtasks:**
1. Create `apps/web/src/app/marketplace/page.tsx`
2. Create responsive grid layout (3-4 columns desktop, 2 tablet, 1 mobile)
3. Create ItemCard component showing thumbnail, title, price, creator
4. Create FilterSidebar component with Category, Price, Creator filters
5. Add search bar with basic search
6. Implement filter persistence in URL params
7. Create ItemDetailModal component
8. Add purchase button (links to checkout)
9. Show related items section
10. Verify styling uses design system (no blue/purple/orange)
11. Test responsive at 3 breakpoints

**Files:**
- `apps/web/src/app/marketplace/page.tsx` (new)
- `apps/web/src/app/marketplace/components/ItemCard.tsx` (new)
- `apps/web/src/app/marketplace/components/FilterSidebar.tsx` (new)
- `apps/web/src/app/marketplace/components/ItemDetailModal.tsx` (new)

**API Dependencies:**
- Requires: `GET /api/items` (T9)
- Requires: `GET /api/items/[id]` (T9)
- Requires: `GET /api/items/[id]/related` (T9)

---

### T6: Create Library Page
- **Dependencies:** None (can start parallel)
- **Optional:** false
- **Est. Time:** 30 min
- **Status:** not_started

**Subtasks:**
1. Create `apps/web/src/app/library/page.tsx`
2. Create grid layout for user's owned items
3. Create LibraryItemCard component
4. Implement DRM-protected item viewer component
5. Show ownership info and purchase date on each card
6. Add filters by purchase date and type
7. Click item to open in DRM viewer
8. Display watermark with user info in viewer
9. Test responsive design
10. Verify no console errors

**Files:**
- `apps/web/src/app/library/page.tsx` (new)
- `apps/web/src/app/library/components/LibraryItemCard.tsx` (new)
- `apps/web/src/app/library/components/DRMViewer.tsx` (new)

**API Dependencies:**
- Requires: `GET /api/library` (T10)

---

### T7: Complete Wallet Page
- **Dependencies:** None (can start parallel)
- **Optional:** false
- **Est. Time:** 35 min
- **Status:** not_started

**Subtasks:**
1. Read current `apps/web/src/app/wallet/page.tsx`
2. Create BalanceCard component showing current balance and stats
3. Create TransactionHistory component (paginated table)
4. Add filters by transaction type (income/expense/purchase/top-up)
5. Add sort by date and amount
6. Create TopUpModal component with Stripe integration
7. Show available credit packages
8. Create Web3ConnectionPanel component with wallet connection button
9. Display blockchain balance if wallet connected
10. Test responsive design and error handling

**Files:**
- `apps/web/src/app/wallet/page.tsx` (update)
- `apps/web/src/app/wallet/components/BalanceCard.tsx` (new)
- `apps/web/src/app/wallet/components/TransactionHistory.tsx` (new)
- `apps/web/src/app/wallet/components/TopUpModal.tsx` (new)
- `apps/web/src/app/wallet/components/Web3ConnectionPanel.tsx` (new)

**API Dependencies:**
- Requires: `GET /api/balance` (T11)
- Requires: `GET /api/transactions` (T11)
- Requires: `POST /api/checkout` (T11)

---

## API Tasks

### T8: Create Feed API Endpoints
- **Dependencies:** None (can start parallel with pages)
- **Optional:** false
- **Est. Time:** 45 min
- **Status:** not_started

**Subtasks:**
1. Create `apps/web/src/app/api/posts/route.js` (GET handler)
   - Implement pagination (page, limit query params)
   - Implement filtering (following/for-you/trending)
   - Query database for posts with proper indexing
   - Return array + hasMore flag
   - Add proper error handling

2. Create `apps/web/src/app/api/posts/[id]/like/route.js` (POST + DELETE)
   - POST: Like a post (add to user's likes)
   - DELETE: Unlike a post (remove from user's likes)
   - Return updated like count
   - Handle edge cases (already liked, not found)

3. Create `apps/web/src/app/api/posts/[id]/comment/route.js` (POST + GET)
   - POST: Add comment to post
   - GET: Fetch comments for post
   - Paginate comment results
   - Validate comment content

**Files:**
- `apps/web/src/app/api/posts/route.js` (new)
- `apps/web/src/app/api/posts/[id]/like/route.js` (new)
- `apps/web/src/app/api/posts/[id]/comment/route.js` (new)

**Database Schema:** Use existing Post/Comment models from database-mongo

---

### T9: Create Marketplace API Endpoints
- **Dependencies:** None (can start parallel)
- **Optional:** false
- **Est. Time:** 40 min
- **Status:** not_started

**Subtasks:**
1. Create `apps/web/src/app/api/items/route.js` (GET handler)
   - Implement pagination (page, limit)
   - Implement filters (category, priceMin, priceMax, search)
   - Query Item model with proper indexing
   - Return array + hasMore flag
   - Add error handling

2. Create `apps/web/src/app/api/items/[id]/route.js` (GET handler)
   - Return full item details
   - Include creator info
   - Include related items IDs
   - Handle not found

3. Create `apps/web/src/app/api/items/[id]/related/route.js` (GET handler)
   - Return 4-6 related items (same category or similar price)
   - Exclude current item
   - Paginate if needed

4. Create `apps/web/src/app/api/items/[id]/purchase/route.js` (POST handler)
   - Validate user has enough credits
   - Add item to user's library
   - Deduct credits from user balance
   - Record transaction
   - Return success + updated balance

**Files:**
- `apps/web/src/app/api/items/route.js` (new)
- `apps/web/src/app/api/items/[id]/route.js` (new)
- `apps/web/src/app/api/items/[id]/related/route.js` (new)
- `apps/web/src/app/api/items/[id]/purchase/route.js` (new)

**Database Schema:** Use existing Item and User models

---

### T10: Create Library API Endpoints
- **Dependencies:** None (can start parallel)
- **Optional:** false
- **Est. Time:** 20 min
- **Status:** not_started

**Subtasks:**
1. Create `apps/web/src/app/api/library/route.js` (GET handler)
   - Fetch current user's owned items
   - Implement pagination (page, limit)
   - Implement filters (type, purchase date range)
   - Include purchase metadata (date, price paid, creator)
   - Return array + hasMore flag
   - Proper error handling and auth check

**Files:**
- `apps/web/src/app/api/library/route.js` (new)

**Database Schema:** Query from User.library or Transaction model

---

### T11: Create Wallet API Endpoints
- **Dependencies:** None (can start parallel)
- **Optional:** false
- **Est. Time:** 50 min
- **Status:** not_started

**Subtasks:**
1. Create `apps/web/src/app/api/balance/route.js` (GET handler)
   - Return current user's credit balance
   - Include pending credits
   - Include total spent/earned stats
   - Return conversion rate to USD

2. Create `apps/web/src/app/api/transactions/route.js` (GET handler)
   - Fetch user's transaction history
   - Implement pagination (page, limit)
   - Filter by type (income/expense/purchase/top-up)
   - Sort by date or amount
   - Return array + hasMore flag

3. Create `apps/web/src/app/api/checkout/route.js` (POST handler)
   - Accept package selection (credits amount)
   - Create Stripe checkout session
   - Store session reference in database
   - Return session URL

4. Create `apps/web/src/app/api/checkout/confirm/route.js` (POST handler)
   - Verify Stripe payment webhook
   - Add credits to user's balance
   - Create transaction record
   - Return success + updated balance

**Files:**
- `apps/web/src/app/api/balance/route.js` (new)
- `apps/web/src/app/api/transactions/route.js` (new)
- `apps/web/src/app/api/checkout/route.js` (new)
- `apps/web/src/app/api/checkout/confirm/route.js` (new)

**External Services:** Stripe integration for payment

**Database Schema:** User.balance, Transaction model

---

## Summary

| Task | Type | Dependencies | Est. Time | Status |
|------|------|--------------|-----------|--------|
| T1 | Layout | - | 20m | not_started |
| T2 | Layout | - | 25m | not_started |
| T3 | Layout | T1, T2 | 20m | not_started |
| T4 | Page | - | 40m | not_started |
| T5 | Page | - | 50m | not_started |
| T6 | Page | - | 30m | not_started |
| T7 | Page | - | 35m | not_started |
| T8 | API | - | 45m | not_started |
| T9 | API | - | 40m | not_started |
| T10 | API | - | 20m | not_started |
| T11 | API | - | 50m | not_started |

**Total:** 375 minutes ≈ **6-6.5 hours** (with some parallel execution possible)

---

## Execution Strategy

### Wave 1 (Parallel): Layout & Pages Foundation
- Start T1, T2, T4, T5, T6, T7, T8, T9, T10, T11 simultaneously
- Layout tasks move fast (20-25m each)
- Pages depend on APIs, so start pages once API stubs created

### Wave 2: Complete Layout (depends on Wave 1)
- Complete T3 after T1 and T2 finish

### Testing & Validation
- After all tasks complete: verify responsive design at 3 breakpoints
- Verify all API endpoints respond correctly
- Verify no console errors
- Verify color system compliance (no blue/purple/orange)

---

## Success Criteria

✅ All 11 tasks complete without errors  
✅ All 7 pages render and are navigable  
✅ All 13+ API endpoints functional  
✅ Responsive design verified at 375px, 768px, 1024px  
✅ Design system colors applied everywhere  
✅ NO blue, purple, or orange colors in any component  
✅ Zero console errors or TypeScript errors  
✅ Landing, register, signin pages unchanged
