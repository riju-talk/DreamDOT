/**
 * Fire-and-forget dispatch to apps/web3 (the on-chain transaction ledger).
 * Mirrors sendNotification in ./notifications.js — never throws into the caller's
 * request path. Recording a transaction on-chain is best-effort: if the ledger
 * service is unreachable or unconfigured, the purchase / top-up still succeeds.
 *
 * @param {{ kind: 'purchase'|'topup', userId: string, itemId?: string|null, amount: number, ref: string }} entry
 * @returns {Promise<{ txHash: string|null, explorerUrl: string|null, status: string }|undefined>}
 */
export async function recordLedger({ kind, userId, itemId = null, amount, ref }) {
  const serviceUrl = process.env.WEB3_LEDGER_URL || 'http://localhost:3005'
  const serviceSecret = process.env.SERVICE_SECRET

  if (!serviceSecret) {
    console.warn('[web3] SERVICE_SECRET not set — skipping ledger record')
    return
  }

  const response = await fetch(`${serviceUrl}/ledger/record`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-service-secret': serviceSecret,
    },
    body: JSON.stringify({ kind, userId, itemId, amount, ref }),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`web3 ledger responded ${response.status}: ${text}`)
  }

  return response.json()
}
