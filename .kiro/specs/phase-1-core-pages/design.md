# Phase 1: Design & Technical Architecture

**Spec:** Phase 1 - Core Pages & Layout Infrastructure

---

## Design System Application

### Color Palette (Approved)
- **Primary:** #99FF33 (Faded Lime) - Active states, CTAs, accents
- **Surface:** #121412 (Deep Void) - Backgrounds, cards
- **Sage Tones:** #6B8E6E, #4A6D4A - Secondary accents
- **Text:** #FFFFFF (light mode), #121412 (dark mode)

### Prohibited Colors
- ❌ NO blue (#0066FF, #2563EB, #3B82F6, etc.)
- ❌ NO purple (#9333EA, #7C3AED, #6366F1, etc.)
- ❌ NO orange (#FF8533, #FB923C, #F97316, etc.)

### Component Styling Patterns

**Active Navigation Items:**
```tsx
// Left border indicator + elevated background
<div className="border-l-4 border-[#99FF33] bg-[#1a1918] hover:bg-[#1f1e1c]">
  {/* Item content */}
</div>
```

**Primary Buttons:**
```tsx
// Use Faded Lime for CTAs
<button className="bg-[#99FF33] text-[#121412] hover:bg-[#85e022] font-semibold rounded-full px-6 py-2">
  Create
</button>
```

**Card Components:**
```tsx
// Deep Void surface with subtle borders
<div className="bg-[#1a1918] border border-[#2a2826] rounded-lg p-4">
  {/* Card content */}
</div>
```

---

## Layout Architecture

### Desktop Layout (≥1024px)
```
┌─────────────────────────────────────────┐
│  Notification Bar                        │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │  Main Content Area           │
│ (240px)  │  (Responsive)                │
│          │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

**Sidebar Specs:**
- Fixed width: 240px
- Position: Fixed left
- Navigation items with icons + labels
- Active state: Left border + elevated bg
- "CREATE NEW ART" button at bottom
- Scrollable if content exceeds viewport

**Main Content:**
- Left margin: 240px
- Padding: 24px
- Max width: 1400px
- Responsive to screen size

### Tablet Layout (768px - 1023px)
```
┌─────────────────────────────────────────┐
│  Notification Bar                        │
├──────────────────────────────────────────┤
│                                          │
│  Main Content Area (Full Width)          │
│                                          │
├──────────────────────────────────────────┤
│  Mobile Nav                              │
└──────────────────────────────────────────┘
```

**Changes:**
- Sidebar hidden (visible on click/hamburger)
- Main content full width
- Bottom nav visible
- Stack layout vertically

### Mobile Layout (<768px)
```
┌─────────────────────────────────────────┐
│  Notification Bar (Compact)              │
├─────────────────────────────────────────┤
│                                          │
│  Main Content Area (Full Width)          │
│  (Padding: 16px)                         │
│                                          │
├─────────────────────────────────────────┤
│  Mobile Bottom Navigation                │
└─────────────────────────────────────────┘
```

**Specifications:**
- Sidebar: Hidden (accessible via hamburger)
- Content: Full width, 16px padding
- Bottom nav: 70px height, fixed
- Content margin-bottom: 70px (to clear nav)

---

## Page-Specific Designs

### Feed Page
```
┌─────────────────────────┐
│ Filter Tabs             │
│ [Following][For You]... │
├─────────────────────────┤
│ Post Card #1            │
│ ├─ Creator info         │
│ ├─ Image                │
│ ├─ Title/Description    │
│ └─ Actions (Like, etc)  │
├─────────────────────────┤
│ Post Card #2            │
├─────────────────────────┤
│ [Loading indicator...]  │
└─────────────────────────┘
```

**Card Specs:**
- Width: 100% (responsive)
- Border: 1px #2a2826
- Border-radius: 8px
- Padding: 16px
- Hover: Slight shadow elevation
- Image height: 300px (mobile), 400px (desktop)

**Action Buttons:**
- Like: Icon + count, toggles on click
- Comment: Icon + count, opens modal
- Share: Icon dropdown with copy/social
- Save: Icon toggle

### Marketplace Page
```
┌──────────────────────────────────────┐
│ [Search...] [Filters]                │
├──────────┬──────────────────────────┤
│ Filters  │ Item Grid               │
│ ├─ Cat   │ ┌───┬───┬───┬───┐      │
│ ├─ Price │ │   │   │   │   │      │
│ ├─ Rate  │ │   │   │   │   │      │
│ └─ More  │ └───┴───┴───┴───┘      │
│          │ ┌───┬───┬───┬───┐      │
│          │ │   │   │   │   │      │
│          │ └───┴───┴───┴───┘      │
└──────────┴──────────────────────────┘
```

**Grid Specs:**
- Desktop: 4 columns
- Tablet: 2 columns
- Mobile: 1 column
- Gap: 16px
- Item height: auto (aspect ratio preserved)

**Item Card:**
- Image: 200px square, cover fit
- Title: Truncate to 2 lines
- Price: Bold, Faded Lime color
- Creator: Avatar + name clickable
- Rating: Stars + count

### Library Page
```
┌──────────────────────────────────────┐
│ [Filter by Date] [Filter by Type]   │
├──────────────────────────────────────┤
│ ┌───┬───┬───┬───┐                    │
│ │   │   │   │   │  Your Items        │
│ ├───┼───┼───┼───┤                    │
│ │   │   │   │   │                    │
│ └───┴───┴───┴───┘                    │
└──────────────────────────────────────┘
```

**Grid Specs:**
- Desktop: 4 columns
- Tablet: 2 columns
- Mobile: 1 column
- Show ownership badge
- Show purchase date below title

### Wallet Page
```
┌──────────────────────────────────────┐
│ ┌────────────────────────────────┐  │
│ │ Balance Card                   │  │
│ │ Current: $50.00                │  │
│ │ [Add Credits] [History]        │  │
│ └────────────────────────────────┘  │
├──────────────────────────────────────┤
│ Transaction History                  │
│ [Filter by Type] [Sort by Date]      │
│ ┌──────────────────────────────────┐ │
│ │ Income - Post Sell - +$5.00      │ │
│ │ May 15, 2024                     │ │
│ ├──────────────────────────────────┤ │
│ │ Expense - Item Purchase - -$2.50 │ │
│ │ May 14, 2024                     │ │
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ Web3 Wallet Connection               │
│ Status: Not Connected                │
│ [Connect Wallet]                     │
└──────────────────────────────────────┘
```

**Sections:**
- Balance card: 100% width, prominent styling
- Transaction table: Sortable, filterable, paginated
- Web3 panel: Card layout with connection status

---

## Responsive Breakpoints

### Mobile (375px - 767px)
- Single column layouts
- Full-width cards
- Sidebar hidden (hamburger menu)
- Bottom navigation visible
- Font sizes: base -10%
- Padding: 16px

### Tablet (768px - 1023px)
- 2-column grids
- Sidebar hidden (hamburger)
- Bottom navigation visible
- Font sizes: base
- Padding: 20px

### Desktop (1024px+)
- 3-4 column grids
- Sidebar visible (fixed)
- Main content area 240px from left
- Font sizes: base
- Padding: 24px

---

## Navigation Structure

### Sidebar Items (Desktop Only)
```
🏠 Home              → /feed
🔍 Discover          → /discover
✨ Explore           → /explore
```

```
📝 Create New Art     → /create (PRIMARY CTA)
```

```
💬 Messages          → /messages
🎨 Creator Studio    → /create (or /studio)
📊 Ad Studio         → /ad-studio
🌐 Communities       → /communities
💰 Wallet            → /wallet
📚 Library           → /library
🎪 Marketplace       → /marketplace
```

```
👤 Profile           → /profile
⚙️  Settings          → /settings
```

### Mobile Bottom Navigation
```
[Home] [Discover] [+Create] [Messages] [Account]
```

- Fixed at bottom
- 5 items total
- Icons only on mobile, icons + labels on tablet
- Active: Faded Lime (#99FF33) color

---

## Typography System

### Headings
- Font: Noto Serif
- Sizes: 32px (H1), 24px (H2), 20px (H3), 16px (H4)
- Weight: 700 (bold)
- Color: #FFFFFF

### Body Text
- Font: Manrope
- Size: 14px (default), 12px (small)
- Weight: 400 (regular), 600 (semibold)
- Color: #FFFFFF (light), #121412 (dark)
- Line-height: 1.6

### Labels
- Font: Manrope
- Size: 12px
- Weight: 600
- Color: #99FF33 or #6B8E6E

---

## Component Specifications

### Button Variants

**Primary (CTA):**
```tsx
className="bg-[#99FF33] text-[#121412] hover:bg-[#85e022] rounded-full px-6 py-2 font-semibold"
```

**Secondary:**
```tsx
className="bg-[#1a1918] text-[#99FF33] border border-[#99FF33] hover:bg-[#2a2826] rounded-full px-6 py-2"
```

**Tertiary:**
```tsx
className="text-[#99FF33] hover:underline"
```

### Input Fields
```tsx
className="bg-[#1a1918] border border-[#2a2826] text-[#FFFFFF] placeholder-[#6B8E6E] rounded-lg px-4 py-2 focus:border-[#99FF33]"
```

### Cards
```tsx
className="bg-[#1a1918] border border-[#2a2826] rounded-lg p-4 hover:shadow-lg transition-shadow"
```

### Badges
```tsx
className="inline-block bg-[#6B8E6E] text-[#FFFFFF] rounded-full px-3 py-1 text-xs font-semibold"
```

---

## Animation Specifications

### Transitions
- Default: 200ms ease-in-out
- Hover effects: Instant (0ms)
- Page load: 300ms fade-in
- Modal: 200ms scale-in

### Easing Functions (from DESIGN.md)
- **Ethereal:** cubic-bezier(0.25, 0.1, 0.25, 1.0)
- **Snappy:** cubic-bezier(0.34, 1.56, 0.64, 1)
- **Smooth:** cubic-bezier(0.4, 0, 0.2, 1)

### Effects
- Active nav item: Slide-in left border
- Hover cards: Slight elevation (shadow)
- Like button: Pulse animation on toggle
- Page transitions: Fade + slide

---

## Accessibility Requirements

### Color Contrast
- Text on background: ≥ 4.5:1 ratio
- Icons on background: ≥ 3:1 ratio
- Example: #FFFFFF on #121412 = 15.8:1 ✓

### Keyboard Navigation
- All buttons keyboard accessible
- Tab order: Logical (top-to-bottom, left-to-right)
- Focus indicators: Visible (min 2px border)
- Modals: Trap focus inside modal

### Screen Readers
- All images: Alt text (descriptive)
- Form labels: Associated with inputs
- Icons: aria-label or sr-only text
- Interactive elements: Role attribute

### Touch Targets
- Minimum: 44x44px (mobile)
- Button spacing: 8px minimum

---

## Performance Specifications

### Image Optimization
- JPEG for photos (quality 80)
- WebP format with fallback
- Lazy load below fold
- Responsive sizes: srcset with 1x/2x

### Code Splitting
- Route-based splitting
- Component lazy loading
- API response caching

### Bundle Targets
- Main bundle: <100KB
- CSS: <30KB (gzipped)
- First contentful paint: <2s

---

## Testing Checklist

### Visual Testing
- [ ] All pages render at 375px, 768px, 1024px
- [ ] Colors match design system (screenshot)
- [ ] No blue/purple/orange anywhere
- [ ] Typography scales correctly
- [ ] Hover states work on all interactive elements

### Functional Testing
- [ ] Navigation works seamlessly
- [ ] API calls return correct data
- [ ] Error states display properly
- [ ] Loading states show spinners/skeletons
- [ ] Responsive transitions smooth

### Accessibility Testing
- [ ] All buttons keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] Color contrast ≥ 4.5:1
- [ ] Screen reader friendly

### Performance Testing
- [ ] First contentful paint < 2s
- [ ] Lighthouse score > 80
- [ ] No console errors
- [ ] Images lazy loaded below fold
