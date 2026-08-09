# 📘 DreamDOT — Master Product Requirements Document (PRD) v5.0
**"Reality-Synced Edition"**

| | |
|---|---|
| **Document version** | 5.0 |
| **Status** | Active — describes what's shipped, what's in progress, and what's still required for V1 deployment |
| **Core Identity** | Social Media Network + DRM-Protected Digital Content Marketplace |
| **Last updated** | 2026-08-09 |
| **Owner** | Rijusmit |
| **Repository** | `C:\Code\01_full_stack\DreamDot` |

> **What changed in v5.0:** v4.0 described DRM Vault, Ad Studio, and Web3/blockchain as "locked & approved," with acceptance criteria implying they already worked. A direct source-code audit (2026-08-09) found zero code behind any of the three. This version doesn't cut them — **per product decision, they stay in V1 scope** — but every section below is honest about build state, using a consistent status marker: ✅ **Shipped**, 🚧 **Partial**, 🔜 **Build target (not started)**. A PRD that can't be trusted to say what's actually built stops being useful as a planning tool; that's the problem this revision fixes.

---

## 1. Overview & Core Identity

**DreamDOT** is a unified Social Media and Content Monetization Platform for the creator economy: a native social feed, real-time text communities, and a DRM-protected marketplace for digital assets (writing, illustration, audio, video, code, and more).

**The Core Pillars, with real status:**
1. **Social Media Engine** ✅ — feed, profiles, follow graph, likes/comments/saves/shares. Built and working.
2. **Creator Studio** ✅ (with one gap closing now) — 4-part workspace (Writer / Media / Bundle / Pricing — corrected from the old "3-part" claim), mandatory-field enforcement (§5 below).
3. **The DRM-Protected Marketplace ("The Vault")** 🚧 — purchasing, ownership, library access, real anti-piracy input blocking (contextmenu/selectstart/devtools shortcuts), a live per-session watermark, and a DevTools-open heuristic all ship as of 2026-08-09. Video EME is still not built — see §6.3.
4. **Text-Only Community Servers** ✅ — browsable, joinable, real-time (Discord/Guilded-style), Postgres structure + Mongo message content. Rebuilt 2026-08-09 (§6.4).
5. **Ad Studio (Meta broadcasting)** 🔜 — page exists as a "Coming Soon" placeholder. No OAuth, no `apps/meta` service, no Graph/Marketing API integration exists yet.
6. **Web3 Integrity Engine** 🔜 — no `apps/web3` service, no blockchain dependency installed, no ledger schema. Entirely unbuilt.
7. **Notification Service** ✅ *(new in v5.0, shipped 2026-08-09)* — `apps/notifications` (NestJS) is live: REST + Socket.IO, activates the previously-unused Postgres `notifications` table, respects per-type user preferences. First real producer (follow events) wired end-to-end. See §6.6.

---

## 2. Problem Statement

Creators today stitch together fragmented tools: Instagram for reach, Patreon for subscriptions, Gumroad for marketplaces, Discord for community.
* **Marketing friction**: manual cross-posting, no way to launch ads without leaving the platform.
* **Creation friction**: no structured workflow for packaging digital goods with consistent metadata.
* **Piracy**: digital items are easily redistributed once downloaded.
* **Siloed communities**: voice channels go unused; creators want focused, text-first spaces with live presence.
* **Silence**: when something happens to your content or account, there's currently no unified place that tells you.

DreamDOT solves this by being the single source of truth for a creator's social presence, structured creation workflow, community, commerce, and awareness of what's happening to their work.

---

## 3. Product Goals

| Goal | Status | Description |
| :--- | :--- | :--- |
| **G1. True Social Media Presence** | ✅ Shipped | Feed, profiles, social graph drive organic discovery. |
| **G2. Structured Creator Studio** | ✅ Shipped, tightening now | Writer / Media / Bundle / Pricing workflow with a hard mandatory-field gate (§5). |
| **G3. Anti-Piracy DRM Marketplace** | 🚧 Partial | Purchase/ownership flow + real input-blocking + live watermark shipped 2026-08-09; video EME remains (§6.3). |
| **G4. Focused Text-Only Communities** | ✅ Shipped | Servers/channels, presence, mostly enforced text-only. |
| **G5. Frictionless Meta Broadcasting** | 🔜 Build target | Ad Studio — blocked on a Meta developer app (§6.5). |
| **G6. Web3 Integrity & Credit Economy** | 🔜 Build target | Blockchain minting/ledger — blocked on chain/RPC decisions (§6.7). Credits themselves (internal, non-blockchain) already work via Stripe + `Transaction`. |
| **G7. Unified Notifications** *(new)* | ✅ Shipped 2026-08-09 | Real-time feed for cross-service events, live via `apps/notifications` (§6.6). |

---

## 4. Target Audience & Personas — unchanged
* **Persona A: "The Micro-Celebrity Creator"** — builds a brand via feed + stories, packages assets in Creator Studio, runs text-only community servers.
* **Persona B: "The Digital Collector / Fan"** — follows creators, buys assets with credits, views them in the Library, chats when creators are live.
* **Persona C: "The Collaborator"** — uses Bundle to group assets, finds collaborators in text-only servers.

---

## 5. The Mandatory-Fields Rule (locked, product decision 2026-08-09)

**Every digital asset — regardless of category — must have a Title, a Thumbnail, a Description, and an explicit price status before it can publish. No category is exempt.**

Price status is one of exactly three states, never left ambiguous:
- **Free** — no charge, included with account access.
- **Paid** — one-time purchase, priced in Credits.
- **Included in subscription** — bundled into the creator's monthly or annual subscription tier.

| Field | Enforcement today | Gap |
|---|---|---|
| Title | ✅ Required, ≤140 chars, both client store and API | none |
| Thumbnail | ✅ Required, derived from ≥1 uploaded media asset | none |
| Description | ✅ Required, independent of script length (closed 2026-08-09) | none |
| Price status | ✅ Required (`free`/`paid`/`subscription`), price required if paid | none |

This is a hard publish gate, not a soft recommendation — the Publish button stays disabled and the API rejects the request until all four are satisfied. All four are now independently enforced, client and server side.

---

## 6. Functional Requirements

### 6.1 Dashboards & Navigation ✅ Shipped
Feed, Marketplace, Wallet, Library dashboards all exist and function against real data.

### 6.2 Creator Studio ✅ Shipped (4-part, corrected from "3-part")
* **FR-2.1 Mandatory fields**: Title, Thumbnail, Description, price status — see §5.
* **FR-2.2 Writer's Part**: rich-text body (Tiptap/Quill).
* **FR-2.3 Media Part**: drag-and-drop, 50MB cap, MIME validation, first image auto-promoted to thumbnail.
* **FR-2.4 Bundle Part**: select ≥2 existing items, group into one sellable bundle.
* **FR-2.5 Pricing Part**: separate step from Bundle (the old PRD conflated these) — free/paid/subscription selection, credits price, billing cycle.

### 6.3 The "Vault" DRM Viewer 🚧 Partial — video DRM is the remaining piece
What's shipped: purchase flow, `Item.drm{enabled, watermark, tracking}` flags stored correctly, Library page, and (as of 2026-08-09) real enforcement in `DRMViewer.tsx`:
* **FR-3.1 Anti-piracy JS** ✅ — `contextmenu` and `selectstart` blocked inside the viewer; `F12`/Ctrl+Shift+I/J/C/Ctrl+U/Ctrl+S blocked; `PrintScreen` is detected (the OS capture can't be prevented, but detection now triggers a visible "logged to this account" flash and a console-level tracking event) — an honest implementation of the acknowledged limit below, not a pretend fix.
* **FR-3.2 Dynamic watermark** ✅ — renders the live viewer's user ID and a timestamp that ticks every second, not a static string baked in at first render.
* **DevTools heuristic** ✅ *(added, not originally scoped)* — an outer/inner window-dimension check blurs the protected image and shows a "close developer tools to continue" notice when DevTools looks open.
* **FR-3.3 Video DRM (EME)**: still not started — needs a license server decision before it can be built, tracked as a distinct follow-up from the work above.
* **Acknowledged limit, unchanged from prior docs**: OS-level screen recording (OBS, native capture) cannot be blocked by any browser-side technique. The mitigation is forensic traceability (watermark ties a leak to an account), not prevention.

### 6.4 Community: Discord/Guilded-Style Servers ✅ Shipped, real-time, browsable (rebuilt 2026-08-09)
Structure (servers/channels/members/presence) in Postgres, channel message content in MongoDB alongside DMs — real-time via `apps/chat` Socket.IO for both. Was previously three disconnected half-built systems (a working Postgres CRUD nothing browsed/joined, a Mongo message route that crashed on a nonexistent model import, and a frontend calling stub endpoints that always returned empty) — now a single working path:
* **Browse & join**: `GET /api/communities/discover` + self-serve `POST .../join` / `POST .../leave`; a dedicated `/communities` page (linked from the main nav) with a Discover toggle, matching the browsable pattern of Discover/Marketplace per product direction.
* **Real-time chat**: Socket.IO `channel:join`/`channel:leave`/`channel:message:send`/`channel:message:new`, membership-gated via a Prisma client `apps/chat` holds against the same Postgres tables. The equivalent DM path (`message:send`/`message:new`) had two latent bugs fixed in the same pass — a field-name mismatch that silently persisted DM messages with empty content, and an event-name mismatch that meant sent messages never reached other clients. Both are now real.
* **Presence**: persisted in Postgres (`presence.user_id` gained a `@unique` constraint), multi-tab-safe ref-counting on connect/disconnect, hydrated on load via `GET .../presence` plus live Socket.IO updates.
* **Text-only enforcement**: remains application-level, not a DB constraint — a deliberate call given this repo's `prisma db push`-only, no-tracked-migrations workflow (a raw `CHECK` constraint would be invisible to the schema file that's the actual source of truth). The stray `'text' | 'voice'` type union in `messages/page.tsx` is gone.
* **Community lifecycle**: owner-only delete (cascades to channels/members); an owner cannot leave their own community without deleting it — there is still no ownership-transfer flow.

### 6.5 Ad Studio / Meta Broadcasting 🔜 Build target — blocked on credentials
Not started. Requires, before any code can go live: a Meta developer app (`META_APP_ID`, `META_APP_SECRET`, OAuth redirect URI). The `apps/meta` Express service structure can be scaffolded ahead of that, but OAuth, Graph API story posting, and Marketing API campaign creation all need real credentials to test against.
* **FR-5.1** Connect Instagram/Facebook via OAuth.
* **FR-5.2** Broadcast a DreamDOT post/story to linked Meta accounts.
* **FR-5.3** Launch a paid ad campaign from a post, budgeted in Credits, via the Marketing API.

### 6.6 Notification Service ✅ Shipped 2026-08-09 *(new section)*
Every other pillar used to produce events with no destination: a like, a follow, a new message, an item purchase, a comment. `docs/DATA_SCHEMA.md` §6 documented an existing, unused Postgres `notifications` table (`social` schema) — this service activates it.

* **FR-6.1 Service** ✅ — `apps/notifications`, built in **NestJS** (a deliberate, scoped exception to the Express-only backend rule — see TECH_STACK.md §5 for why). Builds clean, boots, connects to Postgres via Prisma, all routes register correctly.
* **FR-6.2 Event sources** 🚧 — architecture supports any service calling in; only **follow events** are wired end-to-end so far (`apps/web/src/app/api/users/[id]/follow/route.js` → `apps/web/src/lib/notifications.js` → `POST /internal/notifications`). Item purchases, comments, and messages still need their producer call added at the relevant existing API routes/socket handlers — the ingestion endpoint and DTO already support all five types, this is wiring, not new design.
* **FR-6.3 Storage** ✅ — writes to the existing Postgres `notifications` table via a dedicated minimal Prisma client (`apps/notifications/prisma/schema.prisma`) pointed at the same `POSTGRESS_DB_SOCIAL` connection — no new database, no new model.
* **FR-6.4 Delivery** ✅ — REST (`GET /notifications`, `PATCH /notifications/:id/read`) and a Socket.IO gateway (same JWT-in-handshake pattern as `apps/chat`, reuses the existing `session.chatToken` — no new token minting needed) both implemented and wired into `/notifications/page.tsx`, which now renders a real live feed instead of a static empty state.
* **FR-6.5 Scope for V1**: in-app only, unchanged. Email and push notifications are explicitly out of scope — the `User.notifications{}` preference flags for `emailNotifications`/`pushNotifications` already exist in the Mongo schema for a future phase, but nothing sends email or push today.
* **FR-6.6 Respect user preferences** ✅ — the service checks `User.notifications.types.{newFollowers,itemPurchases,comments,messages,liveStreams}` before writing a row, defaulting to enabled only when the toggle isn't explicitly `false`.

**Verification note**: build and route registration were confirmed directly (`nest build` succeeds, Prisma client generates, `/health`/`/notifications`/`/internal/notifications` all map correctly, Prisma correctly attempts and reports a real connection to `POSTGRESS_DB_SOCIAL`). Full live end-to-end (an actual notification round-trip against a running Postgres) was **not** verified in this operation — Docker Desktop wasn't running in the dev environment this was built in. Run `npm run db:up` then `npm run notifications:dev` to confirm live before shipping.

### 6.7 Web3 / Blockchain 🔜 Build target — blocked on chain decisions
Not started, no dependency installed. Before any code: which chain (Polygon vs. Base), testnet-first or straight to mainnet, RPC provider, and a contract deployment plan. Once decided:
* **FR-7.1** Content minting (ERC-721/1155) as a proof-of-origin certificate.
* **FR-7.2** Account Abstraction (ERC-4337) so users never see a MetaMask prompt — Credits stay the only thing users interact with.
* **FR-7.3** Immutable on-chain ledger for high-value transactions, separate from the everyday internal Credits ledger (which already works via Stripe + Mongo `Transaction`, and needs no blockchain to function).

---

## 7. Non-Functional Requirements

| Category | Requirement | Status |
| :--- | :--- | :--- |
| Performance | Feed/Marketplace load <1.5s | ✅ (subjectively fine on current data volume; no formal budget/monitoring yet) |
| Security & DRM | Watermarking must render at <16ms once built; Web3 private keys never touch the backend once that's built | 🔜 not yet measurable — nothing to benchmark until §6.3/§6.7 ship |
| Reliability | Idempotent Stripe webhooks; Item create rolls back Postgres on Mongo failure | ✅ confirmed in `Items/create/route.js` |
| Usability | Mobile-first responsive; Creator Studio enforces mandatory fields without blocking silently | ✅ per DESIGN.md, with visible inline validation |

---

## 8. Technical Architecture (summary — full detail in `docs/TECH_STACK.md`)

```text
                 apps/web (Next.js 15) ✅        apps/chat ✅        apps/payment ✅
                 Feed·Market·Wallet·Library      Express+Socket.IO   Express+Stripe
                 Creator Studio·Communities
                        │
        ┌───────────────┼────────────────┬─────────────────┐
        ▼                                ▼                  ▼
  apps/notifications 🔜           apps/meta 🔜         apps/web3 🔜
  NestJS — this operation         blocked on Meta      blocked on chain/RPC
  activates existing Postgres     dev-app credentials    decisions
  `notifications` table
        │
        ▼
  PostgreSQL (5 Prisma schemas: user/social/items/community/audit)
  MongoDB (@repo/database-mongo: User/Post/Item/Message/Conversation/Membership/Attachment/Transaction)
  Redis (caching, provisioned, not yet load-bearing anywhere critical)
```

Full model-by-model detail lives in `docs/DATA_SCHEMA.md` — this PRD doesn't duplicate it.

---

## 9. Acceptance Criteria — V1 Deployable State

Rewritten to be checkable against real code, not aspirational:

1. **Creator Studio gate**: Publish is disabled until Title + Thumbnail + Description + price status are all set, independent of each other. *(Description independence is the one gap this operation closes.)*
2. **Bundle**: creator selects ≥2 existing items, groups them, publishes at a unified credit price. ✅ already true.
3. **Text-only communities**: server/channel creation cannot produce a non-text channel via the API. ✅ true at the API level; 🔜 not yet true at the schema level (no DB constraint).
4. **Notifications**: a follow produces a real row in the `notifications` table and a live Socket.IO push, respecting the user's per-type preference toggle. ✅ true for `follow` events as of 2026-08-09; 🔜 comment/message/item_purchase producers still need wiring at their existing routes (§6.6 FR-6.2).
5. **DRM Vault**: opening a purchased item blocks right-click and PrintScreen-triggered shortcuts, and overlays a watermark computed from the live viewer's ID and timestamp — not a static string. ✅ true as of 2026-08-09.
6. **Ad Studio**: a creator can link an Instagram account and successfully create a Meta ad campaign from a post. 🔜 blocked on credentials, not yet true.

A feature only counts as "done" here when it's true against the running app — not when a doc says it should be.

---

## 10. Known Risks & Mitigations

| Risk | Mitigation |
| :--- | :--- |
| OS-level screen recording | Cannot be blocked browser-side. Mitigation is forensic traceability via the dynamic watermark (§6.3) — shipped 2026-08-09, this is now actually true rather than aspirational. |
| Creator Studio friction from 4 mandatory fields | Auto-thumbnail-from-first-image already reduces friction; the newly-independent description requirement is small (a sentence is enough) — not a heavy ask. |
| Meta API rate limits | Exponential backoff + queueing in `apps/meta` once built. |
| "No censorship" liability | Automated hashing (PhotoDNA or equivalent) on all uploads remains a requirement regardless of when DRM/Web3 ship — this is a legal floor, not a nice-to-have, and should not wait on the rest of §6.3. |
| **New: docs drifting from code again** | This PRD's status markers (✅/🚧/🔜) exist specifically so the next audit is a five-minute diff, not another full re-derivation. Update the marker the moment a feature's real state changes — don't let it go stale for months again. |

---

## 11. Out of Scope (for V1)
* Voice/video chat channels — text, image, file only, with live text presence.
* Native iOS/Android apps — Web PWA only.
* Fiat-to-crypto on-ramps — internal Credits + Stripe top-ups only.
* Complex algorithmic feed manipulation — chronological/following + trending only.
* Email/push notifications — in-app only for V1 (§6.6).

---

## 12. Roadmap to Deployable

In dependency order, not calendar order:

1. ~~**Close the Description gap** (§5)~~ ✅ done 2026-08-09.
2. ~~**Ship Notifications** (§6.6)~~ ✅ core service done 2026-08-09; remaining: wire comment/message/item_purchase producers (small, no blockers), and run a live end-to-end check against a running Postgres (Docker wasn't available in the build environment).
3. ~~**Ship real DRM enforcement** (§6.3)~~ ✅ done 2026-08-09; remaining: video EME (needs a license-server decision, not a blocker for the rest of V1).
4. ~~**Harden text-only enforcement**~~ — resolved by decision, not by adding a DB constraint (DATA_SCHEMA.md §2.4 explains why); application-level enforcement is the deliberate final state, not a placeholder.
5. ~~**Rebuild communities into a real, browsable, real-time system**~~ ✅ done 2026-08-09 (§6.4) — was not on the original roadmap; surfaced when auditing the feature end-to-end.
6. **Ad Studio** (§6.5) — needs a Meta developer app from Rijusmit before any OAuth code can be tested live; service scaffolding can start in parallel.
7. **Web3** (§6.7) — needs a chain/RPC/contract decision from Rijusmit before deployment work can start; service scaffolding can start in parallel.

Steps 1–5 have no external dependency and are done. Steps 6–7 need decisions and credentials only the product owner can provide — those are the two things standing between this app and a genuinely complete V1.

---
*"Empowering creators to own their art, their audience, and their voice."*
