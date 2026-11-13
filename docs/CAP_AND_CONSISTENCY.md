# CAP, Consistency and Failure Handling in DreamDOT

DreamDOT is a small distributed system: one Next.js app (GraphQL + REST), three backend
services, two databases of different kinds, and a blockchain. This note explains, per
piece of data, **which side of the CAP theorem we chose and why**. It is deliberately
short; the point is the reasoning, not the vocabulary.

## 1. CAP in one paragraph

When the network between nodes **P**artitions (or a node is simply unreachable), a system
must pick: stay **C**onsistent (refuse/err rather than return stale or divergent data) or
stay **A**vailable (keep answering, accept that replicas/stores may temporarily disagree).
"CA" is not a real option for a distributed system because partitions happen. So the real
question is *what do we do during a partition* - and the answer should depend on the data.

## 2. The map

```
                 Browser
                    |  GraphQL / REST  (apps/web, stateless)
        +-----------+-----------------------------+
        |                                         |
  Postgres (user_d, social,           Mongo (post bodies, messages,
  items_d, community, audit)          ledger entries)
  = source of truth                   = document store
        |
        +--HTTP(fire&forget)--> notifications --> websocket push
        +--HTTP(fire&forget)--> web3 ledger --> EVM chain (audit trail)
        +--JWT verified by--->  chat (Socket.IO)
```

| Data | Store | Choice | Why |
|---|---|---|---|
| Users, passwords, **credit balance**, purchases | Postgres | **CP** (consistency) | Money-like state must never be double-spent or lost. A single Postgres primary gives linearizable writes; during a failure we return an error rather than guess. |
| Post existence, comments, likes, counters | Postgres | **CP** | Relational integrity (FKs, cascade deletes). Counters are denormalised and *recomputable*. |
| Post body and media | Mongo | **AP-leaning** | Large, schemaless, read-heavy; a briefly missing body is acceptable. |
| Notifications | notifications service | **AP** | Best effort. Losing one "X commented" push is fine; blocking a comment because the notifier is down is not. |
| On-chain ledger | chain via web3 | **AP / eventually consistent** | It is an audit trail. If the chain or service is down the purchase still succeeds; the entry is still written to Mongo with `status: failed | local-only`, so a repair job can retry it (there is no automatic retry yet). |
| Chat messages | Mongo via Socket.IO | **AP** | Delivery over availability; clients re-sync history on reconnect. |

The principle: **put the strong guarantee only where wrong data is expensive** (balance),
and let everything derived or peripheral degrade gracefully.

## 3. Concrete patterns in the code

### 3.1 Cross-store write = Saga with compensation (`lib/services/posts.js`)
A post lives in two databases. We do **not** use two-phase commit: 2PC makes the write
available only when *both* stores are, and holds locks across a network round-trip.
Instead:

1. Insert metadata in Postgres (source of truth).
2. Insert the body in Mongo.
3. If step 2 fails, **compensate**: delete the Postgres row, return an error.

Trade-off: between 1 and 2 a reader can see a post whose body is not there yet - a window of
*eventual consistency*. Readers must tolerate it (the feed reads `content` from Postgres,
which is why it is duplicated there).

### 3.2 Atomic increments instead of read-modify-write (`lib/services/credits.js`)
`initial_balance: { increment: n }` compiles to `UPDATE ... SET x = x + n`. Two concurrent
top-ups cannot overwrite each other (the classic lost-update anomaly) because the database
serialises the row update. No application-level lock is needed for a single-row counter.

### 3.3 Fire-and-forget to non-critical services
`sendNotification` and `recordLedger` are called without `await` and with a `.catch` that
only logs. The request path never depends on their availability. This is the "A" in AP
made explicit: a downstream outage cannot take comments or purchases down with it.

### 3.4 Idempotency (`scripts/seed-demo.mjs`, ledger `ref`)
Seed ids are deterministic UUIDv5s and all writes are upserts, so re-running is safe -
the same property you want for any retried request in an at-least-once world. The ledger
entry carries a `ref` (the Postgres transaction id) as the natural idempotency key; the index on
`ref` is not yet UNIQUE, so de-duplicating retries is a documented follow-up.

### 3.5 Stateless web tier, shared auth secret
The web app holds no session state in memory (JWT/cookie), so it scales horizontally and
survives restarts. `JWT_SECRET` is shared so chat/notifications can verify tokens without
calling web (no synchronous dependency = fewer failure modes).

## 4. What we knowingly did NOT build (and what we would add)

* **Postgres replication / failover** - single primary. At scale: streaming replicas for
  reads (reads become eventually consistent) with synchronous commit for the balance path.
* **Outbox pattern** for notifications/ledger. Today a crash after the DB commit but before
  the HTTP call loses that event. The fix: write an `outbox` row in the *same* Postgres
  transaction, and have a worker deliver it with retries (at-least-once + idempotent consumer).
* **Seller credit on purchase** - a paid purchase debits the buyer but does not yet credit
  the seller (known gap). Fixing it correctly means debiting and crediting in **one**
  Postgres transaction.
* **Rate limiting / backpressure** on GraphQL (query depth/cost limits).

## 5. Interview cheat-sheet

* *"Is your system CP or AP?"* - Per data class. Balance/identity: CP. Feed bodies,
  notifications, chain audit trail: AP with eventual consistency.
* *"How do you keep Postgres and Mongo in sync without 2PC?"* - Ordered writes + compensating
  action (saga); Postgres is the source of truth; readers tolerate the gap.
* *"What happens if the notifications service is down?"* - Comments still succeed; the push
  is dropped (documented trade-off; outbox is the upgrade path).
* *"Why GraphQL here?"* - One schema is the contract for the browser *and* sibling services
  (`x-service-secret`); field-level resolution + a per-request batch loader avoids N+1.
