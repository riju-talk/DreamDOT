# Phase 3: Ad Studio & Meta Integration

**Duration:** Estimated 1.5-2 hours  
**Priority:** MEDIUM - Important marketing feature

---

## Overview

Ad Studio allows creators to link Meta accounts and launch paid ad campaigns directly from DreamDOT.

**Flow:**
1. Creator links Instagram/Facebook via OAuth
2. Creator selects a post to promote
3. Creator sets budget (in credits)
4. System deducts credits and creates Meta ad campaign

---

## Task 3.1: Create Ad Studio Main Page
**File:** `apps/web/src/app/ad-studio/page.tsx`

**Structure:**
```
AdStudio
├── MetaConnectionPanel
│   ├── ConnectButton (if not connected)
│   └── DisconnectButton + Account Info (if connected)
├── CampaignBuilder (if connected)
│   ├── PostSelector
│   ├── BudgetSlider
│   ├── AudienceTargeting
│   └── LaunchButton
└── CampaignHistory
    └── CampaignList (table)
```

**Implementation:**
1. Create page component
2. Add Meta connection state
3. Render appropriate UI based on connection status
4. Fetch user's campaigns on load

**Dependencies:**
- useMetaStore (Zustand)
- API endpoints

---

## Task 3.2: Create Meta OAuth Connection
**File:** `apps/web/src/app/api/meta/oauth/route.js`

**Flow:**
1. User clicks "Connect Meta"
2. Redirect to Meta OAuth dialog
3. User approves permissions
4. Callback to `/api/meta/callback`
5. Store encrypted token in Prisma
6. Redirect back to Ad Studio with success

**Implementation:**
1. Generate OAuth URL with correct scopes
2. Create callback handler
3. Exchange code for access token
4. Encrypt token before storing
5. Create session in localStorage

**Scopes Needed:**
- `instagram_basic`
- `instagram_graph_api`
- `pages_read_engagement`
- `pages_manage_metadata`

---

## Task 3.3: Create Campaign Builder Component
**File:** `apps/web/src/app/ad-studio/components/CampaignBuilder.tsx`

**Sub-components:**
1. **PostSelector:**
   - Grid of user's recent posts
   - Select one post
   - Show thumbnail, caption preview

2. **BudgetSlider:**
   - Slider from 10 to 1000 credits
   - Input field for exact amount
   - Show cost in USD equivalent
   - Validate user has sufficient credits

3. **AudienceTargeting:**
   - Location selector (dropdown)
   - Age range (slider)
   - Interests (searchable tags)
   - Demographics

4. **ReviewPanel:**
   - Preview of ad
   - Budget summary
   - Estimated reach
   - Launch button

**Implementation:**
1. Create form component
2. Add validation at each step
3. Create visual preview
4. Add error handling
5. Call API endpoint to launch campaign

**Dependencies:**
- API endpoint: `GET /api/posts?userId=[id]`
- API endpoint: `POST /api/ad-studio/campaign/create`

---

## Task 3.4: Create Ad Campaign API Endpoint
**File:** `apps/web/src/app/api/ad-studio/campaign/create/route.js`

**Endpoint:** `POST /api/ad-studio/campaign/create`

**Input:**
```json
{
  "postId": "string",
  "budgetCredits": "number",
  "targetAudience": {
    "locations": ["string"],
    "ageMin": "number",
    "ageMax": "number",
    "interests": ["string"]
  }
}
```

**Implementation:**
1. Validate user has sufficient credits
2. Validate post exists and belongs to user
3. Deduct credits from user balance
4. Call apps/meta service to create Meta ad
5. Store campaign in Prisma (AdCampaign model)
6. Record transaction (ad_spend)
7. Return campaign ID

**Response:**
```json
{
  "success": true,
  "campaignId": "string",
  "metaAdId": "string",
  "message": "Campaign launched successfully"
}
```

---

## Task 3.5: Create Campaign History Component
**File:** `apps/web/src/app/ad-studio/components/CampaignHistory.tsx`

**Features:**
- Table view of campaigns
- Columns: Post, Budget, Status, Spend, ROI, Actions
- Filter by status (pending, active, paused, completed)
- Pause/resume campaign
- Delete campaign
- Show campaign details modal

**Implementation:**
1. Create table component
2. Fetch campaigns from API
3. Add real-time status updates (Socket.IO)
4. Add action buttons
5. Create detail modal

**Dependencies:**
- API endpoint: `GET /api/ad-studio/campaigns`
- API endpoint: `PATCH /api/ad-studio/campaigns/[id]`
- API endpoint: `DELETE /api/ad-studio/campaigns/[id]`

---

## Task 3.6: Create Zustand Store for Meta
**File:** `apps/web/src/lib/store/useMetaStore.ts`

**State:**
```typescript
interface MetaState {
  isConnected: boolean
  platform: 'instagram' | 'facebook' | null
  accountInfo: {
    id: string
    name: string
    email: string
    avatar?: string
  } | null
  campaigns: AdCampaign[]
  isLoading: boolean
  error: string | null
  
  setConnected: (isConnected, platform) => void
  setAccountInfo: (info) => void
  setCampaigns: (campaigns) => void
  setError: (error) => void
}
```

**Implementation:**
1. Create store with persist middleware
2. Add persistence to localStorage
3. Implement getters for derived state
4. Add error handling

---

## Task 3.7: Create Meta Connection Panel
**File:** `apps/web/src/app/ad-studio/components/MetaConnectionPanel.tsx`

**States:**
1. **Not Connected:**
   - Show "Connect Instagram/Facebook" button
   - Explain what permissions are needed
   - Show benefits

2. **Connected:**
   - Show account info (name, avatar, email)
   - Show page name
   - Show "Disconnect" button
   - Show last sync time

**Implementation:**
1. Create conditional rendering based on connection state
2. Add OAuth button with redirect
3. Add disconnect handler
4. Show account info from Meta store

---

## Acceptance Criteria

✅ Meta OAuth flow working  
✅ Campaign creation working  
✅ Credits deducted correctly  
✅ Campaigns stored in database  
✅ Campaign history displays correctly  
✅ Can pause/resume campaigns  
✅ Error handling for insufficient credits  
✅ No console errors  

---

## Testing Checklist

- [ ] Connect to Meta successfully
- [ ] Disconnect from Meta
- [ ] Create campaign with valid data
- [ ] Try to create campaign with insufficient credits (should fail)
- [ ] Try to create campaign without selecting post (should fail)
- [ ] Verify credits deducted after campaign creation
- [ ] Verify campaign appears in history
- [ ] Pause campaign
- [ ] Resume campaign
- [ ] Delete campaign
- [ ] Verify token encryption/decryption

