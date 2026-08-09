# apps/notifications

NestJS service that activates the `notifications` table already defined in `apps/web/src/lib/prisma/social.schema.prisma` — that table existed with zero producers and zero consumers before this service. See `docs/DATA_SCHEMA.md` §6 and `docs/PRD.md` §6.6 for the full rationale.

## Why NestJS, when everything else is Express

A scoped exception — see `docs/TECH_STACK.md` §5. Every other backend service (`chat`, `payment`, and the planned `meta`/`web3`) stays Express per the Rules of Engagement. Notifications is the one place where "many event sources feed one consumer" benefits from Nest's module/DI system, and it's a good place to establish a typed event-ingestion pattern before more event-emitting services exist.

## Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/notifications` | User JWT (Bearer) | List the current user's notifications, newest first |
| PATCH | `/notifications/:id/read` | User JWT (Bearer) | Mark one notification read |
| POST | `/internal/notifications` | `x-service-secret` header | Called by other DreamDOT services to create a notification |
| GET | `/health` | none | Liveness check, matches `apps/chat`'s `/health` |

Socket.IO: on connect, a client joins room `user:<userId>` (same JWT-in-handshake pattern as `apps/chat`). New notifications are pushed as `notification:new`.

## Notification types

Exactly five, each mapped 1:1 to an existing toggle in the Mongo `User.notifications.types{}` object: `follow`, `item_purchase`, `comment`, `message`, `live_stream`. A type is only added here once a matching preference toggle exists — see `notifications.service.ts`.

## Calling it from another service

```js
// apps/web/src/lib/notifications.js exports sendNotification(userId, type, content) —
// fire-and-forget, never throws into the caller's request path. Wired into the follow
// route (apps/web/src/app/api/users/[id]/follow/route.js) as the first real producer.
```

## Local development

```bash
cd apps/notifications
cp .env.example .env   # fill in with the same values as apps/web/.env
npm install
npm run dev             # :3003, prisma generate runs first
```

## What this does NOT do (yet)

Email and push notifications are explicitly out of scope for V1 (see PRD.md §6.6/FR-6.5) — in-app REST + Socket.IO only. The `emailNotifications`/`pushNotifications` boolean toggles already exist on the Mongo `User` model for a future phase, but nothing sends anything through them today.
