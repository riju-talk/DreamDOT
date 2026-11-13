/**
 * Fire-and-forget dispatch to apps/notifications. Mirrors apps/web/src/lib/notifications.js —
 * same shape, plain JS/no path aliases since this runs in a separate Express process.
 * Never throws into the caller's request/socket-handler path.
 */
async function sendNotification(userId, type, content) {
  const serviceUrl = process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3003';
  const serviceSecret = process.env.SERVICE_SECRET;

  if (!serviceSecret) {
    console.warn('[notifications] SERVICE_SECRET not set — skipping notification dispatch');
    return;
  }

  const response = await fetch(`${serviceUrl}/internal/notifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-service-secret': serviceSecret,
    },
    body: JSON.stringify({ userId, type, content }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`notifications service responded ${response.status}: ${text}`);
  }
}

module.exports = { sendNotification };
