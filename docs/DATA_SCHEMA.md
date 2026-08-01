Here is the **definitive, exhaustive, and fully detailed Data Schema & State Model** for DreamDOT. This document leaves nothing out. It incorporates every feature from the Super Saiyan PRD, including the Creator Studio 3-part workflow, DRM Vault, Meta Broadcasting, Web3 Blockchain Ledger, and Text-Only Community Servers.

---

# 🗄️ DreamDOT — Master Data Schema & State Model

| | |
|---|---|
| **Document version** | 3.0 (Complete & Exhaustive) |
| **Status** | Locked — Single Source of Truth for all databases and state |
| **Last updated** | 2026-08-01 |
| **Owner** | Rijusmit |
| **Repository** | `C:\Code\01_full_stack\DreamDot` |

---

## 1. Database Schema

### 1.1 PostgreSQL (Prisma) — Relational Data, Social Graph, Meta, & Communities
> **Location**: `apps/web/prisma/schema.prisma` (Managed via 5 distinct Prisma clients: `prismaUser`, `prismaSocial`, `prismaItem`, `prismaCommunity`, `prismaAudit`, `prismaMeta`).

```prisma
// ============================================
// 1. USER & AUTH DOMAIN (prismaUser)
// ============================================
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  username        String    @unique
  passwordHash    String
  displayName     String?
  bio             String?   @db.Text
  dateOfBirth     DateTime?
  country         String?
  website         String?
  socialLinks     Json?     // { twitter?, github?, discord?, linkedin?, instagram?, facebook? }
  avatarUrl       String?
  bannerUrl       String?
  credits         Int       @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  followers       Follow[]          @relation("following")
  following       Follow[]          @relation("follower")
  blockedBy       Block[]           @relation("blocked")
  blocking        Block[]           @relation("blocker")
  posts           Post[]
  items           Item[]
  transactions    Transaction[]
  conversations   ConversationParticipant[]
  metaIntegrations MetaIntegration[]
  adCampaigns     AdCampaign[]
  createdGroups   Group[]           @relation("GroupCreator")
  groupMemberships GroupMember[]
  subscriptions   UserSubscription[]
}

model Follow {
  id              String   @id @default(cuid())
  followerId      String
  followingId     String
  createdAt       DateTime @default(now())

  follower        User     @relation("following", fields: [followerId], references: [id], onDelete: Cascade)
  following       User     @relation("follower", fields: [followingId], references: [id], onDelete: Cascade)

  @@unique([followerId, followingId])
  @@index([followingId])
  @@index([followerId])
}

model Block {
  id              String   @id @default(cuid())
  blockerId       String
  blockedId       String
  createdAt       DateTime @default(now())

  blocker         User     @relation("blocker", fields: [blockerId], references: [id], onDelete: Cascade)
  blocked         User     @relation("blocked", fields: [blockedId], references: [id], onDelete: Cascade)

  @@unique([blockerId, blockedId])
}

// ============================================
// 2. POSTS & SOCIAL DOMAIN (prismaSocial)
// ============================================
model Post {
  id              String    @id @default(cuid())
  userId          String
  content         String    @db.Text
  visibility      Boolean   @default(true)
  sqlId           String?   @unique // Links to MongoDB Post._id
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  likes           Like[]
  comments        Comment[]
  media           PostMedia[]

  @@index([userId])
  @@index([createdAt(sort: Desc)])
}

model Like {
  id        String   @id @default(cuid())
  userId    String
  postId    String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([userId, postId])
}

model Comment {
  id        String   @id @default(cuid())
  userId    String
  postId    String
  text      String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@index([postId])
  @@index([userId])
}

model PostMedia {
  id        String   @id @default(cuid())
  postId    String
  type      String   // image | video | audio | file
  url       String
  alt       String?
  createdAt DateTime @default(now())

  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
}

// ============================================
// 3. MARKETPLACE & ITEMS DOMAIN (prismaItem)
// ============================================
model Item {
  id              String    @id @default(cuid())
  userId          String
  title           String
  description     String?   @db.Text
  category        String    // writing | illustration | audio | video | research | template | code | bundle | other
  pricingModel    String    @default("free") // free | paid | subscription | bundle
  priceCredits    Int       @default(0)
  visibility      String    @default("private") // private | unlisted | public
  sqlId           String?   @unique // Links to MongoDB Item._id
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  media           ItemMedia[]
  tags            ItemTag[]

  @@index([userId])
  @@index([category])
  @@index([visibility])
  @@index([createdAt(sort: Desc)])
}

model ItemMedia {
  id        String   @id @default(cuid())
  itemId    String
  url       String
  mimeType  String
  size      Int?
  width     Int?
  height    Int?
  createdAt DateTime @default(now())

  item      Item     @relation(fields: [itemId], references: [id], onDelete: Cascade)
}

model ItemTag {
  id        String   @id @default(cuid())
  itemId    String
  tag       String
  createdAt DateTime @default(now())

  item      Item     @relation(fields: [itemId], references: [id], onDelete: Cascade)

  @@unique([itemId, tag])
  @@index([tag])
}

// ============================================
// 4. COMMUNITY & CHAT METADATA (prismaCommunity)
// ============================================
model Conversation {
  id              String    @id @default(cuid())
  type            String    @default("direct") // direct | group
  name            String?
  description     String?
  avatar          String?
  createdById     String
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  creator         User      @relation(fields: [createdById], references: [id])
  participants    ConversationParticipant[]
  messages        Message[] // Note: Actual messages live in Mongo, this is for Prisma relational mapping if needed

  @@index([createdById])
}

model ConversationParticipant {
  id              String    @id @default(cuid())
  conversationId  String
  userId          String
  role            String    @default("member") // member | admin
  joinedAt        DateTime  @default(now())

  conversation    Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([conversationId, userId])
}

// Reddit-Style Groups
model Group {
  id          String   @id @default(cuid())
  name        String   @unique // e.g., "r/WebcomicCreators"
  title       String
  description String?  @db.Text
  creatorId   String
  createdAt   DateTime @default(now())

  creator     User     @relation("GroupCreator", fields: [creatorId], references: [id], onDelete: Cascade)
  members     GroupMember[]
  threads     GroupThread[]
}

model GroupMember {
  id        String   @id @default(cuid())
  groupId   String
  userId    String
  role      String   @default("member") // member | mod | admin
  joinedAt  DateTime @default(now())

  group     Group    @relation(fields: [groupId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([groupId, userId])
}

model GroupThread {
  id        String   @id @default(cuid())
  groupId   String
  authorId  String
  title     String
  content   String   @db.Text
  upvotes   Int      @default(0)
  createdAt DateTime @default(now())

  group     Group    @relation(fields: [groupId], references: [id], onDelete: Cascade)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}

// ============================================
// 5. META INTEGRATION & AD STUDIO (prismaMeta)
// ============================================
model MetaIntegration {
  id            String   @id @default(cuid())
  userId        String   @unique
  platform      String   // 'instagram' | 'facebook'
  accessToken   String   @db.Text // Encrypted
  refreshToken  String?  @db.Text // Encrypted
  pageId        String?
  adAccountId   String?
  expiresAt     DateTime
  createdAt     DateTime @default(now())

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model AdCampaign {
  id            String   @id @default(cuid())
  userId        String
  metaAdId      String?  @unique // ID returned from Meta Marketing API
  sourcePostId  String   // The DreamDOT post/item being promoted
  budgetCredits Int      // Credits allocated to this campaign
  status        String   @default("pending") // pending | active | paused | completed | failed
  createdAt     DateTime @default(now())

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ============================================
// 6. MONETIZATION & AUDIT (prismaAudit)
// ============================================
model SubscriptionTier {
  id            String   @id @default(cuid())
  creatorId     String
  name          String   // e.g., "Gold Tier"
  priceCredits  Int      // Monthly cost in credits
  createdAt     DateTime @default(now())

  creator       User     @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  subscribers   UserSubscription[]
}

model UserSubscription {
  id            String   @id @default(cuid())
  fanId         String
  tierId        String
  status        String   @default("active") // active | grace_period | cancelled
  nextBilling   DateTime

  fan           User           @relation(fields: [fanId], references: [id], onDelete: Cascade)
  tier          SubscriptionTier @relation(fields: [tierId], references: [id], onDelete: Cascade)

  @@unique([fanId, tierId])
}

model Transaction {
  id                    String    @id @default(cuid())
  userId                String
  sessionId             String?   @unique // Stripe Session ID
  stripePaymentIntentId String?
  amount                Float
  type                  String    // replenish | redemption | purchase | ad_spend
  status                String    @default("pending") // pending | completed | failed | expired
  metadata              Json?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([sessionId])
  @@index([status])
}
```

---

### 1.2 MongoDB (Mongoose) — Content Bodies, Chat, Web3, & DRM
> **Location**: `apps/database-mongo/src/models/*.ts` (Canonical source of truth, compiled and shared via `@repo/database-mongo`).

```javascript
// ============================================
// 1. USER (Mirrors Prisma for fast cross-service lookups)
// ============================================
const UserSchema = new Schema({
  _id: { type: String, required: true }, // Matches NextAuth JWT sub (String, NOT ObjectId)
  email: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String },
  credits: { type: Number, default: 0 },
}, { timestamps: true });

// ============================================
// 2. POST (Content Body)
// ============================================
const PostSchema = new Schema({
  userId: { type: String, required: true, index: true },
  sqlId: { type: String, required: true, unique: true, index: true }, // Links to Prisma Post.id
  content: { type: String, required: true },
  media: [{
    type: { type: String, enum: ['image', 'video', 'audio', 'file'] },
    url: { type: String, required: true },
    alt: { type: String }
  }],
  visibility: { type: Boolean, default: true },
  likes: [{ type: String }], // Array of user _ids
  comments: [{
    userId: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: { createdAt: true, updatedAt: false } });

// ============================================
// 3. ITEM / MARKETPLACE (Enforces Creator Studio Rules)
// ============================================
const ItemSchema = new Schema({
  userId: { type: String, required: true, index: true },
  sqlId: { type: String, required: true, unique: true, index: true }, // Links to Prisma Item.id
  
  // MANDATORY CREATOR STUDIO FIELDS
  title: { type: String, required: true, trim: true, maxlength: 140 },
  thumbnailUrl: { type: String, required: true }, 
  script: { type: String, required: true }, // Core text body/script
  
  category: { type: String, enum: ['writing', 'illustration', 'audio', 'video', 'research', 'template', 'code', 'bundle', 'other'], default: 'other', index: true },
  pricingModel: { type: String, enum: ['free', 'paid', 'subscription', 'bundle'], default: 'free' },
  priceCredits: { type: Number, default: 0 },
  
  // Bundle Specifics
  bundleItems: [{ type: String, ref: 'Item' }], // Array of Item.sqlId strings
  
  visibility: { type: String, enum: ['private', 'unlisted', 'public'], default: 'private', index: true },
  
  // DRM & WEB3
  blockchainTokenId: { type: String, sparse: true, index: true },
  chainId: { type: Number },
  drmEnabled: { type: Boolean, default: true },
  drmConfig: {
    watermarkOpacity: { type: Number, default: 0.15 },
    disableRightClick: { type: Boolean, default: true },
    disableTextSelect: { type: Boolean, default: true }
  },
  
  media: [{
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number },
    width: { type: Number },
    height: { type: Number },
    emeKeyId: { type: String }, // For HTML5 EME Video DRM
    emeLicenseServerUrl: { type: String }
  }],
  tags: [{ type: String, trim: true }],
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

ItemSchema.index({ createdAt: -1 });

// ============================================
// 4. CHAT: CONVERSATION & MESSAGE
// ============================================
const ConversationSchema = new Schema({
  type: { type: String, enum: ['direct', 'group'], required: true, default: 'direct' },
  participants: [{ type: String, required: true }], // Array of user _ids
  admins: [{ type: String, required: true }],
  name: { type: String, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 500 },
  avatar: { type: String, trim: true },
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  lastMessageAt: { type: Date, default: Date.now },
  unreadBy: [{ type: String }], // Array of user _ids
  createdBy: { type: String, required: true },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

ConversationSchema.virtual('participantCount').get(function() { return this.participants.length; });
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

const MessageSchema = new Schema({
  conversationId: { type: String, required: true, index: true },
  senderId: { type: String, required: true, index: true },
  content: { type: String, trim: true, maxlength: 4000 },
  
  // E2E Encryption Contract (Optional)
  ciphertext: { type: String },
  nonce: { type: String },
  keyId: { type: String },
  
  type: { type: String, enum: ['text', 'image', 'file', 'audio', 'video', 'system'], default: 'text' },
  attachments: [{
    url: { type: String, required: true },
    type: { type: String, required: true },
    name: { type: String },
    size: { type: Number }
  }],
  readBy: [{ type: String }],
  editedAt: { type: Date },
  isDeleted: { type: Boolean, default: false },
  replyTo: { type: String }, // Message._id
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

MessageSchema.virtual('isRead').get(function() { return this.readBy.length > 0; });
MessageSchema.index({ conversationId: 1, timestamp: -1 });
MessageSchema.index({ senderId: 1, timestamp: -1 });

// ============================================
// 5. COMMUNITY: SERVERS & TEXT-ONLY CHANNELS (Discord-Style)
// ============================================
const ServerSchema = new Schema({
  name: { type: String, required: true, trim: true },
  ownerId: { type: String, required: true, index: true },
  iconUrl: { type: String },
  members: [{
    userId: { type: String, required: true },
    role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  channels: [{
    id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    // STRICTLY TEXT. No 'voice' or 'stage' enum values allowed.
    type: { type: String, enum: ['text'], default: 'text' }, 
    topic: { type: String, maxlength: 255 },
    position: { type: Number, default: 0 }
  }]
}, { timestamps: true });

// ============================================
// 6. WEB3: BLOCKCHAIN IMMUTABLE LEDGER
// ============================================
const BlockchainLedgerSchema = new Schema({
  txHash: { type: String, required: true, unique: true, index: true },
  chainId: { type: Number, required: true },
  blockNumber: { type: Number },
  eventType: { type: String, enum: ['mint_item', 'credit_transfer', 'purchase', 'ad_spend', 'royalty_payout'], required: true },
  fromAddress: { type: String },
  toAddress: { type: String },
  creditsAmount: { type: Number },
  metadata: { type: Schema.Types.Mixed }, // e.g., { itemId: 'sqlId_123', tier: 'Gold' }
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: false }); // Immutable, no updatedAt

// ============================================
// 7. TRANSACTIONS (Mirrors Prisma for fast payment service lookups)
// ============================================
const TransactionSchema = new Schema({
  userId: { type: String, required: true, index: true },
  sessionId: { type: String, sparse: true, index: true },
  stripePaymentIntentId: { type: String },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['replenish', 'redemption', 'purchase', 'ad_spend'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'expired'], default: 'pending', index: true },
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });
```

---

## 2. TypeScript Interfaces

### 2.1 Shared Mongo Types (`@repo/database-mongo`)
```typescript
export interface IItem {
  _id: string; // ObjectId stringified
  userId: string;
  sqlId: string;
  title: string;
  thumbnailUrl: string;
  script: string;
  category: 'writing' | 'illustration' | 'audio' | 'video' | 'research' | 'template' | 'code' | 'bundle' | 'other';
  pricingModel: 'free' | 'paid' | 'subscription' | 'bundle';
  priceCredits: number;
  bundleItems?: string[];
  visibility: 'private' | 'unlisted' | 'public';
  blockchainTokenId?: string;
  chainId?: number;
  drmEnabled: boolean;
  drmConfig: {
    watermarkOpacity: number;
    disableRightClick: boolean;
    disableTextSelect: boolean;
  };
  media: Array<{
    url: string;
    mimeType: string;
    size?: number;
    width?: number;
    height?: number;
    emeKeyId?: string;
    emeLicenseServerUrl?: string;
  }>;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IServer {
  _id: string;
  name: string;
  ownerId: string;
  iconUrl?: string;
  members: Array<{ userId: string; role: 'owner' | 'admin' | 'member'; joinedAt: Date }>;
  channels: Array<{
    id: string;
    name: string;
    type: 'text'; // STRICTLY ENFORCED
    topic?: string;
    position: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlockchainLedger {
  txHash: string;
  chainId: number;
  blockNumber?: number;
  eventType: 'mint_item' | 'credit_transfer' | 'purchase' | 'ad_spend' | 'royalty_payout';
  fromAddress?: string;
  toAddress?: string;
  creditsAmount?: number;
  metadata: Record<string, unknown>;
  timestamp: Date;
}
```

### 2.2 Web App Types (`apps/web/src/lib/types/`)
```typescript
// apps/web/src/lib/types/store.ts (Zustand State Shapes)
export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
}

export interface WalletState {
  balance: number;
  redeemable: number;
  isConnecting: boolean;
  web3Address: string | null;
  setBalance: (balance: number) => void;
  connectWeb3: () => Promise<void>;
}

export interface CreatorStudioState {
  step: 'writer' | 'media' | 'bundle';
  draft: {
    title: string;
    thumbnailUrl: string;
    script: string;
    category: string;
    pricingModel: 'free' | 'paid' | 'subscription' | 'bundle';
    priceCredits: number;
    mediaFiles: File[];
    bundleItemIds: string[];
  };
  setStep: (step: 'writer' | 'media' | 'bundle') => void;
  updateDraft: (data: Partial<CreatorStudioState['draft']>) => void;
  resetDraft: () => void;
}

// apps/web/src/lib/types/meta.ts
export interface AdCampaign {
  id: string;
  userId: string;
  metaAdId?: string;
  sourcePostId: string;
  budgetCredits: number;
  status: 'pending' | 'active' | 'paused' | 'completed' | 'failed';
  createdAt: string;
}
```

---

## 3. State Management Architecture

| Scope | Mechanism | Details & Location |
|---|---|---|
| **Global Auth** | NextAuth `SessionProvider` + Zustand | Server-side session via NextAuth. Client-side syncs to `useAuthStore` (`apps/web/src/lib/store/useAuthStore.ts`) for instant, re-render-safe access. |
| **Wallet & Web3** | Wagmi + Zustand | Wagmi handles chain/wallet connection. `useWalletStore` tracks app-specific derived state: `balance`, `isConnecting`, `web3Address`, `pendingTxHash`. |
| **Chat & Presence** | Zustand (`useChatStore`) | Manages `conversations`, `activeConversationId`, `messages` map, `typingUsers`, `unreadCounts`, and `onlineUsers`. Optimized with Zustand selectors to prevent full chat UI re-renders on every new message. |
| **Creator Studio** | Zustand (`useCreatorStudioStore`) | Persists the 3-part draft state (`writer`, `media`, `bundle`) across tab switches or accidental refreshes using `zustand/middleware` (persist to `sessionStorage`). |
| **Server State** | Next.js Server Actions + `fetch` | `apps/web/src/app/actions.ts`. No React Query/SWR. Direct fetch to `/api/*`, `/api/web3/*`, `/api/meta/*`. |
| **Local UI State** | `useState` / `useReducer` | Component-scoped state: modals, local form validation, search debounce, DRM viewer zoom/pan controls. |

---

## 4. Critical Data Flows

### 4.1 Creator Studio (3-Part Workflow) Flow
```text
┌──────────────┐    ┌──────────────────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client     │    │  Zustand Store           │    │ PostgreSQL  │    │   MongoDB   │
│  (UI Tabs)   │───▶│ useCreatorStudioStore    │───▶│  (Prisma)   │    │ (Mongoose)  │
│  Writer/Media│    │ (Persists Draft)         │    │  Item meta  │    │  Item body  │
│  Bundle      │    └──────────────────────────┘    └──────┬──────┘    └──────┬──────┘
└──────────────┘                                           │                │
                                                           ▼                ▼
                                                    ┌──────────────────────────────┐
                                                    │  VALIDATION GATE:            │
                                                    │  if (!title || !thumbnailUrl │
                                                    │   || !script) THROW ERROR    │
                                                    │                              │
                                                    │  1. Prisma: create Item      │
                                                    │  2. Mongoose: create Item    │
                                                    │     (with drmConfig,         │
                                                    │      pricingModel, etc.)     │
                                                    └──────────────────────────────┘
```

### 4.2 DRM "Vault" Viewer Flow
```text
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  Library    │     │  Next.js API     │     │   MongoDB           │
│  Dashboard  │────▶│  /api/vault/token│────▶│  (Item + DRM Config)│
└──────┬──────┘     └────────┬─────────┘     └─────────────────────┘
       │                     │
       │ 1. User clicks Item │ 2. Validates ownership/subscription
       │    in Library       │ 3. Generates short-lived JWT + Watermark Payload
       ▼                     ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         The Vault Viewer (Client)                            │
│  <div class="vault-container" oncontextmenu="return false;">                 │
│     <canvas id="watermark-layer" /> // Renders "UserID: 123 | Time: 14:02"  │
│     <iframe src="/vault/render/[itemId]?token=[jwt]" sandbox="..." />       │
│  </div>                                                                      │
│                                                                              │
│  JS Listeners:                                                               │
│  - window.addEventListener('keydown', blockPrintScreen)                      │
│  - document.addEventListener('selectstart', e => e.preventDefault())         │
│  - DevTools detection (blur screen if debugger opens)                        │
│  - HTML5 EME initialization for video streams                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Meta Broadcasting & Ad Studio Flow
```text
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  Ad Studio  │     │  apps/meta       │     │  Meta Marketing API │
│  Dashboard  │────▶│  (Express JS)    │────▶│  (Facebook Graph)   │
└──────┬──────┘     └────────┬─────────┘     └─────────────────────┘
       │                     │
       │ 1. Select Post      │ 2. Validates User Credits (via Payment Service)
       │ 2. Set Budget       │ 3. Deducts Credits (Mongo: Transaction 'ad_spend')
       │ 3. Target Audience  │ 4. Creates Campaign via Meta API
       ▼                     ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  5. Saves AdCampaign to Postgres (prismaMeta) with metaAdId & status         │
│  6. Records 'ad_spend' event in MongoDB BlockchainLedger (immutable audit)   │
│  7. Returns Campaign Status to Dashboard via WebSocket/Zustand update        │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Cross-Reference: API Endpoint → Data Models

| Endpoint / Action | Primary Models (DB) | Secondary Models (DB) |
|---|---|---|
| `GET /feed` (Server Action) | `Post` (SQL+Mongo), `Item` (SQL+Mongo) | `User` (author), `Like`, `Comment` |
| `POST /api/Items/create` | `Item` (Prisma + Mongoose) | `ItemMedia` (Mongo), `ItemTag` (Prisma), `User` |
| `POST /api/vault/token` | `Item` (Mongo), `UserSubscription` (Prisma) | `Transaction` (to verify purchase) |
| `POST /api/meta/broadcast` | `MetaIntegration` (Prisma), `AdCampaign` (Prisma) | `User` (credits), `Transaction` (Mongo) |
| `POST /api/web3/mint` | `Item` (Mongo), `BlockchainLedger` (Mongo) | `User` (web3Address) |
| `GET/POST /api/v1/conversations` | `Conversation`, `Message` (Mongo) | `User` (participants) |
| `Socket message:send` | `Message`, `Conversation` (Mongo) | `User` (sender) |
| `POST /webhook/stripe` | `Transaction` (Mongo), `User` (Mongo) | — |
| `GET /api/balance/get` | `User` (Mongo: credits) | `Transaction` (Mongo) |
| `POST /api/groups/:id/threads` | `GroupThread` (Prisma), `GroupMember` (Prisma) | `User` (author) |

---

## 6. Schema Evolution & Strict Rules (The Iron Laws)

1. **Mongo Models are Canonical**: Defined in `apps/database-mongo/src/models/*.ts`, compiled to `@repo/database-mongo`, and consumed by chat, payment, web3, meta, and web. Never define a conflicting schema elsewhere.
2. **String `_id` Everywhere**: Never use native MongoDB `ObjectId` in application logic. All cross-service IDs (user IDs, conversation IDs) are **Strings** to align perfectly with NextAuth JWT `sub` claims.
3. **Dual-Write Synchronization**: For `Post` and `Item`, SQL metadata + Mongo content **must** stay in sync. The `sqlId` (Prisma) ↔ `_id` (Mongo) link is the absolute source of truth for merging. Use Prisma `$transaction` where possible, or compensating transactions.
4. **Text-Only Channel Enforcement**: The `Channel.type` enum in MongoDB is strictly `['text']`. Any attempt to create a 'voice' or 'stage' channel must be rejected at the API and UI levels.
5. **Creator Studio Mandatory Fields**: The `Item` schema enforces `title`, `thumbnailUrl`, and `script` as `required: true`. The API will reject any payload missing these, regardless of the `category`.
6. **Virtual Fields**: `Conversation.participantCount` and `Message.isRead` are Mongoose virtuals. They are computed on read, not persisted to the database.
7. **Immutable Ledger**: The `BlockchainLedger` collection has `timestamps: false`. Once a record is written, it is never updated. It is append-only.

---

## 7. References

- **Mongo Models**: `apps/database-mongo/src/models/*.ts`
- **Prisma Schema**: `apps/web/prisma/schema.prisma`
- **Feed Merge Logic**: `apps/web/src/lib/feed-logic/feed.ts`
- **Zustand Stores**: `apps/web/src/lib/store/*.ts`
- **Chat Context**: `apps/web/src/lib/chat-context.tsx`
- **Payment Routes**: `apps/payment/src/routes/payment.js`, `webhook.js`
- **Meta Service**: `apps/meta/src/routes/broadcast.js`, `ads.js`
- **Web3 Service**: `apps/web3/src/routes/mint.js`, `ledger.js`