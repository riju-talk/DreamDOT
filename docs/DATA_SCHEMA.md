Here is the **definitive, exhaustive, and fully detailed Data Schema & State Model** for DreamDOT. This document leaves nothing out. It incorporates every feature from the Super Saiyan PRD, including the Creator Studio 3-part workflow, DRM Vault, Meta Broadcasting, Web3 Blockchain Ledger, and Text-Only Community Servers.

---

# 🗄️ DreamDOT — Master Data Schema & State Model

| | |
|---|---|
| **Document version** | 3.1 (MongoDB vs PostgreSQL Split Clarified) |
| **Status** | Locked — Single Source of Truth for all databases and state |
| **Last updated** | 2026-08-01 |
| **Owner** | Rijusmit |
| **Repository** | `C:\Code\01_full_stack\DreamDot` |

---

## 0. Data Architecture Overview: MongoDB vs PostgreSQL

### The Split (Golden Rule)
- **PostgreSQL (Prisma)**: All relational data, social graph, auth, transactions, subscriptions, and business logic
- **MongoDB (Mongoose)**: All content bodies, media, chat, Web3 ledger, DRM configs, and unstructured data

| Data Category | Database | Why | Examples |
|---|---|---|---|
| **Content Bodies** | **MongoDB** | Flexible schema for long-form text, rich media arrays, DRM configs | Posts (script/body), Items (full script), Comments (text) |
| **User Profiles & Auth** | **PostgreSQL** | Relational, normalized, indexed for fast auth lookups | Users, email, credentials, settings |
| **Social Graph** | **PostgreSQL** | Relational core: follow/unfollow, block/unblock, subscriptions | Follows, Blocks, UserSubscriptions |
| **Financial & Transactions** | **PostgreSQL** | ACID guarantees, audit trails, compliance | Transactions, Payments, Balances |
| **Engagement (Likes, Saves, Shares)** | **PostgreSQL** | Relational indices for fast counts and user interaction queries | Likes, Saves, Shares tables |
| **Chat (Messages & Conversations)** | **MongoDB** | Unstructured, high write-throughput, flexible message schemas | Messages, Conversations with attachment arrays |
| **Items/Products Metadata** | **PostgreSQL** | Relational pricing, inventory, ownership | Item (title, price, category, visibility) |
| **Items Content Bodies** | **MongoDB** | Item scripts, media arrays, DRM settings, NFT tokens | Item (script body, media, blockchainTokenId, drmConfig) |
| **Web3 / Blockchain** | **MongoDB** | Immutable ledger, hash chains, cryptographic proofs | BlockchainLedger (txHash, eventType, timestamp) |
| **Meta Integrations** | **PostgreSQL** | Encrypted tokens, API credentials, campaign IDs | MetaIntegration, AdCampaign |
| **Community Servers** | **MongoDB** | Flexible channel/member schemas, text-only enforcement | Server, ServerChannel (type: 'text' only) |

**Bottom Line**: If it's relational, transactional, or needs fast indexed queries → PostgreSQL. If it's a content body, unstructured, or immutable → MongoDB.

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

### 1.3 MongoDB Schemas Reference (`docs/mongoose-schemas.json`)

**Quick Lookup**: All MongoDB collection schemas are documented in `docs/mongoose-schemas.json` in a condensed format. Use this table as a reference for field types and enum values.

| Collection | Primary Use | Key Fields | Status |
|---|---|---|---|
| **User** | User profile (mirrors Prisma) | `_id` (String), `email`, `name`, `avatar`, `credits` | ✅ |
| **Conversation** | Chat groups/DMs | `type` (direct\|group), `participants[]`, `admins[]`, `lastMessage`, `unreadBy[]`, `isArchived` | ✅ |
| **Message** | Individual chat messages | `conversationId`, `senderId`, `content`, `ciphertext`*, `type`, `attachments[]`, `readBy[]`, `replyTo` | ✅ |
| **Membership** | Conversation participant roles | `conversationId`, `userId`, `role` (member\|admin), `joinedAt` | ✅ |
| **Attachment** | File attachments in messages | `filename`, `mimeType`, `size`, `url`, `uploadedBy`, `message` (ref) | ✅ |
| **Post** | Social feed posts (content body) | `userId`, `sqlId` (Prisma link), `content`, `media[]`, `visibility`, `likes[]`, `comments[]` | ✅ |
| **Item** | Marketplace items (content + DRM) | `userId`, `sqlId` (Prisma link), `title`, `category`, `visibility`, `media[]`, `tags[]`, `drmConfig` | ✅ |
| **Transaction** | Payment transactions (mirrors Prisma) | `userId`, `sessionId`, `stripePaymentIntentId`, `amount`, `type`, `status`, `metadata` | ✅ |

**Special Fields**:
- `*ciphertext`: Optional E2E encryption payload for messages
- `sqlId`: Foreign key linking to PostgreSQL (Prisma) record `id`
- `type` enums: Strictly enforced at API level

**Complete Schema Definition**: 
```json
{
  "User": { "_id": "string", "email": "string", "name": "string", "avatar": "string", "credits": "number", "createdAt": "date", "updatedAt": "date" },
  "Conversation": { "type": "direct|group", "participants": ["string"], "admins": ["string"], "name": "string", "description": "string", "avatar": "string", "lastMessage": "objectId", "lastMessageAt": "date", "unreadBy": ["string"], "createdBy": "string", "isArchived": "boolean", "createdAt": "date", "updatedAt": "date" },
  "Message": { "conversationId": "string", "senderId": "string", "content": "string", "ciphertext": "string", "nonce": "string", "keyId": "string", "type": "text|image|file|audio|video|system", "attachments": [{ "url": "string", "type": "string", "name": "string", "size": "number" }], "readBy": ["string"], "editedAt": "date", "isDeleted": "boolean", "replyTo": "string", "timestamp": "date", "createdAt": "date", "updatedAt": "date" },
  "Membership": { "conversationId": "string", "userId": "string", "role": "member|admin", "joinedAt": "date", "createdAt": "date", "updatedAt": "date" },
  "Attachment": { "filename": "string", "originalName": "string", "mimeType": "string", "size": "number", "url": "string", "uploadedBy": "string", "message": "objectId", "createdAt": "date", "updatedAt": "date" },
  "Post": { "userId": "string", "sqlId": "string", "content": "string", "media": [{ "type": "string", "url": "string", "alt": "string" }], "visibility": "boolean", "likes": ["string"], "comments": [{ "userId": "string", "text": "string", "timestamp": "date" }], "createdAt": "date" },
  "Item": { "userId": "string", "title": "string", "description": "string", "category": "writing|illustration|audio|video|research|other", "visibility": "private|unlisted|public", "media": [{ "url": "string", "mimeType": "string", "size": "number", "width": "number", "height": "number" }], "tags": ["string"], "metadata": "mixed", "createdAt": "date", "updatedAt": "date" },
  "Transaction": { "userId": "string", "sessionId": "string", "stripePaymentIntentId": "string", "amount": "number", "type": "replenish|redemption|purchase", "status": "pending|completed|failed|expired", "metadata": "mixed", "createdAt": "date", "updatedAt": "date" }
}
```

> **Location**: `docs/mongoose-schemas.json` (Canonical JSON reference for all MongoDB collections)

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


---

## 8. MongoDB Comprehensive Usage Guide

### 8.1 When to Use MongoDB: Decision Tree

```
Does the data have a fixed structure and need ACID transactions?
  ├─ YES → PostgreSQL (Users, Transactions, Social Graph)
  └─ NO  → Is it content/body text or unstructured media?
           ├─ YES → MongoDB (Posts, Items, Chat Messages)
           └─ NO  → PostgreSQL
```

### 8.2 MongoDB Models & When to Query Them

#### **Post Model** (MongoDB)
**Use when**: Reading/writing post content bodies, comments, media arrays, engagement score
**Avoid**: Counting likes/comments for feed (use PostgreSQL `likes` table instead)
**Query Examples**:
```javascript
// ✅ DO: Get post content body for display
const post = await Post.findById(postId).select('content title media comments')

// ❌ DON'T: Count likes here - use PostgreSQL instead
const likeCount = post.likes.length  // WRONG - use prismaSocial.likes.count()

// ✅ DO: Get comments with pagination
const comments = post.comments.slice(skip, skip + limit)

// ✅ DO: Add/remove comment from post
await Post.findByIdAndUpdate(postId, { $push: { comments: newComment } })
```

#### **Item Model** (MongoDB)
**Use when**: Reading/writing item scripts, media arrays, DRM configs, pricing models, bundle items
**Avoid**: Querying by price range (use PostgreSQL `Item` metadata instead for fast indexed queries)
**Query Examples**:
```javascript
// ✅ DO: Get item's full script body and DRM config
const item = await Item.findById(itemId).select('script drmConfig media pricingModel')

// ✅ DO: Get bundle items (array of Item IDs)
const bundleItems = await Item.findById(bundleId).select('bundleItems')

// ❌ DON'T: Query by price range in MongoDB
// Instead, query PostgreSQL Item for price range, then join with Mongo for bodies

// ✅ DO: Update DRM settings
await Item.findByIdAndUpdate(itemId, { 'drmConfig.disableRightClick': true })
```

#### **Message Model** (MongoDB)
**Use when**: Reading/writing chat messages, attachments, E2E encryption payloads
**Query Examples**:
```javascript
// ✅ DO: Get recent messages with pagination
const messages = await Message.find({ conversationId })
  .sort({ timestamp: -1 })
  .limit(20)

// ✅ DO: Get unread messages for user
const unreadMessages = await Message.find({
  conversationId,
  readBy: { $nin: [userId] }
})

// ✅ DO: Mark messages as read
await Message.updateMany(
  { conversationId, 'readBy': { $nin: [userId] } },
  { $push: { readBy: userId } }
)

// ✅ DO: Store E2E encrypted message
const encryptedMessage = await Message.create({
  conversationId,
  senderId,
  ciphertext: encryptedPayload,
  nonce,
  keyId,
  type: 'text'
})
```

#### **BlockchainLedger Model** (MongoDB)
**Use when**: Recording immutable Web3 events, NFT mints, credit transfers
**Key Rule**: NEVER UPDATE. Only INSERT.
**Query Examples**:
```javascript
// ✅ DO: Append immutable transaction record
await BlockchainLedger.create({
  txHash: '0x123abc...',
  chainId: 137, // Polygon
  eventType: 'mint_item',
  toAddress: userWeb3Address,
  creditsAmount: 500,
  metadata: { itemId: 'item_xyz' }
})

// ✅ DO: Verify ownership chain (append-only audit trail)
const ownerships = await BlockchainLedger.find({
  eventType: { $in: ['mint_item', 'transfer'] },
  toAddress: userWeb3Address
}).sort({ timestamp: -1 })

// ❌ DON'T: Update or delete records
// await BlockchainLedger.findByIdAndUpdate(...) // WRONG

// ✅ DO: Read for audit (immutability is the feature)
const allEventsForUser = await BlockchainLedger.find({
  fromAddress: userWeb3Address
}).sort({ timestamp: -1 })
```

#### **Server Model** (MongoDB) - Text-Only Communities
**Use when**: Creating/managing text-only community servers, channels, permissions
**Strict Rule**: `Channel.type` MUST be `'text'`. No 'voice' or 'stage' allowed.
**Query Examples**:
```javascript
// ✅ DO: Create text-only server
const server = await Server.create({
  name: 'Developer Hub',
  ownerId: userId,
  members: [{ userId, role: 'owner' }],
  channels: [
    {
      id: 'general',
      name: 'general',
      type: 'text', // STRICTLY ENFORCED
      topic: 'General discussion'
    }
  ]
})

// ✅ DO: Add text channel
await Server.findByIdAndUpdate(serverId, {
  $push: {
    channels: {
      id: 'announcements',
      name: 'announcements',
      type: 'text'
    }
  }
})

// ❌ DON'T: Create voice channels
// await Server.findByIdAndUpdate(serverId, {
//   $push: {
//     channels: {
//       name: 'voice-chat',
//       type: 'voice'  // WRONG - will be rejected at API level
//     }
//   }
// })

// ✅ DO: Fetch all text channels for a server
const server = await Server.findById(serverId).select('channels')
const textChannels = server.channels.filter(c => c.type === 'text')
```

#### **Conversation & Message Models** (MongoDB) - Chat
**Use when**: Managing DM/group chats, reading messages, tracking unread counts
**Query Examples**:
```javascript
// ✅ DO: Get all conversations for user (with latest message)
const conversations = await Conversation.find({
  participants: userId
}).populate('lastMessage')

// ✅ DO: Get unread count per conversation
const unreadCounts = {}
for (const conv of conversations) {
  unreadCounts[conv._id] = conv.unreadBy.length
}

// ✅ DO: Mark conversation as read
await Conversation.findByIdAndUpdate(convId, {
  $pull: { unreadBy: userId }
})

// ✅ DO: Add participant to group chat
await Conversation.findByIdAndUpdate(convId, {
  $push: { participants: newUserId }
})
```

### 8.3 Cross-Database Joins: Patterns & Examples

**Pattern 1: Get Post with Creator Profile**
```javascript
// 1. Query Mongo for post content
const post = await Post.findById(postId)

// 2. Use userId from post to query Prisma for profile
const creator = await prismaSocial.users.findUnique({
  where: { id: post.userId },
  select: { displayName: true, avatar: true }
})

// 3. Merge results
return {
  ...post.toObject(),
  creator
}
```

**Pattern 2: Get Items for Marketplace with Seller Info**
```javascript
// 1. Query Mongo for items
const items = await Item.find({ visibility: 'public' })
  .sort({ createdAt: -1 })
  .limit(20)

// 2. Batch query Prisma for creator info
const creatorIds = items.map(i => i.userId)
const creators = await prismaSocial.users.findMany({
  where: { id: { in: creatorIds } },
  select: { id: true, displayName: true, avatar: true }
})
const creatorMap = Object.fromEntries(creators.map(c => [c.id, c]))

// 3. Enrich items
return items.map(item => ({
  ...item.toObject(),
  creator: creatorMap[item.userId]
}))
```

**Pattern 3: Get Comments with Author Info**
```javascript
// 1. Get post with comments from Mongo
const post = await Post.findById(postId)
const comments = post.comments || []

// 2. Batch fetch author profiles from Prisma
const authorIds = comments.map(c => c.userId)
const authors = await prismaSocial.users.findMany({
  where: { id: { in: authorIds } },
  select: { id: true, displayName: true, avatar: true }
})
const authorMap = Object.fromEntries(authors.map(a => [a.id, a]))

// 3. Enrich comments with author info
return comments.map(comment => ({
  ...comment,
  author: authorMap[comment.userId]
}))
```

### 8.4 Mongoose Query Optimization

#### Index Strategy
```javascript
// Indices are defined in model `@index` decorators
// Key indices for performance:

// Post model - fast access by userId and createdAt
Post.index({ userId: 1 })
Post.index({ createdAt: -1 })

// Item model - fast marketplace queries
Item.index({ userId: 1 })
Item.index({ category: 1 })
Item.index({ visibility: 1 })
Item.index({ createdAt: -1 })

// Message model - fast chat queries
Message.index({ conversationId: 1, timestamp: -1 })
Message.index({ senderId: 1, timestamp: -1 })

// BlockchainLedger - immutable event log
BlockchainLedger.index({ txHash: 1 }, { unique: true })
BlockchainLedger.index({ timestamp: -1 })
```

#### Lean Queries (No Mongoose Overhead)
```javascript
// ✅ Use .lean() for read-heavy operations (saves memory)
const posts = await Post.find({ visibility: true })
  .lean() // Returns plain JS objects, not Mongoose documents
  .limit(20)

// ❌ Don't use .lean() if you need to call .save() later
// const post = await Post.findById(postId).lean()
// post.content = '...' // Won't work - post is just a JS object
// await post.save() // WRONG
```

#### Pagination Best Practices
```javascript
// ✅ DO: Skip + Limit with sorting
const page = 2
const limit = 20
const skip = (page - 1) * limit

const posts = await Post.find({ userId: creatorId })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .lean()

// ❌ DON'T: Fetch all then slice (wasteful)
// const allPosts = await Post.find({ userId: creatorId })
// const page2Posts = allPosts.slice(20, 40) // WRONG - fetches all docs

// ✅ DO: Return hasMore flag
const total = await Post.countDocuments({ userId: creatorId })
const hasMore = skip + posts.length < total
```

### 8.5 MongoDB Error Handling & Edge Cases

#### Handling Duplicate Posts (Race Condition)
```javascript
// Problem: User submits post twice within 100ms
// Solution: Use unique index on (userId, contentHash)

// In Post model:
PostSchema.index({ userId: 1, contentHash: 1 }, { unique: true })

// In API route:
try {
  const post = await Post.create({
    userId,
    content,
    contentHash: crypto.hash(content) // Prevents duplicates
  })
} catch (error) {
  if (error.code === 11000) {
    return res.status(409).json({ error: 'Duplicate post' })
  }
}
```

#### Handling Atomic Array Operations
```javascript
// Problem: Race condition on comment push
// Solution: Use Mongoose atomic operators ($push, $pull, $inc)

// ✅ DO: Use atomic operations (safe for concurrent requests)
await Post.findByIdAndUpdate(postId, {
  $push: { comments: newComment },
  $inc: { commentCount: 1 }
})

// ❌ DON'T: Fetch, modify, save (loses concurrent updates)
// const post = await Post.findById(postId)
// post.comments.push(newComment)
// await post.save() // Other requests' updates may be lost

// ✅ DO: Return updated document
const updatedPost = await Post.findByIdAndUpdate(
  postId,
  { $push: { comments: newComment } },
  { new: true } // Returns post AFTER update
)
```

#### Handling Missing Documents
```javascript
// ✅ DO: Check for null and return 404
const post = await Post.findById(postId)
if (!post) {
  return res.status(404).json({ error: 'Post not found' })
}

// ✅ DO: Use findByIdAndUpdate with upsert if needed
const updatedPost = await Post.findByIdAndUpdate(
  postId,
  { $inc: { views: 1 } },
  { new: true }
)
if (!updatedPost) {
  return res.status(404).json({ error: 'Post not found' })
}
```

### 8.6 Transitioning Data Between Mongo & Postgres

When moving from MongoDB-only to split architecture:

#### Step 1: Add `sqlId` to MongoDB models
```javascript
// Add sqlId field (links Mongo → Postgres)
const post = await Post.findByIdAndUpdate(mongoId, {
  $set: { sqlId: postgresId }
})
```

#### Step 2: Dual-write during transition
```javascript
// Write to both databases
const sqlItem = await prismaSocial.items.create({ ... })
const mongoItem = await Item.create({
  ...mongoData,
  sqlId: sqlItem.id
})
```

#### Step 3: Verify consistency
```javascript
// Audit: Check all Mongo docs have sqlId
const missingLinks = await Post.find({ sqlId: null })
console.log(`Posts missing sqlId: ${missingLinks.length}`)
```

---

## 9. PostgreSQL Quick Reference for Post/Item Metadata

While MongoDB stores **content bodies**, PostgreSQL stores **metadata**:

| MongoDB (Item) | PostgreSQL (Item) |
|---|---|
| title | title |
| script | — (in Mongo) |
| drmConfig | — (in Mongo) |
| pricingModel | pricing_model |
| priceCredits | price_credits |
| media (array) | — (in Mongo) |
| visibility | visibility |
| bundleItems | — (in Mongo) |
| blockchainTokenId | — (in Mongo) |

**Use case**: When querying marketplace by price range, use PostgreSQL:
```javascript
// ✅ Fast price range query in PostgreSQL
const items = await prismaSocial.items.findMany({
  where: {
    priceCredits: { gte: minPrice, lte: maxPrice },
    visibility: 'public'
  }
})

// Then fetch content bodies from MongoDB:
const enrichedItems = await Promise.all(
  items.map(async (sqlItem) => {
    const mongoItem = await Item.findOne({ sqlId: sqlItem.id })
    return { ...sqlItem, script: mongoItem.script }
  })
)
```

---

## 10. Checklist: Before Going Live with MongoDB

- ✅ All Mongoose models defined in `@repo/database-mongo`
- ✅ All models use **String `_id`**, never ObjectId in application logic
- ✅ All `Post` and `Item` records have `sqlId` linking to PostgreSQL
- ✅ All indices created for frequent queries (userId, createdAt, category)
- ✅ Pagination implemented with hasMore flag (no "fetch all" patterns)
- ✅ DRM config stored in MongoDB (never expose in API responses)
- ✅ Chat messages stored in MongoDB with E2E encryption support
- ✅ BlockchainLedger append-only (no updates, only inserts)
- ✅ Error handling for duplicate posts, missing documents, race conditions
- ✅ Cross-database joins tested (Mongo + Prisma results merge correctly)
