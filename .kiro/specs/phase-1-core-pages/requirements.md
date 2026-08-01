# Phase 1: Core Pages & Layout Infrastructure - Requirements

**Phase Duration:** 2-3 hours  
**Status:** In Progress (~60% complete)

## Overview

Phase 1 establishes the foundation of the DreamDOT application by completing all core pages and layout infrastructure. This includes the main user navigation, content viewing pages (Feed, Marketplace, Library, Wallet), and the necessary API endpoints to support them.

## Feature Requirements

### 1. Core Navigation & Layout

**Requirement 1.1: App Sidebar Navigation**
- Display main navigation items (Feed, Marketplace, Marketplace, Library, Wallet, Create, Messages, Ad Studio, Communities, Discover, Profile)
- Show active state with left border (#99FF33) and elevated background
- Implement hover states with color transitions
- Support responsive collapse on mobile (<768px)
- Include "CREATE NEW ART" CTA button at bottom
- Apply design system colors (no blue/purple/orange)

**Requirement 1.2: Mobile Bottom Navigation**
- Fixed position bottom navigation for screens <768px
- 5 main items: Home, Discover, Create, Messages, Account
- Show active indicator
- Smooth transitions between routes
- Only visible on mobile, hidden on tablet+

**Requirement 1.3: Authenticated Layout**
- Integrate sidebar on desktop (>768px)
- Integrate mobile nav on mobile (<768px)
- Add top notification bar with icons
- Ensure proper z-index and layering
- Support seamless desktop/mobile transitions

### 2. Feed Page

**Requirement 2.1: Post Feed Display**
- Render paginated feed of posts from API
- Display posts in card format (image, title, creator, engagement)
- Show like/comment/share/save actions
- Infinite scroll pagination (load more on scroll)
- Real-time engagement counter updates

**Requirement 2.2: Feed Interactions**
- Like button with API persistence
- Comment button with modal
- Share button with copy/social options
- Save/bookmark button
- Creator profile link on hover

**Requirement 2.3: Feed Filtering**
- Filter by "Following", "For You", "Trending"
- Search posts by title/creator
- Sort by date or engagement

### 3. Marketplace Page

**Requirement 3.1: Item Grid Display**
- Responsive grid (3-4 columns on desktop, 2 on tablet, 1 on mobile)
- Item cards showing: thumbnail, title, price, creator avatar, rating
- Hover effects with item preview
- Load more pagination

**Requirement 3.2: Marketplace Filtering**
- Sidebar filters: Category, Price range, Creator, Rating
- Search bar with autocomplete
- Filter persistence in URL params
- "Clear filters" option

**Requirement 3.3: Item Detail Modal**
- Modal overlay with item details
- Large image gallery with pagination
- Full description and metadata
- Creator profile card with follow button
- Purchase button (redirects to checkout)
- Related items section

### 4. Library Page (User's Owned Items)

**Requirement 4.1: Library Display**
- Grid of user's purchased/owned items
- DRM-protected vault viewer
- Show ownership info and purchase date
- Filter by purchase date, type, creator

**Requirement 4.2: Item Viewer**
- Open item in DRM-protected viewer
- Display watermark with user info
- Show download options (if applicable)
- Display usage rights/restrictions

### 5. Wallet Page

**Requirement 5.1: Balance Display**
- Show current credit balance
- Display available balance vs. pending credits
- Show conversion rate to USD
- Quick stats: Total spent, Total earned

**Requirement 5.2: Transaction History**
- Paginated table of all transactions
- Filter by type: income, expense, purchase, top-up
- Sort by date, amount
- Show transaction details on click

**Requirement 5.3: Top-Up Credits**
- "Add Credits" button
- Stripe integration for payment
- Show available credit packages
- Confirmation before purchase
- Receipt/confirmation after payment

**Requirement 5.4: Web3 Wallet**
- Display connected wallet (if any)
- Connect wallet button (Wagmi/Viem)
- Show blockchain balance
- Display blockchain transaction history

### 6. API Endpoints (Backend)

All API endpoints required to support Phase 1 functionality.

**Requirement 6.1: Feed Endpoints**
- `GET /api/posts` - Fetch paginated posts
  - Query: page, limit, filter (following/for-you/trending)
  - Response: array of posts, hasMore flag
- `POST /api/posts/[id]/like` - Like a post
- `DELETE /api/posts/[id]/like` - Unlike a post
- `POST /api/posts/[id]/comment` - Add comment
- `GET /api/posts/[id]/comments` - Fetch post comments

**Requirement 6.2: Marketplace Endpoints**
- `GET /api/items` - Fetch paginated items
  - Query: page, limit, category, priceMin, priceMax, search
  - Response: array of items, hasMore flag
- `GET /api/items/[id]` - Get item details
- `GET /api/items/[id]/related` - Get related items
- `POST /api/items/[id]/purchase` - Purchase item

**Requirement 6.3: Library Endpoints**
- `GET /api/library` - Fetch user's owned items
  - Query: page, limit, filter
  - Response: array of user's items

**Requirement 6.4: Wallet Endpoints**
- `GET /api/balance` - Get user's credit balance
- `GET /api/transactions` - Get transaction history
  - Query: page, limit, type, sort
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/checkout/confirm` - Confirm payment

## Design System Constraints

- **Colors:** ONLY Deep Void (#121412), Faded Lime (#99FF33), Sage greens. NO blue, purple, or orange
- **Typography:** Noto Serif for headlines, Manrope for body
- **Responsive:** Test at 375px (mobile), 768px (tablet), 1024px (desktop)
- **Accessibility:** All interactive elements keyboard accessible, color contrast ≥4.5:1

## Technical Requirements

- **Frontend:** TypeScript React components (.tsx), Tailwind CSS styling
- **API Routes:** JavaScript (.js), proper error handling
- **State Management:** Zustand for global state
- **Database Queries:** Proper indexing and pagination for performance

## Acceptance Criteria

- ✅ All 7 pages render without TypeScript errors
- ✅ All 15+ API endpoints implement and return proper responses
- ✅ Responsive design verified at 3 breakpoints
- ✅ No console errors or warnings
- ✅ Navigation works seamlessly across pages
- ✅ Dark/light mode toggle works
- ✅ All styling uses design system (no unauthorized colors)
