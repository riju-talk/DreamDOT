# DreamDOT — Tech Stack & Architecture Spec

| | |
|---|---|
| **Document version** | 2.1 (State Management Update) |
| **Status** | Locked — derived from implemented codebase + Super Saiyan PRD v3.0 |
| **Last updated** | 2026-08-01 |
| **Owner** | Rijusmit |
| **Repository** | `C:\Code\01_full_stack\DreamDot` |

---

## 1. Frontend / Backend Frameworks

| Layer | Technology | Version | Notes |
|---|---|---|---|
| **Web (Client + API)** | Next.js (App Router) | 15.3.4 | React 18.3.1, **TypeScript**, runs on port 5000 |
| **State Management** | **Zustand** | 4.x / 5.x | Lightweight, boilerplate-free global state for UI, auth sync, wallet, and chat. |
| **Chat Service** | Express + Socket.IO | Express 4.x, Socket.IO 4.x | **JavaScript**, runs on port 3001, `serveClient: false` |
| **Payment Service** | Express + Stripe | Express 4.x, Stripe SDK 14.12.0 | **JavaScript**, runs on port 3002, raw-body on `/webhook` |
| **Web3 Service** | Express **OR** Python | Node.js 20.x **OR** Python 3.11+ | **JavaScript (`.js`) OR Python (`.py`) ONLY**. Handles smart contract interactions, minting, and on-chain ledger verification. |
| **Meta Service** | Express | Express 4.x, `facebook-nodejs-business-sdk` | **JavaScript (`.js`) ONLY**. Handles Meta OAuth, Graph API (Stories), and Marketing API (Ads). |
| **Database (SQL)** | Prisma ORM + PostgreSQL | Prisma 5.x, Postgres 16 | Multiple clients: `user`, `social`, `item`, `community`, `audit`, `meta_integrations` |
| **Database (NoSQL)** | Mongoose + MongoDB | Mongoose 8.x, MongoDB 7 | Shared package `@repo/database-mongo` |
| **Blockchain** | Viem / Wagmi / Web3Modal | Viem 2.x, Wagmi 2.x | Frontend Web3 state. Backend uses `ethers` (JS) or `web3.py` (Python). Target L2: Polygon or Base. |
| **Monorepo** | Turborepo + npm workspaces | Turbo 2.5.6, npm 10.8.1 | Node ≥ 18 |

---

## 2. Styling & UI

| Concern | Choice |
|---|---|
| **CSS Framework** | Tailwind CSS (v3) with `@tailwindcss/forms`, `@tailwindcss/typography`, `tailwindcss-animate` |
| **Component Primitives** | Radix UI (`@radix-ui/react-*`: accordion, avatar, dialog, dropdown-menu, label, radio-group, select, separator, slider, slot, switch, tabs, tooltip) |
| **Class Composition** | `clsx` + `tailwind-merge` + `class-variance-authority` (cva) |
| **Icons** | `lucide-react` 0.518.0 + `react-icons` |
| **Animations** | `framer-motion` 12.x + `motion` 12.x, `cobe` (globe) |
| **Theme** | `next-themes` (dark/light, persisted) |
| **Toast/Notifications** | `sonner` 2.0.5 |
| **Rich Text Editors** | **Tiptap** 3.15.3 (Create workspace); **Quill** (dynamic import) for feed composer |
| **Charts** | `recharts` 2.15.0 (mock analytics) |
| **Search** | `fuse.js` 7.1.0 (client-side fuzzy search in top nav) |
| **DRM / Vault Viewer** | Custom Canvas overlay + CSS `user-select: none` + HTML5 EME (Encrypted Media Extensions) for video |

---

## 3. Folder Structure

### 3.1 Monorepo Root

```text
DreamDot/
├── apps/
│   ├── web/              # Next.js product (primary, TypeScript)
│   ├── chat/             # Express + Socket.IO messaging (JavaScript)
│   ├── payment/          # Express + Stripe payments (JavaScript)
│   ├── web3/             # Express or Python service for blockchain minting/verification (JS or Python ONLY)
│   ├── meta/             # Express service for Meta Graph/Marketing API (JavaScript ONLY)
│   └── database-mongo/   # Shared Mongoose models & connection (TypeScript, compiles to JS)
├── packages/
│   ├── ui/               # Shared React components
│   ├── eslint-config/    # Shared ESLint config
│   └── typescript-config/# Shared tsconfig bases
├── docs/
│   ├── mongoose-schemas.json
│   ├── PRD.md
│   └── TECH_STACK.md     # ← this file
├── docker/
│   ├── postgres/init.sql # Creates DBs including `dreamdot_meta`
│   └── ...
├── scripts/
│   └── ping-database.js  # Health check for CI
├── .github/workflows/    # CI / keep-alive
├── turbo.json
├── package.json
├── docker-compose.yml
└── README.md
```

### 3.2 `apps/web` (Next.js 15 App Router) - *New Additions Highlighted*

```text
apps/web/
├── middleware.ts                 # Auth gate + Web3 session checks
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Fonts, SessionProvider, ThemeProvider, Toaster, WagmiConfig
│   │   ├── feed/, discover/, marketplace/, create/, messages/, settings/
│   │   ├── library/              # NEW: User's purchased/owned DRM-protected content
│   │   ├── ad-studio/            # NEW: Meta ad campaign creation and management UI
│   │   ├── wallet/               # UPDATED: Credits + Web3 withdrawal UI
│   │   └── api/                  # Next.js API routes (.js ONLY for API routes per Rules of Engagement)
│   ├── components/
│   │   ├── vault/                # NEW: DRM Viewer (Canvas watermark, right-click disable, EME video)
│   │   ├── ad-studio/            # NEW: Meta campaign builder, audience selector, budget slider
│   │   ├── web3/                 # NEW: WalletConnect button, transaction history, minting status
│   │   ├── social-feed.tsx, chat-window.tsx, profile-header.tsx, etc.
│   └── lib/
│       ├── store/                # NEW: Zustand stores (useAuthStore, useWalletStore, useChatStore, useUIStore)
│       ├── web3/                 # NEW: Viem/Wagmi clients, contract ABIs, account abstraction helpers
│       ├── meta/                 # NEW: Helpers for triggering Meta service API calls
│       ├── socket.ts             # useSocket hook (socket.io-client)
│       ├── feed-logic/, types/, utils/
```

### 3.3 `apps/web3` (New Microservice)
```text
apps/web3/
├── server.js (or server.py)      # Express or Python entry point
├── routes/
│   ├── mint.js                   # Triggers NFT/digital twin minting on L2
│   ├── verify.js                 # Verifies on-chain ownership of an item
│   └── ledger.js                 # Syncs platform credit transactions to on-chain ledger
├── contracts/                    # ABI JSON files (ERC-721/1155 for content, ERC-20 for credits)
└── package.json (or requirements.txt)
```

### 3.4 `apps/meta` (New Microservice)
```text
apps/meta/
├── server.js                     # Express entry point
├── routes/
│   ├── oauth.js                  # Handles Meta OAuth callback, stores encrypted tokens in Postgres
│   ├── broadcast.js              # Pushes content to IG/FB Stories via Graph API
│   └── ads.js                    # Creates/monitors ad campaigns via Marketing API
├── middleware/
│   └── auth.js                   # Validates JWT from Next.js web app
└── package.json
```

---

## 4. Database Query Patterns (MongoDB vs PostgreSQL)

### Query Routing Decision

| Query Goal | Database | Rationale | Example |
|---|---|---|---|
| **Search by price/category/rating** | PostgreSQL | Indexed relational queries are fast | `GET /api/items?priceMin=10&priceMax=100` |
| **Get post/item content body** | MongoDB | Flexible schema, rich media arrays | `POST.content`, `Item.script` |
| **Count likes/comments/saves** | PostgreSQL | Relational counts with indices | `SELECT COUNT(*) FROM likes WHERE post_id=?` |
| **Get chat messages** | MongoDB | High write throughput, unstructured | `Message.find({ conversationId })` |
| **Verify user ownership** | PostgreSQL | ACID compliance, audit trail | `Transaction.findFirst({ buyer_id, item_id })` |
| **Immutable Web3 ledger** | MongoDB | Append-only, cryptographic proof | `BlockchainLedger.create(...)` |
| **DRM configs** | MongoDB | Unstructured, per-item overrides | `Item.drmConfig` |

### Common Anti-Patterns (DO NOT DO)

```javascript
// ❌ DON'T: Query MongoDB for price ranges (no indexed numeric queries)
const items = await Item.find({ price: { $gte: 10, $lte: 100 } })

// ✅ DO: Query PostgreSQL for price range, then Mongo for content
const items = await prismaSocial.items.findMany({
  where: { priceCredits: { gte: 10, lte: 100 } }
})
const enriched = await Promise.all(
  items.map(item => Item.findOne({ sqlId: item.id }))
)

// ❌ DON'T: Keep like count in MongoDB Post model
post.likes.length // Prone to race conditions

// ✅ DO: Use PostgreSQL likes table with COUNT query
const likeCount = await prismaSocial.likes.count({ where: { post_id } })

// ❌ DON'T: Fetch all records then slice
const allPosts = await Post.find()
const page2 = allPosts.slice(20, 40)

// ✅ DO: Use skip + limit + lean()
const posts = await Post.find()
  .sort({ createdAt: -1 })
  .skip(20)
  .limit(20)
  .lean()
```

---

## 5. State Management (Updated)

| Scope | Mechanism | Details |
|---|---|---|
| **Global UI & App State** | **Zustand** (`zustand` + `zustand/middleware`) | Primary client-side state manager. Handles theme preferences, sidebar collapse state, Creator Studio draft data, and Ad Studio form state. Persists to `localStorage` where needed. Prevents Context re-render bottlenecks. |
| **Global Auth** | NextAuth `SessionProvider` + **Zustand** | Server-side session via NextAuth. Client-side syncs session data into a `useAuthStore` for instant, re-render-safe access across all components without prop-drilling. |
| **Web3 State** | Wagmi + **Zustand** | Wagmi handles chain/wallet connection. Custom Zustand store (`useWalletStore`) tracks app-specific derived state: `isMinting`, `currentCreditBalance`, and `pendingTxHash`. |
| **Chat State** | **Zustand** (`useChatStore`) | Replaces/augments the old `ChatProvider`. Manages `conversations`, `activeConversationId`, `messages` map, `typingUsers`, and `unreadCounts`. Optimized with Zustand selectors to prevent full chat UI re-renders on every new message. |
| **Server State** | Server Actions + `fetch` | `src/app/actions.ts`; direct `fetch` to `/api/*`, `/api/web3/*`, `/api/meta/*`. No React Query/SWR (intentionally kept minimal). |
| **Local UI State** | `useState` / `useReducer` | Component-scoped state: modals, local form validation, search debounce, DRM viewer zoom/pan controls. |

---

## 5. Data & API Conventions

### 5.1 Database Access Patterns

| Data Domain | Store | Access Layer |
|---|---|---|
| **Auth / Users / Profiles / Social Graph** | PostgreSQL (Prisma) | `prismaUser`, `prismaSocial`, `prismaItem`, `prismaCommunity`, `prismaAudit` |
| **Meta Integrations** | PostgreSQL (Prisma) | `prismaMeta` (stores encrypted `access_token`, `refresh_token`, `page_id`, `ad_account_id`) |
| **Posts / Items (content bodies)** | MongoDB (Mongoose) | `@repo/database-mongo` models + `src/lib/mongoose/*.ts` helpers. Includes `blockchainTokenId` field. |
| **Chat (conversations, messages)** | MongoDB (Mongoose) | Chat service uses `@repo/database-mongo` directly; web syncs via Socket.IO into Zustand. |
| **Transactions / Credits** | MongoDB + **Blockchain** | Mongo stores pending/completed platform transactions. Blockchain (L2) stores immutable ledger receipts and content ownership (NFTs). |

### 5.2 API Style & Language Rules (Strict)
- **Web internal `/api/*`**: Next.js route handlers. **MUST be `.js`** (no TypeScript in API routes per Rules of Engagement).
- **Chat REST**: `/api/v1/conversations` — **JavaScript**, JWT Bearer auth.
- **Payment REST**: `/api/payment/*` — **JavaScript**, JWT Bearer + Stripe signature.
- **Web3 REST**: `/api/web3/mint`, `/api/web3/verify` — **JavaScript (`.js`) OR Python (`.py`)**.
- **Meta REST**: `/api/meta/broadcast`, `/api/meta/ads` — **JavaScript (`.js`)**.
- **Auth**: NextAuth + custom JWT endpoints. Token payload `{ sub: string, id: string }` (string matches Mongo `_id`).

---

## 6. Key Technical Decisions (Locked In)

| Decision | Rationale |
|---|---|
| **Zustand over Deep Context** | As the app grew (Ad Studio, Creator Studio, DRM Vault), React Context caused unnecessary re-renders. Zustand provides a lightweight, selector-based, boilerplate-free alternative that scales perfectly without the overhead of Redux. |
| **Hybrid SQL + NoSQL + Blockchain** | Prisma/Postgres for relational data; Mongo for flexible content/chat; Blockchain (Polygon/Base) for immutable proof of ownership and transparent credit ledgers. |
| **Account Abstraction (ERC-4337)** | Users interact with "Credits". The platform sponsors gas fees via a Paymaster. Users never see MetaMask popups or handle seed phrases, ensuring Web2-like UX with Web3 integrity. |
| **DRM "Vault" Strategy** | 100% OS-level screen recording prevention is impossible. **Mitigation:** Dynamic forensic watermarking (User ID + timestamp overlaid on canvas/video) + disabled right-click/text selection + HTML5 EME for video streams. Leakers can be cryptographically traced. |
| **Meta Broadcasting Architecture** | Decoupled into `apps/meta` to isolate Facebook/Instagram API rate limits, complex OAuth token rotation, and Marketing API payloads from the core Next.js app. |
| **Shared Mongoose package** | Single source of truth for schemas; all services import `@repo/database-mongo` (compiled TS). |
| **App Router (not Pages)** | Next.js 15, RSC-ready, server actions, nested layouts. |

---

## 7. Environment Variables (Required)

| Service | Variables |
|---|---|
| **All** | `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN` |
| **Web** | `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `DATABASE_URL`, `NEXT_PUBLIC_CHAT_SERVER_URL`, `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`, `NEXT_PUBLIC_RPC_URL` |
| **Chat** | `PORT=3001`, `MONGODB_URI`, `JWT_SECRET` |
| **Payment** | `PORT=3002`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `MONGO_CLUSTER`, `JWT_SECRET`, `SERVICE_SECRET` |
| **Web3** | `PORT=3003`, `RPC_URL`, `PRIVATE_KEY` (for Paymaster/minting), `CONTRACT_ADDRESS_CONTENT`, `CONTRACT_ADDRESS_CREDITS`, `CHAIN_ID` |
| **Meta** | `PORT=3004`, `META_APP_ID`, `META_APP_SECRET`, `META_OAUTH_REDIRECT_URI`, `DATABASE_URL` (for token storage) |

---

## 8. Development Commands

```bash
# Install all deps
npm install

# Run core services concurrently
npm run dev:all
# or separately:
npm run dev          # web on :5000
npm run chat:dev     # chat on :3001
npm run payment:dev  # payment on :3002
npm run web3:dev     # web3 on :3003 (JS or Python)
npm run meta:dev     # meta on :3004

# Build all
npm run build

# Lint / Type-check
npm run lint
npm run type-check
```

---

## 9. CI / Deployment Notes

- **Docker Compose** provisions MongoDB 7, PostgreSQL 16 (5 DBs now, including `dreamdot_meta`), Redis 7.
- **GitHub Actions**: health-check ping script, keep-alive workflows.
- **Services designed to scale independently**. `apps/meta` must handle exponential backoff for Meta API rate limits.
- **Stripe & Web3 webhooks** must be idempotent at the transaction level (implemented via `sessionId` or `txHash` lookup + status guard).

---

## 10. File Naming / Import Conventions

- **Components**: PascalCase (`SocialFeed.tsx`, `VaultViewer.tsx`, `AdCampaignBuilder.tsx`).
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`, `useSocket.ts`, `useWallet.ts`).
- **Stores**: camelCase with `use` prefix and `Store` suffix (`useChatStore.ts`, `useUIStore.ts`).
- **Utils/Lib**: camelCase (`media-upload.ts`, `feed-logic/feed.ts`, `meta-broadcast.js`).
- **Types**: PascalCase in `types/` (`Profile.ts`, `Chat.ts`, `Web3.ts`).
- **API routes**: `route.js` inside `app/api/**/` (**Strictly `.js`**, no `.ts`).
- **Path aliases**: `@/*` → `src/*` (configured in `tsconfig.json`).
- **Package imports**: `@repo/database-mongo`, `@repo/ui`, `@repo/eslint-config`, `@repo/typescript-config`.

---

## 11. Out of Scope / Not Adopted

| Technology / Feature | Status |
|---|---|
| Redux / Jotai / Recoil | Not used — Zustand is the exclusive global state manager. |
| React Query / SWR | Not used — server actions + direct fetch + Zustand caching where needed. |
| Next.js Pages Router | Not used — App Router only. |
| Prisma for Mongo | Not used — Mongoose for Mongo. |
| GraphQL | Not used — REST + Socket.IO. |
| Complex Web3 Key Management | Not used — Account Abstraction (ERC-4337) handles gasless, seamless UX. |
| 100% Screen Recording Prevention | Acknowledged as technically impossible at the OS level. Mitigated via forensic dynamic watermarking and EME. |
| Native mobile applications | Deferred to Phase 2 (Web PWA only for V1). |

---

## 12. References

- PRD: `docs/PRD.md` (v3.0 Super Saiyan Edition)
- Mongo schemas: `docs/mongoose-schemas.json`
- Shared models: `apps/database-mongo/src/models/*`
- Chat server: `apps/chat/server.js`
- Payment routes: `apps/payment/src/routes/*`
- Web3 Service: `apps/web3/server.js` (or `.py`)
- Meta Service: `apps/meta/server.js`
- Web app: `apps/web/src/**`
- Zustand Stores: `apps/web/src/lib/store/*.ts`


---

## 6. MongoDB Architecture & Usage (In-Depth)

### What Lives in MongoDB

| Data Category | Reasoning | Models |
|---|---|---|
| **Post Content Bodies** | Flexible schema for long-form text, rich media, engagement metrics | `Post` (content, media[], comments[]) |
| **Item Scripts & Media** | Creator Studio workflows require unstructured script fields, variable media arrays | `Item` (script, media[], drmConfig, bundleItems[]) |
| **Chat Messages** | High write throughput, flexible attachment schemas, E2E encryption payloads | `Message` (ciphertext, attachments[], readBy[]) |
| **Conversations Metadata** | Optional server-side, participants tracking, unread counts | `Conversation` (participants[], unreadBy[], lastMessage) |
| **Web3 Blockchain Ledger** | Immutable append-only, cryptographic proofs, audit trail | `BlockchainLedger` (txHash, eventType, metadata) |
| **Text-Only Servers** | Community servers with strict text-only channel enforcement | `Server` (channels[{ type: 'text' }]) |

### MongoDB Models by Use Case

#### Post Model
- **When to query**: Fetching post content, comments, media for display
- **What it stores**: Long-form text body, media array, comment thread, engagement scores
- **Linked from PostgreSQL via**: `sqlId` (Post.sqlId ↔ Prisma Post.id)
- **Query example**: `await Post.findById(mongoPostId).select('content media comments')`

#### Item Model  
- **When to query**: Fetching creator studio items, displaying scripts, DRM configs
- **What it stores**: Script/body, media array, DRM settings, pricing model, bundleItems array
- **Linked from PostgreSQL via**: `sqlId` (Item.sqlId ↔ Prisma Item.id)
- **Query example**: `await Item.findById(mongoItemId).select('script drmConfig pricingModel')`

#### Message Model
- **When to query**: Fetching chat messages, unread counts, message history
- **What it stores**: Plaintext/ciphertext, attachments, readBy array, replyTo reference
- **Query example**: `await Message.find({ conversationId }).sort({ timestamp: -1 }).limit(50)`

#### BlockchainLedger Model (IMMUTABLE)
- **When to query**: Reading audit trail, verifying ownership, checking transaction history
- **What it stores**: txHash, fromAddress, toAddress, eventType, metadata
- **Key rule**: WRITE-ONCE, NEVER UPDATE
- **Query example**: `await BlockchainLedger.find({ toAddress: userWeb3Address })`

#### Server Model
- **When to query**: Managing community servers, enforcing text-only channels
- **What it stores**: Members, channels (strictly type: 'text'), permissions
- **Query example**: `await Server.findById(serverId).select('channels')`

### PostgreSQL Handles What MongoDB Shouldn't

| Query | Why NOT MongoDB | PostgreSQL Model |
|---|---|---|
| Price range search | No numeric indices, slow full scans | `Item` (price_credits with B-tree index) |
| Like count aggregation | Race conditions on embedded counters | `Like` table (atomic count() query) |
| Social graph traversal | Relational queries on Follow/Block | `Follow`, `Block` models |
| Transaction audits | ACID guarantees, immutability needed | `Transaction` model |
| User authentication | Password hashing, 2FA, session tokens | `User` model |

### Best Practices: Reading from MongoDB

```javascript
// ✅ DO: Use .lean() for read-heavy operations (no Mongoose overhead)
const posts = await Post.find({ visibility: true })
  .lean()
  .limit(20)

// ✅ DO: Select only needed fields
const items = await Item.find()
  .select('title thumbnailUrl category pricingModel')
  .lean()

// ✅ DO: Paginate with skip + limit + sort
const { page, limit } = req.query
const skip = (page - 1) * limit
const comments = post.comments.slice(skip, skip + limit)

// ❌ DON'T: Keep counters in embedded arrays (race conditions)
// ✅ DO: Use PostgreSQL tables for counts
const likeCount = await prismaSocial.likes.count({ where: { post_id: postId } })

// ✅ DO: Use atomic operators for updates ($push, $pull, $inc)
await Post.findByIdAndUpdate(postId, {
  $push: { comments: newComment },
  $inc: { commentCount: 1 }
}, { new: true })
```

### Anti-Patterns to Avoid

```javascript
// ❌ DON'T: Fetch all records then filter/sort in JS
const allItems = await Item.find()
const sorted = allItems.sort((a, b) => a.price - b.price)

// ✅ DO: Sort in database with index
const items = await prismaSocial.items.findMany({
  where: { visibility: 'public' },
  orderBy: { priceCredits: 'asc' }
})

// ❌ DON'T: Query MongoDB for price ranges
const expensive = await Item.find({ priceCredits: { $gte: 100 } })

// ✅ DO: Query PostgreSQL, enrich with Mongo content
const items = await prismaSocial.items.findMany({
  where: { priceCredits: { gte: 100 } }
})
const enriched = await Promise.all(
  items.map(i => Item.findOne({ sqlId: i.id }))
)

// ❌ DON'T: Keep engagement counts in Mongo (race conditions)
post.likes = post.likes + 1  // Wrong - lost updates

// ✅ DO: Use PostgreSQL likes table + atomic increments
await prismaSocial.likes.create({ userId, postId })
const count = await prismaSocial.likes.count({ where: { postId } })
```

### DRM Config Storage (MongoDB Only)

```javascript
// ✅ DRM configs live ONLY in MongoDB, never exposed in API
const item = await Item.findById(itemId).select('drmConfig')
return {
  watermarkOpacity: item.drmConfig.watermarkOpacity,      // 0.15
  disableRightClick: item.drmConfig.disableRightClick,    // true
  disableTextSelect: item.drmConfig.disableTextSelect,    // true
  emeKeyId: item.drmConfig.emeKeyId,                      // For video EME
  emeLicenseServerUrl: item.drmConfig.emeLicenseServerUrl // For video EME
}
```

### Chat Messages with E2E Encryption (MongoDB)

```javascript
// ✅ Encrypted messages stored in MongoDB
const message = await Message.create({
  conversationId,
  senderId,
  ciphertext: encryptedPayload,      // AES-256-GCM
  nonce: generateNonce(),
  keyId: user.e2eKeyId,
  type: 'text',
  timestamp: new Date()
})

// ✅ Decrypt on client side only
const decrypted = await decryptMessage(message.ciphertext, userPrivateKey)
```

