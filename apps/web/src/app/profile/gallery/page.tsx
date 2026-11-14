'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, Heart, MessageSquare, ImageIcon } from 'lucide-react'
import { AuthenticatedLayout } from '@/components/authenticated-layout'

interface Post {
  id: string
  content: string
  media: { url: string }[]
  analytics: { likes_count: number; comments_count: number }
}

interface GalleryItem {
  postId: string
  url: string
  caption: string
  likes: number
  comments: number
}

export default function ProfileGalleryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin?callbackUrl=%2Fprofile%2Fgallery')
  }, [status, router])

  useEffect(() => {
    const userId = session?.user?.id
    if (!userId) return
    ;(async () => {
      try {
        const res = await fetch(`/api/users/${userId}/content`)
        if (res.ok) {
          const data = await res.json()
          const posts: Post[] = data.posts || []
          setItems(
            posts.flatMap((p) =>
              (p.media || [])
                .filter((m) => m?.url)
                .map((m) => ({
                  postId: p.id,
                  url: m.url,
                  caption: p.content,
                  likes: p.analytics?.likes_count ?? 0,
                  comments: p.analytics?.comments_count ?? 0,
                }))
            )
          )
        }
      } catch (error) {
        console.error('Error loading gallery:', error)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [session?.user?.id])

  return (
    <AuthenticatedLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-foreground">My Gallery</h1>
          <Link href="/profile" className="text-sm font-bold text-primary hover:underline">
            Back to profile
          </Link>
        </div>

        {status === 'loading' || isLoading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No photos or videos yet. Posts with media will show up here.</p>
            <Link href="/create" className="inline-block mt-4 text-primary font-bold hover:underline">
              Create a post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {items.map((item, i) => (
              <button
                key={`${item.postId}-${i}`}
                onClick={() => router.push(`/posts/${item.postId}`)}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
              >
                <Image src={item.url} alt={item.caption || 'Gallery item'} fill className="object-cover" />
                <div className="absolute inset-0 flex items-end justify-center gap-4 bg-black/50 pb-3 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {item.likes}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {item.comments}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
