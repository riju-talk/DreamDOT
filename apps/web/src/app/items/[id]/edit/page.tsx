'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface EditForm {
  title: string
  category: string
  price: string
  description: string
  script: string
  tags: string
  visibility: 'public' | 'private' | 'unlisted'
}

const CATEGORIES = [
  'writing', 'illustration', 'audio', 'video', 'research', 'design', 'code', 'template', 'other',
  'art', 'photography', 'animation', 'music', '3d', 'education',
]

export default function ItemEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [notOwner, setNotOwner] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<EditForm>({
    title: '',
    category: 'other',
    price: '',
    description: '',
    script: '',
    tags: '',
    visibility: 'public',
  })

  useEffect(() => {
    if (!id || id === 'undefined') {
      setLoading(false)
      setNotFound(true)
      return
    }

    const load = async () => {
      try {
        const res = await fetch(`/api/Items/${id}`)
        if (!res.ok) {
          setNotFound(true)
          return
        }
        const data = await res.json()
        const currentUserId = (session as any)?.user?.id
        if (currentUserId && data.creator?.id && data.creator.id !== currentUserId) {
          setNotOwner(true)
          setLoading(false)
          return
        }
        setForm({
          title: data.title || '',
          category: data.category || 'other',
          price: data.price != null ? String(data.price) : '0',
          description: data.description || '',
          script: data.metadata?.script || '',
          tags: (data.tags || []).join(', '),
          visibility: data.visibility || 'public',
        })
      } catch (e) {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, session])

  const update = (patch: Partial<EditForm>) => setForm((f) => ({ ...f, ...patch }))

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }
    if (form.script.trim().length < 10) {
      setError('Content must be at least 10 characters')
      return
    }

    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/Items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category,
          description: form.description.trim(),
          script: form.script.trim(),
          priceCredits: parseFloat(form.price) || 0,
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
          visibility: form.visibility,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save changes')
        return
      }
      router.push(`/items/${data.itemId || id}`)
      router.refresh()
    } catch (e) {
      setError('Something went wrong while saving')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="max-w-3xl mx-auto py-8 px-4 lg:px-8 space-y-6">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </AuthenticatedLayout>
    )
  }

  if (notOwner) {
    return (
      <AuthenticatedLayout>
        <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
          <h1 className="text-2xl font-bold">You can only edit your own items</h1>
          <Link href={`/items/${id}`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to item
            </Button>
          </Link>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (notFound) {
    return (
      <AuthenticatedLayout>
        <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
          <h1 className="text-2xl font-bold">Item not found</h1>
          <Link href="/marketplace">
            <Button variant="outline">Browse marketplace</Button>
          </Link>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-3xl mx-auto py-8 px-4 lg:px-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link href={`/items/${id}`} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Item</h1>
            <p className="text-sm text-muted-foreground">Update your asset details — changes apply immediately</p>
          </div>
        </div>

        <Card className="dream-card border-border/50">
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                maxLength={140}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="Give your asset a clear title"
              />
              <p className="text-xs text-muted-foreground">{form.title.length}/140</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => update({ category: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (credits)</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => update({ price: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <div className="flex gap-2">
                {(['public', 'private', 'unlisted'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => update({ visibility: v })}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      form.visibility === v
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    {v[0].toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dream-card border-border/50">
          <CardHeader>
            <CardTitle>Description & Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                rows={3}
                maxLength={2000}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="Short blurb about this asset (shown as the item summary)"
              />
              <p className="text-xs text-muted-foreground">{form.description.length}/2000</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="script">Content</Label>
              <Textarea
                id="script"
                value={form.script}
                rows={10}
                maxLength={5000}
                onChange={(e) => update({ script: e.target.value })}
                placeholder="The actual content of the asset — for writing items this is stored as HTML"
              />
              <p className="text-xs text-muted-foreground">{form.script.length}/5000</p>
              {form.category === 'writing' && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-medium text-muted-foreground">Preview</p>
                  <div
                    className="rounded-lg border border-border/50 bg-card/50 p-4 text-sm text-muted-foreground leading-relaxed [&_p]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_strong]:font-semibold [&_strong]:text-foreground"
                    dangerouslySetInnerHTML={{ __html: form.script }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={form.tags}
                onChange={(e) => update({ tags: e.target.value })}
                placeholder="fantasy, story, dialogue"
              />
              <div className="flex flex-wrap gap-1 pt-1">
                {form.tags.split(',').map((t) => t.trim()).filter(Boolean).map((t) => (
                  <Badge key={t} variant="secondary" className="bg-primary/10 text-primary">#{t}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">{error}</p>
        )}

        <div className="flex items-center gap-3 justify-end">
          <Button variant="outline" onClick={() => router.push(`/items/${id}`)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
