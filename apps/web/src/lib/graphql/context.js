import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaUser } from '@/lib/prisma/user'

/**
 * Tiny DataLoader: collects every `load(id)` made in the same tick and answers them with
 * ONE `findMany`. Without it, a feed of 10 posts would fire 10 author queries (the N+1
 * problem GraphQL is famous for). One instance is created per request, so the cache can
 * never leak data between users.
 */
function createUserLoader() {
  const cache = new Map() // id -> Promise<User|null>
  let pending = new Set()
  let scheduled = false

  const flush = async () => {
    const ids = [...pending]
    pending = new Set()
    scheduled = false
    try {
      const rows = await prismaUser.users.findMany({
        where: { id: { in: ids } },
        select: { id: true, user_profile: { select: { username: true, display_name: true, avatar_url: true } } },
      })
      const byId = new Map(rows.map((r) => [r.id, r]))
      ids.forEach((id) => cache.get(id).resolve(byId.get(id) ?? null))
    } catch (err) {
      ids.forEach((id) => cache.get(id).reject(err))
    }
  }

  return {
    load(id) {
      if (!cache.has(id)) {
        let resolve, reject
        const promise = new Promise((res, rej) => ((resolve = res), (reject = rej)))
        cache.set(id, Object.assign(promise, { resolve, reject }))
        pending.add(id)
        if (!scheduled) {
          scheduled = true
          queueMicrotask(flush)
        }
      }
      return cache.get(id)
    },
  }
}

/**
 * Resolve WHO is calling. Two kinds of callers, one schema:
 *   1. Browser  -> NextAuth session cookie.
 *   2. Service  -> `x-service-secret` header (+ optional `x-user-id` to act on a user's
 *                  behalf). This is how apps/chat, apps/notifications and apps/web3 can
 *                  consume the same API instead of reaching into web's databases.
 */
export async function buildContext({ request }) {
  let userId = null

  const secret = request.headers.get('x-service-secret')
  if (secret && process.env.SERVICE_SECRET && secret === process.env.SERVICE_SECRET) {
    userId = request.headers.get('x-user-id')
  } else {
    const session = await getServerSession(authOptions)
    if (session?.user?.email) {
      const row = await prismaUser.users.findUnique({ where: { email: session.user.email }, select: { id: true } })
      userId = row?.id ?? null
    }
  }

  return { userId, users: createUserLoader() }
}
