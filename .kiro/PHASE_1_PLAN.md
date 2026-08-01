# Phase 1: Core Pages & Layout Infrastructure

**Duration:** Estimated 2-3 hours  
**Priority:** HIGH - Foundation for entire app

---

## Tasks Breakdown

### Task 1.1: Complete Feed Page
**File:** `apps/web/src/app/feed/page.tsx`

**Current State:**
- ✓ Basic card layout exists
- ✓ Fake data rendering
- ✗ No API integration
- ✗ No infinite scroll
- ✗ Like/comment not persisted

**Implementation:**
```typescript
// Add server action to fetch posts
async function getPosts(page = 0, limit = 10) {
  // Call API endpoint /api/posts
}

// Add infinite scroll hook
useInfiniteScroll(() => {
  // Load more posts
})

// Update like/comment to call API
const handleLike = async (postId: string) => {
  // POST /api/posts/[id]/like
}
```

**Dependencies:**
- API endpoint: `GET /api/posts`
- API endpoint: `POST /api/posts/[id]/like`
- API endpoint: `POST /api/posts/[id]/comment`

---

### Task 1.2: Create Marketplace Page
**File:** `apps/web/src/app/marketplace/page.tsx`

**Requirements:**
- Grid layout (3-4 columns responsive)
- Filter sidebar (category, price, creator)
- Search bar
- Item cards with thumbnail, title, price, creator
- Purchase button
- Item detail modal

**Implementation Steps:**
1. Create page.tsx with layout structure
2. Create ItemCard component
3. Create FilterSidebar component
4. Create ItemDetailModal component
5. Add API integration for items

**Dependencies:**
- API endpoint: `GET /api/items`
- API endpoint: `GET /api/items/[id]`
- API endpoint: `POST /api/items/[id]/purchase`

---

### Task 1.3: Create Library Page
**File:** `apps/web/src/app/library/page.tsx`

**Requirements:**
- Display user's purchased items
- Grid layout
- Open item in DRM vault viewer
- Show ownership info
- Filters by type/purchase date

**Implementation Steps:**
1. Create page.tsx
2. Fetch user's owned items
3. Create LibraryItemCard component
4. Create VaultViewer component (DRM protection)
5. Add watermarking system

**Dependencies:**
- API endpoint: `GET /api/library`
- DRM viewer component with watermarking

---

### Task 1.4: Complete Wallet Page
**File:** `apps/web/src/app/wallet/page.tsx`

**Requirements:**
- Display credit balance
- Transaction history table
- Top-up credits button (Stripe)
- Web3 wallet connection display
- Blockchain ledger view

**Implementation Steps:**
1. Update page.tsx with complete layout
2. Create BalanceCard component
3. Create TransactionHistory component
4. Create TopUpModal component
5. Create Web3ConnectionPanel component

**Dependencies:**
- API endpoint: `GET /api/balance`
- API endpoint: `GET /api/transactions`
- API endpoint: `POST /api/checkout` (Stripe)
- Wagmi/Viem for Web3

---

### Task 1.5: Fix App Sidebar
**File:** `components/app-sidebar.tsx`

**Current Issues:**
- Navigation items styling inconsistent
- Active state not clear
- Responsive behavior needs work

**Implementation:**
1. Add active state detection
2. Style active nav item with left border accent
3. Ensure proper hover states
4. Fix responsive collapse behavior
5. Add "CREATE NEW ART" button at bottom

**Styling Requirements:**
- Active: left border #99FF33, background slightly elevated
- Hover: background color change
- Icons should match text color on active

---

### Task 1.6: Create Mobile Bottom Navigation
**File:** `components/mobile-nav.tsx` (new)

**Requirements:**
- Fixed bottom navigation on mobile (<768px)
- 5 main items: Home, Discover, Create, Messages, Account
- Icon + label
- Active indicator
- Trigger appropriate modals

**Implementation:**
1. Create new component
2. Add bottom nav structure
3. Add active state styling
4. Integrate with routing
5. Show in authenticated layout only

---

### Task 1.7: Update AuthenticatedLayout
**File:** `components/authenticated-layout.tsx`

**Changes:**
- Add mobile bottom nav for small screens
- Adjust sidebar responsive behavior
- Ensure proper layout hierarchy
- Add notification center icon
- Add search bar in top nav

---

## Acceptance Criteria

✅ All pages render without errors  
✅ API calls return appropriate data  
✅ Navigation works on desktop and mobile  
✅ Responsive design works (tested at 375px, 768px, 1024px)  
✅ Styling consistent across pages  
✅ No console errors  

---

## Testing Checklist

- [ ] Desktop view (1920px)
- [ ] Tablet view (768px)
- [ ] Mobile view (375px)
- [ ] Dark mode
- [ ] Light mode
- [ ] Infinite scroll behavior
- [ ] Filter functionality
- [ ] Search functionality
- [ ] API error handling

