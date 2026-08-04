'use client'

import { useCreatorStudioStore } from '@/lib/store/useCreatorStudioStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Search } from 'lucide-react'
import { PricingPart } from './PricingPart'

interface BundleItem {
  id: string
  title: string
  price: number
  category: string
}

export function BundlePart() {
  const { draft, updateDraft, errors } = useCreatorStudioStore()
  const [items, setItems] = useState<BundleItem[]>([])
  const [filteredItems, setFilteredItems] = useState<BundleItem[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/Items/my-items')
        if (!response.ok) throw new Error('Failed to fetch items')

        const data = await response.json()
        // Map database items to BundleItem interface
        const mappedItems: BundleItem[] = data.items.map((item: any) => ({
          id: item._id,
          title: item.title,
          price: item.price || 0,
          category: item.category || 'other',
        }))

        setItems(mappedItems)
        setFilteredItems(mappedItems)
      } catch (error) {
        console.error('Failed to fetch items:', error)
        setItems([])
        setFilteredItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleSearch = (q: string) => {
    setSearch(q)
    setFilteredItems(items.filter((item) => item.title.toLowerCase().includes(q.toLowerCase())))
  }

  const toggleItem = (id: string) => {
    const newIds = draft.bundleItemIds.includes(id) ? draft.bundleItemIds.filter((i) => i !== id) : [...draft.bundleItemIds, id]
    updateDraft({ bundleItemIds: newIds })
  }

  const selectedItems = items.filter((i) => draft.bundleItemIds.includes(i.id))
  const subtotal = selectedItems.reduce((sum, i) => sum + i.price, 0)
  const discount = subtotal * 0.2 // 20% discount
  const total = subtotal - discount

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label className="text-foreground text-sm font-semibold">Search Items</Label>
        <div className="relative mt-2">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by title..."
            className="bg-card border-border/50 text-foreground placeholder:text-muted-foreground pl-9"
          />
        </div>
      </div>

      {/* Available Items */}
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading items...
        </div>
      ) : (
        <div>
          <h3 className="text-foreground font-semibold mb-3">Available Items ({filteredItems.length})</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredItems.map((item) => (
              <label key={item.id} className="flex items-center gap-3 p-3 bg-card border border-border/50 rounded cursor-pointer hover:border-primary/50 transition-colors">
                <Checkbox
                  checked={draft.bundleItemIds.includes(item.id)}
                  onCheckedChange={() => toggleItem(item.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground truncate text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
                <span className="text-primary font-semibold text-sm whitespace-nowrap">${item.price}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Selected Items */}
      {selectedItems.length > 0 && (
        <div>
          <h3 className="text-foreground font-semibold mb-3">Selected Items ({selectedItems.length})</h3>
          <div className="bg-card border border-border/50 rounded p-4 space-y-2">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-foreground">{item.title}</span>
                <span className="text-primary">${item.price}</span>
              </div>
            ))}
            <div className="border-t border-border/50 pt-3 mt-3 space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between text-primary">
                <span>Discount (20%):</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground font-semibold pt-2 border-t border-border/50">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation */}
      {errors.bundleItems && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm">
          {errors.bundleItems}
        </div>
      )}

      {/* Pricing Model */}
      <PricingPart />
    </div>
  )
}