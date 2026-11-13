const express = require('express');
const { LedgerEntry } = require('@repo/database-mongo');
const { isConfigured, sendLedgerTx, CHAIN_ID } = require('../lib/chain');

const router = express.Router();

// Service-to-service auth — same shared secret every internal call uses.
function requireServiceSecret(req, res, next) {
  const provided = req.get('x-service-secret');
  if (!process.env.SERVICE_SECRET || provided !== process.env.SERVICE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized', code: 'BAD_SERVICE_SECRET' });
  }
  next();
}

/**
 * POST /ledger/record
 * Body: { kind: 'purchase'|'topup', userId, itemId?, amount, ref }
 *
 * Always writes a Mongo LedgerEntry. If a chain is configured, also broadcasts a
 * 0-value calldata tx and records the hash. A chain failure never turns into a
 * 5xx — the caller treats this whole endpoint as best-effort.
 */
router.post('/record', requireServiceSecret, async (req, res) => {
  try {
    const { kind, userId, itemId = null, amount, ref } = req.body || {};

    if (!['purchase', 'topup'].includes(kind) || !userId || amount == null || !ref) {
      return res.status(400).json({
        error: 'kind (purchase|topup), userId, amount and ref are required',
        code: 'INVALID_BODY',
      });
    }

    const entry = await LedgerEntry.create({
      kind,
      userId,
      itemId,
      amount: Number(amount),
      ref: String(ref),
      status: 'local-only',
    });
    console.log(`[web3] ledger entry ${entry._id} recorded (${kind}, ref ${ref})`);

    if (!isConfigured()) {
      return res.json({ txHash: null, explorerUrl: null, status: 'local-only', id: entry._id });
    }

    try {
      const payload = {
        v: 1,
        kind,
        userId,
        itemId,
        amount: Number(amount),
        ref: String(ref),
        ts: Date.now(),
      };
      const { txHash, explorerUrl, chainId } = await sendLedgerTx(payload);
      entry.txHash = txHash;
      entry.explorerUrl = explorerUrl;
      entry.chainId = chainId;
      entry.status = 'onchain';
      await entry.save();
      console.log(`[web3] ledger entry ${entry._id} on-chain: ${txHash}`);
      return res.json({ txHash, explorerUrl, status: 'onchain', id: entry._id });
    } catch (chainErr) {
      console.error('[web3] on-chain write failed:', chainErr.message);
      entry.status = 'failed';
      entry.error = chainErr.message;
      await entry.save();
      return res.json({ txHash: null, explorerUrl: null, status: 'failed', id: entry._id });
    }
  } catch (error) {
    console.error('[web3] /ledger/record error:', error);
    return res.status(500).json({ error: 'Internal server error', code: 'INTERNAL' });
  }
});

/**
 * GET /ledger/entries?userId=&limit=
 */
router.get('/entries', requireServiceSecret, async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required', code: 'MISSING_USER_ID' });
    }
    const limit = Math.min(100, parseInt(req.query.limit, 10) || 25);
    const entries = await LedgerEntry.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return res.json({ entries, chainId: CHAIN_ID, configured: isConfigured() });
  } catch (error) {
    console.error('[web3] /ledger/entries error:', error);
    return res.status(500).json({ error: 'Internal server error', code: 'INTERNAL' });
  }
});

module.exports = router;
