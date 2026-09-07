# apps/web3 — On-chain transaction ledger

A tiny Express service that records DreamDOT credit transactions (purchases and
top-ups) on a public blockchain, as a tamper-evident receipt. It is **best-effort
and optional** — if no chain is configured it still writes a queryable record to
MongoDB and returns `txHash: null`.

## How it works

- `apps/web` calls `POST /ledger/record` (fire-and-forget) after a purchase or a
  credit top-up succeeds. Auth is the shared `x-service-secret` header.
- The service writes a `LedgerEntry` document to Mongo (`@repo/database-mongo`).
- If `RPC_URL` + `WEB3_PRIVATE_KEY` + `CHAIN_ID` are all set, it also sends a
  **0-value transaction from a burner wallet to itself**, with a small JSON
  payload hex-encoded in the transaction's `data` field. No smart contract.
- The resulting transaction hash + explorer link are saved back onto the entry.

## Endpoints

| Method | Path | Notes |
|---|---|---|
| GET | `/health` | no auth; reports `configured` + `chainId` |
| POST | `/ledger/record` | `x-service-secret`; body `{ kind, userId, itemId?, amount, ref }` |
| GET | `/ledger/entries?userId=` | `x-service-secret`; recent entries for a user |

## Running on-chain (optional, free)

Default target is the **Polygon Amoy testnet** (chain id `80002`):

1. Create a burner wallet:
   `node -e "console.log(require('viem/accounts').generatePrivateKey())"`
2. Fund it with free test POL at <https://faucet.polygon.technology> (select "Amoy").
3. Put the private key in `WEB3_PRIVATE_KEY` (see `.env.example`).

Leaving `WEB3_PRIVATE_KEY` blank runs the service in local-only mode — perfectly
fine for demos and CI.

## Deploy

Dockerfile at `apps/web3/Dockerfile` (build context = repo root). See the repo
`DEPLOYMENT.md`.
