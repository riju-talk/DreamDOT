'use client'

import { Bell, UserPlus, MessageCircle, ShoppingBag, MessageSquare, Radio } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { io, Socket } from "socket.io-client"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const NOTIFICATIONS_SERVICE_URL = process.env.NEXT_PUBLIC_NOTIFICATIONS_SERVICE_URL || 'http://localhost:3003'

interface Notification {
  notification_id: string
  notification_type: string
  notification_content: string
  is_read: boolean
  created_at: string
}

const TYPE_ICON: Record<string, typeof Bell> = {
  follow: UserPlus,
  item_purchase: ShoppingBag,
  comment: MessageCircle,
  message: MessageSquare,
  live_stream: Radio,
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
  const { data: session } = useSession()
  const token = (session as any)?.chatToken
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return

    let cancelled = false
    setLoading(true)

    fetch(`${NOTIFICATIONS_SERVICE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Service responded ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setNotifications(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        console.error('[notifications] Failed to load feed:', err)
        if (!cancelled) setError('Could not reach the notification service')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token])

  useEffect(() => {
    if (!token) return

    const socket: Socket = io(NOTIFICATIONS_SERVICE_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    })

    socket.on('notification:new', (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev])
    })

    return () => {
      socket.disconnect()
    }
  }, [token])

  const markRead = useCallback(
    (id: string) => {
      if (!token) return
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
      )
      fetch(`${NOTIFICATIONS_SERVICE_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      }).catch((err) => console.error('[notifications] Failed to mark read:', err))
    },
    [token]
  )

  return (
    <AuthenticatedLayout>
      <div className="space-y-8">
        <div>
          <Badge variant="outline" className="mb-4 px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary text-xs font-mono tracking-[0.3em] uppercase">System</Badge>
          <h1 className="text-4xl font-serif tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-2">Stay updated with your creative ecosystem.</p>
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
              const Icon = TYPE_ICON[n.notification_type] || Bell
              return (
                <Card
                  key={n.notification_id}
                  className={`border-border/50 cursor-pointer transition-colors ${n.is_read ? '' : 'bg-primary/5 border-primary/20'}`}
                  onClick={() => !n.is_read && markRead(n.notification_id)}
                >
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className={`p-2 rounded-xl ${n.is_read ? 'bg-muted' : 'bg-primary/10'}`}>
                      <Icon className={`h-5 w-5 ${n.is_read ? 'text-muted-foreground' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
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
