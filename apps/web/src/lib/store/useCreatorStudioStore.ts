import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CreatorStudioDraft {
  title: string
  thumbnailUrl: string
  script: string
  category: string
  pricingModel: "free" | "paid" | "subscription" | "bundle"
  priceCredits: number
  mediaUrls: string[]
  bundleItemIds: string[]
  description: string
}

interface CreatorStudioState {
  step: "writer" | "media" | "bundle"
  draft: CreatorStudioDraft
  isPublishing: boolean
  error: string | null

  // Actions
  setStep: (step: "writer" | "media" | "bundle") => void
  updateDraft: (data: Partial<CreatorStudioDraft>) => void
  resetDraft: () => void
  setIsPublishing: (value: boolean) => void
  setError: (error: string | null) => void

  // Validation
  validateDraft: () => boolean
  getValidationErrors: () => Record<string, string>
}

const defaultDraft: CreatorStudioDraft = {
  title: "",
  thumbnailUrl: "",
  script: "",
  category: "",
  pricingModel: "free",
  priceCredits: 0,
  mediaUrls: [],
  bundleItemIds: [],
  description: "",
}

export const useCreatorStudioStore = create<CreatorStudioState>()(
  persist(
    (set, get) => ({
      step: "writer",
      draft: defaultDraft,
      isPublishing: false,
      error: null,

      setStep: (step) => set({ step }),

      updateDraft: (data) =>
        set((state) => ({
          draft: { ...state.draft, ...data },
        })),

      resetDraft: () =>
        set({
          draft: defaultDraft,
          step: "writer",
          error: null,
        }),

      setIsPublishing: (value) => set({ isPublishing: value }),

      setError: (error) => set({ error }),

      validateDraft: () => {
        const state = get()
        const errors = state.getValidationErrors()
        return Object.keys(errors).length === 0
      },

      getValidationErrors: () => {
        const { draft } = get()
        const errors: Record<string, string> = {}

        // Mandatory fields
        if (!draft.title || draft.title.trim().length === 0) {
          errors.title = "Title is required"
        } else if (draft.title.length > 140) {
          errors.title = "Title must be 140 characters or less"
        }

        if (!draft.thumbnailUrl || draft.thumbnailUrl.trim().length === 0) {
          errors.thumbnailUrl = "Thumbnail is required"
        }

        if (!draft.script || draft.script.trim().length < 10) {
          errors.script = "Script/Description is required (min 10 characters)"
        }

        if (!draft.category || draft.category.trim().length === 0) {
          errors.category = "Category is required"
        }

        // Conditional validations
        if (draft.pricingModel === "paid" && draft.priceCredits <= 0) {
          errors.priceCredits = "Price must be greater than 0 for paid items"
        }

        if (draft.pricingModel === "bundle") {
          if (draft.bundleItemIds.length < 2) {
            errors.bundleItems = "Bundle must contain at least 2 items"
          }
          if (draft.priceCredits <= 0) {
            errors.bundlePrice = "Bundle price must be greater than 0"
          }
        }

        return errors
      },
    }),
    {
      name: "creator-studio-draft",
      storage: typeof window !== "undefined"
        ? {
            getItem: (name) => {
              const item = sessionStorage.getItem(name)
              return item ? JSON.parse(item) : null
            },
            setItem: (name, value) => {
              sessionStorage.setItem(name, JSON.stringify(value))
            },
            removeItem: (name) => {
              sessionStorage.removeItem(name)
            },
          }
        : undefined,
    }
  )
)

console.log("[Store] useCreatorStudioStore initialized")
