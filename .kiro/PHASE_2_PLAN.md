# Phase 2: Creator Studio (3-Part Workflow)

**Duration:** Estimated 2-3 hours  
**Priority:** HIGH - Critical for creator functionality

---

## Overview

The Creator Studio is a **3-part mandatory workflow**:
1. **Writer Part:** Rich text editor for scripts/content
2. **Media Part:** Upload and arrange media files
3. **Bundle Part:** Select existing items to group

**Key Rule:** Title, Thumbnail, and Script are MANDATORY before publishing.

---

## Task 2.1: Create Creator Studio Main Page
**File:** `apps/web/src/app/create/page.tsx`

**Structure:**
```
CreatorStudio (main container)
├── Tab Navigation (Writer | Media | Bundle)
├── EditorPanel (changes based on tab)
├── PreviewPanel (shows current draft)
├── PublishButton (disabled until all required fields filled)
└── StatusBar (validation messages)
```

**Implementation:**
1. Create page component with Zustand store integration
2. Add tab state management
3. Create layout with 2-column (editor + preview)
4. Add validation logic
5. Connect to Zustand `useCreatorStudioStore`

**Dependencies:**
- Zustand store: `useCreatorStudioStore`
- All 3 part components
- Validation utility

---

## Task 2.2: Create Writer Part Component
**File:** `apps/web/src/app/create/components/WriterPart.tsx`

**Fields:**
- Title input (max 140 chars, required)
- Category selector (blog, comic, video, audio, art, etc.)
- Script/Content (rich text, required)
- Pricing model selector (free, paid, subscription, bundle)
- Price input (in credits)
- Description (optional)

**Implementation:**
1. Create form with validation
2. Integrate Tiptap for rich text
3. Add character counter
4. Add category icons
5. Update Zustand store on change
6. Show validation errors

**Components Needed:**
- TiptapEditor (wrapper)
- CategorySelect (dropdown with icons)
- PricingModel (radio buttons)
- CharacterCounter

---

## Task 2.3: Create Media Part Component
**File:** `apps/web/src/app/create/components/MediaPart.tsx`

**Features:**
- Drag-and-drop upload zone
- Multiple file selection
- File type validation (jpg, png, gif, mp4, etc.)
- Max 50MB per file
- Upload progress indicator
- Rearrange media (drag to reorder)
- Preview grid
- Delete individual files
- Auto-generate thumbnail from first media

**Implementation:**
1. Create drop zone component
2. Integrate with ImageKit API
3. Add progress tracking
4. Implement reordering (react-dnd)
5. Generate thumbnail automatically
6. Store in Zustand

**Components Needed:**
- DropZone
- FileUploadProgress
- MediaGrid
- MediaPreview

**Dependencies:**
- ImageKit SDK
- react-dnd (reordering)
- File validation library

---

## Task 2.4: Create Bundle Part Component
**File:** `apps/web/src/app/create/components/BundlePart.tsx`

**Features:**
- Search existing user's items
- Multi-select items
- Show selected items with preview
- Set bundle price
- Remove items from bundle
- Bundle must have 2+ items
- Show discount percentage

**Implementation:**
1. Create search interface
2. Fetch user's items from API
3. Multi-select UI with checkboxes
4. Show bundle price calculator
5. Discount logic (e.g., 20% off bundle)
6. Validation (min 2 items)

**Components Needed:**
- ItemSearchInput
- ItemSelectList
- SelectedItemsPreview
- BundlePricingCalculator

**Dependencies:**
- API endpoint: `GET /api/items?userId=[id]`
- Search utility

---

## Task 2.5: Create Zustand Store for Creator Studio
**File:** `apps/web/src/lib/store/useCreatorStudioStore.ts`

**State:**
```typescript
interface CreatorStudioState {
  step: 'writer' | 'media' | 'bundle'
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
  setStep: (step) => void
  updateDraft: (data) => void
  resetDraft: () => void
  validateDraft: () => boolean
  publishDraft: async () => void
}
```

**Implementation:**
1. Create store with persist middleware
2. Add persistence to sessionStorage
3. Implement validation logic
4. Add publish action (API call)
5. Handle errors gracefully

---

## Task 2.6: Create Validation Utility
**File:** `apps/web/src/lib/validators/creator-studio.ts`

**Validations:**
```typescript
export function validateCreatorStudioDraft(draft) {
  return {
    isValid: boolean,
    errors: {
      title?: string
      thumbnailUrl?: string
      script?: string
      category?: string
      media?: string
    }
  }
}
```

**Rules:**
- Title: required, 1-140 chars
- ThumbnailUrl: required, valid URL
- Script: required, min 10 chars
- Category: required
- Media: at least 1 file for non-blog items
- Bundle: min 2 items if pricing model is 'bundle'

---

## Task 2.7: Create API Endpoint for Publishing
**File:** `apps/web/src/app/api/items/create/route.js`

**Endpoint:** `POST /api/items/create`

**Input:**
```json
{
  "title": "string",
  "thumbnailUrl": "string",
  "script": "string",
  "category": "string",
  "pricingModel": "string",
  "priceCredits": "number",
  "mediaUrls": ["string"],
  "bundleItemIds": ["string"],
  "description": "string"
}
```

**Implementation:**
1. Validate request body
2. Create Item in Prisma
3. Create Item in MongoDB
4. Upload media to ImageKit (if not already uploaded)
5. Return item ID
6. Handle errors

**Response:**
```json
{
  "success": true,
  "itemId": "string",
  "message": "Item published successfully"
}
```

---

## Task 2.8: Update UI Components for Writer Part
**File:** `components/rich-text-editor.tsx`

**Enhancements:**
- Replace with Tiptap integration
- Add formatting toolbar (bold, italic, link, etc.)
- Add character count
- Add placeholder text
- Ensure Manrope font
- Add dark mode support

---

## Acceptance Criteria

✅ All 3 tabs render correctly  
✅ Form validation works (errors show/hide)  
✅ Publish button disabled until all required fields filled  
✅ Draft persists across tab changes  
✅ Zustand store working correctly  
✅ API endpoint working  
✅ File uploads working  
✅ Bundle selection working  
✅ No console errors  

---

## Testing Checklist

- [ ] Navigate through all 3 tabs
- [ ] Fill form with valid data
- [ ] Try to publish with missing title (should fail)
- [ ] Try to publish with missing thumbnail (should fail)
- [ ] Try to publish with missing script (should fail)
- [ ] Upload multiple media files
- [ ] Reorder media files
- [ ] Create bundle with 2+ items
- [ ] Verify draft persists on refresh
- [ ] Verify publish creates item in DB
- [ ] Test error handling

