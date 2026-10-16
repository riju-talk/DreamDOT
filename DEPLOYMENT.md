# DreamDOT — Deployment Guide

Four services, deployed separately:

| Service | Host | How |
|---|---|---|
| `apps/web` | **Vercel** | Native Next.js (no `vercel.json` — configure in the dashboard) |
| `apps/chat` | **Render free** (Fly.io / Railway alternatives) | Docker — `apps/chat/Dockerfile` + `apps/chat/fly.toml` |
| `apps/notifications` | **Render free** (Fly.io / Railway alternatives) | Docker — `apps/notifications/Dockerfile` + `fly.toml` |
| `apps/web3` | **Render free** (Fly.io / Railway alternatives) | Docker — `apps/web3/Dockerfile` + `fly.toml` |

`apps/payment` was removed — the credit economy is a demo (100 credits on signup,
free top-ups). `apps/meta` remains an un-deployed stub.

---

## 0. Secret rotation — do this first

`.env` was committed to git history (commits `550902d`, `8edcd0e`, and older
`App/.env` paths). The repo is public. **Treat every value that was ever in `.env`
as compromised** and rotate before going live:

- [ ] `NEXTAUTH_SECRET`, `JWT_SECRET`, `SERVICE_SECRET` → `openssl rand -base64 32`
- [ ] Google / GitHub / Discord OAuth **client secrets** → regenerate in each provider console
- [ ] `IMAGEKIT_PRIVATE_KEY`
- [ ] Any Postgres / Mongo credentials that appeared in `.env`

Optional (rewrites history — coordinate with anyone who has a clone):
```bash
pipx run git-filter-repo --path .env --path App/.env --invert-paths
git push --force
```

### Secrets that MUST match across services

| Secret | Used by |
|---|---|
| `JWT_SECRET` | web (mints the token), chat, notifications (verify it) |
| `SERVICE_SECRET` | web, chat, notifications, web3 (internal `x-service-secret` calls) |

---

## 0b. Free-tier path (all $0): Vercel + Render + Neon + Atlas

| Piece | Free service | Notes |
|---|---|---|
| Web | Vercel Hobby | Root Directory `apps/web`, Node 22 |
| chat / notifications / web3 | Render free web services | `render.yaml` blueprint at repo root |
| Postgres | Neon free | One database, 5 schemas (`?schema=user_d` etc.) |
| Mongo | MongoDB Atlas M0 | Allow `0.0.0.0/0` in Network Access (Render/Vercel IPs are dynamic) |
| Chain (optional) | Polygon Amoy testnet | Faucet POL; skip for local-only ledger |

Order (each step is checkable before the next):
1. **Neon + Atlas:** create both, copy connection strings. For Neon use the *direct* (non-pooled) URL
   for `npm run db:push`; use the *pooled* URL (`-pooler` host, add `&pgbouncer=true&connection_limit=1`)
   in Vercel. Then locally: set the 5 `POSTGRESS_DB_*` vars, `npm run db:push`, `npm run db:seed`.
2. **Render:** New -> Blueprint -> this repo. Fill the prompts (`JWT_SECRET`, `SERVICE_SECRET`,
   `MONGODB_URI`, the two Postgres URLs, `NOTIFICATIONS_SERVICE_URL`). `CORS_ORIGIN` can be a
   placeholder until Vercel gives you the domain; then update and redeploy chat/notifications/web3.
   Check `https://<svc>.onrender.com/health` for each.
3. **Vercel:** import repo, Root Directory `apps/web`, add env vars from `apps/web/.env.example`,
   pointing the service URLs at the `*.onrender.com` hosts. Deploy.
4. **Keepalive:** in GitHub repo Variables set `CHAT_URL`, `NOTIFICATIONS_URL`, `WEB3_URL`; the
   `keepalive.yml` workflow then stops Render's 15-minute sleep.
5. Run the checks in section 5, with the Render hosts instead of `*.fly.dev`.

Free-tier limits to expect: first request after idle can take 30-60s, Atlas M0 and Neon pause or
cap connections under load. Fine for a demo; not for production traffic.

---

## 1. Databases

Bring up Postgres + Mongo + Redis (managed, or `docker compose up -d` locally).

Push the 5 Postgres schemas with the ordered helper (do not loop `prisma db push` by hand -
`user_d` tables are declared in several schema files and push order matters, see
`apps/web/scripts/db-push.mjs`):

```bash
npm run db:push        # needs POSTGRESS_DB_* in the environment
npm run db:seed        # optional: demo users/posts/comments (idempotent)
```

Mongo collections + indexes are created automatically on first connect by
`@repo/database-mongo`.

> The `users.initial_balance` column now defaults to **100**. Existing rows are not
> changed by the default — for an existing DB run once:
> `UPDATE user_d.users SET initial_balance = 100 WHERE initial_balance = 50000;`

---

## 2. `apps/web` → Vercel

1. **Import the repo** in Vercel. Set **Root Directory** to `apps/web`.
   Framework preset: Next.js. Build command / install command: leave as default
   (`npm run build` runs `prebuild` → `prisma generate` for all schemas automatically).
2. **Environment Variables** (Project → Settings → Environment Variables) — see
   `apps/web/.env.example` for the full list. The service URLs must point at the
   deployed Fly apps:
   - `NEXT_PUBLIC_CHAT_SERVER_URL` = `https://dreamdot-chat.fly.dev`
   - `NEXT_PUBLIC_NOTIFICATIONS_URL` = `https://dreamdot-notifications.fly.dev`
   - `NOTIFICATIONS_SERVICE_URL` = `https://dreamdot-notifications.fly.dev`
   - `WEB3_LEDGER_URL` = `https://dreamdot-web3.fly.dev`
   - `NEXTAUTH_URL` = your Vercel domain
   - `CORS_ORIGIN` = your Vercel domain
3. **OAuth redirect URIs** — add `https://<domain>/api/auth/callback/{google,github,discord}`
   in each provider console.
4. Deploy. The build succeeds with **no database reachable** (all pages are dynamic,
   Prisma only *generates*).

Prisma query-engine binary for Vercel's runtime (`rhel-openssl-3.0.x`) is already
in `binaryTargets` for every schema.

---

## 3. `apps/chat`, `apps/notifications`, `apps/web3` → Fly.io (paid alternative; free path is section 0b)

Each has a `Dockerfile` (build context = **repo root**) and a `fly.toml`.

```bash
# one-time, per service
fly launch --no-deploy -c apps/chat/fly.toml

# secrets (never commit these)
fly secrets set -c apps/chat/fly.toml \
  JWT_SECRET=... SERVICE_SECRET=... \
  MONGODB_URI=... POSTGRESS_DB_COMMUNITY=... \
  NOTIFICATIONS_SERVICE_URL=https://dreamdot-notifications.fly.dev

fly deploy -c apps/chat/fly.toml --dockerfile apps/chat/Dockerfile
```

Per-service secrets:

| Service | Secrets to set |
|---|---|
| chat | `JWT_SECRET`, `SERVICE_SECRET`, `MONGODB_URI`, `POSTGRESS_DB_COMMUNITY`, `NOTIFICATIONS_SERVICE_URL` |
| notifications | `JWT_SECRET`, `SERVICE_SECRET`, `MONGODB_URI`, `POSTGRESS_DB_SOCIAL` |
| web3 | `SERVICE_SECRET`, `MONGODB_URI`, *(optional)* `WEB3_PRIVATE_KEY` |

Non-secret config (ports, RPC URL, chain id) is in each `fly.toml` `[env]`.

Health checks: `GET /health` on 3001 / 3003 / 3005.

**Railway instead of Fly:** point a new service at the repo, set the Dockerfile
path (`apps/<svc>/Dockerfile`), root directory `/`, and add the same env vars.

---

## 4. Blockchain ledger (`apps/web3`) — optional

`apps/web3` records every purchase and top-up. By default it writes only a Mongo
`LedgerEntry`. To also write to a real (test) chain:

1. Generate a burner key:
   `node -e "console.log(require('viem/accounts').generatePrivateKey())"`
2. Fund it with free test POL at <https://faucet.polygon.technology> (network: **Amoy**).
3. `fly secrets set -c apps/web3/fly.toml WEB3_PRIVATE_KEY=0x...`

Transactions then appear at `https://amoy.polygonscan.com/tx/<hash>`.
Chain id / RPC / explorer are preset for Polygon Amoy in `apps/web3/fly.toml`.

---

## 5. Verify

- `curl https://dreamdot-chat.fly.dev/health` → `{"status":"OK",...}` (and notifications, web3)
- Sign up on the Vercel site → new account shows **100 credits** at `/wallet`
- `/wallet` → **Add Credits** (+ optional review) → balance rises; a row appears in
  `items_d.transactions` (kind `topup`) and `items_d.reviews` (`review_type` `platform`)
- Buy a public item you can afford → credits deducted, seller gets a live notification
- `apps/web3` logs a `LedgerEntry`; if `WEB3_PRIVATE_KEY` is funded, a `txHash` +
  PolygonScan link
