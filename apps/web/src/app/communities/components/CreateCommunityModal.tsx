'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Loader2, X } from 'lucide-react'

interface CreateCommunityModalProps {
  open: boolean
  onClose: () => void
  onCreated: (community: any) => void
}

/**
 * Shared "create a community" modal — used by both the standalone /communities
 * page and the Communities tab on /messages, so there's exactly one implementation
 * of this flow rather than two forks of the same form.
 */
export function CreateCommunityModal({ open, onClose, onCreated }: CreateCommunityModalProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      setIsCreating(true)
      setError('')
      const res = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create community')
      }

      onCreated(data.community)
      setFormData({ name: '', description: '' })
      onClose()
    } catch (err) {
      console.error('[CreateCommunityModal] Error creating community:', err)
      setError(err instanceof Error ? err.message : 'Failed to create community')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-card border border-border rounded-2xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black italic font-serif text-foreground">Create Community</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground" type="button">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Community Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Product Design Team"
                  maxLength={100}
                  className="w-full bg-muted rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What's this community about?"
                  className="w-full bg-muted rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating || !formData.name.trim()} className="flex-1">
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
