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

## Quick start (5 commands)

```bash
npm install
docker compose --profile app up -d --build   # mongo, postgres, redis + chat, notifications, web3 + local EVM chain
npm run db:push                              # create all Postgres tables (5 Prisma schemas, safe order)
npm run db:seed                              # 5 demo users (bcrypt), 10 posts, comments, likes - idempotent
npm run dev                                  # web on http://localhost:5000
```

Demo login: `ava@dreamdot.dev` (also `ben`, `cleo`, `dev`, `eli`) / `DreamDot#2026`.

Verify everything works end to end (needs the stack above running):

```bash
npm run test:graphql     # 12 checks: auth guard, seeded login, createPost/addComment/topUp, service auth
npm run test:e2e         # 28 checks: signup, purchases, balances, on-chain ledger tx hashes
```

## API: GraphQL first

`POST /api/graphql` (GraphiQL at the same URL in dev). Schema: `apps/web/src/lib/graphql/typeDefs.js`.
Resolvers are thin; business rules live in `apps/web/src/lib/services/*` and are shared by the GraphQL
resolvers and the legacy REST routes, so the two cannot drift. Sibling services can call the same
endpoint with `x-service-secret` + `x-user-id` headers.

```graphql
{ feed(limit: 5) { posts { content likeCount author { username } comments { content } } } }
mutation { topUp(amount: 25) { newBalance } }
```

## Architecture and trade-offs

See [`docs/CAP_AND_CONSISTENCY.md`](docs/CAP_AND_CONSISTENCY.md) - which data is CP vs AP, the
Postgres+Mongo saga, atomic balance updates, and what we deliberately did not build.

Default local ports: web `5000`, chat `3001`, notifications `3003`, web3 ledger `3005`,
local chain (anvil) `8545`, Postgres `5433`, Mongo `27017`, Redis `6379`.

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
