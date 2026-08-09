# apps/web3

Content minting, on-chain ownership verification, and credit ledger sync. See `docs/PRD.md` §6.7.

## Status: structure only, zero working routes

Unlike `apps/meta` (which just needs credentials), this service is blocked on **architecture decisions**, not a credentials gap:

1. **Which chain** — Polygon or Base, per `docs/TECH_STACK.md`. Testnet-first (Amoy/Sepolia) or straight to mainnet?
2. **RPC provider** — Alchemy, Infura, or a public RPC, and its URL.
3. **Contracts** — an ERC-721/1155 for content and an account-abstraction (ERC-4337) setup for gasless Credits don't exist yet. They need to be written, audited at whatever level the budget allows, and deployed before `/mint` can do anything.
4. **The `ethers` (or `viem`-for-Node) dependency itself** hasn't been added — deliberately. Picking a library version before the chain/tooling (Hardhat vs Foundry) is chosen would be a guess, and the Rules of Engagement are explicit about not adding dependencies without asking first.

Every route in `routes/` returns `501 Not Implemented` with a clear reason rather than pretending to work. This is the honest state of Web3 in this codebase: a placeholder that won't lie to you about being done.

## What NOT to build yet
Don't write real `ethers.js` contract calls against a guessed ABI. Don't pick a chain unilaterally — it's an irreversible-feeling decision (deployed contract addresses, whatever gas gets spent testing) that belongs to Rijusmit.

## Once the decision is made
1. Add the env vars in `.env.example` with real values.
2. Add `ethers` (or the chosen library) to `package.json` explicitly.
3. Deploy the contracts, drop the ABI JSON into a new `contracts/` directory.
4. Fill in `routes/mint.js`, `routes/verify.js`, `routes/ledger.js` against the real ABI.
5. Add a `BlockchainLedger` Mongo model (`docs/DATA_SCHEMA.md` §7 tracks this as pending) once there's something real to log.
