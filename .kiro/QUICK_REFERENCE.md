# DreamDOT Implementation - Quick Reference

---

## 🎯 6-Phase Implementation Roadmap

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  PHASE 1: Core Pages (2-3h)                    FOUNDATION           │
│  Feed | Marketplace | Library | Wallet | Mobile Nav                │
│  ✓ Tasks: 1.1-1.7                                                  │
│                                                                     │
│  PHASE 2: Creator Studio (2-3h)              CORE FEATURE           │
│  Writer | Media | Bundle | Validation | Publish                   │
│  ✓ Tasks: 2.1-2.8                                                  │
│                                                                     │
│  PHASE 3: Ad Studio (1.5-2h)                 MARKETING              │
│  Meta OAuth | Campaign Builder | History                           │
│  ✓ Tasks: 3.1-3.7                                                  │
│                                                                     │
│  PHASE 4: Chat & Communities (2-3h)         SOCIAL                 │
│  Messaging | Servers | Text Channels | Live Presence               │
│  ✓ Tasks: 4.1-4.11                                                 │
│                                                                     │
│  PHASE 5: Profile & Settings (1.5-2h)      ACCOUNT                 │
│  Profiles | Settings | Privacy | Security                          │
│  ✓ Tasks: 5.1-5.12                                                 │
│                                                                     │
│  PHASE 6: UI Enhancement (2-4h)             POLISH                 │
│  Design System | Colors | Typography | Motion                      │
│  ✓ Tasks: 6.1-6.15                                                 │
│                                                                     │
│                    Total: ~12-16 hours                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Phase Overview

### Phase 1: Core Pages & Layout (2-3 hours)

**What to Build:**
```
Feed Page ──────────────────────► Marketplace Page
  │                                   │
  ├─ Real posts & comments           ├─ Item grid layout
  ├─ Infinite scroll                 ├─ Filter sidebar
  ├─ Like/Comment buttons            ├─ Search functionality
  └─ Follow button                   └─ Purchase flow

Library Page                       Wallet Page
  │                                   │
  ├─ Purchased items               ├─ Credit balance
  ├─ DRM vault viewer              ├─ Transaction history
  ├─ Watermarking                  ├─ Top-up button
  └─ Download options              └─ Web3 connection
```

**Key Files to Create/Update:**
- `feed/page.tsx` (enhance)
- `marketplace/page.tsx` ⭐ NEW
- `library/page.tsx` ⭐ NEW
- `wallet/page.tsx` (complete)
- `components/mobile-nav.tsx` ⭐ NEW

**Files: 5 | New: 3 | Time: 2-3 hours**

---

### Phase 2: Creator Studio (2-3 hours)

**What to Build:**
```
Creator Studio Page
  │
  ├─ TAB 1: Writer
  │   ├─ Title input (140 max)
  │   ├─ Category selector
  │   ├─ Rich text editor
  │   └─ Pricing model
  │
  ├─ TAB 2: Media
  │   ├─ Drag-drop upload
  │   ├─ File management
  │   ├─ Reordering
  │   └─ Auto-thumbnail
  │
  └─ TAB 3: Bundle
      ├─ Search items
      ├─ Multi-select UI
      ├─ Bundle pricing
      └─ Min 2 items validation
```

**Mandatory Fields:** Title + Thumbnail + Script (enforce!)

**Key Files to Create:**
- `create/page.tsx` ⭐ NEW
- `create/components/WriterPart.tsx` ⭐ NEW
- `create/components/MediaPart.tsx` ⭐ NEW
- `create/components/BundlePart.tsx` ⭐ NEW
- `lib/store/useCreatorStudioStore.ts` ⭐ NEW
- `api/items/create/route.js` ⭐ NEW

**Files: 6 | New: 6 | Time: 2-3 hours**

---

### Phase 3: Ad Studio (1.5-2 hours)

**What to Build:**
```
Ad Studio Page
  │
  ├─ Meta Connection
  │   ├─ "Connect" button (if not connected)
  │   └─ Account info (if connected)
  │
  └─ Campaign Builder (if connected)
      ├─ Post selector (grid)
      ├─ Budget slider (10-1000 credits)
      ├─ Audience targeting
      ├─ Review panel
      └─ Launch button
```

**Key Features:**
- OAuth callback handling
- Token encryption
- Credit deduction
- Campaign history tracking

**Key Files to Create:**
- `ad-studio/page.tsx` ⭐ NEW
- `ad-studio/components/MetaConnectionPanel.tsx` ⭐ NEW
- `ad-studio/components/CampaignBuilder.tsx` ⭐ NEW
- `ad-studio/components/CampaignHistory.tsx` ⭐ NEW
- `lib/store/useMetaStore.ts` ⭐ NEW
- `api/meta/oauth/route.js` ⭐ NEW
- `api/ad-studio/campaign/create/route.js` ⭐ NEW

**Files: 7 | New: 7 | Time: 1.5-2 hours**

---

### Phase 4: Chat & Communities (2-3 hours)

**What to Build:**
```
Messages Page                    Communities Page
  │                                │
  ├─ Conversation list          ├─ Server sidebar
  ├─ Message thread             ├─ Channel list
  ├─ Message input              ├─ Member list
  ├─ Typing indicator           ├─ Text channels ONLY
  └─ Read receipts              └─ Live presence
```

**Socket.IO Events:**
- `message:send` / `message:receive`
- `typing:start` / `typing:stop`
- `presence:join` / `presence:leave`
- `message:read`

**Key Rule:** ⚠️ TEXT CHANNELS ONLY - NO VOICE/STAGE

**Key Files to Create:**
- `messages/page.tsx` (enhance)
- `messages/components/ConversationItem.tsx` ⭐ NEW
- `messages/components/MessageList.tsx` ⭐ NEW
- `messages/components/MessageInput.tsx` ⭐ NEW
- `communities/page.tsx` ⭐ NEW
- `communities/components/ChannelItem.tsx` ⭐ NEW
- `communities/components/LivePresence.tsx` ⭐ NEW
- `lib/store/useChatStore.ts` ⭐ NEW

**Files: 8 | New: 7 | Time: 2-3 hours**

---

### Phase 5: Profile & Settings (1.5-2 hours)

**What to Build:**
```
Profile Page                     Settings Page
  │                                │
  ├─ Profile header             ├─ Account settings
  ├─ Banner/Avatar              ├─ Privacy settings
  ├─ Follow button              ├─ Notifications
  ├─ Posts tab                  ├─ Security
  ├─ Items tab                  ├─ Integrations
  └─ About tab                  └─ Danger zone
```

**Key Files to Create/Update:**
- `profile/[userId]/page.tsx` (enhance)
- `profile/components/ProfileHeader.tsx` ⭐ NEW
- `profile/components/AboutTab.tsx` ⭐ NEW
- `settings/page.tsx` (enhance)
- `settings/components/AccountSettings.tsx` ⭐ NEW
- `settings/components/PrivacySettings.tsx` ⭐ NEW
- `settings/components/NotificationSettings.tsx` ⭐ NEW
- `settings/components/SecuritySettings.tsx` ⭐ NEW

**Files: 8 | New: 6 | Time: 1.5-2 hours**

---

### Phase 6: UI Enhancement (2-4 hours)

**What to Update:**
```
Tailwind Config
  ├─ Add DreamDOT colors
  ├─ Add font families
  └─ Add easing functions

Components Styling
  ├─ Button (pill-shaped primary)
  ├─ Card (glass + luminous border)
  ├─ Input (clean focus state)
  ├─ Badge/Tag (proper colors)
  └─ Modal (entrance animation)

Pages Styling
  ├─ Update backgrounds
  ├─ Update typography
  ├─ Apply color palette
  └─ Add motion animations

Global
  ├─ Add grain texture overlay
  ├─ Update CSS variables
  ├─ Ensure dark/light mode
  └─ AUDIT: Remove all blue/purple/orange
```

**Key Files to Update:**
- `tailwind.config.ts` (update)
- `globals.css` (update)
- `ui/button.tsx` (update)
- `ui/card.tsx` (update)
- `ui/input.tsx` (update)
- `ui/badge.tsx` (update)

**Files: 6 | New: 0 | Time: 2-4 hours**

---

## 🎨 Design System Quick Reference

### Colors (Dark Mode Default)

```
Primary:           #99FF33  (Faded Lime - use sparingly!)
Surface:           #121412  (Deep Void - backgrounds)
Surface Low:       #1A1C1A  (Cards & sidebars)
Surface High:      #242624  (Hover states)
Text Primary:      #FFFFFF  (Headlines)
Text Secondary:    #A1A1A1  (Body text)
Outline:           rgba(255,255,255,0.05)  (Borders)
```

### Typography

```
Headlines:  Noto Serif (Bold) - 24px-72px
Body:       Manrope (Regular) - 16px-18px
Labels:     Manrope (Bold Uppercase) - 11px
```

### Components

```
Primary Button:  Pill-shaped, #99FF33, rounded-full
Cards:          Glass effect, backdrop-blur-2xl, luminous border
Inputs:         Clean, focus: ring-primary/50
Tags:           Rounded full, label style
```

### ⚠️ IMPORTANT

- ❌ NO blue colors anywhere
- ❌ NO purple colors anywhere
- ❌ NO orange colors anywhere
- ✅ Only: Deep Void, Faded Lime, Sage colors
- ✅ Landing/Register/Signin pages UNCHANGED

---

## 📊 Progress Tracking

Track your progress through phases:

```
Phase 1: ☐☐☐☐☐☐☐ (7 tasks)
Phase 2: ☐☐☐☐☐☐☐☐ (8 tasks)
Phase 3: ☐☐☐☐☐☐☐ (7 tasks)
Phase 4: ☐☐☐☐☐☐☐☐☐☐☐ (11 tasks)
Phase 5: ☐☐☐☐☐☐☐☐☐☐☐☐ (12 tasks)
Phase 6: ☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐ (15 tasks)

Total: 60 tasks | ~12-16 hours
```

---

## 🔧 Essential Commands

```bash
# Type checking
npm run type-check

# Build
npm run build

# Dev (all services)
npm run dev:all

# Just web
npm run dev

# Lint
npm run lint

# Test
npm run test
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| TypeScript errors | Clear `.next`, use `@/` imports |
| Styles not applying | Restart dev server, check config |
| Socket.IO failing | Check `NEXT_PUBLIC_CHAT_SERVER_URL` |
| API 404 | Use `route.js` not `.ts`, check path |
| Images not loading | Check ImageKit config |

---

## ✅ Phase Completion Checklist

### Before Moving to Next Phase:

- [ ] All tasks in phase completed
- [ ] TypeScript type-checking passes
- [ ] No console errors
- [ ] All acceptance criteria met
- [ ] Test checklist items verified
- [ ] Dark/light mode working
- [ ] Mobile responsive (375px tested)
- [ ] API endpoints functional

---

## 📚 Documentation Reference

| Document | Purpose |
|----------|---------|
| README.md | Overview & quick start |
| EXECUTION_GUIDE.md | High-level phase guide |
| PHASE_1_PLAN.md | Detailed Phase 1 tasks |
| PHASE_2_PLAN.md | Detailed Phase 2 tasks |
| PHASE_3_PLAN.md | Detailed Phase 3 tasks |
| PHASE_4_PLAN.md | Detailed Phase 4 tasks |
| PHASE_5_PLAN.md | Detailed Phase 5 tasks |
| PHASE_6_PLAN.md | Detailed Phase 6 tasks |
| QUICK_REFERENCE.md | This file |

---

## 🚀 Get Started

1. Read README.md (5 min)
2. Read EXECUTION_GUIDE.md (10 min)
3. Pick a phase to start (PHASE_1_PLAN.md recommended)
4. Follow tasks step-by-step
5. Test thoroughly
6. Move to next phase

**Status:** ✅ Ready to build!

**Start here:** `EXECUTION_GUIDE.md`

