# DreamDOT Implementation - Execution Guide

**Created:** 2026-08-01  
**Status:** Ready for execution  
**Total Phases:** 6

---

## Quick Summary

This guide breaks down the complete DreamDOT application into 6 manageable phases:

| Phase | Focus | Duration | Status |
|-------|-------|----------|--------|
| **1** | Core Pages & Layout | 2-3h | 🟡 Ready |
| **2** | Creator Studio | 2-3h | 🟡 Ready |
| **3** | Ad Studio & Meta | 1.5-2h | 🟡 Ready |
| **4** | Chat & Communities | 2-3h | 🟡 Ready |
| **5** | Profile & Settings | 1.5-2h | 🟡 Ready |
| **6** | UI Enhancement | 2-4h | 🟡 Ready |

**Total:** ~12-16 hours to complete

---

## Phase 1: Core Pages & Layout Infrastructure

### What Gets Built:
✅ Feed page (enhanced from existing)  
✅ Marketplace page (NEW)  
✅ Library page (NEW)  
✅ Wallet page (completed)  
✅ Mobile bottom navigation (NEW)  
✅ Fix app sidebar  

### Key Files:
- `apps/web/src/app/feed/page.tsx`
- `apps/web/src/app/marketplace/page.tsx` (new)
- `apps/web/src/app/library/page.tsx` (new)
- `apps/web/src/app/wallet/page.tsx`
- `components/mobile-nav.tsx` (new)

### API Endpoints Needed:
- `GET /api/posts`
- `GET /api/items`
- `GET /api/library`
- `GET /api/balance`

### Estimated Time: 2-3 hours

---

## Phase 2: Creator Studio (3-Part Workflow)

### What Gets Built:
✅ Create page with 3-part UI  
✅ Writer part (rich text editor)  
✅ Media part (upload/arrange)  
✅ Bundle part (select items)  
✅ Validation system  
✅ Zustand store for state  
✅ Publish API endpoint  

### Key Files:
- `apps/web/src/app/create/page.tsx`
- `apps/web/src/app/create/components/WriterPart.tsx` (new)
- `apps/web/src/app/create/components/MediaPart.tsx` (new)
- `apps/web/src/app/create/components/BundlePart.tsx` (new)
- `apps/web/src/lib/store/useCreatorStudioStore.ts` (new)
- `apps/web/src/app/api/items/create/route.js` (new)

### Key Rules:
⚠️ **MANDATORY FIELDS:** Title, Thumbnail, Script - Publish button disabled until all filled  
⚠️ **Bundle:** Requires 2+ items minimum  
⚠️ **Validation:** Must validate at UI and API level  

### API Endpoints Needed:
- `POST /api/items/create`
- `GET /api/items?userId=[id]`

### Estimated Time: 2-3 hours

---

## Phase 3: Ad Studio & Meta Integration

### What Gets Built:
✅ Ad Studio page  
✅ Meta OAuth connection  
✅ Campaign builder UI  
✅ Campaign history  
✅ Zustand store for Meta state  
✅ Create campaign API endpoint  

### Key Files:
- `apps/web/src/app/ad-studio/page.tsx` (new)
- `apps/web/src/app/ad-studio/components/MetaConnectionPanel.tsx` (new)
- `apps/web/src/app/ad-studio/components/CampaignBuilder.tsx` (new)
- `apps/web/src/app/ad-studio/components/CampaignHistory.tsx` (new)
- `apps/web/src/lib/store/useMetaStore.ts` (new)
- `apps/web/src/app/api/meta/oauth/route.js` (new)
- `apps/web/src/app/api/ad-studio/campaign/create/route.js` (new)

### Key Rules:
⚠️ **Credits Deducted:** Campaign creation deducts credits immediately  
⚠️ **Token Encryption:** Meta tokens must be encrypted before storing  
⚠️ **OAuth Flow:** Must handle redirect and callback properly  

### API Endpoints Needed:
- `GET /api/posts?userId=[id]`
- `POST /api/ad-studio/campaign/create`
- `GET /api/ad-studio/campaigns`
- `PATCH /api/ad-studio/campaigns/[id]`

### Estimated Time: 1.5-2 hours

---

## Phase 4: Chat/Messaging & Communities

### What Gets Built:
✅ Messages page  
✅ Conversation list  
✅ Message thread viewer  
✅ Real-time messaging (Socket.IO)  
✅ Communities/servers page  
✅ Text channels (NO voice channels)  
✅ Live presence indicators  
✅ Zustand store for chat state  

### Key Files:
- `apps/web/src/app/messages/page.tsx`
- `apps/web/src/app/messages/components/ConversationItem.tsx` (new)
- `apps/web/src/app/messages/components/MessageList.tsx` (new)
- `apps/web/src/app/messages/components/MessageInput.tsx` (new)
- `apps/web/src/app/communities/page.tsx` (new)
- `apps/web/src/app/communities/components/ChannelItem.tsx` (new)
- `apps/web/src/app/communities/components/LivePresence.tsx` (new)
- `apps/web/src/lib/store/useChatStore.ts` (new)
- `apps/web/src/lib/socket.ts` (update/enhance)

### Key Rules:
⚠️ **TEXT ONLY:** No voice/stage channels - enforce at schema and UI  
⚠️ **Socket.IO:** Implement all events (message, typing, presence)  
⚠️ **Performance:** Use virtual scrolling for long message lists  

### API Endpoints Needed:
- `GET /api/conversations`
- `GET /api/conversations/[id]/messages`
- `POST /api/conversations/[id]/messages`
- `POST /api/conversations`
- `GET /api/servers`
- `GET /api/servers/[id]/channels`

### Socket.IO Events:
- `message:send`
- `message:receive`
- `typing:start` / `typing:stop`
- `presence:join` / `presence:leave`
- `message:read`

### Estimated Time: 2-3 hours

---

## Phase 5: Profile & Settings

### What Gets Built:
✅ Profile page  
✅ Profile header with edit mode  
✅ About tab  
✅ Settings page  
✅ Account settings  
✅ Privacy settings  
✅ Notification settings  
✅ Security settings  
✅ Integration settings  

### Key Files:
- `apps/web/src/app/profile/[userId]/page.tsx` (update)
- `apps/web/src/app/profile/components/ProfileHeader.tsx` (new/enhance)
- `apps/web/src/app/profile/components/AboutTab.tsx` (new)
- `apps/web/src/app/settings/page.tsx` (enhance)
- `apps/web/src/app/settings/components/AccountSettings.tsx` (new)
- `apps/web/src/app/settings/components/PrivacySettings.tsx` (new)
- `apps/web/src/app/settings/components/NotificationSettings.tsx` (new)
- `apps/web/src/app/settings/components/SecuritySettings.tsx` (new)

### Key Rules:
⚠️ **Privacy:** Enforce privacy settings in API layer  
⚠️ **Password:** Hash and validate password changes  
⚠️ **Deletion:** Require password confirmation for account deletion  

### API Endpoints Needed:
- `GET /api/users/[userId]`
- `PATCH /api/users/me`
- `PATCH /api/users/me/privacy`
- `POST /api/users/me/change-password`
- `DELETE /api/users/me`
- `POST /api/users/[userId]/follow`
- `DELETE /api/users/[userId]/follow`

### Estimated Time: 1.5-2 hours

---

## Phase 6: UI Enhancement & Design System

### What Gets Enhanced:
✅ Tailwind config with DreamDOT colors  
✅ Add grain/noise texture  
✅ Update all components styling  
✅ Apply typography system  
✅ Implement motion animations  
✅ Fix dark/light mode  
✅ Ensure NO blue/purple/orange colors  

### Key Files:
- `apps/web/tailwind.config.ts` (update)
- `apps/web/src/app/globals.css` (update)
- `apps/web/src/components/ui/button.tsx` (update)
- `apps/web/src/components/ui/card.tsx` (update)
- `apps/web/src/components/ui/input.tsx` (update)
- `apps/web/src/components/ui/badge.tsx` (update)

### Design System to Apply:
- **Colors:** Implement `#121412` surface, `#99FF33` primary, etc.
- **Typography:** Noto Serif (headlines) + Manrope (body)
- **Motion:** Ethereal, Snappy, Smooth easing functions
- **Components:** Pill buttons, glass cards, luminous borders
- **Accessibility:** Ensure color contrast ratios ≥ 4.5:1

### Estimated Time: 2-4 hours

---

## Execution Timeline

### Week 1:
- **Days 1-2:** Phase 1 (Core Pages)
- **Days 3-4:** Phase 2 (Creator Studio)
- **Day 5:** Phase 3 (Ad Studio)

### Week 2:
- **Days 1-2:** Phase 4 (Chat & Communities)
- **Days 3-4:** Phase 5 (Profile & Settings)
- **Days 5-6:** Phase 6 (UI Enhancement)

---

## Testing Strategy

### During Implementation:
✅ Test each component as built  
✅ Run TypeScript type checking  
✅ Test API endpoints in Postman  
✅ Check for console errors  

### After Each Phase:
✅ Dark/light mode toggle  
✅ Mobile responsive (375px, 768px, 1024px)  
✅ API error handling  
✅ Loading states  

### Before UI Enhancement:
✅ All functionality working  
✅ No broken links  
✅ All API endpoints responding  

### After UI Enhancement:
✅ Design system fully applied  
✅ NO blue/purple/orange colors  
✅ Accessibility standards met  
✅ Animations smooth at 60fps  

---

## Important Reminders

### 🎨 Design Constraints:
- ❌ NO blue colors anywhere
- ❌ NO purple colors anywhere
- ❌ NO orange colors anywhere
- ✅ Only use: Deep Void (#121412), Faded Lime (#99FF33), Sage colors
- ✅ Landing, register, signin pages UNCHANGED

### 📝 Code Standards:
- ✅ All frontend components: TypeScript (.tsx)
- ✅ All API routes: JavaScript (.js)
- ✅ All backend services: JavaScript (.js) or Python (.py)
- ✅ Use Zustand for state management (NO Context)
- ✅ Use Tailwind CSS for styling (NO CSS-in-JS)

### 🔐 Security:
- ✅ Encrypt Meta tokens before storing
- ✅ Hash passwords
- ✅ Validate all API inputs
- ✅ Use JWT for API authentication
- ✅ Implement CORS properly

### 🚀 Performance:
- ✅ Use virtual scrolling for long lists
- ✅ Implement pagination for feeds
- ✅ Lazy load images
- ✅ Code split React components
- ✅ Cache API responses where appropriate

---

## How to Use This Plan

1. **Read the overview** (this file) - 5 min
2. **Read the phase plan** you're working on - 10 min
3. **Follow the implementation steps** in order - varies
4. **Test as you go** - follow test checklist
5. **Move to next phase** only when current phase complete

---

## Support & Debugging

### If You Get Stuck:
1. Check the detailed phase plan
2. Review the acceptance criteria
3. Run TypeScript type checking (`npm run type-check`)
4. Check for console errors
5. Look at similar existing components
6. Review the PRD and DESIGN documents

### Common Issues:

**Issue:** TypeScript errors on new files
**Solution:** Import from correct paths, use `@/` alias

**Issue:** Styles not applying
**Solution:** Check Tailwind config, clear `.next` folder

**Issue:** API endpoints not working
**Solution:** Check database connection, verify query params

**Issue:** Socket.IO not connecting
**Solution:** Check NEXT_PUBLIC_CHAT_SERVER_URL env var

---

## Next Steps

1. ✅ Review this execution guide
2. ✅ Read Phase 1 detailed plan
3. ✅ Implement Phase 1 tasks
4. ✅ Test Phase 1 thoroughly
5. ✅ Move to Phase 2

**Ready to build?** Start with Phase 1!

