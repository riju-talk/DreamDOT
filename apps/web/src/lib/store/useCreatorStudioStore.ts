import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getVisibleTextLength } from '@/lib/utils'

export interface Draft {
  title: string
  thumbnailUrl: string
  script: string
  category: string
  pricingModel: 'free' | 'paid' | 'subscription'
  priceCredits: number
  subscriptionBillingCycle: 'monthly' | 'annually'
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

const getContent = (draft: Draft): string => {
  const script = (draft.script || '').trim()
  const description = (draft.description || '').trim()
  return script.length > 0 ? script : description
}

const validateDraftFunc = (draft: Draft, step: 'writer' | 'media' | 'bundle'): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}

  if (!draft.title || draft.title.trim().length === 0) {
    errors.title = 'Title is required'
  } else if (draft.title.length > 140) {
    errors.title = 'Title must be 140 characters or less'
  }

  const content = getContent(draft)
  const scriptTextLength = getVisibleTextLength(draft.script || '')
  const contentLength =
    scriptTextLength > 0 ? scriptTextLength : getVisibleTextLength(draft.description || '')
  if (!content || contentLength < 10) {
    errors.script = 'Content must be at least 10 characters'
  }

  if (!draft.category) {
    errors.category = 'Category is required'
  }

  if (draft.mediaFiles.length > 0 && !draft.thumbnailUrl) {
    errors.thumbnailUrl = 'Thumbnail is required'
  }

  if (step === 'bundle' && draft.bundleItemIds.length < 2) {
    errors.bundleItems = 'Select at least 2 items for a bundle'
  }

  if (draft.pricingModel === 'paid' && draft.priceCredits < 1) {
    errors.price = 'Price is required'
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
        subscriptionBillingCycle: 'monthly',
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
          const validation = validateDraftFunc(newDraft, state.step)
          return {
            draft: newDraft,
            errors: validation.errors,
            isValid: validation.isValid,
          }
        })
      },

      validateDraft: () => {
        const state = get()
        const validation = validateDraftFunc(state.draft, state.step)
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
            subscriptionBillingCycle: 'monthly',
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

          // Upload media files (skipping any non-File objects from persisted drafts)
          let media: Array<{ url: string; mimeType: string; size: number }> = []
          let thumbnailUrl = draft.thumbnailUrl || ''

          const validFiles = draft.mediaFiles.filter((f) => f instanceof File)
          if (validFiles.length > 0) {
            const { uploadMultipleMediaFiles } = await import('@/lib/utils/media-upload')
            const results = await uploadMultipleMediaFiles(validFiles, 'items')
            const failed = results.find((r) => !r.success)
            if (failed) {
              return { success: false, error: failed.error || 'Failed to upload media' }
            }

            media = results.map((r, i) => ({
              url: r.url || '',
              mimeType: validFiles[i].type,
              size: validFiles[i].size,
            }))

            const firstImage = results.find((r) => r.type === 'image')
            if (firstImage?.url) thumbnailUrl = firstImage.url
          }

          const response = await fetch('/api/Items/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: draft.title,
              thumbnailUrl,
              script: getContent(draft),
              category: draft.category,
              pricingModel: draft.pricingModel,
              priceCredits: draft.priceCredits,
              subscriptionBillingCycle: draft.subscriptionBillingCycle,
              description: draft.description,
              bundleItemIds: draft.bundleItemIds,
              assetType: get().step,
              media,
            }),
          })
          const data = await response.json()
          console.log('📡 API Response:', { status: response.status, data })
          
          if (!response.ok) {
            throw new Error(data.error || `API error: ${response.status}`)
          }
          
          if (!data.itemId) {
            console.error('❌ Missing itemId in response:', data)
            throw new Error('API returned success but no itemId')
          }
          
          console.log('✅ Publish success! itemId:', data.itemId)
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
