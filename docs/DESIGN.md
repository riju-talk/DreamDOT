# DreamDOT UI/UX Design System
## Agent Implementation Guide — Single Source of Truth

**Version:** 1.0  
**Last Updated:** 2026-08-01  
**Status:** Canonical — all agents must follow this document exactly.

---

## Table of Contents
1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Component Specifications](#4-component-specifications)
5. [Layout & Grid](#5-layout--grid)
6. [Elevation, Texture & Effects](#6-elevation-texture--effects)
7. [Motion & Interaction](#7-motion--interaction)
8. [Anti-Patterns & Prohibitions](#8-anti-patterns--prohibitions)
9. [Screenshot Corrections](#9-screenshot-corrections)
10. [Agent Implementation Checklist](#10-agent-implementation-checklist)

---

## 1. Design Philosophy

### 1.1 The Ethereal Workshop
DreamDOT is a **weightless, high-fidelity digital atelier**. The design language balances the raw, industrial energy of a creator's workspace with the sophisticated "digital void" elegance of a luxury gallery. It is **dark-mode-first**, fast, fluid, and premium — built for the next generation of creative visionaries.

### 1.2 Core Feel
| Principle | Description |
|-----------|-------------|
| **Void-like depth** | Backgrounds are near-black with subtle warmth (green-gray undertones, never blue). |
| **Surgical light** | Light is used sparingly. Most of the screen lives in shadow; only CTAs, key headlines, and active states draw the eye. |
| **Editorial authority** | Large serif typography mixed with clean sans-serif body copy. Think *Monocle* magazine meets *Are.na*. |
| **Tactile glass** | Surfaces float via glassmorphism (`backdrop-blur`) and luminous 1px borders at ~5% white opacity. |
| **Muted energy** | The primary accent is a **faded, desaturated lime/sage** — never neon, never electric. It should feel like phosphor on a dark CRT, not a traffic light. |

### 1.3 Mode Philosophy
- **Dark Mode** is the canonical, sacred default. It is the "night studio."
- **Light Mode** is a translation into a "sunlit studio" — warm, airy, but still editorial and restrained. It is **not** an inversion.

---

## 2. Color System

### 2.1 Dark Mode Tokens (Canonical)

Dark mode is the default. Every agent must treat these values as immutable.

| Token | Hex / Value | Usage |
|-------|-------------|-------|
| **Primary (Faded Lime)** | `#99FF33` | CTAs, active nav borders, key highlights. **Use sparingly.** In practice, render at ~85% saturation or blend into surfaces so it never screams. |
| **Surface (Deep Void)** | `#121412` | Main application background. Very dark gray with a **warm green undertone**. **NOT navy. NOT blue. NOT pure black.** |
| **Surface Container (Low)** | `#1A1C1A` | Sidebars, card backgrounds, secondary surfaces. Slightly lifted from the void. |
| **Surface Container (High)** | `#242624` | Hover states, elevated modals, dropdowns, pressed states. |
| **On Surface (Primary Text)** | `#FFFFFF` | Headlines, primary body text, primary icons. |
| **On Surface Variant** | `#A1A1A1` | Secondary text, labels, inactive icons, metadata, timestamps. |
| **Outline** | `rgba(255, 255, 255, 0.05)` | Luminous, ultra-thin borders on cards, sidebars, dividers. |
| **Glass Overlay** | `rgba(18, 20, 18, 0.60)` | For glassmorphic surfaces over imagery or depth layers. |

#### Dark Mode Color Usage Rules
- **Backgrounds:** Always start with `#121412`. Never use `#000000`.
- **Borders:** Always use `rgba(255,255,255,0.05)` (or `border-white/5` in Tailwind). No heavy shadows in dark mode.
- **Primary Accent Restraint:** The `#99FF33` lime must never occupy more than ~10% of the viewport at once. Use it for: pill buttons, left-border nav indicators, small dots, and key numerals (e.g., "95%").
- **Text Contrast:** All text on `#121412` or `#1A1C1A` must be `#FFFFFF` or `#A1A1A1`. Never use mid-gray text on mid-gray surfaces.

### 2.2 Light Mode Tokens (Brainstormed)

Light mode translates the "ethereal workshop" into a sunlit studio.

| Token | Hex / Value | Usage |
|-------|-------------|-------|
| **Background** | `#F4F3EF` | Warm off-white with a hint of cream/sage. Avoids sterile hospital-white. Evokes aged paper and studio walls. |
| **Surface (Low)** | `#FFFFFF` | Cards, sidebar, primary containers. Clean but not cold. |
| **Surface (High)** | `#EAE9E4` | Hover states, elevated elements. Slightly darker warm gray for tactile feedback. |
| **Primary (Deep Sage)** | `#6B8F3E` | The faded lime darkened and desaturated for light-ground contrast. Still green, still organic, but authoritative. |
| **Primary Muted** | `#C4D9A9` | For backgrounds of tags, chips, and subtle highlights. |
| **Text Primary** | `#121412` | The Deep Void repurposed as text. Maintains brand continuity. |
| **Text Secondary** | `#6B6B6B` | Warm gray for body copy and labels. |
| **Text Tertiary** | `#9E9E9E` | Disabled states, placeholders, timestamps. |
| **Outline** | `rgba(0, 0, 0, 0.06)` | Subtle warm gray borders. Slightly more visible than dark-mode outlines due to lower contrast environment. |
| **Inverse Surface** | `#121412` | For inverse buttons, dark modals, or "switch to dark" toggles. |

#### Light Mode Color Usage Rules
- **No pure black borders.** Everything uses the warm outline token.
- **No neon green.** The primary in light mode is deep sage (`#6B8F3E`). The faded lime (`#99FF33`) should only appear as a tiny accent (e.g., a dot indicator, a progress bar fill) — never as large button backgrounds.
- **Glassmorphism becomes frosted glass:** `backdrop-blur-xl` + `bg-white/70` over the warm background.
- **Grain stays.** The noise overlay is even more important in light mode to prevent the UI from looking like a generic Bootstrap template.

### 2.3 Semantic Color Mapping

| Semantic Role | Dark Mode | Light Mode |
|---------------|-----------|------------|
| Page Background | `#121412` | `#F4F3EF` |
| Card Background | `#1A1C1A` | `#FFFFFF` |
| Hover / Elevated | `#242624` | `#EAE9E4` |
| Primary CTA Background | `#99FF33` | `#6B8F3E` |
| Primary CTA Text | `#000000` | `#FFFFFF` |
| Secondary CTA Border | `rgba(255,255,255,0.10)` | `rgba(0,0,0,0.06)` |
| Secondary CTA Text | `#FFFFFF` | `#121412` |
| Headline Text | `#FFFFFF` | `#121412` |
| Body Text | `#A1A1A1` | `#6B6B6B` |
| Disabled Text | `#A1A1A1` at 50% opacity | `#9E9E9E` |
| Divider / Border | `rgba(255,255,255,0.05)` | `rgba(0,0,0,0.06)` |
| Tag Background (default) | `#242624` | `#C4D9A9` |
| Tag Text (default) | `#A1A1A1` | `#121412` |
| Tag Background (featured) | `#99FF33` | `#6B8F3E` |
| Tag Text (featured) | `#000000` | `#FFFFFF` |

---

## 3. Typography

**Voice:** Industrial strength meets editorial elegance.

**Font Families:**
- **Primary (Headlines):** `Noto Serif`, serif
- **Secondary (Body / UI):** `Manrope`, sans-serif

### 3.1 Type Scale

| Role | Font | Size | Weight | Line Height | Letter Spacing | Extras |
|------|------|------|--------|-------------|----------------|--------|
| **Display Large** | Noto Serif | 72px | 700 (Bold) | 1.1 | -0.02em | *Italic only*. Hero headlines. |
| **Headline Medium** | Noto Serif | 32px | 700 (Bold) | 1.2 | -0.01em | Section titles. |
| **Headline Small** | Noto Serif | 24px | 700 (Bold) | 1.3 | 0 | Card titles, modal headers. |
| **Body Large** | Manrope | 18px | 500 (Medium) | 1.6 | 0 | Primary copy, descriptions. |
| **Body** | Manrope | 16px | 400 (Regular) | 1.6 | 0 | Default paragraph text. |
| **Label** | Manrope | 11px | 700 (Bold) | 1.4 | 0.1em | **Uppercase**. Metadata, overlines, nav labels, tags. |
| **Button** | Manrope | 14px | 700 (Bold) | 1.0 | 0.05em | **Uppercase**. |
| **Caption** | Manrope | 12px | 400 (Regular) | 1.4 | 0.02em | Timestamps, helper text. |

### 3.2 Typography Rules
- **Headlines are always Noto Serif.** Body is always Manrope. Never mix them within the same semantic role.
- **Display Large is italic.** No other size uses italic by default.
- **Labels are always uppercase with wide tracking.** This applies to nav items, overlines (e.g., "ARCHIVE 01"), tags, and metadata.
- **Never use font-weight below 400.** The system is bold and confident.
- **Responsive scaling:** On mobile (< 768px), all font sizes scale down by 15%.

### 3.3 Practical Examples

**Hero Section (Landing Page):**
```
Overline:    Manrope 11px Bold Uppercase Tracking 0.1em  → "CREATOR-FIRST ATELIER"
Headline:    Noto Serif 72px Bold Italic Tracking -0.02em → "Unbind the work."
Subheadline: Manrope 18px Medium                         → "DreamDOT gives writers, artists..."
CTA:         Manrope 14px Bold Uppercase Tracking 0.05em  → "JOIN THE ATELIER"
```

**Feed Card:**
```
Author Name:   Manrope 14px Bold                          → "Sarah Chen"
Timestamp:     Manrope 12px Regular                       → "24 hours ago"
Post Title:    Noto Serif 24px Bold                       → "Color Theory in Modern Web Design"
Body Preview:  Manrope 16px Regular                       → "Understanding color psychology..."
Tag:           Manrope 11px Bold Uppercase Tracking 0.1em → "#DESIGN"
```

---

## 4. Component Specifications

### 4.1 Buttons

#### Primary CTA
- **Shape:** `rounded-full` (fully pill-shaped)
- **Dark Mode:** Background `#99FF33`, text `#000000`, font bold
- **Light Mode:** Background `#6B8F3E`, text `#FFFFFF`, font bold
- **Padding:** `px-6 py-3` (24px horizontal, 12px vertical)
- **Hover:** `brightness-110` (subtle lightening), `transition-all duration-200`
- **Active:** `scale-95`, `transition-transform duration-200`
- **Focus:** `ring-2 ring-primary/50 ring-offset-2 ring-offset-surface`
- **Disabled:** `opacity-50`, `cursor-not-allowed`, no hover effects

#### Secondary / Utility Button
- **Shape:** `rounded-lg` (8px)
- **Dark Mode:** Transparent background, `border border-white/10`, text `#FFFFFF`
- **Light Mode:** Transparent background, `border border-black/5`, text `#121412`
- **Padding:** `px-5 py-2.5`
- **Hover:** `bg-white/5` (dark) or `bg-black/5` (light), `transition-colors duration-200`
- **Active:** `scale-[0.98]`

#### Ghost Button
- **Shape:** No border radius constraint (inherits from container)
- **Background:** Transparent
- **Text:** `On Surface Variant` (`#A1A1A1` dark / `#6B6B6B` light) with icon
- **Hover:** Text shifts to Primary color, icon shifts to Primary
- **Padding:** `px-3 py-2`

#### Icon Button
- **Shape:** `rounded-full` or `rounded-lg`
- **Size:** 40px × 40px touch target minimum
- **Background:** Transparent or `Surface Container High`
- **Hover:** `bg-white/5` + `scale-105`

### 4.2 Cards

#### Standard Card
- **Border Radius:** `rounded-2xl` (16px) or `rounded-3xl` (24px)
- **Background:** `bg-surface-container-low` (`#1A1C1A` dark / `#FFFFFF` light)
- **Border:** `1px solid` using Outline token
- **Padding:** Minimum `24px` internal padding. Never cramped.
- **Shadow:** None in dark mode. In light mode, use `shadow-sm` (`0 1px 2px rgba(0,0,0,0.05)`).
- **Hover:** `hover:scale-[1.01]`, subtle brightness boost (`hover:brightness-105`), `transition-all duration-300 ease-out`

#### Glass Card (for overlays / floating UI)
- **Background:** `Glass Overlay` token (`rgba(18,20,18,0.60)` dark / `rgba(255,255,255,0.70)` light)
- **Backdrop Filter:** `blur(24px)` (`backdrop-blur-2xl`)
- **Border:** `1px solid` Outline token
- **Border Radius:** `rounded-2xl` or `rounded-3xl`

#### Feature Card (e.g., "Credit Wallet", "Creator Terms")
- **Background:** `Surface Container Low`
- **Border:** `1px solid` Outline token
- **Icon Container:** 48px × 48px, `rounded-xl`, background `Surface Container High`, icon color Primary
- **Title:** `Headline Small` (Noto Serif 24px Bold)
- **Description:** `Body` (Manrope 16px Regular)
- **Padding:** `32px`

### 4.3 Inputs & Forms

#### Text Input
- **Background:** `Surface Container Low` (`#1A1C1A` dark / `#FFFFFF` light)
- **Border:** `1px solid` Outline token
- **Border Radius:** `rounded-lg` (8px)
- **Text:** `On Surface` (`#FFFFFF` dark / `#121412` light)
- **Placeholder:** `On Surface Variant` at 60% opacity
- **Padding:** `px-4 py-3`
- **Focus:** Border transitions to Primary color, `ring-1 ring-primary/30`
- **Error:** Border `#EF4444` (red-500), subtle red glow `shadow-[0_0_0_3px_rgba(239,68,68,0.15)]`

#### Search Input
- **Background:** `Surface Container Low` with `backdrop-blur-md`
- **Border Radius:** `rounded-full`
- **Icon:** Search icon left-aligned, `On Surface Variant` color
- **Padding:** `pl-10 pr-4 py-2.5`

### 4.4 Navigation

#### Landing Page Nav (Top Bar)
- **Container:** Glassmorphic pill bar
  - `backdrop-blur-xl`
  - Background: `rgba(255,255,255,0.05)` (dark) or `rgba(255,255,255,0.70)` (light)
  - `rounded-full`
  - `border: 1px solid` Outline token
- **Position:** Fixed, floating below top edge (`top-4`), centered horizontally
- **Height:** ~56px
- **Z-Index:** 50
- **Items:** Manrope 14px Bold Uppercase, tracking 0.05em
- **Active Item:** Text color Primary
- **Logo:** DreamDOT wordmark + icon, left-aligned inside the pill

#### App Sidebar (Desktop ≥ 1024px)
- **Width:** Fixed `280px`
- **Background:** `Surface Container Low`
- **Border Right:** `1px solid` Outline token
- **Padding:** `24px`
- **Section Labels:** `Label` style (Manrope 11px Bold Uppercase, tracking 0.1em, `On Surface Variant`)
- **Nav Item:**
  - Height: 44px minimum
  - Padding: `px-4 py-2.5`
  - Border Radius: `rounded-lg`
  - Default: Text `On Surface Variant`, icon `On Surface Variant`
  - Hover: Background `Surface Container High`, text `On Surface`
  - **Active:** Background `Surface Container High`, **left-border accent** `border-l-2 border-l-primary`, text `On Surface`, icon Primary
- **Bottom Action:** "CREATE NEW ART" button, Primary CTA style, full width

#### App Top Bar (Inside Application)
- **Height:** 64px
- **Background:** Glassmorphic (`backdrop-blur-xl`, `bg-surface/60`)
- **Border Bottom:** `1px solid` Outline token
- **Position:** Fixed, top-0, z-50
- **Left:** Hamburger (tablet/mobile) or breadcrumb
- **Center:** Page title in `Headline Small`
- **Right:** Search icon, notifications, avatar (40px circle)

#### Bottom Navigation (Mobile < 768px)
- **Position:** Fixed bottom
- **Height:** 64px + safe area inset
- **Background:** `Surface Container Low` with `backdrop-blur-xl`
- **Border Top:** `1px solid` Outline token
- **Items:** 4–5 icons with labels (Manrope 10px)
- **Active:** Icon and label in Primary color

### 4.5 Tags, Chips & Pills

#### Default Tag
- **Dark Mode:** Background `#242624`, text `#A1A1A1`, border `1px solid rgba(255,255,255,0.05)`
- **Light Mode:** Background `#C4D9A9`, text `#121412`, border none
- **Border Radius:** `rounded-full`
- **Padding:** `px-3 py-1`
- **Font:** `Label` style (Manrope 11px Bold Uppercase, tracking 0.1em)

#### Featured Tag
- **Dark Mode:** Background `#99FF33`, text `#000000`
- **Light Mode:** Background `#6B8F3E`, text `#FFFFFF`
- **Border Radius:** `rounded-full`
- **Padding:** `px-3 py-1`

#### Category Chip (e.g., Writing, Illustration)
- **Shape:** `rounded-lg` (not fully pill)
- **Background:** Transparent
- **Border:** `1px solid` Outline token
- **Text:** `On Surface Variant`
- **Icon:** Left-aligned, 16px, `On Surface Variant`
- **Hover:** Border color transitions to Primary, text transitions to Primary

### 4.6 Modals & Drawers

#### Modal
- **Overlay:** `bg-black/60` (dark mode) or `bg-white/40` (light mode), `backdrop-blur-sm`
- **Container:** Glass Card specs, max-width `560px`
- **Border Radius:** `rounded-3xl` (24px)
- **Padding:** `32px`
- **Header:** `Headline Small` + close icon (top-right, 40px touch target)
- **Entrance:** Scale from 0.95 + fade in, 300ms, spring easing

#### Drawer (Sidebar Panel)
- **Width:** `400px` max, `100vw` on mobile
- **Background:** `Surface Container Low`
- **Border Left:** `1px solid` Outline token
- **Entrance:** Slide from right, `translateX(100%) → translateX(0)`, 400ms, `cubic-bezier(0.22, 1, 0.36, 1)`

### 4.7 Dividers
- **Color:** Outline token
- **Thickness:** 1px
- **Style:** Solid
- **Margin:** `16px` vertical minimum

### 4.8 Avatars
- **Size:** 40px (standard), 48px (card header), 64px (profile)
- **Shape:** `rounded-full`
- **Border:** `2px solid` Outline token (optional, for emphasis)
- **Fallback:** Initials in `Headline Small` style, background `Surface Container High`

---

## 5. Layout & Grid

### 5.1 Grid System
- **Desktop (≥ 1024px):** 12-column grid, `32px` gutters, `24px` outer margins
- **Tablet (768px – 1023px):** 8-column grid, `24px` gutters, `16px` outer margins
- **Mobile (< 768px):** 4-column grid, `16px` gutters, `16px` outer margins

### 5.2 Content Constraints
- **Max Content Width:** `1600px`, centered with auto margins
- **Reading Width:** Max `680px` for long-form text (essays, articles) to maintain readability

### 5.3 Spacing Scale
Use an 8px base grid. All spacing values should be multiples of 4px.

| Token | Value |
|-------|-------|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |
| `space-20` | 80px |
| `space-24` | 96px |

### 5.4 Responsive Behavior

| Breakpoint | Sidebar | Grid | Font Scale | Key Changes |
|------------|---------|------|------------|-------------|
| **Desktop (≥ 1024px)** | Full 280px sidebar | 12-col, 32px gutter | 100% | Multi-pane studio view. Sidebar always visible. |
| **Tablet (768–1023px)** | Collapses to 80px icon rail | 8-col, 24px gutter | 100% | Rail shows icons + active indicator only. Tooltips on hover. |
| **Mobile (< 768px)** | Hidden; bottom nav appears | 4-col, 16px gutter | 85% | Bottom nav with 4–5 items. Stacked layouts. Reduced padding. |

### 5.5 Z-Index Hierarchy
| Layer | Z-Index | Elements |
|-------|---------|----------|
| Background | 0 | Page background, grain overlay |
| Content | 10 | Cards, text, images |
| Sticky | 30 | Sticky section headers |
| Navigation | 50 | Top bars, sidebars, bottom nav |
| Overlay | 100 | Modal overlays, drawer backdrops |
| Modal | 200 | Modal containers, drawers, toasts |
| Tooltip / Popover | 300 | Tooltips, dropdown menus |

---

## 6. Elevation, Texture & Effects

### 6.1 Glassmorphism
- **Blur:** `backdrop-blur-xl` (24px) for nav bars; `backdrop-blur-2xl` (40px) for floating cards
- **Background:** `bg-surface/60` (dark) or `bg-white/70` (light)
- **Border:** `1px solid` Outline token
- **Use for:** Top navigation, floating action buttons, modals, dropdown menus, image overlays

### 6.2 Luminous Borders
- **Value:** `border-white/5` (dark) or `border-black/5` (light)
- **Purpose:** Define edges in the void without adding visual weight
- **Where:** Every card, sidebar, divider, input field, and modal

### 6.3 Grain / Noise Texture
- **Implementation:** A fixed-position overlay div covering the entire viewport
- **Opacity:** 3%–4%
- **Blend Mode:** `mix-blend-mode: overlay` (dark mode) or `mix-blend-mode: multiply` (light mode)
- **Purpose:** Prevents the "flat digital" look; adds tactile, analog depth
- **Performance:** Use a small tiled PNG or CSS `filter: url(#noise)` with an SVG filter. Never use a massive image.

### 6.4 Shadows (Light Mode Only)
Dark mode relies on luminous borders and glow. Light mode uses subtle shadows:
- **Card Shadow:** `0 1px 3px rgba(0,0,0,0.05)`
- **Elevated Shadow:** `0 4px 12px rgba(0,0,0,0.08)`
- **Modal Shadow:** `0 8px 30px rgba(0,0,0,0.12)`

---

## 7. Motion & Interaction

### 7.1 Easing Definitions
| Name | Value | Usage |
|------|-------|-------|
| **Ethereal** | `cubic-bezier(0.22, 1, 0.36, 1)` | Primary entrance, page transitions, drawer slides |
| **Snappy** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Micro-interactions: toggles, button presses, switches |
| **Smooth** | `cubic-bezier(0.4, 0, 0.2, 1)` | Hover states, color transitions, opacity fades |

### 7.2 Entrance Animations
- **Weightless Slide:**
  - `opacity: 0 → 1`
  - `translateY: 20px → 0`
  - `duration: 600ms`
  - `ease: Ethereal`
  - **Stagger:** 80ms between sibling elements
- **Scale Reveal (for modals):**
  - `opacity: 0 → 1`
  - `scale: 0.95 → 1`
  - `duration: 300ms`
  - `ease: Snappy`

### 7.3 Hover States
- **Buttons:** `brightness-110` (primary), `bg-white/5` (secondary), `transition-all duration-200 ease-smooth`
- **Cards:** `scale-[1.01]`, `brightness-105`, `transition-all duration-300 ease-smooth`
- **Nav Items:** Background fill to `Surface Container High`, text color to `On Surface`, `transition-colors duration-150`
- **Links:** Underline animation (width 0% → 100% from left), `transition-all duration-300`

### 7.4 Active / Pressed States
- **All interactive elements:** `scale-95` or `scale-[0.98]`, `duration-100`
- **Touch targets:** Minimum 44px × 44px on mobile

### 7.5 Focus States
- **Ring:** `ring-2 ring-primary/50 ring-offset-2 ring-offset-surface`
- **Purpose:** Visible keyboard navigation without breaking the aesthetic

### 7.6 Scroll Behavior
- **Smooth scrolling:** `scroll-behavior: smooth` globally
- **Parallax (optional):** Hero images and glass cards may use subtle `translateY` parallax at 0.1× scroll speed
- **Sticky headers:** `position: sticky`, `top-0`, with `backdrop-blur-xl` activation after 50px scroll

### 7.7 Page Transitions
- **Exit:** `opacity: 1 → 0`, `duration: 150ms`
- **Enter:** Weightless Slide, `duration: 400ms`

---

## 8. Anti-Patterns & Prohibitions

These are **hard rules.** Violating them creates visual debt that contradicts the brand.

| ❌ Forbidden | ✅ Required |
|-------------|-------------|
| Use blue, purple, or orange as accents. | Use only the faded lime/sage family (`#99FF33`, `#6B8F3E`, `#C4D9A9`). |
| Use `#000000` pure black backgrounds. | Use `#121412` Deep Void (warm dark gray). |
| Use `#99FF33` at full saturation on large areas. | Desaturate it, blend it, or use it as a thin border/dot. |
| Use blue-tinted dark grays. | Keep dark grays warm (green-gray). |
| Use generic white backgrounds in light mode. | Use warm cream `#F4F3EF`. |
| Use heavy drop shadows in dark mode. | Use luminous borders (`white/5`) and glassmorphism. |
| Use neon green in light mode for large elements. | Use deep sage `#6B8F3E` for light mode CTAs. |
| Use blue tags, pills, or chips. | Tags use `Surface Container High` + `On Surface Variant`, or Primary fill. |
| Crowd components with small padding. | Respect the void. Minimum 24px internal card padding. |
| Use font-weight below 400. | Minimum 400 (Regular). Headlines are 700 (Bold). |
| Use generic fade-ins without motion. | Everything should feel like it's materializing into the void. |
| Use pure black borders anywhere. | Use Outline tokens (`white/5` or `black/6`). |
| Mix serif fonts for body copy. | Body is always Manrope. Headlines are always Noto Serif. |
| Use default browser focus rings. | Use the custom `ring-primary/50` focus state. |
| Ignore touch target sizes on mobile. | Minimum 44px × 44px for all interactive elements. |

---

## 9. Screenshot Corrections

The home feed screenshot (image 6 in the original asset set) contains **deviations that must be treated as bugs and fixed:**

1. **Background is navy/dark blue.** It must be `#121412` (Deep Void). There is no blue in this palette.
2. **Tags are blue.** Tags, pills, and category chips must use either the faded lime primary, or `Surface Container High` with `On Surface Variant` text. No blue. No purple. No orange.
3. **Card backgrounds appear bluish.** They must sit on `#1A1C1A` or float with glassmorphism over `#121412`.
4. **Sidebar background appears blue-tinted.** It must match `Surface Container Low` (`#1A1C1A`).

**Rule:** The landing page screenshots (images 1–5) represent the canonical aesthetic. The home feed screenshot represents a development bug. Always defer to the landing page void aesthetic.

---

## 10. Agent Implementation Checklist

Before submitting any UI code, verify:

- [ ] Background color is `#121412` (dark) or `#F4F3EF` (light). Not blue. Not pure black.
- [ ] All borders use the Outline token (`white/5` dark, `black/6` light).
- [ ] Primary accent (`#99FF33`) is used sparingly (< 10% of viewport).
- [ ] Headlines use `Noto Serif`. Body uses `Manrope`.
- [ ] Labels and buttons are uppercase with correct tracking.
- [ ] Cards have minimum `24px` padding and `rounded-2xl` or `rounded-3xl`.
- [ ] Hover states are implemented on all interactive elements.
- [ ] Active states use `scale-95`.
- [ ] Focus rings use `ring-primary/50`.
- [ ] Mobile touch targets are ≥ 44px.
- [ ] No blue, purple, or orange appears anywhere in the UI.
- [ ] Glassmorphic elements use `backdrop-blur` + semi-transparent backgrounds.
- [ ] Grain/noise overlay is applied to the root layout.
- [ ] Animations use the Ethereal or Snappy easing curves, not default `ease`.
- [ ] Responsive breakpoints are handled: Desktop (≥1024px), Tablet (768–1023px), Mobile (<768px).
- [ ] Z-index hierarchy is respected (Nav at 50, Modals at 200).
- [ ] Light mode uses warm cream backgrounds and deep sage primary, not neon green.

---

## Appendix A: Tailwind Config Reference

```javascript
// tailwind.config.js reference for agents
module.exports = {
  theme: {
    extend: {
      colors: {
        // Dark Mode
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
        'ethereal': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'snappy': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
};
```

## Appendix B: CSS Variables Reference

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
  --color-glass: rgba(18, 20, 18, 0.60);

  /* Typography */
  --font-serif: 'Noto Serif', serif;
  --font-sans: 'Manrope', sans-serif;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* Motion */
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
  --color-glass: rgba(255, 255, 255, 0.70);
}
```

---

*End of Document. All agents must treat this as the canonical reference for DreamDOT user interface implementation.*
