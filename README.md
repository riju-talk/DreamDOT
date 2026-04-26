# DreamDOT

DreamDOT is a creator-first platform for writing, reading, visual publishing, direct collaboration, and monetization.

## What this project includes

- **Web app (`apps/web`)**: Next.js 15 product interface with feed, creator workspace, auth, settings, and API routes.
- **Chat service (`apps/chat`)**: Express + Socket.IO real-time messaging service.
- **Payment service (`apps/payment`)**: Express + Stripe service for checkout, webhooks, and credit transactions.
- **Shared Mongo layer (`apps/database-mongo`)**: centralized Mongoose connection + shared models used by web/chat/payment.

## Stack

- Next.js (App Router)
- React + Tailwind CSS
- Express + Socket.IO
- Stripe
- Mongoose + MongoDB
- Prisma + PostgreSQL

## Monorepo structure

```txt
apps/
  web/             # product UI + Next API routes
  chat/            # websocket + REST chat backend
  payment/         # stripe and credits backend
  database-mongo/  # shared mongoose connection and models
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
npm run dev
npm run chat:dev
# in another terminal
cd apps/payment && npm run dev
```

Default local ports:
- Web: `5000`
- Chat: `3001`
- Payment: `3002`

## Environment variables

Project expects `.env` values for:
- MongoDB (`MONGODB_URI` or `MONGO_CLUSTER`)
- PostgreSQL / Prisma schemas
- NextAuth / JWT
- Stripe (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `CLIENT_URL`)
- CORS and media provider keys

## Data modeling

All Mongo collections are documented in:
- `docs/mongoose-schemas.json`

The shared source of truth for Mongo models lives in:
- `apps/database-mongo/src/models/*`

## Production notes

- All services are designed to connect through the shared mongoose package.
- Stripe webhooks are idempotent at transaction level.
- Next.js API routes are JavaScript files for easier runtime debugging.
