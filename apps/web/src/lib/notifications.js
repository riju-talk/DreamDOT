import { prismaSocial } from '@/lib/prisma/social'
import { prismaUser } from '@/lib/prisma/user'

/**
 * Create a notification row in social.notifications.
 *
 * Written straight to Postgres from the web app so notifications work on Vercel, where a
 * long-lived Socket.IO service cannot run. The notifications page polls /api/notifications.
 * Never throws into the caller's request path — a notification failing must never fail the
 * action that triggered it (a like, a follow, a purchase, a message).
 */
export async function sendNotification(userId, type, content) {
  if (!userId) return
  try {
    await prismaSocial.notifications.create({
      data: { user_id: userId, notification_type: type, notification_content: content },
    })
  } catch (err) {
    console.error('[notifications] failed to store notification (non-fatal):', err.message)
  }
}

/** Display name for "<name> liked your post"-style messages. */
export async function actorName(userId) {
  try {
    const u = await prismaUser.users.findUnique({
      where: { id: userId },
      select: { user_profile: { select: { username: true, display_name: true } } },
    })
    return u?.user_profile?.display_name || u?.user_profile?.username || 'Someone'
  } catch {
    return 'Someone'
  }
}

/** Notify many users at once (e.g. a creator's followers when they publish). */
export async function sendNotificationToMany(userIds, type, content) {
  const ids = [...new Set((userIds || []).filter(Boolean))]
  if (!ids.length) return
  try {
    await prismaSocial.notifications.createMany({
      data: ids.map((user_id) => ({ user_id, notification_type: type, notification_content: content })),
    })
  } catch (err) {
    console.error('[notifications] failed to store bulk notifications (non-fatal):', err.message)
  }
}
