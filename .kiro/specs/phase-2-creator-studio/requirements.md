# Phase 2: Creator Studio - Requirements

**Phase Duration:** 2-3 hours  
**Status:** Ready to start  
**Complexity:** High - 3-part workflow with validation

## Overview

The Creator Studio is a mandatory 3-step workflow for creators to publish digital content. Each step is required and builds upon the previous, with strict validation ensuring data completeness.

## Workflow Steps

### Step 1: Writer (Content)
- Write/paste content/script
- Add title (max 140 chars)
- Select category
- Set pricing model
- Enter price in credits
- Optional: description

### Step 2: Media (Files)
- Upload media files (images, video, audio)
- Arrange media order
- Auto-generate thumbnail from first media
- Support drag-and-drop
- Show upload progress

### Step 3: Bundle (Grouping)
- Select 2+ existing items
- Set bundle price
- Review bundle contents
- Calculate discount

## Mandatory Fields (Publish Disabled Until All Filled)

1. **Title** (Required)
   - Min: 1 char, Max: 140 chars
   - Type: text
   - Validation: not empty, not too long

2. **Thumbnail** (Required)
   - Format: image URL or auto-generated from first media
   - Validation: must exist, must be accessible

3. **Script/Content** (Required)
   - Min: 10 chars, Max: unlimited
   - Format: rich text or plain text
   - Validation: not empty, minimum length

## Feature Requirements

### Writer Component
- Title input field with character counter
- Rich text editor using Tiptap
- Category selector with visual icons
- Pricing model selector (free, paid, subscription, bundle)
- Price input field (in credits)
- Description textarea (optional)
- Real-time validation feedback
- Error messages for invalid fields

### Media Component
- Drag-and-drop file upload zone
- Multiple file selection support
- File type validation (jpg, png, gif, mp4, webm, mp3, wav, pdf, etc.)
- Max 50MB per file
- Upload progress bar
- Media preview grid
- Reorder capability (drag to rearrange)
- Delete individual files
- Auto-thumbnail generation from first image
- Cancel upload button

### Bundle Component
- Search interface for existing items
- Multi-select with checkboxes
- Minimum 2 items required
- Show selected items with previews
- Display bundle price
- Calculate discount (e.g., 20% off)
- Remove item button
- Validation error if <2 items

### Main Page
- 3 tabs (Writer | Media | Bundle)
- Tab navigation bar
- Content area for active tab
- Preview panel showing draft
- Publish button (disabled while invalid)
- Validation status indicator
- Progress indicator (step 1 of 3)

## State Management

**Zustand Store:** `useCreatorStudioStore`

```typescript
{
  // Current step
  step: 'writer' | 'media' | 'bundle'
  
  // Form data
  draft: {
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
  
  // Validation state
  errors: Record<string, string>
  isValid: boolean
  
  // Methods
  setStep: (step) => void
  updateDraft: (partial) => void
  validateStep: (step) => boolean
  publish: () => Promise<{ success, itemId }>
}
```

## API Endpoint

**Endpoint:** `POST /api/items/create`

**Request:**
```json
{
  "title": "My Digital Art",
  "thumbnailUrl": "https://...",
  "script": "This is my artwork...",
  "category": "art",
  "pricingModel": "paid",
  "priceCredits": 100,
  "mediaUrls": ["https://...", "https://..."],
  "description": "Optional description",
  "bundleItemIds": []
}
```

**Response:**
```json
{
  "success": true,
  "itemId": "uuid",
  "createdAt": "ISO date",
  "message": "Item published successfully"
}
```

## Design Requirements

- All components use design system colors (no blue/purple/orange)
- Rich text editor matches Manrope + Noto Serif typography
- Dark mode fully supported
- Responsive design (375px, 768px, 1024px)
- Smooth transitions between tabs
- Clear validation feedback
- Accessible form inputs
- Loading states for uploads
- Error states with recovery options

## Acceptance Criteria

- ✅ All 3 steps implemented
- ✅ Tab navigation works
- ✅ Form validation real-time
- ✅ Publish button disabled when invalid
- ✅ Publish button enabled when all required fields filled
- ✅ File uploads work with progress
- ✅ Draft persists across tabs
- ✅ Media reordering works
- ✅ Bundle requires 2+ items
- ✅ API endpoint functional
- ✅ Zustand store working
- ✅ NO console errors
- ✅ Responsive at all breakpoints
- ✅ Design system colors only
