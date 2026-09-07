# DreamDOT

DreamDOT is a creator-first platform for writing, reading, visual publishing, direct collaboration, and monetization.

## What this project includes

- **Web app (`apps/web`)**: Next.js 15 product interface with feed, creator workspace, auth, wallet, settings, and API routes. Deploys to **Vercel**.
- **Chat service (`apps/chat`)**: Express + Socket.IO real-time messaging service. Deploys as a **Docker** container (Fly.io / Railway).
- **Notification service (`apps/notifications`)**: NestJS REST + Socket.IO service for cross-service events. **Docker**.
- **Web3 ledger (`apps/web3`)**: Express service that records purchases + credit top-ups on a free testnet (best-effort, degrades to Mongo-only). **Docker**.
- **Shared Mongo layer (`apps/database-mongo`)**: centralized Mongoose connection + shared models used by every backend.

> The internal **credit economy is a demo** — every new account starts with 100 credits and can top up for free. There is no payment processor (`apps/payment` was removed).

## Stack

- Next.js (App Router)
- React + Tailwind CSS
- Express + Socket.IO, NestJS
- Mongoose + MongoDB
- Prisma + PostgreSQL
- viem (Polygon Amoy testnet, ledger only)

## Monorepo structure

```txt
apps/
  web/             # product UI + Next API routes  -> Vercel
  chat/            # websocket + REST chat backend  -> Docker
  notifications/   # NestJS notification service    -> Docker
  web3/            # on-chain transaction ledger    -> Docker
  database-mongo/  # shared mongoose connection and models
  meta/            # Ad Studio stub (not deployed)
packages/
  ui/
  eslint-config/
  typescript-config/
docs/
  mongoose-schemas.json
```

## Local development

```bash
npm install
npm run dev:all          # web + chat + notifications + web3
# or individually: npm run dev / chat:dev / notifications:dev / web3:dev
docker compose up -d     # mongo + postgres + redis
```

Default local ports:
- Web: `5000`
- Chat: `3001`
- Notifications: `3003`
- Web3 ledger: `3005`

## Environment variables

Copy `apps/<service>/.env.example` to `apps/<service>/.env`. Values needed:
- MongoDB (`MONGODB_URI`)
- PostgreSQL / Prisma (`POSTGRESS_DB_*`, 5 schemas)
- NextAuth / JWT (`NEXTAUTH_SECRET`, `JWT_SECRET`, `SERVICE_SECRET` — the last two must match across services)
- Media provider keys (ImageKit), CORS origins
- `apps/web3` only: `RPC_URL` / `WEB3_PRIVATE_KEY` (optional — see `apps/web3/README.md`)

See **`DEPLOYMENT.md`** for the full per-service deploy guide.

## Data modeling

All Mongo collections are documented in:
- `docs/mongoose-schemas.json`

The shared source of truth for Mongo models lives in:
- `apps/database-mongo/src/models/*`

## Production notes

- All backend services connect through the shared `@repo/database-mongo` package.
- Credits are a demo: 100 on signup, free top-ups, optional review, on-chain record via `apps/web3`.
- Next.js API routes are JavaScript files for easier runtime debugging.
- Deploy: `apps/web` → Vercel; `apps/chat` / `apps/notifications` / `apps/web3` → Docker. See `DEPLOYMENT.md`.
