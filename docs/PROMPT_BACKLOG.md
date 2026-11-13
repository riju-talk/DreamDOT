# Prompt Backlog & Task Tracker

## Current Status
- Created OAuth authentication system with Google, GitHub, Discord providers (OAuthButtons.tsx)
- Implemented LandingPage component with full UI design (landing-page.tsx)
- Updated web application structure and components (app-sidebar.tsx, chat-sidebar.tsx, top-nav.tsx, etc.)
- Fixed authentication flow and user session management
- Modified several key pages (register, signin, feed, marketplace, messages)
- Integrated chat context system for real-time messaging

## Known Bugs/Debt
- LandingPage component shows significant code duplication with unified-home.tsx
- OAuth system lacks proper error handling for rate limiting scenarios
- Chat integration may have missing message persistence
- No Creator Studio components (Writer/Media/Bundle) implemented yet
- Text-only community/server infrastructure not built
- DRM/Vault viewer not implemented
- No mandatory field validation (Title, Thumbnail, Script) for creator content
- Ad Studio for Meta integration missing
- Web3/blockchain minting components not present
- Credit economy system needs full implementation
- No analytics or user management features

## The Next Prompt
**Task:** Implement the Creator Studio - A 3-part workspace (Writer/Media/Bundle) with mandatory field validation (Title, Thumbnail, Script). Follow the exact workflow described in the PRD:

1. **Writer's Part:** Build a minimal, fast rich-text editor (Quill/Tiptap) for blogs, scripts, and descriptions - enforce 100ms load time
2. **Media Part:** Create drag-and-drop media uploader with 50MB cap and MIME validation using ImageKit
3. **Bundle Part:** Build UI to select existing items from library and group them into sellable bundles
4. **Validation:** Disable "Publish" button until Title, Thumbnail, AND Script are filled, regardless of item type
5. **Integration:** Connect this to the /create page (apps/web/src/app/create/page.tsx) and ensure data flows to MongoDB Item schema
6. **Files to modify:** Look at existing unified-home.tsx and OAuthButtons.tsx for code patterns and architectural approach

**Dependencies to consider:** The ItemSchema in apps/database-mongo already has the required fields (title, thumbnailUrl, script, media array, bundleItems). Make sure your Creator Studio enforces these exactly.

**Goal:** Complete Creator Studio in <3 days to hit the MVP deadline. Focus on making the rich-text editor fast (<100ms) and the bundle functionality simple for creators.