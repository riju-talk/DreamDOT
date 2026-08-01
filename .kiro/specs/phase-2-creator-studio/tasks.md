# Phase 2: Creator Studio - Task DAG

## Overview

**Spec:** Phase 2 - Creator Studio (3-Part Workflow)  
**Duration:** 2-3 hours  
**Status:** Ready for execution  
**Total Tasks:** 8

## Task Dependency Graph

```
[PHASE_2_COMPLETE] (auto-completes when all children done)
├── [STORE_TASKS]
│   ├── P2.1: Create Zustand Store
│   └── P2.2: Create Validators
├── [COMPONENT_TASKS]
│   ├── P2.3: Create Writer Component (depends on P2.1, P2.2)
│   ├── P2.4: Create Media Component (depends on P2.1, P2.2)
│   ├── P2.5: Create Bundle Component (depends on P2.1, P2.2, P2.3)
│   └── P2.6: Create Editor Components
├── [PAGE_TASKS]
│   └── P2.7: Create Main Creator Studio Page (depends on P2.3-P2.6)
└── [API_TASKS]
    └── P2.8: Create Publish API Endpoint (depends on P2.1, P2.2)
```

---

## Store Tasks

### P2.1: Create Zustand Store
- **Dependencies:** None
- **Optional:** false
- **Est. Time:** 30 min
- **Status:** not_started

**File:** `apps/web/src/lib/store/useCreatorStudioStore.ts`

**Subtasks:**
1. Create store with Zustand
2. Define state interface (draft, step, errors, etc.)
3. Add draft update actions
4. Add validation method
5. Add publish action (calls API)
6. Add persist middleware (sessionStorage)
7. Add reset action
8. Export store hook

**Acceptance Criteria:**
✅ Store creates without TypeScript errors  
✅ State updates correctly  
✅ Validation returns proper structure  
✅ Persist middleware works  

---

### P2.2: Create Validators
- **Dependencies:** None
- **Optional:** false
- **Est. Time:** 20 min
- **Status:** not_started

**File:** `apps/web/src/lib/validators/creator-studio.ts`

**Subtasks:**
1. Create validateTitle function
2. Create validateScript function
3. Create validateThumbnail function
4. Create validateDraft function (main validator)
5. Return formatted error messages
6. Export validators

**Acceptance Criteria:**
✅ All validators work correctly  
✅ Error messages are user-friendly  
✅ Returns proper ValidationResult structure  

---

## Component Tasks

### P2.3: Create Writer Component
- **Dependencies:** [P2.1, P2.2]
- **Optional:** false
- **Est. Time:** 50 min
- **Status:** not_started

**Files:**
- `apps/web/src/app/create/components/WriterPart.tsx` (new)
- `apps/web/src/components/rich-text-editor.tsx` (new/update)

**Subtasks:**
1. Create WriterPart component
2. Add title input with validation
3. Add category selector with icons
4. Integrate Tiptap rich text editor
5. Add pricing model selector
6. Add price input field
7. Add description textarea
8. Add character counters
9. Connect to Zustand store
10. Show validation errors
11. Update on blur/change events

**Acceptance Criteria:**
✅ Title validates length (1-140 chars)  
✅ Category selector works  
✅ Rich text editor functional  
✅ Pricing options display correctly  
✅ All fields update store  
✅ Validation feedback shows  
✅ NO console errors  

---

### P2.4: Create Media Component
- **Dependencies:** [P2.1, P2.2]
- **Optional:** false
- **Est. Time:** 60 min
- **Status:** not_started

**Files:**
- `apps/web/src/app/create/components/MediaPart.tsx` (new)
- `apps/web/src/components/drop-zone.tsx` (new)
- `apps/web/src/components/upload-progress.tsx` (new)

**Subtasks:**
1. Create MediaPart component
2. Create DropZone component
3. Create UploadProgress component
4. Implement file validation (type, size)
5. Integrate file upload (ImageKit or similar)
6. Show upload progress
7. Create media preview grid
8. Implement drag-to-reorder (react-dnd)
9. Add delete file buttons
10. Auto-generate thumbnail from first media
11. Connect to Zustand store
12. Show error messages for invalid files

**Acceptance Criteria:**
✅ Drag-drop works  
✅ File validation enforced (type, 50MB max)  
✅ Upload progress shows  
✅ Media grid displays  
✅ Reordering works  
✅ Thumbnail auto-generated  
✅ Delete removes file  
✅ Errors handled gracefully  

---

### P2.5: Create Bundle Component
- **Dependencies:** [P2.1, P2.2, P2.3]
- **Optional:** false
- **Est. Time:** 40 min
- **Status:** not_started

**Files:**
- `apps/web/src/app/create/components/BundlePart.tsx` (new)
- `apps/web/src/components/item-search.tsx` (new)
- `apps/web/src/components/bundle-price-calculator.tsx` (new)

**Subtasks:**
1. Create BundlePart component
2. Create ItemSearch component
3. Create BundlePricingCalculator component
4. Fetch user's items (GET /api/items?userId=[id])
5. Implement multi-select checkboxes
6. Show selected items preview
7. Calculate bundle price with discount
8. Validate minimum 2 items
9. Add remove item buttons
10. Connect to Zustand store
11. Show validation errors

**Acceptance Criteria:**
✅ Search filters items  
✅ Multi-select works  
✅ Min 2 items validation enforced  
✅ Price calculator works  
✅ Discount applied correctly  
✅ Remove button works  
✅ Store updates on selection  
✅ Validation shows errors  

---

### P2.6: Create Editor Sub-Components
- **Dependencies:** [P2.1, P2.2, P2.3, P2.4, P2.5]
- **Optional:** false
- **Est. Time:** 30 min
- **Status:** not_started

**Files:**
- `apps/web/src/components/category-select.tsx` (new)
- `apps/web/src/components/pricing-model-select.tsx` (new)
- `apps/web/src/components/char-counter.tsx` (new)

**Subtasks:**
1. Create CategorySelect component with icons
2. Create PricingModelSelect component with descriptions
3. Create CharCounter component (real-time count)
4. Add proper styling for all components
5. Use design system colors
6. Ensure accessibility (labels, aria attributes)

**Acceptance Criteria:**
✅ CategorySelect renders with icons  
✅ PricingModelSelect shows all options  
✅ CharCounter updates in real-time  
✅ All components styled correctly  
✅ Design system colors used  
✅ Accessible for keyboard/screen readers  

---

## Page Tasks

### P2.7: Create Main Creator Studio Page
- **Dependencies:** [P2.3, P2.4, P2.5, P2.6]
- **Optional:** false
- **Est. Time:** 40 min
- **Status:** not_started

**File:** `apps/web/src/app/create/page.tsx`

**Subtasks:**
1. Update page structure
2. Add tab navigation (Writer | Media | Bundle)
3. Add tab switching logic
4. Create 2-column layout (editor + preview)
5. Add preview panel showing draft
6. Add publish button (conditionally disabled)
7. Add step indicator (1 of 3)
8. Add validation status bar
9. Connect to Zustand store
10. Handle navigation between tabs
11. Ensure draft persists when switching tabs

**Acceptance Criteria:**
✅ All 3 tabs render  
✅ Tab switching works  
✅ Publish button disabled when invalid  
✅ Publish button enabled when valid  
✅ Preview updates as form changes  
✅ Draft persists on refresh  
✅ Error messages display  
✅ Step indicator accurate  

---

## API Tasks

### P2.8: Create Publish API Endpoint
- **Dependencies:** [P2.1, P2.2]
- **Optional:** false
- **Est. Time:** 40 min
- **Status:** not_started

**File:** `apps/web/src/app/api/items/create/route.js`

**Subtasks:**
1. Create POST endpoint
2. Validate request body
3. Check user authentication
4. Validate all required fields
5. Create Item in MongoDB
6. Upload media to ImageKit (if not already uploaded)
7. Store media URLs in Item
8. Handle bundle creation (if applicable)
9. Return item ID and success
10. Handle errors with proper status codes
11. Add request logging

**Acceptance Criteria:**
✅ Endpoint created  
✅ Validates request body  
✅ Creates item in database  
✅ Uploads media files  
✅ Returns proper response  
✅ Handles errors (400, 401, 500)  
✅ Logs requests  
✅ Returns itemId  

---

## Summary

| Task | Type | Dependencies | Est. Time | Status |
|------|------|--------------|-----------|--------|
| P2.1 | Store | - | 30m | not_started |
| P2.2 | Store | - | 20m | not_started |
| P2.3 | Component | P2.1, P2.2 | 50m | not_started |
| P2.4 | Component | P2.1, P2.2 | 60m | not_started |
| P2.5 | Component | P2.1, P2.2, P2.3 | 40m | not_started |
| P2.6 | Component | P2.1-P2.5 | 30m | not_started |
| P2.7 | Page | P2.3-P2.6 | 40m | not_started |
| P2.8 | API | P2.1, P2.2 | 40m | not_started |

**Total:** 310 minutes ≈ **5 hours** (with some parallel execution possible)

**Optimized with Parallelization:** ~2.5-3 hours (P2.1+P2.2 in parallel, P2.3-P2.5 in parallel, etc.)

---

## Success Criteria for Phase 2

✅ All 8 tasks complete without errors  
✅ 3-part workflow fully functional  
✅ Form validation working correctly  
✅ Publish button disabled/enabled based on validation  
✅ Draft persists across tab changes  
✅ File uploads working  
✅ Bundle requires 2+ items  
✅ API endpoint functional  
✅ Zustand store working  
✅ NO console errors  
✅ Responsive design verified  
✅ Design system colors applied  

---

## Ready to Start Phase 2

All tasks are prepared and ready for dispatch. Start with P2.1 and P2.2 (can run in parallel), then proceed to components P2.3-P2.6 (can run in parallel), then page P2.7, and finally API P2.8.

Estimated total time: **2-3 hours** with optimized parallel execution.
