# Phase 5: Profile & Settings

**Duration:** Estimated 1.5-2 hours  
**Priority:** MEDIUM - Important for user experience

---

## Overview

Phase 5 implements user profiles, settings, and account management.

---

## Task 5.1: Create Profile Page
**File:** `apps/web/src/app/profile/[userId]/page.tsx`

**Layout:**
```
ProfilePage
├── ProfileHeader
│   ├── BannerImage
│   ├── AvatarCircle
│   ├── DisplayName
│   ├── Bio
│   ├── Stats (followers, following, items)
│   ├── FollowButton (if not own profile)
│   └── MessageButton (if not own profile)
├── TabNavigation (Posts | Items | About)
└── ContentArea (based on selected tab)
    ├── PostsList (if Posts tab)
    ├── ItemsGrid (if Items tab)
    └── AboutPanel (if About tab)
```

**Implementation:**
1. Create page component with dynamic routing
2. Fetch user data from API
3. Check if viewing own profile
4. Show appropriate action buttons
5. Display user content (posts, items)

**Dependencies:**
- API endpoint: `GET /api/users/[userId]`
- API endpoint: `GET /api/users/[userId]/posts`
- API endpoint: `GET /api/users/[userId]/items`

---

## Task 5.2: Create Profile Header Component
**File:** `apps/web/src/app/profile/components/ProfileHeader.tsx`

**Features:**
- Banner image (editable if own profile)
- Avatar (editable if own profile)
- Display name (clickable link)
- Bio with markdown support
- Social links (Twitter, GitHub, etc.)
- Follower/Following counts (clickable)
- Verified badge if applicable
- Follow/Unfollow button
- Message button
- More options menu

**Implementation:**
1. Create header component
2. Display user info
3. Add edit mode for own profile
4. Handle follow/unfollow
5. Handle avatar upload

**Dependencies:**
- API endpoint: `PATCH /api/users/[userId]` (for edits)
- API endpoint: `POST /api/users/[userId]/follow`
- API endpoint: `DELETE /api/users/[userId]/follow`

---

## Task 5.3: Create About Tab Component
**File:** `apps/web/src/app/profile/components/AboutTab.tsx`

**Information Displayed:**
- Full bio/description
- Member since date
- Location
- Website link
- Social links
- Verification status
- Creator stats (if applicable)

**Implementation:**
1. Create tab component
2. Format and display user info
3. Add link previews
4. Show verification badges

---

## Task 5.4: Create Follower/Following Modal
**File:** `apps/web/src/app/profile/components/FollowerModal.tsx`

**Features:**
- Show list of followers or following
- Avatar, name, bio
- Follow/Unfollow button for each
- Search capability
- Infinite scroll

**Implementation:**
1. Create modal component
2. Fetch followers/following list
3. Add search filter
4. Handle follow/unfollow actions

---

## Task 5.5: Create Settings Page
**File:** `apps/web/src/app/settings/page.tsx`

**Layout:**
```
SettingsPage
├── SettingsSidebar (desktop)
│   ├── Account
│   ├── Privacy
│   ├── Notifications
│   ├── Billing
│   ├── Security
│   └── Integrations
└── SettingsContent
    └── Content based on selected setting
```

**Implementation:**
1. Create page with settings navigation
2. Implement each settings section
3. Add save handlers
4. Show confirmation toasts

---

## Task 5.6: Create Account Settings Component
**File:** `apps/web/src/app/settings/components/AccountSettings.tsx`

**Features:**
- Display Name (editable)
- Email (editable, with verification)
- Username (editable)
- Bio (editable)
- Avatar upload
- Banner upload
- Country selector
- Website link
- Social links (Twitter, GitHub, LinkedIn, Instagram, Facebook)

**Implementation:**
1. Create form with input fields
2. Add image upload handlers
3. Add validation
4. Handle save and errors
5. Show success message

**Dependencies:**
- API endpoint: `PATCH /api/users/me`
- ImageKit for uploads

---

## Task 5.7: Create Privacy Settings Component
**File:** `apps/web/src/app/settings/components/PrivacySettings.tsx`

**Features:**
- Profile visibility (public/private)
- Allow DMs from strangers (toggle)
- Show online status (toggle)
- Show activity status (toggle)
- Blocked users list
- Block/Unblock users

**Implementation:**
1. Create toggle switches
2. Implement privacy preferences
3. Manage blocked users list
4. Save settings to API

**Dependencies:**
- API endpoint: `PATCH /api/users/me/privacy`
- API endpoint: `GET /api/users/me/blocked`
- API endpoint: `POST /api/users/[userId]/block`

---

## Task 5.8: Create Notification Settings Component
**File:** `apps/web/src/app/settings/components/NotificationSettings.tsx`

**Features:**
- Email notifications (toggles for different events)
- Push notifications (if implemented)
- Notification frequency (real-time, daily digest, weekly)
- Quiet hours (do not disturb)
- Specific notification types:
  - New followers
  - Item purchases
  - Comments
  - Messages
  - Live streams

**Implementation:**
1. Create toggle switches
2. Implement frequency selector
3. Add quiet hours schedule
4. Save preferences

**Dependencies:**
- API endpoint: `PATCH /api/users/me/notifications`

---

## Task 5.9: Create Security Settings Component
**File:** `apps/web/src/app/settings/components/SecuritySettings.tsx`

**Features:**
- Change password
- Two-factor authentication (future)
- Active sessions management
- Login history
- Connected devices
- Account recovery options

**Implementation:**
1. Create password change form
2. Show active sessions
3. Allow logout from other devices
4. Show login history

**Dependencies:**
- API endpoint: `POST /api/users/me/change-password`
- API endpoint: `GET /api/users/me/sessions`
- API endpoint: `DELETE /api/users/me/sessions/[sessionId]`

---

## Task 5.10: Create Integrations Settings Component
**File:** `apps/web/src/app/settings/components/IntegrationSettings.tsx`

**Features:**
- Connected Meta accounts
- Connected Web3 wallets
- API keys (for developers)
- Webhook configurations

**Implementation:**
1. Show connected services
2. Allow disconnect
3. Add new integrations
4. Manage API keys

---

## Task 5.11: Create Danger Zone Component
**File:** `apps/web/src/app/settings/components/DangerZone.tsx`

**Features:**
- Delete account button
- Requires password confirmation
- Shows warning message
- Confirms with modal

**Implementation:**
1. Create delete account form
2. Add confirmation modal
3. Handle account deletion
4. Redirect to landing page after deletion

**Dependencies:**
- API endpoint: `DELETE /api/users/me`

---

## Task 5.12: Create Profile Edit Modal
**File:** `apps/web/src/app/profile/components/ProfileEditModal.tsx`

**Features:**
- Edit display name
- Edit bio
- Edit avatar
- Edit banner
- Edit social links
- Save button with validation

**Implementation:**
1. Create modal with form
2. Show image preview
3. Add validation
4. Handle uploads and save

---

## Acceptance Criteria

✅ Profile page displays correct user info  
✅ Can follow/unfollow users  
✅ Settings page functional  
✅ All settings save correctly  
✅ Privacy settings enforced  
✅ Password change working  
✅ Account deletion working (with confirmation)  
✅ No console errors  

---

## Testing Checklist

- [ ] View own profile
- [ ] View another user's profile
- [ ] Edit own profile information
- [ ] Upload new avatar
- [ ] Upload new banner
- [ ] Follow/Unfollow user
- [ ] View followers/following list
- [ ] Change password
- [ ] Change privacy settings
- [ ] Change notification preferences
- [ ] Connect Meta account
- [ ] Disconnect Meta account
- [ ] Delete account (test with alt account)
- [ ] Verify redirects to landing page after account deletion

