# 🗄️ DreamDOT — Data Schema & State Model

| | |
|---|---|
| **Document version** | 4.0 (Reality-Synced Edition) |
| **Status** | Canonical — derived directly from the running code, not aspiration |
| **Last updated** | 2026-08-09 |
| **Owner** | Rijusmit |
| **Repository** | `C:\Code\01_full_stack\DreamDot` |

> **What changed in v4.0:** Every model below was re-derived from `apps/database-mongo/src/models/*.ts` and `apps/web/src/lib/prisma/*.schema.prisma` directly — not from the previous PRD's aspirational shape. Where the old doc (v3.1) claimed fields that don't exist (`script`, `thumbnailUrl`, `pricingModel`, `bundleItems` as first-class Item fields; a `BlockchainLedger` collection; a `Server`/`Channel` Mongo model), those claims are corrected below. Per product decision, **code wins over docs** for the Item shape going forward — schema evolution should extend what's real, not chase the old fantasy.

---

## 0. Data Architecture Overview: MongoDB vs PostgreSQL

### The Split (Golden Rule) — unchanged, still the right principle
- **PostgreSQL (Prisma, 5 schemas)**: relational metadata, auth, social graph, financial records, notifications.
- **MongoDB (Mongoose, `@repo/database-mongo`)**: content bodies, media arrays, chat, DRM flags.

| Data Category | Database | Real Model(s) |
|---|---|---|
| User auth & profile | **PostgreSQL** (`user` schema) | `users`, `user_profile`, `user_security`, `user_about`, `user_analytics`, `user_sessions`, `user_certificates`, `user_blocklist` |
| User mirror (fast cross-service lookup) | **MongoDB** | `User` (`_id`, `email`, `name`, `credits`, `library[]`, `notifications{}` prefs) |
| Posts (metadata) | **PostgreSQL** (`social` schema) | `posts`, `posts_analytics`, `comments`, `likes`, `saves`, `shares` |
| Posts (content body) | **MongoDB** | `Post` (`content`, `media[]`, `likes[]`, `comments[]`) |
| Social graph | **PostgreSQL** (`social` schema) | `following`, `blocking` |
| Notifications | **PostgreSQL** (`social` schema) | `notifications` — **table exists today, currently has zero producers or consumers.** This is what `apps/notifications` (new NestJS service) activates. See §6. |
| Items (metadata) | **PostgreSQL** (`items` schema) | `items`, `monetization`, `favorites`, `reviews`, `transactions`, `item_ownership`, `collections` |
| Items (content + media) | **MongoDB** | `Item` (`media[]`, `drm{}`, `metadata{}` — see §1.2 for the `script`/`thumbnailUrl` caveat) |
| Chat (conversations & messages) | **MongoDB** | `Conversation`, `Message`, `Membership`, `Attachment` |
| Community servers/channels | **PostgreSQL** (`community` schema) | `servers`, `channels`, `members`, `messages`, `presence` — **note: this is Postgres, not Mongo.** The old doc's `Server`/`Channel` Mongoose model does not exist. |
| Financial transactions | **MongoDB** | `Transaction` (Stripe-facing, mirrors `apps/payment`) |
| Audit/observability | **PostgreSQL** (`audit` schema) | `audit_logs`, `api_logs`, `access_logs`, `error_logs` |
| Web3 / blockchain ledger | *(none yet)* | Not built. See §7 — build target, not existing schema. |

**Bottom line, unchanged**: relational/transactional/indexed → PostgreSQL. Content body/unstructured/high-write → MongoDB.

---

## 1. MongoDB (Mongoose) — `apps/database-mongo/src/models/*.ts`

This package is the single canonical source for every Mongo schema. All services (`web`, `chat`, `payment`, future `notifications`) import from `@repo/database-mongo` — never redefine a model locally.

### 1.1 `User`
```ts
{
  _id: String,              // matches NextAuth JWT sub / Postgres users.id
  email: String,
  name: String,
  avatar: String,
  bio: String,
  location: String,
  website: String,
  socialLinks: [String],

  credits: Number,          // default 0
  totalEarned: Number,
  totalSpent: Number,

  library: [{                              // purchased items
    itemId: String,
    purchaseDate: Date,
    price: Number,
    status: 'purchased' | 'processing',
    accessLevel: 'full' | 'limited',
    metadata: Mixed,
  }],

  privacy: {
    profileVisibility: 'public' | 'friends' | 'private',
    showEmail: Boolean,
    allowMessages: Boolean,
    allowNotifications: Boolean,
    showOnlineStatus: Boolean,
    showActivityStatus: Boolean,
  },

  notifications: {                          // PREFERENCES only — not the notification feed itself
    emailNotifications: Boolean,
    pushNotifications: Boolean,
    frequency: 'realtime' | 'daily' | 'weekly',
    quietHoursStart: String,                // "22:00"
    quietHoursEnd: String,
    types: {
      newFollowers: Boolean,
      itemPurchases: Boolean,
      comments: Boolean,
      messages: Boolean,
      liveStreams: Boolean,
    },
  },

  followers: [String],
  following: [String],
  blockedUsers: [String],

  connectedServices: {
    metaAccounts: [String],   // populated once apps/meta OAuth ships
    web3Wallets: [String],    // populated once apps/web3 ships
  },

  monetization: {
    defaultMonthlyCredits: Number,   // default 500 — used for subscription items
    defaultAnnualCredits: Number,    // default 5000
  },

  accountStatus: 'active' | 'suspended' | 'deleted',
  lastLoginAt: Date,
  deletedAt: Date,
}
```
> ⚠️ `user.notifications{}` is **preferences**, read/written by `/api/users/me/notifications`. It is not where actual notification events live — that's the Postgres `notifications` table (§6). Don't confuse the two when building the new service.

### 1.2 `Item` — real shape (supersedes the old `script`/`thumbnailUrl`/`pricingModel` claims)
```ts
{
  userId: String,
  sqlId: String,             // links to Postgres items.item_id
  title: String,             // required, max 140
  description: String,       // max 5000 — see §5 for the new mandatory-field rule
  category: enum[            // 15 values in code (docs previously claimed 9)
    'writing','illustration','audio','video','research','design','code',
    'template','other','art','photography','animation','music','3d','education'
  ],
  price: Number,              // required, flat number — NOT a nested pricingModel object
  visibility: 'private' | 'unlisted' | 'public',

  media: [{ url, mimeType, size, width, height }],

  rating: Number, reviews: Number, sales: Number,
  purchases: [{ buyerId, purchaseDate, transactionId }],

  tags: [String],
  featured: Boolean, isFeatured: Boolean,   // duplicate flags — tech debt, unify to one

  drm: {                      // simple flags, NOT the old nested drmConfig{watermarkOpacity,...}
    enabled: Boolean,          // default true
    watermark: Boolean,        // default true
    tracking: Boolean,         // default true
  },

  monetizationType: 'one-time' | 'subscription' | 'free',

  metadata: Mixed,             // ⚠️ see caveat below
}
```

**Tech debt flag — `metadata{}` is doing load-bearing work it shouldn't.** `apps/web/src/app/api/Items/create/route.js` currently writes the creator's full body text, thumbnail URL, and bundle item IDs *into* `metadata` instead of first-class fields:
```js
metadata: {
  script: content,                 // the actual body/description text
  bundleItemIds: [...],
  thumbnailUrl: cleanThumbnail,
  originalCategory: category,
  subscriptionBillingCycle, subscriptionMonthlyCredits, subscriptionAnnualCredits,
}
```
This works today but means `script`/`thumbnailUrl`/`bundleItemIds` are **unindexed and unqueryable** at the database level — every read has to know to reach into a `Mixed` blob. **Recommended follow-up** (not yet done): promote `thumbnailUrl` and `bundleItemIds` to first-class top-level `Item` fields with real types and indexes; keep `script` merged into `description` or add it as its own indexed field if long-form body text needs to stay separate from the short blurb. Until that migration happens, any new code reading Item content must know to check `item.metadata.thumbnailUrl`, not `item.thumbnailUrl`.

### 1.3 `Post`
```ts
{
  userId: String, sqlId: String,
  title: String,          // max 200, optional
  content: String,        // required, max 5000
  media: [{ type: 'image'|'video'|'audio'|'file', url, alt }],
  visibility: Boolean,
  likes: [String], comments: [{ userId, text, timestamp }],
  shares: Number, saves: [String],
  category: String, tags: [String],
  engagementScore: Number,
  isSponsored: Boolean, isFeatured: Boolean,
}
```

### 1.4 `Message`
```ts
{
  conversationId: String,  // DM/group — mutually exclusive with channelId, one required
  channelId: String,       // community channel — added 2026-08-09, indexed, {channelId, timestamp} compound index
  senderId: String,
  content: String,                        // max 4000
  ciphertext: String, nonce: String, keyId: String,   // optional E2E fields — not currently used by any client code
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'system',
  attachments: [{ url, type, name, size }],
  readBy: [String], editedAt: Date, isDeleted: Boolean, replyTo: String,
  timestamp: Date,
}
// pre('validate') hook enforces exactly one of conversationId/channelId, never both/neither.
// virtual: isRead = readBy.length > 0
```

### 1.5 `Conversation`
```ts
{
  type: 'direct' | 'group',
  participants: [String], admins: [String],
  name: String, description: String, avatar: String,
  lastMessage: ObjectId(ref: Message), lastMessageAt: Date,
  unreadBy: [String], createdBy: String, isArchived: Boolean,
}
// virtual: participantCount
```

### 1.6 `Membership`
```ts
{ conversationId: String, userId: String, role: 'member' | 'admin', joinedAt: Date }
// unique index on (conversationId, userId)
```

### 1.7 `Attachment`
```ts
{ filename, originalName, mimeType, size, url, uploadedBy, message: ObjectId(ref: Message) }
```

### 1.8 `Transaction` (mirrors `apps/payment`, Stripe-facing)
```ts
{
  userId: String,
  type: 'purchase' | 'income' | 'top-up' | 'refund' | 'adjustment',
  amount: Number, credits: Number,
  relatedId: String, relatedType: 'item' | 'post' | 'creator' | 'platform',
  paymentMethod: 'stripe' | 'wallet' | 'referral' | 'admin',
  stripeSessionId: String, stripeTransactionId: String,
  status: 'pending' | 'completed' | 'failed' | 'refunded',
  description: String, metadata: Mixed,
  earnedFrom: String,
  platformFee: Number, taxAmount: Number,
}
```

**What's absent from Mongo, corrected from the old doc**: there is no `Server` / `Channel` model — community *structure* lives entirely in Postgres (§2.4); only channel *message content* lives in Mongo (`Message.channelId`, above). No `BlockchainLedger` model (Web3 is not built — §7).

---

## 2. PostgreSQL (5 Prisma clients) — `apps/web/src/lib/prisma/*.schema.prisma`

Five genuinely separate schema files, each its own generated client. Naming is `snake_case` throughout — **not** the PascalCase shown in the old doc.

### 2.1 `user.schema.prisma` (client: `prismaUser`)
`users`, `user_profile`, `user_about`, `user_analytics`, `user_security`, `user_sessions`, `user_certificates`, `user_blocklist`. Notable real fields: `users.initial_balance` defaults to `50000` (undocumented balance-seeding), `user_profile.social_links` is a `Json?`, `user_security` carries OTP + recovery codes for 2FA that isn't documented anywhere else.

### 2.2 `social.schema.prisma` (client: `prismaSocial`)
`posts`, `posts_analytics`, `comments` (self-referential for replies), `likes`, `saves`, `shares`, `following`, `blocking`, `reported_content`, **`notifications`** (see §6), plus a duplicate `users` cross-reference (multi-schema Postgres, `social` + `user_d`).

### 2.3 `items.schema.prisma` (client: `prismaItems`)
`items`, `monetization` (separate monthly/annual rows for subscription items), `favorites`, `reviews`, `transactions`, `collections`, `item_ownership`, plus a duplicate `users` cross-reference (`items_d` + `user_d`).

There is **no** `MetaIntegration`, `AdCampaign`, or `SubscriptionTier` model anywhere in Postgres today — those are Ad Studio / subscription-tier build targets (§7), not existing schema.

### 2.4 `community.schema.prisma` (client: `prismaCommunity`) — updated 2026-08-09
```prisma
model servers  { server_id, name, description, owner_id, is_public Boolean @default(true), channels[], members[] }
model channels { channel_id, server_id, name, type String @default("text"), topic, position }
model members  { member_id, server_id, user_id, role @default("member") }
model presence { presence_id, user_id String @unique, status @default("offline"), last_seen }
```
Communities are **entirely relational (Postgres)** for structure — servers/channels/members/presence — not a Mongo `Server` document. `channels.type` is still a plain `String` defaulting to `"text"`, still **not a database-enforced enum**; Prisma has no native `CHECK` constraint primitive and this repo has no tracked migration history (`prisma db push` only), so adding one would be invisible to the schema-as-source-of-truth model — text-only stays an application-level guarantee (enforced in every channel-creation and message route), a deliberate trade-off, not an oversight. The stray `'text' | 'voice'` type union in `messages/page.tsx` has been removed.

**Channel message content moved to MongoDB** (2026-08-09) — the `messages` model above was dropped entirely. It was defined but never queried by any route; the real, working implementation stores channel messages in the same Mongo `Message` collection DMs already use, distinguished by a `channelId` field (mutually exclusive with `conversationId` — see §1.4). This matches the "structure in Postgres, content in Mongo" split used everywhere else in this app, and fixed a route that previously imported a Mongo `Channel` model which was never exported from `@repo/database-mongo` and crashed at runtime.

**Presence is now real**, not an unused table — `presence.user_id` gained a `@unique` constraint (required for the upsert pattern below) and `apps/chat` (via its own minimal Prisma client, `apps/chat/prisma/schema.prisma`, mirroring `apps/notifications`' pattern) upserts `online`/`offline` + `last_seen` on Socket.IO connect/disconnect, ref-counted per user so multiple open tabs don't flip someone offline until the last one closes. `GET /api/communities/[communityId]/presence` serves the persisted snapshot; live updates still arrive via the existing `presence:join`/`presence:leave` Socket.IO broadcasts.

**Discovery and self-serve membership are new**: `servers.is_public` backs `GET /api/communities/discover` (public communities the caller hasn't joined) and `POST /api/communities/[id]/join` / `POST /api/communities/[id]/leave` (self-serve — distinct from the existing owner/admin-only member-management routes, which remain for adding/removing *other* people). An owner cannot leave their own community; `DELETE /api/communities/[communityId]` (owner-only) is the way to remove one, cascading to channels/members via the existing `onDelete: Cascade` relations.

### 2.5 `audit.schema.prisma` (client: `prismaAudit`)
`audit_logs`, `api_logs`, `access_logs`, `error_logs` — pure observability, not user-facing.

---

## 3. TypeScript Interfaces (`apps/web/src/lib/types/`, `lib/store/*`)

```ts
// lib/store/useCreatorStudioStore.ts — the real Draft shape
export interface Draft {
  title: string
  thumbnailUrl: string             // derived client-side from first uploaded image
  script: string                   // long-form body — ends up in Item.metadata.script today
  category: string
  pricingModel: 'free' | 'paid' | 'subscription'
  priceCredits: number
  subscriptionBillingCycle: 'monthly' | 'annually'
  mediaFiles: File[]
  bundleItemIds: string[]
  description?: string             // short blurb — becomes Item.description
}
```
`pricingModel` is a **frontend/API-boundary concept only** — by the time it reaches Mongo it's translated to `monetizationType` (`free`/`paid`→`one-time`/`subscription`), and in Postgres to `items.monetization_type`. Keep that translation in mind when tracing a field end-to-end.

---

## 4. State Management — unchanged from prior docs, still accurate
Zustand is the exclusive client-state layer (`useAuthStore`, `useCreatorStudioStore`, `useChatStore`, wallet/UI stores). No React Query/SWR. Server state via Server Actions + direct `fetch` to `/api/*`. This part of the architecture matches what's actually in `apps/web/src/lib/store/*.ts` and hasn't drifted.

---

## 5. The Mandatory-Fields Rule (product decision, 2026-08-09)

**Every digital asset, regardless of type, must have: Title, Thumbnail, Description, and an explicit price status (Free / Paid / Included in a monthly-or-annual subscription) before it can publish. No exceptions.**

Current enforcement state:
| Field | Store validation (`useCreatorStudioStore.ts`) | API validation (`Items/create/route.js`) |
|---|---|---|
| Title | ✅ required, ≤140 chars | ✅ required, ≤140 chars |
| Thumbnail | ✅ required (derived from ≥1 media file) | ✅ required (derived from media or explicit `thumbnailUrl`) |
| Description | ⚠️ **not independently required** — only the combined `script`-or-`description` content needs ≥10 chars, so an item can publish with a script and an empty description | ⚠️ same gap |
| Price status | ✅ `pricingModel` required (`free`/`paid`/`subscription`), price required if `paid` | ✅ same |

The Description gap is being closed as part of this operation (task tracked separately) — both `validateDraftFunc` and the API route need an explicit non-empty `description` check independent of `script` length.

---

## 6. Notifications — activating an existing, unused table

`social.schema.prisma` already defines:
```prisma
model notifications {
  notification_id      Uuid @id
  user_id               Uuid
  notification_type     String?   // e.g. "follow", "like", "comment", "item_purchase", "message"
  notification_content  String?
  is_read                Boolean @default(false)
  created_at             DateTime @default(now())
}
```
This table existed with **zero writers and zero readers** until 2026-08-09 — `/api/users/me/notifications/route.js` only touches the unrelated Mongo `User.notifications{}` preferences object, and `/notifications/page.tsx` was a static empty-state shell.

**As of 2026-08-09, this table is live.** `apps/notifications` (NestJS, see PRD.md §6.6) is its first real producer/consumer: `apps/web`'s follow route calls into it (via `apps/web/src/lib/notifications.js`) when someone gets followed, it writes a row here checking the user's preference toggle first, and `/notifications/page.tsx` now reads/marks-read via REST with a Socket.IO subscription for live push. **No new database or model was introduced** — the schema was already correct for the job; it just needed a service built on top of it. Comment/message/item_purchase producers still need their own call sites wired (the ingestion endpoint already accepts all five types) — see PRD.md §6.6 FR-6.2 for what's left.

---

## 7. Build Targets Without a Schema Yet

Per product decision, these stay in V1 scope but have **no schema today** — each needs its own design pass when work starts, not a placeholder guessed now:

- **Web3 / blockchain ledger**: no `BlockchainLedger` model, no `apps/web3` service, no wagmi/viem/ethers dependency anywhere in `package.json`. Needs: target chain decision (Polygon/Base, testnet vs. mainnet), contract deployment, and only then a ledger schema.
- **Meta / Ad Studio**: no `MetaIntegration` or `AdCampaign` model, no `apps/meta` service. Needs a Meta developer app (`META_APP_ID`/`META_APP_SECRET`) before OAuth token storage can be designed for real.
- **DRM enforcement mechanics**: `Item.drm{}` flags exist and are set correctly (`enabled`/`watermark`/`tracking`, all default `true`). As of 2026-08-09, `DRMViewer.tsx` enforces contextmenu/selectstart blocking, a live dynamic watermark, and a DevTools-open heuristic. Video EME remains unbuilt — needs a license-server decision.

---

## 8. Checklist: Before Going Live

- ✅ All Mongoose models live in `@repo/database-mongo`, no local redefinitions
- ✅ All Mongo `_id`s are Strings, matching NextAuth JWT `sub`
- ✅ Item/Post dual-write (`sqlId` ↔ Mongo `_id`) rolls back Postgres on Mongo failure (see `Items/create/route.js`)
- ⚠️ `Item.metadata{}` overload (script/thumbnailUrl/bundleItemIds) — schedule the promotion-to-first-class-fields migration
- ⚠️ `channels.type` has no DB-level enum/constraint — text-only is convention (a deliberate call, not an oversight — see §2.4), not enforced
- ✅ Description now independently mandatory (closed 2026-08-09, §5)
- ✅ Notifications table has a real producer/consumer (`apps/notifications`, follow events wired; comment/message/purchase still pending, §6)
- ✅ Communities are fully functional: browse/join/leave/delete, real-time channel chat via Socket.IO, persisted presence (closed 2026-08-09, §2.4)
- ❌ No Web3 ledger, no Meta integration tables — explicitly out of schema scope until those services start
