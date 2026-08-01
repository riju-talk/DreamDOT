/**
 * Creator Studio form field validators
 * Used for validating the 3-step creator workflow
 */

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface DraftValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export interface Draft {
  title: string
  thumbnailUrl: string
  script: string
  category: string
  pricingModel: 'free' | 'paid' | 'subscription' | 'bundle'
  priceCredits: number
  mediaFiles: File[] | string[]
  bundleItemIds: string[]
  description?: string
}

/**
 * Validate title
 * Requirements: not empty, max 140 characters
 */
export const validateTitle = (title: string): ValidationResult => {
  const trimmed = title.trim()

  if (!trimmed) {
    return { isValid: false, error: 'Title is required (1-140 characters)' }
  }

  if (trimmed.length > 140) {
    return { isValid: false, error: 'Title is required (1-140 characters)' }
  }

  return { isValid: true }
}

/**
 * Validate script/content
 * Requirements: not empty, minimum 10 characters
 */
export const validateScript = (script: string): ValidationResult => {
  const trimmed = script.trim()

  if (!trimmed) {
    return { isValid: false, error: 'Script is required (min 10 characters)' }
  }

  if (trimmed.length < 10) {
    return { isValid: false, error: 'Script is required (min 10 characters)' }
  }

  return { isValid: true }
}

/**
 * Validate thumbnail URL
 * Requirements: not empty, valid URL format
 */
export const validateThumbnail = (url: string): ValidationResult => {
  const trimmed = url.trim()

  if (!trimmed) {
    return { isValid: false, error: 'Thumbnail URL is required' }
  }

  // Basic URL validation
  try {
    new URL(trimmed)
    return { isValid: true }
  } catch {
    return { isValid: false, error: 'Thumbnail URL is required' }
  }
}

/**
 * Validate entire draft object
 * Checks all required fields and returns all errors
 */
export const validateDraft = (draft: Draft): DraftValidationResult => {
  const errors: Record<string, string> = {}

  // Validate title
  const titleValidation = validateTitle(draft.title)
  if (!titleValidation.isValid) {
    errors.title = titleValidation.error || 'Title is invalid'
  }

  // Validate script
  const scriptValidation = validateScript(draft.script)
  if (!scriptValidation.isValid) {
    errors.script = scriptValidation.error || 'Script is invalid'
  }

  // Validate thumbnail
  const thumbnailValidation = validateThumbnail(draft.thumbnailUrl)
  if (!thumbnailValidation.isValid) {
    errors.thumbnailUrl = thumbnailValidation.error || 'Thumbnail URL is invalid'
  }

  // Validate category is not empty
  if (!draft.category || !draft.category.trim()) {
    errors.category = 'Category is required'
  }

  // Validate pricing model
  const validPricingModels = ['free', 'paid', 'subscription', 'bundle']
  if (!validPricingModels.includes(draft.pricingModel)) {
    errors.pricingModel = 'Invalid pricing model'
  }

  // Validate price for paid models
  if (draft.pricingModel === 'paid' || draft.pricingModel === 'subscription') {
    if (!draft.priceCredits || draft.priceCredits <= 0) {
      errors.priceCredits = 'Price must be greater than 0 for paid content'
    }
  }

  // Validate bundle has minimum 2 items if pricing is bundle
  if (draft.pricingModel === 'bundle') {
    if (!draft.bundleItemIds || draft.bundleItemIds.length < 2) {
      errors.bundleItemIds = 'Bundle must contain at least 2 items'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
