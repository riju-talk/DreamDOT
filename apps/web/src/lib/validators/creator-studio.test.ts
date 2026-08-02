/**
 * Unit tests for Creator Studio validators
 */

import {
  validateTitle,
  validateScript,
  validateThumbnail,
  validateDraft,
  Draft
} from './creator-studio'

describe('Creator Studio Validators', () => {
  describe('validateTitle', () => {
    it('should validate a valid title', () => {
      const result = validateTitle('My Amazing Content')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject empty title', () => {
      const result = validateTitle('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Title is required (1-140 characters)')
    })

    it('should reject whitespace-only title', () => {
      const result = validateTitle('   ')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Title is required (1-140 characters)')
    })

    it('should accept single character title', () => {
      const result = validateTitle('A')
      expect(result.isValid).toBe(true)
    })

    it('should accept 140 character title', () => {
      const title = 'a'.repeat(140)
      const result = validateTitle(title)
      expect(result.isValid).toBe(true)
    })

    it('should reject title longer than 140 characters', () => {
      const title = 'a'.repeat(141)
      const result = validateTitle(title)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Title is required (1-140 characters)')
    })

    it('should trim whitespace from title', () => {
      const result = validateTitle('  Valid Title  ')
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateScript', () => {
    it('should validate a valid script', () => {
      const result = validateScript('This is a valid script content with enough characters')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject empty script', () => {
      const result = validateScript('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Script is required (min 10 characters)')
    })

    it('should reject whitespace-only script', () => {
      const result = validateScript('     ')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Script is required (min 10 characters)')
    })

    it('should reject script with less than 10 characters', () => {
      const result = validateScript('123456789')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Script is required (min 10 characters)')
    })

    it('should accept script with exactly 10 characters', () => {
      const result = validateScript('1234567890')
      expect(result.isValid).toBe(true)
    })

    it('should accept long script', () => {
      const longScript = 'a'.repeat(1000)
      const result = validateScript(longScript)
      expect(result.isValid).toBe(true)
    })

    it('should trim whitespace from script', () => {
      const result = validateScript('  1234567890  ')
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateThumbnail', () => {
    it('should validate a valid URL', () => {
      const result = validateThumbnail('https://example.com/image.jpg')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should validate HTTP URL', () => {
      const result = validateThumbnail('http://example.com/image.png')
      expect(result.isValid).toBe(true)
    })

    it('should reject empty URL', () => {
      const result = validateThumbnail('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Thumbnail URL is required')
    })

    it('should reject whitespace-only URL', () => {
      const result = validateThumbnail('    ')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Thumbnail URL is required')
    })

    it('should reject invalid URL format', () => {
      const result = validateThumbnail('not a url')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Thumbnail URL is required')
    })

    it('should reject URL without protocol', () => {
      const result = validateThumbnail('example.com/image.jpg')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Thumbnail URL is required')
    })

    it('should trim whitespace from URL', () => {
      const result = validateThumbnail('  https://example.com/image.jpg  ')
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateDraft', () => {
    const validDraft: Draft = {
      title: 'Valid Title',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      script: 'This is a valid script with enough characters',
      category: 'Education',
      pricingModel: 'free',
      priceCredits: 0,
      mediaFiles: [],
      bundleItemIds: []
    }

    it('should validate a complete valid draft', () => {
      const result = validateDraft(validDraft)
      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors).length).toBe(0)
    })

    it('should return errors for invalid title', () => {
      const draft = { ...validDraft, title: '' }
      const result = validateDraft(draft)
      expect(result.isValid).toBe(false)
      expect(result.errors.title).toBe('Title is required (1-140 characters)')
    })

    it('should return errors for invalid script', () => {
      const draft = { ...validDraft, script: 'short' }
      const result = validateDraft(draft)
      expect(result.isValid).toBe(false)
      expect(result.errors.script).toBe('Script is required (min 10 characters)')
    })

    it('should return errors for invalid thumbnail', () => {
      const draft = { ...validDraft, thumbnailUrl: 'invalid' }
      const result = validateDraft(draft)
      expect(result.isValid).toBe(false)
      expect(result.errors.thumbnailUrl).toBe('Thumbnail URL is required')
    })

    it('should return errors for missing category', () => {
      const draft = { ...validDraft, category: '' }
      const result = validateDraft(draft)
      expect(result.isValid).toBe(false)
      expect(result.errors.category).toBe('Category is required')
    })

    it('should return errors for invalid pricing model', () => {
      const draft = { ...validDraft, pricingModel: 'invalid' as any }
      const result = validateDraft(draft)
      expect(result.isValid).toBe(false)
      expect(result.errors.pricingModel).toBe('Invalid pricing model')
    })

    it('should return errors for paid model without price', () => {
      const draft = { ...validDraft, pricingModel: 'paid', priceCredits: 0 }
      const result = validateDraft(draft)
      expect(result.isValid).toBe(false)
      expect(result.errors.priceCredits).toBe('Price must be greater than 0 for paid content')
    })

    it('should return errors for subscription model without price', () => {
      const draft = { ...validDraft, pricingModel: 'subscription', priceCredits: 0 }
      const result = validateDraft(draft)
      expect(result.isValid).toBe(false)
      expect(result.errors.priceCredits).toBe('Price must be greater than 0 for paid content')
    })

    it('should accept paid model with valid price', () => {
      const draft = { ...validDraft, pricingModel: 'paid', priceCredits: 100 }
      const result = validateDraft(draft)
      expect(result.isValid).toBe(true)
      expect(result.errors.priceCredits).toBeUndefined()
    })

    it('should return errors for bundle with less than 2 items', () => {
      const draft = { ...validDraft, pricingModel: 'bundle', bundleItemIds: ['item1'] }
      const result = validateDraft(draft)
      expect(result.isValid).toBe(false)
      expect(result.errors.bundleItemIds).toBe('Bundle must contain at least 2 items')
    })

    it('should accept bundle with 2 or more items', () => {
      const draft = { ...validDraft, pricingModel: 'bundle', bundleItemIds: ['item1', 'item2'] }
      const result = validateDraft(draft)
      expect(result.isValid).toBe(true)
      expect(result.errors.bundleItemIds).toBeUndefined()
    })

    it('should accept free pricing model', () => {
      const draft = { ...validDraft, pricingModel: 'free' }
      const result = validateDraft(draft)
      expect(result.isValid).toBe(true)
    })

    it('should return multiple errors at once', () => {
      const draft: Draft = {
        title: '',
        thumbnailUrl: 'invalid',
        script: 'short',
        category: '',
        pricingModel: 'free',
        priceCredits: 0,
        mediaFiles: [],
        bundleItemIds: []
      }
      const result = validateDraft(draft)
      expect(result.isValid).toBe(false)
      expect(Object.keys(result.errors).length).toBeGreaterThan(1)
      expect(result.errors.title).toBeDefined()
      expect(result.errors.script).toBeDefined()
      expect(result.errors.thumbnailUrl).toBeDefined()
      expect(result.errors.category).toBeDefined()
    })
  })
})

// Mock expect function for running without a test framework
function expect(value: any) {
  return {
    toBe: (expected: any) => {
      if (value !== expected) {
        throw new Error(`Expected ${expected}, got ${value}`)
      }
    },
    toBeUndefined: () => {
      if (value !== undefined) {
        throw new Error(`Expected undefined, got ${value}`)
      }
    },
    toBeDefined: () => {
      if (value === undefined) {
        throw new Error(`Expected defined value, got undefined`)
      }
    },
    toBeGreaterThan: (expected: number) => {
      if (typeof value !== 'number' || value <= expected) {
        throw new Error(`Expected > ${expected}, got ${value}`)
      }
    }
  }
}

function describe(name: string, fn: () => void) {
  console.log(`\n${name}`)
  fn()
}

function it(name: string, fn: () => void) {
  try {
    fn()
    console.log(`  ✓ ${name}`)
  } catch (err: any) {
    console.error(`  ✗ ${name}: ${err.message}`)
  }
}
