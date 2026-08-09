const express = require('express');
const router = express.Router();

/**
 * POST /ledger/sync
 * NOT IMPLEMENTED. Once a chain exists, this is where a high-value platform
 * Transaction (Mongo, apps/database-mongo) gets mirrored on-chain as an
 * immutable receipt. The everyday internal Credits ledger already works
 * without this — see docs/PRD.md §6.7 FR-7.3 — so this is additive, not a
 * blocker for anything else shipping.
 */
router.post('/sync', async (req, res) => {
  res.status(501).json({
    error: 'On-chain ledger sync not implemented',
    detail: 'Requires the same chain/contract decision as minting — see apps/web3/README.md.',
  });
});

module.exports = router;
