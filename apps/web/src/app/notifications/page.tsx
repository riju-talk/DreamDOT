'use client'

import {
  Bell,
  Bookmark,
  CheckCheck,
  FilePlus2,
  Heart,
  MessageCircle,
  MessageSquare,
  Radio,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserPlus,
} from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Notifications are stored in Postgres and served by /api/notifications (works on Vercel,
// no websocket server needed). The page polls so new events appear within seconds.
const POLL_MS = 8000

interface Notification {
  notification_id: string
  notification_type: string
  notification_content: string
  is_read: boolean
  created_at: string
}

const TYPE_META: Record<string, { icon: typeof Bell; label: string }> = {
  follow: { icon: UserPlus, label: "New follower" },
  item_purchase: { icon: ShoppingBag, label: "Sale" },
  comment: { icon: MessageCircle, label: "Comment" },
  like: { icon: Heart, label: "Like" },
  save: { icon: Bookmark, label: "Saved" },
  post: { icon: FilePlus2, label: "Published" },
  new_post: { icon: FilePlus2, label: "New post" },
  message: { icon: MessageSquare, label: "Message" },
  live_stream: { icon: Radio, label: "Live" },
  welcome: { icon: Sparkles, label: "Welcome" },
  login: { icon: ShieldCheck, label: "Security" },
}

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function NotificationsPage() {
  const { status } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications', { cache: 'no-store' })
      if (!res.ok) throw new Error(`Service responded ${res.status}`)
      const data = await res.json()
      setNotifications(Array.isArray(data?.items) ? data.items : [])
      setError('')
    } catch (err) {
      console.error('[notifications] Failed to load feed:', err)
      setError('Could not load notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status !== 'authenticated') return
    load()
    const timer = setInterval(load, POLL_MS)
    return () => clearInterval(timer)
  }, [status, load])

  const markRead = useCallback((id?: string) => {
    setNotifications((prev) => prev.map((n) => (!id || n.notification_id === id ? { ...n, is_read: true } : n)))
    fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(id ? { id } : {}),
    }).catch((err) => console.error('[notifications] Failed to mark read:', err))
  }, [])

  const unread = notifications.filter((n) => !n.is_read).length

  return (
    <AuthenticatedLayout>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-4 px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary text-xs font-mono tracking-[0.3em] uppercase">
              {unread > 0 ? `${unread} unread` : 'All caught up'}
            </Badge>
            <h1 className="text-4xl font-serif tracking-tight">Notifications</h1>
            <p className="text-muted-foreground mt-2">Likes, comments, follows, saves, sales and account activity, live.</p>
          </div>
          {unread > 0 && (
            <Button variant="outline" className="rounded-full" onClick={() => markRead()}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
          )}
        </div>

        {loading && (
          <Card className="border-border/50">
            <CardContent className="py-16 text-center text-sm text-muted-foreground">Loading…</CardContent>
          </Card>
        )}

        {!loading && error && (
          <Card className="border-border/50">
            <CardContent className="py-16 text-center text-sm text-muted-foreground">{error}</CardContent>
          </Card>
        )}

        {!loading && !error && notifications.length === 0 && (
          <Card className="border-border/50 shadow-[var(--shadow-float)]">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 rounded-2xl bg-primary/10 mb-4">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-serif mb-2">No notifications yet</h3>
              <p className="text-sm text-muted-foreground">When creators interact with your content, you&apos;ll see it here.</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && notifications.length > 0 && (
          <div className="space-y-2">
            {notifications.map((n) => {
              const meta = TYPE_META[n.notification_type]
              const Icon = meta?.icon || Bell
              return (
                <Card
                  key={n.notification_id}
                  className={`border-border/50 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${n.is_read ? '' : 'bg-primary/5 border-primary/20'}`}
                  onClick={() => !n.is_read && markRead(n.notification_id)}
                >
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className={`p-2.5 rounded-xl ${n.is_read ? 'bg-muted' : 'bg-primary/10'}`}>
                      <Icon className={`h-5 w-5 ${n.is_read ? 'text-muted-foreground' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {meta && (
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">{meta.label}</p>
                      )}
                      <p className={`text-sm ${n.is_read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                        {n.notification_content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{relativeTime(n.created_at)}</p>
                    </div>
                    {!n.is_read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
