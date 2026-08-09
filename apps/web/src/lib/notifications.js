/**
 * Fire-and-forget dispatch to apps/notifications. Never throws into the caller's
 * request path — a notification failing to send must never fail the action that
 * triggered it (a follow, a purchase, a message).
 */
export async function sendNotification(userId, type, content) {
  const serviceUrl = process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3003'
  const serviceSecret = process.env.SERVICE_SECRET

  if (!serviceSecret) {
    console.warn('[notifications] SERVICE_SECRET not set — skipping notification dispatch')
    return
  }

  const response = await fetch(`${serviceUrl}/internal/notifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-service-secret': serviceSecret,
    },
    body: JSON.stringify({ userId, type, content }),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`notifications service responded ${response.status}: ${text}`)
  }
}
