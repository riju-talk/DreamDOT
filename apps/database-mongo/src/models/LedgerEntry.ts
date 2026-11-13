import mongoose from 'mongoose';

/**
 * A queryable record of a credit transaction that apps/web3 attempts to mirror
 * on-chain (a 0-value self-transaction carrying the payload as calldata, on a
 * free testnet). The Mongo row is always written; `txHash`/`explorerUrl` are
 * filled in only when the chain write succeeds. `status`:
 *  - 'onchain'     — written to Mongo AND confirmed/broadcast on-chain
 *  - 'local-only'  — Mongo only; the web3 service has no chain configured
 *  - 'failed'      — Mongo written, but the chain write threw
 */
const LedgerEntrySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    kind: { type: String, enum: ['purchase', 'topup'], required: true, index: true },
    itemId: { type: String, default: null },
    amount: { type: Number, required: true, min: 0 },
    ref: { type: String, required: true }, // Postgres transaction_id this mirrors
    txHash: { type: String, default: null },
    chainId: { type: Number, default: null },
    explorerUrl: { type: String, default: null },
    status: {
      type: String,
      enum: ['onchain', 'local-only', 'failed'],
      default: 'local-only',
      index: true,
    },
    error: { type: String, default: null },
  },
  { timestamps: true }
);

LedgerEntrySchema.index({ userId: 1, createdAt: -1 });
LedgerEntrySchema.index({ ref: 1 });

export const LedgerEntry =
  mongoose.models.LedgerEntry || mongoose.model('LedgerEntry', LedgerEntrySchema);
