import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Draft {
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

export interface CreatorStudioState {
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

const validateDraftFunc = (draft: Draft): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}

  if (!draft.title || draft.title.trim().length === 0) {
    errors.title = 'Title is required'
  } else if (draft.title.length > 140) {
    errors.title = 'Title must be 140 characters or less'
  }

  if (!draft.script || draft.script.trim().length === 0) {
    errors.script = 'Script is required'
  } else if (draft.script.length < 10) {
    errors.script = 'Script must be at least 10 characters'
  }

  if (!draft.category) {
    errors.category = 'Category is required'
  }

  if (!draft.thumbnailUrl) {
    errors.thumbnailUrl = 'Thumbnail is required'
  }

  if (draft.pricingModel === 'bundle' && draft.bundleItemIds.length < 2) {
    errors.bundleItems = 'Select at least 2 items for a bundle'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
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
          const validation = validateDraftFunc(newDraft)
          return {
            draft: newDraft,
            errors: validation.errors,
            isValid: validation.isValid,
          }
        })
      },

      validateDraft: () => {
        const validation = validateDraftFunc(get().draft)
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
          const draft = get().draft
          const response = await fetch('/api/items/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: draft.title,
              thumbnailUrl: draft.thumbnailUrl,
              script: draft.script,
              category: draft.category,
              pricingModel: draft.pricingModel,
              priceCredits: draft.priceCredits,
              description: draft.description,
              bundleItemIds: draft.bundleItemIds,
            }),
          })
          const data = await response.json()
          if (!response.ok) throw new Error(data.error || 'Failed to publish')
          return { success: true, itemId: data.itemId }
        } catch (error: any) {
          console.error('Publish error:', error)
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
