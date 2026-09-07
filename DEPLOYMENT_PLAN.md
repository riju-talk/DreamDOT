# DreamDOT — Deployment-Ready Plan (4 services, split deploy)

> Status: **IMPLEMENTED 2026-09-07** on branch `deploy/split-services-demo-credits`
> (commit `44ae080`, not pushed). All 8 phases applied. `npm run build` (turbo, 5 tasks)
> is green; `next build` verified stable across 3 consecutive runs.
> See `DEPLOYMENT.md` for the operator guide. Remaining manual steps: rotate leaked
> secrets, create + fund an Amoy burner wallet (optional), provide production DB
> connection strings, run `prisma db push` for the 5 schemas on the target DB. Docker
> images were not build-tested locally (Docker Desktop was offline) — CI's `docker` job
> covers that on first push.

## Context

DreamDOT is a Turborepo monorepo (Next.js 15 web + Express/NestJS backends + hybrid
Postgres/Mongo). The docs (`docs/PRD.md`, `docs/TECH_STACK.md`, `docs/DATA_SCHEMA.md`,
`docs/RULES_OF_ENGAMENT.md`) describe a V1 that is ~80% built but not deployable:

- **No per-service deploy config** (no Dockerfiles, no host config).
- **`turbo build` is flaky** — the custom webpack `done` hook in `apps/web/next.config.ts`
  races Next's manifest writer and fails intermittently with
  `ENOENT ... .next/server/pages-manifest.json` (direct `next build` succeeds; under turbo it fails).
- **`apps/payment` (Stripe) is half-built and unwanted** — this is a product demo, not a
  real store. Remove it and replace with a demo credit system.
- **`apps/web3` is a stub** (every route returns 501) — want a *minimal, free*
  on-chain transaction record.
- **CI is broken** — `.github/workflows/ci.yml` calls a non-existent `npm run postinstall`
  and never builds the backends.
- **Secret exposure** — `.env` (with real OAuth client secrets, `NEXTAUTH_SECRET`,
  `JWT_SECRET`, `SERVICE_SECRET`, ImageKit key) was committed in git history
  (e.g. commits `550902d`, `8edcd0e`, historical `App/.env`). Repo is public: `github.com/riju-talk/DreamDot`.

### Target deployment topology

| Service | Host | Mechanism |
|---|---|---|
| `apps/web` | **Vercel** | Native Next.js. **No `vercel.json` / no Vercel config files** — everything via `next.config.ts` + Vercel dashboard env vars. |
| `apps/chat` | Fly.io / Railway | **Dockerfile** (persistent Socket.IO server) |
| `apps/notifications` | Fly.io / Railway | **Dockerfile** (NestJS + Socket.IO gateway) |
| `apps/web3` | Fly.io / Railway | **Dockerfile** (new minimal ledger service) |
| `apps/payment` | — | **Deleted** |
| `apps/meta` | — | Untouched (still a stub, not in scope) |

Databases: **not provisioned here** — may move to Neon soon; Redis stays Docker.
Plan only writes connection-string env docs + `prisma db push` steps.

### Product changes

1. **Remove `apps/payment` + all Stripe code**, keep the `/wallet` page layout intact.
2. **Every new account starts with 100 credits** (currently defaults to 50000).
3. **Free self-serve top-up** — a button that just increments the balance. No payment.
4. **Optional review on top-up** — "write a review if they want to pay for their credits";
   saved to the existing `reviews` table.
5. **No "pay to continue" gate** — purchases just spend credits as today.
6. **Record purchases + top-ups on a free testnet** via `apps/web3` (best-effort, never blocking).

### Rules of Engagement constraints (must hold)

- `apps/web/src/app/api/**/route.*` → **`.js` only**, no `NextRequest`/`NextResponse` types.
- Backend services → JS or Python only (NestJS/TS in `apps/notifications` is the one
  pre-existing documented exception; not extending it).
- No new deps without calling it out (blockchain lib is called out below).
- No silent `catch {}`; structured JSON errors `{ error, code }`; log every caught error.

---

## Phase 0 — Secrets & safety (documentation only, no code)

Create `DEPLOYMENT.md` (repo root) with a **Secret Rotation Checklist**:

- `.env` is in git history — treat every value ever in it as compromised. Before going live, rotate:
  - `NEXTAUTH_SECRET`, `JWT_SECRET`, `SERVICE_SECRET` (`openssl rand -base64 32`)
  - Google / GitHub / Discord OAuth **client secrets** (regenerate in each provider console)
  - `IMAGEKIT_PRIVATE_KEY`
  - Any Postgres/Mongo credentials that appeared in `.env`
- `JWT_SECRET` must be **identical** across `apps/web`, `apps/chat`, `apps/notifications`
  (chat token in `apps/web/src/lib/auth.ts` `jwt` callback is verified by the other two).
- `SERVICE_SECRET` must be identical across `apps/web`, `apps/chat`, `apps/web3`,
  `apps/notifications` (internal `x-service-secret` calls).
- Optional history purge: document `git filter-repo --path .env --path App/.env --invert-paths`
  as a manual step (do **not** run it as part of this work — it rewrites history).

No live secret values are touched by this plan.

---

## Phase 1 — Remove `apps/payment` + Stripe

**Delete:**
- `apps/payment/` (whole directory)
- `apps/web/src/app/api/checkout/route.js`, `apps/web/src/app/api/checkout/confirm/route.js`
- `apps/web/src/app/payment/page.tsx` (+ the `payment` dir)
- `apps/web/src/app/checkout/**` if present

**Edit:**
- `package.json` (root): remove `payment:dev`; rewrite `dev:all` to
  `concurrently "npm run dev" "npm run chat:dev" "npm run notifications:dev" "npm run web3:dev"`;
  add `web3:dev` / `web3:build` / `web3:start` scripts mirroring the `notifications:*` ones.
- `turbo.json`: remove `payment-service#dev`; add `web3-service#dev` (cache:false, persistent);
  add `@repo/database-mongo#build` inputs/outputs (see Phase 5).
- `apps/web/middleware.ts`: drop the `/payment/:path*` matcher entry.
- `apps/web` env + `.env` + new `.env.example`: remove `NEXT_PUBLIC_PAYMENT_SERVER_URL`,
  `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `CLIENT_URL` (payment-only).
- Strip payment/Stripe copy & links (keep pages valid) from:
  `apps/web/components/app-sidebar.tsx`, `apps/web/src/components/landing-page.tsx`,
  `apps/web/src/components/settings/integrations-tab.tsx`,
  `apps/web/src/app/terms/page.tsx`, `apps/web/src/app/privacy/page.tsx`.
- `README.md`, `docs/TECH_STACK.md`, `docs/PRD.md` (§6, §8, §12), `docs/DATA_SCHEMA.md`
  (§1.8, §0 table): mark payment service removed, `Transaction` (Mongo) now written only by
  `apps/web3` ledger + top-up route, credits are demo.

Note: `apps/payment/src/models/Transaction.js` is already deleted in the working tree —
this formalizes that. The Mongo `Transaction` model in `@repo/database-mongo` **stays**
(used by `/api/transactions` and the new ledger).

---

## Phase 2 — Demo credit system

**Effective balance field = `users.initial_balance`** (Postgres `user` schema `Float @db.Real`,
also mirrored as a cross-ref in `social` + `items` schemas). The purchase route already
reads/writes it via `prismaItems.users.initial_balance`. Mongo `User.credits` is **not**
used by the purchase path — leave it, don't wire new logic to it.

### 2a. 100 credits on account creation
- `apps/web/src/lib/prisma/user.schema.prisma`: `initial_balance Float @default(100) @db.Real`
  (also update the identical cross-ref `users` blocks in `social.schema.prisma` &
  `items.schema.prisma` so the schemas stay consistent). Requires `prisma db push` on deploy.
- `apps/web/src/app/api/auth/signup/route.js`: add `initial_balance: 100` to `tx.users.create({ data: ... })`.
- `apps/web/src/lib/auth.ts` (`signIn` callback, OAuth new-user branch, ~line 103):
  add `initial_balance: 100` to `prismaUser.users.create({ data: ... })`.
- `DEPLOYMENT.md`: note existing rows are unaffected by the default change — that's fine
  for a fresh deploy; for existing dev data, a one-off `UPDATE users SET initial_balance = 100`.

### 2b. Balance API — fix and make real
Rewrite `apps/web/src/app/api/balance/route.js` (currently buggy: `intitial_balance` typo,
`prismaSocial.transactions` with non-existent `seller_id`/`transaction_type`, Mongo-style `$or`):
- `GET` → auth → look up `prismaUser.users` by email → return
  `{ balance: { credits }, stats: { totalSpent, totalEarned } }` using
  `prismaItems.transactions` aggregates on real columns (`buyer_id`, `amount`, `payment_status`).
- Keep `apps/web/src/app/api/balance/get/route.js` / `update/route.js` only if referenced;
  otherwise fold into the single route. (Verify references during implementation.)

### 2c. Free top-up route (new, `.js`)
`apps/web/src/app/api/balance/topup/route.js`:
- `POST { amount:number, review?: { rating:number, text:string } }`, auth required.
- Validate `amount` is a positive number ≤ a sane cap (e.g. 100000).
- `prismaUser.users.update` → `initial_balance: { increment: amount }`.
- Write a `prismaItems.transactions` row: `{ buyer_id, item_id: null?, amount, payment_status: 'completed' }`
  — **needs `transactions.item_id` nullable** (see 2e) OR use a dedicated marker; decide in impl,
  prefer nullable.
- If `review` present → write to `reviews` table (see 2e).
- Fire-and-forget `recordLedger({ kind: 'topup', userId, amount, ref })` (Phase 3 helper).
- Return `{ success, newBalance }`.

### 2d. Wallet UI — de-Stripe, keep layout
- `apps/web/src/app/wallet/components/TopUpModal.tsx`: remove `CREDIT_PACKAGES` /
  Stripe redirect / `/api/checkout` call. Keep the modal shell, animations, styling.
  New body: a numeric credits amount (quick-pick chips: 100 / 500 / 1000 + custom),
  an **optional** "Leave a review" section (star rating + textarea) with copy explaining
  "payments are a demo — top up free, and leave a review if this were a paid product".
  Submit → `POST /api/balance/topup` → toast + refresh balance.
- `apps/web/src/app/wallet/components/BalanceCard.tsx`: read from fixed `/api/balance`.
- `apps/web/src/app/wallet/components/TransactionHistory.tsx` + `/api/transactions`:
  point at real `prismaItems.transactions` for the user; drop any mock rows.
- `apps/web/src/app/wallet/page.tsx`: keep layout; wire the "Add credits" button to the modal.

### 2e. Schema tweaks for reviews / platform top-ups
In `apps/web/src/lib/prisma/items.schema.prisma`:
- `reviews.item_id String?` (nullable) + `reviews.review_type String? @default("item")`
  (values `"item"` | `"platform"`). Relation to `items` becomes optional.
- `transactions.item_id String?` (nullable) so a top-up row needs no item; relation optional.
- Apply via `prisma db push` (repo has no migration history — documented convention).
- Update `docs/DATA_SCHEMA.md` §2.3 accordingly.

---

## Phase 3 — Purchase + top-up → on-chain record (web app side)

New helper `apps/web/src/lib/web3.js` (plain `.js`, mirrors `apps/web/src/lib/notifications.js`):
```js
export async function recordLedger({ kind, userId, itemId, amount, ref }) {
  const url = process.env.WEB3_LEDGER_URL;            // e.g. https://dreamdot-web3.fly.dev
  const secret = process.env.SERVICE_SECRET;
  if (!url || !secret) { console.warn('[web3] ledger not configured — skipping'); return; }
  const res = await fetch(`${url}/ledger/record`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-service-secret': secret },
    body: JSON.stringify({ kind, userId, itemId, amount, ref }),
  });
  if (!res.ok) throw new Error(`ledger ${res.status}: ${await res.text().catch(()=> '')}`);
  return res.json(); // { txHash, explorerUrl } | { txHash: null, skipped }
}
```
Call sites (both **fire-and-forget**, wrapped in `.catch(err => console.error(...))`, never awaited in the response path):
- `apps/web/src/app/api/Items/[id]/purchase/route.js` — after step 8 (balance update) succeeds.
- `apps/web/src/app/api/balance/topup/route.js` — after the increment.

Optionally surface `txHash`/`explorerUrl` in the purchase response + a "Blockchain receipt"
line in `TransactionHistory.tsx`. Nice-to-have, not required for deploy.

---

## Phase 4 — `apps/web3` as a minimal free on-chain ledger

**Design (simplest thing that is genuinely on-chain and costs nothing real):**
- Chain: **Polygon Amoy testnet** (`chainId 80002`). Free test POL from the official faucet.
- **No smart contract.** The service sends a **0-value self-transaction** whose `data` field
  is a hex-encoded JSON payload `{ v:1, kind, userId, itemId, amount, ref, ts }`.
  This produces a real, permanent, publicly-verifiable tx on PolygonScan Amoy.
- Library: **`viem`** (add to `apps/web3/package.json` deps — single lib, first-class Node
  support, lighter than `ethers`). The one new dependency; called out per RoE.
- **Every write also persists to Mongo** so there's a queryable record even when the chain
  is unconfigured or the RPC is down.

**New Mongo model** `apps/database-mongo/src/models/LedgerEntry.ts` (+ export in `src/index.ts`):
```
{ userId: String, kind: 'purchase'|'topup', itemId: String?, amount: Number,
  ref: String, txHash: String?, chainId: Number?, explorerUrl: String?,
  status: 'onchain'|'local-only'|'failed', createdAt: Date }
```
Update `docs/DATA_SCHEMA.md` §7 (Web3) — this replaces the "no schema yet" note.

**`apps/web3` files:**
- `package.json`: add `viem`; add `@repo/database-mongo` dep; `build`/`start`/`dev` scripts
  (`dev` = `nodemon server.js`, `start` = `node server.js`, `build` = no-op placeholder so
  turbo has a target — or omit and don't add a turbo build task).
- `lib/chain.js` (new): lazily builds a `viem` wallet client from `RPC_URL` + `WEB3_PRIVATE_KEY`
  + `CHAIN_ID`; exposes `isConfigured()` and `sendLedgerTx(payload) -> { txHash, explorerUrl }`.
- `routes/ledger.js`: replace the 501 stub with
  - `POST /ledger/record` — `x-service-secret` guard; validate body; write `LedgerEntry`
    (status `local-only`); if `isConfigured()` → `sendLedgerTx` → update entry to `onchain`
    with `txHash`; on chain error → status `failed`, still 200 with `{ txHash: null }`.
    **Never 5xx for a chain problem** — the web app treats this as best-effort.
  - `GET /ledger/entries?userId=` — `x-service-secret` guard; returns that user's entries.
- `routes/mint.js`, `routes/verify.js`: prefer deleting them + their mounts to reduce surface;
  update `README.md`. (Alternative: keep returning 501.)
- `middleware/configured.js`: **relax** — remove the hard `requireWeb3Config` gate on
  `/ledger`. The route self-degrades. Keep a soft `configured` boolean in `/health`.
- `server.js`: keep `dotenv` line but make the missing-file case silent (it already is);
  add `HOST` bind, `SERVICE_SECRET` check log, graceful `SIGTERM`/`SIGINT` shutdown +
  Mongo connect on boot (`connectToDatabase`), `unhandledRejection`/`uncaughtException` logs
  (match `apps/chat/server.js` conventions).
- `.env.example`: fill in —
  ```
  PORT=3005
  HOST=0.0.0.0
  CORS_ORIGIN=http://localhost:5000
  SERVICE_SECRET=            # MUST match apps/web
  MONGODB_URI=
  # --- on-chain (optional; leave blank to run local-only) ---
  CHAIN_ID=80002
  RPC_URL=https://rpc-amoy.polygon.technology
  WEB3_PRIVATE_KEY=          # 0x… burner key, funded from https://faucet.polygon.technology (Amoy)
  EXPLORER_BASE=https://amoy.polygonscan.com
  ```
- `apps/web3/README.md`: rewrite — "minimal calldata ledger on Polygon Amoy, best-effort,
  degrades to Mongo-only". Include the **one manual step**: create a burner wallet
  (`viem` snippet or MetaMask), fund it at the Amoy faucet, put the key in `WEB3_PRIVATE_KEY`.

---

## Phase 5 — Dockerfiles for `chat`, `notifications`, `web3`

Shared approach (build context = **repo root**, because all three use the
`@repo/database-mongo` workspace package):

- Root `.dockerignore` (new): `node_modules`, `**/node_modules`, `.next`, `.turbo`, `dist`,
  `**/dist`, `.git`, `.env*`, `apps/web`, `apps/meta`.
- `apps/<svc>/Dockerfile` (new, one per service) — multi-stage, `node:20-alpine`:
  1. `deps` stage: copy `package.json`, `package-lock.json`, `turbo.json`,
     `apps/<svc>/package.json`, `apps/database-mongo/package.json` → `npm ci`.
  2. `build` stage: copy `apps/database-mongo` + `apps/<svc>` source →
     `npm run build -w @repo/database-mongo` (tsc) →
     for chat/notifications: `npm run build -w <svc>` (runs `prisma generate` [+ `nest build`]).
  3. `runtime` stage: copy built `apps/database-mongo/dist`, `apps/<svc>`, pruned
     `node_modules`; `USER node`; `EXPOSE <port>`;
     `HEALTHCHECK CMD wget -qO- http://localhost:<port>/health || exit 1`;
     `CMD ["node", "server.js"]` (chat/web3) / `CMD ["node", "dist/main.js"]` (notifications).
  Ports: chat 3001, notifications 3003, web3 3005.
- `apps/database-mongo/package.json`: rely on the explicit Dockerfile build step (don't add
  `prepare` — it fires on every `npm ci` and slows CI). Add `@repo/database-mongo#build` to
  `turbo.json` `build` task with `outputs: ["dist/**"]` so `npm run build` at root compiles it.
- `apps/chat/server.js` line 2 & `apps/web3/server.js` line 2: the hardcoded
  `dotenv ... '../../.env'` path resolves to nothing inside a container — harmless (no throw),
  real env comes from the platform. Add a comment; optionally guard with `fs.existsSync`.
- Per-service host config: add `apps/<svc>/fly.toml` (Fly.io) for chat/notifications/web3
  (internal port, `[[services]]` http/tcp, health check path `/health`, `[env]` non-secret only).
  Railway users can ignore these and point Railway at the Dockerfile. (`fly.toml` ≠ a Vercel file.)

---

## Phase 6 — `apps/web` for Vercel (no Vercel config files)

- **`apps/web/next.config.ts`**: **delete** the entire custom `webpack(config,{isServer})`
  block (the `CopyPrismaGenerated` `done` hook). It targets `.next/standalone/...` which
  isn't produced (`output` is commented out) and it's the cause of the flaky
  `pages-manifest.json` ENOENT under turbo. Keep `images.remotePatterns`,
  `experimental.optimizePackageImports`. Keep `typescript.ignoreBuildErrors: true` for now.
  Change `eslint.ignoreDuringBuilds` → `false` **only after** `npm run lint` passes (Phase 7).
- **Prisma generate on Vercel**: `apps/web/package.json` →
  `"build": "npm run prisma:generate && next build"` and
  `"prisma:generate": "prisma generate --schema=src/lib/prisma/user.schema.prisma && … (×5)"`.
  Add the same as `"postinstall"`. Confirm the 5 schemas' `output` dirs (`src/lib/generated/*`)
  match the imports in `src/lib/prisma/*.ts` (they do: `../generated/<name>`).
- **binaryTargets**: schemas currently have
  `["native", "debian-openssl-3.0.x", "windows"]` — **add `"rhel-openssl-3.0.x"`** (Vercel's
  Lambda runtime) to all 5.
- **Stop committing generated clients** (recommended): `git rm -r --cached
  apps/web/src/generated apps/web/src/lib/generated`, add both to `.gitignore`
  (`apps/web/src/**/generated/`), rely on build-time generate. Removes ~360 tracked files
  incl. platform-specific `.node` engine binaries. (Alternative: keep committed + just add the
  `rhel` target above.)
- **DB access during `next build`**: `apps/web/src/app/discover/page.tsx` and
  `apps/web/src/app/api/posts/feed/route.js` hit Postgres at build (static generation) and
  currently **fall back to fake data** (violates RoE "no mock data"). Fix:
  - Add `export const dynamic = 'force-dynamic'` (and `export const revalidate = 0`) to
    `discover/page.tsx` and any other page that reads a DB at module/render time
    (`feed`, `marketplace`, `communities` — audit during impl).
  - Remove the fake-data fallback branches; on DB error return an empty result + a
    rendered error/empty state (`console.error` the real error first).
  This makes the Vercel build succeed with **no database reachable**.
- **Env for Vercel dashboard** (documented in `DEPLOYMENT.md`, table form):
  `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (= prod domain), `JWT_SECRET`, `SERVICE_SECRET`,
  OAuth id/secret ×3 + `NEXT_PUBLIC_*_OAUTH_ENABLED`, `MONGODB_URI`, `MONGODB_DB_NAME`,
  `POSTGRESS_DB_{USER,SOCIAL,ITEMS,COMMUNITY,AUDIT}`, `REDIS_URL`,
  `IMAGEKIT_PRIVATE_KEY` + `NEXT_PUBLIC_IMAGEKIT_*`,
  `NEXT_PUBLIC_CHAT_SERVER_URL` (Fly URL), `NEXT_PUBLIC_NOTIFICATIONS_URL` (Fly URL),
  `NOTIFICATIONS_SERVICE_URL` (server-side, Fly URL), `WEB3_LEDGER_URL` (Fly URL),
  `CORS_ORIGIN`. **Removed**: all `STRIPE_*`, `NEXT_PUBLIC_PAYMENT_SERVER_URL`.
- Add a committed `apps/web/.env.example` (none exists today) with every var above, values blank.
- Node version: root `engines.node` is `>=18`; Vercel defaults to 20 — add
  `"engines": { "node": "20.x" }` to `apps/web/package.json` and a root `.nvmrc` (`20`).

---

## Phase 7 — CI (`.github/workflows/ci.yml`)

Rewrite:
- `actions/setup-node@v4` with `node-version: 20`, `cache: npm`.
- `npm ci` (lockfile present at root ✓).
- **Remove** `npm run postinstall` step (non-existent).
- `npm run lint` — `turbo lint`. Fix lint errors surfaced, or keep `continue-on-error: true`
  for now with a follow-up — but **do not** leave build broken.
- `npm run check-types` — **fix the mismatch first**: root `package.json` has
  `"type-check": "turbo type-check"` but `turbo.json` defines `check-types` and no app has a
  `type-check`/`check-types` script. Add `"check-types"` to web + notifications
  (`tsc --noEmit`), rename the root script to `check-types`.
- `npm run build` — now builds `@repo/database-mongo` + web + chat + notifications via turbo.
  Provide dummy env (`JWT_SECRET`, `POSTGRESS_DB_*=postgresql://x`, `MONGODB_URI=mongodb://x`)
  — Prisma **generate** doesn't need a live DB, and web build is now `force-dynamic`.
- New job `docker` (matrix over chat/notifications/web3): `docker build -f apps/<svc>/Dockerfile .`
  to catch Dockerfile regressions.

---

## Phase 8 — Documentation

- **`DEPLOYMENT.md`** (new, root) — the deliverable:
  - Per-service: build command, start command, required env (tables), health check URL.
  - Web → Vercel: import repo, set root dir `apps/web`, framework Next.js, env vars, deploy.
  - chat / notifications / web3 → Fly: `fly launch --no-deploy`, `fly secrets set …`, `fly deploy`.
  - DB bootstrap: `prisma db push` for each of the 5 schemas; Mongo — models auto-create
    collections + indexes on first connect.
  - Blockchain: burner wallet + Amoy faucet steps; "leave `WEB3_PRIVATE_KEY` blank to run
    ledger in local-only mode".
  - Secret rotation checklist (Phase 0).
  - Cross-service secret-consistency matrix (`JWT_SECRET`, `SERVICE_SECRET`).
- Update `README.md` (services table, ports, local dev, "no payment"), `apps/chat/README.md`
  (deploy section → Docker/Fly not PM2), `docs/PRD.md`, `docs/TECH_STACK.md`,
  `docs/DATA_SCHEMA.md` (payment removed, credits demo, web3 ledger real, `reviews`/`transactions`
  nullable columns, `LedgerEntry` model).

---

## Critical files (by phase)

| Area | Files |
|---|---|
| Payment removal | `apps/payment/**` (del), `package.json`, `turbo.json`, `apps/web/src/app/api/checkout/**` (del), `apps/web/src/app/payment/**` (del), `apps/web/middleware.ts` |
| Credits | `apps/web/src/lib/prisma/{user,social,items}.schema.prisma`, `apps/web/src/app/api/auth/signup/route.js`, `apps/web/src/lib/auth.ts`, `apps/web/src/app/api/balance/route.js`, `apps/web/src/app/api/balance/topup/route.js` (new), `apps/web/src/app/api/transactions/route.js`, `apps/web/src/app/wallet/components/{TopUpModal,BalanceCard,TransactionHistory}.tsx`, `apps/web/src/app/wallet/page.tsx` |
| Reviews | `apps/web/src/lib/prisma/items.schema.prisma`, review write in `topup/route.js` |
| Web3 client | `apps/web/src/lib/web3.js` (new), `apps/web/src/app/api/Items/[id]/purchase/route.js` |
| Web3 service | `apps/web3/{server.js,package.json,README.md,.env.example}`, `apps/web3/routes/ledger.js`, `apps/web3/lib/chain.js` (new), `apps/web3/middleware/configured.js`, `apps/database-mongo/src/models/LedgerEntry.ts` (new) + `src/index.ts` |
| Docker | `apps/{chat,notifications,web3}/Dockerfile` (new), `apps/{chat,notifications,web3}/fly.toml` (new), root `.dockerignore` (new), `apps/database-mongo/package.json`, `turbo.json` |
| Web/Vercel | `apps/web/next.config.ts`, `apps/web/package.json`, `apps/web/.env.example` (new), `apps/web/src/app/discover/page.tsx`, `apps/web/src/app/api/posts/feed/route.js`, 5× `*.schema.prisma` (`binaryTargets`), `.gitignore`, `.nvmrc` (new) |
| CI | `.github/workflows/ci.yml`, root `package.json` (scripts), per-app `package.json` (`check-types`) |
| Docs | `DEPLOYMENT.md` (new), `README.md`, `apps/chat/README.md`, `docs/{PRD,TECH_STACK,DATA_SCHEMA}.md` |

## Reused existing patterns
- `apps/web/src/lib/notifications.js` + `apps/chat/notifications.js` → template for
  `apps/web/src/lib/web3.js` (fire-and-forget, `x-service-secret`, graceful skip when unconfigured).
- `apps/chat/server.js` graceful-shutdown / signal / uncaught-handler block → template for `apps/web3/server.js`.
- `apps/notifications/src/auth/service-auth.guard.ts` → the `x-service-secret` check shape for `apps/web3` ledger route.
- `apps/chat/prisma-client.js` global-singleton pattern → any Prisma use.
- Existing `reviews` / `transactions` models in `items.schema.prisma` → extended, not replaced.

---

## Verification

**Local build & static checks**
1. `npm ci`
2. `npm run build` → all turbo tasks green (`@repo/database-mongo`, `dreamdot`, `chat-server`,
   `notifications-server`). Confirm the `pages-manifest.json` ENOENT is gone (run 3×).
3. `npm run lint` and `npm run check-types` → green (or scoped as agreed).

**Docker**
4. `docker build -f apps/chat/Dockerfile .` / `notifications` / `web3` → all succeed.
5. `docker run --env-file … -p 3001:3001 <chat>` then `curl localhost:3001/health` → 200.
   Repeat for notifications (`:3003/health`) and web3 (`:3005/health`, `configured:false` OK).

**Local end-to-end** (`docker-compose up -d` for mongo/pg/redis)
6. `prisma db push` ×5 schemas; start web + chat + notifications + web3 (`npm run dev:all`).
7. Sign up a new user → check `users.initial_balance = 100` in Postgres.
8. `/wallet` → "Add credits" → submit amount + a review → balance increases; a `transactions`
   row (item_id null) + a `reviews` row (`review_type='platform'`) exist; web3 service logs a
   `LedgerEntry` (and a `txHash` + PolygonScan Amoy link **iff** `WEB3_PRIVATE_KEY` funded).
9. Buy a public item you can afford → credits deducted, `transactions` row, seller gets a
   notification (live via notifications socket), web3 `LedgerEntry` (kind `purchase`).
10. Buy with insufficient credits → `402 Insufficient balance` (no gate modal — expected).
11. If chain configured: open `https://amoy.polygonscan.com/tx/<hash>` → tx visible with
    decodable calldata.

**Web on Vercel**
12. Vercel preview deploy (root dir `apps/web`) with **no database env reachable** → build
    succeeds (dynamic pages, generate-only Prisma). Then add real env → pages render.
13. `NEXTAUTH_URL` + OAuth redirect URIs updated in provider consoles → sign-in works.

**CI**
14. Push a branch → CI runs lint / check-types / build / docker-build jobs → green.

---

## Open / manual steps for the user (not blockers for most of the work)
- Create + fund an Amoy burner wallet (or leave web3 in local-only mode).
- Rotate the exposed secrets (Phase 0 checklist) before real launch.
- Provide production DB connection strings (Neon/Atlas/managed Redis) when ready.
- Decide: stop committing generated Prisma clients (recommended) vs. keep + add `rhel` binary target.
