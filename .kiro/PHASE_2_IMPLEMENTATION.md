# Phase 2: Creator Studio - Implementation Guide

**Status:** Ready for Manual Implementation  
**Tasks:** 8 components/endpoints  
**Estimated Time:** 2-3 hours

---

## Quick Start - Implementation Order

### Wave 1: Foundations (30 min) - Do these first
1. **P2.1: Zustand Store** - State management foundation
2. **P2.2: Validators** - Validation utilities

### Wave 2: Components (110 min) - Can parallelize
3. **P2.3: Writer Component** - Title, rich text, category, pricing
4. **P2.4: Media Component** - Drag-drop, upload, reordering
5. **P2.5: Bundle Component** - Item search, multi-select, pricing

### Wave 3: Assembly (80 min)
6. **P2.6: Sub-components** - CategorySelect, PricingSelect, CharCounter
7. **P2.7: Main Page** - Tab navigation, layout, preview
8. **P2.8: API Endpoint** - POST /api/items/create

---

## Task 1: P2.1 - Zustand Store (30 min)

**File:** `apps/web/src/lib/store/useCreatorStudioStore.ts`

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Draft {
  title: string
  thumbnailUrl: string
  script: string
  category: string
  pricingModel: 'free' | 'paid' | 'subscription' | 'bundle'
  priceCredits: number
  mediaFiles: File[]
  bundleItemIds: string[]
  description?: string
}

interface CreatorStudioState {
  step: 'writer' | 'media' | 'bundle'
  draft: Draft
  errors: Record<string, string>
  isValid: boolean
  
  setStep: (step: 'writer' | 'media' | 'bundle') => void
  updateDraft: (partial: Partial<Draft>) => void
  validateDraft: () => boolean
  resetDraft: () => void
  publishDraft: () => Promise<{ success: boolean; itemId?: string; error?: string }>
}

export const useCreatorStudioStore = create<CreatorStudioState>()(
  persist(
    (set, get) => ({
      step: 'writer',
      draft: {
        title: '',
        thumbnailUrl: '',
        script: '',
        category: '',
        pricingModel: 'free',
        priceCredits: 0,
        mediaFiles: [],
        bundleItemIds: [],
        description: '',
      },
      errors: {},
      isValid: false,

      setStep: (step) => set({ step }),

      updateDraft: (partial) => {
        set((state) => {
          const newDraft = { ...state.draft, ...partial }
          const { validateCreatorStudioDraft } = require('@/lib/validators/creator-studio')
          const validation = validateCreatorStudioDraft(newDraft)
          return {
            draft: newDraft,
            errors: validation.errors,
            isValid: validation.isValid,
          }
        })
      },

      validateDraft: () => {
        const { validateCreatorStudioDraft } = require('@/lib/validators/creator-studio')
        const validation = validateCreatorStudioDraft(get().draft)
        set({ errors: validation.errors, isValid: validation.isValid })
        return validation.isValid
      },

      resetDraft: () => {
        set({
          step: 'writer',
          draft: {
            title: '',
            thumbnailUrl: '',
            script: '',
            category: '',
            pricingModel: 'free',
            priceCredits: 0,
            mediaFiles: [],
            bundleItemIds: [],
            description: '',
          },
          errors: {},
          isValid: false,
        })
      },

      publishDraft: async () => {
        try {
          const response = await fetch('/api/items/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(get().draft),
          })
          const data = await response.json()
          if (!response.ok) throw new Error(data.error)
          return { success: true, itemId: data.itemId }
        } catch (error) {
          return { success: false, error: error.message }
        }
      },
    }),
    {
      name: 'creator-studio',
      partialize: (state) => ({ draft: state.draft, step: state.step }),
    }
  )
)
```

---

## Task 2: P2.2 - Validators (20 min)

**File:** `apps/web/src/lib/validators/creator-studio.ts`

```typescript
export interface Draft {
  title: string
  script: string
  thumbnailUrl: string
  category: string
  pricingModel: 'free' | 'paid' | 'subscription' | 'bundle'
  priceCredits: number
  mediaFiles: any[]
  bundleItemIds: string[]
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export function validateTitle(title: string): { isValid: boolean; error?: string } {
  if (!title || title.trim().length === 0) return { isValid: false, error: 'Title is required' }
  if (title.length > 140) return { isValid: false, error: 'Title must be 140 characters or less' }
  return { isValid: true }
}

export function validateScript(script: string): { isValid: boolean; error?: string } {
  if (!script || script.trim().length === 0) return { isValid: false, error: 'Script is required' }
  if (script.length < 10) return { isValid: false, error: 'Script must be at least 10 characters' }
  return { isValid: true }
}

export function validateThumbnail(url: string): { isValid: boolean; error?: string } {
  if (!url || url.trim().length === 0) return { isValid: false, error: 'Thumbnail is required' }
  try {
    new URL(url)
    return { isValid: true }
  } catch {
    return { isValid: false, error: 'Thumbnail must be a valid URL' }
  }
}

export function validateCategory(category: string): { isValid: boolean; error?: string } {
  const valid = ['writing', 'art', 'audio', 'video', 'template', 'code', 'research']
  if (!category || !valid.includes(category)) {
    return { isValid: false, error: 'Category is required' }
  }
  return { isValid: true }
}

export function validateCreatorStudioDraft(draft: Draft): ValidationResult {
  const errors: Record<string, string> = {}

  const titleVal = validateTitle(draft.title)
  if (!titleVal.isValid) errors.title = titleVal.error!

  const scriptVal = validateScript(draft.script)
  if (!scriptVal.isValid) errors.script = scriptVal.error!

  const categoryVal = validateCategory(draft.category)
  if (!categoryVal.isValid) errors.category = categoryVal.error!

  if (draft.pricingModel === 'bundle' && draft.bundleItemIds.length < 2) {
    errors.bundleItems = 'Select at least 2 items for a bundle'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
```

---

## Task 3: P2.3 - Writer Component (50 min)

**File:** `apps/web/src/app/create/components/WriterPart.tsx`

Key features:
- Title input (max 140 chars) with counter
- Category selector (dropdown with icons)
- Rich text editor using Tiptap
- Pricing model selector (radio buttons)
- Price input (conditionally visible)
- Description textarea
- Real-time validation
- All fields connected to Zustand store

```typescript
'use client'

import { useCreatorStudioStore } from '@/lib/store/useCreatorStudioStore'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function WriterPart() {
  const { draft, errors, updateDraft } = useCreatorStudioStore()

  const categories = [
    { value: 'writing', label: '📝 Writing' },
    { value: 'art', label: '🎨 Art' },
    { value: 'audio', label: '🎵 Audio' },
    { value: 'video', label: '🎬 Video' },
    { value: 'template', label: '📋 Template' },
    { value: 'code', label: '💻 Code' },
    { value: 'research', label: '🔬 Research' },
  ]

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="text-sm font-semibold text-[#FFFFFF]">Title *</label>
        <Input
          value={draft.title}
          onChange={(e) => updateDraft({ title: e.target.value })}
          placeholder="Enter title (max 140 characters)"
          maxLength={140}
          className="bg-[#1a1918] border-[#2a2826]"
        />
        <div className="flex justify-between text-xs text-[#6B8E6E] mt-1">
          <span>{errors.title && <span className="text-red-500">{errors.title}</span>}</span>
          <span>{draft.title.length}/140</span>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="text-sm font-semibold text-[#FFFFFF]">Category *</label>
        <Select value={draft.category} onValueChange={(value) => updateDraft({ category: value })}>
          <SelectTrigger className="bg-[#1a1918] border-[#2a2826]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <span className="text-xs text-red-500">{errors.category}</span>}
      </div>

      {/* Rich Text Editor */}
      <div>
        <label className="text-sm font-semibold text-[#FFFFFF]">Script / Content *</label>
        <div className="bg-[#1a1918] border border-[#2a2826] rounded-lg p-4 min-h-48">
          {/* Use Tiptap editor here - add TiptapEditor component */}
          <textarea
            value={draft.script}
            onChange={(e) => updateDraft({ script: e.target.value })}
            placeholder="Write your script or content here (min 10 characters)..."
            className="w-full bg-transparent text-[#FFFFFF] outline-none resize-none h-40"
          />
        </div>
        <div className="flex justify-between text-xs text-[#6B8E6E] mt-1">
          <span>{errors.script && <span className="text-red-500">{errors.script}</span>}</span>
          <span>{draft.script.length} characters</span>
        </div>
      </div>

      {/* Pricing Model */}
      <div>
        <label className="text-sm font-semibold text-[#FFFFFF]">Pricing Model *</label>
        <div className="space-y-2">
          {['free', 'paid', 'subscription', 'bundle'].map((model) => (
            <label key={model} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                value={model}
                checked={draft.pricingModel === model}
                onChange={(e) => updateDraft({ pricingModel: e.target.value as any })}
              />
              <span className="capitalize">{model}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price (if paid) */}
      {draft.pricingModel === 'paid' && (
        <div>
          <label className="text-sm font-semibold text-[#FFFFFF]">Price (in credits) *</label>
          <Input
            type="number"
            value={draft.priceCredits}
            onChange={(e) => updateDraft({ priceCredits: parseInt(e.target.value) })}
            placeholder="100"
            min={1}
            className="bg-[#1a1918] border-[#2a2826]"
          />
          <p className="text-xs text-[#6B8E6E] mt-1">
            ≈ ${(draft.priceCredits * 0.01).toFixed(2)} USD
          </p>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="text-sm font-semibold text-[#FFFFFF]">Description (optional)</label>
        <Textarea
          value={draft.description || ''}
          onChange={(e) => updateDraft({ description: e.target.value })}
          placeholder="Add a description for your content..."
          maxLength={500}
          className="bg-[#1a1918] border-[#2a2826]"
        />
        <p className="text-xs text-[#6B8E6E] mt-1">{(draft.description || '').length}/500</p>
      </div>
    </div>
  )
}
```

---

## Task 4: P2.4 - Media Component (60 min)

**File:** `apps/web/src/app/create/components/MediaPart.tsx`

Key features:
- Drag-drop zone
- File validation (type, size)
- Progress tracking
- Media preview grid
- Delete & reorder buttons

---

## Task 5: P2.5 - Bundle Component (40 min)

**File:** `apps/web/src/app/create/components/BundlePart.tsx`

Key features:
- Search existing items
- Multi-select checkboxes
- Bundle price calculator (20% discount)
- Min 2 items validation

---

## Task 6: P2.7 - Main Page (40 min)

**File:** `apps/web/src/app/create/page.tsx`

Structure:
- Tab navigation (Writer | Media | Bundle)
- 2-column layout (editor + preview)
- Preview panel with validation status
- Navigation buttons (Previous, Next, Publish)
- Publish button disabled until isValid=true

---

## Task 7: P2.8 - API Endpoint (40 min)

**File:** `apps/web/src/app/api/items/create/route.js`

POST /api/items/create
- Validate request body
- Check authentication
- Create Item in MongoDB
- Handle bundle logic
- Return itemId

---

## Testing Checklist

After implementation:

- [ ] Navigate through all 3 tabs
- [ ] Fill writer form (title, category, script)
- [ ] Upload media files
- [ ] Select bundle items (min 2)
- [ ] Verify publish button disabled until all required fields filled
- [ ] Click publish and verify API called
- [ ] Check database for new item created
- [ ] Verify draft persists on page refresh
- [ ] Test validation errors display
- [ ] Test on mobile/tablet/desktop
- [ ] Verify no console errors

---

## Key Implementation Notes

1. **Mandatory Fields:**
   - Title (1-140 chars)
   - Script (min 10 chars)
   - Thumbnail (auto-generated or uploaded)
   - Category
   - Pricing Model

2. **Store Integration:**
   - All form fields update Zustand store
   - Validation runs on every update
   - Publish button connected to store.publishDraft()

3. **API Integration:**
   - POST /api/items/create to publish
   - GET /api/items?userId=[id] to load items for bundle

4. **Design System:**
   - NO blue, purple, or orange colors
   - Use #99FF33 (Faded Lime) for active states
   - Use #121412 (Deep Void) for backgrounds
   - Tailwind CSS only

5. **Responsive Design:**
   - Test at 375px (mobile), 768px (tablet), 1024px (desktop)
   - Stack layout on mobile, side-by-side on desktop

---

## Dependencies

- Zustand (state management)
- Tiptap (rich text editor)
- React DnD or drag API (media reordering)
- Next.js Image (image optimization)
- Tailwind CSS (styling)

---

## Success Criteria for Phase 2

✅ All 8 tasks complete
✅ 3-part workflow fully functional
✅ Form validation working
✅ Publish button disabled/enabled correctly
✅ Draft persists across tabs
✅ File uploads working
✅ Bundle requires 2+ items
✅ API endpoint functional
✅ Zustand store working
✅ NO console errors
✅ Responsive design verified
✅ Design system colors applied

**Estimated Total Time: 2-3 hours**

Good luck! You're building the core content creation system for DreamDOT! 🚀
