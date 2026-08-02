'use client'

import { useCreatorStudioStore } from '@/lib/store/useCreatorStudioStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'

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
        // Mock data - in production, fetch from API
        const mockItems: BundleItem[] = [
          { id: '1', title: 'Item 1', price: 50, category: 'writing' },
          { id: '2', title: 'Item 2', price: 75, category: 'art' },
          { id: '3', title: 'Item 3', price: 100, category: 'video' },
          { id: '4', title: 'Item 4', price: 60, category: 'audio' },
        ]
        setItems(mockItems)
        setFilteredItems(mockItems)
      } catch (error) {
        console.error('Failed to fetch items:', error)
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
        <Label className="text-[#FFFFFF]">Search Items</Label>
        <Input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by title..."
          className="bg-[#1a1918] border-[#2a2826] text-[#FFFFFF] mt-2"
        />
      </div>

      {/* Available Items */}
      {loading ? (
        <p className="text-[#6B8E6E]">Loading items...</p>
      ) : (
        <div>
          <h3 className="text-[#FFFFFF] font-semibold mb-3">Available Items ({filteredItems.length})</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredItems.map((item) => (
              <label key={item.id} className="flex items-center gap-3 p-3 bg-[#1a1918] border border-[#2a2826] rounded cursor-pointer hover:border-[#99FF33] transition-colors">
                <Checkbox
                  checked={draft.bundleItemIds.includes(item.id)}
                  onCheckedChange={() => toggleItem(item.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[#FFFFFF] truncate text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-[#6B8E6E]">{item.category}</p>
                </div>
                <span className="text-[#99FF33] font-semibold text-sm whitespace-nowrap">${item.price}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Selected Items */}
      {selectedItems.length > 0 && (
        <div>
          <h3 className="text-[#FFFFFF] font-semibold mb-3">Selected Items ({selectedItems.length})</h3>
          <div className="bg-[#1a1918] border border-[#2a2826] rounded p-4 space-y-2">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-[#FFFFFF]">{item.title}</span>
                <span className="text-[#99FF33]">${item.price}</span>
              </div>
            ))}
            <div className="border-t border-[#2a2826] pt-3 mt-3 space-y-1">
              <div className="flex justify-between text-[#6B8E6E]">
                <span>Subtotal:</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between text-[#99FF33]">
                <span>Discount (20%):</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#FFFFFF] font-semibold pt-2 border-t border-[#2a2826]">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation */}
      {draft.pricingModel === 'bundle' && draft.bundleItemIds.length < 2 && (
        <div className="p-3 bg-red-900/20 border border-red-700/50 rounded text-red-400 text-sm">Select at least 2 items for a bundle</div>
      )}

      {errors.bundleItems && <div className="text-xs text-red-500">{errors.bundleItems}</div>}
    </div>
  )
}
