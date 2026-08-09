# DreamDOT — Tech Stack & Architecture Spec

| | |
|---|---|
| **Document version** | 3.0 (Reality-Synced Edition) |
| **Status** | Canonical — derived directly from the running code |
| **Last updated** | 2026-08-09 |
| **Owner** | Rijusmit |
| **Repository** | `C:\Code\01_full_stack\DreamDot` |

> **What changed in v3.0:** The previous doc described `apps/web3` and `apps/meta` as if they already existed with routes, middleware, and env vars wired up. **Neither directory exists in the repo.** This version separates "what runs today" from "what's an active V1 build target" (per product decision, both `apps/meta` and `apps/web3` stay in scope — they're just not built yet), and adds `apps/notifications` as a new planned service.

---

## 1. Services — What's Actually Running

| Service | Status | Language | Port | Entry point |
|---|---|---|---|---|
| `apps/web` | ✅ Running | TypeScript (UI) + JavaScript (API routes) | 5000 | Next.js 15 App Router |
| `apps/chat` | ✅ Running | JavaScript | 3001 | `server.js` — Express + Socket.IO |
| `apps/payment` | ✅ Running | JavaScript | 3002 | `server.js` — Express + Stripe |
| `apps/database-mongo` | ✅ Running (library, not a server) | TypeScript, compiled | — | Shared Mongoose connection + models |
| `apps/notifications` | ✅ Built 2026-08-09, not yet load-tested live | TypeScript (NestJS) | 3003 | `src/main.ts` — builds clean, boots, Prisma connects; needs `npm run db:up` to verify a full live round-trip |
| `apps/meta` | 🔜 Build target, blocked on Meta dev-app credentials | JavaScript | 3004 | Not yet created |
| `apps/web3` | 🔜 Build target, blocked on chain/RPC decisions | JavaScript or Python | 3005 *(reassigned)* | Not yet created |

Only `web`, `chat`, `payment` have real root-level scripts today (`npm run dev`, `chat:dev`, `dev:all`). **`payment` has no root script** — it must be run manually via `cd apps/payment && npm run dev`; this should be fixed alongside adding the new services' scripts.

---

## 2. Frontend / Backend Frameworks

| Layer | Technology | Version | Notes |
|---|---|---|---|
| **Web (Client + API)** | Next.js (App Router) | 15.3.4 | React 18.3.1, TypeScript for UI, **JavaScript-only for `app/api/**/route.js`** (Rules of Engagement) |
| **State Management** | Zustand | 4.x/5.x | Exclusive global state manager — confirmed in use across `useAuthStore`, `useCreatorStudioStore`, `useChatStore` |
| **Chat Service** | Express + Socket.IO | Express 4.x, Socket.IO 4.x | REST (`/api/v1/conversations`) + Socket.IO (`room:join/leave`, `message:typing`, `message:send`, `presence:join/leave`) |
| **Payment Service** | Express + Stripe | Express 4.x, Stripe SDK | Checkout, webhook (raw-body), `Transaction` model |
| **Notifications Service** *(new)* | **NestJS** | Nest 10.x | See §5 — the one new backend framework this operation introduces |
| **Meta Service** | Express (planned) | — | Not built. OAuth + Graph/Marketing API once credentials exist |
| **Web3 Service** | Express or Python (planned) | — | Not built. Chain/RPC/contract decisions needed first |
| **Database (SQL)** | Prisma ORM + PostgreSQL | Prisma 5.x | **5 real, separate schema files** — `user`, `social`, `items`, `community`, `audit` — each its own generated client (`prismaUser`, `prismaSocial`, `prismaItems`, `prismaCommunity`, `prismaAudit`) |
| **Database (NoSQL)** | Mongoose + MongoDB | Mongoose 8.x | Shared package `@repo/database-mongo`; 8 real models (see `docs/DATA_SCHEMA.md`) |
| **Monorepo** | Turborepo + npm workspaces | Turbo 2.5.6, npm 10.8.1 | Node ≥ 18 |

---

## 3. Styling & UI — unchanged, matches code

Tailwind CSS v3, Radix UI primitives, `clsx`/`tailwind-merge`/`cva`, `lucide-react`, `framer-motion`, `next-themes`, `sonner` for toasts, Tiptap + Quill for rich text, `recharts`, `fuse.js`. This part of the prior doc was accurate and needs no correction. Design tokens live in `docs/DESIGN.md`.

**Confirmed absent from `apps/web/package.json`**: no `wagmi`, `viem`, `ethers`, or any Web3 dependency. Adding these is part of the `apps/web3` build target, not a retroactive correction — they were never installed.

---

## 4. Folder Structure — corrected

```text
DreamDot/
├── apps/
│   ├── web/              # Next.js product (primary) — TS UI, JS API routes
│   ├── chat/              # Express + Socket.IO messaging
│   ├── payment/            # Express + Stripe
│   ├── database-mongo/      # Shared Mongoose models & connection (library)
│   ├── notifications/        # NEW — NestJS, build target of this operation
│   ├── meta/                 # NOT YET CREATED — build target, needs Meta dev-app creds
│   └── web3/                 # NOT YET CREATED — build target, needs chain/RPC decision
├── packages/
│   ├── ui/, eslint-config/, typescript-config/
├── docs/
│   ├── PRD.md, DATA_SCHEMA.md, TECH_STACK.md (this file), DESIGN.md,
│   ├── PROMPT_BACKLOG.md, RULES_OF_ENGAMENT.md, mongoose-schemas.json
├── docker/
│   ├── mongo/, postgres/
├── docker-compose.yml   # provisions mongo, postgres, redis (3 services, confirmed)
├── turbo.json           # only defines `dev` and `chat-server#dev` tasks today
└── package.json
```

### 4.1 `apps/web` — real structure
```text
apps/web/
├── middleware.ts
├── src/
│   ├── app/
│   │   ├── feed/, discover/, marketplace/, create/, messages/, communities/,
│   │   │   library/, wallet/, profile/, settings/, analytics/, about/, privacy/, terms/
│   │   ├── ad-studio/          # exists — currently a "Coming Soon" stub, not a real page
│   │   ├── notifications/      # exists — currently a static empty-state shell
│   │   └── api/                # 55+ real route.js files — auth, Items, posts, chat, communities,
│   │                            # servers/channels, users, social, balance/checkout
│   ├── components/
│   │   ├── library/DRMViewer.tsx    # exists — decorative only, no real DRM enforcement yet
│   │   ├── social-feed.tsx, chat-window.tsx, profile-header.tsx, etc.
│   └── lib/
│       ├── store/       # Zustand stores — useAuthStore, useCreatorStudioStore, useChatStore
│       ├── prisma/       # 5 .schema.prisma files (see DATA_SCHEMA.md §2)
│       ├── mongoose/     # connection helper
│       ├── socket.ts     # socket.io-client hook
```

### 4.2 `apps/notifications` (NestJS) — built 2026-08-09
```text
apps/notifications/
├── src/
│   ├── main.ts                      # Nest bootstrap, port 3003
│   ├── app.module.ts
│   ├── notifications/
│   │   ├── notifications.controller.ts   # GET /notifications, PATCH /:id/read
│   │   ├── notifications.service.ts      # reads/writes Postgres `notifications` table (prismaSocial)
│   │   ├── notifications.gateway.ts      # Socket.IO gateway, same JWT pattern as apps/chat
│   │   └── dto/
│   └── prisma/                       # thin client pointed at the existing `social` schema — no new schema
├── package.json
```
This service does **not** introduce a new database or model — it activates the `notifications` table that already exists, unused, in `social.schema.prisma`. See `docs/DATA_SCHEMA.md` §6.

---

## 5. Why NestJS for Notifications (and only for Notifications)

Every other backend service in this repo is Express, per the Rules of Engagement ("Backend Microservices: JavaScript or Python only"). Introducing NestJS is a deliberate, scoped exception:

- Notifications fan in from **every other service** (posts, items, chat, payments) — Nest's module/provider DI system makes "many event sources, one consumer" cleaner than another hand-rolled Express app.
- It's a good forcing function to establish a typed event-ingestion pattern (`NotificationEvent` DTOs) before Ad Studio and Web3 add two more event-emitting services later.
- It does **not** replace Express elsewhere. `apps/chat` and `apps/payment` stay Express. `apps/meta` and `apps/web3`, when built, stay Express/Python per the existing rule. This is a one-service exception, not a stack change.

---

## 6. Data & API Conventions — corrected

| Data Domain | Store | Access Layer |
|---|---|---|
| Auth / Profiles / Social Graph | PostgreSQL | `prismaUser`, `prismaSocial` |
| Items metadata | PostgreSQL | `prismaItems` |
| Communities (servers/channels/members/presence) | **PostgreSQL** — not Mongo, correcting the prior doc | `prismaCommunity` |
| Notifications | PostgreSQL | `prismaSocial.notifications` (new: also `apps/notifications`) |
| Audit/observability | PostgreSQL | `prismaAudit` |
| Post/Item content bodies, chat, transactions | MongoDB | `@repo/database-mongo` |

### 5.1 API Style & Language Rules (Strict, unchanged)
- Next.js `app/api/**/route.js` — **JavaScript only**, no TypeScript, no `NextRequest`/`NextResponse` types.
- Chat REST (`/api/v1/conversations`) — JavaScript, JWT Bearer.
- Payment REST (`/api/payment/*`) — JavaScript, JWT Bearer + Stripe signature.
- **Naming inconsistency to flag, not silently fix**: the Items creation route lives at `apps/web/src/app/api/Items/create/route.js` — capital `I`, breaking from the otherwise all-lowercase route convention (`posts`, `users`, `communities`). Left as-is for this operation to avoid an unplanned URL-breaking rename; worth a deliberate cleanup pass later.

---

## 7. Key Technical Decisions (Locked In)

| Decision | Rationale |
|---|---|
| Zustand over Context | Confirmed still true and still the exclusive pattern. |
| Hybrid SQL + NoSQL | Confirmed, but the split is **not** what the old doc described — communities are Postgres, not Mongo. See DATA_SCHEMA.md. |
| 5-schema Prisma split | Real: `user`, `social`, `items`, `community`, `audit`, each its own client/datasource. |
| **NestJS exception for Notifications** *(new)* | See §5 — scoped, not a stack-wide change. |
| DRM/Meta/Web3 stay in V1 scope | Product decision 2026-08-09: not deferred to a later phase, but honestly tracked as unbuilt until each ships. |
| App Router (not Pages) | Confirmed. |

---

## 8. Environment Variables — corrected to match `apps/web/.env` reality

| Variable | Present today? |
|---|---|
| `NEXTAUTH_SECRET`, `NEXTAUTH_URL` | ✅ |
| `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_ID/SECRET`, `DISCORD_CLIENT_ID/SECRET` (+ `*_OAUTH_ENABLED` flags) | ✅ |
| `MONGODB_URI`, `MONGODB_DB_NAME` | ✅ |
| `POSTGRESS_DB_USER`, `POSTGRESS_DB_SOCIAL`, `POSTGRESS_DB_ITEMS`, `POSTGRESS_DB_COMMUNITY`, `POSTGRESS_DB_AUDIT` | ✅ (5, matching the 5 schema files — **no `dreamdot_meta` exists**, correcting the old doc) |
| `REDIS_URL`, `REDIS_HOST`, `REDIS_PORT` | ✅ |
| `IMAGEKIT_PRIVATE_KEY`, `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`, `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | ✅ |
| `NEXT_PUBLIC_CHAT_SERVER_URL`, `NEXT_PUBLIC_PAYMENT_SERVER_URL`, `SOCKET_PATH` | ✅ |
| `JWT_SECRET`, `SERVICE_SECRET`, `CORS_ORIGIN`, `CLIENT_URL`, `WEB_APP_URL` | ✅ |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | ✅ (present in `apps/web/.env`, despite the old doc implying Stripe lived only in `apps/payment`) |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`, `RPC_URL`, `CONTRACT_ADDRESS_*` | ❌ absent — will be needed once `apps/web3` starts |
| `META_APP_ID`, `META_APP_SECRET`, `META_OAUTH_REDIRECT_URI` | ❌ absent — will be needed once `apps/meta` starts |

`apps/notifications` (new) will need: `PORT=3003`, `POSTGRESS_DB_SOCIAL` (reused, same DB as the rest of `social` schema), `JWT_SECRET` (reused), `CORS_ORIGIN` (reused).

---

## 9. Development Commands

```bash
# What works today
npm install
npm run dev          # web on :5000
npm run chat:dev      # chat on :3001
cd apps/payment && npm run dev   # payment on :3002 (no root script yet — should get one)
npm run dev:all        # web + chat only

npm run notifications:dev   # apps/notifications on :3003 — wired into root package.json + turbo.json 2026-08-09
```

---

## 10. File Naming / Import Conventions — unchanged, confirmed accurate
PascalCase components, camelCase `use`-prefixed hooks/stores, `route.js` (strictly `.js`) for API routes, `@/*` → `apps/web/src/*`, `@repo/*` for shared packages.

---

## 11. Out of Scope / Not Adopted — unchanged
Redux/Jotai/Recoil, React Query/SWR, Pages Router, Prisma-for-Mongo, GraphQL, native mobile apps (Phase 2). **Complex Web3 key management** stays out — Account Abstraction (ERC-4337) is still the plan for when `apps/web3` starts, so users never see MetaMask prompts.

---

## 12. References
- PRD: `docs/PRD.md`
- Data model: `docs/DATA_SCHEMA.md`
- Design tokens: `docs/DESIGN.md`
- Mongo models: `apps/database-mongo/src/models/*.ts`
- Prisma schemas: `apps/web/src/lib/prisma/*.schema.prisma`
- Chat server: `apps/chat/server.js`
- Payment routes: `apps/payment/src/routes/*`
- Zustand stores: `apps/web/src/lib/store/*.ts`
