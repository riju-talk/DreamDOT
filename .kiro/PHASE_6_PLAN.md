# Phase 6: UI Enhancement & Design System Implementation

**Duration:** Estimated 2-4 hours  
**Priority:** MEDIUM - After core functionality

---

## Overview

Phase 6 applies the DreamDOT design system across the entire application.

**Design System Source:** `docs/DESIGN.md`

---

## Task 6.1: Update Tailwind Configuration
**File:** `apps/web/tailwind.config.ts`

**Changes Required:**

```typescript
export default {
  theme: {
    extend: {
      colors: {
        // Dark Mode (Default)
        primary: '#99FF33',
        surface: '#121412',
        'surface-low': '#1A1C1A',
        'surface-high': '#242624',
        'on-surface': '#FFFFFF',
        'on-surface-variant': '#A1A1A1',
        
        // Light Mode
        'light-bg': '#F4F3EF',
        'light-surface': '#FFFFFF',
        'light-surface-high': '#EAE9E4',
        'light-primary': '#6B8F3E',
        'light-primary-muted': '#C4D9A9',
        'light-text': '#121412',
        'light-text-secondary': '#6B6B6B',
        'light-text-tertiary': '#9E9E9E',
      },
      fontFamily: {
        serif: ['Noto Serif', 'serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      backdropBlur: {
        '2xl': '40px',
      },
      transitionTimingFunction: {
        ethereal: 'cubic-bezier(0.22, 1, 0.36, 1)',
        snappy: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
}
```

**Implementation:**
1. Add color tokens
2. Add font families (Noto Serif, Manrope)
3. Add border radius values
4. Add easing functions
5. Test with dark/light mode toggle

---

## Task 6.2: Add Grain/Noise Texture Overlay
**File:** `apps/web/src/app/globals.css`

**Implementation:**
```css
/* Grain overlay for tactile effect */
@layer base {
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('data:image/svg+xml,...');
    background-repeat: repeat;
    opacity: 0.03;
    mix-blend-mode: overlay;
    pointer-events: none;
    z-index: -1;
  }
}
```

**Options:**
1. Use SVG filter for grain
2. Use small tiled PNG
3. Use CSS filter with SVG
4. Recommend: SVG filter (lightest)

---

## Task 6.3: Update Button Component
**File:** `apps/web/src/components/ui/button.tsx`

**Changes:**

1. **Primary CTA:**
   - Background: `#99FF33` (dark) / `#6B8F3E` (light)
   - Text: `#000000` (dark) / `#FFFFFF` (light)
   - Shape: `rounded-full`
   - Padding: `px-6 py-3`
   - Hover: `brightness-110`
   - Active: `scale-95`
   - Font: Bold, uppercase

2. **Secondary:**
   - Border: `border-white/10` (dark) / `border-black/5` (light)
   - Text: `#FFFFFF` (dark) / `#121412` (light)
   - Hover: `bg-white/5` (dark) / `bg-black/5` (light)

3. **Ghost:**
   - Transparent background
   - Text: `#A1A1A1` (dark) / `#6B6B6B` (light)
   - Hover: Text becomes primary color

**Implementation:**
1. Update CVA variants
2. Test all button types
3. Test dark/light mode
4. Test hover/active states

---

## Task 6.4: Update Card Component
**File:** `apps/web/src/components/ui/card.tsx`

**Changes:**

1. **Standard Card:**
   - Border radius: `rounded-2xl` or `rounded-3xl`
   - Background: `#1A1C1A` (dark) / `#FFFFFF` (light)
   - Border: `1px solid` `rgba(255,255,255,0.05)` (dark) / `rgba(0,0,0,0.06)` (light)
   - Padding: Min `24px`
   - Hover: `scale-[1.01]`, `brightness-105`

2. **Glass Card:**
   - Background: `rgba(18,20,18,0.60)` (dark) / `rgba(255,255,255,0.70)` (light)
   - Backdrop: `blur-2xl`
   - Border: Luminous border

**Implementation:**
1. Add new variants to CVA
2. Add hover animation
3. Test glass effect
4. Test responsive

---

## Task 6.5: Update Input Component
**File:** `apps/web/src/components/ui/input.tsx`

**Changes:**

1. **Text Input:**
   - Background: `#1A1C1A` (dark) / `#FFFFFF` (light)
   - Border: Luminous border
   - Border radius: `rounded-lg`
   - Focus: Primary color border, ring
   - Placeholder: `#A1A1A1` at 60% opacity
   - Padding: `px-4 py-3`

2. **Error State:**
   - Border: Red-500
   - Shadow: Red glow
   - Helper text in red

**Implementation:**
1. Update input styling
2. Add focus/error states
3. Test with dark/light mode
4. Test accessibility

---

## Task 6.6: Update Tag/Badge Component
**File:** `apps/web/src/components/ui/badge.tsx`

**Changes:**

1. **Default Tag:**
   - Background: `#242624` (dark) / `#C4D9A9` (light)
   - Text: `#A1A1A1` (dark) / `#121412` (light)
   - Border: Luminous
   - Shape: `rounded-full`
   - Font: Label (11px bold uppercase)

2. **Featured Tag:**
   - Background: `#99FF33` (dark) / `#6B8F3E` (light)
   - Text: `#000000` (dark) / `#FFFFFF` (light)

**Implementation:**
1. Update badge variants
2. Test text contrast
3. Ensure proper spacing

---

## Task 6.7: Add Motion Animations
**File:** `apps/web/src/lib/animations/index.ts`

**Animations to Add:**

```typescript
export const etherealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export const snappyVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
}
```

**Implementation:**
1. Export reusable animation variants
2. Use in framer-motion components
3. Apply to page transitions
4. Apply to modal entrances
5. Apply to hover states

---

## Task 6.8: Update Feed Page Styling
**File:** `apps/web/src/app/feed/page.tsx`

**Changes:**
1. Update background color to `#121412`
2. Update card styling to match design system
3. Apply new button styles
4. Update tag colors
5. Apply motion animations
6. Ensure typography matches

---

## Task 6.9: Update Marketplace Page Styling
**File:** `apps/web/src/app/marketplace/page.tsx`

**Changes:**
1. Update background
2. Update card grid styling
3. Update filter panel
4. Update buttons
5. Apply typography
6. Ensure accessibility

---

## Task 6.10: Update Settings Page Styling
**File:** `apps/web/src/app/settings/page.tsx`

**Changes:**
1. Update layout colors
2. Update form inputs
3. Update buttons
4. Update section dividers
5. Ensure consistency

---

## Task 6.11: Update Modal & Dialog Styling
**File:** `apps/web/src/components/ui/dialog.tsx`

**Changes:**
1. Update overlay color
2. Update modal background (glass effect)
3. Update modal border
4. Add entrance animation (scale + fade)
5. Ensure proper z-index

---

## Task 6.12: Update Top Navigation & Sidebar
**File:** `components/top-nav.tsx` & `components/app-sidebar.tsx`

**Changes:**
1. Update colors to match design system
2. Add glassmorphism to top nav
3. Update sidebar background
4. Update active nav indicator (left border primary)
5. Update hover states
6. Ensure responsive

---

## Task 6.13: Create Theme CSS Variables
**File:** `apps/web/src/app/globals.css`

**Add CSS Variables:**
```css
:root {
  /* Dark Mode (Default) */
  --color-primary: #99FF33;
  --color-surface: #121412;
  --color-surface-low: #1A1C1A;
  --color-surface-high: #242624;
  --color-on-surface: #FFFFFF;
  --color-on-surface-variant: #A1A1A1;
  --color-outline: rgba(255, 255, 255, 0.05);
  
  /* Fonts */
  --font-serif: 'Noto Serif', serif;
  --font-sans: 'Manrope', sans-serif;
  
  /* Easing */
  --ease-ethereal: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-snappy: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="light"] {
  --color-surface: #F4F3EF;
  --color-surface-low: #FFFFFF;
  --color-surface-high: #EAE9E4;
  --color-primary: #6B8F3E;
  --color-on-surface: #121412;
  --color-on-surface-variant: #6B6B6B;
  --color-outline: rgba(0, 0, 0, 0.06);
}
```

---

## Task 6.14: Test Design System Across Pages

**Testing Checklist:**
- [ ] Colors correct in dark mode
- [ ] Colors correct in light mode
- [ ] Typography applied correctly
- [ ] Buttons work as designed
- [ ] Cards have proper styling
- [ ] Inputs styled correctly
- [ ] Modals animated correctly
- [ ] Responsive behavior works
- [ ] Contrast meets accessibility standards
- [ ] No console warnings

---

## Task 6.15: Fix Blue Color Issues
**Important:** Remove all blue, purple, orange colors

**Audit Required:**
1. Search for `blue-` in all CSS/JSX
2. Replace with primary/sage colors
3. Search for `purple-` - replace
4. Search for `orange-` - replace
5. Verify no blue/purple/orange remains

---

## Acceptance Criteria

✅ Design system fully implemented  
✅ All pages styled correctly  
✅ Dark/Light mode working  
✅ Typography correct  
✅ Animations smooth  
✅ No blue/purple/orange colors  
✅ Accessibility standards met  
✅ Mobile responsive  
✅ No console errors  

---

## Testing Checklist

- [ ] Toggle dark/light mode on all pages
- [ ] Verify color palette consistency
- [ ] Check typography on all text
- [ ] Test all button types
- [ ] Test all input types
- [ ] Test modal animations
- [ ] Test page transitions
- [ ] Check accessibility (contrast ratios)
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1920px)

